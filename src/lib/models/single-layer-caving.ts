/**
 * 单层崩落采矿法 builder（single-layer-caving，长壁式 10.2.1）
 * 教材依据：《采矿学》（第 2 版）10.2.1，书 p234-242，图 10-17。
 * 辨识特征：**三段式沿走向排列——崩落区（碎岩充满采空）—悬顶区（支架+空顶）—
 *   工作面（敞空）**；悬顶距 1.2~1.6m、控顶距 2~3 排支柱（p237，教材核对 C3 修正）；
 *   阶段沿脉运巷（底板岩）+沿脉装车巷+切割巷+切割上山+溜井 5-6m@1.5×1.5+
 *   安全道 10m@1.5×1.8 通上阶段。
 * 坐标：X 走向（工作面推进方向）、Z 指向下盘（矿体向 −Z 倾伏 28°）、Y 向上。
 * 工艺阶段（崩落模板）：采准→切割→正常推进（三段式）→放顶→二次来压管理。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 28, // src: 书 p234（缓倾斜薄层）
  thickness: 2.5, // src: 书 p234（薄层 t=2.5m）
  stageLength: 55, // 阶段斜长（书 p234 阶段斜长 40-60 取 55）
  blockLength: 65, // src: 书 p234（走向矿块 50-100 取 65）
  faceLen: 50, // src: 书 p234（工作面长 40-60）
  overhang: 1.4, // src: 书 p237（悬顶距 1.2~1.6m——C3 修正）
  propRows: 3, // src: 书 p237（控顶距 2~3 排支柱）
  raiseSpan: 5.5, // 溜井间距 5-6m（书 p234）
  safetySpan: 10, // 安全道间距 10m（书 p234）
  displayNote: "矿体真厚 ×1；安全道/溜井 ×1.5 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "崩落岩", "采准巷道", "支护", "出矿系统", "通风", "围岩"];

/** 工艺阶段（崩落模板；三段式推进为本法签名） */
export const STAGES = ["采准工程", "切割工程", "正常推进（三段式）", "放顶", "二次来压管理"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.blockLength / 2;
const X1 = PARAMS.blockLength / 2;
const Z0 = -PARAMS.stageLength / 2;
const Z1 = PARAMS.stageLength / 2;
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
  const support = layerGroup("支护");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const caveAsm = new THREE.Group();
  const supportAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  cave.add(caveAsm);
  support.add(supportAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, cave, develop, support, extract, air);

  /* 三段式沿走向 X（S3 起）：工作面 xFace → 控顶区（propRows×1.2m）→ 悬顶区
     （overhang）→ 放顶线 → 崩落区（碎岩充满采空至顶板）。
     S3 推进 1/3；S4 放顶（崩落区扩 1/2）；S5 二次来压（=现状态 2/3）。 */
  const xFace = stage >= 5 ? X0 + PARAMS.blockLength * 0.66 : stage >= 4 ? X0 + PARAMS.blockLength * 0.5 : X0 + PARAMS.blockLength * 0.33;
  const xCave = stage >= 5 ? xFace - PARAMS.overhang - 3 * 1.2 : xFace - PARAMS.overhang - 3 * 1.2;
  const xProp0 = xFace - PARAMS.propRows * 1.2;

  /* 矿体实体：工作面之前（x > xFace）未采；工作面至放顶线 = 空顶（矿体消失）；
     放顶线之前 = 崩落区（矿体消失、碎岩充满）。 */
  if (xFace < X1) {
    oreAsm.add(
      slab(X1 - xFace, T, Z1 - Z0, { pos: [(xFace + X1) / 2, T / 2, (Z0 + Z1) / 2], material: mat.ore() }),
    );
  }
  // 底柱带（下端 z 侧全期保留）
  // 崩落岩（S3 起，放顶线之前充满采空至顶板——签名：充满而非悬浮）
  if (stage >= 3) {
    const caveLen = Math.max(xCave - X0, 0.5);
    caveAsm.add(
      rubble(
        { x: (X0 + xCave) / 2, y: 0, z: (Z0 + Z1) / 2, w: caveLen, h: T * 0.95, d: Z1 - Z0 - 2 },
        Math.round(caveLen * 3),
        1717,
        { size: [0.8, 1.6], oreMixRatio: 0.4, material: mat.rubble(false) },
      ),
    );
  }
  // 支柱排架（控顶区，S3 起）：每排 4 根，排距 1.2m
  if (stage >= 3) {
    for (let x = xFace - 1.2; x > xProp0; x -= 1.2) {
      for (const z of [Z0 + 4, Z0 + 18, 0, Z1 - 18, Z1 - 4]) {
        const p = toWorld([x, 0, z]);
        const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, T, 8), mat.machine());
        prop.position.set(p[0], p[1], p[2]);
        supportAsm.add(prop);
      }
    }
  }
  wallAsm.add(slab((X1 - X0) * 1.04, 5, (Z1 - Z0) * 1.06 + 4, { pos: [(X0 + X1) / 2, -2.5, (Z0 + Z1) / 2], material: mat.wall() }));
  wallAsm.add(slab((X1 - X0) * 1.04, 5, (Z1 - Z0) * 1.06 + 4, { pos: [(X0 + X1) / 2, T + 2.5, (Z0 + Z1) / 2], material: mat.wall() }));
  ore.add(oreAsm);
  cave.add(caveAsm);
  support.add(supportAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(cave, PARAMS.dip);
  tilt(support, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 采准巷道（世界坐标）：阶段沿脉运巷（底板岩，S1）+ 沿脉装车巷（S1）+
     切割巷（下边界，S2）+ 切割上山（S2）+ 矿石溜井 5-6m@（S2）+ 安全道 10m@（S2 通上阶段） ── */
  const yr = TUNNEL_T + 1;
  if (stage >= 1) {
    const xA = Math.max(X0, clip.x0), xB = Math.min(X1, clip.x1);
    if (xB > xA) {
      develop.add(
        tunnel(
          [
            [xA, yr, Z0 - 5],
            [xB, yr, Z0 - 5],
          ],
          DRIFT,
          DRIFT,
          {
            name: "stageHaul",
            openings: [-24, -18, -12, -6, 0, 6, 12, 18, 24]
              .filter((x) => x > xA && x < xB)
              .map((x) => ({ s: x - xA, w: 2.5, part: "roof" }) as TunnelOpening),
          },
        ),
      );
      // 沿脉装车巷（矿体内，运巷上方）
      develop.add(
        tunnel(
          [
            [xA, yr + 4.5, Z0 - 3],
            [xB, yr + 4.5, Z0 - 3],
          ],
          DRIFT * 0.8,
          DRIFT * 0.8,
          { name: "loadingDrift" },
        ),
      );
    }
  }
  if (stage >= 2) {
    // 矿石溜井 ×9（装车巷上，5-6m 间距，1.5×1.5 ×1.5 显示）
    for (let x = X0 + 4; x <= X1 - 4; x += PARAMS.raiseSpan) {
      if (x < clip.x0 || x > clip.x1) continue;
      develop.add(shaft([x, yr, Z0 - 5], [x, yr + 4.5, Z0 - 3], 2.2, 2.2, { name: `raise${Math.round(x)}` }));
    }
    // 安全道 ×6（10m 间距，1.5×1.8，通上阶段——自装车巷向上方矿体）
    for (let x = X0 + 6; x <= X1 - 6; x += PARAMS.safetySpan) {
      if (x < clip.x0 || x > clip.x1) continue;
      develop.add(
        shaft([x, yr + 5.5, Z0 - 3], [x, toWorld([0, T * 0.6, Z0 + 4])[1], toWorld([0, 0, Z0 + 4])[2]], 2.2, 2.6, {
          name: `safety${Math.round(x)}`,
        }),
      );
    }
    // 切割巷（下边界，宽 2m 高=层厚）+ 切割上山（一侧 2-2.4m）
    const pCut = toWorld([0, T / 2, Z0 + 2]);
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), pCut[1], pCut[2]],
          [Math.min(X1, clip.x1), pCut[1], pCut[2]],
        ],
        2.8,
        T,
        { name: "cutDrift" },
      ),
    );
    const pUp = toWorld([xFace, T / 2, Z0 + 2]);
    develop.add(
      shaft([xFace, pUp[1], pUp[2]], [xFace, toWorld([0, T / 2, Z1 - 2])[1], toWorld([0, 0, Z1 - 2])[2]], 2.6, T, {
        name: "cutRaise",
      }),
    );
  }

  /* ── 出矿系统（S4 起）：电耙于装车巷 + 矿流（工作面→溜井） ── */
  if (stage >= 4) {
    for (const x of [-18, 0, 18]) {
      if (x < clip.x0 || x > clip.x1) continue;
      extract.add(machine("scraper", [x, yr + 3.8, Z0 - 3], 0));
    }
    extract.add(
      arrows(
        [
          [xFace - 2, toWorld([0, T * 0.3, Z0 + 5])[1], toWorld([0, 0, Z0 + 5])[2]],
          [0, yr + 5, Z0 - 3],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 上山 → 工作面；污风经安全道至上阶段 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, yr, Z0 - 5],
          [X0 + 2, yr + 5, Z0 - 3],
          [X0 + 2, yr + 7, Z0 - 2],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [X1 - 6, toWorld([0, T + 1.4, Z0 + 6])[1], Z0 + 6],
          [X1 - 6, toWorld([0, T + 2.6, Z0 + 8])[1], Z0 + 8],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 3 ? [{ label: "长壁工作面", p: toWorld([xFace, T + 0.6, 0]) }] : []),
    ...(stage >= 3 ? [{ label: "崩落区（碎岩充满）", p: toWorld([(X0 + xCave) / 2, T + 0.6, 0]) }] : []),
    ...(stage >= 3 ? [{ label: "悬顶区（支架）", p: toWorld([(xProp0 + xFace) / 2, T + 0.6, 0]) }] : []),
    { label: "阶段沿脉运巷", p: [0, yr + DRIFT / 2 + 0.5, Z0 - 5] },
    ...(stage >= 2 ? [{ label: "矿石溜井", p: [0, yr + 1.2, Z0 - 4] }] : []),
    ...(stage >= 2 ? [{ label: "安全道（通上阶段）", p: toWorld([X0 + 6, T * 0.6 + 0.6, Z0 + 4]) }] : []),
    ...(stage >= 2 ? [{ label: "切割上山", p: toWorld([xFace, T + 0.7, Z0 + 3]) }] : []),
    ...(stage >= 4 ? [{ label: "放顶线", p: toWorld([xCave, T + 0.7, 0]) }] : []),
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, cave, develop, support, extract, air]);
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
  if (PARAMS.overhang < 1.2 || PARAMS.overhang > 1.6) problems.push(`悬顶距应 1.2~1.6m（p237），实测 ${PARAMS.overhang}`);
  return problems;
}
