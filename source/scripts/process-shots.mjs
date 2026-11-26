/**
 * 过程演示迁移验收（2026-11-24）：驱动网站播放器新能力并截图。
 * 覆盖：步骤列表点击/高亮、播放速度与自动开关、自由探索（进程+剖切）、对象信息卡字段。
 * 用法：node scripts/process-shots.mjs [baseUrl]（需 dev/preview 于 4321）
 * 产出：.audit/process-2026-11-24/*.png + 控制台结果摘要
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const PORT = 9362;
const OUT_DIR = path.resolve(".audit/process-2026-11-24");
const CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const TARGETS = [
  { slug: "sublevel-caving-no-pillar", url: "/methods/caving/sublevel-caving-no-pillar/", tag: "C19" },
  { slug: "upward-horizontal-slice", url: "/methods/backfill/upward-horizontal-slice/", tag: "F9" },
  { slug: "sublevel-backfill", url: "/methods/backfill/sublevel-backfill/", tag: "B4" },
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
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
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
    `--user-data-dir=${path.join(os.tmpdir(), "mf-process-profile")}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const failures = [];
const consoleErrors = [];
const check = (name, ok, detail = "") => {
  if (ok) console.log(`  ✔ ${name}${detail ? " — " + detail : ""}`);
  else {
    console.log(`  ✖ ${name} — ${detail}`);
    failures.push(name + ": " + detail);
  }
};

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
    await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); c?.__mfPause?.(true); return 1; })()`);
    await sleep(180);
    const dataUrl = await evalJs(`document.querySelector(".mf-model__canvas")?.toDataURL("image/png") ?? null`);
    await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); c?.__mfPause?.(false); return 1; })()`);
    if (!dataUrl || !dataUrl.startsWith("data:image/png")) {
      console.error(`  ✖ ${name} 无画布`);
      return false;
    }
    await writeFile(path.join(OUT_DIR, `${name}.png`), Buffer.from(dataUrl.split(",")[1], "base64"));
    console.log(`  ✔ ${name}.png`);
    return true;
  };
  const shotSection = async (name) => {
    const box = await evalJs(`(() => {
      const el = document.querySelector("[data-mf-model]");
      const r = el.getBoundingClientRect();
      return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: Math.min(r.height, 1380) };
    })()`);
    const shot = await cdp.send("Page.captureScreenshot", { format: "png", clip: { ...box, scale: 1 } });
    await writeFile(path.join(OUT_DIR, `${name}.png`), Buffer.from(shot.data, "base64"));
    console.log(`  ✔ ${name}.png（整板截图）`);
  };

  for (const t of TARGETS) {
    console.log(`▶ ${t.tag} · ${t.slug}`);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1400, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: BASE + t.url });
    let ready = false;
    for (let i = 0; i < 150; i++) {
      await sleep(100);
      // 详情页内查看器嵌在正文中部且懒初始化：先滚入视口再轮询就绪（同 stage-verify）
      await evalJs(`(() => { const c = document.querySelector("[data-mf-model]"); c?.scrollIntoView({ block: "center" }); return 1; })()`);
      if (await evalJs(`Boolean(document.querySelector("[data-mf-model]")?.dataset.modelActive)`)) { ready = true; break; }
    }
    if (!ready) { check("页面就绪", false, "超时"); continue; }
    check("页面就绪", true);

    const info = await evalJs(`(() => {
      const root = document.querySelector("[data-mf-model]");
      const hook = root.__mfModel;
      const st = hook.state;
      return {
        mode: st.mode, step: st.step, stepCount: st.stepCount, duration: Number(root.dataset.modelStep),
        stepRows: document.querySelectorAll("[data-model-steps] [data-step]").length,
        phaseGroups: document.querySelectorAll("[data-model-steps] .studio-step-phase").length,
        phaseBadge: document.querySelector("[data-model-step-phase]")?.textContent ?? "",
        title: document.querySelector("[data-model-step-title]")?.textContent ?? "",
        scrubMax: document.querySelector("[data-model-scrub]")?.max ?? "",
        speedOpts: document.querySelectorAll("[data-model-speed] option").length,
        playDisabled: document.querySelector("[data-model-play]")?.disabled,
      };
    })()`);
    check("模式=过程演示", info.mode === "process", info.mode);
    check("步骤列表行数=工序总数", info.stepRows === info.stepCount && info.scrubMax === String(info.stepCount), `rows=${info.stepRows} count=${info.stepCount} max=${info.scrubMax}`);
    check("阶段分组渲染", info.phaseGroups >= 4, info.phaseGroups + " 组");
    check("阶段名徽章显示", info.phaseBadge.length > 0 && info.title.length > 0, `"${info.phaseBadge} | ${info.title}"`);
    check("速度选项 4 档", info.speedOpts === 4);

    // 1) 步骤列表点击：跳首步 + 高亮
    await evalJs(`(() => { const b = document.querySelector("[data-model-steps] [data-step='1']"); b.click(); return 1; })()`);
    await sleep(150);
    const afterFirst = await evalJs(`(() => ({
      step: document.querySelector("[data-mf-model]").__mfModel.state.step,
      active: document.querySelector("[data-model-steps] .is-active")?.dataset.step ?? "",
    }))()`);
    check("点击步骤1跳转", afterFirst.step === 1, String(afterFirst.step));
    check("步骤1高亮跟随", afterFirst.active === "1", afterFirst.active);
    await shotCanvas(`${t.tag}-s1`);

    // 2) 中段步 + 末步
    const mid = Math.max(2, Math.round(info.stepCount / 2));
    await evalJs(`document.querySelector("[data-model-steps] [data-step='${mid}']").click()`);
    await sleep(150);
    await shotCanvas(`${t.tag}-s${mid}`);
    await evalJs(`document.querySelector("[data-mf-model]").__mfModel.setStep(${info.stepCount})`);
    await sleep(150);
    const lastState = await evalJs(`document.querySelector("[data-mf-model]").__mfModel.state.step`);
    check("钩子跳末步", lastState === info.stepCount, String(lastState));
    await shotCanvas(`${t.tag}-s${info.stepCount}`);

    // 3) 播放 + 速度 + 自动开关
    await evalJs(`(() => {
      const h = document.querySelector("[data-mf-model]").__mfModel;
      h.setAuto(true); h.setSpeed(2); h.setStep(1); h.play();
      return 1;
    })()`);
    await sleep(2600);
    const playState = await evalJs(`(() => { const s = document.querySelector("[data-mf-model]").__mfModel.state; return { playing: s.playing, step: s.step, speed: s.speed }; })()`);
    check("2×播放推进（F-9 2.2s/2≈1.1s 每步）", playState.playing === true && playState.step >= 2, `playing=${playState.playing} step=${playState.step}`);
    await evalJs(`(() => { document.querySelector("[data-mf-model]").__mfModel.setSpeed(1); const p = document.querySelector("[data-model-play]"); if (p.getAttribute("aria-label")?.includes("暂停")) p.click(); return 1; })()`);
    const afterPause = await evalJs(`document.querySelector("[data-mf-model]").__mfModel.state.playing`);
    check("暂停生效", afterPause === false);
    await evalJs(`document.querySelector("[data-mf-model]").__mfModel.setAuto(false)`);
    await sleep(80);
    const autoOff = await evalJs(`(() => ({
      disabled: document.querySelector("[data-model-play]").disabled,
      playing: document.querySelector("[data-mf-model]").__mfModel.state.playing,
    }))()`);
    check("关闭自动→播放键禁用", autoOff.disabled === true && autoOff.playing === false, JSON.stringify(autoOff));
    await evalJs(`document.querySelector("[data-mf-model]").__mfModel.setAuto(true)`);

    // 4) 自由探索：进程 + 剖切
    await evalJs(`document.querySelector("[data-model-mode='explore']").click()`);
    await sleep(200);
    const exploreInit = await evalJs(`(() => {
      const s = document.querySelector("[data-mf-model]").__mfModel.state;
      return { mode: s.mode, progress: s.progress, cut: s.cut,
        name: document.querySelector("[data-model-progress-name]")?.textContent ?? "" };
    })()`);
    check("切至自由探索", exploreInit.mode === "explore", exploreInit.mode);
    check("进程初始≈defaults", exploreInit.progress > 0 && exploreInit.progress <= 100, exploreInit.progress + "%");
    await evalJs(`(() => {
      const h = document.querySelector("[data-mf-model]").__mfModel;
      h.setProgress(30); h.setCut(45);
      return 1;
    })()`);
    await sleep(300);
    const exploreMid = await evalJs(`(() => {
      const s = document.querySelector("[data-mf-model]").__mfModel.state;
      return { progress: s.progress, cut: s.cut, label: document.querySelector("[data-model-progress-name]")?.textContent ?? "" };
    })()`);
    check("进程=30%", exploreMid.progress === 30, String(exploreMid.progress));
    check("剖切=45%", exploreMid.cut === 45, String(exploreMid.cut));
    check("进程档位名显示", exploreMid.label.length > 0 && exploreMid.label !== "—", exploreMid.label);
    await shotCanvas(`${t.tag}-explore30-cut45`);

    // 5) 对象信息卡：扫描画布找可见构件，模拟点击
    const infoCard = await evalJs(`(() => {
      const canvas = document.querySelector(".mf-model__canvas");
      const rect = canvas.getBoundingClientRect();
      // 直接在中心射线可中的坐标上合成 pointerdown/up（与用户点击同链路）
      const hook = document.querySelector("[data-mf-model]").__mfModel;
      let point = null;
      for (const fx of [0.5, 0.42, 0.58, 0.35, 0.65]) {
        for (const fy of [0.52, 0.46, 0.6]) {
          const x = rect.x + rect.width * fx, y = rect.y + rect.height * fy;
          if (hook.pickAt(x, y)) { point = [x, y]; break; }
        }
        if (point) break;
      }
      if (!point) return { ok: false };
      canvas.dispatchEvent(new PointerEvent("pointerdown", { clientX: point[0], clientY: point[1], isPrimary: true, button: 0, bubbles: true }));
      canvas.dispatchEvent(new PointerEvent("pointerup", { clientX: point[0], clientY: point[1], isPrimary: true, button: 0, bubbles: true }));
      const sel = document.querySelector("[data-model-selection]");
      const info = sel.querySelector(".mf-info");
      const text = (label) => {
        const dts = [...(info?.querySelectorAll("dt") ?? [])];
        const i = dts.findIndex((d) => d.textContent === label);
        return i >= 0 ? dts[i].nextElementSibling?.textContent ?? "" : "";
      };
      return {
        ok: Boolean(info) && !sel.hidden,
        name: info?.querySelector("strong")?.textContent ?? "",
        id: info?.querySelector(".mf-info__id")?.textContent ?? "",
        badge: info?.querySelector(".mf-badge")?.textContent ?? "",
        tier: text("依据等级"),
        dims: text("尺寸"),
        elev: text("标高"),
        ref: text("教材出处"),
      };
    })()`);
    check("信息卡显示", infoCard.ok === true, infoCard.name + " / " + infoCard.id);
    check("状态徽章", (infoCard.badge ?? "").length > 0, infoCard.badge);
    check("依据等级字段", /【[教图推假]】/.test(infoCard.tier ?? ""), infoCard.tier);
    check("尺寸字段", (infoCard.dims ?? "").length > 1, infoCard.dims);
    check("标高字段", (infoCard.elev ?? "").length > 0, infoCard.elev);
    await shotSection(`${t.tag}-infocard`);

    // 6) 回过程演示：模式按钮态
    await evalJs(`document.querySelector("[data-model-mode='process']").click()`);
    await sleep(200);
    const backProcess = await evalJs(`(() => {
      const root = document.querySelector("[data-mf-model]");
      return {
        mode: root.__mfModel.state.mode,
        exploreHidden: document.querySelector("[data-model-explore]").hidden,
        processHidden: document.querySelector("[data-model-process]").hidden,
      };
    })()`);
    check("返回过程演示", backProcess.mode === "process" && backProcess.exploreHidden === true && backProcess.processHidden === false, JSON.stringify(backProcess));
  }

  console.log(`\n控制台 error: ${consoleErrors.length}`);
  consoleErrors.slice(0, 8).forEach((e) => console.log("  ", e));
  console.log(`失败项: ${failures.length}`);
  failures.forEach((f) => console.log("  ✖ " + f));
  if (consoleErrors.length > 0 || failures.length > 0) process.exitCode = 1;
} finally {
  chrome.kill();
}
