/**
 * 内容数据访问层
 * 全站唯一的数据入口：页面只能通过本模块取数据，不直接 import JSON，
 * 未来换成 Markdown / 数据库时只需替换本文件的实现。
 */
import taxonomyData from "../data/taxonomy.json";
import methodsData from "../data/methods.json";
import figuresData from "../data/figures.json";

export type ContentStatus = "complete" | "draft" | "stub" | "planned";

export interface Domain {
  slug: string;
  order: number;
  name: string;
  nameEn: string;
  summary: string;
  status: ContentStatus;
  href: string;
  topics: { label: string; href: string | null }[];
  related: string[];
}

export interface EngineeringTopic {
  slug: string;
  order: number;
  name: string;
  summary: string;
  status: ContentStatus;
  /** 工序定位：这一段工序在整个开采流程中解决什么问题 */
  intro: string;
  /** 本专题收录的内容条目。只列结构，不含任何未核对的参数 */
  scope: { label: string; note: string }[];
  relatedDomains: string[];
  relatedMethods: string[];
  relatedFigures: string[];
  /** 与「知识体系」的分工说明，避免读者以为两处是两份内容 */
  xrefNote: string;
}

export interface MethodCategory {
  slug: string;
  order: number;
  name: string;
  nameEn: string;
  summary: string;
  applicability: string;
  status: ContentStatus;
}

export interface Method {
  slug: string;
  category: string;
  order: number;
  name: string;
  nameEn: string;
  status: ContentStatus;
  summary: string;
  variantOf?: string;
  /** 变体的判别说明，只有变体条目才有；模板不含任何写死的判别文案 */
  variantNote?: string;
  /** 三维模型接入契约 v2（2026-11-21 程序化建模方案 §3.3） */
  model?: {
    status: "planned" | "placeholder" | "loading" | "ready" | "error";
    /** 数据源：procedural = registry builder 现场生成；缺省 glb = 兼容旧条目 */
    source?: "procedural" | "glb";
    glb?: string | null;
    poster?: string;
    bytes?: number;
    /**
     * az/el 为绕 Y 轴的方位角与仰角（度），查看器按包围盒自动定距。
     * procedural 条目附 variant（剖面变体 iso/long/cross）与可选 focus（细部焦点，
     * 值 = builder focusPoints 键名）。
     */
    presets?: { id: string; label: string; az: number; el: number; variant?: "iso" | "long" | "cross"; focus?: string }[];
    /** 图层名 = 节点名 L_<名>，与 builder LAYERS 逐字一致；「围岩」默认关 */
    layers?: string[];
    /** 工艺阶段关键帧（滚动演示）：label=黑色标题，note=阶段说明；与 builder STAGES 逐字对应 */
    stages?: { label: string; note?: string }[];
    /** 仅 glb 条目：Blender 世界坐标（Z 向上），查看器转 three；procedural 锚点由 builder 返回，不进 JSON */
    anchors?: { label: string; pos: [number, number, number] }[];
    bbox?: { min: [number, number, number]; max: [number, number, number] };
    updated?: string;
  };
  /** 首屏四参数的选取（名字 + 可选来源类型），数值本身在 data/engineering 里 */
  headline?: { name: string; type?: string }[];
  /**
   * 速查与卡片标签用的适用条件枚举，必须能追到 engineering_data.json → applicability。
   * 没有核对过的方法不要填——宁可在速查里查不到，也不拿草稿条件当推荐依据。
   */
  conditions?: {
    dip?: string[];
    thickness?: string[];
    rock?: string[];
    source?: string;
  };
  /** 首页 30 秒层的样板方法：全站应只有一条 */
  flagship?: boolean;
  updated?: string;
}

export interface Figure {
  id: string;
  order: number;
  title: string;
  caption: string;
  src: string;
  width: number;
  height: number;
  kind: string;
  source: string;
  method: string;
  figureNo: string;
  featured: boolean;
}

