/**
 * 单层充填采矿法 builder（single-layer）
 * 教材依据：《采矿学》（第 2 版）12.1，书 p308-309，图 12-1。
 * 辨识特征：缓倾斜薄矿体壁式长工作面全断面（高=矿厚）；**充填体—木棚支架—工作面**
 *   三段沿走向排列（控顶 2.4m、充填距 2.4m、悬顶 4.8m）；砂门子隔断；充填管自上一
 *   阶段巷道引入；不留矿柱一步骤回采。
 * 坐标：X 走向（工作面推进方向）、Z 指向下盘（矿体向 −Z 倾伏 25°）、Y 向上。
 * 工艺阶段（充填模板）：采准→切割→回采与充填→接顶充填→下一循环。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, tilt, tiltMatrix, unionBBox, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 25, // src: 书 p308（缓倾斜 <30°，教材核对 C4 修正）
  thickness: 3.75, // 真厚 1.5m ×2.5 显示（薄矿体显示规则）
  trueThickness: 1.5,
  blockLength: 70, // src: 书 p308（走向 60-80）
  blockWidth: 35, // src: 书 p308（斜长 30-40）
  faceAdvance: 2.4, // 控顶距/充填距 2.4m（书 p308）
  overhang: 4.8, // 悬顶距=充填距+控顶距（书 p308）
  footwallOffset: 9, // 运巷距矿体 8-10m（书 p308）
  displayNote: "矿体真厚 1.5m ×2.5 显示；矿体内巷道 ×1.5 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "采准巷道", "充填体", "支护", "出矿系统", "通风", "围岩"];

/** 工艺阶段（充填模板） */
export const STAGES = ["采准工程", "切割工程", "回采与充填", "接顶充填", "下一循环推进"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.blockLength / 2;
const X1 = PARAMS.blockLength / 2;
const Z0 = -PARAMS.blockWidth / 2;
const Z1 = PARAMS.blockWidth / 2;
const Y0 = 0;
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
  const support = layerGroup("支护");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const fillAsm = new THREE.Group();
  const supportAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  fill.add(fillAsm);
  support.add(supportAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, develop, fill, support, extract, air);

  /* 回采与充填三段式（沿走向 X 排列，S3 起）：
     xFace = 工作面位置（S3 于 1/4 处、S4 于 1/2 处、S5 于 2/3 处——逐循环推进）
     xFillEnd = 已充填边界（= xFace − overhang 之外的旧采空区） */
  const xf = stage >= 5 ? X0 + PARAMS.blockLength * 0.66 : stage >= 4 ? X0 + PARAMS.blockLength * 0.5 : X0 + PARAMS.blockLength * 0.25;
  const fillEnd = xf - PARAMS.overhang - PARAMS.faceAdvance;

  /* 矿体实体：工作面以下（更早推进方向）为已采空（充填体替代），工作面以上未采 */
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  // 未采矿体：工作面之前的整条（z 全斜长）
  if (xf < X1) {
    oreAsm.add(slab(wallW * (xf < X1 ? (X1 - xf) / (X1 - X0) : 0), T, Z1 - Z0, {
      pos: [(xf + X1) / 2, T / 2, (Z0 + Z1) / 2],
      material: mat.ore(),
    }));
  }
  // 工作面到充填边界之间的空顶区壳（控顶区）
  {
    const shell = slab(Math.max(xf - fillEnd, 0.4), T, Z1 - Z0, {
      pos: [(xf + fillEnd) / 2, T / 2, (Z0 + Z1) / 2],
      material: mat.voidShell(),
    });
    fillAsm.add(shell);
  }
  // 充填体（已充填区：x < fillEnd）
  if (fillEnd > X0) {
    fillAsm.add(
      slab(fillEnd - X0, T * 0.94, Z1 - Z0, {
        pos: [(fillEnd + X0) / 2, (T * 0.94) / 2, (Z0 + Z1) / 2],
        material: mat.fill(0),
      }),
    );
  }
  // 木棚支架排（控顶区：每 1.2m 一排，支护层）
  const propY = T / 2;
  for (let x = fillEnd + 1.2; x < xf; x += 1.2) {
    for (const z of [Z0 + 3, 0, Z1 - 3]) {
      const p = toWorld([x, 0, z]);
      const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, T, 8), mat.machine());
      prop.position.set(p[0], p[1], p[2]);
      supportAsm.add(prop);
    }
  }
  // 充填管（S3 起，自上一阶段巷道引入，沿控顶区上侧敷设）
  if (stage >= 3) {
    const pipeY = toWorld([0, T + 0.35, Z1 - 4])[1];
    supportAsm.add(
      tunnel(
        [
          [Math.max(fillEnd, clip.x0), pipeY, Z1 - 4],
          [Math.min(xf, clip.x1), pipeY, Z1 - 4],
        ],
        0.5,
        0.5,
        { name: "fillPipe", material: mat.machine() },
      ),
    );
  }
  // 砂门子（帮/堵头：采场与待充填区交界的隔板——S3 起）
  if (stage >= 3) {
    const p = toWorld([fillEnd, T / 2, (Z0 + Z1) / 2]);
    fillAsm.add(slab(0.25, T * 0.96, Z1 - Z0, { pos: [p[0], p[1], p[2]], material: mat.fill(1) }));
  }
  wallAsm.add(slab(wallW * 1.04, 5, (Z1 - Z0) * 1.06 + 4, { pos: [wallCx, -2.5, (Z0 + Z1) / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, (Z1 - Z0) * 1.06 + 4, { pos: [wallCx, T + 2.5, (Z0 + Z1) / 2], material: mat.wall() }));
  ore.add(oreAsm);
  fill.add(fillAsm);
  support.add(supportAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(fill, PARAMS.dip);
  tilt(support, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 采准巷道（世界坐标）：底板岩运巷（S1）+ 切割上山（S1，矿体边界）+ 矿石溜井（S2） ── */
  const yr = PARAMS.footwallOffset + DRIFT / 2 - 2;
  if (stage >= 1) {
    const xA = Math.max(X0, clip.x0), xB = Math.min(X1, clip.x1);
    if (xB > xA) {
      develop.add(
        tunnel(
          [
            [xA, yr, Z0 - PARAMS.footwallOffset],
            [xB, yr, Z0 - PARAMS.footwallOffset],
          ],
          DRIFT,
          DRIFT,
          {
            name: "footHaul",
            openings: [X0 + 10, 0, X1 - 10]
              .filter((x) => x > xA && x < xB)
              .map((x) => ({ s: x - xA, w: 3, part: "wallR" }) as TunnelOpening),
          },
        ),
      );
    }
    // 切割上山（矿体上边界，沿倾向）——S1
    const p = toWorld([X1 - 6, T / 2, Z0]);
    develop.add(
      shaft([p[0], p[1] - 1, p[2]], [p[0], toWorld([0, T / 2, Z1 - 2])[1], toWorld([0, 0, Z1 - 2])[2]], DRIFT, DRIFT, { name: "cutRaise" }),
    );
  }
  if (stage >= 2) {
    // 切割巷（矿体下边界，沿走向）——S2
    const p = toWorld([0, T / 2, Z0 + 1]);
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), p[1], p[2]],
          [Math.min(X1, clip.x1), p[1], p[2]],
        ],
        DRIFT,
        DRIFT,
        { name: "cutDrift" },
      ),
    );
    // 矿石溜井 ×3（运巷→矿体下边界，间距 15-20m）——S2
    for (const x of [X0 + 12, 0, X1 - 12]) {
      if (x < clip.x0 || x > clip.x1) continue;
      develop.add(shaft([x, yr + DRIFT / 2, Z0 - PARAMS.footwallOffset + 1], [x, toWorld([0, T * 0.4, Z0 + 2])[1], toWorld([0, 0, Z0 + 2])[2]], 3, 3, { name: `raise${Math.round(x)}` }));
    }
  }

  /* ── 出矿系统（S4 起）：电耙于运巷 + 矿流（工作面→溜井） ── */
  if (stage >= 4) {
    for (const x of [X0 + 12, 0]) {
      if (x < clip.x0 || x > clip.x1) continue;
      extract.add(machine("scraper", [x, yr - DRIFT / 2 + 0.15, Z0 - PARAMS.footwallOffset], 90));
    }
    extract.add(
      arrows(
        [
          [xf - 1, toWorld([0, T * 0.3, Z0 + 3])[1], toWorld([0, 0, Z0 + 3])[2]],
          [X0 + 12, yr + DRIFT / 2, Z0 - PARAMS.footwallOffset + 1],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 上山 → 工作面；污风经切割巷/回风巷 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, yr, Z0 - PARAMS.footwallOffset],
          [X1 - 6, yr, Z0 - PARAMS.footwallOffset + 1],
          [X1 - 6, yr + 3, Z0 - PARAMS.footwallOffset + 2],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [xf - 2, toWorld([0, T + 1.4, Z1 - 3])[1], Z1 - 3],
          [X1 - 8, toWorld([0, T + 2, Z1])[1], Z1],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 3 ? [{ label: "壁式工作面", p: toWorld([xf, T + 0.6, 0]) }] : []),
    ...(stage >= 3 ? [{ label: "充填体（接顶）", p: toWorld([(fillEnd + X0) / 2, T + 0.6, 0]) }] : []),
    ...(stage >= 3 ? [{ label: "砂门子", p: toWorld([fillEnd, T / 2 + 0.8, Z0 + 6]) }] : []),
    ...(stage >= 3 ? [{ label: "木棚支架", p: toWorld([(fillEnd + xf) / 2, T / 2 + 0.8, 0]) }] : []),
    ...(stage >= 3 ? [{ label: "充填管", p: toWorld([(fillEnd + xf) / 2, T + 0.9, Z1 - 4]) }] : []),
    { label: "底板运输巷道", p: [0, yr + DRIFT / 2 + 0.5, Z0 - PARAMS.footwallOffset] },
    { label: "切割上山", p: toWorld([X1 - 6, T + 0.7, Z0 + 2]) },
    ...(stage >= 2 ? [{ label: "矿石溜井", p: [0, yr + DRIFT / 2 + 0.8, Z0 - PARAMS.footwallOffset + 1] }] : []),
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, develop, fill, support, extract, air]);
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
  if (PARAMS.trueThickness > 2) problems.push(`单层充填用于薄矿体（<2m），真厚 ${PARAMS.trueThickness}`);
  return problems;
}
