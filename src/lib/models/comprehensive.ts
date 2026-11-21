/**
 * 全面采矿法 builder（comprehensive）
 * 教材依据：《采矿学》（第 2 版）11.2，书 p277-279，图 11-2/11-3。
 * 辨识特征：一个大敞空矿房 + 不规则矿柱群（2×2~3×3 方形与 Φ3 圆形混布，
 *   每柱负担 80-300㎡，房 55×50 需 9-34 根取约 10 根）——与房柱法的规整方阵相对。
 * 坐标：X 走向、Z 指向下盘（矿体向 −Z 倾伏 15°）、Y 向上；原点=矿层底板 @ z=0。
 * 巷道：沿脉阶段运输巷道、1-2 条上山切自由面、底柱内漏斗 5-7m 间距、电耙硐室 20m 间距。
 * 工艺阶段（方案 §5 空场模板）：采准→切割→回采落矿→出矿→顶板管理。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, rng, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 15, // src: 书 p277（缓倾斜，薄中厚）
  thickness: 4, // src: 书 p277-278（薄中厚 t=4m）
  roomLength: 55, // 走向长（书 p277 矿块长 50-60）
  roomWidth: 50, // 倾斜长（示意）
  pillarDia: 3, // src: 书 p278（Φ3 圆形矿柱）
  sqPillar: 2.5, // src: 书 p278（2×2~3×3 方形矿柱，取 2.5）
  ribPillarW: 2.5, // 间柱 2-3m（书 p277-278）
  sillPillar: 3.5, // 底柱 3-7m 取中
  crownPillar: 2.5, // 顶柱 2-3m
  funnelSpan: 6, // 漏斗间距 5-7m 取中（书 p277）
  winchSpan: 20, // 电耙硐室 20m 间距（书 p277）
  displayNote: "矿体内巷道断面 ×1.5、溜井 ×2 显示放大（示意，非实尺）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "矿柱", "采准巷道", "出矿系统", "通风", "围岩"];

/** 工艺阶段（方案 §5 空场模板） */
export const STAGES = ["采准工程", "切割工程", "回采落矿", "出矿与运搬", "顶板管理"] as const;

const R = 0; // 全面法无矿房间柱——单一矿块
const Z0 = -PARAMS.roomWidth / 2; // 下端（出矿端）
const Z1 = PARAMS.roomWidth / 2; // 上端
const ZS = Z0 - PARAMS.sillPillar;
const ZE = Z1 + PARAMS.crownPillar;
const X0 = -PARAMS.roomLength / 2;
const X1 = PARAMS.roomLength / 2;
const Z_TRANSPORT = ZS - 5; // 底板岩运巷轴
const Y_TRANSPORT = -11;
const DRIFT_ROCK = 7.2; // 底板岩运巷 ×3
const DRIFT_ORE = 3.5; // 矿体内巷道 ×1.5
const T = PARAMS.thickness;

/** 不规则矿柱点位（seeded rng：全面法特征——非规整布置，10 根混布） */
function pillarSpots(): { x: number; z: number; round: boolean }[] {
  const r = rng(1129);
  const spots: { x: number; z: number; round: boolean }[] = [];
  for (let i = 0; i < 10; i++) {
    spots.push({
      x: X0 + 6 + r() * (PARAMS.roomLength - 12),
      z: Z0 + 5 + r() * (PARAMS.roomWidth - 10),
      round: r() > 0.45,
    });
  }
  return spots;
}

function clipOf(variant: string): { x0: number; x1: number; z0: number; z1: number } {
  if (variant === "long") return { x0: X0 - 1, x1: 0, z0: ZS - 5, z1: ZE + 5 };
  if (variant === "cross") return { x0: X0 - 1, x1: X1 + 1, z0: ZS - 5, z1: -2 };
  return { x0: X0 - 1, x1: X1 + 1, z0: ZS - 5, z1: ZE + 5 };
}

