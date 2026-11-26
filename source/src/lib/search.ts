/**
 * 检索索引
 * 构建期生成静态索引，运行时在浏览器里过滤：不依赖服务端，也不引入搜索库。
 * 覆盖四类对象：方法条目与方法正文小节、知识体系/工程专题、资料中心（术语/文献/规范/图解/公式/参数）。
 * 正文小节从 MDX 源文件抽取标题与首句，锚点规则与 Astro 标题 id 保持一致。
 */
import methodSectionsData from "../data/method-sections.json";
import {
  domains,
  engineeringTopics,
  methods,
  figures,
  methodHref,
  engineeringHref,
  categoryBySlug,
} from "./taxonomy";
import {
  glossary,
  references,
  standardDocs,
  resourceTypes,
  resourceHref,
  clauses,
  formulas,
  parameters,
} from "./resources";

export interface SearchDoc {
  t: string;
  /** 英文名或副标题 */
  s?: string;
  d?: string;
  g: string;
  h: string;
  k?: string;
}

const docs: SearchDoc[] = [];

/* ---------------- 采矿方法条目 ---------------- */

for (const m of methods) {
  docs.push({
    t: m.name,
    s: m.nameEn,
    d: m.summary,
    g: "采矿方法",
    h: methodHref(m),
    k: `${m.slug} ${m.variantOf ? "变体" : "标准方法"} ${categoryBySlug(m.category)?.name ?? ""}`,
  });
}

/* ---------------- 方法正文小节（MDX 标题） ---------------- */

/**
 * 小节索引由 scripts/extract-method-sections.mjs 在构建前生成：
 * 标题 id 与 Astro(rehype-slug) 规则一致，构建后用 scripts/check-search-anchors.mjs 校验。
 */
type SectionRow = { slug: string; t: string; level: number; h2: string; d: string; id: string };

const methodSections = (methodSectionsData as { sections: SectionRow[] }).sections;

for (const s of methodSections) {
  const method = methods.find((m) => m.slug === s.slug);
  if (!method) continue;

  docs.push({
    t: s.t,
    s: s.level === 3 && s.h2 ? `${method.name} · ${s.h2}` : method.name,
    d: s.d,
    g: "方法正文",
    h: `${methodHref(method)}#${s.id}`,
    k: `${method.name} ${method.nameEn} ${categoryBySlug(method.category)?.name ?? ""}`,
  });
}

/* ---------------- 知识体系 / 工程技术 ---------------- */

for (const d of domains) {
  docs.push({ t: d.name, s: d.nameEn, d: d.summary, g: "知识体系", h: `/knowledge/${d.slug}/` });

  for (const [i, topic] of d.topics.entries()) {
    const paragraphs = topic.body;
    if (!paragraphs?.length) continue;
    docs.push({
      t: `${d.name} · ${topic.label}`,
      s: d.name,
      d: paragraphs.join(" "),
      g: "知识体系正文",
      h: `/knowledge/${d.slug}/#${d.slug}-${i + 1}`,
      k: `${d.name} ${topic.label}`,
    });
  }
}

for (const t of engineeringTopics) {
  docs.push({
    t: t.name,
    s: "工程技术专题",
    d: t.summary,
    g: "工程技术",
    h: engineeringHref(t.slug),
    k: t.scope.map((s) => s.label).join(" "),
  });

  for (const [i, section] of t.scope.entries()) {
    const paragraphs = section.body;
    if (!paragraphs?.length) continue;
    docs.push({
      t: `${t.name} · ${section.label}`,
      s: t.name,
      d: paragraphs.join(" "),
      g: "工程技术正文",
      h: `${engineeringHref(t.slug)}#${t.slug}-${i + 1}`,
      k: `${t.name} ${section.label} ${t.summary}`,
    });
  }
}

/* ---------------- 资料中心 ---------------- */

for (const type of resourceTypes) {
  docs.push({ t: type.name, s: type.nameEn, d: type.summary, g: "资料中心", h: resourceHref(type.slug) });
}

glossary.forEach((entry, i) => {
  docs.push({
    t: entry.term,
    s: entry.termEn,
    d: entry.definition,
    g: "专业术语",
    h: `/resources/glossary/#term-${i}`,
    k: entry.group,
  });
});

for (const ref of references) {
  docs.push({
    t: ref.title ?? "",
    s: ref.type ?? "参考文献",
    d: [ref.methodName, ref.journal, ref.publisher, ref.year ? String(ref.year) : ""]
      .filter(Boolean)
      .join(" · "),
    g: "参考文献",
    h: "/resources/references/",
    k: [ref.id, ...(ref.authors ?? []), ref.code ?? "", ref.methodName].join(" "),
  });
}

for (const doc of standardDocs) {
  docs.push({
    t: `${doc.code} ${doc.name}`,
    s: doc.status,
    d: doc.scope,
    g: "标准与规范",
    h: "/resources/standards/",
    k: doc.code,
  });
}

/** 条文锚点：与 StandardIndex 的 anchorOf 保持一致 */
const clauseAnchor = (clause: string): string =>
  clause
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\p{Pc}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "misc";

const seenClause = new Set<string>();
for (const c of clauses) {
  const key = `${c.code}|${c.clause}`;
  if (seenClause.has(key)) continue;
  seenClause.add(key);
  const standardName = standardDocs.find((d) => d.code === c.code)?.name ?? c.name ?? "";
  docs.push({
    t: `${c.code} ${c.clause}`,
    s: standardName,
    d: c.text ?? c.note ?? "",
    g: "规范条文",
    h: `/resources/standards/#clause-${clauseAnchor(c.clause)}`,
    k: `${c.code} ${c.clause} ${c.methodName}`,
  });
}

for (const fig of figures) {
  docs.push({
    t: fig.title,
    s: fig.figureNo,
    d: fig.caption,
    g: "工程图解",
    h: `/resources/drawings/#${fig.id}`,
    k: fig.kind,
  });
}

/* --------- 公式与参数：作业里最常查的两类数字 --------- */

for (const f of formulas) {
  docs.push({
    t: f.name,
    s: `公式 · ${f.kind}`,
    d: f.note,
    g: "公式与参数",
    h: `/resources/formulas/#formula-${f.id}`,
    k: f.vars.map((v) => `${v.name} ${v.sym}`).join(" "),
  });
}

for (const p of parameters) {
  docs.push({
    t: p.name,
    s: `${p.methodName} · ${p.value_type}`,
    d: `${p.value}${p.unit && p.unit !== "—" ? ` ${p.unit}` : ""}${p.condition ? `｜${p.condition}` : ""}`,
    g: "公式与参数",
    h: `/resources/formulas/#param-${p.pid}`,
    k: `${p.methodName} ${p.source} ${p.note ?? ""} ${p.condition ?? ""}`,
  });
}

export const searchIndex = docs;

export const searchGroups = [
  "采矿方法",
  "方法正文",
  "专业术语",
  "知识体系",
  "知识体系正文",
  "工程技术",
  "工程技术正文",
  "标准与规范",
  "规范条文",
  "公式与参数",
  "参考文献",
  "工程图解",
  "资料中心",
];
