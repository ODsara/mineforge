/**
 * 色板与材质工厂（建模方案 §3.6）
 *
 * 延续站点「工程图纸气质 + 深色展台」：展台底色取 tokens.css 的 --color-stage
 * （terracotta v2.0 为暖深 #191007），对象色为方案定稿的语义色板。
 * 所有 mesh 统一加 EdgesGeometry 描边——工程线稿感的来源。
 * 材质一律 MeshStandardMaterial（flat shading，暖主光+冷补光装置见 ModelViewer）。
 */
import * as THREE from "three";

/** 方案 §3.6 语义色板 */
export const PALETTE = {
  ore: "#8C5A28", // 矿体：琥珀棕
  wall: "#5D6872", // 围岩：灰蓝（半透明 0.92）
  wallCut: "#7E8A94", // 围岩剖切面：提亮 20%
  pillar: "#C9A24B", // 矿柱：赭金
  void: "#101822", // 采空区壳：0.18 透明
  tunnel: "#1C2632", // 巷道内壁
  fill: "#7E93A8", // 充填体：青灰
  fillLayer: "#6B8299", // 充填分层缝
  rubble: "#57616B", // 崩落岩
  rubbleOre: "#8C6A3C", // 崩落岩矿体混色
  holes: "#E8C547", // 深孔/药包：自发光
  airIn: "#46B1E4", // 进风
  airOut: "#E4682F", // 污风
  oreFlow: "#F2A65A", // 矿流
  machine: "#9AA7B2", // 设备剪影
  edge: "#D9B36A", // 描边（accent 金 30% 不透明）
} as const;

/** 展台底色兜底值（运行时优先读 CSS 令牌 --color-stage） */
export const STAGE_BG_FALLBACK = "#191007";

const matCache = new Map<string, THREE.MeshStandardMaterial>();
const lineCache = new Map<string, THREE.LineBasicMaterial>();

function stdMat(
  key: string,
  color: string,
  opts: { opacity?: number; emissive?: string; emissiveIntensity?: number; flat?: boolean } = {},
): THREE.MeshStandardMaterial {
  const cacheKey = `${key}|${opts.opacity ?? 1}|${opts.emissive ?? ""}`;
  const hit = matCache.get(cacheKey);
  if (hit) return hit;
  const mat = new THREE.MeshStandardMaterial({
    color,
    flatShading: opts.flat ?? true,
    roughness: 0.82,
    metalness: 0.08,
    transparent: (opts.opacity ?? 1) < 1,
    opacity: opts.opacity ?? 1,
    depthWrite: (opts.opacity ?? 1) >= 1,
    ...(opts.emissive
      ? { emissive: new THREE.Color(opts.emissive), emissiveIntensity: opts.emissiveIntensity ?? 0.6 }
      : {}),
  });
  matCache.set(cacheKey, mat);
  return mat;
}

/** 语义材质工厂（缓存复用，dispose 由 ModelViewer 统一处理）；cut=true 为剖切面提亮 20%（方案 §3.6/§3.8） */
let _holeLineMat: THREE.LineBasicMaterial | null = null;

/** 崩落分层线（金色示意线材质，供 Line 使用） */
export function holeLineMat(): THREE.LineBasicMaterial {
  if (!_holeLineMat) {
    _holeLineMat = new THREE.LineBasicMaterial({ color: PALETTE.holes, transparent: true, opacity: 0.85 });
  }
  return _holeLineMat;
}

