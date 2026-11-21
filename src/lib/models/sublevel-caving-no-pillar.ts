/**
 * 无底柱分段崩落法 builder（sublevel-caving-no-pillar）
 * 教材依据：《采矿学》（第 2 版）10.5.2，书 p249-263，图 10-33（典型方案四投影）。
 * 特征（与有底柱法的判别界线）：取消底柱——无漏斗/电耙道，回采进路即出矿道；
 *   进路平行阵+上下分段交错；上向扇形深孔端部挤压爆破；铲运机进路内直接出矿；
 *   崩落岩石自上部垮落补充空间。
 * 坐标：X 走向（矿块 80m），Z 指向下盘、矿体向 −Z 倾伏 65°，Y 向上；原点 = 阶段底。
 * 矿体构造：真实厚 36.3m（= 水平厚 40·sin65°，换算见 PARAMS）板在水平局部框架生成
 *   后 tilt(−δ)；下盘接触线世界公式 z_fw(h) = cotδ·h（cotδ=0.466 见 PARAMS）。
 * 显示比例：分段巷道/进路真实 3.5×3.5 ×1.4 = 5（进路间距 10m 约束，×3 不可行）；
 *   阶段运巷 ×2；井筒 Φ3。诚实标注。
 * 矿体显示：本工法巷道阵在矿体内部，矿体用 0.5 半透明（oreGhost）使 iso 可读——
 *   对 §3.6 不透明矿体的记录在案偏差。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, orePile, fanHoles, tilt, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 65, // src: 书 p249-253（急倾斜）
  horizontalThickness: 40, // src: 书 p249-253（厚 40m，矿块垂直走向）
  trueThickness: 36.3, // = 40×sin65°（换算，示意取位）
  strikeLength: 80, // 矿块走向长（小型铲运机沿走向 80~100m，书 p250）
  stageH: 80, // src: 书 p249-253（阶段 60~120，取 80 示意）
  sublevelH: 12, // src: 书 p249-253（分段 10~15，取 12）
  driftSpacing: 10, // src: 书 p249-253（进路间距 8~15，取 10，<分段高 ✓）
  sublevelCount: 3, // 示意：画 3 个分段
  driftsPerSublevel: 4, // 示意：每段 4 条进路
  driftReal: 3.5, // 进路/分段巷真实断面（示意）
  driftDisplay: 5, // ×1.4 显示（进路间距约束）
  haulageDisplay: 7, // 阶段运巷 ×2 显示
  shaftDia: 3, // 溜井/设备井/风井显示 Φ
  cotDip: 0.466, // = cot65°，下盘接触线 z_fw(h)=cotδ·h 的换算系数
  dipLength: 88, // 矿板沿倾向长 = 80/sin65°≈88（换算）
  displayNote: "矿体内巷道 ×1.4、阶段运巷 ×2、井筒 Φ3 显示放大；矿体半透明 0.5（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "崩落岩", "采准巷道", "回采进路", "深孔", "出矿系统", "围岩"];

/** 工艺阶段（方案 §5 崩落模板：采准→切割→崩落→放矿→覆盖层下回采） */
export const STAGES = ["采准工程", "切割工程", "崩落", "放矿", "覆盖层下回采"] as const;

/* ── 布局常量 ── */
const T = PARAMS.trueThickness;
const L = PARAMS.dipLength;
const X0 = -PARAMS.strikeLength / 2; // -40
const X1 = PARAMS.strikeLength / 2; // 40
const SUBL = [12, 24, 36]; // 分段标高
const DRIFT = PARAMS.driftDisplay;
const HAUL = PARAMS.haulageDisplay;
const D = PARAMS.shaftDia;
const DRIFT_X = [-15, -5, 5, 15]; // 进路 x 位（@10）
const CUT_X = -30; // 切割平巷 x
const RAISE_X = 35; // 溜井 x
const EQUIP_X = -35; // 设备井 x
const VENT_X = 0; // 通风人行天井 x
const SHAFT_Z = 2; // 三井 z（下盘侧）
const fwZ = (h: number) => PARAMS.cotDip * h; // 下盘接触线
const driftAxisZ = (h: number) => fwZ(h) + 3; // 分段巷道轴

