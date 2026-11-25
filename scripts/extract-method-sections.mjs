/**
 * 抽取方法正文小节 → src/data/method-sections.json
 * 检索索引需要「小节级」条目，但 Astro 的构建产物在 page 生成之后才有标题 id，
 * 因此在构建前从 MDX 源文件抽取标题与首句，id 规则与 rehype-slug 对齐。
 *
 * 运行：npm run build（自动经 prebuild 触发）或 node scripts/extract-method-sections.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "src/content/methods");
const outFile = path.join(root, "src/data/method-sections.json");

const stripInline = (text) =>
  text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`~]/g, "")
    .trim();

/** rehype-slug(github-slugger) 规则：先去标点（空格保留），再逐个空格转 -，重复加序号 */
const slugify = (text, used) => {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{M}\p{Pc}\- ]/gu, "")
    .replace(/ /g, "-");
  const n = used.get(base) ?? 0;
  used.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
};

const sections = [];

for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".mdx"))) {
  const slug = file.replace(/\.mdx$/, "");
  const lines = fs.readFileSync(path.join(srcDir, file), "utf8").split(/\r?\n/);
  const used = new Map();
  let h2 = "";
  let fence = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;

    const heading = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!heading) continue;

    const level = heading[1].length;
    const title = stripInline(heading[2]);
    if (!title) continue;
    if (level === 2) h2 = title;

    let excerpt = "";
    for (let j = i + 1; j < Math.min(lines.length, i + 6); j += 1) {
      const next = lines[j].trim();
      if (!next) {
        if (excerpt) break;
        continue;
      }
      if (/^(#{1,6}\s|\||<|```|import\s|export\s)/.test(next)) break;
      excerpt += (excerpt ? " " : "") + stripInline(next);
      if (excerpt.length >= 70) break;
    }

    sections.push({
      slug,
      t: title,
      level,
      h2: level === 3 ? h2 : "",
      d: excerpt.slice(0, 96),
      id: slugify(title, used),
    });
  }
}

fs.writeFileSync(
  outFile,
  JSON.stringify(
    { generated: new Date().toISOString().slice(0, 10), count: sections.length, sections },
    null,
    2
  ) + "\n",
  "utf8"
);

console.log(`[sections] ${sections.length} sections → ${path.relative(root, outFile)}`);
