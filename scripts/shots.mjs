/**
 * 分段截图工具（用于人工核对版式）
 * 用法：node scripts/shots.mjs <url> <width> <height> <name> <segments>
 * 例：  node scripts/shots.mjs http://localhost:4321/methods/ 1440 1000 methods 5
 * 输出：.audit/<name>-<width>-<i>.png
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const [
  url = "http://localhost:4321/",
  width = "1440",
  height = "1000",
  name = "seg",
  segments = "4",
] = process.argv.slice(2);

const PORT = 9336;
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
    `--user-data-dir=${path.join(os.tmpdir(), "mf-shot-profile")}`,
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
  await sleep(1800);

  for (let i = 0; i < Number(segments); i++) {
    await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, ${i * Number(height)})`,
    });
    await sleep(950);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(`.audit/${name}-${width}-${i}.png`, Buffer.from(shot.data, "base64"));
    console.log(`.audit/${name}-${width}-${i}.png`);
  }
} catch (err) {
  console.error("截图失败：", err.message);
} finally {
  chrome.kill();
}