/** 剖切区间：long 保留 x≤0（纵剖 = 分段进路侧视，主视图）；cross 变体本法不用（第 3 视角为俯视 iso） */
function clipOf(variant: string): { x0: number; x1: number } {
  if (variant === "long") return { x0: X0 - 1, x1: 0 };
  return { x0: X0 - 1, x1: X1 + 1 };
}

export function build(opts: BuildOpts = {}): ModelBuildResult {
  const variant = opts.variant ?? "iso";
  const clip = clipOf(variant);
  const isLong = variant === "long";
  /* ── 工艺阶段（1..5，缺省=末阶段=验收通过的现状态） ──
     S1 采准：阶段运巷+三井筒
     S2 切割：+三分段巷/联络道/切割巷+天井
     S3 崩落：+进路+已爆残孔+崩落带上部（首爆）
     S4 放矿：+LHD/矿流/矿堆
     S5 覆盖层下回采：+全部崩落带+活动面扇孔（=现状态）
     只改出现顺序与崩落带范围，不改巷道布局与尺寸 */
  const stage = Math.min(Math.max(opts.stage ?? STAGES.length, 1), STAGES.length);
  const dip = PARAMS.dip;

  const ore = layerGroup("矿体");
  const wall = layerGroup("围岩");
  const cave = layerGroup("崩落岩");
  const develop = layerGroup("采准巷道");
  const stope = layerGroup("回采进路");
  const holes = layerGroup("深孔");
  const extract = layerGroup("出矿系统");
  const root = new THREE.Group();
  root.add(ore, wall, cave, develop, stope, holes, extract);

  /* ── 矿体与围岩（局部框架，tilt −δ） ── */
  const oreAsm = new THREE.Group();
  oreAsm.name = "__oreAsm";
  oreAsm.add(
    slab(X1 - X0, T, L, {
      pos: [(X0 + X1) / 2, T / 2, L / 2],
      material: mat.oreGhost(),
    }),
  );
  // 剖切：long 保留 x≤0 半板
  if (isLong) {
    oreAsm.clear();
    oreAsm.add(slab(0 - X0, T, L, { pos: [(X0 + 0) / 2, T / 2, L / 2], material: mat.oreGhost() }));
    // 剖面着色板：切面 x=0 上的矿体截面轮廓提亮
    oreAsm.add(slab(0.15, T, L, { pos: [-0.075, T / 2, L / 2], material: mat.ore(true), edges: false }));
  }
  // 顶/底板围岩板（平行 bedding，随矿层倾斜；默认关）
  const wallAsm = new THREE.Group();
  wallAsm.name = "__wallAsm";
  const wallW = isLong ? 0 - X0 : X1 - X0;
  const wallCx = isLong ? (X0 + 0) / 2 : (X0 + X1) / 2;
  wallAsm.add(slab(wallW, 7, L + 6, { pos: [wallCx, -3.5, L / 2], material: mat.wall() })); // 底板（下盘）
  wallAsm.add(slab(wallW, 7, L + 6, { pos: [wallCx, T + 3.5, L / 2], material: mat.wall() })); // 顶板（上盘）
  ore.add(oreAsm);
  wall.add(wallAsm);
  tilt(ore, dip);
  tilt(wall, dip);

  /* ── 崩落岩（世界坐标）：顶部已崩区（矿体上部垮落带）+ 活动进路端矿堆 ──
     崩落带跟随矿体倾向带分布：高度 y 处矿体水平占位 z ∈ [cotδ·y−40, cotδ·y]，
     碎岩在各层带内散布，杜绝悬浮（授权书 §6.1：不得悬浮） */
  const caveW = isLong ? 38 : 74;
  const caveCx = isLong ? -20 : 0;
  const caveBands = stage >= 5 ? 7 : stage >= 3 ? 3 : 0;
  for (let i = 0; i < caveBands; i++) {
    const yBand = 50 + i * 5.5;
    const zMid = fwZ(yBand + 2.5) - PARAMS.horizontalThickness / 2; // 层带内矿体带中心
    cave.add(
      rubble({ x: caveCx, y: yBand, z: zMid, w: caveW, h: 5, d: 34 }, 11, 20261121 + i * 17, {
        size: [1.5, 3.6],
        oreMixRatio: 0.45,
      }),
    );
  }
  const muck = orePile([DRIFT_X[1], SUBL[2] + 0.2, -11.5], 5.4, 4.5, 2.6, { topW: 2.6, topD: 2.2, material: mat.rubble(true) });
  if (stage >= 4 && DRIFT_X[1] >= clip.x0 && DRIFT_X[1] <= clip.x1) cave.add(muck);

  /* ── 采准巷道（世界坐标）：阶段运巷 / 分段运输平巷 / 切割巷+天井 / 三井+联络道 ── */
  // 阶段运输巷道（底：y≈2）
  develop.add(
    tunnel(
      [
        [Math.max(X0, clip.x0), HAUL / 2, 4],
        [Math.min(X1, clip.x1), HAUL / 2, 4],
      ],
      HAUL,
      HAUL,
      {
        name: "stageHaul",
        // 岔口：三条井筒穿顶拱（u 域 = 井筒在运巷断面上的占位）
        openings: [EQUIP_X, VENT_X, RAISE_X]
          .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
          .map((x) => {
            const uC = SHAFT_Z - 4; // 井筒轴在运巷断面上的 u
            return { s: x - Math.max(X0, clip.x0), w: D, part: "roof", u0: uC - D / 2, u1: uC + D / 2 } as TunnelOpening;
          }),
      },
    ),
  );
  // 分段运输平巷 ×3（S2 切割工程起）+ 进路 ×4/段（进路属回采进路层，见下）
  for (const h of SUBL) {
    const az = driftAxisZ(h);
    if (stage < 2 || az < 0) continue;
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), h + DRIFT / 2, az],
          [Math.min(X1, clip.x1), h + DRIFT / 2, az],
        ],
        DRIFT,
        DRIFT,
        {
          name: `sublevel${h}`,
          // 岔口：三条联络道 + 切割平巷 + 四条进路，均在左帮（−Z 侧）
          openings: [EQUIP_X, CUT_X, VENT_X, ...DRIFT_X]
            .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
            .map((x) => ({ s: x - Math.max(X0, clip.x0), w: DRIFT, part: "wallL" }) as TunnelOpening),
        },
      ),
    );
    // 切割平巷（x=CUT_X，沿 Z 进矿）+ 切割天井（端部竖井）——S2 起
    if (stage >= 2 && CUT_X >= clip.x0 && CUT_X <= clip.x1) {
      develop.add(
        tunnel(
          [
            [CUT_X, h + DRIFT / 2, az],
            [CUT_X, h + DRIFT / 2, fwZ(h) - PARAMS.horizontalThickness + 2],
          ],
          DRIFT,
          DRIFT,
          { name: `cut${h}` },
        ),
      );
      develop.add(
        shaft([CUT_X, h, fwZ(h) - PARAMS.horizontalThickness + 5], [CUT_X, h + PARAMS.sublevelH, fwZ(h) - PARAMS.horizontalThickness + 5], 3, 3, {
          name: `cutRaise${h}`,
        }),
      );
    }
  }
  // 三井：矿石溜井 / 设备井 / 通风人行天井（下盘侧一排，z=SHAFT_Z）
  for (const well of [
    { x: RAISE_X, name: "oreRaise" },
    { x: EQUIP_X, name: "equipShaft" },
    { x: VENT_X, name: "ventRaise" },
  ]) {
    if (well.x < clip.x0 || well.x > clip.x1) continue;
    develop.add(shaft([well.x, TUNNEL_T, SHAFT_Z], [well.x, SUBL[2] + PARAMS.sublevelH, SHAFT_Z], D, D, { name: well.name }));
    // 联络道：每分段从井到分段巷道——S2 起
    for (const h of SUBL) {
      if (stage < 2) continue;
      develop.add(
        tunnel(
          [
            [well.x, h + DRIFT / 2, SHAFT_Z],
            [well.x, h + DRIFT / 2, driftAxisZ(h)],
          ],
          3,
          3,
          { name: `link${well.x}-${h}` },
        ),
      );
    }
  }

  /* ── 回采进路（世界坐标，S3 崩落起）：每分段 4 条，沿 Z 自分段巷道进矿至上盘接触 ── */
  for (const h of SUBL) {
    if (stage < 3) continue;
    const az = driftAxisZ(h);
    const zEnd = fwZ(h) - PARAMS.horizontalThickness + 1; // 上盘侧
    for (const dx of DRIFT_X) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      // 交错关系示意：上分段进路端不齐（锯齿推进）
      const end = h === SUBL[2] && dx === DRIFT_X[1] ? az - 26 : zEnd; // 活动面（未掘通）
      stope.add(
        tunnel(
          [
            [dx, h + DRIFT / 2, az],
            [dx, h + DRIFT / 2, end],
          ],
          DRIFT,
          DRIFT,
          { name: `drift${h}-${dx}`, openEnds: true },
        ),
      );
    }
  }

  /* ── 深孔：活动进路端上向扇形孔（Z-Y 平面扇开，端部挤压爆破） ── */
  const faceZ = fwZ(SUBL[2]) - PARAMS.horizontalThickness + 11; // 活动面 z
  if (DRIFT_X[1] >= clip.x0 && DRIFT_X[1] <= clip.x1) {
    // 活动面扇形孔——S5 覆盖层下回采态（现状态）
    if (stage >= 5) holes.add(fanHoles([DRIFT_X[1], SUBL[2] + DRIFT + 0.5, faceZ], 7, 80, 16, { baseAngle: 90, yawDeg: 90, radius: 0.22, charge: true }));
    // 已爆进路残孔（中层 x=−15 端部，示意）——S3 崩落起
    if (stage >= 3) holes.add(fanHoles([DRIFT_X[0], SUBL[1] + DRIFT + 0.5, fwZ(SUBL[1]) - PARAMS.horizontalThickness + 8], 5, 70, 14, { baseAngle: 90, yawDeg: 90, radius: 0.22 }));
  }

  /* ── 出矿系统：LHD 进路内直接出矿 + 矿流链（进路→分段巷→溜井） ── */
  if (stage >= 4 && DRIFT_X[1] >= clip.x0) extract.add(machine("lhd", [DRIFT_X[1], SUBL[2] + 0.2, -8], 180));
  if (stage >= 4) extract.add(
    arrows(
      [
        [DRIFT_X[1], SUBL[2] + 1.2, faceZ + 1.5],
        [DRIFT_X[1], SUBL[2] + 1.2, driftAxisZ(SUBL[2])],
        [20, SUBL[2] + 1.2, driftAxisZ(SUBL[2]) + 2],
        [RAISE_X, SUBL[2] + 1.2, SHAFT_Z],
      ],
      "flow",
      5,
      1.9,
    ),
  );

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    { label: "回采进路", p: [DRIFT_X[1], SUBL[2] + DRIFT + 0.8, -6] },
    { label: "扇形深孔", p: [DRIFT_X[1], SUBL[2] + DRIFT + 6, faceZ - 2] },
    { label: "崩落岩", p: [0, 66, -4] },
    { label: "矿石溜井", p: [RAISE_X, 20, SHAFT_Z + D / 2 + 0.6] },
    { label: "分段运输平巷", p: [10, SUBL[1] + DRIFT + 0.8, driftAxisZ(SUBL[1])] },
    { label: "切割天井", p: [CUT_X, SUBL[1] + PARAMS.sublevelH / 2, fwZ(SUBL[1]) - PARAMS.horizontalThickness + 5] },
    { label: "铲运机出矿", p: [DRIFT_X[1], SUBL[2] + 2.2, -8] },
    { label: "设备井", p: [EQUIP_X, 20, SHAFT_Z + D / 2 + 0.6] },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, cave, develop, stope, holes, extract]);
  return {
    group: root,
    anchors,
    bbox,
    focusPoints: { 进路端: [DRIFT_X[1], SUBL[2] + 4, faceZ] },
  };
}

/** 自检：图层合法、锚点≤8、bbox、无 NaN（iso/long 双变体） */
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
  if (PARAMS.driftSpacing >= PARAMS.sublevelH) problems.push("进路间距必须 < 分段高（教材判别）");
  return problems;
}