const byOrder = <T extends { order: number }>(list: T[]) =>
  [...list].sort((a, b) => a.order - b.order);

export const domains = byOrder(taxonomyData.domains as Domain[]);
export const engineeringTopics = byOrder(
  taxonomyData.engineeringTopics as EngineeringTopic[]
);
export const methodCategories = byOrder(
  taxonomyData.methodCategories as MethodCategory[]
);

/** 大类顺序索引：methods.json 里的 order 在每个大类内独立计数，排序必须先按大类归组 */
const categoryRank = new Map(methodCategories.map((c) => [c.slug, c.order]));

export const methods = [...(methodsData.methods as Method[])].sort(
  (a, b) =>
    (categoryRank.get(a.category) ?? 99) - (categoryRank.get(b.category) ?? 99) ||
    a.order - b.order
);
export const figures = byOrder(figuresData.figures as Figure[]);
export const figuresUpdated = figuresData.updated;

/** 状态文案与样式，集中一处，避免各页面自行解释状态 */
export const statusMeta: Record<ContentStatus, { label: string; chip: string }> = {
  // 四态用「底色 + 文字」区分：已完成走实测绿，编写中走强调金，其余走中性
  complete: { label: "已完成", chip: "border-badge-sg/25 bg-badge-sg-bg text-badge-sg" },
  draft: { label: "编写中", chip: "border-accent/30 bg-accent-soft text-accent-strong" },
  stub: { label: "待补充", chip: "border-line bg-panel text-ink-3" },
  planned: { label: "建设中", chip: "border-line bg-transparent text-ink-4" },
};

export function getDomain(slug: string): Domain | undefined {
  return domains.find((d) => d.slug === slug);
}

/** 知识方向入口：地下采矿方法直接指向方法库，避免正文重复建设 */
export function domainHref(domain: Domain): string {
  return domain.slug === "underground-mining" ? "/methods/" : `/knowledge/${domain.slug}/`;
}

/** 工程专题地址。专题页已独立成页，不再用锚点 */
export function engineeringHref(slug: string): string {
  return `/engineering/${slug}/`;
}

export function getEngineeringTopic(slug: string): EngineeringTopic | undefined {
  return engineeringTopics.find((t) => t.slug === slug);
}

/** 专题页用：按 slug 批量取知识方向 */
export function domainsBySlugs(slugs: string[]): Domain[] {
  return slugs.map((s) => getDomain(s)).filter((d): d is Domain => !!d);
}

/** 专题页用：按 slug 批量取采矿方法 */
export function methodsBySlugs(slugs: string[]): Method[] {
  return slugs.map((s) => methodBySlug(s)).filter((m): m is Method => !!m);
}

/** 专题页用：按 id 批量取图解 */
export function figuresByIds(ids: string[]): Figure[] {
  return ids.map((id) => figures.find((f) => f.id === id)).filter((f): f is Figure => !!f);
}

/** 知识方向关联的工程专题，用于「工程视角」交叉引用 */
export function engineeringOfDomain(domain: Domain): EngineeringTopic[] {
  return engineeringTopics.filter((t) => t.relatedDomains.includes(domain.slug));
}

/** 详情页的内容清单：13 段结构 + 该段当前是否有已核对内容 */
export const ARTICLE_SECTIONS = [
  "基本信息",
  "知识简介",
  "基本原理",
  "适用条件",
  "采准与切割工程",
  "回采工艺",
  "主要工程结构",
  "三维工程模型",
  "优缺点分析",
  "典型工程案例",
  "工程示意图",
  "相关知识",
  "参考文献与资料来源",
] as const;


/** 方法详情地址。第四轮上线后此处即最终地址，无需改动调用方 */
export function methodHref(method: Method): string {
  return `/methods/${method.category}/${method.slug}/`;
}

export function methodsOfCategory(categorySlug: string): Method[] {
  return methods.filter((m) => m.category === categorySlug);
}

