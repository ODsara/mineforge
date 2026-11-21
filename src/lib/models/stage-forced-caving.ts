/**
 * 阶段强制崩落法 builder（stage-forced-caving，10.4.3）
 * 教材依据：《采矿学》（第 2 版）10.4.3，书 p263-266，图 10-53（设有补偿空间，编号 1-12）。
 * 辨识特征：**一次崩全阶段**（非分段逐层）；水平深孔大爆破；补偿空间=爆落矿石
 *   20-30%（薄层单独显色）；纵剖自上而下——崩落岩石—碎矿—补偿空腔—矿体—
 *   底柱漏斗—耙矿巷—运巷；平面放矿（漏斗→耙矿巷→溜井）。
 * 坐标：X 走向（矿块 40m）、Z 指向下盘（矿体向 −Z 倾伏 70°）、Y 向上。
 * 工艺阶段（崩落模板）：采准→切割（补偿空间）→深孔大爆破→放矿→覆盖岩下放矿。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, parallelHoles, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 70, // src: 书 p263（陡倾 60-70）
  thickness: 40, // src: 书 p263（厚 40m，矿块垂直走向）
  stageH: 65, // src: 书 p263（阶段 50-60 取 65 示意）
  sillPillarH: 13, // src: 书 p263（底柱 12-14）
  compensateH: 14, // 补偿空间高≈崩落层 20-30%（书 p264：补偿空间体积=爆落矿石 20-30%）
  blockLength: 40, // src: 书 p263（矿块 30-50）
  displayNote: "矿体内巷道 ×1.4、漏斗 ×1.5 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "崩落岩", "采准巷道", "出矿系统", "深孔", "通风", "围岩"];

/** 工艺阶段（崩落模板；一次崩全阶段+补偿空间为本法签名） */
export const STAGES = ["采准工程", "切割（补偿空间）", "深孔大爆破", "放矿", "覆盖岩下放矿"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.blockLength / 2;
const X1 = PARAMS.blockLength / 2;
const H = PARAMS.stageH;
const DIP_LEN = H / Math.sin((PARAMS.dip * Math.PI) / 180);
const Z_FOOT = 6;
const Y_HAUL = -2;
const DRIFT = 3.9;

function clipOf(variant: string): { x0: number; x1: number } {
  if (variant === "long") return { x0: X0 - 1, x1: 0 };
  return { x0: X0 - 1, x1: X1 + 1 };
}

export function build(opts: BuildOpts = {}): ModelBuildResult {
  const variant = opts.variant ?? "iso";
  const clip = clipOf(variant);
  const stage = Math.min(Math.max(opts.stage ?? STAGES.length, 1), STAGES.length);
  const M = tiltMatrix(PARAMS.dip);
  const toWorld = (p: [number, number, number]): [number, number, number] => {
    const v = new THREE.Vector3(...p).applyMatrix4(M);
    return [v.x, v.y, v.z];
  };

  const ore = layerGroup("矿体");
  const cave = layerGroup("崩落岩");
  const develop = layerGroup("采准巷道");
  const extract = layerGroup("出矿系统");
  const holes = layerGroup("深孔");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const caveAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  cave.add(caveAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, cave, develop, extract, holes, air);

  /* 矿体与状态（纵剖自上而下）：
     S1-2：全阶段实心矿体（仅补偿空间薄层 S2 起）
     S3 大爆破：上部碎矿（崩落岩石）+ 矿体变为碎胀矿石堆
     S4-5 放矿：碎矿自上而下放出，覆盖岩石随之下沉 */
  const sillLen = PARAMS.sillPillarH / Math.sin((PARAMS.dip * Math.PI) / 180);
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  const compLen = PARAMS.compensateH / Math.sin((PARAMS.dip * Math.PI) / 180);
  // 底柱（全期保留）
  oreAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.ore() }));
  const compZ0 = sillLen;
  const compZ1 = sillLen + compLen;

  if (stage <= 2) {
    // 爆破前：全阶段实心矿体 + 补偿空间薄层（S2 切割起，单独显色）
    oreAsm.add(
      slab(wallW, T, DIP_LEN - sillLen, { pos: [wallCx, T / 2, sillLen + (DIP_LEN - sillLen) / 2], material: mat.ore() }),
    );
  } else {
    // 大爆破后：上部崩落岩石（覆盖岩）→ 碎胀矿石堆 → 补偿空腔（放矿期）→ 底柱
    const caveLen = (H - PARAMS.sillPillarH - PARAMS.compensateH) * 0.55 / Math.sin((PARAMS.dip * Math.PI) / 180);
    caveAsm.add(
      rubble(
        { x: wallCx, y: T * 0.1, z: DIP_LEN - caveLen * 0.8, w: wallW - 2, h: caveLen * 0.75, d: caveLen },
        Math.round(caveLen * 2.2),
        4242,
        { size: [1.4, 3], oreMixRatio: 0.4, material: mat.rubble(false) },
      ),
    );
    // 碎胀矿石堆（放矿中，矿体混色）
    const oreHeapLen = compLen * 1.15;
    caveAsm.add(
      rubble(
        { x: wallCx, y: T * 0.1, z: compZ1 - oreHeapLen * 0.5, w: wallW - 2.5, h: T * 0.85, d: oreHeapLen },
        Math.round(oreHeapLen * 2.6),
        777,
        { size: [1.2, 2.6], oreMixRatio: 0.75, material: mat.rubble(true) },
      ),
    );
    // 补偿空腔（S4 放矿期：碎矿与底柱之间的空腔示意——壳）
    if (stage >= 4) {
      caveAsm.add(
        slab(wallW - 3, T * 0.5, compLen * 0.5, {
          pos: [wallCx, T / 2, compZ0 + compLen * 0.75],
          material: mat.voidShell(),
        }),
      );
    }
  }
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, -2.5, DIP_LEN / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, T + 2.5, DIP_LEN / 2], material: mat.wall() }));
  ore.add(oreAsm);
  cave.add(caveAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(cave, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 采准巷道（S1）：阶段运巷 + 耙矿巷 ×2（底柱内，漏斗负担 10-12m）+ 漏斗 + 回风巷 + 行人小井 ── */
  const yr = Y_HAUL + DRIFT / 2;
  const pSill = toWorld([0, T / 2, sillLen * 0.42]);
  develop.add(
    tunnel(
      [
        [Math.max(X0, clip.x0), Y_HAUL, Z_FOOT],
        [Math.min(X1, clip.x1), Y_HAUL, Z_FOOT],
      ],
      DRIFT,
      DRIFT,
      { name: "transport" },
    ),
  );
  // 耙矿巷 ×2（底柱内，水平）
  for (const dz of [-3, 3]) {
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), pSill[1] - 1 + dz * 0.15, pSill[2] + dz],
          [Math.min(X1, clip.x1), pSill[1] - 1 + dz * 0.15, pSill[2] + dz],
        ],
        DRIFT,
        DRIFT,
        { name: `scraper${dz}` },
      ),
    );
    // 漏斗颈 ×4/耙道（向上连补偿空间/矿体——平面放矿）
    for (const x of [-14, -5, 5, 14]) {
      if (x < clip.x0 || x > clip.x1) continue;
      develop.add(shaft([x, pSill[1] + DRIFT / 2 + 0.2, pSill[2] + dz], [x, pSill[1] + T / 2 + 1, pSill[2] + dz], 2.4, 2.4, { name: `funnel${dz}-${x}`, openEnds: true }));
    }
  }
  // 回风巷 + 行人通风小井（S1）
  develop.add(
    tunnel(
      [
        [Math.max(X0, clip.x0), TUNNEL_T + 6, Z_FOOT + 6],
        [Math.min(X1, clip.x1), TUNNEL_T + 6, Z_FOOT + 6],
      ],
      DRIFT * 0.8,
      DRIFT * 0.8,
      { name: "returnAir" },
    ),
  );
  for (const x of [-16, 16]) {
    if (x < clip.x0 || x > clip.x1) continue;
    develop.add(shaft([x, TUNNEL_T, Z_FOOT + 2], [x, TUNNEL_T + 8, Z_FOOT + 6], 2.5, 2.5, { name: `manway${x}` }));
  }

  /* ── 补偿空间（S2 切割）：矿体内薄层空腔（高度≈崩落层 1/4——签名，单独显色） ── */
  if (stage >= 2) {
    cave.add(
      slab(wallW - 2, T * 0.92, compLen, {
        pos: [wallCx, T / 2, (compZ0 + compZ1) / 2],
        material: mat.voidShell(),
      }),
    );
  }

  /* ── 深孔（S3 大爆破后仍显示残余孔迹——水平深孔排）：凿岩硐室+水平深孔 ── */
  if (stage >= 2) {
    // 水平深孔排（自两侧凿岩硐室向矿房，2 层）
    for (const dz of [compZ0 + 2, compZ1 - 2]) {
      const p1 = toWorld([0, T / 2, dz]);
      holes.add(
        parallelHoles([p1[0] - (wallW / 2 - 1), p1[1], p1[2]], 1, 0, wallW - 2, [1, 0, 0], [0, 1, 0], { radius: 0.3 }),
      );
    }
  }

  /* ── 出矿系统（S4 放矿起）：电耙 ×2 + 矿流（漏斗→耙矿巷→溜井） ── */
  if (stage >= 4) {
    for (const dz of [-3, 3]) {
      extract.add(machine("scraper", [0, pSill[1] - 1 + dz * 0.15 - DRIFT / 2 + 0.15, pSill[2] + dz], 0));
    }
    extract.add(
      arrows(
        [
          [0, pSill[1] + 1, pSill[2]],
          [0, Y_HAUL, Z_FOOT],
          [-16, Y_HAUL, Z_FOOT + 2],
        ],
        "flow",
        3,
        1.9,
      ),
    );
    extract.add(shaft([-16, Y_HAUL - 1, Z_FOOT + 2], [-16, Y_HAUL + 4, Z_FOOT + 2], 3, 3, { name: "oreRaise" }));
  }

  /* ── 通风（S2 起）：运巷进风 → 行人小井 → 耙矿巷；污风经回风巷 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, Y_HAUL, Z_FOOT],
          [-16, Y_HAUL, Z_FOOT + 2],
          [-16, Y_HAUL + 5, Z_FOOT + 4],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [16, TUNNEL_T + 6, Z_FOOT + 6],
          [16, TUNNEL_T + 8, Z_FOOT + 6],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 2 ? [{ label: "补偿空间（爆落 20-30%）", p: toWorld([0, T + 0.7, (compZ0 + compZ1) / 2]) }] : []),
    ...(stage >= 2 ? [{ label: "水平深孔", p: toWorld([-10, T / 2 + 0.6, compZ0 + 2]) }] : []),
    ...(stage >= 3 ? [{ label: "崩落岩石（覆盖层）", p: toWorld([0, T + 0.7, DIP_LEN - 6]) }] : []),
    ...(stage >= 4 ? [{ label: "碎胀矿石堆", p: toWorld([0, T + 0.7, compZ1 - compLen * 0.3]) }] : []),
    { label: "耙矿巷道", p: toWorld([0, T / 2 + DRIFT / 2 + 0.6, sillLen * 0.42 + 3]) },
    { label: "漏斗", p: toWorld([-5, T / 2 + 1.2, sillLen * 0.42]) },
    ...(stage >= 4 ? [{ label: "矿石溜井", p: [-16, Y_HAUL + 3.5, Z_FOOT + 2] }] : []),
    { label: "阶段运输巷道", p: [0, Y_HAUL + DRIFT / 2 + 0.5, Z_FOOT] },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, cave, develop, extract, holes, air]);
  return { group: root, anchors, bbox, focusPoints: {} };
}

/** 自检 */
export function selfCheck(): string[] {
  const problems: string[] = [];
  const legal = new Set<string>(LAYER_NAMES);
  for (const l of LAYERS) if (!legal.has(l)) problems.push(`图层越界: ${l}`);
  for (const variant of ["iso", "long"] as const) {
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
  if (PARAMS.sillPillarH < 12 || PARAMS.sillPillarH > 14) problems.push(`底柱应 12-14m（p263），实测 ${PARAMS.sillPillarH}`);
  return problems;
}
