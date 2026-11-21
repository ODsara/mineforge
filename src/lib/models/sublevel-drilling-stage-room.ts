/**
 * 分段凿岩阶段矿房法 builder（sublevel-drilling-stage-room，阶段矿房法变体）
 * 教材依据：《采矿学》（第 2 版）p292-295（阶段 50-70、分段 8-15、间柱 8-12、
 *   顶柱 6-10、底柱 7-13、电耙底部结构）。
 * 辨识特征（与分段矿房法的判别界线）：分段**只布置凿岩巷道**、不独立出矿；
 *   中深孔落矿后矿石下移至**阶段底部漏斗-电耙巷道集中放出**。
 * 坐标：X 走向（矿房 40m）、Z 指向下盘（矿体向 −Z 倾伏 70°）、Y 向上。
 * 工艺阶段（空场模板）：采准→切割→分段凿岩→崩落放矿→底部集中出矿。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, fanHoles, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 70, // src: 书 p292-295（急倾斜）
  thickness: 14, // src: 书 p292-295（中厚，示意）
  stageH: 60, // src: 书 p292（阶段 50-70）
  sublevelH: 12, // src: 书 p292（分段 8-15）
  sublevels: 3, // 示意：3 个凿岩分段
  roomLength: 40, // src: 书 p292（矿房沿走向，示意 40）
  ribPillarW: 10, // src: 书 p292（间柱 8-12）
  crownPillar: 8, // src: 书 p292（顶柱 6-10）
  sillPillar: 10, // src: 书 p292（底柱 7-13）
  holeLen: 8.5, // 分段中深孔孔深（≈分段高/扇布，示意）
  displayNote: "矿体内巷道断面 ×1.4、深孔 ×1.8 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "矿柱", "采准巷道", "深孔", "出矿系统", "通风", "围岩"];

/** 工艺阶段（空场模板；变体签名=底部集中出矿） */
export const STAGES = ["采准工程", "切割工程", "分段凿岩", "崩落与放矿", "底部集中出矿"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.roomLength / 2;
const X1 = PARAMS.roomLength / 2;
const H = PARAMS.stageH;
const DIP_LEN = H / Math.sin((PARAMS.dip * Math.PI) / 180);
const Z_FOOT = 6; // 下盘巷道系（世界 z）
const Y_HAUL = -3;
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
  const pillar = layerGroup("矿柱");
  const develop = layerGroup("采准巷道");
  const holes = layerGroup("深孔");
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

  /* 矿体：倾斜板，S4 崩落后矿房段消失（自下而上退）；底/顶/间柱全期保留 */
  const sillLen = PARAMS.sillPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const roomLen = DIP_LEN - sillLen - crownLen;
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  const cavedLen = stage >= 4 ? roomLen : 0;
  oreAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.ore() }));
  oreAsm.add(slab(wallW, T, crownLen, { pos: [wallCx, T / 2, DIP_LEN - crownLen / 2], material: mat.ore() }));
  oreAsm.add(
    slab(wallW, T, Math.max(roomLen - cavedLen, 0.3), {
      pos: [wallCx, T / 2, sillLen + (roomLen - cavedLen) / 2],
      material: mat.ore(),
    }),
  );
  for (const side of [X0, X1]) {
    const x0 = side === X0 ? X0 : X1 - PARAMS.ribPillarW;
    pillarAsm.add(
      slab(PARAMS.ribPillarW, T, roomLen, { pos: [x0 + PARAMS.ribPillarW / 2, T / 2, sillLen + roomLen / 2], material: mat.pillar() }),
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

  /* ── 采准巷道：下盘阶段运巷（S1）+ 分段凿岩巷 ×3（S1，本变体：分段只凿岩） ── */
  const yr = Y_HAUL + DRIFT / 2;
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
  // 分段凿岩巷 ×3（每分段一条，穿入矿体靠上盘——分段只凿岩不出矿）
  for (let sub = 0; sub < PARAMS.sublevels; sub++) {
    const h = 14 + sub * PARAMS.sublevelH;
    if (h > H - PARAMS.crownPillar) continue;
    const pIn = toWorld([0, T / 2, sillLen + roomLen * 0.82]);
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), h + DRIFT / 2, Z_FOOT + 3],
          [Math.min(X1, clip.x1), h + DRIFT / 2, Z_FOOT + 3],
        ],
        DRIFT,
        DRIFT,
        { name: `drill${sub}` },
      ),
    );
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), h + DRIFT / 2, Z_FOOT + 3],
          [Math.min(X1, clip.x1), pIn[1], Math.max(pIn[2], Z_FOOT - 1)],
        ],
        DRIFT,
        DRIFT,
        { name: `access${sub}`, openEnds: true },
      ),
    );
  }
  /* ── 切割（S2）：拉底槽（矿房下端）+ 切割天井 ── */
  if (stage >= 2) {
    const pCut = toWorld([0, T / 2, sillLen + 3]);
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), pCut[1], pCut[2]],
          [Math.min(X1, clip.x1), pCut[1], pCut[2]],
        ],
        DRIFT,
        DRIFT,
        { name: "sillCut" },
      ),
    );
    stopingCut(pCut);
  }
  function stopingCut(p: [number, number, number]) {
    const pTop = toWorld([0, T, sillLen + 8]);
    develop.add(shaft([0, p[1], p[2]], [0, pTop[1], pTop[2]], 3, 3, { name: "cutRaise" }));
  }
  /* ── 电耙底部结构（S1 采准）：底柱内电耙巷道 + 斗颈 + 漏斗——本变体签名 ── */
  {
    const pSill = toWorld([0, T / 2, sillLen * 0.55]);
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), pSill[1], pSill[2]],
          [Math.min(X1, clip.x1), pSill[1], pSill[2]],
        ],
        DRIFT,
        DRIFT,
        {
          name: "scraperDrift",
          openings: [-15, -5, 5, 15]
            .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
            .map((x) => ({ s: x - Math.max(X0, clip.x0), w: 2.6, part: "roof" }) as TunnelOpening),
        },
      ),
    );
    // 斗颈 ×4：电耙道顶拱向上至拉底水平
    for (const x of [-15, -5, 5, 15]) {
      if (x < clip.x0 || x > clip.x1) continue;
      const p0 = toWorld([0, T / 2, sillLen * 0.55]);
      develop.add(shaft([x, p0[1] + DRIFT / 2, p0[2]], [x, p0[1] + T / 2 + 1, p0[2]], 2.2, 2.2, { name: `neck${x}`, openEnds: true }));
    }
  }

  /* ── 深孔（S3 分段凿岩）：各分段凿岩巷上向扇形中深孔 ── */
  if (stage >= 3) {
    for (let sub = 0; sub < PARAMS.sublevels; sub++) {
      const h = 14 + sub * PARAMS.sublevelH;
      if (h > H - PARAMS.crownPillar) continue;
      for (const dx of [-12, 0, 12]) {
        if (dx < clip.x0 || dx > clip.x1) continue;
        const pIn = toWorld([0, T / 2, sillLen + roomLen * 0.82]);
        holes.add(
          fanHoles([dx, h + DRIFT + 0.5, Math.max(pIn[2], Z_FOOT - 1) + 1], 6, 80, PARAMS.holeLen, {
            baseAngle: 90,
            yawDeg: 90,
            radius: 0.3,
          }),
        );
      }
    }
  }

  /* ── 出矿系统（S4 放矿起）：电耙 ×2 于电耙巷道 + 矿流（漏斗→耙道→溜井） ── */
  if (stage >= 4) {
    for (const wx of [-12, 5]) {
      if (wx < clip.x0 || wx > clip.x1) continue;
      const pSill = toWorld([0, T / 2, sillLen * 0.55]);
      extract.add(machine("scraper", [wx, pSill[1] - DRIFT / 2 + 0.15, pSill[2]], 90));
    }
    extract.add(
      arrows(
        [
          [0, toWorld([0, T / 2, sillLen * 0.55])[1], toWorld([0, 0, sillLen * 0.55])[2]],
          [12, toWorld([0, T / 2, sillLen * 0.55])[1], toWorld([0, 0, sillLen * 0.55])[2]],
          [16, yr, Z_FOOT + 6],
        ],
        "flow",
        3,
        1.9,
      ),
    );
    // 溜井（下盘）——S4 可见矿石下放
    extract.add(shaft([18, Y_HAUL - 1, Z_FOOT + 8], [18, 6, Z_FOOT + 8], 3, 3, { name: "oreRaise" }));
  }

  /* ── 通风（S2 起） ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, Y_HAUL, Z_FOOT],
          [X0 + PARAMS.ribPillarW / 2, Y_HAUL, Z_FOOT - 1],
          [X0 + PARAMS.ribPillarW / 2, Y_HAUL + 4, Z_FOOT - 1],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [X1 - PARAMS.ribPillarW / 2, toWorld([0, T + 1.6, DIP_LEN - crownLen])[1], toWorld([0, 0, DIP_LEN - crownLen])[2]],
          [X1 - PARAMS.ribPillarW / 2, toWorld([0, T + 3, DIP_LEN - crownLen + 1.5])[1], toWorld([0, 0, DIP_LEN - crownLen + 1.5])[2]],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    { label: "分段凿岩巷道", p: [0, 14 + DRIFT + 0.8, Z_FOOT + 3] },
    ...(stage >= 3 ? [{ label: "上向扇形中深孔", p: toWorld([0, T + 0.6, sillLen + roomLen * 0.7]) }] : []),
    ...(stage >= 2 ? [{ label: "切割天井", p: toWorld([0, T + 0.7, sillLen + 8]) }] : []),
    { label: "电耙巷道（底部集中出矿）", p: toWorld([0, T / 2 + DRIFT / 2 + 0.6, sillLen * 0.55]) },
    { label: "斗颈与漏斗", p: toWorld([-5, T / 2 + 1.5, sillLen * 0.55]) },
    { label: "间柱", p: toWorld([X1 - PARAMS.ribPillarW / 2, T + 0.6, sillLen + roomLen * 0.5]) },
    ...(stage >= 4 ? [{ label: "矿石溜井", p: [18, 5, Z_FOOT + 8] }] : []),
    { label: "阶段运输巷道", p: [0, Y_HAUL + DRIFT / 2 + 0.6, Z_FOOT] },
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
  if (PARAMS.sublevelH < 8 || PARAMS.sublevelH > 15) problems.push(`分段应在 8-15m（p292），实测 ${PARAMS.sublevelH}`);
  return problems;
}
