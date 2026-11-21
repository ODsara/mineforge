/**
 * 分段充填采矿法 builder（sublevel-backfill = 教材 12.4 进路充填）
 * 教材依据：《采矿学》（第 2 版）12.4，书 p320-324，图 12-18/12-19（小铁山上向进路）。
 * 辨识特征：**斑马纹一采一充**——已充进路（胶结体）/ 正回采进路 / 待采矿体交错排列；
 *   巷道断面全套 4×4（回风/分段联络道/溜井 Φ3/充填回风井 2×4/分段巷/阶段运输巷/
 *   切割横巷——图 12-19 逐字一致）；先单进路后双进路间隔回采（p321-322）；
 *   进路口木柱木板隔墙+草袋滤水；尾砂胶结 1:4 充填 + 1:8~1:10 浇面。
 * 坐标：X 走向、Z 指向下盘（矿体向 −Z 倾伏 75°）、Y 向上。
 * 工艺阶段（充填模板）：采准→切割→单进路回采充填→双进路间隔回采→接顶充填。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, fanHoles, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 75, // src: 书 p320（极不稳固矿岩、急倾斜）
  thickness: 8, // src: 书 p320（厚 8m）
  stageH: 60, // src: 书 p320（阶段 60m）
  sublevelH: 12, // src: 书 p320（分段 12m）
  layersPerSub: 3, // src: 书 p320（每分段 3 分层 ×4m）
  layerH: 4, // src: 书 p320（分层 4m）
  driftLen: 30, // 进路沿走向长（示意缩自 100m）
  driftW: 4, // src: 书 p320（巷道断面 4×4 逐字一致）
  driftH: 4,
  raiseDia: 3, // src: 书 p320（溜矿井 Φ3）
  fillRaiseW: 4, // 充填回风井 2×4 ×2（示意）
  holeLen: 2.9, // src: 书 p320（台车光面爆破孔深 2.9m）
  displayNote: "矿体内巷道断面 4×4 逐字一致（×1 不放大）；溜井 Φ3",
} as const;

export const LAYERS: LayerName[] = ["矿体", "采准巷道", "回采进路", "充填体", "出矿系统", "通风", "围岩"];

/** 工艺阶段（充填模板；斑马纹为本法签名） */
export const STAGES = ["采准工程", "切割工程", "单进路回采充填", "双进路间隔回采", "接顶充填"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.driftLen / 2;
const X1 = PARAMS.driftLen / 2;
const DRIFT = PARAMS.driftW; // 4×4
const Z_FOOT = 5; // 下盘巷道系（阶段运巷/分段联络道）
const Y_HAUL = -2;

/** 进路阵列：每分段 3 分层 × 每层 4 进路（间距 5m 沿走向） */
const DRIFT_X = [-15, -5, 5, 15];

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
  const develop = layerGroup("采准巷道");
  const stoping = layerGroup("回采进路");
  const fill = layerGroup("充填体");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const fillAsm = new THREE.Group();
  const stopingAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  fill.add(fillAsm);
  stoping.add(stopingAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, develop, stoping, fill, extract, air);

  /* 矿体：倾斜板；回采按斑马纹推进——S3 单进路（1 层 2 进路充填+1 进路回采）、
     S4 双进路间隔回采（2 层斑马纹）、S5 接顶充填（上层全充+下层回采）=现状态 */
  const sillLen = 6 / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = 6 / Math.sin((PARAMS.dip * Math.PI) / 180);
  const roomLen = (PARAMS.stageH - 12) / Math.sin((PARAMS.dip * Math.PI) / 180);
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  // 矿体保留部分：已回采进路（充填）与正在回采进路的空间自矿体中"消失"——
  // 简化为：S3 起，下部分层的矿体被"吃掉"（由充填体/回采进路替代）
  const eatenLayers = stage >= 5 ? 3 : stage >= 4 ? 2 : stage >= 3 ? 1 : 0;
  oreAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.ore() }));
  oreAsm.add(slab(wallW, T, Math.max(roomLen - (eatenLayers * PARAMS.layerH) / Math.sin((PARAMS.dip * Math.PI) / 180), 0.3), {
    pos: [wallCx, T / 2, sillLen + (eatenLayers * PARAMS.layerH) / Math.sin((PARAMS.dip * Math.PI) / 180) + Math.max(roomLen - (eatenLayers * PARAMS.layerH) / Math.sin((PARAMS.dip * Math.PI) / 180), 0.3) / 2],
    material: mat.ore(),
  }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN_OF() + 4, { pos: [wallCx, -2.5, DIP_LEN_OF() / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN_OF() + 4, { pos: [wallCx, T + 2.5, DIP_LEN_OF() / 2], material: mat.wall() }));
  ore.add(oreAsm);
  fill.add(fillAsm);
  stoping.add(stopingAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(fill, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  function DIP_LEN_OF(): number {
    return PARAMS.stageH / Math.sin((PARAMS.dip * Math.PI) / 180);
  }

  /* ── 进路系统（局部框架，自分段巷向两侧，斑马纹三色）──
     分层进路沿走向布置，上下分层错列（教材：进路沿走向、上下错列）。
     斑马纹：x 索引偶=已充填(fillAsm 胶结体) / x 索引奇=回采或待采。 */
  const visibleSubs = Math.min(Math.ceil(eatenLayers / PARAMS.layersPerSub) || 0, 2);
  if (stage >= 3) {
    for (let sub = 0; sub < Math.max(visibleSubs, stage >= 5 ? 2 : 1); sub++) {
      for (let layer = 0; layer < PARAMS.layersPerSub; layer++) {
        const eaten = sub * PARAMS.layersPerSub + layer;
        if (eaten >= eatenLayers && !(stage >= 4 && eaten === eatenLayers)) continue; // 只画已 eaten + 当前回采
        const yBase = -eaten * PARAMS.layerH; // 局部框架（矿体中部起向下）——用世界坐标近似：随倾斜
        const zMid = toWorld([0, T / 2, sillLen + roomLen * 0.6]);
        const y = zMid[1] - eaten * PARAMS.layerH + DRIFT / 2;
        const driftY = y;
        const zDrift = zMid[2] - eaten * 1.5;
        // 分层进路沿走向：DRIFT_X ×4，奇偶决定充填/回采状态
        for (let idx = 0; idx < DRIFT_X.length; idx++) {
          const cx = DRIFT_X[idx];
          if (cx < clip.x0 - 2 || cx > clip.x1 + 2) continue;
          const isFilled = idx % 2 === 0 || stage >= 5;
          const isMining = !isFilled && idx === 1 + (stage >= 4 ? 1 : 0);
          if (isFilled) {
            // 已充填进路（胶结体——斑马纹亮带）
            fillAsm.add(
              slab(4.2, PARAMS.driftH * 0.95, PARAMS.driftLen * 0.86, {
                pos: [cx, driftY, zDrift],
                material: mat.fill(idx % 2),
              }),
            );
          } else {
            // 正在回采/待采进路（空腔管——回采进路层）
            stopingAsm.add(
              tunnel(
                [
                  [cx - PARAMS.driftLen / 2 + 2, driftY, zDrift],
                  [cx + PARAMS.driftLen / 2 - 2, driftY, zDrift],
                ],
                DRIFT,
                DRIFT,
                { name: `drift${sub}-${layer}-${cx}`, openEnds: true },
              ),
            );
            // 正在回采的进路端部：台车凿岩 + 矿流
            if (isMining && stage >= 4) {
              stopingAsm.add(fanHoles([cx + 6, driftY + DRIFT / 2 + 0.3, zDrift], 4, 60, PARAMS.holeLen, { baseAngle: 90, yawDeg: 0, radius: 0.22 }));
              extract.add(machine("lhd", [cx - 6, driftY - DRIFT / 2 + 0.15, zDrift], 0));
            }
          }
        }
        // 进路口隔墙（草袋滤水——已充进路端部）
        for (const cx of DRIFT_X.filter((_, i) => i % 2 === 0)) {
          if (cx < clip.x0 || cx > clip.x1) continue;
          fillAsm.add(
            slab(0.3, PARAMS.driftH * 0.9, 1.2, {
              pos: [cx, driftY, zDrift - PARAMS.driftLen * 0.43],
              material: mat.fill(1),
              edges: false,
            }),
          );
        }
      }
    }
  }

  /* ── 采准巷道（世界坐标，全套 4×4——S1 采准：阶段运巷+分段巷+溜井+充填回风井） ── */
  if (stage >= 1) {
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), Y_HAUL, Z_FOOT],
          [Math.min(X1, clip.x1), Y_HAUL, Z_FOOT],
        ],
        DRIFT,
        DRIFT,
        {
          name: "transport",
          openings: [-12, 0, 12]
            .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
            .map((x) => ({ s: x - Math.max(X0, clip.x0), w: DRIFT, part: "roof" }) as TunnelOpening),
        },
      ),
    );
    // 分段巷 ×2（分层联络道）
    for (const dx of [-12, 0, 12]) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      develop.add(shaft([dx, Y_HAUL + DRIFT, Z_FOOT], [dx, Y_HAUL + 10, Z_FOOT], 3, 3, { name: `link${dx}` }));
    }
    // 溜井 Φ3 + 充填回风井 2×4（间柱内）
    develop.add(shaft([0, Y_HAUL, Z_FOOT], [0, 12, Z_FOOT], PARAMS.raiseDia, PARAMS.raiseDia, { name: "oreRaise" }));
    develop.add(shaft([X1 - 6, 0, Z_FOOT - 2], [X1 - 6, 12, Z_FOOT - 2], PARAMS.fillRaiseW, PARAMS.fillRaiseW, { name: "fillRaise" }));
    // 阶段运输巷道（平行于分段巷，底部）
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), Y_HAUL - 5, Z_FOOT + 4],
          [Math.min(X1, clip.x1), Y_HAUL - 5, Z_FOOT + 4],
        ],
        DRIFT,
        DRIFT,
        { name: "stageHaul" },
      ),
    );
  }
  /* ── 切割横巷（S2）：进路自切割横巷向两端掘——矿房中部 ── */
  if (stage >= 2) {
    const pIn = toWorld([0, T / 2, sillLen + roomLen * 0.55]);
    develop.add(
      tunnel(
        [
          [CUT_LINE(), pIn[1] - 2, Math.max(pIn[2], Z_FOOT) - 1],
          [CUT_LINE(), pIn[1] - 2, Math.min(pIn[2], Z_FOOT + 4) + 1],
        ],
        DRIFT,
        DRIFT,
        { name: "cutCross", openEnds: true },
      ),
    );
  }
  function CUT_LINE(): number {
    return X0 + 8;
  }

  /* ── 出矿系统（S4 起）：LHD + 矿流（进路→溜井） ── */
  if (stage >= 4) {
    extract.add(machine("lhd", [5, Y_HAUL + 1, Z_FOOT - 1], 90));
    extract.add(
      arrows(
        [
          [5, Y_HAUL + 1.2, Z_FOOT - 1],
          [0, Y_HAUL + 1.2, Z_FOOT],
          [0, Y_HAUL + 3, Z_FOOT],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：局扇（通风 layer 示意） ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, Y_HAUL, Z_FOOT],
          [X0 + 2, Y_HAUL + 4, Z_FOOT - 1],
          [0, Y_HAUL + 6, Z_FOOT],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [X1 - 6, 10, Z_FOOT - 2],
          [X1 - 6, 12, Z_FOOT - 2],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 3 ? [{ label: "已充填进路（斑马纹）", p: toWorld([-15, T / 2 + 0.7, sillLen + roomLen * 0.5]) }] : []),
    ...(stage >= 4 ? [{ label: "正在回采进路", p: toWorld([5, T / 2 + 0.7, sillLen + roomLen * 0.45]) }] : []),
    ...(stage >= 4 ? [{ label: "LHD 出矿", p: [5, Y_HAUL + 1.6, Z_FOOT - 1] }] : []),
    { label: "分段巷道", p: [-12, Y_HAUL + 10 + 1, Z_FOOT] },
    { label: "溜矿井 Φ3", p: [0, Y_HAUL + 3.5, Z_FOOT] },
    { label: "充填回风井", p: [X1 - 6, 8, Z_FOOT - 2] },
    ...(stage >= 2 ? [{ label: "切割横巷", p: toWorld([X0 + 8, T / 2 + 0.7, sillLen + roomLen * 0.55]) }] : []),
    { label: "阶段运输巷道", p: [0, Y_HAUL - 5 + DRIFT / 2 + 0.5, Z_FOOT + 4] },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, develop, stoping, fill, extract, air]);
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
  if (PARAMS.driftW !== 4 || PARAMS.driftH !== 4) problems.push(`巷道断面应 4×4（图 12-19 逐字一致），实测 ${PARAMS.driftW}×${PARAMS.driftH}`);
  return problems;
}
