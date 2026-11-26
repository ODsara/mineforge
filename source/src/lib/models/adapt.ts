/**
 * 引擎适配层（2026-11-23 模型替换轮）
 *
 * 把 F:\采矿方法建模\mining-methods-3d 的 15 个教学模型模块
 * （meta + build(M)，英文图层键、process 工序步骤、DOM 标注）
 * 包装成网站 ModelBuilder 契约：
 *   - 图层：meta.layers 英文键 → 受控中文词表，节点改名 L_<中文名>，围岩排最后；
 *   - 阶段：step 逐步回放，stage 映射到概览关键帧；
 *   - 剖面：variant iso/long/cross → 引擎共享裁剪平面（materials 级 clippingPlanes）；
 *   - 标注：labels 图层锚点（pri 优先）截取 ≤8 个 → anchors；
 *   - 细部：关键构造层体积最大实体 → focusPoints['细部']。
 * 材质、纹理和环境贴图经 engine/bootstrap.js 单例共享，逐次 build 只重建几何。
 */
import * as THREE from "three";
import { getEngine } from "./engine/bootstrap.js";
import { LAYER_NAMES, type LayerName, type ModelAnchor, type ModelBuildResult, type BuildOpts } from "./types.ts";

/** 引擎方法模块（JS，无类型声明）的最小接口 */
interface EngineStep {
  title: string;
  desc?: string;
  phase?: string;
}
interface EngineApi {
  group: THREE.Group;
  layers: Record<string, THREE.Group>;
  registry: { objects: unknown[] };
  update(p: number): void;
  bounds: THREE.Box3;
  /** 自由探索进程 → 档位名（独立版 main.js progressText 的第一优先通道） */
  progressText?(p: number): string;
  stageIndex?(p: number): number;
  process: {
    steps: EngineStep[];
    apply(i: number): void;
    reset(): void;
    stepDuration?: number;
  };
}
export interface EngineDef {
  meta: {
    code: string;
    name: string;
    layers: string[];
    params?: [string, string, string][];
    camera?: { pos: number[]; target: number[] };
    defaults?: { cut?: number; progress?: number };
    /** 自由探索模式的连续进程档位名（独立版 progressText 的兜底表） */
    stages?: string[];
  };
  build(M: Record<string, unknown>): EngineApi;
}

/** 引擎图层键 → 网站受控词表（新模型体系的岩矿色谱图层） */
export const LAYER_CN: Record<string, LayerName> = {
  ore: "矿体",
  rock: "围岩",
  drift: "巷道",
  stope: "采场空区",
  pillar: "矿柱",
  fill: "充填体",
  muck: "崩落体",
  cut: "切割工程",
  shaft: "井筒",
  lod2: "辅助细节",
};

/** 引擎图层键（剔除 labels：标注由查看器 anchor 体系呈现，不做图层按钮）→ 中文名，围岩末位 */
export function layersOf(def: EngineDef): LayerName[] {
  const cn = def.meta.layers
    .filter((k) => k !== "labels" && LAYER_CN[k])
    .map((k) => LAYER_CN[k]);
  const i = cn.indexOf("围岩");
  if (i >= 0) {
    cn.splice(i, 1);
    cn.push("围岩");
  }
  return cn;
}

/** 默认关闭的图层：与引擎 initState 规则一致（围岩、LOD2 辅助细节） */
export function layersOffOf(def: EngineDef): string[] {
  const cn = layersOf(def);
  return cn.filter((l) => l === "围岩" || l === "辅助细节");
}

/**
 * 开拓过程细化（11/23 细化轮）：引擎每法只写了一步 dev（一次 reveal 全部开拓工程）；
 * 网站滚动关键帧按其内部对象的工程类别拆为 2~3 档，推进次序按教材开拓顺序
 * 运输巷道 → 井筒/溜井 → 回风系统（原模型演示「开拓巷道随阶段逐步出现」的步进制）。
 * 拆档完全由 dev 完成态下可见对象的 userData 归类得出，引擎方法文件零改动。
 */
