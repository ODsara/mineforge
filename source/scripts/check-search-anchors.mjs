/**
 * 构建后校验检索索引与锚点：
 * 1. 索引条目都有标题；2. 所有带 # 的链接在目标页存在对应 id。
 * 用法：npm run build && npm run test:anchors
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const html = fs.readFileSync(path.join(dist, "search/index.html"), "utf8");
const match = /<script id="search-index" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
if (!match) throw new Error("search/index.html 中未找到 #search-index");

const docs = JSON.parse(match[1]);
const byGroup = {};
for (const d of docs) byGroup[d.g] = (byGroup[d.g] || 0) + 1;

const missingTitle = docs.filter((d) => !d.t);
if (missingTitle.length) {
  console.error(`✗ ${missingTitle.length} 条索引缺标题`);
  process.exit(1);
}

const idCache = new Map();
const idsOf = (file) => {
  if (idCache.has(file)) return idCache.get(file);
  const target = path.join(dist, file);
  const text = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  const ids = new Set([...text.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  idCache.set(file, ids);
  return ids;
};

let checked = 0;
const broken = [];
for (const d of docs) {
  if (!d.h.includes("#")) continue;
  const [rawPath, hash] = d.h.split("#");
  const file = rawPath.replace(/^\//, "").replace(/\/$/, "") + "/index.html";
  checked += 1;
  if (!idsOf(file).has(hash)) broken.push(`${d.g} | ${d.t} | ${d.h}`);
}

console.log(`索引 ${docs.length} 条`, byGroup);
console.log(`锚点 ${checked} 个，失效 ${broken.length} 个`);
for (const b of broken.slice(0, 40)) console.log("  ✗", b);
if (broken.length) process.exit(1);
