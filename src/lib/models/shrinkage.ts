/**
 * 留矿采矿法 builder（shrinkage）
 * 教材依据：《采矿学》（第 2 版）11.4，书 p282-290，图 11-9/11-16/11-21。
 * 辨识特征：急倾薄脉、崩落矿石暂留矿房作工作台（台面平整——p288），
 *   回采期矿堆随落矿逐层上升、大量放矿期矿堆下降；间柱内天井每 4-5m 联络道；
 *   电耙道在阶段运输巷道之上 3~4m（p286）；底柱漏斗 5-7m。
 * 坐标：X 走向（矿房长 50m）、Z 指向下盘（矿体向 −Z 倾伏 75°）、Y 向上。
 * 工艺阶段（空场模板）：采准→切割（拉底）→回采落矿（矿堆上升）→放矿（矿堆下降）→清底与空区。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 75, // src: 书 p283（急倾斜薄脉）
  thickness: 5, // 真厚 2.5m ×2 显示（薄脉显示放大，PARAMS 诚实标注）
  trueThickness: 2.5, // src: 书 p283（薄脉 1-4m 取 2.5）
  strikeLength: 50, // src: 书 p283（矿房长 40-60）
  stageH: 40, // src: 书 p283（阶段 30-50）
  ribPillarW: 3, // 间柱 2-6m 取 3（薄脉）
  crownPillar: 3, // 顶柱 2-3m
  sillPillar: 4, // 底柱 4-6m 取 4
  raiseCC: 4.5, // 联络道垂直间距 4-5m（p283）
  funnelSpan: 6, // 漏斗间距 5-7m
  scraperLift: 3.5, // 电耙道位于运巷之上 3~4m（p286——教材核对 A1 修正项）
  pileMax: 0.78, // 回采期矿堆充满度（工作台以下满堆的示意比例）
  displayNote: "矿脉真厚 2.5m ×2 显示；矿体内巷道 ×1.5、漏斗 ×1.5 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "暂留矿", "采准巷道", "出矿系统", "通风", "围岩"];

/** 工艺阶段（空场模板；矿堆升降为本法签名） */
export const STAGES = ["采准工程", "切割与拉底", "回采落矿（堆升）", "大量放矿（堆降）", "清底与空区"] as const;

const T = PARAMS.thickness; // 显示厚
const X0 = -PARAMS.strikeLength / 2;
const X1 = PARAMS.strikeLength / 2;
const H = PARAMS.stageH; // 阶段高（矿体斜长≈H/sin75°≈41.4）
const Y0 = 0; // 矿体底
const Z_TRANSPORT = 6; // 运巷轴（下盘侧，世界坐标 z=+6）
const Y_TRANSPORT = -8; // 运巷中心（底板岩中，低于矿体底缘）
const DRIFT_ROCK = 7.2;
const DRIFT_ORE = 3.5;
const RAISE_D = 3;