const DEV_GROUP_DEFS = [
  { key: "transport", label: "阶段运输巷道", verb: "掘进", re: /运输|斜坡道|平硐/ },
  { key: "shafts", label: "井筒与溜井", verb: "开凿", re: /溜井|天井|设备井|风井|井筒|暗井/ },
  { key: "return-air", label: "回风系统贯通", verb: "贯通", re: /回风/ },
  { key: "other", label: "其他开拓工程", verb: "完成", re: /.*/ },
] as const;

/** 对象名 → 工程基名：去括号注记、圈码序号与尾部编号（'矿石溜井②（下盘φ2.4m）'→'矿石溜井'） */
function baseName(name: string): string {
  return name
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/[①②③④⑤⑥⑦⑧⑨⑩]/g, "")
    .replace(/[\s·、,，]+$|^\s+|[-–]\s*\d+.*$/g, "")
    .trim();
}

function isVisibleInTree(o: THREE.Object3D): boolean {
  let p: THREE.Object3D | null = o;
  while (p) {
    if (!p.visible) return false;
    p = p.parent;
  }
  return true;
}

/** 工序步骤 + 开拓拆档依据——每 def 探测一次后缓存；探测用的几何即刻释放。数据生成脚本共用 */
interface EnginePhase {
  id: string;
  name: string;
  color?: string;
}
interface DevGroup {
  label: string;
  verb: string;
  /** 组内工程对象基名（注记用，保序去重） */
  names: string[];
  /** 组内对象 object_id 集合（build 时按档隐藏用） */
  ids: Set<string>;
}
interface EngineProbe {
  steps: EngineStep[];
  phases: EnginePhase[];
  /** 独立版播放器单步停留秒数（缺省 2.5） */
  stepDuration: number;
  /** 自由探索初始态（剖切/进程比例） */
  defaults: { cut: number; progress: number };
  /** dev phase 最末一步下标（<0 = 无开拓档） */
  devLastIdx: number;
  /** dev 拆档组（按开拓次序，已滤空组）；长度 ≤1 时不拆 */
  devGroups: DevGroup[];
}
const stagesCache = new Map<EngineDef, EngineProbe>();
export function probeOf(def: EngineDef): EngineProbe {
  const hit = stagesCache.get(def);
  if (hit) return hit;
  const { M } = getEngine();
  const probe = def.build(M);
  const steps = probe.process.steps.map((s) => ({ title: s.title, desc: s.desc, phase: s.phase }));
  let devLastIdx = -1;
  steps.forEach((s, i) => {
    if (s.phase === "dev") devLastIdx = i;
  });

  // dev 完成态 → 按对象名归类到 2~3 个开拓子档
  const groups: DevGroup[] = [];
  if (devLastIdx >= 0) {
    probe.process.apply(devLastIdx);
    const buckets = DEV_GROUP_DEFS.map((d) => ({ def: d, names: [] as string[], ids: new Set<string>() }));
    for (const key of ["drift", "shaft"]) {
      probe.layers[key]?.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh || !isVisibleInTree(m)) return;
        const u = m.userData as { object_id?: string; name?: string };
        if (!u.object_id || !u.name) return;
        const hitIdx = buckets.findIndex((b) => b.def.re.test(u.name as string));
        const b = buckets[hitIdx >= 0 ? hitIdx : buckets.length - 1];
        b.ids.add(u.object_id);
        const base = baseName(String(u.name));
        if (base && !b.names.includes(base)) b.names.push(base);
      });
    }
    for (const b of buckets) {
      if (b.ids.size === 0) continue;
      groups.push({ label: b.def.label, verb: b.def.verb, names: b.names, ids: b.ids });
    }
  }

  const rec: EngineProbe = {
    steps,
    phases: (probe.process as unknown as { phases?: EnginePhase[] }).phases ?? [],
    stepDuration: probe.process.stepDuration ?? 2.5,
    defaults: { cut: def.meta.defaults?.cut ?? 0, progress: def.meta.defaults?.progress ?? 0.55 },
    devLastIdx,
    devGroups: groups.length > 1 ? groups : [],
  };
  stagesCache.set(def, rec);
  probe.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
  });
  return rec;
}

