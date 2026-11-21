/**
 * 房柱采矿法 builder（room-pillar）
 * 教材依据：《采矿学》（第 2 版）11.3，书 p279-282，图 11-5/11-7/11-8。
 * 特征：规则矿柱方阵（Φ4@6，柱间净距 2m 显式计算）、拉底+挑顶两步、
 *       溜井在矿房中心线下方（矿柱列之间，教材 p280）、上山紧贴底板、
 *       运巷在底板岩石中、电耙硐室在矿房下部矿柱内。
 * 坐标：X 走向（两矿房），Z 指向下盘、矿体向 −Z 倾伏 8°，Y 向上；原点 = 矿层底板 @ z=0。
 * 框架约定：矿层内对象（矿体/矿柱/矿体内巷道/围岩）在水平局部框架生成后整组
 *   tilt(−δ)；运巷/联络巷/溜井等底板岩工程为世界坐标水平件。
 * 显示比例：底板岩运巷 ×3 = 7.2（方案 §3.6）；矿体内巷道受层厚约束 ×1.5 = 3.5；
 *   溜井 ×2 = Φ3。均诚实标注（方案 §7）。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 8, // src: 书 p279（水平~缓倾）
  thickness: 6, // src: 书 p280（中厚示意 t=6m）
  roomLength: 50, // src: 书 p280（矿房沿倾斜 40~60，取 50）
  roomWidth: 14, // src: 书 p280（矿房宽 8~20，取 14）
  pillarDia: 4, // src: 书 p280（矿柱 Φ3~7，取 4）
  pillarSpacing: 6, // src: 书 p280（@5~8，取 6；净距 6−4=2m 显式）
  ribPillarW: 6, // 间柱宽，示意
  sillPillar: 3, // 底柱厚，示意
  crownPillar: 3, // 顶柱厚，示意
  driftReal: 2.4, // 运巷真实断面（示意）
  driftRockDisplay: 7.2, // 底板岩运巷 ×3 显示（方案 §3.6）
  driftOreDisplay: 3.5, // 矿体内巷道 ×1.5（受层厚约束）
  raiseDiaReal: 1.5, // 溜井真实 Φ
  raiseDiaDisplay: 3, // 溜井 ×2 显示
  subStepSlab: 3, // 拉底层高 = 层厚一半（分层挑顶，示意）
  zFrontCaving: -5, // 挑顶前锋：z<此为拉底+挑顶完成区
  zFrontSlab: 10, // 拉底前锋：z<此为拉底完成区
  displayNote: "底板岩运巷 ×3、矿体内巷道 ×1.5、溜井 ×2 显示放大（示意，非实尺）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "矿柱", "采准巷道", "出矿系统", "设备", "通风", "围岩"];

/** 工艺阶段（方案 §5 空场模板，房柱法矿柱不回收故末阶段=出矿与顶板管理） */
export const STAGES = ["采准工程", "切割工程", "拉底回采", "挑顶落矿", "出矿与顶板管理"] as const;

/* ── 布局常量（由 PARAMS 派生） ── */
const R = PARAMS.roomWidth / 2; // 7
const ROOMS = [
  { cx: 0 }, // 房 A：x ∈ [-7,7]
  { cx: PARAMS.roomWidth + PARAMS.ribPillarW }, // 房 B：x ∈ [13,27]，间柱 x ∈ [7,13]
] as const;
const Z0 = -PARAMS.roomLength / 2; // -25 房下端（出矿端）
const Z1 = PARAMS.roomLength / 2; // 25 房上端
const ZS = Z0 - PARAMS.sillPillar; // -28 底柱外缘
const ZE = Z1 + PARAMS.crownPillar; // 28 顶柱外缘
const X0 = ROOMS[0].cx - R - PARAMS.ribPillarW; // -13 西端边界
const X1 = ROOMS[1].cx + R + PARAMS.ribPillarW; // 33 东端边界
const Z_TRANSPORT = Z0 - 6; // -31 运巷轴线
const Y_TRANSPORT = -12; // 运巷底板（底板岩中）
const DRIFT_ROCK = PARAMS.driftRockDisplay;
const DRIFT_ORE = PARAMS.driftOreDisplay;
const RAISE_D = PARAMS.raiseDiaDisplay;
const PILLAR_COLS = [-3, 3]; // 房内柱列（房中心 ±3）
const PILLAR_ROWS = [-21, -15, -9, -3, 3, 9]; // @6；z ≥ 拉底前锋为未采区不留柱
const CUT_Z = Z0 - 1; // -26 切割平巷轴线（矿层局部 z）