/** 实体体块 + 剖切端面提亮板（与房柱法同构的局部助手） */
function solidPiece(
  g: THREE.Group, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number,
  material: THREE.Material, cutMaterial: THREE.Material,
  clip: { x0: number; x1: number; z0: number; z1: number }, cutAxis: "x" | "z" | null,
): void {
  const cx0 = Math.max(x0, clip.x0), cx1 = Math.min(x1, clip.x1);
  const cz0 = Math.max(z0, clip.z0), cz1 = Math.min(z1, clip.z1);
  if (cx1 - cx0 < 0.05 || cz1 - cz0 < 0.05 || y1 - y0 < 0.05) return;
  g.add(slab(cx1 - cx0, y1 - y0, cz1 - cz0, { pos: [(cx0 + cx1) / 2, (y0 + y1) / 2, (cz0 + cz1) / 2], material }));
  if (cutAxis === "x" && Math.abs(cx1 - clip.x1) < 1e-6) {
    g.add(slab(0.15, y1 - y0, cz1 - cz0, { pos: [cx1 - 0.075, (y0 + y1) / 2, (cz0 + cz1) / 2], material: cutMaterial, edges: false }));
  }
  if (cutAxis === "z" && Math.abs(cz1 - clip.z1) < 1e-6) {
    g.add(slab(cx1 - cx0, y1 - y0, 0.15, { pos: [(cx0 + cx1) / 2, (y0 + y1) / 2, cz1 - 0.075], material: cutMaterial, edges: false }));
  }
}

