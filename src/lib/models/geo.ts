/**
 * 共享几何原语库（建模方案 §3.9）
 *
 * 所有 builder 的唯一几何来源：参数化体块、巷道、漏斗、矿堆、分层蛋糕、
 * 崩落岩群、扇形/平行深孔、风流/矿流箭头、设备剪影。builder 内禁裸三角函数，
 * 倾斜一律走 tilt()。单位米，Y 向上，X 走向，Z 指向下盘。
 *
 * 剖切原则（方案 §3.8）：long/cross 变体由 builder 在生成阶段做区间过滤，
 * 绝无布尔运算与 clippingPlanes。
 */
import * as THREE from "three";
import { mat, withEdges, lineMat } from "./theme.ts";
import type { BBox } from "./types.ts";

export type V3 = [number, number, number];

export const deg = (d: number) => (d * Math.PI) / 180;

/* ── 基础体块 ─────────────────────────────────────────────── */

export interface BoxOpts {
  pos?: V3; // 中心位置
  rotX?: number; // 绕 X 轴角度（度）
  rotY?: number;
  rotZ?: number;
  material?: THREE.Material;
  edges?: boolean;
  name?: string;
}

/** 体块：w(x)×h(y)×d(z)，默认 ore 材质 + 描边 */
export function box(w: number, h: number, d: number, opts: BoxOpts = {}): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), opts.material ?? mat.ore());
  if (opts.pos) m.position.set(...opts.pos);
  if (opts.rotX) m.rotation.x = deg(opts.rotX);
  if (opts.rotY) m.rotation.y = deg(opts.rotY);
  if (opts.rotZ) m.rotation.z = deg(opts.rotZ);
  if (opts.name) m.name = opts.name;
  if (opts.edges !== false) withEdges(m);
  return m;
}

/** 板/层：h 方向薄的体块（矿体板、充填分层、混凝土底板） */
export const slab = (w: number, h: number, d: number, opts: BoxOpts = {}) => box(w, h, d, opts);

/**
 * frustumBox：矩形底 → 矩形顶的棱台（喇叭口、矿堆、堑沟壁）。
 * 显式 8 顶点 BufferGeometry，尺寸精确，无旋转/缩放次序陷阱。
 */
