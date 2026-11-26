/**
 * 设计度量审计：用 DOM 几何 + 计算样式客观量化"视觉层级/节奏/密度"问题。
 * 用法：node scripts/design-audit.mjs [baseUrl] [outFile]
 * 每路由在 1440 与 375 下采集：
 *  - 区块序列（section/直接子块）：bbox、背景色、高度 → 背景交替与节奏
 *  - 标题树：h1-h4 计算字号/字重/字体/颜色 → 层级差距
 *  - 卡片计数：带边框+圆角的盒状元素 → 重复卡片密度
 *  - 图片/三维：数量与尺寸
 *  - 正文文本色对比度（WCAG sRGB 公式）
 *  - 移动端触控目标 <44px、字号 <12px 统计
 */
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BASE = process.argv[2] ?? "http://localhost:4321";
const OUT = path.resolve(process.argv[3] ?? ".design/audit-before.json");
const PORT = 9352;
const ROUTES = [
  ["home", "/"], ["methods", "/methods/"], ["cat-open", "/methods/open-stope/"],
  ["d-room-pillar", "/methods/open-stope/room-pillar/"], ["d-shrinkage", "/methods/open-stope/shrinkage/"],
  ["d-sublevel-drilling", "/methods/open-stope/sublevel-drilling-stage-room/"],
  ["knowledge", "/knowledge/"], ["domain", "/knowledge/development/"],
  ["engineering", "/engineering/"], ["topic", "/engineering/preparation-cutting/"],
  ["resources", "/resources/"], ["res-glossary", "/resources/glossary/"],
  ["about", "/about/"], ["search", "/search/"], ["404", "/404.html"],
];
const CANDIDATES = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"];
const browserPath = CANDIDATES.find((p) => existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PROBE = `(() => {
  const cs = (el) => getComputedStyle(el);
  const rgb = (s) => { const m = s.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x=>parseFloat(x)); return {r:p[0],g:p[1],b:p[2],a:p[3]===undefined?1:p[3]}; };
  const lum = (c) => { const f = (v) => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
  const contrast = (a,b) => { const l1=lum(a),l2=lum(b); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };
  const hex = (c) => c? '#'+[c.r,c.g,c.b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('') : null;
  const bgOf = (el) => { let n=el; while(n && n!==document.documentElement){ const c=rgb(cs(n).backgroundColor); if(c && c.a>0.5) return c; n=n.parentElement; } return {r:255,g:255,b:255,a:1}; };

  // 区块序列：main 下每个 section 及文章主要块
  const main = document.querySelector('main');
  const blocks = [...main.querySelectorAll(':scope > section, :scope > div, :scope > article')].map(el => {
    const r = el.getBoundingClientRect(); const c = rgb(cs(el).backgroundColor);
    return { tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,60), top: Math.round(r.top+scrollY), h: Math.round(r.height), bg: c&&c.a>0.5?hex(c):null };
  });

  // 标题树
  const heads = [...document.querySelectorAll('h1,h2,h3,h4')].slice(0,60).map(el => {
    const s = cs(el); const r = el.getBoundingClientRect();
    return { tag: el.tagName.toLowerCase(), text: el.innerText.slice(0,30), size: parseFloat(s.fontSize), weight: s.weight||s.fontWeight, family: s.fontFamily.split(',')[0].replace(/"/g,''), color: hex(rgb(s.color)), top: Math.round(r.top+scrollY) };
  });

  // 卡片密度：边框+圆角>=8 的盒
  const cards = [...document.querySelectorAll('a,div,article,section,li,details')].filter(el => {
    const s = cs(el); const r = el.getBoundingClientRect();
    return parseFloat(s.borderTopWidth)>0 && parseFloat(s.borderTopLeftRadius)>=8 && r.width>120 && r.height>60 && r.width<innerWidth*0.95;
  });
  const cardSizes = cards.slice(0,80).map(el=>{const r=el.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)};});

  // 图片与三维
  const imgs = [...document.querySelectorAll('img')].map(el=>{const r=el.getBoundingClientRect();return {src:(el.getAttribute('src')||'').split('/').pop(),w:Math.round(r.width),h:Math.round(r.height),alt:(el.alt||'').slice(0,20)};});
  const models = [...document.querySelectorAll('[data-mf-model]')].map(el=>{const r=el.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)};});

  // 正文对比度抽样
  const texts = [...document.querySelectorAll('p,li,td,dd,dt,span,a')].slice(0,400).map(el=>{
    const s=cs(el); const c=rgb(s.color); if(!c||c.a<0.5) return null; const bg=bgOf(el);
    const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) return null;
    return { size: parseFloat(s.fontSize), ratio: Math.round(contrast(c,bg)*100)/100, color: hex(c), bg: hex(bg) };
  }).filter(Boolean);
  const lowContrast = texts.filter(t=>t.size<18 && t.ratio<4.5);
  const tinyText = texts.filter(t=>t.size<12);

  // 触控目标（仅移动端有意义）
  const clickables = [...document.querySelectorAll('a,button,select,input,summary')].map(el=>{const r=el.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),tag:el.tagName.toLowerCase()};}).filter(x=>x.w>0&&x.h>0);
  const smallTargets = clickables.filter(x=>x.h<40||x.w<40);

  // 留白：相邻区块间距
  const gaps = [];
  for(let i=1;i<blocks.length;i++){ gaps.push(blocks[i].top-(blocks[i-1].top+blocks[i-1].h)); }

  return JSON.stringify({
    url: location.pathname, vw: innerWidth, pageH: document.body.scrollHeight,
    blocks, heads, cardCount: cards.length, cardSizes, imgs, models,
    lowContrastCount: lowContrast.length, lowContrastSample: lowContrast.slice(0,8),
    tinyTextCount: tinyText.length, smallTargetCount: smallTargets.length, smallTargetSample: smallTargets.slice(0,8),
    clickableCount: clickables.length, gaps,
    bodyBg: hex(rgb(cs(document.body).backgroundColor)),
  });
})()`;

async function discover() {
  for (let i = 0; i < 80; i++) {
    try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); const p = l.find(t=>t.type==='page'); if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl; } catch {}
    await sleep(250);
  }
  throw new Error("CDP 未就绪");
}
class CDP { #ws;#id=0;#p=new Map();
  static async connect(u){const c=new CDP();c.#ws=new WebSocket(u);await new Promise((res,rej)=>{c.#ws.onopen=res;c.#ws.onerror=rej;});c.#ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&c.#p.has(m.id)){const{resolve,reject}=c.#p.get(m.id);c.#p.delete(m.id);m.error?reject(new Error(m.error.message)):resolve(m.result);}};return c;}
  send(method,params={}){const id=++this.#id;return new Promise((res,rej)=>{this.#p.set(id,{resolve:res,reject:rej});this.#ws.send(JSON.stringify({id,method,params}));});}
}
const chrome = spawn(browserPath, ["--headless=new",`--remote-debugging-port=${PORT}`,`--user-data-dir=${path.join(os.tmpdir(),"mf-audit2-profile")}`,"--no-first-run","--no-default-browser-check","--disable-gpu","--hide-scrollbars","about:blank"],{stdio:"ignore"});
const out = {};
try {
  const cdp = await CDP.connect(await discover());
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable");
  for (const [name, route] of ROUTES) {
    out[name] = {};
    for (const width of [1440, 375]) {
      await cdp.send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<768});
      await cdp.send("Page.navigate",{url:BASE+route}); await sleep(1400);
      // 强制终态
      await cdp.send("Runtime.evaluate",{expression:`document.documentElement.classList.remove("mf-anim");document.querySelectorAll("[data-reveal],[data-reveal] *").forEach(el=>el.classList.add("is-in"));`});
      await sleep(200);
      const r = await cdp.send("Runtime.evaluate",{expression:PROBE,returnByValue:true});
      out[name][width] = JSON.parse(r.result.value);
      const d = out[name][width];
      console.log(`${name.padEnd(20)} ${width}px  cards=${String(d.cardCount).padStart(3)} imgs=${String(d.imgs.length).padStart(2)} models=${d.models.length} lowContrast=${d.lowContrastCount} tiny=${d.tinyTextCount} smallTarget=${d.smallTargetCount}/${d.clickableCount} pageH=${d.pageH}`);
    }
  }
  await mkdir(path.dirname(OUT),{recursive:true});
  await writeFile(OUT, JSON.stringify(out,null,2));
  console.log("写入", OUT);
} catch(e){ console.error(e); } finally { chrome.kill(); }