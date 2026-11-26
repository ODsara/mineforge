/**
 * 整页截图：把视口拉到页面全高，一次截完整页。
 *
 * 为什么不分段：分段截图会把长页面切成互不衔接的几张，贴在一起看不出整体节奏。
 * 视口设为全高后，所有 [data-reveal] 元素一次性进入视口，揭示动画同时触发，
 * 等 1.4s 全部落位再截，得到的是一张「没有任何元素被隐藏」的完整版面。
 *
 * 用法：node scripts/shots-pages.mjs [baseUrl] [nameFilter]
 * 输出：.audit/pages/<name>.png
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const FILTER = process.argv[3] ?? "";
const WIDTH = 1440;
const PORT = 9337;
const OUT = ".audit/pages";

const PAGES = [
  ["01-home", "/"],
  ["02-knowledge", "/knowledge/"],
  ["03-knowledge-domain", "/knowledge/open-pit/"],
  ["04-methods", "/methods/"],
  ["05-methods-category", "/methods/backfill/"],
  ["06-method-detail", "/methods/open-stope/sublevel-drilling-stage-room/"],
  ["07-engineering", "/engineering/"],
  ["08-engineering-topic", "/engineering/development/"],
  ["09-resources", "/resources/"],
  ["10-resources-type", "/resources/glossary/"],
  ["11-about", "/about/"],
  ["12-search", "/search/"],
  ["13-404", "/404"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const browserPath = CANDIDATES.find((p) => existsSync(p));
if (!browserPath) {
  console.error("找不到 Chrome 或 Edge");
  process.exit(1);
}

const chrome = spawn(
  browserPath,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.join(os.tmpdir(), "mf-pages-profile")}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" }
);

let ws;
const pending = new Map();
let id = 0;
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

try {
  await mkdir(OUT, { recursive: true });

  let target;
  for (let i = 0; i < 60 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((t) => t.type === "page")?.webSocketDebuggerUrl;
    } catch {
      /* 浏览器尚未就绪 */
    }
    if (!target) await sleep(250);
  }

  ws = new WebSocket(target);
  await new Promise((resolve) => (ws.onopen = resolve));
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  };

  await send("Page.enable");
  await send("Runtime.enable");

  const queue = FILTER ? PAGES.filter(([n]) => n.includes(FILTER)) : PAGES;

  for (const [name, route] of queue) {
    // 先按常规视口导航，拿到接近真实的初始布局
    await send("Emulation.setDeviceMetricsOverride", {
      width: WIDTH,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.navigate", { url: `${BASE}${route}` });
    await sleep(1100);

    const measure = async () => {
      const r = await send("Runtime.evaluate", {
        expression: "document.documentElement.scrollHeight",
        returnByValue: true,
      });
      return Math.min(Number(r.result.value) || 1000, 12000);
    };

    let height = await measure();
    // 视口一变高，vh 单位与 clamp() 会重算，页面高度可能再变一次，量两轮收敛
    for (let pass = 0; pass < 2; pass++) {
      await send("Emulation.setDeviceMetricsOverride", {
        width: WIDTH,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await sleep(420);
      const next = await measure();
      if (Math.abs(next - height) < 8) break;
      height = next;
    }

    // 全高视口下所有元素都在视口内，等揭示动画与数字递增跑完
    await sleep(1200);

    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(`${OUT}/${name}.png`, Buffer.from(shot.data, "base64"));
    console.log(`${OUT}/${name}.png  (${WIDTH}×${height})`);
  }
} catch (err) {
  console.error("截图失败：", err.message);
} finally {
  chrome.kill();
}
