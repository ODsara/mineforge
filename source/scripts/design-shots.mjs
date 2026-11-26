/**
 * 设计审查截图脚本（全站 × 4 断点，WebGL 安全）
 * 用法：node scripts/design-shots.mjs [baseUrl] [outDir] [nameFilter]
 * 产出：<outDir>/<name>-<width>.png + report.json（控制台错误/横向溢出/页高）
 *
 * 与 audit.mjs 的差别：
 *  - 整页截图用「视口=页高」法（shots-pages.mjs 范式），不用 clip——
 *    clip 对活动 WebGL 合成会挂起（P0 验收经验）。
 *  - 模型页先等构建完成，再在全高视口下调用容器 __mfPause(true) 渲一帧停循环，
 *    保证截图里三维内容可见且合成不挂。
 *  - 入场动效统一强制终态（remove mf-anim + is-in），不依赖 IO 滚动触发。
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const OUT_DIR = path.resolve(process.argv[3] ?? ".design/shots");
const FILTER = process.argv[4] ?? "";
const PORT = 9351;
const WIDTHS = [1440, 1280, 768, 375];

const ROUTES = [
  ["home", "/"],
  ["methods", "/methods/"],
  ["cat-open", "/methods/open-stope/"],
  ["cat-backfill", "/methods/backfill/"],
  ["cat-caving", "/methods/caving/"],
  ["d-room-pillar", "/methods/open-stope/room-pillar/"],
  ["d-slc-no-pillar", "/methods/caving/sublevel-caving-no-pillar/"],
  ["d-shrinkage", "/methods/open-stope/shrinkage/"],
  ["d-stage-room", "/methods/open-stope/stage-room/"],
  ["d-sublevel-drilling", "/methods/open-stope/sublevel-drilling-stage-room/"],
  ["d-upward-slice", "/methods/backfill/upward-horizontal-slice/"],
  ["d-single-layer-caving", "/methods/caving/single-layer-caving/"],
  ["knowledge", "/knowledge/"],
  ["domain", "/knowledge/development/"],
  ["engineering", "/engineering/"],
  ["topic", "/engineering/preparation-cutting/"],
  ["resources", "/resources/"],
  ["res-glossary", "/resources/glossary/"],
  ["about", "/about/"],
  ["search", "/search/"],
  ["404", "/404.html"],
];

const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const browserPath = CANDIDATES.find((p) => existsSync(p));
if (!browserPath) {
  console.error("未找到 Chrome / Edge");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function discover() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch { /* 未就绪 */ }
    await sleep(250);
  }
  throw new Error("CDP 端口未就绪");
}

