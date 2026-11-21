/**
 * 有底柱分段崩落法 builder（sublevel-caving-bottom-pillar，10.4.2）
 * 教材依据：《采矿学》（第 2 版）10.4.2，书 p242-249，图 10-26（编号 1-12）/10-27 堑沟。
 * 辨识特征：**底柱双层结构**——上层斗颈⑤/堑沟⑥、下层电耙巷道④（剖面必须切出）；
 *   崩落岩只在上部已采分段；下盘脉外开拓（阶段沿脉①穿脉②溜井③电耙巷道④斗颈⑤
 *   堑沟巷道⑥凿岩巷道⑦行人通风天井⑧联络道⑨切割井⑩切割横巷⑪）；堑沟+"八"字拉槽；
 *   压崩扇形孔、边孔倾角 ≥55°。
 * 坐标：X 走向（矿块 28m）、Z 指向下盘（矿体向 −Z 倾伏 72°）、Y 向上。
 * 工艺阶段（崩落模板）：采准→切割（堑沟/拉槽）→分段崩落→放矿→覆盖层下退采。
 */
import * as THREE from "three";
import { slab, tunnel, shaft, machine, arrows, rubble, fanHoles, tilt, tiltMatrix, unionBBox, TUNNEL_T, type TunnelOpening } from "./geo.ts";
import { mat, layerGroup } from "./theme.ts";
import { LAYER_NAMES, type ModelBuildResult, type BuildOpts, type LayerName, type ModelAnchor } from "./types.ts";

export const PARAMS = {
  dip: 72, // src: 书 p242（急倾斜厚矿体）
  thickness: 24, // src: 书 p242（厚 24m）
  stageH: 55, // src: 书 p242（阶段 55m）
  sublevelH: 15, // src: 书 p242（分段 10-25 取 15）
  sublevels: 3, // src: 书 p242（画 3 分段）
  sillPillarH: 8, // src: 书 p242（分段底柱 6-8m）
  blockLength: 28, // src: 书 p242（矿块走向 25-30）
  displayNote: "矿体内巷道 ×1.4、斗颈 ×1.5 显示放大（示意）",
} as const;

export const LAYERS: LayerName[] = ["矿体", "崩落岩", "采准巷道", "出矿系统", "深孔", "通风", "围岩"];

/** 工艺阶段（崩落模板；底柱双层结构+崩落岩只在上部为本法签名） */
export const STAGES = ["采准工程", "切割工程", "分段崩落", "放矿（漏斗→电耙道→溜井）", "覆盖层下退采"] as const;

