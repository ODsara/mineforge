/**
 * 检索索引
 * 构建期生成静态索引，运行时在浏览器里过滤：不依赖服务端，也不引入搜索库。
 * 索引只收标题、英文名、摘要与关键词，不做正文全文检索——正文以 Markdown 存放，
 * 全文索引应当另建管道，而不是在页面里塞整篇正文。
 */
import { domains, engineeringTopics, methods, figures, methodHref, engineeringHref } from "./taxonomy";
import { glossary, references, standardDocs, textbooks, resourceTypes, resourceHref } from "./resources";

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

for (const m of methods) {
  docs.push({
    t: m.name,
    s: m.nameEn,
    d: m.summary,
    g: "采矿方法",
    h: methodHref(m),
    k: `${m.slug} ${m.variantOf ? "变体" : "标准方法"}`,
  });
}

for (const d of domains) {
  docs.push({ t: d.name, s: d.nameEn, d: d.summary, g: "知识体系", h: `/knowledge/${d.slug}/` });
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
}

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
    t: ref.title,
    s: ref.type,
    d: [ref.journal, ref.publisher, ref.year ? String(ref.year) : ""].filter(Boolean).join(" · "),
    g: "参考文献",
    h: "/resources/references/",
    k: [ref.id, ...(ref.authors ?? []), ref.code ?? ""].join(" "),
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

for (const book of textbooks) {
  docs.push({
    t: book.title,
    s: book.edition,
    d: [book.publisher, book.authors.join("、")].filter(Boolean).join(" · "),
    g: "推荐教材",
    h: "/resources/textbooks/",
    k: book.authors.join(" "),
  });
}

for (const fig of figures) {
  docs.push({
    t: fig.title,
    s: fig.figureNo,
    d: fig.caption,
    g: "工程图解",
    h: "/resources/drawings/",
    k: fig.kind,
  });
}

export const searchIndex = docs;
export const searchGroups = [
  "采矿方法",
  "知识体系",
  "工程技术",
  "专业术语",
  "标准与规范",
  "参考文献",
  "推荐教材",
  "工程图解",
  "资料中心",
];