class CDP {
  #ws; #id = 0; #pending = new Map(); listeners = new Map();
  static async connect(url) {
    const cdp = new CDP();
    cdp.#ws = new WebSocket(url);
    await new Promise((resolve, reject) => { cdp.#ws.onopen = resolve; cdp.#ws.onerror = reject; });
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

const chrome = spawn(browserPath, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${path.join(os.tmpdir(), "mf-design-profile")}`,
  "--no-first-run", "--no-default-browser-check",
  "--disable-gpu", "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "about:blank",
], { stdio: "ignore" });

const issues = [];
const rows = [];
let current = { route: "", width: 0 };

try {
  await mkdir(OUT_DIR, { recursive: true });
  const cdp = await CDP.connect(await discover());
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  cdp.on("Runtime.consoleAPICalled", (p) => {
    if (p.type === "error" || p.type === "warning") {
      issues.push({ ...current, kind: `console.${p.type}`, text: p.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 300) });
    }
  });
  cdp.on("Runtime.exceptionThrown", (p) => {
    issues.push({ ...current, kind: "exception", text: (p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text ?? "").slice(0, 300) });
  });
  cdp.on("Log.entryAdded", (p) => {
    if (["error", "warning"].includes(p.entry.level)) {
      issues.push({ ...current, kind: `log.${p.entry.level}`, text: `${p.entry.text} ${p.entry.url ?? ""}`.slice(0, 300) });
    }
  });

  const queue = FILTER ? ROUTES.filter(([n]) => n.includes(FILTER)) : ROUTES;

  for (const [name, route] of queue) {
    for (const width of WIDTHS) {
      current = { route, width };
      await cdp.send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
      const loaded = new Promise((resolve) => cdp.on("Page.loadEventFired", resolve));
      await cdp.send("Page.navigate", { url: BASE + route });
      await Promise.race([loaded, sleep(10000)]);
      await sleep(500);

      // 溢出探针（常规视口下量）
      const probe = await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          const de = document.documentElement;
          const over = [...document.querySelectorAll("body *")]
            .filter(el => el.getBoundingClientRect().right > de.clientWidth + 1)
            .slice(0, 5)
            .map(el => el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/)[0] : ""));
          return JSON.stringify({ scrollW: de.scrollWidth, clientW: de.clientWidth, over });
        })()`,
        returnByValue: true,
      });
      const info = JSON.parse(probe.result.value);

      // 模型页：等程序化构建完成（skeleton 被移除即 loaded）
      const hasModel = await cdp.send("Runtime.evaluate", {
        expression: `!!document.querySelector("[data-mf-model]")`,
        returnByValue: true,
      });
      if (hasModel.result.value) {
        for (let i = 0; i < 40; i++) {
          const st = await cdp.send("Runtime.evaluate", {
            expression: `(() => { const c = document.querySelector("[data-mf-model]"); return c ? (c.dataset.mfInit === "1" && !c.querySelector("[data-model-skeleton]")) : false; })()`,
            returnByValue: true,
          });
          if (st.result.value) break;
          await sleep(250);
        }
        // 滚到模型处激活 IO（离屏时渲染循环暂停）
        await cdp.send("Runtime.evaluate", {
          expression: `document.querySelector("[data-mf-model]")?.scrollIntoView({block:"center"})`,
        });
        await sleep(700);
      }

      // 量页高 → 视口拉到全高（两轮收敛，vh/clamp 会重算）
      const measure = async () => {
        const r = await cdp.send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true });
        return Math.min(Math.max(Number(r.result.value) || 900, 900), 16000);
      };
      let height = await measure();
      for (let pass = 0; pass < 3; pass++) {
        await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
        await sleep(400);
        const next = await measure();
        if (Math.abs(next - height) < 8) { height = next; break; }
        height = next;
      }

      // 入场动效强制终态
      await cdp.send("Runtime.evaluate", {
        expression: `(() => {
          document.documentElement.classList.remove("mf-anim");
          document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-in"));
          document.querySelectorAll("[data-reveal] *").forEach(el => el.classList.add("is-in"));
          window.scrollTo(0, 0);
        })()`,
      });

      // 模型页：全高视口下 ResizeObserver 已重设尺寸，__mfPause(true) 渲一帧并停循环
      if (hasModel.result.value) {
        await cdp.send("Runtime.evaluate", {
          expression: `(() => { const c = document.querySelector("[data-mf-model]"); if (c && c.__mfPause) c.__mfPause(true); })()`,
        });
        await sleep(400);
      } else {
        await sleep(500);
      }

      const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      await writeFile(path.join(OUT_DIR, `${name}-${width}.png`), Buffer.from(shot.data, "base64"));
      rows.push({ name, route, width, height, scrollW: info.scrollW, clientW: info.clientW, overflow: info.scrollW > info.clientW + 1, overEls: info.over });
      console.log(`${name.padEnd(22)} ${String(width).padStart(4)}px  h=${String(height).padStart(5)}  ${info.scrollW > info.clientW + 1 ? "❌溢出 " + JSON.stringify(info.over) : "✓"}`);
    }
  }

  const unique = [...new Map(issues.map((i) => [i.route + i.kind + i.text, i])).values()];
  await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify({ rows, issues: unique }, null, 2));
  console.log(`\n完成：${rows.length} 张 → ${OUT_DIR}`);
  console.log("控制台问题：", unique.length === 0 ? "无" : JSON.stringify(unique, null, 2));
  const overflows = rows.filter((r) => r.overflow);
  console.log("横向溢出：", overflows.length === 0 ? "无" : JSON.stringify(overflows, null, 2));
} catch (err) {
  console.error("截图失败：", err);
  try { await writeFile(path.join(OUT_DIR, "report.partial.json"), JSON.stringify({ rows, issues }, null, 2)); } catch {}
} finally {
  chrome.kill();
}