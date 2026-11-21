/**
 * 指定区块截图（用于核对某一屏的实际效果）
 * 用法：node scripts/shot-el.mjs <url> <selector> [width] [height] [name] [waitMs]
 * 例：  node scripts/shot-el.mjs http://localhost:4321/ "#sec-flagship" 1440 1000 flagship 2500
 * 输出：.audit/<name>.png
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const [
  url = "http://localhost:4321/",
  selector = "body",
  width = "1440",
  height = "1000",
  name = "el",
  waitMs = "2200",
  openFolds = "",
] = process.argv.slice(2);

const PORT = 9341;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const browserPath = CANDIDATES.find((p) => existsSync(p));

const chrome = spawn(
  browserPath,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.join(os.tmpdir(), "mf-shot-el-profile")}`,
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
  await mkdir(".audit", { recursive: true });

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
  await send("Emulation.setDeviceMetricsOverride", {
    width: Number(width),
    height: Number(height),
    deviceScaleFactor: 1,
    mobile: Number(width) < 768,
  });
  await send("Page.navigate", { url });
  await sleep(Number(waitMs));

  // 第 7 个参数传 open：先把所有折叠区展开，便于核对折叠区内部排版
  if (openFolds === "open") {
    await send("Runtime.evaluate", {
      expression: "document.querySelectorAll('details').forEach((d) => (d.open = true))",
    });
    await sleep(400);
  }

  const scrolled = await send("Runtime.evaluate", {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return "not-found";
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "instant" });
      return String(Math.round(y));
    })()`,
    returnByValue: true,
  });
  console.log("scrollY:", scrolled.result?.value);
  await sleep(700);

  const shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(`.audit/${name}.png`, Buffer.from(shot.data, "base64"));
  console.log(`.audit/${name}.png`);
} catch (err) {
  console.error("截图失败：", err.message);
} finally {
  chrome.kill();
}