export function frustumBox(
  baseW: number,
  baseD: number,
  topW: number,
  topD: number,
  h: number,
  opts: { pos?: V3; material?: THREE.Material; edges?: boolean; name?: string } = {},
): THREE.Mesh {
  const bw = baseW / 2, bd = baseD / 2, tw = topW / 2, td = topD / 2, y0 = 0, y1 = h;
  // 8 顶点：底 4 + 顶 4
  const v = new Float32Array([
    -bw, y0, -bd,  bw, y0, -bd,  bw, y0,  bd, -bw, y0,  bd, // 底
    -tw, y1, -td,  tw, y1, -td,  tw, y1,  td, -tw, y1,  td, // 顶
  ]);
  // 6 面 × 2 三角（外向）
  const idx = [
    0, 2, 1, 0, 3, 2, // 底（朝下）
    4, 5, 6, 4, 6, 7, // 顶（朝上）
    0, 1, 5, 0, 5, 4, // 前(-z)
    1, 2, 6, 1, 6, 5, // 右(+x)
    2, 3, 7, 2, 7, 6, // 后(+z)
    3, 0, 4, 3, 4, 7, // 左(-x)
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(v, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, opts.material ?? mat.tunnel());
  if (opts.pos) m.position.set(...opts.pos);
  if (opts.name) m.name = opts.name;
  if (opts.edges !== false) withEdges(m);
  return m;
}

/* ── 巷道（2026-11-21 空心化改造） ─────────────────────────── */

/** 巷道默认壁厚（米）——builder 用它计算支巷落底到宿主内底板的标高 */
export const TUNNEL_T = 0.5;

/** 岔口开口：在宿主巷道的壁/顶挖开口供支巷贯通（解析条带剔除，非布尔） */
export interface TunnelOpening {
  /** 开口中心沿路径的弧长（米，从 path[0] 起算） */
  s: number;
  /** 开口沿路径的长度（米）＝支巷外宽 */
  w: number;
  /** part: wallL/wallR = 左/右帮全高开口；roof = 顶拱开口 */
  part: "wallL" | "wallR" | "roof";
  /** roof 专用：开口在断面 u 向的范围 [u0, u1]（支巷在宿主断面上的占位，米） */
  u0?: number;
  u1?: number;
}

interface RingSpec {
  /** 24(拱)/10(矩) 个 [u,v] 点组成的环形闭合轮廓（外圈+内圈，含壁厚） */
  pts: [number, number][];
  /** 每条 ring 边的部件标签，用于岔口开口剔除 */
  parts: string[];
}

/**
 * 构造环形截面。外轮廓 w×h 以路径为中心（与旧实心版外包络一致，位置尺寸不变），
 * 内轮廓向内偏移 thickness 形成壁厚。拱形 = 直墙半圆拱（矿山常用断面）。
 * 环形点序（拱，24 点）：外圈 CCW(地板→右帮→顶拱→左帮) → 竖缝 → 内圈 CW → 竖缝闭合；
 * 三角化时外圈面朝围岩、内圈面朝空区（单面材质即可正确渲染）。
 */
function ringProfile(w: number, h: number, t: number, profile: "arch" | "rect"): RingSpec {
  const pts: [number, number][] = [];
  const parts: string[] = [];
  if (profile === "rect") {
    // 外圈 4 点 + 内圈 4 点，环 10 点 10 边
    pts.push(
      [-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2], // 外圈 CCW 闭合
      [-w / 2 + t, -h / 2 + t], [-w / 2 + t, h / 2 - t], [w / 2 - t, h / 2 - t], [w / 2 - t, -h / 2 + t], [-w / 2 + t, -h / 2 + t], // 内圈 CW
    );
    parts.push(
      "floor", "wallR", "roof", "wallL", "slit",
      "wallL", "roof", "wallR", "floor", "slit",
    );
    return { pts, parts };
  }
  // 拱形：外拱半径 w/2，圆心 (0, h/2 − w/2)；内拱同心、半径减 t
  const cy = h / 2 - w / 2;
  const Ro = w / 2;
  const Ri = w / 2 - t;
  const arch = (r: number, from: number, to: number, n: number): [number, number][] => {
    const out: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const th = from + ((to - from) * i) / n;
      out.push([r * Math.cos(th), cy + r * Math.sin(th)]);
    }
    return out;
  };
  const A = 8; // 半圆 8 分（16 边形近似，flat shading 下足够圆滑）
  // 外圈 CCW：地板L→地板R→右帮→顶拱→左帮→地板L
  pts.push([-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, cy]);
  const oArch = arch(Ro, 0, Math.PI, A); // 9 点（含两端 springline）
  for (let i = 1; i < oArch.length; i++) pts.push(oArch[i]); // 右帮顶→…→左帮顶（8 边）
  pts.push([-w / 2, -h / 2]); // 左帮下行 + 闭合
  // 内圈 CW：地板L→左帮→顶拱(反)→右帮→地板R→地板L
  pts.push([-w / 2 + t, -h / 2 + t]);
  pts.push([-w / 2 + t, cy]);
  const iArch = arch(Ri, Math.PI, 0, A);
  for (let i = 1; i < iArch.length; i++) pts.push(iArch[i]);
  pts.push([w / 2 - t, -h / 2 + t]);
  pts.push([-w / 2 + t, -h / 2 + t]);
  // 边部件：0→1 地板外 | 1→2 右帮外 | 2..10 拱外(8) | 11→12 左帮外?? —— 按实际点序标注
  // 点序实为: 0 oFloorL, 1 oFloorR, 2 oSpringR, 3..10 oArch(8 点, 2→3..9→10 拱边 8 条), 11 oFloorL(闭合外左帮),
  //          12 iFloorL, 13 iSpringL, 14..21 iArchRev, 22 iFloorR, 23 iFloorL(闭合)
  const p: string[] = [];
  p.push("floor", "wallR"); // 0→1, 1→2
  for (let i = 0; i < A; i++) p.push("roof"); // 2→3 … 9→10（拱外 8 边）
  p.push("wallL", "slit"); // 10→11(外左帮), 11→12(缝)
  p.push("wallL"); // 12→13(内左帮)
  for (let i = 0; i < A; i++) p.push("roof"); // 13→14 … 20→21（拱内 8 边）
  p.push("wallR", "floor", "slit"); // 21→22, 22→23, 23→0
  return { pts, parts: p };
}