export function categoryBySlug(slug: string): MethodCategory | undefined {
  return methodCategories.find((c) => c.slug === slug);
}

export function methodBySlug(slug: string): Method | undefined {
  return methods.find((m) => m.slug === slug);
}

/** 变体指向的父方法；非变体返回 undefined */
export function parentMethod(method: Method): Method | undefined {
  return method.variantOf ? methodBySlug(method.variantOf) : undefined;
}

/** 某方法名下的变体列表 */
export function variantsOf(slug: string): Method[] {
  return methods.filter((m) => m.variantOf === slug);
}

/** 同大类下的其它方法，用于「同族方法」导航 */
export function siblingsOf(method: Method): Method[] {
  return methods.filter((m) => m.category === method.category && m.slug !== method.slug);
}

/** 每个大类的正文进度（已有正文的条目数），形如 6/6 */
export function categoryProgress(categorySlug: string): string {
  const list = methodsOfCategory(categorySlug);
  const done = list.filter((m) => m.status === "complete" || m.status === "draft").length;
  return `${done}/${list.length}`;
}

/** 正文条目统计：已完成 / 编写中，用于索引页的进度展示 */
export function methodStatusCount() {
  return {
    complete: methods.filter((m) => m.status === "complete").length,
    draft: methods.filter((m) => m.status === "draft").length,
    missing: methods.filter((m) => m.status === "stub" || m.status === "planned").length,
  };
}

/** 速查表数据：仅使用已结构化的字段，不含任何未核对的参数 */
export function methodIndexRows() {
  return methods.map((method) => {
    const parent = parentMethod(method);
    return {
      method,
      categoryName: categoryBySlug(method.category)?.name ?? "",
      relation: parent ? `${parent.name} 的变体` : "标准方法",
      href: methodHref(method),
    };
  });
}

/** 已完成 / 编写中的内容才进入「精选」，数据变了首页自动跟着变 */
export function featuredMethods(limit = 3): Method[] {
  const rank: Record<string, number> = { complete: 0, draft: 1, stub: 2, planned: 3 };
  return [...methods]
    .filter((m) => m.status === "complete" || m.status === "draft")
    .sort((a, b) => rank[a.status] - rank[b.status])
    .slice(0, limit);
}

/** 最近更新：方法条目优先，其次图解资产 */
export function recentUpdates(limit = 5): {
  title: string;
  type: string;
  href: string;
  date: string;
  status: ContentStatus;
}[] {
  const fromMethods = methods
    .filter((m) => m.updated)
    .map((m) => ({
      title: m.name,
      type: "采矿方法",
      href: methodHref(m),
      date: m.updated as string,
      status: m.status,
    }));
  const fromFigures = figures.map((f) => ({
    title: f.title,
    type: "工程图解",
    href: "/#figures",
    date: figuresUpdated,
    status: "complete" as ContentStatus,
  }));
  return [...fromMethods, ...fromFigures]
    .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

/** 站点统计：全部由数据推导，不手填 */
export function siteStats() {
  const { complete } = methodStatusCount();
  return [
    { value: String(domains.length), unit: "个", label: "知识方向" },
    { value: String(methods.length), unit: "项", label: "采矿方法" },
    { value: String(figures.length), unit: "幅", label: "工程图解" },
    { value: String(complete), unit: "篇", label: "已完成正文" },
  ];
}

export function relatedDomains(domain: Domain): Domain[] {
  return domain.related.map((slug) => getDomain(slug)).filter((d): d is Domain => !!d);
}

export function relatedEngineering(domain: Domain): EngineeringTopic[] {
  // 专题页改为独立地址后，从 href 反解 slug；兼容旧的锚点写法
  const slugs = new Set(
    domain.topics
      .map((t) => {
        const m = t.href?.match(/^\/engineering\/(?:#)?([a-z-]+)\/?$/);
        return m ? m[1] : null;
      })
      .filter(Boolean) as string[]
  );
  return engineeringTopics.filter((t) => slugs.has(t.slug));
}
