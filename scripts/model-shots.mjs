/**
 * P0 模型视觉验收截图（T9）
 * 用法：node scripts/model-shots.mjs [baseUrl]
 * 前置：npm run dev（或 preview）已在 baseUrl 运行
 * 产出：.audit/p0-<slug>-<view>.png、p0-<slug>-layers.png、p0-<slug>-m375.png
 * 依赖本机 Chrome/Edge + Node 22+ 内置 WebSocket（同 audit.mjs）
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PORT = 9340;
const OUT_DIR = path.resolve(".audit");
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const TARGETS = [
  {
    slug: "room-pillar",
    url: "/methods/open-stope/room-pillar/",
    views: ["iso", "plan", "long", "cross"],
    junctions: [
      // 从联络横巷内部看向运巷——证明岔口开放、运巷贯通
      ['junc-transport', [1.1, -2.2, -26.3], [-0.6, -9.2, -30.9], ['通风']],
      // 运巷内部沿走向看（偏离轴线避开风流箭头）
      ['interior-transport', [-14, -6, -30], [12, -9.5, -31]],
      // 从采空区看切割平巷岔口（上山口）
      ['junc-cutdrift', [0, 2, -22], [0, 1.5, -26]],
      // 从运巷内部仰视溜井落底口
      ['junc-raise', [0, -11, -30.5], [0, -2, -26.5]],
    ],
  },
  {
    slug: "sublevel-caving-no-pillar",
    url: "/methods/caving/sublevel-caving-no-pillar/",
    views: ["iso", "long", "cross", "zoom"],
    junctions: [
      // 从阶段运巷内部仰视溜井顶拱岔口
      ['junc-haulage', [44, 26, 12], [33, 1, 3]],
      // 分段巷道内部看左帮进路口
      ['junc-sublevel', [15, 38.5, 19.8], [-15, 38.5, 19.8]],
      // 进路内部向分段巷道看
      ['interior-drift', [-5, 38.5, 17.5], [-5, 39.5, -4]],
    ],
  },
];

const browserPath = CANDIDATES.find((p) => existsSync(p));
if (!browserPath) {
  console.error("未找到 Chrome / Edge");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function discover() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* 浏览器尚未就绪 */
    }
    await sleep(250);
  }
  throw new Error("CDP 端口未就绪");
}

class CDP {
  #ws;
  #id = 0;
  #pending = new Map();
  listeners = new Map();

  static async connect(url) {
    const cdp = new CDP();
    cdp.#ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      cdp.#ws.onopen = resolve;
      cdp.#ws.onerror = reject;
    });
    cdp.#ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && cdp.#pending.has(msg.id)) {
        const { resolve, reject } = cdp.#pending.get(msg.id);
        cdp.#pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        for (const fn of cdp.listeners.get(msg.method) ?? []) fn(msg.params);
      }
    };
    return cdp;
  }

  send(method, params = {}) {
    const id = ++this.#id;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
}

const chrome = spawn(
  browserPath,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.join(os.tmpdir(), "mf-model-shots-profile")}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const consoleErrors = [];

