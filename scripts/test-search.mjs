import { spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";
import { existsSync } from "node:fs";

const PORT = 9334;
const BASE = process.argv[2] ?? "http://localhost:4321";
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const browserPath = CANDIDATES.find((p) => existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  #ws; #id = 0; #pending = new Map(); listeners = new Map();
  static async connect(url) {
    const cdp = new CDP();
    cdp.#ws = new WebSocket(url);
    await new Promise((res, rej) => { cdp.#ws.onopen = res; cdp.#ws.onerror = rej; });
    cdp.#ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
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
  on(m, f) { if (!this.listeners.has(m)) this.listeners.set(m, []); this.listeners.get(m).push(f); }
}

const chrome = spawn(browserPath, [
  "--headless=new", `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(os.tmpdir(), "mf-search-profile")}`,
  "--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars",
  "about:blank",
], { stdio: "ignore" });

let wsUrl;
for (let i = 0; i < 60; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const list = await r.json();
    const page = list.find((t) => t.type === "page");
    if (page?.webSocketDebuggerUrl) { wsUrl = page.webSocketDebuggerUrl; break; }
  } catch {}
  await sleep(250);
}

const cdp = await CDP.connect(wsUrl);
await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
const errors = [];
cdp.on("Runtime.consoleAPICalled", (p) => { if (p.type === "error") errors.push(p.args.map(a => a.value).join(" ")); });
cdp.on("Runtime.exceptionThrown", (p) => errors.push(p.exceptionDetails.text));

const evaluate = async (expression) => {
  const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return r.result?.value;
};
const goto = async (url, w, h) => {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await cdp.send("Page.navigate", { url });
  await sleep(1600);
};
const shot = async (name) => {
  const r = await cdp.send("Page.captureScreenshot", { format: "png" });
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.resolve(".audit", name), Buffer.from(r.data, "base64"));
};

// 1) 通过 URL 参数进入
await goto(`${BASE}/search/?q=${encodeURIComponent("矿柱")}`, 1440, 1000);
console.log("URL 参数 q=矿柱 →", await evaluate(`document.getElementById('search-summary').textContent.trim()`));
console.log("  结果条数:", await evaluate(`document.querySelectorAll('#search-results a').length`));
console.log("  输入框回填:", await evaluate(`document.getElementById('search-input').value`));
await shot("search-1440.png");

// 2) 输入框交互 + 类型过滤
await evaluate(`(() => {
  const el = document.getElementById('search-input');
  el.value = '拉底';
  el.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await sleep(300);
console.log("输入 拉底 →", await evaluate(`document.getElementById('search-summary').textContent.trim()`));
console.log("  结果条数:", await evaluate(`document.querySelectorAll('#search-results a').length`));

await evaluate(`document.querySelector('[data-filter="专业术语"]').click()`);
await sleep(300);
console.log("再筛选 专业术语 →", await evaluate(`document.getElementById('search-summary').textContent.trim()`));
await shot("search-1440-filtered.png");

// 3) 无结果
await evaluate(`(() => {
  const el = document.getElementById('search-input');
  el.value = 'zzzz不存在';
  el.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await sleep(300);
console.log("无结果 →", await evaluate(`document.getElementById('search-summary').textContent.trim()`));
console.log("  空态可见:", await evaluate(`!document.getElementById('search-empty').classList.contains('hidden')`));

// 4) 手机端
await goto(`${BASE}/search/?q=${encodeURIComponent("阶段矿房法")}`, 375, 812);
console.log("375px q=阶段矿房法 →", await evaluate(`document.querySelectorAll('#search-results a').length`), "条");
console.log("  溢出:", await evaluate(`document.documentElement.scrollWidth > document.documentElement.clientWidth`));
await shot("search-375.png");

console.log("控制台错误:", errors.length ? errors : "无");
chrome.kill();
process.exit(0);
