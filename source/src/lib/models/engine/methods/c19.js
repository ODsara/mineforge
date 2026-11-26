// C-19 无底柱分段崩落法
// 依据：教材B §10.4（印249–262）、图10-33/10-37/10-40/10-43/10-44；交付成果09§一、11§四
// 展示参数取教材区间（见 docs/参数档）：分段高15m、进路间距10m、断面4.0×3.3m、上下分段交错5m
import * as THREE from 'three';
import {
  archSection, rectSection, hollowTunnel, shaftCylinder, shaftBox, cylinderBetween,
  oreBody, dippingSlab, prismAlongX, wedgeAlongZ, dipZ,
  dashedOutline, solidOutline, fanHoles,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'C-19',
  name: '无底柱分段崩落法',
  en: 'Sublevel Caving (no sill pillar)',
  category: '崩落采矿法 · 分段崩落法（表6-1 组12 / 典型方法19）',
  refs: '教材B §10.4，印249–262 · 图10-33（三投影+立体）、图10-37（交错布置）、图10-44（残留参数）',
  tier: 'A 级资料（图10-33 全构件标注）',
  summary:
    '各分段只掘回采巷道（进路）与分段运输平巷，无底部结构；进路内钻上向扇形中深孔，' +
    '崩矿后在进路端部眉线直接放矿，崩落覆岩随放矿下移。上下分段进路严格交错（菱形）布置，' +
    '使下分段能回收上分段进路间的脊部残留——这是本方法最核心的三维教学点。',
  teaching: [
    '一步回采：崩落法不留下顶柱、不留间柱，靠覆岩随采随落管理地压。',
    '进路端面眉线即放矿口：没有漏斗、没有底部结构，出矿在进路内完成。',
    '上下分段进路偏移 = 进路间距之半，菱形交错（图10-37b）。',
    '溜井、设备井、通风天井布置在崩落界限之外的下盘围岩中。',
    '状态转换：未开采矿体（实心）→ 崩落矿石（碎块）→ 崩落围岩；回采进程逐分段置换。',
  ],
  stages: ['采准切割', '第一分段（上部）回采', '第二分段（中部）回采', '第三分段（下部）回采'],
  params: [
    ['矿体倾角 / 水平厚度', '75° / 24 m', '展示假设：急倾斜厚矿体（>15–20 m 垂直走向布置）'],
    ['走向长度 / 阶段高度', '80 m / 60 m', '阶段高取 60 m（教材区间 60–120 m）'],
    ['分段高度', '15 m', '教材区间 10–15 m（§10.4.1）'],
    ['进路间距', '10 m', '教材区间 8–15 m（§10.4.2.4）'],
    ['进路断面', '4.0 × 3.3 m', '教材区间 3×2.8 ~ 4.5×3.8 m'],
    ['上下分段交错偏移', '5 m', '= 进路间距之半（图10-37b）'],
    ['崩落覆岩厚度', '28 m', '≈ 2 个分段高（§10.4.6，印260）'],
    ['溜井 / 设备井 / 风井', 'φ3 m / 3.3×3.8 m / φ2.5 m', '图10-33③④⑤'],
    ['切割槽（端部拉槽）', '宽 5 m × 高 15 m', '沿各进路端部布置，贯穿分段（图10-40；示意）'],
  ],
  assumptions: [
    '矿体形态为示意板状体，非真实矿体轮廓（【假】）。',
    '崩落覆岩顶界形态、脊部/端部残留体体积为静态示意快照（【假】）；教材给理论式，不给可建模形态。',
    '展示标高 15、30、45 m 的三个回采分段，0–15 m 区段为下一循环的未采矿体【假】。',
    '示意覆岩与崩落矿石共同下移，扇形线仅表示方向和位置【假】。',
  ],
  layers: ['ore', 'rock', 'drift', 'muck', 'cut', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体',
    rock: '围岩',
    drift: '巷道（中空）',
    stope: '已回采空间',
    muck: '崩落矿岩（已回采区）',
    cut: '切割工程',
    shaft: '井筒',
    lod2: 'LOD2 辅助细节',
    labels: '标注',
  },
  states: ['unmined', 'mined_out', 'caved_ore', 'caved_rock', 'residual', 'excavation'],
  camera: { pos: [150, 112, 120], target: [0, 36, -8] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 75;
const X0 = -40, X1 = 40;
const Y0 = 0, Y1 = 60;
const TH = 24;
const HAUL_Z = -38;
const SHAFT_Z = -48;
const SL_HEIGHT = 15;
const DRIFT_H = 3.3;
const CUT_WIDTH = 5;
const CUT_Z_REL = TH / 2 - CUT_WIDTH / 2 - 0.25;
const SUBLEVELS = [
  { y: 15, xs: [-30, -20, -10, 0, 10, 20, 30] },
  { y: 30, xs: [-35, -25, -15, -5, 5, 15, 25] },
  { y: 45, xs: [-30, -20, -10, 0, 10, 20, 30] },
];

export function build(M) {
  const registry = createRegistry('C-19');
  const { group, layers } = createLayerGroups();
  const processFx = new THREE.Group();
  processFx.name = 'processFx';
  group.add(processFx);
  const fanGroups = [];

  // ---------------- 矿体（按分段拆成状态块：未开采 ORE_UNMINED） ----------------
  // 保留下一循环的底部未采矿体，其余三个分段随回采改变状态。
  const oreEnvelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  const envelopeLine = dashedOutline(oreEnvelope, 0xf0a05a, 0.42, 2.2, 1.8);
  layers.ore.add(envelopeLine);

  const ORE_SLABS = [
    { y0: 0, y1: 15, label: '0–15 m（下一循环）' },
    { y0: 15, y1: 30, label: '15–30 m（SL1）' },
    { y0: 30, y1: 45, label: '30–45 m（SL2）' },
    { y0: 45, y1: 60, label: '45–60 m（SL3）' },
  ];
  const oreSlabs = ORE_SLABS.map((sl) => addMesh(layers.ore, dippingSlab({
    x0: X0 + 0.12, x1: X1 - 0.12, y0: sl.y0, y1: sl.y1,
    dip: DIP, thickness: TH, inset: 0.12,
  }), M.ore, {
    type_code: 'ORE',
    name: `未开采矿体 ${sl.label}`,
    mining_state: 'unmined',
    mined: false,
    backfilled: false,
    source_tier: '【教】',
    textbook_ref: '§6.2 / §10.4.2.4，印145、252',
    dimensions: `走向80m × 厚${TH}m × 高${sl.y1 - sl.y0}m`,
    stage: '—',
    assumption: true,
  }, registry, { renderOrder: 2 }));

  // 围岩（可选图层，默认关闭）
  const rockGeo = prismAlongX([[-72, -10], [44, -10], [44, 92], [-72, 92]], -58, 58);
  addMesh(layers.rock, rockGeo, M.rock, {
    type_code: 'ROCK',
    name: '上/下盘围岩',
    source_tier: '【假】',
    textbook_ref: '图6-3；§10.4',
    dimensions: '展示范围：矿体厚度3~5倍',
    assumption: true,
  }, registry, { renderOrder: 0 });

  // ---------------- 巷道网络 ----------------
  const driftMeshes = SUBLEVELS.map(() => []);
  const cutParts = SUBLEVELS.map(() => []);
  const drawFaces = SUBLEVELS.map(() => []);
  const archDrift = archSection(4.0, DRIFT_H, 9);
  const drawMaterial = new THREE.LineBasicMaterial({
    color: 0xffcf89, clippingPlanes: M.driftActive.clippingPlanes,
  });
  const drawProfile = new THREE.BufferGeometry().setFromPoints(
    archDrift.map(([u, height]) => new THREE.Vector3(u, height, 0)),
  );
  const archHaul = archSection(4.2, 3.6, 9);
  const rectCross = rectSection(2.4, 2.8);

  // 分段运输平巷（沿走向，下盘）
  SUBLEVELS.forEach((sl, i) => {
    const g = hollowTunnel(
      [[-46, sl.y, HAUL_Z], [46, sl.y, HAUL_Z]],
      archHaul,
    );
    const mesh = addMesh(layers.drift, g, M.drift, {
      type_code: 'DRIFT',
      name: `分段运输平巷 ⑥（SL${i + 1}，标高 ${sl.y} m）`,
      source_tier: '【图】',
      textbook_ref: '图10-33⑥；§10.4.2.5，印253',
      elevation_z: sl.y,
      dimensions: '断面4.2×3.6m，沿走向',
      stage: '采准',
      connectivity: ['进路', '分段联络道'],
    }, registry);
    driftMeshes[i].push(mesh);

    // 回采巷道（进路）：垂直走向，自分段运输平巷伸至下盘→上盘
    const zEnd = dipZ(sl.y, DIP) + CUT_Z_REL;
    sl.xs.forEach((x, k) => {
      const dg = hollowTunnel([[x, sl.y, HAUL_Z], [x, sl.y, zEnd]], archDrift);
      const dm = addMesh(layers.drift, dg, M.drift, {
        type_code: 'STOPE-P',
        name: `回采巷道（进路）⑧ · SL${i + 1}-${k + 1}`,
        source_tier: '【图】',
        textbook_ref: '图10-33⑧；§10.4.2.4，印252',
        elevation_z: sl.y,
        dimensions: `断面4.0×3.3m，长${(zEnd - HAUL_Z).toFixed(1)}m`,
        stage: '采准/回采',
        connectivity: ['分段运输平巷 ⑥', '切割平巷 ⑨'], 
      }, registry);
      driftMeshes[i].push(dm);
      const drawFace = new THREE.Line(drawProfile, drawMaterial);
      drawFace.position.set(x, sl.y, zEnd - 1.4);
      layers.drift.add(drawFace);
      drawFaces[i].push(drawFace);
    });

    // 分段联络道 → 三条井筒
    for (const x of [-20, 8, 24]) {
      const cg = hollowTunnel([[x, sl.y, HAUL_Z], [x, sl.y, SHAFT_Z]], rectCross);
      const cm = addMesh(layers.drift, cg, M.drift, {
        type_code: 'DRIFT',
        name: `分段联络道（SL${i + 1}）`,
        source_tier: '【图】',
        textbook_ref: '图10-33⑦；§10.4.2.2',
        elevation_z: sl.y,
        dimensions: '2.4×2.8m',
        stage: '采准',
        connectivity: ['分段运输平巷', '溜井/设备井/风井'],
      }, registry);
      driftMeshes[i].push(cm);
    }

    // 切割平巷：沿矿块边界连通各进路端部
    const kg = hollowTunnel([[X0 + 1, sl.y, zEnd], [X1 - 1, sl.y, zEnd]], rectSection(3.0, 3.0));
    const cutDrift = addMesh(layers.drift, kg, M.drift, {
      type_code: 'DRIFT',
      name: `切割平巷 ⑨（SL${i + 1}）`,
      source_tier: '【图】',
      textbook_ref: '图10-33⑨；图10-40',
      elevation_z: sl.y,
      dimensions: '3.0×3.0m',
      stage: '切割',
      connectivity: ['切割天井', '进路端部'],
    }, registry);
    cutParts[i].push(cutDrift);
  });

  // ---------------- 井筒 ----------------
  // 矿石溜井 ③
  addMesh(layers.shaft, shaftCylinder(-20, SHAFT_Z, -6, 58, 1.5, 20), M.shaft, {
    type_code: 'PASS',
    name: '矿石溜井 ③',
    source_tier: '【图】',
    textbook_ref: '图10-33③；§10.4.2.2，印250-251',
    dimensions: 'φ3.0m，位于下盘崩落界限外',
    stage: '采准/放矿',
    connectivity: ['分段联络道', '阶段运输平巷'],
  }, registry);
  // 设备井 ④（3300×3800）
  addMesh(layers.shaft, shaftBox(8 - 1.65, 8 + 1.65, SHAFT_Z - 1.9, SHAFT_Z + 1.9, -5, 58), M.shaft, {
    type_code: 'PASS',
    name: '设备井 ④',
    source_tier: '【图】',
    textbook_ref: '图10-33④/图10-35',
    dimensions: '3.3×3.8m',
    stage: '采准',
    connectivity: ['设备井联络道'],
  }, registry);
  // 通风行人天井 ⑤
  addMesh(layers.shaft, shaftCylinder(24, SHAFT_Z, -5, 58, 1.25, 18), M.shaft, {
    type_code: 'PASS',
    name: '通风行人天井 ⑤',
    source_tier: '【图】',
    textbook_ref: '图10-33⑤',
    dimensions: 'φ2.5m',
    stage: '采准/通风',
    connectivity: ['分段联络道'],
  }, registry);

  // 上/下阶段沿脉运输巷（井筒联系）
  for (const [yy, tag] of [[-4, '下阶段'], [57, '上阶段']]) {
    addMesh(layers.drift, hollowTunnel([[-48, yy, SHAFT_Z], [48, yy, SHAFT_Z]], archHaul), M.drift, {
      type_code: 'DRIFT',
      name: `${tag}沿脉运输巷道`,
      source_tier: '【图】',
      textbook_ref: '图10-33①②',
      elevation_z: yy,
      dimensions: '断面4.2×3.6m',
      stage: '开拓',
      connectivity: ['溜井', '设备井', '风井'],
    }, registry);
  }

  // ---------------- 切割工程（每分段端部拉槽，贯穿该分段全高） ----------------
  SUBLEVELS.forEach((sl, i) => {
    const lastX = Math.max(...sl.xs);
    const yTop = sl.y + SL_HEIGHT;
    const zCut = dipZ(sl.y, DIP) + CUT_Z_REL;
    const cutGeo = dippingSlab({
      x0: X0 + 1, x1: X1 - 1, y0: sl.y, y1: yTop,
      dip: DIP, thickness: CUT_WIDTH, zBase: CUT_Z_REL,
    });
    const cutMesh = addMesh(layers.cut, cutGeo, M.cut, {
      type_code: 'DEV-CUT',
      name: `切割槽（SL${i + 1} 端部拉槽）`,
      source_tier: '【图】',
      textbook_ref: '图10-40，印254；§10.4.3',
      elevation_z: sl.y,
      dimensions: '宽5m（Z向），高15m，沿进路端部展开（示意）',
      stage: '切割',
      connectivity: ['切割天井', '切割平巷', '回采进路'],
    }, registry, { renderOrder: 6 });
    const outline = dashedOutline(cutGeo, 0xff6a3d, 0.64, 2.0, 1.3);
    layers.cut.add(outline);

    const raise = addMesh(layers.shaft, cylinderBetween(
      [lastX, sl.y, zCut], [lastX, yTop, dipZ(yTop, DIP) + CUT_Z_REL], 1.25, 16,
    ), M.shaft, {
      type_code: 'PASS',
      name: `切割天井 ⑩（SL${i + 1}）`,
      source_tier: '【图】',
      textbook_ref: '图10-33⑩；图10-40',
      elevation_z: sl.y,
      dimensions: 'φ2.5m，分段全高',
      stage: '切割',
      connectivity: ['切割平巷', '切割槽'],
    }, registry);
    cutParts[i].push(cutMesh, outline, raise);
  });

  // ---------------- 崩落围岩（覆岩） / 崩落矿石（已回采置换） ----------------
  const obGeo = dippingSlab({ x0: X0 + 0.25, x1: X1 - 0.25, y0: Y1, y1: Y1 + 28, dip: DIP, thickness: TH, inset: 0.25 });
  const overburden = addMesh(layers.muck, obGeo, M.cavedRock, {
    type_code: 'MUCK',
    name: '崩落围岩（覆岩，厚约2个分段高）',
    mining_state: 'caved_rock',
    mined: false,
    backfilled: false,
    source_tier: '【教】',
    textbook_ref: '§10.4.6，印260；图10-33',
    dimensions: '厚28m（展示值）',
    stage: '放矿',
    assumption: true,
  }, registry, { renderOrder: 4 });
  const obOutline = solidOutline(obGeo, 0x9a8a70, 0.35);
  layers.muck.add(obOutline);
  overburden.visible = false;
  obOutline.visible = false;

  // 只给当前分段保留作业空间。上部分段用接续实体表示已崩落区。
  const coverDrop = [0, 1.8, 3.6, 5.4];
  const caved = SUBLEVELS.map((sl, i) => {
    const activeStage = SUBLEVELS.length - i;
    const geologyByStage = coverDrop.map((drop, stage) => {
      if (stage < activeStage) return null;
      const y0 = sl.y + (stage === activeStage ? DRIFT_H : 0);
      const y1 = sl.y + SL_HEIGHT - (i === SUBLEVELS.length - 1 ? drop : 0);
      return dippingSlab({
        x0: X0 + 0.25, x1: X1 - 0.25, y0, y1, dip: DIP, thickness: TH, inset: 0.25,
      });
    });
    const mesh = addMesh(layers.muck, geologyByStage[activeStage], M.cavedOre, {
      type_code: 'MUCK',
      name: `崩落矿石 SL${i + 1}`,
      mining_state: 'caved_ore',
      mined: true,
      backfilled: false,
      source_tier: '【假】',
      textbook_ref: '§10.4.6；图10-37、图10-44',
      dimensions: '分段内崩落块体，顶分段接触覆盖岩',
      stage: '放矿',
      assumption: true,
    }, registry, { renderOrder: 5 });
    return { mesh, geologyByStage };
  });

  // ---------------- 残留体（脊部 / 端部） ----------------
  const residualBySL = SUBLEVELS.map(() => []);
  const endResidualBySL = SUBLEVELS.map(() => []);
  SUBLEVELS.forEach((sl, si) => {
    const z0 = dipZ(sl.y, DIP) - 9;
    const z1 = dipZ(sl.y, DIP) + CUT_Z_REL - 1.5;
    for (let i = 0; i < sl.xs.length - 1; i++) {
      const xa = sl.xs[i] + 2.0;
      const xb = sl.xs[i + 1] - 2.0;
      const poly = [[xa, sl.y], [xb, sl.y], [(xa + xb) / 2, sl.y + DRIFT_H]];
      const mesh = addMesh(layers.muck, wedgeAlongZ(poly, z0, z1), M.residual, {
        type_code: 'DRAW-RES',
        name: `脊部残留体（SL${si + 1}-${i + 1}）`,
        source_tier: '【图】',
        textbook_ref: '图10-44（J）；图10-37b',
        dimensions: '相邻进路之间的散体楔形（示意）',
        stage: '放矿',
        assumption: true,
      }, registry, { renderOrder: 6 });
      residualBySL[si].push(mesh);
    }
  });

  // 端部残留：每分段一处示意
  SUBLEVELS.forEach((sl, i) => {
    const zEnd = dipZ(sl.y, DIP) + CUT_Z_REL;
    const g = new THREE.BoxGeometry(4.0, DRIFT_H, 1.3);
    g.translate(sl.xs[Math.floor(sl.xs.length / 2)], sl.y + DRIFT_H / 2, zEnd - 0.65);
    const em = addMesh(layers.muck, g, M.residual, {
      type_code: 'DRAW-RES',
      name: `端部残留体（SL${i + 1} 示意）`,
      source_tier: '【图】',
      textbook_ref: '图10-44（Dp）',
      dimensions: '进路端面前方1.3m（示意）',
      stage: '放矿',
      assumption: true,
    }, registry, { renderOrder: 6 });
    em.visible = false;
    endResidualBySL[i].push(em);
  });

  // ---------------- LOD2：扇形中深孔 + 卸矿硐室 ----------------
  SUBLEVELS.forEach((sl, i) => {
    const zStart = dipZ(sl.y, DIP) - 6;
    const zEnd = dipZ(sl.y, DIP) + 6;
    const holes = fanHoles({
      baseX: sl.xs[Math.floor(sl.xs.length / 2)], baseY: sl.y + 1.7, baseZ: zStart,
      radius: 9.5, count: 9, spreadDeg: 118,
      rows: 4, rowStep: (zEnd - zStart) / 3,
    });
    holes.traverse((o) => { if (o.isLineSegments) o.userData.isLOD2 = true; });
    holes.visible = false;
    processFx.add(holes);
    fanGroups.push(holes);
  });
  // 溜井卸矿硐室
  const chamber = new THREE.BoxGeometry(7, 6, 7);
  chamber.translate(-20, 55, SHAFT_Z);
  const ch = new THREE.Mesh(chamber, M.drift);
  ch.material = M.drift;
  layers.lod2.add(ch);

  // ---------------- 标注 ----------------
  const labels = addLabelLayer(layers.labels, [
    { text: '矿体', sub: 'ORE · 急倾斜厚矿体', pos: [-46, 48, 8], tone: '#f0a05a', height: 4.6, pri: 96 },
    { text: '采准巷道网络', sub: '分段运输平巷⑥ + 回采进路⑧ · 端部眉线放矿', pos: [30, 44, 10], tone: '#9fd0ff', height: 3.6, pri: 92, phase: 'prep' },
    { text: '下盘井筒系统', sub: '溜井③ / 设备井④ / 风井⑤ · 均位于崩落界限外', pos: [2, 72, -48], tone: '#6fe3d8', height: 3.4, pri: 94, phase: 'dev' },
    { text: '切割槽', sub: '每分段端部拉槽 · 贯穿分段全高', pos: [44, 20, 14], tone: '#ff7a4f', height: 3.6, pri: 80, phase: 'cut' },
    { text: '崩落覆岩', sub: '厚≈2个分段高 · 随放矿下移', pos: [-20, 83, -14], tone: '#c9b48a', height: 4.0, pri: 88, phase: 'dynamic' },
    { text: '脊部残留', sub: '相邻进路之间 · 下分段可回收', pos: [-3, 53, 1], tone: '#ffa94d', height: 3.2, pri: 78, phase: 'dynamic' },
    { text: '端部残留', sub: '进路端壁前方', pos: [15, 53, 12], tone: '#ffa94d', height: 3.0, pri: 72, phase: 'dynamic' },
    { text: '上下分段交错 5m', sub: '= 进路间距之半（菱形）', pos: [-58, 24, 24], tone: '#ffd166', height: 3.6, pri: 90, phase: 'prep' },
  ]);
  const [coverLabel, ridgeLabel, endLabel] = labels.children.filter((label) => label.userData.phase === 'dynamic');

  // ---------------- 回采/状态 ----------------
  function setActiveSL(sl) {
    driftMeshes.forEach((arr, i) => {
      const mat = i === sl ? M.driftActive : M.drift;
      for (const m of arr) m.material = mat;
    });
  }

  function setStageState(stage, showDraw = true) {
    const active = stage === 0 ? -1 : SUBLEVELS.length - stage;
    caved.forEach(({ mesh, geologyByStage }, i) => {
      const geometry = geologyByStage[stage];
      mesh.visible = Boolean(geometry);
      if (geometry) mesh.geometry = geometry;
      const drawing = i === active;
      drawFaces[i].forEach((face) => { face.visible = drawing && showDraw; });
      residualBySL[i].forEach((mesh) => { mesh.visible = drawing; });
      endResidualBySL[i].forEach((mesh) => { mesh.visible = drawing; });
    });
    oreSlabs.forEach((m, i) => { m.visible = stage < oreSlabs.length - i; });
    overburden.visible = stage > 0;
    obOutline.visible = overburden.visible;
    const drop = coverDrop[stage];
    overburden.position.set(0, -drop, dipZ(-drop, DIP));
    obOutline.position.copy(overburden.position);
    coverLabel.visible = overburden.visible;
    coverLabel.position.set(-20, 83 - drop, -14 + overburden.position.z);
    ridgeLabel.visible = active >= 0;
    endLabel.visible = active >= 0;
    if (active >= 0) {
      const y = SUBLEVELS[active].y;
      ridgeLabel.position.set(-3, y + 5, dipZ(y, DIP) + 2);
      endLabel.position.set(13, y + 5, dipZ(y, DIP) + 14);
    }
    setActiveSL(active);
  }

  function update(p) {
    const stage = p <= 0.02 ? 0 : Math.min(3, Math.ceil(p * 3));
    setStageState(stage);
    cutParts.forEach((parts, i) => {
      parts.forEach((mesh) => { mesh.visible = stage < SUBLEVELS.length - i; });
    });
  }
  update(meta.defaults.progress);

  // 标注不参与裁剪；LOD2 默认关闭
  layers.lod2.visible = false;

  // ---------------- 过程演示：按教材工序顺序控制对象显隐 ----------------
  const registryMeshes = (re) => registry.objects.filter((o) => re.test(o.name)).map((o) => o.mesh);
  const processGroups = new Map([
    ['dev-stage', registryMeshes(/阶段沿脉运输巷道/)],
    ['dev-shafts', registryMeshes(/矿石溜井|设备井|通风行人天井/)],
    ...SUBLEVELS.flatMap((_, i) => [
      [`prep-sl${i + 1}`, driftMeshes[i]], [`cut-sl${i + 1}`, cutParts[i]],
    ]),
  ]);

  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、矿体回采', color: '#ffcb6b' },
    { id: 'post', name: '五、采场处理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '下盘井筒与阶段运输', stage: 0, fan: -1,
      desc: '在下盘崩落界限之外布置矿石溜井、设备井、通风行人天井，并形成上/下阶段沿脉运输巷道。',
      reveal: ['dev-stage', 'dev-shafts'] },
    { phase: 'prep', title: 'SL3 分段运输平巷、联络道与回采进路', stage: 0, fan: -1,
      desc: '第一分段（上部 SL3）：掘分段运输平巷，经联络道接井筒，向矿体掘进回采巷道（进路）。',
      reveal: ['prep-sl3'] },
    { phase: 'prep', title: 'SL2 分段运输平巷与回采进路', stage: 0, fan: -1,
      desc: '第二分段（中部 SL2）：进路相对 SL3 偏移 5 m（进路间距之半），形成菱形交错。',
      reveal: ['prep-sl2'] },
    { phase: 'prep', title: 'SL1 分段运输平巷与回采进路', stage: 0, fan: -1,
      desc: '第三分段（下部 SL1）：完成全部采准进路网络，各分段经溜井/设备井/天井联络。',
      reveal: ['prep-sl1'] },
    { phase: 'cut', title: 'SL3 端部切割', stage: 0, fan: -1,
      desc: '在 SL3 矿块端部掘切割平巷、切割天井并拉切割槽，为扇形中深孔提供自由面。',
      reveal: ['cut-sl3'] },
    { phase: 'cut', title: 'SL2 端部切割', stage: 0, fan: -1,
      desc: '按同一方式完成 SL2 端部切割；切割槽贯穿该分段全高。',
      reveal: ['cut-sl2'] },
    { phase: 'cut', title: 'SL1 端部切割', stage: 0, fan: -1,
      desc: '完成 SL1 端部切割，三个分段均具备崩矿初始条件。',
      reveal: ['cut-sl1'] },
    { phase: 'stope', title: 'SL3 凿岩：上向扇形中深孔', stage: 0, fan: 2, active: 2,
      desc: '在 SL3 回采进路内钻上向扇形中深孔，孔网沿进路方向布置。',
      reveal: [] },
    { phase: 'stope', title: 'SL3 崩矿与端部放矿', stage: 1, fan: -1, active: 2,
      desc: '逐排崩矿，铲运机在进路端部眉线放矿；覆岩随放矿下移，顶分段崩落矿石形成。',
      reveal: [] },
    { phase: 'stope', title: 'SL2 凿岩', stage: 1, fan: 1, active: 1,
      desc: '在 SL2 回采进路凿岩；上分段崩落矿石与覆岩已覆盖上部空区。',
      reveal: [] },
    { phase: 'stope', title: 'SL2 崩矿与放矿', stage: 2, fan: -1, active: 1,
      desc: 'SL2 崩矿放矿，崩落矿石置换该分段矿体；下分段可回收上分段进路间脊部残留。',
      reveal: [] },
    { phase: 'stope', title: 'SL1 凿岩', stage: 2, fan: 0, active: 0,
      desc: '在最下分段 SL1 进路凿岩，此时上部分段均已崩落。',
      reveal: [] },
    { phase: 'stope', title: 'SL1 崩矿与放矿', stage: 3, fan: -1, active: 0,
      desc: 'SL1 崩矿放矿，完成本矿块三个分段的回采；崩落矿石与覆岩占据已回采空间。',
      reveal: [] },
    { phase: 'post', title: '覆岩下放矿与低贫化控制', stage: 3, fan: -1, active: 0,
      desc: '根据放出矿石质量控制截止放矿；保留最低分段的脊部和端部残留示意。',
      reveal: [] },
    { phase: 'post', title: '下一分段循环', stage: 3, fan: -1, active: 0,
      desc: '本矿块回采结束，转入下一矿块/下一分段循环；已回采空间由崩落矿石与覆岩充填。',
      reveal: [] },
  ];


  const PHASE_ORDER = { dev: 0, prep: 1, cut: 2, stope: 3, post: 4, fill: 5 };
  function setLabelPhase(phase) {
    const cur = PHASE_ORDER[phase] ?? 99;
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (!p || p === 'dynamic') return;
      o.visible = p === 'always' || (PHASE_ORDER[p] ?? 0) <= cur;
    });
  }

  function applyProcess(index) {
    const i = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[i];
    const visible = new Set();
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((key) => visible.add(key));
    for (const [key, objs] of processGroups) {
      for (const o of objs) o.visible = visible.has(key);
    }
    fanGroups.forEach((g, si) => { g.visible = step.fan === si; });
    setStageState(step.stage, step.fan < 0);
    cutParts.forEach((parts, i) => {
      if (step.stage >= SUBLEVELS.length - i) parts.forEach((mesh) => { mesh.visible = false; });
    });
    if (step.active !== undefined) setActiveSL(step.active);
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    for (const objs of processGroups.values()) for (const o of objs) o.visible = true;
    fanGroups.forEach((g) => { g.visible = false; });
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  return {
    group, layers, registry, update,
    meta,
    process: {
      phases, steps,
      apply: applyProcess,
      reset: resetProcess,
      stepDuration: 2.6,
    },
    stageIndex: (p) => (p <= 0.02 ? 0 : Math.min(3, Math.ceil(p * 3))),
    bounds: new THREE.Box3(new THREE.Vector3(-60, -10, -75), new THREE.Vector3(60, 92, 45)),
  };
}
