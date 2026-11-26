/**
 * 资料中心数据访问层
 * 与 lib/taxonomy.ts 同样的约定：页面只调用本模块，不直接读 JSON。
 *
 * 资料的三个来源合并在这里：
 *   1. resources.json          —— 术语、规范清单、公式待收录清单
 *   2. data/engineering/*.json —— 各方法已冻结的文献、条文摘录与参数（新增方法自动进资料中心）
 *   3. data/figures.json       —— 工程图纸索引
 * 因此新增一篇方法正文后，资料中心不需要任何改动。
 */
import resourcesData from "../data/resources.json";
import { figures, methodBySlug, type ContentStatus } from "./taxonomy";

export interface ResourceType {
  slug: string;
  order: number;
  name: string;
  nameEn: string;
  summary: string;
  status: ContentStatus;
}

export interface GlossaryEntry {
  term: string;
  termEn: string;
  group: string;
  definition: string;
  source: string;
  verified: boolean;
}

export interface Reference {
  key: string;
  id: string;
  methodSlug: string;
  methodName: string;
  type: string;
  title: string;
  authors: string[];
  publisher?: string;
  journal?: string;
  school?: string;
  institution?: string;
  year?: number | null;
  isbn?: string;
  doi?: string;
  url?: string;
  pages?: string;
  chapter?: string;
  code?: string;
  tier: number;
  caveat?: string;
}

export interface StandardDoc {
  code: string;
  name: string;
  status: string;
  effective: string | null;
  scope: string;
  note: string;
  verified: boolean;
}

export interface Clause {
  code: string;
  name: string;
  clause: string;
  /** 已核对原文的条文摘录；只有 note 的条目尚未摘原文，不冒充条文 */
  text?: string;
  /** 未摘原文时记录本站核对到的要点，页面明示「未摘原文」 */
  note?: string;
  methodSlug: string;
  methodName: string;
}

export interface Param {
  name: string;
  value: string;
  unit: string;
  value_type: string;
  source: string;
  condition?: string;
  note?: string;
  methodSlug: string;
  methodName: string;
  /** 参数库锚点 id（param-<pid>），供检索直接跳转到表格行 */
  pid?: string;
}

interface EngineeringBundle {
  references?: Omit<Reference, "key" | "methodSlug" | "methodName">[];
  standards?: { code: string; name: string; clause: string; text: string }[];
  parameters?: Omit<Param, "methodSlug" | "methodName">[];
}

const bundles = Object.entries(
  import.meta.glob<{ default: EngineeringBundle }>("../data/engineering/*.json", { eager: true })
).map(([path, mod]) => ({
  slug: path.split("/").pop()!.replace(/\.json$/, ""),
  data: mod.default,
}));

/** 可信度分级：数字越小越接近一手来源，正文与资料中心共用同一套解释 */
export const tierMeta: Record<number, { label: string; desc: string }> = {
  0: { label: "一级 · 教材原文", desc: "已逐页核对页码的教材或专著" },
  1: { label: "二级 · 同行评议", desc: "期刊论文、学位论文、国家标准" },
  2: { label: "三级 · 官方文件", desc: "技术报告、储量报告、设计文件、科普条目" },
  3: { label: "四级 · 旁证", desc: "百科与行业媒体，仅作术语旁证" },
};

export interface Formula {
  id: string;
  name: string;
  /** 定义式 / 力学平衡式 —— 只有这两类允许进库，含经验系数的公式须先核对原文 */
  kind: string;
  /** LaTeX 源，由 KaTeX 在构建期渲染；数据层不存排版后的 HTML */
  tex: string;
  vars: { sym: string; name: string; unit: string }[];
  note: string;
  source: string;
}

export const resourceTypes = [...(resourcesData.types as ResourceType[])].sort(
  (a, b) => a.order - b.order
);

export const glossary = resourcesData.glossary as GlossaryEntry[];
export const glossaryGroups = [...new Set(glossary.map((g) => g.group))];
export const formulas = resourcesData.formulas.items as Formula[];
export const plannedFormulas = resourcesData.formulas.planned as {
  name: string;
  use: string;
}[];
export const formulaIntro = resourcesData.formulas.intro;
export const standardDocs = resourcesData.standards as StandardDoc[];
export const resourcesUpdated = resourcesData.updated;

export function resourceType(slug: string): ResourceType | undefined {
  return resourceTypes.find((t) => t.slug === slug);
}

export function resourceHref(slug: string): string {
  return `/resources/${slug}/`;
}

/** 全站文献汇总：每个方法的参考文献带方法上下文，避免不同方法的 R0 混淆 */
export const references: Reference[] = bundles
  .flatMap(({ slug, data }) => {
    const name = methodBySlug(slug)?.name ?? slug;
    return (data.references ?? []).map((ref) => ({
      ...(ref as Omit<Reference, "key" | "methodSlug" | "methodName">),
      key: `${slug}:${ref.id}`,
      id: ref.id,
      methodSlug: slug,
      methodName: name,
    }));
  })
  .sort((a, b) => a.tier - b.tier || a.key.localeCompare(b.key));

export const clauses: Clause[] = bundles
  .flatMap(({ slug, data }) => {
    const name = methodBySlug(slug)?.name ?? slug;
    return (data.standards ?? []).map((c) => ({
      ...c,
      methodSlug: slug,
      methodName: name,
    }));
  })
  .sort((a, b) => a.code.localeCompare(b.code) || a.clause.localeCompare(b.clause));

/** 某部规范已摘录的条文 */
export function clausesOf(code: string): Clause[] {
  return clauses.filter((c) => c.code === code);
}

export const parameters: Param[] = bundles.flatMap(({ slug, data }) => {
  const name = methodBySlug(slug)?.name ?? slug;
  return (data.parameters ?? []).map((p, i) => ({
    ...p,
    methodSlug: slug,
    methodName: name,
    pid: `${slug}-${String(i + 1).padStart(2, "0")}`,
  }));
});

/** 参数按来源类型分组，顺序固定，避免每次渲染顺序漂移 */
const PARAM_ORDER = ["教材值", "规范值", "设计值", "实测值", "国际实践值"];
export const parameterGroups = PARAM_ORDER.map((type) => ({
  type,
  items: parameters.filter((p) => p.value_type === type),
})).filter((g) => g.items.length > 0);

/** 图纸索引：只取已入站的工程图解 */
export const drawings = figures.map((f) => ({
  id: f.id,
  figureNo: f.figureNo,
  title: f.title,
  caption: f.caption,
  src: f.src,
  width: f.width,
  height: f.height,
  kind: f.kind,
  source: f.source,
  methodSlug: f.method,
  methodName: methodBySlug(f.method)?.name ?? f.method,
}));

/** 每类资料的条目数，显示在总览卡上 */
export function resourceCount(): Record<string, number> {
  return {
    glossary: glossary.length,
    formulas: parameters.length + formulas.length,
    drawings: drawings.length,
    references: references.length,
    standards: standardDocs.length + clauses.length,
  };
}

export const formulaNote = {
  intro: formulaIntro,
  params: parameterGroups.reduce((n, g) => n + g.items.length, 0),
};