export function build(opts: BuildOpts = {}): ModelBuildResult {
  const variant = opts.variant ?? "iso";
  const clip = clipOf(variant);
  const cutAxis = variant === "long" ? ("x" as const) : variant === "cross" ? ("z" as const) : null;
  const stage = Math.min(Math.max(opts.stage ?? STAGES.length, 1), STAGES.length);
  const M = tiltMatrix(PARAMS.dip);
  const toWorld = (p: [number, number, number]): [number, number, number] => {
    const v = new THREE.Vector3(...p).applyMatrix4(M);
    return [v.x, v.y, v.z];
  };

  const ore = layerGroup("矿体");
  const pillar = layerGroup("矿柱");
  const develop = layerGroup("采准巷道");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const pillarAsm = new THREE.Group();
  const devAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  develop.add(devAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, pillar, develop, extract, air);

  /* 回采状态：S3 起矿房从下端向上端敞空推进（工作面位置随阶段上移） */
  const minedZ1 = stage >= 3 ? (stage >= 4 ? Z1 - 6 : Z0 + PARAMS.roomWidth * 0.45) : Z0; // 工作面 z
  const t = T;

  /* ── 矿体实体：未采区（工作面以上）为实心矿体；采空区仅剩矿柱 ── */
  if (minedZ1 < Z1) {
    solidPiece(oreAsm, X0, X1, 0, t, minedZ1, Z1, mat.ore(), mat.ore(true), clip, cutAxis); // 未采矿体
  }
  // 端部/顶底柱（矿体层，一直保留）
  solidPiece(oreAsm, X0, X1, 0, t, ZS, Z0, mat.ore(), mat.ore(true), clip, cutAxis); // 底柱
  solidPiece(oreAsm, X0, X1, 0, t, Z1, ZE, mat.ore(), mat.ore(true), clip, cutAxis); // 顶柱
  solidPiece(oreAsm, X0, X1, 0, t, Z0, Z0 + 2.5, mat.ore(), mat.ore(true), clip, cutAxis); // 下端间柱带
  solidPiece(oreAsm, X0, X1, 0, t, Z1 - 2.5, Z1, mat.ore(), mat.ore(true), clip, cutAxis); // 上端间柱带

  /* ── 不规则矿柱群（S3 起，全面法签名）── */
  if (stage >= 3) {
    for (const p of pillarSpots()) {
      if (p.z > minedZ1 - 2) continue; // 工作面前方矿体未采，无柱
      if (p.x < clip.x0 - 2 || p.x > clip.x1 + 2 || p.z < clip.z0 - 2 || p.z > clip.z1 + 2) continue;
      if (p.round) {
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(PARAMS.pillarDia / 2, PARAMS.pillarDia / 2, t, 16), mat.pillar());
        cyl.position.set(p.x, t / 2, p.z);
        pillarAsm.add(cyl);
      } else {
        pillarAsm.add(
          slab(PARAMS.sqPillar, t, PARAMS.sqPillar, { pos: [p.x, t / 2, p.z], material: mat.pillar() }),
        );
      }
    }
    // 采空区壳（敞空房）
    for (const p of [[0.3, Z0 + 0.3]] as const) {
      solidPiece(
        oreAsm, X0 + 2.5, X1 - 2.5, 0.1, t - 0.1, Z0 + 0.3, Math.max(Z0 + 0.4, minedZ1 - 0.2),
        mat.voidShell(), mat.voidShell(), clip, cutAxis,
      );
      void p;
    }
  }

  /* ── 围岩（默认关）── */
  wallAsm.add(slab(X1 - X0 + 4, 5, ZE - ZS + 4, { pos: [(X0 + X1) / 2, -2.5, (ZS + ZE) / 2], material: mat.wall() }));
  wallAsm.add(slab(X1 - X0 + 4, 5, ZE - ZS + 4, { pos: [(X0 + X1) / 2, t + 2.5, (ZS + ZE) / 2], material: mat.wall() }));

  for (const g of [ore, pillar, wall, devAsm]) tilt(g, PARAMS.dip);

  /* ── 采准巷道（世界坐标）：底板岩运巷（S1 起）；矿体内上山 ×2（S1 起）── */
  const yr = Y_TRANSPORT + DRIFT_ROCK / 2;
  if (Z_TRANSPORT >= clip.z0 && Z_TRANSPORT <= clip.z1) {
    const xA = Math.max(X0, clip.x0), xB = Math.min(X1, clip.x1);
    if (xB > xA) {
      develop.add(
        tunnel(
          [
            [xA, yr, Z_TRANSPORT],
            [xB, yr, Z_TRANSPORT],
          ],
          DRIFT_ROCK,
          DRIFT_ROCK,
          {
            name: "transport",
            // 岔口：电耙硐室（右帮）×3 @20m
            openings: [-20, 0, 20]
              .map((dx) => dx)
              .filter((x) => x > xA && x < xB)
              .map((x) => ({ s: x - xA, w: 4.5, part: "wallR" }) as TunnelOpening),
          },
        ),
      );
    }
  }
  // 上山 ×2（矿体框架内，自运巷向上端掘进，切自由面——S1 采准）
  for (const rx of [-18, 16]) {
    if (stage < 1 || rx < clip.x0 || rx > clip.x1) continue;
    const pts: [number, number, number][] = [];
    for (let z = Z0; z <= Math.min(Z1, clip.z1); z += 5) pts.push([rx, DRIFT_ORE / 2, z]);
    if (pts.length >= 2) devAsm.add(tunnel(pts, DRIFT_ORE, DRIFT_ORE, { name: `raise${rx}`, openEnds: true }));
  }
  /* ── 切割工程（S2 起）：底柱漏斗群 + 电耙硐室 ── */
  if (stage >= 2) {
    for (let x = X0 + 4; x <= X1 - 4; x += PARAMS.funnelSpan) {
      if (x < clip.x0 || x > clip.x1) continue;
      const fy = toWorld([0, 0, Z0 + 1])[1];
      const fk = new THREE.Group();
      const neck = new THREE.Mesh(new THREE.BoxGeometry(2, 2.2, 2), mat.tunnel());
      neck.position.set(x, fy + 1.1, Z0 + 1.5);
      fk.add(neck);
      devAsm.add(fk);
    }
    for (const wx of [-20, 0, 20]) {
      if (wx < clip.x0 || wx > clip.x1) continue;
      const wy = toWorld([0, 0, Z0 + 1])[1];
      devAsm.add(
        shaft([wx, wy + 1.5, Z_TRANSPORT + 2], [wx, wy + 1.5, Z0 - 1], 4.5, 3.2, { name: `winch${wx}` }),
      );
    }
  }

  /* ── 出矿系统（S4 起）：电耙 ×2 + 矿流（漏斗→运巷） ── */
  if (stage >= 4) {
    for (const wx of [-20, 0]) {
      if (wx < clip.x0 || wx > clip.x1) continue;
      const wy = toWorld([0, 0, Z0 + 1])[1];
      extract.add(machine("scraper", [wx, wy, Z0 - 1], 180));
    }
    const fx = 0;
    if (fx >= clip.x0 && fx <= clip.x1) {
      extract.add(
        arrows(
          [
            [fx, toWorld([0, 0.8, Z0 + 6])[1], toWorld([0, 0, Z0 + 6])[2]],
            [fx, toWorld([0, 0.5, Z0 + 1.5])[1], toWorld([0, 0, Z0 + 1.5])[2]],
            [fx, Y_TRANSPORT + DRIFT_ROCK - 1, Z_TRANSPORT + 6],
          ],
          "flow",
          3,
          1.9,
        ),
      );
    }
  }

  /* ── 通风（S2 起）：运巷进风 → 上山 → 工作面；污风越顶柱出 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, yr, Z_TRANSPORT],
          [-18, yr, Z_TRANSPORT],
          [-18, yr + 3, Z_TRANSPORT + 2],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [16, toWorld([0, t - 0.8, Z1 - 3])[1], Z1 - 3],
          [16, toWorld([0, t + 1.6, ZE - 1])[1], ZE - 1],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    { label: "不规则矿柱", p: toWorld([0, t + 0.6, -6]) },
    { label: "回采工作面", p: toWorld([-6, t + 0.6, minedZ1 - 1.5]) },
    { label: "上山（自由面）", p: toWorld([16, DRIFT_ORE + 1.2, -2]) },
    { label: "底板运输巷道", p: [0, Y_TRANSPORT + DRIFT_ROCK + 0.6, Z_TRANSPORT] },
    { label: "电耙硐室", p: toWorld([0, DRIFT_ORE + 1.2, Z0 - 1]) },
    { label: "放矿漏斗", p: toWorld([6, DRIFT_ORE + 1.2, Z0 + 1.5]) },
    { label: "顶柱", p: toWorld([-6, t + 0.9, Z1 + 1.2]) },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1 && a.p[2] >= clip.z0 && a.p[2] <= clip.z1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, pillar, develop, extract, air]);
  return { group: root, anchors, bbox, focusPoints: {} };
}

/** 自检：图层合法、锚点≤8、bbox 有效、无 NaN（三变体） */
export function selfCheck(): string[] {
  const problems: string[] = [];
  const legal = new Set<string>(LAYER_NAMES);
  for (const l of LAYERS) if (!legal.has(l)) problems.push(`图层越界: ${l}`);
  for (const variant of ["iso", "long", "cross"] as const) {
    const r = build({ variant });
    if (r.anchors.length > 8) problems.push(`[${variant}] 锚点超限: ${r.anchors.length}`);
    const b = r.bbox;
    if (!b || b.max[1] <= b.min[1]) problems.push(`[${variant}] bbox 无效`);
    let nan = 0;
    r.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.position && Number.isNaN(m.position.x + m.position.y + m.position.z)) nan++;
    });
    if (nan > 0) problems.push(`[${variant}] NaN 位置 ${nan} 处`);
  }
  return problems;
}

void rubble;
