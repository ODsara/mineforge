/**
 * 上向水平分层充填采矿法 builder（upward-horizontal-slice）
 * 教材依据：《采矿学》（第 2 版）12.2，书 p309-315，图 12-2/12-4/12-6。
 * 辨识特征：分层蛋糕自下而上生长——回采→出矿→充填→铺 0.15~0.2m 混凝土底板；
 *   每矿房**至少 2 个溜矿井**（混凝土壁厚 300mm、内径 1.5m——p310）+ 1 个顺路
 *   人行滤水井 + 充填天井（2×2.4m、80-90°）；拉底 4.5-5m 灌浆钢筋混凝土底板
 *   （0.8-1.2m 双层钢筋）；混凝土假巷代替矿石矿柱（p310 术语）。
 * 坐标：X 走向（矿房 40m）、Z 指向下盘（矿体向 −Z 倾伏 72°）、Y 向上。
 * 工艺阶段（充填模板）：采准→拉底与假底→分层回采充填（1~3）→继续上采（4~6）→接顶。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, sliceCake, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 72, // src: 书 p310（急倾斜中厚）
  thickness: 14, // src: 书 p310（t=14m）
  stageH: 45, // src: 书 p310（阶段 45m）
  layers: 6, // 分层数 6 ×2.5m（示意，教材分层 2.5~3m）
  layerH: 2.5, // src: 书 p310（分层高 2.5m）
  roomLength: 40, // src: 书 p310（矿房 30-60 取 40）
  ribPillarW: 7, // src: 书 p310（间柱 6-8）
  crownPillar: 4.5, // src: 书 p310（顶柱 4-5）
  sillPillar: 5, // src: 书 p310（底柱 5，混凝土假巷替代）
  raiseDia: 3, // 溜矿井内径 1.5m ×2 显示
  fillRaiseW: 4.4, // 充填天井 2×2.4m ×1.8
  floorH: 0.5, // 每层顶混凝土铺面 0.15-0.2m ×2.5 显示（示意）
  baseH: 1.2, // 拉底钢筋混凝土底板 0.8-1.2m
  displayNote: "矿体内巷道 ×1.4、溜井/天井 ×2 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "矿柱", "采准巷道", "充填体", "出矿系统", "通风", "围岩"];

/** 工艺阶段（充填模板；蛋糕逐层生长为本法签名） */
export const STAGES = ["采准工程", "拉底与假底", "分层回采充填（1~3 层）", "继续上采（4~6 层）", "接顶"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.roomLength / 2;
const X1 = PARAMS.roomLength / 2;
const RAISE_X = [-12, 12]; // 溜矿井 ×2（矿房两端上盘侧——p310）
const FILTER_X = 0; // 顺路人行滤水井
const FILL_RAISE_X = 22; // 充填天井（间柱内）
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
  const fill = layerGroup("充填体");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const pillarAsm = new THREE.Group();
  const fillAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  fill.add(fillAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, pillar, develop, fill, extract, air);

  /* 矿体：倾斜板；采空区（矿房段）按已充填层数消失（蛋糕逐层吃掉矿体） */
  const sillLen = PARAMS.sillPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const roomLen = (PARAMS.stageH - PARAMS.sillPillar - PARAMS.crownPillar) / Math.sin((PARAMS.dip * Math.PI) / 180);
  // 已充填斜长 = 已完成层数 × 层高 / sinδ（S2=0 层，S3=3 层，S4-5=6 层）
  const filledLayers = stage >= 4 ? 6 : stage >= 3 ? 3 : 0;
  const filledLen = (filledLayers * PARAMS.layerH) / Math.sin((PARAMS.dip * Math.PI) / 180);
  const DIP_LEN = (PARAMS.stageH - PARAMS.sillPillar - PARAMS.crownPillar + 8) / Math.sin((PARAMS.dip * Math.PI) / 180);
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  // 底柱（混凝土假巷——p310）+ 顶柱
  pillarAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.pillar() }));
  pillarAsm.add(slab(wallW, T, crownLen, { pos: [wallCx, T / 2, DIP_LEN - crownLen / 2], material: mat.pillar() }));
  // 矿房段矿体：已充填部分消失（蛋糕吃掉），未采部分保留
  const remainLen = Math.max(roomLen - filledLen, 0.3);
  oreAsm.add(
    slab(wallW, T, remainLen, {
      pos: [wallCx, T / 2, sillLen + filledLen + remainLen / 2],
      material: mat.ore(),
    }),
  );
  // 间柱 ×2
  for (const side of [X0, X1]) {
    const x0 = side === X0 ? X0 : X1 - PARAMS.ribPillarW;
    pillarAsm.add(
      slab(PARAMS.ribPillarW, T, roomLen, { pos: [x0 + PARAMS.ribPillarW / 2, T / 2, sillLen + roomLen / 2], material: mat.pillar() }),
    );
  }
  // 混凝土假巷（底柱内的混凝土浇筑巷道——p310 术语，随 S2 出现）
  if (stage >= 2) {
    pillarAsm.add(
      tunnel(
        [
          [Math.max(X0 + PARAMS.ribPillarW, clip.x0), T / 2, sillLen * 0.45],
          [Math.min(X1 - PARAMS.ribPillarW, clip.x1), T / 2, sillLen * 0.45],
        ],
        3.5,
        3.5,
        { name: "fakeDrift", material: mat.fill(0) },
      ),
    );
  }
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, -2.5, DIP_LEN / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, T + 2.5, DIP_LEN / 2], material: mat.wall() }));
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  fill.add(fillAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(pillar, PARAMS.dip);
  tilt(fill, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 充填体蛋糕（S2 拉底+假底；S3 3 层；S4-5 6 层）——sliceCake 本法签名 ── */
  if (stage >= 2 && filledLen > 0.5) {
    const cake = sliceCake(
      { x: (X0 + X1) / 2, y: sillLen + 0.1, z: 0, w: X1 - X0 - PARAMS.ribPillarW * 2, d: filledLen },
      filledLayers,
      PARAMS.layerH / Math.sin((PARAMS.dip * Math.PI) / 180), // 每层沿倾向斜长（垂高 2.5m）
      { materialFn: (i) => mat.fill(i), floorH: PARAMS.floorH },
    );
    // 层沿倾向铺设：整体放入 fill 组随矿层倾斜
    cake.group.rotation.x = -(PARAMS.dip * Math.PI) / 180;
    cake.group.position.z = filledLen / 2;
    fillAsm.add(cake.group);
    // 拉底钢筋混凝土底板（0.8-1.2m 双层钢筋——S2）
    if (stage >= 2) {
      fillAsm.add(
        slab(X1 - X0 - PARAMS.ribPillarW * 2, PARAMS.baseH * 0.5, 4.5, {
          pos: [(X0 + X1) / 2, T / 2, sillLen + 2.4],
          material: mat.fill(1),
        }),
      );
    }
  }

  /* ── 采准巷道（世界坐标）：下盘阶段运巷（S1）── */
  develop.add(
    tunnel(
      [
        [Math.max(X0, clip.x0), -2, 8],
        [Math.min(X1, clip.x1), -2, 8],
      ],
      DRIFT,
      DRIFT,
      {
        name: "transport",
        openings: [RAISE_X[0], RAISE_X[1], FILTER_X]
          .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
          .map((x) => ({ s: x - Math.max(X0, clip.x0), w: 3.5, part: "roof" }) as TunnelOpening),
      },
    ),
  );
  /* ── 溜矿井 ×2 + 滤水井 + 充填天井（穿蛋糕而上——S2 起随蛋糕生长外露） ── */
  if (stage >= 1) {
    for (const rx of RAISE_X) {
      if (rx < clip.x0 || rx > clip.x1) continue;
      // 溜矿井：下端接运巷顶拱，上端随已充填层数生长
      const topLen = sillLen + filledLen + (stage >= 3 ? 3 : 0);
      const pTop = toWorld([0, T / 2, Math.min(topLen, DIP_LEN)]);
      develop.add(shaft([rx, TUNNEL_T, 8], [rx, pTop[1] - 1, Math.min(pTop[2] - 2, 8 + 2)], PARAMS.raiseDia, PARAMS.raiseDia, { name: `oreRaise${rx}` }));
    }
    if (FILTER_X >= clip.x0 && FILTER_X <= clip.x1) {
      const pTop = toWorld([0, T / 2, Math.min(sillLen + filledLen + 2.5, DIP_LEN)]);
      develop.add(shaft([FILTER_X, TUNNEL_T, 8], [FILTER_X, pTop[1] - 1, 8], 3, 3, { name: "filterRaise" }));
    }
    // 充填天井（间柱内，2×2.4 ×1.8=4.4——S1）
    if (FILL_RAISE_X < clip.x1) {
      const pTop = toWorld([0, T / 2, DIP_LEN - crownLen / 2]);
      develop.add(shaft([FILL_RAISE_X + PARAMS.ribPillarW / 2, T / 2, pTop[2]], [FILL_RAISE_X + PARAMS.ribPillarW / 2, toWorld([0, T / 2, sillLen * 0.3])[1], toWorld([0, 0, sillLen * 0.3])[2]], PARAMS.fillRaiseW, PARAMS.fillRaiseW, { name: "fillRaise" }));
    }
  }
  /* ── 采场斜坡道（机械化版示意——S2） ── */
  if (stage >= 2) {
    develop.add(
      tunnel(
        [
          [X0 + 2, -2, 10],
          [X0 + 2, 4, 14],
        ],
        DRIFT,
        DRIFT,
        { name: "ramp", openEnds: true },
      ),
    );
  }

  /* ── 出矿系统（S3 起）：LHD 于当前分层 + 矿流（工作面→溜井） ── */
  if (stage >= 3) {
    const pWork = toWorld([0, T / 2, sillLen + filledLen - 1.5]);
    extract.add(machine("lhd", [-8, pWork[1] + 0.2, pWork[2] - 3], 90));
    extract.add(
      arrows(
        [
          [-8, pWork[1] + 0.6, pWork[2] - 3],
          [RAISE_X[0], pWork[1] + 0.6, pWork[2] - 2],
          [RAISE_X[0], TUNNEL_T + 2, 8],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 滤水井上行；污风经充填天井 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, -2, 8],
          [FILTER_X, -2, 8],
          [FILTER_X, 1, 7],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [FILL_RAISE_X + PARAMS.ribPillarW / 2, toWorld([0, T + 1.5, DIP_LEN - crownLen])[1], toWorld([0, 0, DIP_LEN - crownLen])[2]],
          [FILL_RAISE_X + PARAMS.ribPillarW / 2, toWorld([0, T + 3, DIP_LEN - crownLen + 1])[1], toWorld([0, 0, DIP_LEN - crownLen + 1])[2]],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 2 ? [{ label: "充填体分层（蛋糕）", p: toWorld([0, T / 2 + 0.7, sillLen + filledLen * 0.5]) }] : []),
    ...(stage >= 2 ? [{ label: "混凝土假巷", p: toWorld([0, T + 0.7, sillLen * 0.45]) }] : []),
    ...(stage >= 2 ? [{ label: "钢筋混凝土底板", p: toWorld([0, T / 2 + 0.7, sillLen + 2.4]) }] : []),
    { label: "溜矿井 ×2", p: [RAISE_X[1], TUNNEL_T + 2.5, 8] },
    { label: "顺路滤水井", p: [FILTER_X, TUNNEL_T + 2.5, 8] },
    { label: "充填天井", p: [FILL_RAISE_X + PARAMS.ribPillarW / 2, 4, toWorld([0, 0, sillLen * 0.3])[2]] },
    ...(stage >= 3 ? [{ label: "LHD 当前分层", p: toWorld([-8, T / 2 + 0.7, sillLen + filledLen - 1.5]) }] : []),
    { label: "间柱", p: toWorld([X1 - PARAMS.ribPillarW / 2, T + 0.6, sillLen + roomLen * 0.5]) },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, pillar, develop, fill, extract, air]);
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
  if (PARAMS.layerH < 2 || PARAMS.layerH > 3.5) problems.push(`分层高应 2.5~3m（p310），实测 ${PARAMS.layerH}`);
  return problems;
}