/** 剖切区间：iso 全量 / long 保留 x≤0（纵剖过房 A 中心）/ cross 保留 z≤-9（横剖过柱列+溜井） */
interface Clip {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}
function clipOf(variant: string): Clip {
  if (variant === "long") return { x0: X0 - 1, x1: 0, z0: ZS - 5, z1: ZE + 5 };
  if (variant === "cross") return { x0: X0 - 1, x1: X1 + 1, z0: ZS - 5, z1: -9 };
  return { x0: X0 - 1, x1: X1 + 1, z0: ZS - 5, z1: ZE + 5 };
}

/**
 * 实体体块（局部矿层框架坐标）：与剖切区间求交，空交集跳过；
 * 被剖切的端面自动贴 0.15 厚提亮板（剖面着色板，方案 §3.8）。
 */
function solidPiece(
  g: THREE.Group,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  material: THREE.Material,
  cutMaterial: THREE.Material,
  clip: Clip,
  cutAxis: "x" | "z" | null,
): void {
  const cx0 = Math.max(x0, clip.x0);
  const cx1 = Math.min(x1, clip.x1);
  const cz0 = Math.max(z0, clip.z0);
  const cz1 = Math.min(z1, clip.z1);
  if (cx1 - cx0 < 0.05 || cz1 - cz0 < 0.05 || y1 - y0 < 0.05) return;
  g.add(
    slab(cx1 - cx0, y1 - y0, cz1 - cz0, {
      pos: [(cx0 + cx1) / 2, (y0 + y1) / 2, (cz0 + cz1) / 2],
      material,
    }),
  );
  if (cutAxis === "x" && Math.abs(cx1 - clip.x1) < 1e-6) {
    g.add(
      slab(0.15, y1 - y0, cz1 - cz0, {
        pos: [cx1 - 0.075, (y0 + y1) / 2, (cz0 + cz1) / 2],
        material: cutMaterial,
        edges: false,
      }),
    );
  }
  if (cutAxis === "z" && Math.abs(cz1 - clip.z1) < 1e-6) {
    g.add(
      slab(cx1 - cx0, y1 - y0, 0.15, {
        pos: [(cx0 + cx1) / 2, (y0 + y1) / 2, cz1 - 0.075],
        material: cutMaterial,
        edges: false,
      }),
    );
  }
}