/** 兼容导出：逐步明细（独立演示颗粒度）；网站 stages 用分档后的 stagesOf */
export function stepsOf(def: EngineDef): EngineStep[] {
  return probeOf(def).steps;
}

export interface StageInfo {
  label: string;
  note: string;
  /** 该档对应的 process 步骤下标（档内最末一步 = 该工序完成态） */
  stepIndex: number;
  /** 开拓拆档：apply(stepIndex) 后再隐藏 devGroups[i]（i > devTrim）；非拆档档为 undefined */
  devTrim?: number;
}

/** 引擎个别方法（B-4）的步骤引用了未注册名字的 phase，通用兜底名 */
const PHASE_FALLBACK: Record<string, string> = {
  dev: "开拓工程",
  prep: "采准工程",
  cut: "切割工程",
  stope: "矿体回采",
  fill: "充填作业",
  post: "采场处理",
};

/**
 * 工序阶段全集：引擎内置 phases 之外，把只被 steps 引用而未注册的 phase id
 * （B-4 的 'post'）按兜底名追加，保证网站步骤列表按阶段分组无漏步。
 */
export function phasesOf(def: EngineDef): EnginePhase[] {
  const { steps, phases } = probeOf(def);
  const known = new Set(phases.map((p) => p.id));
  const out = [...phases];
  for (const s of steps) {
    const pid = s.phase ?? "_";
    if (known.has(pid)) continue;
    known.add(pid);
    out.push({ id: pid, name: PHASE_FALLBACK[pid] ?? `工序 ${pid}` });
  }
  return out;
}

/**
 * 剖面变体/连续剖切 → 共享裁剪平面。iso 不裁剪；long 移除 +Z 前侧半；cross 移除 +X 右半；
 * cut∈[0,1] 为沿所选剖面轴连续剖切（两端各 3m 余量，0=全显 1=全剖）。
 */
export function applyCutPlane(
  plane: THREE.Plane,
  b: THREE.Box3,
  opts: { variant?: "iso" | "long" | "cross"; cut?: number },
): void {
  if (opts.cut !== undefined) {
    const cross = opts.variant === "cross";
    const max = (cross ? b.max.x : b.max.z) + 3;
    const min = (cross ? b.min.x : b.min.z) - 3;
    plane.normal.set(cross ? -1 : 0, 0, cross ? 0 : -1);
    plane.constant = max - THREE.MathUtils.clamp(opts.cut, 0, 1) * (max - min);
    return;
  }
  if (opts.variant === "long") {
    plane.normal.set(0, 0, -1);
    plane.constant = (b.min.z + b.max.z) / 2;
  } else if (opts.variant === "cross") {
    plane.normal.set(-1, 0, 0);
    plane.constant = (b.min.x + b.max.x) / 2;
  } else {
    plane.normal.set(0, 0, -1);
    plane.constant = 1e6;
  }
}

/** 标注锚点：labels 图层当前可见锚点按 pri 降序取前 8（授权书 §7 上限；查看器 DOM 投影） */
function collectAnchors(api: EngineApi, plane: THREE.Plane, limit = 8): ModelAnchor[] {
  api.group.updateMatrixWorld(true);
  const candidates: (ModelAnchor & { pri: number })[] = [];
  api.layers.labels?.traverse((o) => {
    const u = o.userData as { isLabel?: boolean; labelText?: string; pri?: number } | undefined;
    if (!u?.isLabel || !u.labelText || !isVisibleInTree(o)) return;
    const w = new THREE.Vector3();
    o.getWorldPosition(w);
    if (plane.distanceToPoint(w) < 0) return;
    candidates.push({ label: String(u.labelText), pos: [w.x, w.y, w.z], pri: typeof u.pri === "number" ? u.pri : 50 });
  });
  candidates.sort((x, y) => y.pri - x.pri);
  return candidates.slice(0, limit).map(({ label, pos }) => ({ label, pos }));
}

