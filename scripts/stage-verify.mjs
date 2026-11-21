/**
 * 工艺阶段滚动演示·验收证据（只读工具）
 * 1) 滚动驱动验证：真实滚动页面到各关键帧标题 → 读取激活阶段按钮
 * 2) 逐阶段截图：点击阶段按钮 1..5 → canvas 截图
 * 产出：.audit/stages/*.png + 控制台滚动驱动日志
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PORT = 9360;
const OUT_DIR = path.resolve(".audit/stages");
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const TARGETS = [{"slug":"comprehensive","url":"/methods/open-stope/comprehensive/"},{"slug":"room-pillar","url":"/methods/open-stope/room-pillar/"},{"slug":"shrinkage","url":"/methods/open-stope/shrinkage/"},{"slug":"stage-room","url":"/methods/open-stope/stage-room/"},{"slug":"sublevel-room","url":"/methods/open-stope/sublevel-room/"},{"slug":"sublevel-drilling-stage-room","url":"/methods/open-stope/sublevel-drilling-stage-room/"},{"slug":"single-layer","url":"/methods/backfill/single-layer/"},{"slug":"upward-horizontal-slice","url":"/methods/backfill/upward-horizontal-slice/"},{"slug":"downward-slice","url":"/methods/backfill/downward-slice/"},{"slug":"sublevel-backfill","url":"/methods/backfill/sublevel-backfill/"},{"slug":"single-layer-caving","url":"/methods/caving/single-layer-caving/"},{"slug":"sublevel-caving-bottom-pillar","url":"/methods/caving/sublevel-caving-bottom-pillar/"},{"slug":"sublevel-caving-no-pillar","url":"/methods/caving/sublevel-caving-no-pillar/"},{"slug":"stage-forced-caving","url":"/methods/caving/stage-forced-caving/"},{"slug":"stage-natural-caving","url":"/methods/caving/stage-natural-caving/"}];

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
    `--user-data-dir=${path.join(os.tmpdir(), "mf-stage-profile")}`,
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
    if (p.type === "error") consoleErrors.push(p.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 160));
  });

  const evalJs = async (expr) => {
    const r = await cdp.send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
    return r.result?.value;
  };
  const shotCanvas = async (name) => {
    await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); if (c?.__mfPause) c.__mfPause(true); return 1; })()`);
    await sleep(180);
    const dataUrl = await evalJs(`document.querySelector(".mf-model__canvas")?.toDataURL("image/png") ?? null`);
    await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); if (c?.__mfPause) c.__mfPause(false); return 1; })()`);
    if (!dataUrl || !dataUrl.startsWith("data:image/png")) {
      console.error(`  ✖ ${name}`);
      return false;
    }
    await writeFile(path.join(OUT_DIR, `${name}.png`), Buffer.from(dataUrl.split(",")[1], "base64"));
    console.log(`  ✔ ${name}.png`);
    return true;
  };

  for (const t of TARGETS) {
    console.log(`▶ ${t.slug}`);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1400, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: BASE + t.url });
    let ready = false;
    for (let i = 0; i < 100; i++) {
      await sleep(100);
      if (await evalJs(`document.querySelectorAll(".mf-model__label").length > 0`)) { ready = true; break; }
    }
    console.log(`  就绪: ${ready}`);
    if (!ready) continue;

    // ── 逐阶段截图（点击阶段按钮）──
    const nStages = await evalJs(`document.querySelectorAll("[data-model-stages] [data-stage]").length`);
    console.log(`  阶段按钮数: ${nStages}`);
    for (let s = 1; s <= nStages; s++) {
      await evalJs(`document.querySelector('[data-model-stages] [data-stage="${s}"]')?.click()`);
      await sleep(350);
      const pressed = await evalJs(`document.querySelector('[data-model-stages] [data-stage="${s}"]')?.getAttribute("aria-pressed")`);
      await shotCanvas(`st-${t.slug}-s${s}`);
      console.log(`    阶段${s} aria-pressed=${pressed}`);
    }

    // ── 滚动驱动验证：滚动到各关键帧块 → 读激活阶段 ──
    console.log("  滚动驱动验证：");
    const keyCount = await evalJs(`document.querySelectorAll(".mf-model__key").length`);
    for (let k = 1; k <= keyCount; k++) {
      await evalJs(
        `(() => { const el = document.querySelector('.mf-model__key[data-key-stage="${k}"]');
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - innerHeight * 0.38, behavior: "instant" });
          return 1; })()`,
      );
      await sleep(500); // 等滚动引擎 rAF + 重建
      const active = await evalJs(
        `document.querySelector('[data-model-stages] [aria-pressed="true"]')?.dataset.stage ?? "?"`,
      );
      const keyActive = await evalJs(
        `document.querySelector('.mf-model__key[data-active="true"]')?.dataset.keyStage ?? "?"`,
      );
      console.log(`    关键帧${k} → 激活阶段=${active}（高亮关键帧=${keyActive}）`);
    }
  }
  console.log(`控制台 error: ${consoleErrors.length}`);
  consoleErrors.slice(0, 5).forEach((e) => console.log("  ", e));
} finally {
  chrome.kill();
}
