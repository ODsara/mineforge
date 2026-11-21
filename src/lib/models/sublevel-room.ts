/**
 * 分段矿房法 builder（sublevel-room）
 * 教材依据：《采矿学》（第 2 版）11.5，书 p290-292，图 11-23（编号 1-10 全要素）。
 * 辨识特征（教材核对 A2 修正后）：每分段自成一套巷道+出矿；下盘分段运输巷①、
 *   装运横巷②（10-12m 间距）、堑沟平巷③（靠下盘）、凿岩平巷④（靠上盘接触带）、
 *   矿柱回采平巷⑤、切割横巷⑥+切割天井⑨→切割槽、斜顶柱（沿倾向斜贴，真厚 5.5m）。
 * 坐标：X 走向（矿房 38m）、Z 指向下盘（矿体向 −Z 倾伏 55°）、Y 向上。
 * 工艺阶段（空场模板）：采准→切割→凿岩→分段回采→矿柱回采与空区处理。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 55, // src: 书 p291（倾斜中厚）
  thickness: 12, // src: 书 p291（t=12m）
  stageH: 50, // src: 书 p291（阶段 50m）
  sublevelH: 20, // src: 书 p291（分段 20m，画 2 分段）
  roomLength: 38, // src: 书 p291（矿房走向 38m）
  ribPillarW: 7, // src: 书 p291（间柱 7m）
  diagonalCrown: 5.5, // src: 书 p291（斜顶柱真厚 5.5m）
  haulageCC: 10, // 装运横巷间距 10-12m 取 10（p291）
  displayNote: "矿体内巷道断面 ×1.4 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "矿柱", "采准巷道", "回采巷道", "深孔", "出矿系统", "围岩"];

/** 工艺阶段（空场模板；分段矿房签名=每分段自成套+斜顶柱） */
export const STAGES = ["采准工程", "切割工程", "凿岩（环形深孔）", "分段回采", "矿柱回采与空区处理"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.roomLength / 2;
const X1 = PARAMS.roomLength / 2;
const H = PARAMS.stageH;
const DIP_LEN = H / Math.sin((PARAMS.dip * Math.PI) / 180);
const Z_FOOT_HAUL = 6; // 下盘分段运输巷轴（世界 z）
const Y_HAUL_BASE = -4; // 底部运输巷中心
const DRIFT = 3.9; // 矿体内巷道 2.8×2.8 ×1.4
const CUT_X = 0; // 切割天井/横巷位置（矿房中部——图 11-23 切割槽）

function clipOf(variant: string): { x0: number; x1: number } {
  if (variant === "long") return { x0: X0 - 1, x1: CUT_X }; // 纵剖过切割槽
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
  const fwZ = (h: number) => (Math.tan((PARAMS.dip * Math.PI) / 180) === 0 ? 0 : h / Math.tan((PARAMS.dip * Math.PI) / 180));

  const ore = layerGroup("矿体");
  const pillar = layerGroup("矿柱");
  const develop = layerGroup("采准巷道");
  const stoping = layerGroup("回采巷道");
  const holes = layerGroup("深孔");
  const extract = layerGroup("出矿系统");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const pillarAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, pillar, develop, stoping, holes, extract);

  /* 矿体：倾斜板（局部框架 z 0..DIP_LEN），拆为——
     底柱(S0..底柱端) + 两个分段矿房段 + 分段间斜顶柱带 + 顶柱段 + 间柱 ×2（走向两端） */
  const sillLen = 6 / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = 6 / Math.sin((PARAMS.dip * Math.PI) / 180);
  const subLen = (PARAMS.sublevelH - 4) / Math.sin((PARAMS.dip * Math.PI) / 180); // 每分段矿房斜长
  const wallW = variant === "long" ? CUT_X - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + CUT_X) / 2 : (X0 + X1) / 2;
  // 底柱段
  oreAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.ore() }));
  // 分段矿房段 ×2：S4 起分段回采（分段 1=下段先采空，S5 全部+斜顶柱回收）
  const minedSub = stage >= 5 ? 2 : stage >= 4 ? 1 : 0;
  for (let sub = 0; sub < 2; sub++) {
    const z0 = sillLen + sub * (subLen + 1.2); // 1.2m = 分段间斜顶柱沿倾向厚
    oreAsm.add(
      slab(wallW, T, Math.max(subLen - 1.5, 0.4), {
        pos: [wallCx, T / 2, z0 + (subLen - 1.5) / 2],
        material: sub < minedSub ? mat.voidShell() : mat.ore(),
      }),
    );
  }
  // 顶柱段
  oreAsm.add(slab(wallW, T, crownLen, { pos: [wallCx, T / 2, DIP_LEN - crownLen / 2], material: mat.ore() }));
  // 斜顶柱 ×1（分段间，沿倾向斜贴、真厚 5.5→显示 3——S5 之前保留，S5 回采时变壳）
  {
    const z0 = sillLen + subLen;
    const diagSlab = slab(wallW, PARAMS.diagonalCrown * 0.55, 1.2, {
      pos: [wallCx, T / 2, z0 + 0.6],
      material: stage >= 5 ? mat.voidShell() : mat.pillar(),
    });
    pillarAsm.add(diagSlab);
  }
  // 间柱 ×2（走向两端，全期保留）
  for (const side of [X0, X1]) {
    const x0 = side === X0 ? X0 : X1 - PARAMS.ribPillarW;
    pillarAsm.add(
      slab(PARAMS.ribPillarW, T, DIP_LEN - sillLen - crownLen, {
        pos: [x0 + PARAMS.ribPillarW / 2, T / 2, sillLen + (DIP_LEN - sillLen - crownLen) / 2],
        material: mat.pillar(),
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

  /* ── 采准巷道（世界坐标/局部框架混合）── */
  // 下盘分段运输巷 ×2（S1 采准）+ 装运横巷（S1）
  for (let sub = 0; sub < 2; sub++) {
    const h = 8 + sub * PARAMS.sublevelH; // 分段运输巷标高
    const zAxis = fwZ(h) + 4; // 分段巷在下盘岩石（接触线下盘 4m）
    if (stage < 1) continue;
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), h + DRIFT / 2, zAxis],
          [Math.min(X1, clip.x1), h + DRIFT / 2, zAxis],
        ],
        DRIFT,
        DRIFT,
        { name: `sublevel${sub}` },
      ),
    );
    // 装运横巷：自分段巷向矿体（每隔 10m——示意 2 条/段）
    for (const dx of [-10, 10]) {
      if (stage < 4 && sub > 0) continue; // S4 起下分段出矿横巷全开
      if (dx < clip.x0 || dx > clip.x1) continue;
      const pIn = toWorld([0, T / 2, z0OfSub(sub) * 0.55]);
      develop.add(
        tunnel(
          [
            [dx, h + DRIFT / 2, zAxis],
            [dx, pIn[1], Math.max(pIn[2], fwZ(h) - 2)],
          ],
          DRIFT,
          DRIFT,
          { name: `cross${sub}-${dx}`, openEnds: true },
        ),
      );
    }
    // 溜井（下盘，每分段一条→底部集中）——S1
    if (sub === 0) {
      develop.add(shaft([X1 - 4, TUNNEL_T, fwZ(8) + 7], [X1 - 4, h + PARAMS.sublevelH, fwZ(8) + 7], 3, 3, { name: "oreRaise" }));
    }
  }
  function z0OfSub(sub: number): number {
    return (sillLen + sub * (subLen + 1.2)) * 0; // 占位（装运横巷进入点由局部框架换算）
  }

  // 堑沟平巷③（靠下盘接触带，每分段一条——S3 凿岩起）+ 凿岩平巷④（靠上盘接触带）
  for (let sub = 0; sub < 2; sub++) {
    if (stage < 3) continue;
    const z0 = sillLen + sub * (subLen + 1.2);
    const hMid = 8 + sub * PARAMS.sublevelH + PARAMS.sublevelH / 2;
    // 堑沟平巷：靠下盘（局部框架 z 小端）
    const pFoot = toWorld([0, T / 2, z0 + subLen * 0.18]);
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), pFoot[1], pFoot[2]],
          [Math.min(X1, clip.x1), pFoot[1], pFoot[2]],
        ],
        DRIFT,
        DRIFT,
        { name: `trench${sub}` },
      ),
    );
    // 凿岩平巷：靠上盘接触带（局部框架 z 大端）
    const pHang = toWorld([0, T / 2, z0 + subLen * 0.85]);
    stoping.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), pHang[1], pHang[2]],
          [Math.min(X1, clip.x1), pHang[1], pHang[2]],
        ],
        DRIFT,
        DRIFT,
        { name: `drill${sub}` },
      ),
    );
    // 环形深孔：自凿岩平巷向堑沟方向扇布（示意——每分段 2 排）
    if (stage >= 3) {
      for (const dx of [-8, 8]) {
        if (dx < clip.x0 || dx > clip.x1) continue;
        holes.add(
          arrows(
            [
              [dx, pHang[1], pHang[2]],
              [dx, pFoot[1] + 1.5, pFoot[2] + 2],
            ],
            "airOut",
            2,
            1.6,
          ),
        );
      }
    }
  }
  // 切割横巷 + 切割天井 → 切割槽（矿房中部——S2 切割）
  if (stage >= 2) {
    const pFoot = toWorld([0, T / 2, sillLen + subLen * 0.18]);
    develop.add(
      tunnel(
        [
          [CUT_X, pFoot[1], pFoot[2]],
          [CUT_X, toWorld([0, T / 2, sillLen + subLen * 0.85])[1], toWorld([0, 0, sillLen + subLen * 0.85])[2]],
        ],
        DRIFT,
        DRIFT,
        { name: "cutCross", openEnds: true },
      ),
    );
    const pTop = toWorld([0, T / 2, sillLen + subLen * 0.85]);
    stoping.add(shaft([CUT_X, pTop[1], pTop[2]], [CUT_X, toWorld([0, T, sillLen + subLen])[1], toWorld([0, 0, sillLen + subLen])[2]], 3, 3, { name: "cutRaise" }));
  }

  /* ── 出矿系统（S4 起）：LHD 于分段运输巷 ── */
  if (stage >= 4) {
    for (const dx of [-10, 10]) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      extract.add(machine("lhd", [dx, 8 + DRIFT / 2 - 0.6, fwZ(8) + 4], 90));
    }
    extract.add(
      arrows(
        [
          [0, 8 + DRIFT / 2, fwZ(8) + 4],
          [X1 - 6, 8 + DRIFT / 2, fwZ(8) + 7],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    { label: "分段运输平巷", p: [0, 8 + DRIFT + 0.8, fwZ(8) + 4] },
    ...(stage >= 3
      ? [
          { label: "堑沟平巷（下盘）", p: toWorld([0, T / 2 + 0.7, sillLen + subLen * 0.18]) },
          { label: "凿岩平巷（上盘）", p: toWorld([0, T / 2 + 0.7, sillLen + subLen * 0.85]) },
        ]
      : []),
    ...(stage >= 2 ? [{ label: "切割天井与切割槽", p: toWorld([CUT_X, T + 0.7, sillLen + subLen * 0.5]) }] : []),
    { label: "斜顶柱", p: toWorld([0, T + 0.7, sillLen + subLen + 0.6]) },
    { label: "间柱", p: toWorld([X1 - PARAMS.ribPillarW / 2, T + 0.6, sillLen + subLen]) },
    ...(stage >= 4 ? [{ label: "铲运机出矿", p: [10, 8 + 1.2, fwZ(8) + 4] }] : []),
    { label: "放矿溜井", p: [X1 - 4, 14, fwZ(8) + 7] },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, pillar, develop, stoping, holes, extract]);
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
  if (PARAMS.sublevelH !== 20) problems.push(`分段应为 20m（p291），实测 ${PARAMS.sublevelH}`);
  return problems;
}


