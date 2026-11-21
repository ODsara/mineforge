/**
 * 阶段自然崩落法 builder（stage-natural-caving，10.4.4）
 * 教材依据：《采矿学》（第 2 版）10.4.4，书 p266-270，图 10-56 结构/10-57 崩落进程/
 *   10-59 拉底 10m/10-60 漏斗 11×11 放矿口 3×3。
 * 辨识特征：**平衡拱曲面**（矿体上部完整—拱面（虚线/半透明壳）—拱下崩落矿石堆—
 *   底部出矿巷网）；拉底层高 10m（图 10-59）；下盘出矿巷网（漏斗负担 11m×11m、
 *   放矿口 3m×3m）；切帮巷道控制崩落边界；放矿维持自由空间高度 ≤5m、放出约 1/3 碎胀。
 * 坐标：X 走向（矿块 40m）、Z 指向下盘（矿体向 −Z 倾伏 45°）、Y 向上。
 * 工艺阶段（崩落模板）：采准→切割拉底→自然崩落（拱形成）→放矿（拱上移）→覆盖岩。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, tilt, tiltMatrix, unionBBox, TUNNEL_T } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 45, // src: 书 p266（缓倾 45°，埋深大）
  thickness: 50, // src: 书 p266（大厚度 t=50m）
  stageH: 60, // src: 书 p266（阶段 60m）
  undercutH: 10, // src: 书 p268 图 10-59（拉底层高 10m）
  drawPointSpan: 11, // src: 书 p268 图 10-60（漏斗负担面积 11m×11m）
  drawPointSize: 3, // src: 书 p268 图 10-60（放矿口 3m×3m）
  freeSpaceMax: 5, // src: 书 p266（自由空间高度 ≤5m）
  blockLength: 40, // 矿块走向（示意）
  displayNote: "矿体内巷道 ×1.4、放矿口 3×3（真实尺寸 ×1）（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "崩落岩", "平衡拱面", "采准巷道", "出矿系统", "通风", "围岩"];

/** 工艺阶段（崩落模板；平衡拱为本法签名） */
export const STAGES = ["采准工程", "切割拉底", "自然崩落（拱形成）", "放矿（拱上移）", "覆盖岩下持续崩落"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.blockLength / 2;
const X1 = PARAMS.blockLength / 2;
const H = PARAMS.stageH;
const DIP_LEN = H / Math.sin((PARAMS.dip * Math.PI) / 180);
const Z_FOOT = 8; // 下盘出矿巷网（世界 z）
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
  const arch = layerGroup("平衡拱面");
  const develop = layerGroup("采准巷道");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const caveAsm = new THREE.Group();
  const archAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  cave.add(caveAsm);
  arch.add(archAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, cave, arch, develop, extract, air);

  /* 矿体与状态（拉底+拱进程）：
     S1 采准：矿体完整 + 出矿巷网
     S2 切割拉底：拉底空间 10m 高（矿体下部掏空）
     S3 拱形成：拉底上方矿体开始自然崩落（平衡拱壳+拱下碎矿）
     S4 放矿：拱上移（拱下碎矿堆扩大，放出 1/3 碎胀）
     S5 覆盖岩：拱持续上移至覆盖岩 */
  const sillLen = PARAMS.undercutH / Math.sin((PARAMS.dip * Math.PI) / 180);
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  // 拉底空间（S2 起，矿体下部掏空 10m）
  if (stage >= 2) {
    oreAsm.add(
      slab(wallW - 2, T * 0.9, sillLen, {
        pos: [wallCx, T / 2, sillLen * 0.45],
        material: mat.voidShell(), // 拉底空腔（掏空示意）
      }),
    );
  }
  // 矿体完整部分：拉底以上（拱外仍为完整矿体——签名：崩落岩不充满到顶）
  const archRise = stage >= 5 ? H * 0.62 : stage >= 4 ? H * 0.5 : stage >= 3 ? H * 0.36 : 0;
  const oreTopZ = DIP_LEN - (archRise / Math.sin((PARAMS.dip * Math.PI) / 180));
  if (stage >= 3) {
    // 拱上方完整矿体（楔形余量示意——用薄板示意矿体顶界完整带）
    oreAsm.add(
      slab(wallW, T, Math.max(oreTopZ - 0, 2), {
        pos: [wallCx, T / 2, oreTopZ / 2],
        material: mat.ore(),
      }),
    );
  } else {
    oreAsm.add(slab(wallW, T, DIP_LEN, { pos: [wallCx, T / 2, DIP_LEN / 2], material: mat.ore() }));
  }
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, -2.5, DIP_LEN / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, T + 2.5, DIP_LEN / 2], material: mat.wall() }));
  ore.add(oreAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 平衡拱面（签名）：拉底空间上方的拱形半透明壳——LatheGeometry 拱
     S3 拱形成（矮拱）、S4 拱上移、S5 拱更高 ── */
  if (stage >= 3) {
    const archH = stage >= 5 ? H * 0.34 : stage >= 4 ? H * 0.26 : H * 0.18;
    // 拱：半椭球壳（内壁朝下——崩落面），中心在拉底上方
    const profile: THREE.Vector2[] = [];
    const R = (wallW / 2) * 0.72;
    const zSpan = Math.min(DIP_LEN * 0.6, 26); // 拱纵深（不上挽 clip——clipOf 只含 x）
    for (let i = 0; i <= 10; i++) {
      const a = (Math.PI / 2) * (i / 10); // 0→90°
      profile.push(new THREE.Vector2(R * Math.cos(a) * (zSpan / (wallW * 0.6)), archH * Math.sin(a)));
    }
    const archGeo = new THREE.LatheGeometry(profile, 18);
    const archMesh = new THREE.Mesh(archGeo, mat.voidShell());
    const pBase = toWorld([0, T / 2, sillLen * 0.8]);
    archMesh.position.set(pBase[0], pBase[1] + T / 2, pBase[2]);
    archMesh.rotation.x = -Math.PI / 2; // 拱面朝下（崩落面）
    archAsm.add(archMesh);
    // 拱下崩落矿石堆（碎矿，放出 1/3 碎胀——拱下空间保留）
    const heapH = stage >= 5 ? sillLen * 0.55 : sillLen * 0.4;
    caveAsm.add(
      rubble(
        { x: wallCx, y: -heapH * 0.1, z: sillLen * 0.4, w: wallW - 4, h: heapH, d: sillLen * 0.7 },
        Math.round(sillLen * 1.8),
        909,
        { size: [1.4, 3], oreMixRatio: 0.8, material: mat.rubble(true) },
      ),
    );
    cave.add(caveAsm);
    // 拱上覆盖岩（S5 覆盖岩下持续崩落——顶部碎岩）
    if (stage >= 5) {
      caveAsm.add(
        rubble(
          { x: wallCx, y: T * 0.2, z: oreTopZ - 4, w: wallW - 4, h: 8, d: 10 },
          30,
          5150,
          { size: [1.6, 3.4], oreMixRatio: 0.25, material: mat.rubble(false) },
        ),
      );
    }
    arch.add(archAsm);
    tilt(arch, PARAMS.dip);
    tilt(cave, PARAMS.dip);
  }

  /* ── 出矿巷网（下盘密集出矿平巷——签名，S1 采准）：
     漏斗负担 11×11 → 出矿巷沿走向间隔 11m，放矿口 3×3 于巷顶 ── */
  const yr = Y_HAUL + DRIFT / 2;
  if (stage >= 1) {
    const xA = Math.max(X0, clip.x0), xB = Math.min(X1, clip.x1);
    // 出矿平巷 ×4（沿走向 11m 间隔）
    for (const cx of [-16.5, -5.5, 5.5, 16.5]) {
      if (cx < xA - 2 || cx > xB + 2) continue;
      develop.add(
        tunnel(
          [
            [cx, Y_HAUL, Z_FOOT],
            [cx, Y_HAUL, Z_FOOT + 9],
          ],
          DRIFT,
          DRIFT,
          { name: `draw${Math.round(cx)}`, openEnds: true },
        ),
      );
      // 放矿口 3×3（巷顶向矿体方向——漏斗 burden 11m 中心）
      develop.add(
        shaft([cx, Y_HAUL + DRIFT / 2 + 0.2, Z_FOOT + 4.5], [cx, Y_HAUL + DRIFT / 2 + 4.5, Z_FOOT + 4.5], PARAMS.drawPointSize, PARAMS.drawPointSize, {
          name: `drawpoint${Math.round(cx)}`,
          openEnds: true,
        }),
      );
    }
    // 阶段运输巷（底部联络）
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), TUNNEL_T, Z_FOOT + 12],
          [Math.min(X1, clip.x1), TUNNEL_T, Z_FOOT + 12],
        ],
        DRIFT,
        DRIFT,
        { name: "transport" },
      ),
    );
    // 切帮巷道 ×2（控制崩落边界——矿块两侧，S2 起）
    if (stage >= 2) {
      for (const x of [X0 + 1, X1 - 1]) {
        if (x < clip.x0 - 2 || x > clip.x1 + 2) continue;
        const p = toWorld([0, T / 2, sillLen * 0.5]);
        develop.add(
          shaft([x, p[1] - 2, p[2]], [x, toWorld([0, T / 2, sillLen + 14])[1], toWorld([0, 0, sillLen + 14])[2]], 3, 3, {
            name: `wallCut${x > 0 ? "E" : "W"}`,
          }),
        );
      }
    }
  }

  /* ── 出矿系统（S4 放矿起）：LHD 于出矿巷 + 矿流（放矿口→巷→运输巷） ── */
  if (stage >= 4) {
    for (const cx of [-5.5, 5.5]) {
      if (cx < clip.x0 || cx > clip.x1) continue;
      extract.add(machine("lhd", [cx, Y_HAUL - DRIFT / 2 + 0.15, Z_FOOT + 3], 90));
    }
    extract.add(
      arrows(
        [
          [0, Y_HAUL + DRIFT + 2, Z_FOOT + 4.5],
          [0, Y_HAUL, Z_FOOT + 4.5],
          [0, TUNNEL_T + 1, Z_FOOT + 12],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 出矿巷；污风经回风 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, TUNNEL_T, Z_FOOT + 12],
          [-16.5, TUNNEL_T, Z_FOOT + 11],
          [-16.5, Y_HAUL + 2, Z_FOOT + 8],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [16.5, Y_HAUL + 4, Z_FOOT + 6],
          [16.5, Y_HAUL + 6, Z_FOOT + 8],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 2 ? [{ label: "拉底空间（10m）", p: toWorld([0, T / 2 + 0.7, sillLen * 0.45]) }] : []),
    ...(stage >= 3 ? [{ label: "平衡拱（崩落面）", p: toWorld([0, T / 2 + Math.min(H * 0.15, 9), sillLen * 0.8]) }] : []),
    ...(stage >= 3 ? [{ label: "拱下崩落矿石", p: toWorld([0, T * 0.85, sillLen * 0.4]) }] : []),
    ...(stage >= 3 ? [{ label: "拱上完整矿体", p: toWorld([0, T + 0.7, oreTopZ - 2]) }] : []),
    { label: "出矿平巷（11×11 负担）", p: [-5.5, Y_HAUL + DRIFT / 2 + 0.6, Z_FOOT] },
    { label: "放矿口 3×3", p: [-5.5, Y_HAUL + DRIFT / 2 + 3.5, Z_FOOT + 4.5] },
    ...(stage >= 2 ? [{ label: "切帮巷道", p: toWorld([X0 + 1, T / 2 + 0.7, sillLen + 7]) }] : []),
    ...(stage >= 4 ? [{ label: "LHD 出矿", p: [-5.5, Y_HAUL + 0.6, Z_FOOT + 3] }] : []),
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, cave, arch, develop, extract, air]);
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
  if (PARAMS.undercutH !== 10) problems.push(`拉底高应 10m（图 10-59），实测 ${PARAMS.undercutH}`);
  if (PARAMS.drawPointSpan !== 11) problems.push(`漏斗负担应 11×11m（图 10-60），实测 ${PARAMS.drawPointSpan}`);
  return problems;
}