/**
 * 巷道（空心）：壁厚 t 的管状巷道——顶板、两帮、底板为真实薄壁面，
 * 内部为贯通空腔，两端开放无端帽。折线拐点用共享斜接环对接（水密、无角块）。
 *
 * - w×h 为外断面尺寸（与旧实心版外包络一致，builder 位置尺寸零改动）；
 *   拱形内空 = 直墙半圆拱（宽 w−2t，墙高 h−w/2−t，拱半径 w/2−t）。
 * - profile: "arch"（默认，直墙半圆拱）| "rect"（矩形，特殊工程结构用）。
 * - openings: 岔口开口（宿主巷道用）——支巷贯通处剔除帮/顶条带，避免实心封堵。
 * - 旧 openEnds 参数保留兼容但已无意义（新版两端恒开放）。
 * - 断面显示放大由 builder 在传参处换算并在 PARAMS 标注（不变）。
 */
export function tunnel(
  path: V3[],
  w: number,
  h: number,
  opts: {
    material?: THREE.Material;
    profile?: "arch" | "rect";
    thickness?: number;
    openEnds?: boolean; // 兼容保留，已无意义
    name?: string;
    openings?: TunnelOpening[];
  } = {},
): THREE.Group {
  const g = new THREE.Group();
  if (path.length < 2) return g;
  const m = opts.material ?? mat.tunnel();
  const t = opts.thickness ?? 0.5;
  const spec = ringProfile(w, h, t, opts.profile ?? "arch");
  const N = spec.pts.length; // 拱 24 / 矩 10

  const up = new THREE.Vector3(0, 1, 0);
  const frameFor = (d: THREE.Vector3, fallbackU?: THREE.Vector3): { u: THREE.Vector3; v: THREE.Vector3 } => {
    const dir = d.clone().normalize();
    if (Math.abs(dir.dot(up)) > 0.99) {
      // 竖直巷道：截面水平，u 取 +X 或延续上一段
      const u = (fallbackU ?? new THREE.Vector3(1, 0, 0)).clone().normalize();
      const v = new THREE.Vector3().crossVectors(u, dir).normalize();
      return { u, v };
    }
    const u = new THREE.Vector3().crossVectors(dir, up).normalize(); // 行进方向右侧
    const v = new THREE.Vector3().crossVectors(u, dir).normalize(); // 截面"上"
    return { u, v };
  };

  // ── 站点：路径折点（内部=斜接环）+ 开口边界插入站 ──
  // 每站 { pos, frame, s }；弧长 s 用于开口区间判定
  const pathV = path.map((p) => new THREE.Vector3(...p));
  const segLen: number[] = [];
  let total = 0;
  for (let i = 0; i < pathV.length - 1; i++) {
    const L = pathV[i].distanceTo(pathV[i + 1]);
    segLen.push(L);
    total += L;
  }
  type Station = { pos: THREE.Vector3; u: THREE.Vector3; v: THREE.Vector3; s: number };
  const stations: Station[] = [];
  let prevU: THREE.Vector3 | undefined;
  // 折点站（含斜接帧）
  let acc = 0;
  for (let i = 0; i < pathV.length; i++) {
    let d: THREE.Vector3;
    if (i === 0) d = pathV[1].clone().sub(pathV[0]);
    else if (i === pathV.length - 1) d = pathV[i].clone().sub(pathV[i - 1]);
    else {
      const d1 = pathV[i].clone().sub(pathV[i - 1]).normalize();
      const d2 = pathV[i + 1].clone().sub(pathV[i]).normalize();
      d = d1.add(d2); // 斜接方向
      if (d.lengthSq() < 1e-10) d = d2.clone(); // 180° 折返兜底
    }
    const { u, v } = frameFor(d, prevU);
    prevU = u;
    stations.push({ pos: pathV[i].clone(), u, v, s: acc });
    if (i < pathV.length - 1) acc += segLen[i];
  }
  // 开口边界站（插在所在段的直线位置上）
  const openings = opts.openings ?? [];
  const extra: { s: number; seg: number; local: number }[] = [];
  for (const o of openings) {
    const s0 = Math.max(0, o.s - o.w / 2);
    const s1 = Math.min(total, o.s + o.w / 2);
    for (const sb of [s0, s1]) {
      let rem = sb;
      let segIdx = 0;
      while (segIdx < segLen.length - 1 && rem > segLen[segIdx]) {
        rem -= segLen[segIdx];
        segIdx++;
      }
      extra.push({ s: sb, seg: segIdx, local: segLen[segIdx] > 1e-9 ? rem / segLen[segIdx] : 0 });
    }
  }
  for (const e of extra) {
    const a = pathV[e.seg];
    const b = pathV[e.seg + 1];
    const { u, v } = frameFor(b.clone().sub(a).normalize());
    stations.push({ pos: a.clone().lerp(b, e.local), u, v, s: e.s });
  }
  stations.sort((p, q) => p.s - q.s);

  // ── 各站环点 ──
  const rings: THREE.Vector3[][] = stations.map((st) =>
    spec.pts.map(([pu, pv]) => {
      const r = new THREE.Vector3().copy(st.pos)
        .addScaledVector(st.u, pu)
        .addScaledVector(st.v, pv);
      return r;
    }),
  );

  // ── 剔除判定：环边部件 × 弧长区间 ──
  const edgeOmitted = (edgeIdx: number, s0: number, s1: number): boolean => {
    const part = spec.parts[edgeIdx % spec.parts.length];
    if (part === "slit") return false;
    for (const o of openings) {
      const lo = o.s - o.w / 2;
      const hi = o.s + o.w / 2;
      if (s0 < lo - 1e-6 || s1 > hi + 1e-6) continue; // 非完全包含 → 不剔（开口边界已插站）
      if (o.part === "roof") {
        // 顶拱开口：按环边中点的断面 u 是否落在支巷占位 [u0, u1] 内
        if (part !== "roof") continue;
        const midU = (spec.pts[edgeIdx][0] + spec.pts[(edgeIdx + 1) % N][0]) / 2;
        const u0 = o.u0 ?? -w / 2;
        const u1 = o.u1 ?? w / 2;
        if (midU >= u0 - 1e-6 && midU <= u1 + 1e-6) return true;
      } else if (part === o.part) {
        return true;
      }
    }
    return false;
  };

  // ── 组装网格：相邻站之间逐环边铺条带（外圈面朝外、内圈面朝空区） ──
  const positions: number[] = [];
  const indices: number[] = [];
  for (let st = 0; st < stations.length; st++) {
    for (let k = 0; k < N; k++) {
      positions.push(rings[st][k].x, rings[st][k].y, rings[st][k].z);
    }
  }
  for (let st = 0; st < stations.length - 1; st++) {
    const sA = stations[st].s;
    const sB = stations[st + 1].s;
    for (let k = 0; k < N; k++) {
      const k2 = (k + 1) % N;
      if (edgeOmitted(k, sA, sB)) continue;
      const a = st * N + k;
      const b = st * N + k2;
      const c = (st + 1) * N + k2;
      const d = (st + 1) * N + k;
      // 绕序 (a, a', b', b)：外圈法线朝围岩、内圈朝空区（推导见函数头注释）
      indices.push(a, d, c, a, c, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, m);
  mesh.name = "hollow";
  withEdges(mesh, 30); // 拱 16 边形的 22.5° 棱不入线，仅地板/帮角/斜接缝出线
  g.add(mesh);
  if (opts.name) g.name = opts.name;
  return g;
}

/** 天井/溜井/竖井：竖直或倾斜的单段巷道（tunnel 的快捷形式，同为空心管） */
export function shaft(from: V3, to: V3, w: number, h: number, opts: Parameters<typeof tunnel>[3] = {}): THREE.Group {
  return tunnel([from, to], w, h, opts);
}

/* ── 放矿漏斗 ─────────────────────────────────────────────── */

/**
 * 放矿漏斗：斗颈（竖直小方井）+ 喇叭口（向上扩大的矩形棱台）。
 * pos = 斗颈底端（落在耙道/运巷顶板处）。喇叭口宽口朝上通入采场/堑沟底。
 */
export function funnel(
  pos: V3,
  opts: { neckW?: number; neckH?: number; mouthW?: number; mouthH?: number; material?: THREE.Material } = {},
): THREE.Group {
  const { neckW = 2, neckH = 3, mouthW = 5, mouthH = 2.5 } = opts;
  const m = opts.material ?? mat.tunnel();
  const g = new THREE.Group();
  const neck = new THREE.Mesh(new THREE.BoxGeometry(neckW, neckH, neckW), m);
  neck.position.set(pos[0], pos[1] + neckH / 2, pos[2]);
  withEdges(neck);
  g.add(neck);
  g.add(
    frustumBox(neckW, neckW, mouthW, mouthW, mouthH, {
      pos: [pos[0], pos[1] + neckH, pos[2]],
      material: m,
    }),
  );
  return g;
}

/* ── 矿堆 ─────────────────────────────────────────────────── */

/**
 * 存留矿堆/崩落矿堆：矩形底 + 顶部平台的棱台（教材 p288：留矿堆台面平整，
 * 不画安息角坡面）。base w×d，顶平台 tw×td，高 h，pos 为底部中心。
 */
export function orePile(
  pos: V3,
  w: number,
  d: number,
  h: number,
  opts: { topW?: number; topD?: number; material?: THREE.Material } = {},
): THREE.Mesh {
  const topW = opts.topW ?? Math.max(w * 0.5, 0.1);
  const topD = opts.topD ?? Math.max(d * 0.5, 0.1);
  return frustumBox(w, d, topW, topD, h, {
    pos: [pos[0], pos[1], pos[2]],
    material: opts.material ?? mat.rubble(true),
  });
}

/* ── 分层蛋糕（分层充填类核心） ───────────────────────────── */

let _floorMat: THREE.MeshStandardMaterial | null = null;
function floorMat(): THREE.Material {
  if (!_floorMat) {
    _floorMat = new THREE.MeshStandardMaterial({ color: "#B9B2A4", flatShading: true, roughness: 0.9 });
  }
  return _floorMat;
}

/**
 * sliceCake：region 内自底向上 n 层（层高 layerH）。默认交替充填体双色，
 * 可传 materialFn 自定（矿层/充填层交替）。floorH>0 时每层顶加混凝土底板薄层。
 * 返回 Group 与每层 mesh（供锚点定位与"当前分层"锚定）。
 */
export function sliceCake(
  region: { x: number; y: number; z: number; w: number; d: number }, // y = 底标高
  n: number,
  layerH: number,
  opts: {
    materialFn?: (i: number) => THREE.Material;
    floorH?: number;
    floorMat?: THREE.Material;
  } = {},
): { group: THREE.Group; layers: THREE.Mesh[] } {
  const g = new THREE.Group();
  const layers: THREE.Mesh[] = [];
  for (let i = 0; i < n; i++) {
    const y0 = region.y + i * layerH;
    const m = opts.materialFn ? opts.materialFn(i) : mat.fill(i);
    const slabMesh = slab(region.w, layerH, region.d, {
      pos: [region.x, y0 + layerH / 2, region.z],
      material: m,
    });
    slabMesh.name = `layer${i}`;
    g.add(slabMesh);
    layers.push(slabMesh);
    if (opts.floorH && opts.floorH > 0) {
      g.add(
        slab(region.w - 0.3, opts.floorH, region.d - 0.3, {
          pos: [region.x, y0 + layerH - opts.floorH / 2 - 0.02, region.z],
          material: opts.floorMat ?? floorMat(),
          edges: false,
        }),
      );
    }
  }
  return { group: g, layers };
}

/* ── 崩落岩群 ─────────────────────────────────────────────── */

/** mulberry32 确定性伪随机（同 seed 同画面，截图可复现） */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * rubble：region 盒内 n 粒随机旋转小盒（崩落带/采空区碎岩）。
 * oreMix 概率混入矿体色（崩落的是矿岩混合体）。确定性：同 seed 结果相同。
 */
export function rubble(
  region: { x: number; y: number; z: number; w: number; h: number; d: number },
  n: number,
  seed: number,
  opts: { size?: [number, number]; oreMixRatio?: number; material?: THREE.Material } = {},
): THREE.Group {
  const r = rng(seed);
  const g = new THREE.Group();
  const [smin, smax] = opts.size ?? [1.2, 3.2];
  for (let i = 0; i < n; i++) {
    const s = smin + r() * (smax - smin);
    const oreMix = opts.material ? false : (opts.oreMixRatio ?? 0.35) > r();
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(s, s * (0.6 + r() * 0.5), s * (0.7 + r() * 0.4)),
      opts.material ?? mat.rubble(oreMix),
    );
    m.position.set(
      region.x + (r() - 0.5) * region.w,
      region.y + r() * region.h,
      region.z + (r() - 0.5) * region.d,
    );
    m.rotation.set(r() * Math.PI, r() * Math.PI, r() * Math.PI);
    m.name = `rubble${i}`;
    g.add(m);
  }
  return g;
}

/* ── 深孔 ─────────────────────────────────────────────────── */

/**
 * fanHoles：扇形深孔组。origin 为孔底起点（巷道顶板处），孔在竖直平面内从
 * baseAngle（度，0=+X 水平）向上下扇开 arc 度，n 孔均布；yawDeg 把整个扇面
 * 绕 Y 轴转（进路沿 Z 时传 90）。charge=true 时孔端加球形药包节点。
 */
export function fanHoles(
  origin: V3,
  n: number,
  arc: number,
  len: number,
  opts: { baseAngle?: number; yawDeg?: number; radius?: number; charge?: boolean } = {},
): THREE.Group {
  const g = new THREE.Group();
  const r = opts.radius ?? 0.25;
  const base = deg(opts.baseAngle ?? 0);
  const yaw = deg(opts.yawDeg ?? 0);
  const spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  for (let i = 0; i < n; i++) {
    const a = base + (n === 1 ? 0 : (i / (n - 1) - 0.5) * deg(arc));
    const dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0).applyQuaternion(spin);
    const mid = new THREE.Vector3(...origin).add(dir.clone().multiplyScalar(len / 2));
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat.holes());
    hole.position.copy(mid);
    hole.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    hole.name = `hole${i}`;
    g.add(hole);
    if (opts.charge) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(r * 2.2, 8, 6), mat.holes());
      ball.position.copy(new THREE.Vector3(...origin)).add(dir.multiplyScalar(len * 0.82));
      ball.name = `charge${i}`;
      g.add(ball);
    }
  }
  return g;
}

