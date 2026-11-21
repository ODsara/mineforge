/**
 * 下向分层充填采矿法 builder（downward-slice）
 * 教材依据：《采矿学》（第 2 版）12.3，书 p316-320，图 12-11/12-13/12-16/12-17。
 * 辨识特征（与上向法相反）：**蛋糕从上往下吃**——已采充填区在上部（充填体+人工
 *   假顶），当前层在中部，矿体实体在下部；水力充填分层高 2~3m、巷宽 2~3m、倾斜
 *   10°~15°；上下分层回采巷道**错列**；钢筋混凝土底板+隔离层+脱水砂门（水力方案）；
 *   六角形回采巷道为可选变体（龙首矿）。无顶柱/底柱/间柱一步骤回采。
 * 坐标：X 走向、Z 指向下盘（矿体向 −Z 倾伏 70°）、Y 向上。
 * 工艺阶段（充填模板）：采准→首分层（假顶形成）→向下分层（2~3）→深部分层（4~6）→接顶。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, sliceCake, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 70, // src: 书 p316（急倾斜不稳固）
  thickness: 8, // src: 书 p316（t=8m）
  stageH: 40, // src: 书 p316（阶段 40m）
  layers: 6, // 分层 6 ×2.5m（示意；水力充填分层高 2~3m）
  layerH: 2.5, // src: 书 p316-317（水力充填分层高 2~3m 取 2.5）
  blockLength: 40, // src: 书 p316（矿块 40×40）
  blockWidth: 40,
  slopeDeg: 12, // src: 书 p316-317（水力充填倾斜 10°~15° 取 12）
  crossW: 2.5, // src: 书 p316-317（水力充填回采巷宽 2~3m ×1.4 显示）
  displayNote: "矿体真厚 ×1 显示；回采巷道 2.5×3.5（真实 2.5×2.5 ×1.4 显示，示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "采准巷道", "充填体", "回采巷道", "出矿系统", "通风", "围岩"];

/** 工艺阶段（充填模板；方向反转=本法签名） */
export const STAGES = ["采准工程", "首分层回采与假顶", "向下分层（2~3）", "深部分层（4~6）", "接顶"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.blockLength / 2;
const X1 = PARAMS.blockLength / 2;
const Z0 = -PARAMS.blockWidth / 2;
const Z1 = PARAMS.blockWidth / 2;
const LAY = PARAMS.layers;
const LAY_H = PARAMS.layerH;
const DRIFT = 3.5;

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
  const fill = layerGroup("充填体");
  const stoping = layerGroup("回采巷道");
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
  root.add(ore, wall, develop, fill, stoping, extract, air);

  /* 阶段自上而下：矿体顶面 = Y 顶；已采充填层数 filled = stage≥5?6 : stage≥4?4 : stage≥3?2 : stage≥2?1 : 0
     蛋糕反转：充填体占据矿体顶部 filled×LAY_H；剩余矿体在其下。
     首分层充填体内含钢筋混凝土底板（隔离层示意线）。 */
  const filled = stage >= 5 ? 6 : stage >= 4 ? 4 : stage >= 3 ? 2 : stage >= 2 ? 1 : 0;
  const slopeH = LAY_H / Math.sin((PARAMS.dip * Math.PI) / 180); // 每层沿倾向斜长
  const filledLen = filled * slopeH;
  const totalLen = PARAMS.blockWidth;
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;

  // 矿体（未采）：矿块下部（已充填顶部之外）
  const oreLen = Math.max(totalLen - filledLen, 0.4);
  oreAsm.add(
    slab(wallW, T, oreLen, {
      pos: [wallCx, T / 2, Z1 - oreLen / 2],
      material: mat.ore(),
    }),
  );
  // 充填体（上部 filled 层，含人工假顶底线）——sliceCake 自矿体顶面向下铺
  if (filled > 0) {
    const cake = sliceCake(
      { x: wallCx, y: -filled * LAY_H + 0.06, z: Z0 + 0.4, w: wallW - 1, d: filledLen - 0.8 },
      filled,
      slopeH,
      { materialFn: (i) => mat.fill(i) },
    );
    // 首分层底板：钢筋混凝土（主筋示意双线）
    if (filled >= 1) {
      cake.group.add(
        slab(wallW - 1.4, 0.28, slopeH - 0.6, {
          pos: [0, -filled * LAY_H + slopeH / 2, 0],
          material: mat.fill(1),
          edges: false,
        }),
      );
    }
    // 每层顶面隔离层双细线（人工假顶标识——水力方案）
    for (let i = 0; i < filled; i++) {
      const yy = -filled * LAY_H + (i + 1) * slopeH;
      cake.group.add(
        slab(wallW - 1.4, 0.1, slopeH - 0.8, { pos: [0, yy - 0.12, 0], material: mat.machine(), edges: false }),
      );
    }
    fillAsm.add(cake.group);
  }
  wallAsm.add(slab(wallW * 1.04, 5, totalLen * 1.06 + 4, { pos: [wallCx, -filled * LAY_H - 2.5, (Z0 + Z1) / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, totalLen * 1.06 + 4, { pos: [wallCx, T + 2.5 - filled * LAY_H, (Z0 + Z1) / 2], material: mat.wall() }));
  ore.add(oreAsm);
  fill.add(fillAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(fill, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 回采巷道（错列！）：每分层 2 条沿下盘切割巷→矿块，相邻分层错列半距 ──
     水力充填：巷宽 2.5、倾斜 12°、断面 2.5×3.5（×1.4 显示）。S2 首层、S3 2 层、S4 4 层、S5 6 层 */
  const visibleLayers = filled;
  for (let layer = 0; layer < visibleLayers; layer++) {
    const yTop = -filled * LAY_H + (layer + 1) * LAY_H; // 分层顶标高（世界，倾斜前的局部）
    // 错列：偶数层巷道位于 x=±8，奇数层位于 x=±16 与 0（上下层错列半距）
    const xs = layer % 2 === 0 ? [-10, 10] : [-18, 0, 18];
    for (const cx of xs) {
      if (cx < clip.x0 || cx > clip.x1) continue;
      const pts: [number, number, number][] = [];
      // 沿倾斜（下盘→上盘）倾斜 12°：自下盘切割巷向上
      const zStart = Z0 + 3;
      const zEnd = Z1 - 3;
      for (let z = zStart; z <= zEnd; z += 6) pts.push([cx, yTop - LAY_H / 2 + ((z - zStart) / (zEnd - zStart)) * (LAY_H / 2), z]);
      pts.push([cx, yTop - LAY_H / 2 + LAY_H / 2, zEnd]);
      stopingAsm.add(tunnel(pts, PARAMS.crossW, DRIFT, { name: `stoping${layer}-${cx}`, openEnds: true }));
    }
    // 下盘切割巷（每分层一条，沿走向）
    stopingAsm.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), yTop - LAY_H / 2, Z0 + 1],
          [Math.min(X1, clip.x1), yTop - LAY_H / 2, Z0 + 1],
        ],
        DRIFT,
        DRIFT,
        { name: `cutLayer${layer}` },
      ),
    );
    // 脱水砂门（分层末端的滤水隔断——水力方案签名，位于回采巷道靠充填区侧）
    for (const cx of xs) {
      const p = toWorld([cx, yTop - LAY_H / 2, Z0 + 4]);
      stopingAsm.add(slab(1.8, DRIFT * 0.8, 0.3, { pos: [p[0], p[1], p[2] - 1.6], material: mat.fill(1), edges: false }));
    }
  }

  /* ── 采准巷道（世界坐标）：下盘运巷（S1）+ 两侧下盘接触带天井/溜井居中（S1） ── */
  if (stage >= 1) {
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), TUNNEL_T, Z0 - 6],
          [Math.min(X1, clip.x1), TUNNEL_T, Z0 - 6],
        ],
        DRIFT,
        DRIFT,
        {
          name: "footHaul",
          openings: [-14, 0, 14]
            .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
            .map((x) => ({ s: x - Math.max(X0, clip.x0), w: 3, part: "roof" }) as TunnelOpening),
        },
      ),
    );
    // 溜井居中 + 两侧天井（下盘接触带）
    develop.add(shaft([0, TUNNEL_T, Z0 - 6], [0, TUNNEL_T + 6, Z0 - 6], 3, 3, { name: "oreRaise" }));
    for (const x of [X0 + 2, X1 - 2]) {
      if (x < clip.x0 - 2 || x > clip.x1 + 2) continue;
      develop.add(shaft([x, TUNNEL_T, Z0 - 6], [x, TUNNEL_T + 6, Z0 - 6], 3, 3, { name: `raise${x > 0 ? "E" : "W"}` }));
    }
  }

  /* ── 出矿系统（S3 起）：电耙于下盘运巷 + 矿流（各分层→溜井） ── */
  if (stage >= 3) {
    extract.add(machine("scraper", [0, TUNNEL_T - DRIFT / 2 + 0.15, Z0 - 6], 90));
    extract.add(
      arrows(
        [
          [0, toWorld([0, T / 2, Z0 + 2])[1], toWorld([0, 0, Z0 + 2])[2]],
          [0, TUNNEL_T + 2, Z0 - 6],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 两侧天井上行 → 各分层；污风经另一天井 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, TUNNEL_T, Z0 - 6],
          [X0 + 2, TUNNEL_T + 4, Z0 - 6],
          [X0 + 2, TUNNEL_T + 6, Z0 - 5],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [X1 - 2, TUNNEL_T + 5, Z0 - 6],
          [X1 - 2, TUNNEL_T + 7, Z0 - 5],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(filled > 0 ? [{ label: "人工假顶（隔离层）", p: toWorld([0, T / 2 + 0.7, Z1 - filledLen * 0.3]) }] : []),
    ...(filled > 0 ? [{ label: "充填体（上-grade 已采区）", p: toWorld([0, T / 2 + 0.7, Z1 - filledLen * 0.7]) }] : []),
    ...(visibleLayers > 0 ? [{ label: "错列回采巷道", p: [10, toWorld([0, T / 2, Z0 + 6])[1], toWorld([0, 0, Z0 + 6])[2]] as [number, number, number] }] : []),
    ...(filled >= 1 ? [{ label: "钢筋混凝土底板", p: toWorld([0, T / 2 + 0.7, Z1 - slopeH * 0.5]) }] : []),
    ...(filled >= 1 ? [{ label: "脱水砂门", p: toWorld([-10, T / 2 + 0.6, Z0 + 4]) }] : []),
    { label: "放矿溜井（居中）", p: [0, TUNNEL_T + 2.8, Z0 - 6] },
    { label: "下盘运巷", p: [0, TUNNEL_T + DRIFT / 2 + 0.5, Z0 - 6] },
    { label: "未采矿体", p: toWorld([0, T + 0.6, Z1 - Math.max(oreLen, 1) * 0.5]) },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, develop, fill, stoping, extract, air]);
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
  if (PARAMS.slopeDeg < 10 || PARAMS.slopeDeg > 15) problems.push(`水力充填倾斜应 10°~15°（p316-317），实测 ${PARAMS.slopeDeg}`);
  return problems;
}
