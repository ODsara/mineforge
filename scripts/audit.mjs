/**
 * MineForge 页面自检脚本
 * 依赖：本机 Chrome/Edge + Node 22 内置 WebSocket（无需安装任何包）
 *
 * 用法：node scripts/audit.mjs [baseUrl]
 * 输出：.audit/ 下的分宽度截图 + 控制台错误 + 横向溢出检测结果
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PORT = 9333;
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const ROUTES = [
  ["home", "/"],
  ["knowledge", "/knowledge/"],
  ["domain", "/knowledge/development/"],
  ["methods", "/methods/"],
  ["category", "/methods/open-stope/"],
  ["detail", "/methods/open-stope/sublevel-drilling-stage-room/"],
  ["engineering", "/engineering/"],
  ["topic", "/engineering/preparation-cutting/"],
  ["resources", "/resources/"],
  ["res-glossary", "/resources/glossary/"],
  ["res-formulas", "/resources/formulas/"],
  ["res-references", "/resources/references/"],
  ["res-standards", "/resources/standards/"],
  ["about", "/about/"],
  ["search", "/search/"],
  ["404", "/404.html"],
];

const WIDTHS = [1440, 1280, 1024, 768, 375];
const OUT_DIR = path.resolve(".audit");

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
    `--user-data-dir=${path.join(os.tmpdir(), "mf-audit-profile")}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const issues = [];

try {
  await mkdir(OUT_DIR, { recursive: true });

  const cdp = await CDP.connect(await discover());
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type === "error" || p.type === "warning") {
      issues.push({ kind: `console.${p.type}`, text: p.args.map((a) => a.value ?? a.description).join(" ") });
    }
  });
  cdp.on("Runtime.exceptionThrown", (p) => {
    issues.push({ kind: "exception", text: p.exceptionDetails.text ?? "" });
  });
  cdp.on("Log.entryAdded", (p) => {
    if (["error", "warning"].includes(p.entry.level)) {
      issues.push({ kind: `log.${p.entry.level}`, text: `${p.entry.text} ${p.entry.url ?? ""}` });
    }
  });

  const results = [];

  for (const [name, route] of ROUTES) {
    for (const width of WIDTHS) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width < 768,
      });

      const loaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
      await cdp.send("Page.navigate", { url: BASE + route });
      await Promise.race([loaded, sleep(8000)]);
      await sleep(350);

      const probe = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const de = document.documentElement;
          const overflowEls = [...document.querySelectorAll("body *")]
            .filter(el => el.getBoundingClientRect().right > de.clientWidth + 1)
            .slice(0, 4)
            .map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""));
          return JSON.stringify({
            scrollW: de.scrollWidth,
            clientW: de.clientWidth,
            pageH: document.body.scrollHeight,
            h1: document.querySelector("h1")?.innerText ?? null,
            navCount: document.querySelectorAll("header nav a").length,
            overflowEls,
          });
        })()`,
        returnByValue: true,
      });

      const info = JSON.parse(probe.result.value);
      const overflow = info.scrollW > info.clientW + 1;
      if (overflow) {
        results.push({ route, width, overflow, detail: info.overflowEls });
      }

      // 截图前滚一遍页面：懒入场元素不滚到视口就保持 opacity:0，整页截图会缺内容
      await cdp.send("Runtime.evaluate", {
        expression: `(async () => {
          const h = document.body.scrollHeight;
          for (let y = 0; y < h; y += Math.round(window.innerHeight * 0.85)) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 80));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 450));
        })()`,
        awaitPromise: true,
      });

      // 截图前滚一遍页面：懒入场元素不滚到视口就保持 opacity:0，整页截图会缺内容
      await cdp.send("Runtime.evaluate", {
        expression: `(async () => {
          const h = document.body.scrollHeight;
          for (let y = 0; y < h; y += Math.round(window.innerHeight * 0.85)) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 80));
          }
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 450));
        })()`,
        awaitPromise: true,
      });

      // 截图按终态出：撤掉入场锁并清空内联样式。
      // 不靠"滚一遍触发 IO"——IO 回调是异步批处理的，滚太快会漏掉元素，
      // 截出来就是一块空白。这里直接让所有入场元素处于完成态。
      await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          document.documentElement.classList.remove("mf-anim-ready");
          document
            .querySelectorAll("[data-reveal], [data-reveal-stagger]")
            .forEach((el) => {
              el.classList.add("is-in");
              el.style.opacity = "";
              el.style.transform = "";
            });
          window.scrollTo(0, 0);
        })()`,
      });
      await new Promise((r) => setTimeout(r, 350));

      const metrics = await cdp.send("Page.getLayoutMetrics");
      const height = Math.min(Math.ceil(metrics.cssContentSize.height), 6000);
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height, scale: 1 },
      });
      await writeFile(path.join(OUT_DIR, `${name}-${width}.png`), Buffer.from(shot.data, "base64"));

      console.log(
        `${route.padEnd(14)} ${String(width).padStart(4)}px  scrollW=${info.scrollW} clientW=${info.clientW} ${overflow ? "❌ 横向溢出" : "✓"}  h1=${info.h1}`,
      );
    }
  }

  const unique = [...new Map(issues.map((i) => [i.kind + i.text, i])).values()];
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify({ results, issues: unique }, null, 2));

  console.log("\n控制台错误/警告：", unique.length === 0 ? "无" : unique);
  console.log("横向溢出：", results.length === 0 ? "无" : results);
} finally {
  chrome.kill();
}