/**
 * parallelHoles：平行深孔排（VCR 垂直深孔/水平深孔）。origin 为首孔孔底，
 * n 孔沿 spacingDir（V3 方向，自动归一）等距 spacing，孔向 holeDir，长 len。
 */
export function parallelHoles(
  origin: V3,
  n: number,
  spacing: number,
  len: number,
  holeDir: V3,
  spacingDir: V3,
  opts: { radius?: number; charge?: boolean } = {},
): THREE.Group {
  const g = new THREE.Group();
  const r = opts.radius ?? 0.25;
  const dir = new THREE.Vector3(...holeDir).normalize();
  const step = new THREE.Vector3(...spacingDir).normalize().multiplyScalar(spacing);
  for (let i = 0; i < n; i++) {
    const p = new THREE.Vector3(...origin).add(step.clone().multiplyScalar(i));
    const mid = p.clone().add(dir.clone().multiplyScalar(len / 2));
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat.holes());
    hole.position.copy(mid);
    hole.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    hole.name = `hole${i}`;
    g.add(hole);
    if (opts.charge) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(r * 2.2, 8, 6), mat.holes());
      ball.position.copy(p).add(dir.clone().multiplyScalar(len * 0.82));
      ball.name = `charge${i}`;
      g.add(ball);
    }
  }
  return g;
}