/** 细部焦点：关键构造层里体积最大的可见实体中心；无则包围盒中心 */
function computeFocus(api: EngineApi, b: THREE.Box3): Record<string, [number, number, number]> {
  const focusPoints: Record<string, [number, number, number]> = {};
  for (const k of FOCUS_LAYER_ORDER) {
    const node = api.layers[k];
    if (!node) continue;
    let best: THREE.Vector3 | null = null;
    let bestVol = 1;
    const bb = new THREE.Box3();
    node.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || !m.geometry || !isVisibleInTree(m)) return;
      bb.setFromObject(m);
      if (bb.isEmpty()) return;
      const s = bb.getSize(new THREE.Vector3());
      const vol = s.x * s.y * s.z;
      if (vol > bestVol) {
        bestVol = vol;
        best = bb.getCenter(new THREE.Vector3());
      }
    });
    // （traverse 回调内赋值，循环后经断言绕开控制流窄化）
    const chosen = best as THREE.Vector3 | null;
    if (chosen) {
      focusPoints["细部"] = [chosen.x, chosen.y, chosen.z];
      return focusPoints;
    }
  }
  const c = b.getCenter(new THREE.Vector3());
  focusPoints["细部"] = [c.x, c.y, c.z];
  return focusPoints;
}

/** 图层节点改名为 L_<中文名>（labels 组保留内部名供锚点收集，不作为图层按钮） */
function renameLayers(def: EngineDef, api: EngineApi): void {
  for (const k of def.meta.layers) {
    const node = api.layers[k];
    if (!node) continue;
    node.name = k === "labels" ? "L_labels" : `L_${LAYER_CN[k] ?? k}`;
  }
}

/**
 * 引擎持久会话（过程演示完整迁移）：一次构建持有 api，此后
 *   step(i)  → process.apply(i-1)（引擎幂等全状态重算，任意跳转即时生效）
 *   explore  → process.reset()+update(p)（自由探索连续进程）
 *   setCut/setVariant → 共享裁剪平面
 * 不再逐步全量重建几何。build() 原路径保留给测试与概览 stage 模式。
 */
export interface LiveSession {
  group: THREE.Group;
  bounds: THREE.Box3;
  stepCount: number;
  /** 过程演示 1-based 步 → 应用并重取锚点 */
  step(i: number): ModelAnchor[];
  /** 自由探索：连续进程 0–1（剖切比例缺省沿用会话内上次值） */
  explore(p: number): ModelAnchor[];
  setCut(t: number): void;
  setVariant(v: "iso" | "long" | "cross"): void;
  /** 进程档位名（复刻独立版 progressText：方法函数 → stageIndex+meta.stages → 空） */
  progressLabel(p: number): string;
  anchors(): ModelAnchor[];
  focusPoints(): Record<string, [number, number, number]>;
  /** 离开方法时释放几何（材质 mfShared 共享，不释放） */
  dispose(): void;
}