export const mat = {
  ore: (cut = false) => stdMat(cut ? "oreCut" : "ore", cut ? "#A8703A" : PALETTE.ore),
  /** 半透明矿体（0.5）：仅用于巷道阵在矿体内部的工法（无底柱分段崩落），iso 视角透出巷道网 */
  oreGhost: () => stdMat("oreGhost", PALETTE.ore, { opacity: 0.5 }),
  wall: (cut = false) => stdMat(cut ? "wallCut" : "wall", cut ? PALETTE.wallCut : PALETTE.wall, { opacity: cut ? 1 : 0.92 }),
  pillar: (cut = false) => stdMat(cut ? "pillarCut" : "pillar", cut ? "#DBB868" : PALETTE.pillar),
  voidShell: () => stdMat("void", PALETTE.void, { opacity: 0.18 }),
  tunnel: () => stdMat("tunnel", PALETTE.tunnel),
  fill: (layer = 0) => stdMat(`fill${layer % 2}`, layer % 2 ? PALETTE.fillLayer : PALETTE.fill),
  rubble: (oreMix = false) => stdMat(oreMix ? "rubbleOre" : "rubble", oreMix ? PALETTE.rubbleOre : PALETTE.rubble),
  holes: () => stdMat("holes", PALETTE.holes, { emissive: PALETTE.holes, emissiveIntensity: 0.85 }),
  machine: () => stdMat("machine", PALETTE.machine, { flat: false }),
};

export const lineMat = {
  edge: () => {
    const hit = lineCache.get("edge");
    if (hit) return hit;
    const m = new THREE.LineBasicMaterial({ color: PALETTE.edge, transparent: true, opacity: 0.3 });
    lineCache.set("edge", m);
    return m;
  },
  air: (dir: "in" | "out") => {
    const key = `air${dir}`;
    const hit = lineCache.get(key);
    if (hit) return hit;
    const m = new THREE.LineBasicMaterial({
      color: dir === "in" ? PALETTE.airIn : PALETTE.airOut,
      transparent: true,
      opacity: 0.9,
    });
    lineCache.set(key, m);
    return m;
  },
  holeLine: () => {
    const hit = lineCache.get("holeLine");
    if (hit) return hit;
    const m = new THREE.LineBasicMaterial({ color: PALETTE.holes, transparent: true, opacity: 0.85 });
    lineCache.set("holeLine", m);
    return m;
  },
  flow: () => {
    const hit = lineCache.get("flow");
    if (hit) return hit;
    const m = new THREE.LineBasicMaterial({ color: PALETTE.oreFlow, transparent: true, opacity: 0.9 });
    lineCache.set("flow", m);
    return m;
  },
};

/**
 * 给 mesh 加 EdgesGeometry 描边（0.4px 感的细线，accent 金 30%）。
 * 返回传入的 mesh 本身，方便链式 .add。
 */
export function withEdges<T extends THREE.Mesh>(mesh: T, thresholdAngle = 18): T {
  const geo = mesh.geometry as THREE.BufferGeometry;
  if (geo.index && geo.index.count > 20000) return mesh; // 超大网格跳过描边，保帧率
  const edges = new THREE.EdgesGeometry(geo, thresholdAngle);
  const line = new THREE.LineSegments(edges, lineMat.edge());
  line.name = "__edges";
  mesh.add(line);
  return mesh;
}

/** 图层组：节点命名 L_<图层名>，与 methods.json layers / 旧 GLB 约定逐字一致（方案 §3.7） */
export function layerGroup(name: string): THREE.Group {
  const g = new THREE.Group();
  g.name = `L_${name}`;
  return g;
}

/** 读取页面展台底色（与 terracotta 令牌同温）；无 DOM 时用兜底值（node 单测环境） */
export function stageBackground(el?: Element | null): THREE.Color {
  if (typeof document !== "undefined" && el) {
    const v = getComputedStyle(el as Element).getPropertyValue("--color-stage").trim();
    if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return new THREE.Color(v);
  }
  return new THREE.Color(STAGE_BG_FALLBACK);
}

/** dispose 一棵场景树（variant 切换 / 页面离开时调用）：几何必释，共享材质保留 */
export function disposeTree(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        // 描边/语义材质走缓存共享，不随单棵树销毁；其余（含 GLB 自带材质）逐个释放
        if (!isShared(m)) m.dispose();
      }
    }
  });
}

function isShared(m: THREE.Material): boolean {
  for (const v of matCache.values()) if (v === m) return true;
  for (const v of lineCache.values()) if (v === m) return true;
  return false;
}