const T = PARAMS.thickness;
const X0 = -PARAMS.blockLength / 2;
const X1 = PARAMS.blockLength / 2;
const H = PARAMS.stageH;
const DIP_LEN = H / Math.sin((PARAMS.dip * Math.PI) / 180);
const Z_FOOT = 7; // 下盘巷道系（世界 z）
const Y_HAUL = -3;
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
  const extract = layerGroup("出矿系统");
  const holes = layerGroup("深孔");
  const air = layerGroup("通风");
  const wall = layerGroup("围岩");
  const oreAsm = new THREE.Group();
  const caveAsm = new THREE.Group();
  const wallAsm = new THREE.Group();
  ore.add(oreAsm);
  cave.add(caveAsm);
  wall.add(wallAsm);
  const root = new THREE.Group();
  root.add(ore, wall, cave, develop, extract, holes, air);

  /* 矿体：倾斜板；分段自上而下退采（S3 顶分段崩、S4 中分段、S5 全部+底部）。
     崩落岩只在上部已崩分段（签名）。 */
  const sillLen = PARAMS.sillPillarH / Math.sin((PARAMS.dip * Math.PI) / 180);
  const crownLen = 7 / Math.sin((PARAMS.dip * Math.PI) / 180);
  const roomLen = DIP_LEN - sillLen - crownLen;
  const wallW = variant === "long" ? 0 - X0 : X1 - X0;
  const wallCx = variant === "long" ? (X0 + 0) / 2 : (X0 + X1) / 2;
  const minedSubs = stage >= 5 ? 3 : stage >= 4 ? 2 : stage >= 3 ? 1 : 0;
  // 未崩矿体：下部（尚未回采的分段段长）
  const remainLen = roomLen - (minedSubs / PARAMS.sublevels) * roomLen;
  if (remainLen > 0.4) {
    oreAsm.add(
      slab(wallW, T, remainLen, {
        pos: [wallCx, T / 2, sillLen + roomLen - remainLen / 2],
        material: mat.ore(),
      }),
    );
  }
  // 底柱段（全期保留）
  oreAsm.add(slab(wallW, T, sillLen, { pos: [wallCx, T / 2, sillLen / 2], material: mat.ore() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, -2.5, DIP_LEN / 2], material: mat.wall() }));
  wallAsm.add(slab(wallW * 1.04, 5, DIP_LEN * 1.06 + 4, { pos: [wallCx, T + 2.5, DIP_LEN / 2], material: mat.wall() }));
  ore.add(oreAsm);
  wall.add(wallAsm);
  tilt(ore, PARAMS.dip);
  tilt(wall, PARAMS.dip);

  /* ── 崩落岩（S3 起，只在上部已崩分段——签名）：顶部分段区充满碎岩 ── */
  if (minedSubs >= 1) {
    const caveZ0 = sillLen + roomLen - (minedSubs / PARAMS.sublevels) * roomLen;
    const caveLen = (minedSubs / PARAMS.sublevels) * roomLen;
    caveAsm.add(
      rubble(
        { x: (X0 + X1) / 2, y: T * 0.15, z: caveZ0 + caveLen / 2, w: X1 - X0 - 2, h: T * 0.75, d: caveLen },
        Math.round(caveLen * 2.4),
        1024,
        { size: [1.2, 2.8], oreMixRatio: 0.45, material: mat.rubble(false) },
      ),
    );
  }

  /* ── 采准巷道（下盘脉外，S1 采准）：阶段沿脉运巷 + 穿脉 + 溜井 + 行人通风天井 ── */
  const yr = Y_HAUL + DRIFT / 2;
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
          name: "stageHaul",
          openings: [-8, 8]
            .filter((x) => x > Math.max(X0, clip.x0) && x < Math.min(X1, clip.x1))
            .map((x) => ({ s: x - Math.max(X0, clip.x0), w: DRIFT, part: "roof" }) as TunnelOpening),
        },
      ),
    );
    // 穿脉运巷 ×2（垂直走向连接沿脉与矿块）
    for (const x of [-8, 8]) {
      if (x < clip.x0 || x > clip.x1) continue;
      develop.add(
        tunnel(
          [
            [x, Y_HAUL, Z_FOOT],
            [x, Y_HAUL, Z_FOOT + 4],
          ],
          DRIFT,
          DRIFT,
          { name: `crosscut${x}`, openEnds: true },
        ),
      );
    }
    // 矿石溜井 ×2 + 行人通风天井 ×2（S1）
    for (const x of [-8, 8]) {
      if (x < clip.x0 || x > clip.x1) continue;
      develop.add(shaft([x, TUNNEL_T, Z_FOOT + 4], [x, TUNNEL_T + 14, Z_FOOT + 4], 3, 3, { name: `raise${x}` }));
      develop.add(shaft([x + 4, TUNNEL_T, Z_FOOT + 4], [x + 4, TUNNEL_T + 14, Z_FOOT + 4], 2.5, 2.5, { name: `manway${x}` }));
    }
  }

  /* ── 电耙底部结构（S1 采准，签名：底柱双层）：
     每分段底柱内——下层电耙巷道（沿走向）+ 上层斗颈 ×4（垂直向上）+ 堑沟巷道 ── */
  for (let sub = 0; sub < PARAMS.sublevels; sub++) {
    const hSill = 10 + sub * PARAMS.sublevelH; // 分段底柱底标高（电耙道层）
    const hTrench = hSill + PARAMS.sillPillarH; // 堑沟层标高
    // 电耙巷道 ×2/段（沿走向，下层）——S1
    for (const dx of [-7, 7]) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      develop.add(
        tunnel(
          [
            [dx - 8, hSill + DRIFT / 2, Z_FOOT + 1],
            [dx + 8, hSill + DRIFT / 2, Z_FOOT + 1],
          ],
          DRIFT,
          DRIFT,
          { name: `scraper${sub}-${dx}` },
        ),
      );
    }
    // 斗颈 ×4/耙道（垂直向上连堑沟层）——S1
    for (const dx of [-7, 7]) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      for (const nx of [-5, 0, 5]) {
        if (dx + nx < clip.x0 || dx + nx > clip.x1) continue;
        const p0 = toWorld([0, T / 2, sillLen * 0.5]);
        develop.add(
          shaft([dx + nx, hSill + DRIFT + 0.3, Z_FOOT + 1], [dx + nx, hTrench - 1, Z_FOOT + 1], 2.4, 2.4, {
            name: `neck${sub}-${dx + nx}`,
            openEnds: true,
          }),
        );
        void p0;
      }
    }
    // 堑沟巷道（上层，沿走向贯通——S1）
    develop.add(
      tunnel(
        [
          [Math.max(X0, clip.x0), hTrench + 1, Z_FOOT + 1],
          [Math.min(X1, clip.x1), hTrench + 1, Z_FOOT + 1],
        ],
        DRIFT,
        DRIFT,
        { name: `trench${sub}` },
      ),
    );
  }

  /* ── 切割（S2）：切割井 + 切割横巷 + "八"字拉槽（顶分段示意） ── */
  if (stage >= 2) {
    const hTop = 10 + 2 * PARAMS.sublevelH;
    develop.add(shaft([0, hTop - 4, Z_FOOT + 1], [0, hTop + 2, Z_FOOT + 1], 3, 3, { name: "cutRaise" }));
    develop.add(
      tunnel(
        [
          [-8, hTop + 1, Z_FOOT + 1],
          [8, hTop + 1, Z_FOOT + 1],
        ],
        DRIFT,
        DRIFT,
        { name: "cutCross" },
      ),
    );
    // "八"字拉槽：两条反向倾斜天井（示意）
    develop.add(shaft([-6, hTop, Z_FOOT - 1], [0, hTop + 8, Z_FOOT + 1], 2.6, 2.6, { name: "slotL", openEnds: true }));
    develop.add(shaft([6, hTop, Z_FOOT - 1], [0, hTop + 8, Z_FOOT + 1], 2.6, 2.6, { name: "slotR", openEnds: true }));
  }

  /* ── 深孔（S3 崩落起）：凿岩巷道压崩扇形孔（边孔 ≥55°）——顶分段 ── */
  if (stage >= 3) {
    const minedSubsShown = stage >= 5 ? 3 : stage >= 4 ? 2 : 1;
    for (let sub = PARAMS.sublevels - minedSubsShown; sub < PARAMS.sublevels; sub++) {
      const h = 10 + (sub + 1) * PARAMS.sublevelH - PARAMS.sillPillarH;
      if (h > H - PARAMS.crownPillar) continue;
      for (const dx of [-7, 7]) {
        if (dx < clip.x0 || dx > clip.x1) continue;
        holes.add(
          fanHoles([dx, h + DRIFT + 0.5, Z_FOOT + 1], 6, 90, 10, { baseAngle: 60, yawDeg: 90, radius: 0.3 }),
        );
      }
    }
  }

  /* ── 出矿系统（S4 放矿起）：电耙 ×2 于底部耙道 + 矿流（漏斗→耙道→溜井） ── */
  if (stage >= 4) {
    const hSill0 = 10;
    for (const dx of [-7, 7]) {
      if (dx < clip.x0 || dx > clip.x1) continue;
      extract.add(machine("scraper", [dx, hSill0 + 0.4, Z_FOOT + 1], 0));
    }
    extract.add(
      arrows(
        [
          [0, hSill0 + 1, Z_FOOT + 1],
          [0, Y_HAUL, Z_FOOT],
          [-8, Y_HAUL, Z_FOOT + 4],
        ],
        "flow",
        3,
        1.9,
      ),
    );
  }

  /* ── 通风（S2 起）：运巷进风 → 行人天井 → 各分段；污风经另一天井 ── */
  if (stage >= 2) {
    air.add(
      arrows(
        [
          [X0 + 2, Y_HAUL, Z_FOOT],
          [X0 + 4, Y_HAUL, Z_FOOT + 4],
          [X0 + 4, Y_HAUL + 6, Z_FOOT + 4],
        ],
        "airIn",
        3,
        1.8,
      ),
    );
    air.add(
      arrows(
        [
          [X1 + 4, TUNNEL_T + 10, Z_FOOT + 4],
          [X1 + 4, TUNNEL_T + 13, Z_FOOT + 4],
        ],
        "airOut",
        2,
        1.8,
      ),
    );
  }

  /* ── 锚点（≤8） ── */
  const anchorDefs: { label: string; p: [number, number, number] }[] = [
    { label: "电耙巷道（底柱下层）", p: [0, 10 + DRIFT + 0.8, Z_FOOT + 1] },
    { label: "斗颈（上层）", p: [-5, 10 + PARAMS.sillPillarH - 1, Z_FOOT + 1] },
    ...(stage >= 2 ? [{ label: "堑沟巷道", p: [0, 10 + PARAMS.sillPillarH + 2, Z_FOOT + 1] }] : []),
    ...(stage >= 2 ? [{ label: "八字拉槽", p: [0, 10 + 2 * PARAMS.sublevelH + 6, Z_FOOT + 1] }] : []),
    ...(stage >= 3 ? [{ label: "崩落岩（上部）", p: [0, T + 0.7, DIP_LEN * 0.85] }] : []),
    ...(stage >= 3 ? [{ label: "压崩扇形孔", p: [-7, 10 + PARAMS.sublevelH + DRIFT + 0.8, Z_FOOT + 1] }] : []),
    ...(stage >= 4 ? [{ label: "电耙放矿", p: [0, 10 + 0.6, Z_FOOT + 1] }] : []),
    { label: "矿石溜井", p: [-8, TUNNEL_T + 3, Z_FOOT + 4] },
  ];
  const anchors: ModelAnchor[] = anchorDefs
    .filter((a) => a.p[0] >= clip.x0 && a.p[0] <= clip.x1)
    .map((a) => ({ label: a.label, pos: a.p }));

  const bbox = unionBBox([ore, wall, cave, develop, extract, holes, air]);
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
  if (PARAMS.sillPillarH < 6 || PARAMS.sillPillarH > 8) problems.push(`分段底柱应 6-8m（p242），实测 ${PARAMS.sillPillarH}`);
  return problems;
}