export function build(opts: BuildOpts = {}): ModelBuildResult {
  const variant = opts.variant ?? "iso";
  const clip = clipOf(variant);
  const cutAxis = variant === "long" ? ("x" as const) : variant === "cross" ? ("z" as const) : null;
  const dip = PARAMS.dip;
  const M = tiltMatrix(dip);
  const toWorld = (p: [number, number, number]): [number, number, number] => {
    const v = new THREE.Vector3(...p).applyMatrix4(M);
    return [v.x, v.y, v.z];
  };

  /* ── 图层树：ore/pillar/wall 的局部子组随矿层倾斜；develop 双框架 ── */
  const ore = layerGroup("矿体");
  const wall = layerGroup("围岩");
  const pillar = layerGroup("矿柱");
  const develop = layerGroup("采准巷道");
  const extract = layerGroup("出矿系统");
  const equip = layerGroup("设备");
  const air = layerGroup("通风");
  const oreAsm = new THREE.Group(); // 局部框架：矿体
  const pillarAsm = new THREE.Group(); // 局部框架：矿柱
  const devAsm = new THREE.Group(); // 局部框架：矿体内巷道
  const wallAsm = new THREE.Group(); // 局部框架：围岩
  const voidAsm = new THREE.Group(); // 局部框架：采空区边界壳（矿体层内，方案 §3.6）
  ore.add(oreAsm);
  pillar.add(pillarAsm);
  develop.add(devAsm);
  wall.add(wallAsm);
  ore.add(voidAsm);
  const root = new THREE.Group();
  root.add(ore, wall, pillar, develop, extract, equip, air);

  /* ── 工艺阶段（1..5，缺省=末阶段=验收通过的现状态） ──
     S1 采准：运巷+联络巷，矿房未采（整房实心矿体）
     S2 切割：+切割平巷/上山/溜井/电耙硐室，自由面形成
     S3 拉底：拉底沿全房推进（zfS=Z1、zfC=Z0——冠顶皮覆盖全房、房内柱半高、拉底壳全房）
     S4 挑顶：挑顶前锋推进至 zFrontCaving（=验收通过状态）
     S5 出矿与顶板管理：同 S4 几何 + 出矿链/锚杆显现
     前锋参数化只改几何推进，不改巷道布局与尺寸 */
  const stage = Math.min(Math.max(opts.stage ?? STAGES.length, 1), STAGES.length);
  const zfC = stage >= 4 ? PARAMS.zFrontCaving : stage === 3 ? Z0 : Z1;
  const zfS = stage >= 3 ? PARAMS.zFrontSlab : Z1;
  const t = PARAMS.thickness;
  const hs = PARAMS.subStepSlab;

  /* ── 矿体实体（局部框架）：拉底区顶皮 / 未采区 / 端部边界 ── */
  for (const room of ROOMS) {
    const rx0 = room.cx - R;
    const rx1 = room.cx + R;
    if (stage <= 2) {
      // 采准/切割期：矿房未采——整房实心矿体
      solidPiece(oreAsm, rx0, rx1, 0, t, Z0, Z1, mat.ore(), mat.ore(true), clip, cutAxis);
    } else {
      solidPiece(oreAsm, rx0, rx1, hs, t, zfC, zfS, mat.ore(), mat.ore(true), clip, cutAxis); // 拉底区顶皮
      solidPiece(oreAsm, rx0, rx1, 0, t, zfS, Z1, mat.ore(), mat.ore(true), clip, cutAxis); // 未采区
    }
    if (room.cx === ROOMS[0].cx) {
      solidPiece(oreAsm, rx0 - PARAMS.ribPillarW, rx0, 0, t, ZS, ZE, mat.ore(), mat.ore(true), clip, cutAxis); // 西端边界（矿体）
    } else {
      solidPiece(oreAsm, rx1, rx1 + PARAMS.ribPillarW, 0, t, ZS, ZE, mat.ore(), mat.ore(true), clip, cutAxis); // 东端边界（矿体）
    }
  }
  /* ── 矿柱实体（局部框架）：间柱 / 底柱 / 顶柱（S3 起才存在——拉底后矿柱才从矿体中显现） ── */
  if (stage >= 3) {
    solidPiece(pillarAsm, ROOMS[0].cx + R, ROOMS[1].cx - R, 0, t, ZS, ZE, mat.pillar(), mat.pillar(true), clip, cutAxis); // 间柱
    for (const room of ROOMS) {
      solidPiece(pillarAsm, room.cx - R, room.cx + R, 0, t, ZS, Z0, mat.pillar(), mat.pillar(true), clip, cutAxis); // 底柱
      solidPiece(pillarAsm, room.cx - R, room.cx + R, 0, t, Z1, ZE, mat.pillar(), mat.pillar(true), clip, cutAxis); // 顶柱
    }
  }
  /* ── 房内规则矿柱（矿柱层）：挑顶区全高 / 拉底区半高 / 未采区不留 ── */
  if (stage >= 3) {
    for (const room of ROOMS) {
      for (const px of PILLAR_COLS) {
        const x = room.cx + px;
        if (x < clip.x0 - 2 || x > clip.x1 + 2) continue;
        for (const pz of PILLAR_ROWS) {
          if (pz >= zfS) continue;
          if (pz < clip.z0 - 2 || pz > clip.z1 + 2) continue;
          const h = pz < zfC ? t : hs;
          const cyl = new THREE.Mesh(new THREE.CylinderGeometry(PARAMS.pillarDia / 2, PARAMS.pillarDia / 2, h, 16), mat.pillar());
          cyl.position.set(x, h / 2, pz);
          pillarAsm.add(cyl);
        }
      }
    }
  }
  /* ── 采空区边界壳（方案 §3.6：不建体，只画 0.18 边界壳，让采空空间可读） ── */
  for (const room of ROOMS) {
    // 挑顶完成区：全高空腔壳
    solidPiece(
      voidAsm,
      room.cx - R + 0.2,
      room.cx + R - 0.2,
      0.1,
      t - 0.1,
      Z0 + 0.2,
      zfC - 0.2,
      mat.voidShell(),
      mat.voidShell(),
      { ...clip, x0: Math.max(clip.x0, room.cx - R - 1) },
      cutAxis,
    );
    // 拉底区：下半空腔壳
    solidPiece(
      voidAsm,
      room.cx - R + 0.2,
      room.cx + R - 0.2,
      0.1,
      hs - 0.1,
      zfC + 0.2,
      zfS - 0.2,
      mat.voidShell(),
      mat.voidShell(),
      clip,
      cutAxis,
    );
  }

  /* ── 矿体内采准巷道（局部框架）：切割平巷 + 上山（S2 切割工程起） ── */
  if (stage >= 2) devAsm.add(
    tunnel(
      [
        [Math.max(ROOMS[0].cx - R, clip.x0), DRIFT_ORE / 2, CUT_Z],
        [Math.min(ROOMS[1].cx + R, clip.x1), DRIFT_ORE / 2, CUT_Z],
      ],
      DRIFT_ORE,
      DRIFT_ORE,
      {
        name: "cutDrift",
        // 岔口：联络横巷与电耙硐室在左帮（−Z），上山在右帮（+Z）
        openings: [
          ...[ROOMS[0].cx, ROOMS[1].cx].map((x) => ({ s: x - Math.max(ROOMS[0].cx - R, clip.x0), w: DRIFT_ORE, part: "wallL" })),
          ...[ROOMS[0].cx - 4, ROOMS[1].cx + 4].map((x) => ({ s: x - Math.max(ROOMS[0].cx - R, clip.x0), w: 4.5, part: "wallL" })),
          ...[ROOMS[0].cx, ROOMS[1].cx].map((x) => ({ s: x - Math.max(ROOMS[0].cx - R, clip.x0), w: DRIFT_ORE, part: "wallR" })),
        ].filter((o) => o.s > 0) as TunnelOpening[],
      },
    ),
  );
  for (const room of ROOMS) {
    if (stage < 2 || room.cx < clip.x0 || room.cx > clip.x1) continue;
    const zA = Math.max(CUT_Z, clip.z0);
    const zB = Math.min(Z1 - 2, clip.z1);
    if (zB <= zA) continue;
    const pts: [number, number, number][] = [];
    for (let z = zA; z <= zB; z += 5) pts.push([room.cx, DRIFT_ORE / 2, z]);
    if (pts[pts.length - 1][2] !== zB) pts.push([room.cx, DRIFT_ORE / 2, zB]);
    devAsm.add(tunnel(pts, DRIFT_ORE, DRIFT_ORE, { name: `ramp${room.cx}`, openEnds: true }));
  }
  /* ── 围岩（默认关，局部框架）：顶/底板岩板（贴矿层，厚 5m） ── */
  wallAsm.add(slab(X1 - X0 + 2, 5, ZE - ZS + 2, { pos: [(X0 + X1) / 2, -2.5, (ZS + ZE) / 2], material: mat.wall() }));
  wallAsm.add(slab(X1 - X0 + 2, 5, ZE - ZS + 2, { pos: [(X0 + X1) / 2, t + 2.5, (ZS + ZE) / 2], material: mat.wall() }));

  /* ── 整组倾斜：局部框架统一 tilt(−δ)（坐标系门禁 geo.test 已锁） ── */
  for (const g of [ore, pillar, wall, devAsm]) tilt(g, dip);

  /* ── 世界坐标工程：运巷 / 联络横巷 / 溜井 / 电耙硐室 ── */
  const yr = Y_TRANSPORT + DRIFT_ROCK / 2;
  if (Z_TRANSPORT >= clip.z0 && Z_TRANSPORT <= clip.z1) {
    const xA = Math.max(X0, clip.x0);
    const xB = Math.min(X1, clip.x1);
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
            // 岔口：联络横巷（右帮）+ 溜井（顶拱，u 域 = 溜井在运巷断面上的占位）
            openings: [ROOMS[0].cx, ROOMS[1].cx]
              .filter((x) => x > xA && x < xB)
              .flatMap((x) => {
                const uC = Z0 - 3 - Z_TRANSPORT; // 溜井轴在运巷断面上的 u
                return [
                  { s: x - xA, w: DRIFT_ORE, part: "wallR" },
                  { s: x - xA, w: RAISE_D, part: "roof", u0: uC - RAISE_D / 2, u1: Math.min(uC + RAISE_D / 2, DRIFT_ROCK / 2) },
                ] as TunnelOpening[];
              }),
          },
        ),
      );
    }
  }
  const cutFloorW = toWorld([0, 0, CUT_Z])[1]; // 世界矿层底 @ CUT_Z
  for (const room of ROOMS) {
    if (room.cx < clip.x0 || room.cx > clip.x1) continue;
    develop.add(
      tunnel(
        [
          [room.cx, yr, Z_TRANSPORT],
          [room.cx, cutFloorW + DRIFT_ORE / 2, CUT_Z],
        ],
        DRIFT_ORE,
        DRIFT_ORE,
        { name: `cross${room.cx}` },
      ),
    );
  }
  const raiseTopY = toWorld([0, 0, Z0 + 4])[1]; // 拉底区矿层底 @ z=-21（世界）
  for (const room of ROOMS) {
    if (stage < 2 || room.cx < clip.x0 || room.cx > clip.x1) continue;
    develop.add(
      shaft(
        [room.cx, Y_TRANSPORT + TUNNEL_T, Z0 - 3],
        [room.cx, raiseTopY, Z0 + 4],
        RAISE_D,
        RAISE_D,
        { name: `raise${room.cx}`, openEnds: true },
      ),
    );
  }
  // 电耙硐室：房 A 在 x=-4、房 B 在 x=+24（矿房下部矿柱内，接切割平巷）
  for (const wr of [
    { x: ROOMS[0].cx - 4 },
    { x: ROOMS[1].cx + 4 },
  ]) {
    if (stage < 2 || wr.x < clip.x0 || wr.x > clip.x1) continue;
    develop.add(
      shaft(
        [wr.x, cutFloorW + DRIFT_ORE / 2, CUT_Z],
        [wr.x, cutFloorW + DRIFT_ORE / 2, Z0 - 3],
        4.5,
        DRIFT_ORE,
        { name: `winch${wr.x}` },
      ),
    );
  }

  /* ── 出矿系统（世界坐标，S4 出矿起）：电耙剪影 + 矿流链（工作面→溜井→运巷） ── */
  const wA = ROOMS[0].cx;
  const showExtract = stage >= 4;
  if (showExtract && ROOMS[0].cx - 4 >= clip.x0) extract.add(machine("scraper", [ROOMS[0].cx - 4, cutFloorW, Z0 - 4], 180));
  if (showExtract && ROOMS[1].cx + 4 <= clip.x1 && Z0 - 4 >= clip.z0) extract.add(machine("scraper", [ROOMS[1].cx + 4, cutFloorW, Z0 - 4], 180));
  if (showExtract) extract.add(
    arrows(
      [
        [wA, toWorld([0, 0.6, Z0 + 9])[1], toWorld([0, 0, Z0 + 9])[2]],
        [wA, toWorld([0, 0.4, Z0 + 1])[1], toWorld([0, 0, Z0 + 1])[2]],
        [wA, raiseTopY + 0.6, Z0 + 4],
        [wA, Y_TRANSPORT + DRIFT_ROCK - 1, Z0 - 3],
        [wA, Y_TRANSPORT + DRIFT_ROCK - 1, Z_TRANSPORT + 6],
      ],
      "flow",
      5,
      1.9,
    ),
  );

  /* ── 设备（世界坐标）：凿岩台车 + 锚杆支护带 ── */
  const jumboX = ROOMS[0].cx - 2;
  const jumboZ = zfS - 2;
  if (stage >= 3 && jumboX >= clip.x0 && jumboX <= clip.x1 && jumboZ >= clip.z0 && jumboZ <= clip.z1) {
    equip.add(machine("drilljumbo", [jumboX, toWorld([0, 0, jumboZ])[1], jumboZ], 180));
  }
  const boltMat = mat.machine();
  for (let i = 0; stage >= 4 && i < 5; i++) {
    const bz = zfC + 2 + i * 3;
    if (bz >= zfS) break;
    const bx = ROOMS[0].cx - 4 + (i % 2) * 8;
    if (bx < clip.x0 || bx > clip.x1 || bz < clip.z0 || bz > clip.z1) continue;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.2, 6), boltMat);
    bolt.position.set(bx, toWorld([0, hs - 0.4, bz])[1], bz);
    equip.add(bolt);
  }

  /* ── 通风（世界坐标，S2 切割后系统形成）：运巷进风→联络巷→切割巷→上山→工作面；污风越顶柱出 ── */
  if (stage >= 2) air.add(
    arrows(
      [
        [X0 + 2, yr, Z_TRANSPORT],
        [wA, yr, Z_TRANSPORT],
        [wA, yr + 3, Z_TRANSPORT + 2],
      ],
      "airIn",
      3,
      1.8,
    ),
  );
  if (stage >= 2) air.add(
    arrows(
      [
        [wA, cutFloorW + DRIFT_ORE / 2, CUT_Z],
        [wA, cutFloorW + DRIFT_ORE / 2 + 1, Z0 + 6],
        [wA, toWorld([0, hs + 1, zfS - 4])[1], zfS - 4],
      ],
      "airIn",
      3,
      1.8,
    ),
  );
  if (stage >= 4) air.add(
    arrows(
      [
        [wA, toWorld([0, hs + 1.4, zfC + 2])[1], zfC + 2],
        [wA, toWorld([0, t - 0.8, Z1 - 2])[1], Z1 - 2],
        [wA, toWorld([0, t + 1.6, ZE - 1])[1], ZE - 1],
      ],
      "airOut",
      3,
      1.8,
    ),
  );

  /* ── 锚点（≤8，剖切变体下自动过滤被切除的） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    { label: "规则矿柱 Φ4@6", p: toWorld([wA - 3, t + 0.5, -15]) },
    { label: "拉底工作面", p: toWorld([wA - 1, hs + 0.6, zfS - 2]) },
    { label: "挑顶完成区", p: toWorld([wA - 1, t + 0.6, zfC - 6]) },
    { label: "上山（自由面）", p: toWorld([wA, DRIFT_ORE + 1.2, -2]) },
    { label: "放矿溜井", p: [wA, raiseTopY + 1, Z0 + 4] },
    { label: "电耙硐室", p: toWorld([wA - 4, DRIFT_ORE + 1.2, Z0 - 3]) },
    { label: "顶柱", p: toWorld([wA - 3, t + 0.9, Z1 + 1.5]) },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1 && a.p[2] >= clip.z0 && a.p[2] <= clip.z1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, pillar, develop, extract, equip, air]);
  return { group: root, anchors, bbox, focusPoints: {} };
}

/** 自检（授权书 §7 检查单）：图层合法、锚点≤8、bbox 有效、柱间净距、无 NaN */
export function selfCheck(): string[] {
  const problems: string[] = [];
  const legal = new Set<string>(LAYER_NAMES);
  for (const l of LAYERS) if (!legal.has(l)) problems.push(`图层越界: ${l}`);
  for (const variant of ["iso", "long", "cross"] as const) {
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
  const gap = PARAMS.pillarSpacing - PARAMS.pillarDia;
  if (gap !== 2) problems.push(`柱间净距应为 2m，实测 ${gap}`);
  return problems;
}
