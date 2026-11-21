/**
 * P0 巷道空心化·正式验收截图（验收 Agent 专用，只读——不改任何站点代码）
 * 用法：node scripts/accept-shots.mjs [baseUrl]
 * 前置：dev server 运行中；__mfCam/__mfPause 为查看器既有调试钩子（仅摆相机渲一帧）
 * 产出：.audit/accept/*.png（逐张验收证据）
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PORT = 9352;
const OUT_DIR = path.resolve(".audit/accept");
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const TARGETS = [
  {
    slug: "room-pillar",
    url: "/methods/open-stope/room-pillar/",
    shots: [
      ["R1-transport-interior", [-14, -6, -30], [12, -9.5, -31]], // 主运巷内部纵视
      ["R2-crosscut-junction", [1.1, -2.2, -26.3], [-0.6, -9.2, -30.9]], // 联络巷→运巷岔口
      ["R3-raise-roof-junction", [0, -11, -30.5], [0, -2, -26.5]], // 运巷内仰视溜井顶拱
      ["R4-transport-end-ring", [-22, -8.4, -31], [-10, -8.4, -31]], // 运巷端口壁厚
      ["R5-cutdrift-interior", [-6, -1.9, -26], [2, -1.9, -26]], // 切割巷内部纵视（左帮口）
      ["R6-ramp-mouth", [-4, -1.9, -26], [1, -1.2, -25.2]], // 切割巷内看上山口（右帮）
      ["R7-winch-room", [2, -1.9, -26], [-5, -1.5, -26.8]], // 电耙硐室口
      ["R8-iso", null, null], // 预设等轴测
    ],
  },
  {
    slug: "sublevel-caving-no-pillar",
    url: "/methods/caving/sublevel-caving-no-pillar/",
    shots: [
      ["N1-haulage-interior", [-25, 3.5, 4], [38, 3.5, 4]], // 阶段运巷内部纵视（顶拱井口）
      ["N2-sublevel-interior", [25, 38.5, 19.8], [-38, 38.5, 19.8]], // 分段巷内部纵视（左帮进路口列）
      ["N3-drift-mouth", [-8, 38.5, 19.8], [-5, 38.5, 15.5]], // 进路与分段巷岔口
      ["N4-cut-mouth", [-20, 38.5, 19.8], [-30, 38.5, 17.5]], // 切割巷口
      ["N5-well-junction", [0, 38.5, 5], [0, 38.5, 1.5]], // 联络道→井筒
      ["N6-lhd-face", [-5, 38.8, 8], [-5, 39.2, -5]], // LHD 工作面
      ["N7-wells-overhead", [0, 55, 20], [0, 2, 2]], // 三井筒俯视
      ["N8-iso", null, null], // 预设等轴测
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
      /* 等浏览器 */
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
    `--user-data-dir=${path.join(os.tmpdir(), "mf-accept-profile")}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const consoleErrors = [];
let failed = 0;

try {
  await mkdir(OUT_DIR, { recursive: true });
  const cdp = await CDP.connect(await discover());
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type === "error") consoleErrors.push(p.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200));
  });
  cdp.on("Log.entryAdded", (p) => {
    if (p.entry.level === "error") consoleErrors.push(String(p.entry.text).slice(0, 200));
  });

  const evalJs = async (expr) => {
    const r = await cdp.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
    return r.result?.value;
  };

  const shotCanvas = async (name) => {
    await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); if (c?.__mfPause) c.__mfPause(true); return true; })()`);
    await sleep(200);
    const dataUrl = await evalJs(`document.querySelector(".mf-model__canvas")?.toDataURL("image/png") ?? null`);
    await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); if (c?.__mfPause) c.__mfPause(false); return true; })()`);
    if (!dataUrl || !dataUrl.startsWith("data:image/png")) {
      console.error(`  ✖ ${name}: canvas 截图失败`);
      failed++;
      return false;
    }
    await writeFile(path.join(OUT_DIR, `${name}.png`), Buffer.from(dataUrl.split(",")[1], "base64"));
    console.log(`  ✔ ${name}.png`);
    return true;
  };

  for (const t of TARGETS) {
    console.log(`▶ ${t.slug}`);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1400, deviceScaleFactor: 1, mobile: false });
    const t0 = Date.now();
    await cdp.send("Page.navigate", { url: BASE + t.url });
    let loaded = null;
    for (let i = 0; i < 100; i++) {
      await sleep(100);
      const ok = await evalJs(`document.querySelectorAll(".mf-model__label").length > 0`);
      if (ok) { loaded = Date.now() - t0; break; }
    }
    const health = await evalJs(
      `(() => { const c = document.querySelector("[data-mf-model]"); if (!c) return { viewer: false };
        return { viewer: true, badge: document.querySelector("[data-model-badge]")?.textContent ?? "",
                 labels: document.querySelectorAll(".mf-model__label").length,
                 views: document.querySelectorAll("[data-view]").length,
                 layers: document.querySelectorAll("[data-layer]").length }; })()`,
    );
    console.log(`  首帧 ${loaded}ms · 健康 ${JSON.stringify(health)}`);
    if (!loaded) { console.error(`  ✖ 模型未就绪（labels=0）——跳过本页（环境问题，非验收项）`); failed++; continue; }
    await evalJs(`document.querySelector("[data-mf-model]")?.scrollIntoView({ block: "center" })`);
    await sleep(400);
    for (const [name, cam, tgt] of t.shots) {
      if (!cam) {
        // 预设等轴测：点 iso 按钮取标准机位
        await evalJs(`document.querySelector('[data-view="iso"]')?.click()`);
        await sleep(700);
      } else {
        await evalJs(
          `(() => { const c = document.querySelector("[data-mf-model]"); if (!c?.__mfCam) return false;
            c.__mfCam(${JSON.stringify(cam)}, ${JSON.stringify(tgt)}); return true; })()`,
        );
        await sleep(250);
      }
      await shotCanvas(`${slug(name)}`);
    }
    // 交互性能探针：2 秒 rAF 计数
    const fps = await evalJs(
      `new Promise((res) => { let n = 0; const t0 = performance.now();
        const tick = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(Math.round(n / 2)); };
        requestAnimationFrame(tick); })`,
    );
    console.log(`  rAF 2s 帧率探针: ${fps} fps`);
  }
  console.log(`控制台 error: ${consoleErrors.length}`);
  consoleErrors.slice(0, 8).forEach((e) => console.log("  ", e));
  console.log(`失败张数: ${failed}`);
} finally {
  chrome.kill();
}

function slug(name) {
  return name; // 直接用验收编号命名
}