export function createLive(
  def: EngineDef,
  opts: { variant?: "iso" | "long" | "cross"; step?: number; progress?: number; cut?: number } = {},
): LiveSession {
  const { clipPlane, M } = getEngine();
  const api = def.build(M);
  renameLayers(def, api);
  const b = api.bounds;
  const total = api.process.steps.length;
  let cut: number | undefined = opts.cut;
  let variant: "iso" | "long" | "cross" = opts.variant ?? "iso";

  if (opts.progress !== undefined) {
    api.process.reset();
    api.update(THREE.MathUtils.clamp(opts.progress, 0, 1));
    applyCutPlane(clipPlane, b, { cut: cut ?? 0, variant });
  } else {
    const step = THREE.MathUtils.clamp(Number.isFinite(opts.step as number) ? (opts.step as number) : total, 1, Math.max(1, total));
    api.process.apply(step - 1);
    applyCutPlane(clipPlane, b, { variant: opts.variant ?? "iso" });
  }

  const progressLabel = (p: number): string => {
    const fn = (api as unknown as { progressText?: (p: number) => string }).progressText;
    if (typeof fn === "function") return String(fn.call(api, p) ?? "");
    const si = (api as unknown as { stageIndex?: (p: number) => number }).stageIndex;
    const stages = def.meta.stages;
    if (typeof si === "function" && stages?.length) {
      return stages[THREE.MathUtils.clamp(Math.trunc(si(p)), 0, stages.length - 1)];
    }
    return "";
  };

  return {
    group: api.group,
    bounds: b,
    stepCount: total,
    step(i) {
      cut = undefined; // 回到过程演示：剖切由 variant 接管
      api.process.apply(THREE.MathUtils.clamp(Number.isFinite(i) ? Math.trunc(i) : 1, 1, Math.max(1, total)) - 1);
      applyCutPlane(clipPlane, b, { variant });
      return collectAnchors(api, clipPlane);
    },
    explore(p) {
      api.process.reset();
      api.update(THREE.MathUtils.clamp(p, 0, 1));
      applyCutPlane(clipPlane, b, { cut: cut ?? 0, variant });
      return collectAnchors(api, clipPlane);
    },
    setCut(t) {
      cut = THREE.MathUtils.clamp(t, 0, 1);
      applyCutPlane(clipPlane, b, { cut, variant });
    },
    setVariant(v) {
      variant = v;
      cut = undefined;
      applyCutPlane(clipPlane, b, { variant: v });
    },
    progressLabel,
    anchors: () => collectAnchors(api, clipPlane),
    focusPoints: () => computeFocus(api, b),
    dispose() {
      api.group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
    },
  };
}
/**
 * 滚动关键帧分档：process 步骤按 phase 聚合（开拓/采准/切割/回采/采场处理）；
 * 开拓 phase 再按工程类别拆成 2~3 个子档（运输巷道→井筒溜井→回风贯通），
 * 其余 phase 各一档；引擎工序颗粒度（个别方法 20+ 步）由查看器过程演示逐步播放。
 */
export function stagesOf(def: EngineDef): StageInfo[] {
  const { steps, phases, devGroups, devLastIdx } = probeOf(def);
  const nameById = new Map(phases.map((p) => [p.id, p.name.replace(/^[一二三四五六七八九十]+、/, "")]));
  const last = new Map<string, number>();
  const members = new Map<string, EngineStep[]>();
  steps.forEach((s, i) => {
    const pid = s.phase ?? "_";
    last.set(pid, i);
    if (!members.has(pid)) members.set(pid, []);
    members.get(pid)!.push(s);
  });
  const orderedFrames = [...last].sort((a, b) => a[1] - b[1]);
  return orderedFrames.flatMap(([pid, stepIndex], i) => {
    const ms = members.get(pid)!;
    const label = nameById.get(pid) ?? PHASE_FALLBACK[pid] ?? phases[i]?.name?.replace(/^[一二三四五六七八九十]+、/, "") ?? `阶段 ${i + 1}`;
    // 开拓拆档：按探测出的工程组逐档推进（末子档 = dev 完成态）
    if (pid === "dev" && devGroups.length > 1) {
      return devGroups.map((g, j) => {
        const shown = g.names.slice(0, 4).join("、");
        const more = g.names.length > 4 ? `等 ${g.names.length} 类工程` : "";
        return {
          label: `${label} · ${g.label}`,
          note: `${g.verb}${shown}${more}。`,
          stepIndex: devLastIdx,
          devTrim: j,
        };
      });
    }
    const note =
      ms.length === 1
        ? ms[0].desc || ms[0].title
        : ms.map((s) => s.title).join("→");
    return [{ label, note, stepIndex }];
  });
}

export interface AdaptedBuilder {
  engineCode: string;
  PARAMS: unknown;
  LAYERS: LayerName[];
  LAYERS_OFF: string[];
  STAGES: string[];
  build(opts?: BuildOpts): ModelBuildResult;
  /** 过程演示/自由探索的持久会话（查看器使用；不再逐步全量重建） */
  createLive(opts?: { variant?: "iso" | "long" | "cross"; step?: number; progress?: number; cut?: number }): LiveSession;
  selfCheck(): string[];
}