/* ── 箭头链（风流/矿流） ──────────────────────────────────── */

const _coneMats = new Map<string, THREE.MeshStandardMaterial>();
function coneMat(kind: "airIn" | "airOut" | "flow"): THREE.Material {
  let m = _coneMats.get(kind);
  if (!m) {
    const c = kind === "flow" ? "#F2A65A" : kind === "airIn" ? "#46B1E4" : "#E4682F";
    m = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, flatShading: true });
    _coneMats.set(kind, m);
  }
  return m;
}

/** arrows：折线路径 + 沿线 n 个锥头箭头（风流/矿流） */
export function arrows(path: V3[], kind: "airIn" | "airOut" | "flow", n = 3, headSize = 1.6): THREE.Group {
  const g = new THREE.Group();
  const pts = path.map((p) => new THREE.Vector3(...p));
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const lm = kind === "flow" ? lineMat.flow() : lineMat.air(kind === "airIn" ? "in" : "out");
  g.add(new THREE.Line(geo, lm));
  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0);
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 1);
    const p = curve.getPoint(t);
    const dir = curve.getTangent(t).normalize();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(headSize * 0.42, headSize, 8), coneMat(kind));
    cone.position.copy(p);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(cone);
  }
  return g;
}

/* ── 设备剪影（低模，禁精细） ─────────────────────────────── */

