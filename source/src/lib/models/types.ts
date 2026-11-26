/**
 * 程序化建模类型定义（采矿方法 three.js 建模方案 §3.2 / §3.10）
 *
 * 坐标系（方案 §3.5，全站统一）：
 *   Y 轴垂直向上；X = 走向（+X 为矿块右翼）；Z 水平指向下盘（倾向 = −Z）。
 *   倾斜体一律水平生成后经 geo.tilt() 绕 X 轴旋转 −δ，builder 内禁裸三角函数。
 * 单位：米。原点：运输巷道底板中线（各 builder 如有出入须在本文件 PARAMS 注释说明）。
 */
import type * as THREE from "three";

/** 受控图层词表（2026-11-23 模型替换轮：对齐 mining-methods-3d 引擎岩矿图层）
 *  ore/rock/drift/stope/pillar/fill/muck/cut/shaft/lod2 → 中文；「标注」不进按钮（走锚点体系）。 */
export const LAYER_NAMES = [
  "矿体",
  "围岩",
  "巷道",
  "采场空区",
  "矿柱",
  "充填体",
  "崩落体",
  "切割工程",
  "井筒",
  "辅助细节",
] as const;

export type LayerName = (typeof LAYER_NAMES)[number];

/** 剖面变体：iso 等轴测 / long 纵剖（过矿房中心，沿走向看）/ cross 横剖（x=X_CUT 过矿柱中心） */
export type BuildVariant = "iso" | "long" | "cross";

export interface BuildOpts {
  variant?: BuildVariant;
  /** 「细部」预设的相机目标：builder 返回的 focusPoints 键名（如 "底柱"） */
  focus?: string;
  /**
   * 工艺阶段（1..STAGES.length）：开拓阶段巷道逐步出现、回采阶段矿体逐步采出。
   * 缺省 = 末阶段（验收通过的现状态）。stage 参数只改变几何/可见性，不改巷道布局与尺寸。
   */
  stage?: number;
  /** 原始工序的 1-based 下标，优先于用于概览的 stage。 */
  step?: number;
}

export interface ModelAnchor {
  label: string;
  /** three 世界坐标（米）。程序化锚点即 three 原生 Y-up，无需再转换 */
  pos: [number, number, number];
  layer?: LayerName;
}

export interface BBox {
  min: [number, number, number];
  max: [number, number, number];
}

export interface ModelBuildResult {
  /** 已按 L_<图层名> 分组挂好的整棵场景树 */
  group: THREE.Group;
  /** 标注锚点（每法 ≤8，授权书 §7 硬性要求） */
  anchors: ModelAnchor[];
  /** 可见内容的包围盒（程序化即建即算，不进 JSON） */
  bbox: BBox;
  /** focus 预设的目标点表：键 = methods.json presets[].focus 的值 */
  focusPoints?: Record<string, [number, number, number]>;
}

export interface ModelBuilder {
  /** 教材参数：值 + src 出处注释（书 p××× / 示意 / 工程经验），builder 只读它 */
  PARAMS: Record<string, (number | string) & { src?: string }> | Record<string, unknown>;
  /** 图层名数组（受控词表子集，4-7 个，与 methods.json layers 逐字一致） */
  LAYERS: LayerName[];
  build(opts?: BuildOpts): ModelBuildResult;
  /** 自检：图层名合法、锚点数 ≤8、bbox 有效、几何无 NaN。测试与 P0/T8 校验共用 */
  selfCheck?(): string[];
}

/** registry 条目：slug → builder（静态映射，方案 §3.2） */
export type ModelRegistry = Record<string, ModelBuilder>;