const FOCUS_LAYER_ORDER = ["stope", "cut", "muck", "fill", "pillar", "drift"];

export function makeBuilder(def: EngineDef): AdaptedBuilder {
  const LAYERS = layersOf(def);
  const LAYERS_OFF = layersOffOf(def);

  const build = (opts: BuildOpts = {}): ModelBuildResult => {
    const { clipPlane, M } = getEngine();
    const api = def.build(M);
    const group = api.group;

    // 图层节点改名为 L_<中文名>；labels 组保留内部名供锚点收集（不作为图层按钮）
    renameLayers(def, api);

    const total = api.process.steps.length;
    let cur: StageInfo | undefined;
    if (opts.step !== undefined) {
      const step = Number.isFinite(opts.step) ? Math.trunc(opts.step) : total;
      api.process.apply(THREE.MathUtils.clamp(step, 1, total) - 1);
    } else if (opts.stage !== undefined) {
      const stages = stagesOf(def);
      const stage = Number.isFinite(opts.stage) ? Math.trunc(opts.stage) : stages.length;
      cur = stages[THREE.MathUtils.clamp(stage, 1, stages.length) - 1];
      api.process.apply(cur?.stepIndex ?? total - 1);
    } else {
      api.process.apply(total - 1);
    }

    // 开拓拆档：非末子档时再隐藏本档之后的开拓工程组，模拟开拓系统逐档成巷
    if (cur && cur.devTrim !== undefined) {
      const { devGroups } = probeOf(def);
      const hide = new Set<string>();
      for (let j = cur.devTrim + 1; j < devGroups.length; j++) for (const id of devGroups[j].ids) hide.add(id);
      if (hide.size) {
        group.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh && hide.has(String(m.userData?.object_id ?? ""))) m.visible = false;
        });
      }
      // 空层清扫：某工序层内无任何可见带标对象时，其直挂的未标注轮廓线（dashedOutline 等
      // 引擎历史遗留：Line 不参与 process reveal）随该层一并隐藏；图层按钮语义不受影响
      for (const key of ["drift", "shaft", "stope", "cut", "muck", "fill", "pillar"]) {
        const node = api.layers[key];
        if (!node || !node.visible) continue;
        let anyTaggedVisible = false;
        node.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh && o.visible && o.userData?.object_id) anyTaggedVisible = true;
        });
        if (anyTaggedVisible) continue;
        for (const child of node.children) {
          const m = child as THREE.Mesh;
          if (!child.userData?.object_id && !m.isMesh) child.visible = false;
        }
      }
    }

    const b = api.bounds;
    applyCutPlane(clipPlane, b, { variant: opts.variant });
    const anchors = collectAnchors(api, clipPlane);
    const focusPoints = computeFocus(api, b);

    return {
      group,
      anchors,
      bbox: {
        min: [b.min.x, b.min.y, b.min.z],
        max: [b.max.x, b.max.y, b.max.z],
      },
      focusPoints,
    };
  };

  return {
    engineCode: def.meta.code,
    PARAMS: def.meta.params,
    LAYERS,
    LAYERS_OFF,
    // 惰性 STAGES（测试逐字比对 methods.json；浏览器端仅查看器用 data.stages）
    get STAGES(): string[] {
      return stagesOf(def).map((s) => s.label);
    },
    build,
    createLive: (opts) => createLive(def, opts),
    selfCheck(): string[] {
      const problems: string[] = [];
      for (const l of LAYERS) if (!(LAYER_NAMES as readonly string[]).includes(l)) problems.push(`非法图层名: ${l}`);
      const n = stagesOf(def).length;
      if (n < 3 || n > 10) problems.push(`工艺阶段数异常: ${n}`);
      const r = build({ variant: "iso" });
      if (r.anchors.length < 1) problems.push("当前工序缺少标注");
      if (r.anchors.length > 8) problems.push(`锚点过多: ${r.anchors.length}`);
      return problems;
    },
  };
}