try {
  await mkdir(OUT_DIR, { recursive: true });
  const cdp = await CDP.connect(await discover());
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type === "error" || p.type === "warning") {
      consoleErrors.push(p.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200));
    }
  });
  cdp.on("Log.entryAdded", (p) => {
    if (p.entry.level === "error") consoleErrors.push(String(p.entry.text).slice(0, 200));
  });

  const evalJs = async (expr) => {
    const r = await cdp.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
    return r.result?.value;
  };

  /** 3D 内容截图：渲一帧后直接 toDataURL（preserveDrawingBuffer 已开），绕开 headless captureScreenshot 对活动 WebGL 的挂起 */
  const shotCanvas = async (name) => {
    await evalJs(`document.querySelector("[data-mf-model]")?.__mfPause?.(true)`);
    await sleep(200);
    const dataUrl = await evalJs(`document.querySelector(".mf-model__canvas")?.toDataURL("image/png") ?? null`);
    await evalJs(`document.querySelector("[data-mf-model]")?.__mfPause?.(false)`);
    if (!dataUrl || !dataUrl.startsWith("data:image/png")) {
      console.error(`  ✖ ${name}: canvas 截图失败`);
      return false;
    }
    await writeFile(path.join(OUT_DIR, `${name}.png`), Buffer.from(dataUrl.split(",")[1], "base64"));
    console.log(`  ✔ ${name}.png`);
    return true;
  };

  /** 整页上下文截图（无 clip，舞台保持在折叠下方时 WebGL 循环被 IO 暂停，capture 不挂起） */
  const shotPage = async (name) => {
    const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
    await writeFile(path.join(OUT_DIR, `${name}.png`), Buffer.from(shot.data, "base64"));
    console.log(`  ✔ ${name}.png（整页）`);
    return true;
  };

  for (const t of TARGETS) {
    console.log(`▶ ${t.slug}`);
    // 桌面
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1400, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: BASE + t.url });
    await sleep(2500); // 等 module chunk + build
    // 检查查看器健康
    const health = await evalJs(
      `(() => { const c = document.querySelector("[data-mf-model]"); if (!c) return { viewer: false };
        return { viewer: true, badge: document.querySelector("[data-model-badge]")?.textContent ?? "",
                 skeletonGone: !document.querySelector("[data-model-skeleton]"),
                 labels: document.querySelectorAll(".mf-model__label").length,
                 views: document.querySelectorAll("[data-view]").length,
                 layers: document.querySelectorAll("[data-layer]").length }; })()`,
    );
    console.log("  健康:", JSON.stringify(health));
    // 滚入视口激活渲染循环（IO 暂停会让视角飞行动画不推进）
    await evalJs(`document.querySelector("[data-mf-model]")?.scrollIntoView({ block: "center" })`);
    await sleep(400);
    for (const v of t.views) {
      await evalJs(`document.querySelector('[data-view="${v}"]')?.click()`);
      await sleep(700);
      await shotCanvas(`p0-${t.slug}-${v}`);
    }
    // 桌面整页上下文（布局 + 工具条 + 标注位置）——在图层开关前拍，保持默认态
    await shotPage(`p0-${t.slug}-page-1440`);
    // 图层对照：开围岩（默认关）
    await evalJs(`document.querySelector('[data-layer="围岩"]')?.click()`);
    await sleep(700);
    await shotCanvas(`p0-${t.slug}-layers-wall-on`);
    await evalJs(`document.querySelector('[data-layer="围岩"]')?.click()`); // 还原默认
    await sleep(300);
    // 移动端
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 900, deviceScaleFactor: 2, mobile: true });
    await sleep(800);
    await shotCanvas(`p0-${t.slug}-m375`);
    await shotPage(`p0-${t.slug}-page-375`);
    // 巷道空心化验收近拍：岔口 / 巷道内部 / 断面（桌面尺度）
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1400, deviceScaleFactor: 1, mobile: false });
    await sleep(500);
    for (const [name, cam, tgt, layerOff] of t.junctions ?? []) {
      // 可选：临时关闭干扰图层（如风流箭头挡岔口视线），拍完恢复
      const off = layerOff ?? [];
      for (const l of off) {
        await evalJs(
          `(() => { const b = document.querySelector('[data-layer="${l}"]');
            if (b && b.getAttribute("aria-pressed") === "true") b.click();
            return b?.getAttribute("aria-pressed"); })()`,
        );
      }
      await evalJs(
        `(() => { const c = document.querySelector("[data-mf-model]"); if (!c?.__mfCam) return false;
          c.scrollIntoView({ block: "center" }); c.__mfCam(${JSON.stringify(cam)}, ${JSON.stringify(tgt)}); return true; })()`,
      );
      await sleep(250);
      await shotCanvas(`p0-${t.slug}-${name}`);
      for (const l of off) {
        await evalJs(
          `(() => { const b = document.querySelector('[data-layer="${l}"]');
            if (b && b.getAttribute("aria-pressed") === "false") b.click();
            return b?.getAttribute("aria-pressed"); })()`,
        );
      }
    }
  }

  console.log(`控制台 error/warning: ${consoleErrors.length}`);
  consoleErrors.slice(0, 10).forEach((e) => console.log("  ", e));
} finally {
  chrome.kill();
}