export type MachineKind = "lhd" | "scraper" | "drilljumbo" | "truck" | "fan";

/** 设备剪影：4-8 件盒/柱组合，machine 灰剪影。pos 放在地面点，rotY 度。 */
export function machine(kind: MachineKind, pos: V3, rotY = 0): THREE.Group {
  const g = new THREE.Group();
  const M = mat.machine();
  const add = (w: number, h: number, d: number, dx: number, dy: number, dz: number) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M);
    b.position.set(dx, dy, dz);
    withEdges(b);
    g.add(b);
  };
  switch (kind) {
    case "lhd": // 铲运机：车身 + 驾驶棚 + 铲斗
      add(3.2, 1.1, 1.9, 0, 0.75, 0);
      add(1.2, 0.9, 1.7, -0.7, 1.7, 0);
      add(1.3, 0.8, 1.8, 2.0, 0.5, 0);
      break;
    case "scraper": // 电耙：滑橇 + 绞车
      add(1.6, 0.7, 1.2, 0, 0.35, 0);
      add(0.5, 0.5, 0.5, 0, 0.95, 0);
      break;
    case "drilljumbo": // 凿岩台车：底盘 + 双钻臂
      add(3.6, 0.9, 1.8, 0, 0.65, 0);
      add(0.35, 2.6, 0.35, 1.2, 2.0, 0.5);
      add(0.35, 2.6, 0.35, 1.2, 2.0, -0.5);
      break;
    case "truck":
      add(4.2, 1.3, 2.2, 0, 0.85, 0);
      add(1.4, 1.0, 2.0, -1.6, 2.0, 0);
      break;
    case "fan": // 局扇：圆筒 + 支架
      add(0.4, 0.5, 0.4, 0, 0.25, 0);
      {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.8, 12), M);
        c.rotation.z = Math.PI / 2;
        c.position.set(0, 0.95, 0);
        withEdges(c);
        g.add(c);
      }
      break;
  }
  g.position.set(...pos);
  g.rotation.y = deg(rotY);
  return g;
}