function clipOf(variant: string): { x0: number; x1: number } {
  if (variant === "long") return { x0: X0 - 1, x1: 0 }; // 纵剖过矿房中心
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
  const pile = layerGroup("暂留矿");
  const develop = layerGroup("采准巷道");
  const extract = layerGroup("出矿系统");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const root = new THREE.Group();
  root.add(ore, pile, develop, extract, air, wall);

  /* 倾斜几何量（build 顶层——多阶段块共用） */
  const dipLen = H / Math.sin((PARAMS.dip * Math.PI) / 180);
  const sillLen = PARAMS.sillPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
  const minedTop = stage >= 4 ? H - PARAMS.crownPillar : stage >= 3 ? H * 0.55 : 0;
  const minedLen = Math.min(minedTop / Math.sin((PARAMS.dip * Math.PI) / 180), dipLen - crownLen / Math.sin((PARAMS.dip * Math.PI) / 180));

  /* 矿体：急倾薄板（局部框架水平生成后 tilt −δ）。
     矿房段（x∈矿房）随回采阶段自下而上消失（拉底→逐层落矿→放矿清底）；
     顶柱/底柱/间柱全期保留。 */
  const oreAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  wall.add(wallAsm);
  // 矿房采空高度（Y 自下而上）：S1-2 无回采；S3 采至 0.55H；S4 放矿后矿体全采空至顶柱；S5 同
  // 沿倾向的斜长 = minedTop/sin75°（倾斜板局部 z 长）
  // 局部框架：z 自 0（下端=底柱）向 dipLen（上端）
  oreAsm.add(slab(X1 - X0, T, dipLen, { pos: [(X0 + X1) / 2, T / 2, dipLen / 2], material: mat.ore() }));
  // 未采矿段移除（矿房区间）：用负片构造——拆成上下两段实板
  if (stage >= 3) {
    oreAsm.clear();
    const stopedLen = Math.min(minedLen, dipLen - PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180));
    // 下段：底柱（z 0..底柱斜长）
    // 顶柱（上端）
    const crownLen = PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
    // 间柱（两端）+ 矿房空腔：矿体条带拆为 [0, sillLen] 底柱 + [sillLen, sillLen+stopedLen] 间柱带侧留 + 上部
    // 简化：全高条带保留两端间柱带（宽 ribPillarW），矿房段只保留已采高度以上
    for (const seg of [
      { z0: 0, z1: sillLen }, // 底柱段（全厚）
      { z0: sillLen + stopedLen, z1: dipLen - crownLen + 0.6 }, // 已采高度以上的未采矿体（S3）或空（S4+）
      { z0: dipLen - crownLen, z1: dipLen }, // 顶柱段（全厚）
    ]) {
      if (seg.z1 - seg.z0 < 0.3) continue;
      oreAsm.add(slab(X1 - X0, T, seg.z1 - seg.z0, { pos: [(X0 + X1) / 2, T / 2, (seg.z0 + seg.z1) / 2], material: mat.ore() }));
    }
    // 间柱（两端条带全厚，矿房段侧）
    for (const side of [X0, X1]) {
      const x0 = side === X0 ? X0 : X1 - PARAMS.ribPillarW;
      oreAsm.add(
        slab(PARAMS.ribPillarW, T, Math.max(dipLen - crownLen - sillLen, 0.4), {
          pos: [x0 + PARAMS.ribPillarW / 2, T / 2, sillLen + (dipLen - crownLen - sillLen) / 2],
          material: mat.ore(),
        }),
      );
    }
  }
  wallAsm.add(slab((X1 - X0) * 1.04, 5, dipLen * 1.06 + 4, { pos: [(X0 + X1) / 2, -2.5, dipLen / 2], material: mat.wall() }));
  wallAsm.add(slab((X1 - X0) * 1.04, 5, dipLen * 1.06 + 4, { pos: [(X0 + X1) / 2, T + 2.5, dipLen / 2], material: mat.wall() }));
  tilt(ore, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* 暂留矿堆（签名）：回采期台面随落矿上升（S3 半满→S4 放矿下降→S5 清空）。台面平整=盒状堆 */
  if (stage === 3 || stage === 4) {
    const fill = stage === 3 ? PARAMS.pileMax : 0.3; // S4 大量放矿：矿堆下降
    const stopedLen = Math.min(minedLen, dipLen - PARAMS.crownPillar / Math.sin((PARAMS.dip * Math.PI) / 180));
    const sillLen = PARAMS.sillPillar / Math.sin((PARAMS.dip * Math.PI) / 180);
    const pileLen = Math.max(stopedLen * fill, 1.2);
    const pileAsm = new THREE.Group();
    pileAsm.add(
      slab(X1 - X0 - 2 * PARAMS.ribPillarW, T * 0.62, pileLen, {
        pos: [(X0 + X1) / 2, (T * 0.62) / 2 + 0.15, sillLen + pileLen / 2],
        material: mat.rubble(true),
      }),
    );
    pile.add(pileAsm);
    tilt(pile, PARAMS.dip);
  }

  /* ── 采准巷道（世界坐标）：阶段运巷（底板岩）+ 电耙道（运巷上 3~4m，p286）+ 间柱天井 + 联络道 ── */
  const yr = Y_TRANSPORT + DRIFT_ROCK / 2;
  // 电耙道：沿走向，位于运巷上方 3~4m 的矿体内（世界坐标近似水平）
  const scraperY = Y_TRANSPORT + DRIFT_ROCK + PARAMS.scraperLift;
  if (stage >= 1) {
    const xA = Math.max(X0, clip.x0), xB = Math.min(X1, clip.x1);
    if (xB > xA) {
      develop.add(
        tunnel(
          [
            [xA, yr, Z_TRANSPORT],
            [xB, yr, Z_TRANSPORT],
          ],
          DRIFT_ROCK,
          DRIFT_ROCK,
          {
            name: "transport",
            // 岔口：漏斗颈（顶拱）@漏斗间距 + 电耙道联络（右帮）
            openings: [-24, -18, -12, -6, 0, 6, 12, 18]
              .filter((x) => x > xA && x < xB)
              .flatMap((x) => [{ s: x - xA, w: 2.4, part: "roof" } as TunnelOpening])
              .concat([{ s: 25 - xA, w: 3, part: "wallR" } as TunnelOpening]),
          },
        ),
      );
      // 电耙道（矿体内，世界坐标水平，高于运巷）——S1 采准掘进
      develop.add(
        tunnel(
          [
            [xA, scraperY, Z_TRANSPORT + 1],
            [xB, scraperY, Z_TRANSPORT + 1],
          ],
          DRIFT_ORE,
          DRIFT_ORE,
          { name: "scraperDrift" },
        ),
      );
    }
  }
  // 间柱天井 ×2（两端）+ 联络道每 4.5m —— S1
  for (const side of [X0 + PARAMS.ribPillarW / 2, X1 - PARAMS.ribPillarW / 2]) {
    if (side < clip.x0 - 2 || side > clip.x1 + 2) continue;
    develop.add(
      shaft(
        [side, Y_TRANSPORT + DRIFT_ROCK, Z_TRANSPORT - 1],
        [side, toWorld([0, T - 0.5, dipLen - 2])[1], toWorld([0, 0, dipLen - 2])[2]],
        RAISE_D,
        RAISE_D,
        { name: `raise${side > 0 ? "E" : "W"}` },
      ),
    );
    // 联络道：从天井向矿房，垂直每 4.5m
    for (let y = 4; y < minedTop + 2; y += PARAMS.raiseCC) {
      const p = toWorld([0, y, dipLen * 0.55]);
      develop.add(
        tunnel(
          [
            [side, p[1], p[2]],
            [side + (side > 0 ? -2.2 : 2.2), p[1], p[2]],
          ],
          DRIFT_ORE * 0.85,
          DRIFT_ORE * 0.85,
          { name: `cc${side > 0 ? "E" : "W"}${Math.round(y)}`, openEnds: true },
        ),
      );
    }
  }
  /* ── 底柱漏斗群（S1 采准；漏斗颈接电耙道） ── */
  for (let x = X0 + 3; x <= X1 - 3; x += PARAMS.funnelSpan) {
    if (x < clip.x0 || x > clip.x1) continue;
    const p0 = toWorld([0, 0.2, sillLen * 0.75]);
    develop.add(
      shaft([x, scraperY - DRIFT_ORE / 2 - 0.4, Z_TRANSPORT + 1], [x, p0[1] + 1, p0[2]], 2, 2.2, {
        name: `funnel${Math.round(x)}`,
        openEnds: true,
      }),
    );
  }

  /* ── 出矿系统（S4 起）：电耙 + 矿流（漏斗→电耙道→运巷溜井口） ── */
  if (stage >= 4) {
    for (const wx of [-18, 0, 18]) {
      if (wx < clip.x0 || wx > clip.x1) continue;
      extract.add(machine("scraper", [wx, scraperY - DRIFT_ORE / 2 + 0.1, Z_TRANSPORT + 1], 90));
    }
    if (0 >= clip.x0 && 0 <= clip.x1) {
      extract.add(
        arrows(
          [
            [0, scraperY, Z_TRANSPORT + 1],
            [0, scraperY - 2, Z_TRANSPORT + 1],
            [0, yr, Z_TRANSPORT],
          ],
          "flow",
          3,
          1.9,
        ),
      );
    }
  }

  /* ── 通风（S2 起）：运巷进风 → 天井 → 联络道 → 工作面；污风经天井上行 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, yr, Z_TRANSPORT],
          [X0 + PARAMS.ribPillarW / 2, yr, Z_TRANSPORT - 1],
          [X0 + PARAMS.ribPillarW / 2, yr + 4, Z_TRANSPORT - 1],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [X1 - PARAMS.ribPillarW / 2, toWorld([0, T - 1, dipLen - 4])[1], toWorld([0, 0, dipLen - 4])[2]],
          [X1 - PARAMS.ribPillarW / 2, toWorld([0, T + 1.5, dipLen - 4])[1], toWorld([0, 0, dipLen - 4])[2]],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    ...(stage >= 3 && stage <= 4 ? [{ label: "暂留矿堆（台面平整）", p: toWorld([0, T * 0.62 + 0.6, sillLen + 8]) }] : []),
    ...(stage >= 3 ? [{ label: "回采工作面", p: toWorld([0, T + 0.5, sillLen + minedLen - 1]) }] : []),
    { label: "间柱天井", p: [X1 - PARAMS.ribPillarW / 2, toWorld([0, T * 0.5, dipLen * 0.5])[1] + 2, toWorld([0, 0, dipLen * 0.5])[2]] },
    { label: "联络道", p: toWorld([0, 8, dipLen * 0.55]) },
    { label: "电耙道（运巷上 3~4m）", p: [0, scraperY + DRIFT_ORE / 2 + 0.6, Z_TRANSPORT + 1] },
    { label: "放矿漏斗", p: toWorld([6, 1.5, sillLen * 0.75]) },
    { label: "间柱", p: toWorld([X1 - PARAMS.ribPillarW / 2, T + 0.6, dipLen * 0.4]) },
    { label: "顶柱", p: toWorld([0, T + 0.7, dipLen - 1.5]) },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, pile, wall, develop, extract, air]);
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
  if (PARAMS.scraperLift < 3 || PARAMS.scraperLift > 4) problems.push(`电耙道应在运巷上 3~4m（p286），实测 ${PARAMS.scraperLift}`);
  return problems;
}


