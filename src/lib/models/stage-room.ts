/**
 * 阶段矿房法 builder（stage-room，主条目 = VCR 垂直深孔球状药包，11.6.2）
 * 教材依据：《采矿学》（第 2 版）11.6 书 p292-303，重点 p295-299，图 11-29/11-31。
 * 辨识特征：顶柱下凿岩硐室（墙高 4m、拱顶趾高 4.5m）、Φ165 垂直平行深孔一排排
 *   自硐室打到拉底水平（3×3m 孔网）、球状药包自下而上逐层崩落、堑沟式人工假底柱、
 *   装运巷道 8m 间距 2.8×2.8。
 * 坐标：X 走向（矿房长 50m）、Z 指向下盘（矿体向 −Z 倾伏 75°）、Y 向上。
 * 工艺阶段（空场模板）：采准→切割（拉底+硐室）→凿岩（深孔阵）→逐层崩落→出矿。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, parallelHoles, tilt, tiltMatrix, unionBBox } from "./geo.ts";
import { mat, holeLineMat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 75, // src: 书 p295（急倾斜厚矿体）
  thickness: 18, // src: 书 p295（t=18m）
  stageH: 60, // src: 书 p295（阶段 60m）
  roomLength: 50, // src: 书 p295（矿房走向 50m）
  ribPillarW: 10, // src: 书 p295（间柱 10m）
  crownPillar: 7, // src: 书 p295（顶柱 7m）
  sillPillar: 6, // src: 书 p295（底柱 6m，混凝土假底+堑沟）
  chamberH: 4.5, // 凿岩硐室：墙高 4m、拱顶趾高 4.5m（p295-296 术语）
  holeLen: 46, // 深孔：自硐室打到拉底水平（≈阶段高−顶柱−硐室）
  holeSpacing: 3, // 孔网 3×3m（p296）
  benchLines: 5, // 崩落分层线 4-5 条（p297 逐层崩落示意）
  driftSpan: 8, // 装运巷道间距 8m（p298）
  displayNote: "深孔 Φ165 ×2.2 显示放大；矿体内巷道 ×1.3 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "矿柱", "采准巷道", "深孔与药包", "出矿系统", "通风", "围岩"];

/** 工艺阶段（空场模板；VCR 签名=凿岩→自下而上分层崩落） */
export const STAGES = ["采准工程", "切割与拉底", "凿岩（深孔布阵）", "分层崩落", "出矿与清底"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.roomLength / 2;
const X1 = PARAMS.roomLength / 2;
const H = PARAMS.stageH;
const DIP_LEN = H / Math.sin((PARAMS.dip * Math.PI) / 180);
const Z_TRANSPORT = 8; // 下盘阶段运巷轴（世界 z）
const Y_TRANSPORT = -6;
const DRIFT_ROCK = 7.2;
const DRIFT_ORE = 3.6;

function clipOf(variant: string): { x0: number; x1: number } {
  if (variant === "long") return { x0: X0 - 1, x1: 0 };
  return { x0: X0 - 1, x1: X1 + 1 };
}

export function build(opts: BuildOpts = {}): ModelBuildResult {
  const variant = opts.variant ?? "iso";
  const clip = clipOf(variant);
  const isLong = variant === "long";
  const stage = Math.min(Math.max(opts.stage ?? STAGES.length, 1), STAGES.length);
  const M = tiltMatrix(PARAMS.dip);
  const toWorld = (p: [number, number, number]): [number, number, number] => {
    const v = new THREE.Vector3(...p).applyMatrix4(M);
    return [v.x, v.y, v.z];
  };

  const ore = layerGroup("矿体");
  const pillar = layerGroup("矿柱");
  const develop = layerGroup("采准巷道");
  const holes = layerGroup("深孔与药包");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const pillarAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, pillar, develop, holes, extract, air);

  /* 矿体：急倾厚板（局部框架：z 0..DIP_LEN 沿倾向，y 0..T 厚度方向）。
     VCR 逐层崩落：矿房段自下而上消失——S4 崩落 2/3 分层线、S5 全崩。 */
  const sillLen = PARAMS.sillPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const roomLen = DIP_LEN - sillLen - crownLen;
  // 已崩高度（沿倾向）按阶段：S3 凿岩期矿房未爆；S4 崩 60%；S5 全崩
  const cavedLen = stage >= 5 ? roomLen : stage >= 4 ? roomLen * 0.6 : 0;
  const wallW = isLong ? 0 - X0 : X1 - X0;
  const wallCx = isLong ? (X0 + 0) / 2 : (X0 + X1) / 2;
  // 底柱 + 顶柱 + 间柱 ×2（全厚，全期保留）
  oreAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.ore() }));
  oreAsm.add(slab(wallW, T, crownLen, { pos: [wallCx, T / 2, DIP_LEN - crownLen / 2], material: mat.ore() }));
  oreAsm.add(slab(wallW, T, roomLen - cavedLen, {
    pos: [wallCx, T / 2, sillLen + (roomLen - cavedLen) / 2],
    material: mat.ore(),
  }));
  // 间柱 ×2（走向两端，全期保留）
  for (const side of [X0, X1]) {
    const x0 = side === X0 ? X0 : X1 - PARAMS.ribPillarW;
    pillarAsm.add(
      slab(PARAMS.ribPillarW, T, roomLen, { pos: [x0 + PARAMS.ribPillarW / 2, T / 2, sillLen + roomLen / 2], material: mat.pillar() }),
    );
  }
  // 人工假底（堑沟式底柱内：混凝土假底薄层，p298）——S2 切割起
  if (stage >= 2) {
    pillarAsm.add(
      slab(wallW - PARAMS.ribPillarW * 2, 0.8, roomLen * 0.9, {
        pos: [wallCx, T / 2, sillLen + roomLen / 2],
        material: mat.fill(0),
        edges: false,
      }),
    );
  }
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, -2.5, DIP_LEN / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, T + 2.5, DIP_LEN / 2], material: mat.wall() }));
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(pillar, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 采准巷道（世界坐标）：下盘阶段运巷 + 装运巷道 ×2（间距 8m）+ 溜井 ── */
  const yr = Y_TRANSPORT + DRIFT_ROCK / 2;
  develop.add(
    tunnel(
      [
        [Math.max(X0, clip.x0), yr, Z_TRANSPORT],
        [Math.min(X1, clip.x1), yr, Z_TRANSPORT],
      ],
      DRIFT_ROCK,
      DRIFT_ROCK,
      { name: "transport" },
    ),
  );
  // 装运巷道 ×2（底柱内，2.8×2.8 真实 → 3.6 显示，间距 8m 沿走向）——S1 采准
  for (const dx of [-10, 10]) {
    if (dx < clip.x0 || dx > clip.x1) continue;
    const pFoot = toWorld([0, T / 2, sillLen * 0.6]);
    develop.add(
      tunnel(
        [
          [dx, yr, Z_TRANSPORT],
          [dx, pFoot[1], pFoot[2]],
        ],
        DRIFT_ORE,
        DRIFT_ORE,
        { name: `haulage${dx}` },
      ),
    );
  }
  // 凿岩硐室（顶柱之下，拱形大断面 6×4.5——S2 切割）：位于矿体上端接触带
  if (stage >= 2) {
    const pTop = toWorld([0, T / 2, DIP_LEN - crownLen + 1.5]);
    develop.add(
      tunnel(
        [
          [-4, pTop[1], pTop[2] - 2],
          [4, pTop[1], pTop[2] - 2],
        ],
        6,
        4.5,
        { name: "drillChamber" },
      ),
    );
  }

  /* ── 深孔与药包（S3 凿岩布阵）：Φ165 垂直平行深孔，3m 孔网，自硐室打到拉底水平 ── */
  if (stage >= 3) {
    const holeLen = roomLen * (stage >= 5 ? 1 : stage >= 4 ? 1 : 0.98);
    // 已爆分层：S4 起下部孔消失（逐层崩落自下而上）——剩余孔自上而下
    const remaining = stage >= 5 ? 0.15 : stage >= 4 ? 0.45 : 1;
    const rows = Math.floor((X1 - X0 - PARAMS.ribPillarW * 2) / PARAMS.holeSpacing);
    for (let i = 0; i <= rows; i++) {
      const hx = X0 + PARAMS.ribPillarW + i * PARAMS.holeSpacing;
      if (hx < clip.x0 || hx > clip.x1) continue;
      const origin = toWorld([hx, T / 2, DIP_LEN - crownLen - 0.5]);
      holes.add(
        parallelHoles(
          [origin[0], origin[1], origin[2]],
          1,
          0,
          holeLen * remaining,
          [0, -1, 0.12], // 垂直向下微倾向下盘
          [1, 0, 0],
          { radius: 0.36, charge: stage >= 4 }, // Φ165 ×2.2 显示；药包球节点 S4 起
        ),
      );
    }
    // 崩落分层线（S4 起：自下而上已崩界线——金色示意线）
    if (stage >= 4) {
      const benchYs = [0.25, 0.45, 0.65].slice(0, PARAMS.benchLines - 2);
      for (const f of benchYs) {
        const p1 = toWorld([X0 + PARAMS.ribPillarW, T / 2, sillLen + roomLen * f]);
        const p2 = toWorld([X1 - PARAMS.ribPillarW, T / 2, sillLen + roomLen * f]);
        if (isLong && p2[0] < clip.x0) continue;
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.max(p1[0], clip.x0), p1[1], p1[2]),
          new THREE.Vector3(Math.min(p2[0], clip.x1), p2[1], p2[2]),
        ]);
        holes.add(new THREE.Line(geo, holeLineMat()));
      }
    }
  }

  /* ── 出矿系统（S4 起）：LHD 在装运巷 + 矿流 ── */
  if (stage >= 4) {
    for (const dx of [-10, 10]) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      extract.add(machine("lhd", [dx, yr - DRIFT_ROCK / 2 + 0.2, Z_TRANSPORT - 2], 180));
    }
    extract.add(
      arrows(
        [
          [-10, yr - 1, Z_TRANSPORT - 2],
          [-10, yr, Z_TRANSPORT],
          [0, yr, Z_TRANSPORT + 1],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 装运巷 → 采场；污风经凿岩硐室上至回风 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, yr, Z_TRANSPORT],
          [-10, yr, Z_TRANSPORT],
          [-10, yr - 2, Z_TRANSPORT - 2],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [0, toWorld([0, T + 1.6, DIP_LEN - crownLen])[1], toWorld([0, 0, DIP_LEN - crownLen])[2]],
          [0, toWorld([0, T + 3, DIP_LEN - crownLen + 1.5])[1], toWorld([0, 0, DIP_LEN - crownLen + 1.5])[2]],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 2 ? [{ label: "凿岩硐室（拱形）", p: toWorld([0, T + 1, DIP_LEN - crownLen + 1.5]) }] : []),
    ...(stage >= 3 ? [{ label: "Φ165 垂直深孔", p: toWorld([-6, T + 0.6, DIP_LEN * 0.55]) }] : []),
    ...(stage >= 4 ? [{ label: "分层崩落线", p: toWorld([0, T / 2 + 0.8, sillLen + roomLen * 0.45]) }] : []),
    { label: "间柱", p: toWorld([X1 - PARAMS.ribPillarW / 2, T + 0.6, sillLen + roomLen * 0.5]) },
    { label: "人工假底", p: toWorld([0, T / 2 + 0.7, sillLen + roomLen * 0.5]) },
    { label: "装运巷道", p: [10, yr + DRIFT_ROCK / 2 + 0.5, Z_TRANSPORT] },
    { label: "底板运输巷道", p: [0, Y_TRANSPORT + DRIFT_ROCK + 0.6, Z_TRANSPORT] },
    { label: "顶柱", p: toWorld([0, T + 0.7, DIP_LEN - crownLen / 2]) },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, pillar, develop, holes, extract, air]);
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
  if (PARAMS.holeSpacing !== 3) problems.push(`孔网应为 3×3m（p296），实测 ${PARAMS.holeSpacing}`);
  return problems;
}