/* ── 倾斜（方案 §3.5，教材核对 B 条定稿） ─────────────────── */

/**
 * tilt：把水平生成的倾斜体绕 X 轴旋转 −δ。旋转后顶面法向
 * n_top = (0, cosδ, −sinδ)：矿体向 −Z 倾伏（上盘/倾向 = −Z），
 * 顶面向 +Z 抬升、向 −Z 俯倾。单测断言见 geo.test.ts。
 */
export function tilt(obj: THREE.Object3D, dipDeg: number): THREE.Object3D {
  obj.rotation.x = -deg(dipDeg);
  return obj;
}

/** tilt 的旋转矩阵：builder 用它把局部（水平矿层）坐标映射到世界坐标——锚点/焦点定位用，禁裸三角函数 */
export function tiltMatrix(dipDeg: number): THREE.Matrix4 {
  return new THREE.Matrix4().makeRotationX(-deg(dipDeg));
}

/** 水平生成后的板状矿体快捷：slab + tilt 一步完成 */
export function oreSlab(w: number, t: number, d: number, pos: V3, dipDeg: number, opts: BoxOpts = {}): THREE.Mesh {
  const m = slab(w, t, d, { ...opts, pos: [...pos] as V3 });
  return tilt(m, dipDeg) as THREE.Mesh;
}

/* ── 工具 ─────────────────────────────────────────────────── */

/** 区间谓词：横/纵剖生成阶段过滤用（v ∈ [x0, x1]） */
export const inRange = (v: number, x0: number, x1: number) => v >= x0 && v <= x1;

/** 计算一组对象的联合包围盒（builder build() 收尾用） */
export function unionBBox(objs: THREE.Object3D[]): BBox {
  const b = new THREE.Box3();
  const tmp = new THREE.Box3();
  for (const o of objs) {
    o.updateWorldMatrix(true, true);
    tmp.setFromObject(o);
    b.union(tmp);
  }
  if (b.isEmpty()) return { min: [0, 0, 0], max: [0, 0, 0] };
  return { min: b.min.toArray() as V3, max: b.max.toArray() as V3 };
}
