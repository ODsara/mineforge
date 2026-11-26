// A-2 房柱采矿法（Room and Pillar Mining）
// 依据：教材B §11.3（印279–282）、图11-5/11-7/11-8；交付成果04 S-2档案、09§五
// 展示参数：近水平矿体（展示简化）；矿房宽16/12m、房长20m；矿柱4–6m；
//           拉底3m + 挑顶7m；上山/切割平巷/联络平巷/溜井/电耙硐室。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, shaftCylinder, ensurePlanarUV, rectSection,
  dashedOutline, solidOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'A-2',
  name: '房柱采矿法',
  en: 'Room and Pillar Mining',
  category: '空场采矿法 · 房柱采矿法（表6-1 组2 / 典型方法2）',
  refs: '教材B §11.3，印279–282 · 图11-5（三剖面）、图11-7（护顶矿柱）、图11-8',
  tier: 'A 级资料（图11-5 全构件标注）',
  summary:
    '在矿体内按一定间距留设规则矿柱，矿房与矿柱相间布置；矿房沿倾斜方向布置，' +
    '以电耙运搬，上山沿矿房中心线贴底板，切割平巷在矿房下部边界。回采先拉底、后挑顶，' +
    '顶板靠规则矿柱与锚杆维护。盘区矿柱将矿体划分为盘区，是房柱法最典型的"空场靠柱"结构。',
  teaching: [
    '空场法最简结构：矿房靠规则矿柱支撑顶板，矿柱就是留下的矿石。',
    '矿房沿倾斜布置、上山贴底板、切割平巷在下部边界、溜井通底板运输巷。',
    '先拉底 3m、后挑顶 7m；矿石经拉底层电耙至溜井。',
    '盘区矿柱分隔盘区，规则矿柱间距/尺寸按教材区间取展示值。',
  ],
  stages: ['采准', '拉底', '挑顶/矿房回采', '矿柱与顶板管理'],
  params: [
    ['矿体产状', '近水平（展示简化）', '教材为缓倾斜–倾斜矿体；三维采用近水平以展示房柱网格'],
    ['矿体厚度', '10 m', '中厚；拉底3m+挑顶7m'],
    ['走向长度 / 倾斜方向', '60 m / 54 m', '展示值'],
    ['矿房宽度', '16 / 12 m', '教材 8–20 m'],
    ['矿房长度（倾斜方向）', '20 m', '教材矿房长/运距 40–60 m；展示取20m'],
    ['规则矿柱', '4–6 m 方形', '教材直径3–7m、间距5–8m；展示取方形柱'],
    ['盘区矿柱', '4–6 m 边界带', '连续盘区矿柱'],
    ['拉底 / 挑顶', '3 m / 7 m', '拉底2.5–3m；挑顶5–10m'],
    ['上山 / 切割平巷', '3×3 m', '上山贴底板；切割平巷在矿房下部边界'],
    ['溜井 / 电耙硐室', 'φ2 m / 5×3×5 m', '图11-5②④'],
  ],
  assumptions: [
    '矿体近水平为展示简化；教材为缓倾斜–倾斜矿体（【假】）。',
    '六间矿房以联络带相通，交汇处保留方形规则矿柱，边界保留连续盘区矿柱【假】。',
    '顶板锚杆、护顶矿柱仅以标签说明，未做个体支护符号（LOD2 展示项）。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体',
    drift: '巷道（中空）',
    stope: '已回采空间',
    pillar: '矿柱（未开采）',
    shaft: '井筒',
    lod2: 'LOD2 辅助细节',
    labels: '标注',
  },
  states: ['unmined', 'mined_out', 'excavation'],
  camera: { pos: [82, 40, 110], target: [0, 5, -10] },
  defaults: { cut: 0.0, progress: 0.0 },
};

const X0 = -30, X1 = 30, Y0 = 0, Y1 = 10, Z0 = -42, Z1 = 12;
const ROOMS_X = [[-26, -10], [-6, 10], [14, 26]];
const ROOMS_Z = [[-38, -18], [-14, 6]];
const CUT_H = 3;
const PILLAR_X = [[-10, -6], [10, 14]];
const PILLAR_Z = [-18, -14];
const CENTERLINES = ROOMS_X.map(([x0, x1]) => (x0 + x1) / 2);

function roomShape(xi, zi) {
  const [x0, x1] = ROOMS_X[xi];
  const [z0, z1] = ROOMS_Z[zi];
  const xMin = xi === 0 ? x0 : x0 - 2;
  const xMax = xi === ROOMS_X.length - 1 ? x1 : x1 + 2;
  const zMin = zi === 0 ? z0 : z0 - 2;
  const zMax = zi === ROOMS_Z.length - 1 ? z1 : z1 + 2;
  const footprint = [
    [x0, zMin], [x1, zMin], [x1, z0], [xMax, z0],
    [xMax, z1], [x1, z1], [x1, zMax], [x0, zMax],
    [x0, z1], [xMin, z1], [xMin, z0], [x0, z0],
  ];
  const distinct = footprint.filter(([x, z], i) => {
    const previous = footprint[(i + footprint.length - 1) % footprint.length];
    return x !== previous[0] || z !== previous[1];
  });
  return new THREE.Shape(distinct.map(([x, z]) => new THREE.Vector2(x, -z)));
}

function roomGeometry(shape, y, height) {
  const geo = height > 0
    ? new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false })
    : new THREE.ShapeGeometry(shape).toNonIndexed();
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, y, 0);
  geo.deleteAttribute('uv');
  return ensurePlanarUV(geo);
}

export function build(M) {
  const registry = createRegistry('A-2');
  const { group, layers } = createLayerGroups();

  // ---------------- 矿体包络（虚线） ----------------
  const envelope = new THREE.BoxGeometry(X1 - X0, Y1 - Y0, Z1 - Z0);
  envelope.translate((X0 + X1) / 2, (Y0 + Y1) / 2, (Z0 + Z1) / 2);
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.42, 2.2, 1.8));

  // ---------------- 规则/盘区矿柱（实体，未开采） ----------------
  function addPillar(x0, x1, z0, z1, name, dimensions) {
    const geo = new THREE.BoxGeometry(x1 - x0, Y1 - Y0, z1 - z0).toNonIndexed();
    geo.translate((x0 + x1) / 2, (Y0 + Y1) / 2, (z0 + z1) / 2);
    geo.deleteAttribute('uv');
    ensurePlanarUV(geo);
    addMesh(layers.pillar, geo, M.pillar, {
      type_code: 'PILLAR-R', name, source_tier: '【图】',
      textbook_ref: '图11-5⑦；§11.3.1', dimensions, stage: '—', assumption: true,
    }, registry);
    layers.pillar.add(solidOutline(geo, 0xd08a5a, 0.25));
  }

  addPillar(X0, -26, Z0, Z1, '西侧盘区矿柱', '宽4m，全厚');
  addPillar(26, X1, Z0, Z1, '东侧盘区矿柱', '宽4m，全厚');
  addPillar(-26, 26, Z0, -38, '下部盘区矿柱', '宽4m，全厚');
  addPillar(-26, 26, 6, Z1, '上部盘区矿柱', '宽6m，全厚');
  PILLAR_X.forEach(([x0, x1], i) => {
    addPillar(x0, x1, ...PILLAR_Z, `规则矿柱 ${i + 1}`, '4m × 4m，全厚');
  });

  // ---------------- 矿房：底部3m拉底块 + 上部7m挑顶块 + 暗色底板 ----------------
  const roomBottoms = [];
  const roomTops = [];
  const roomFloors = [];
  ROOMS_X.forEach(([x0, x1], xi) => {
    ROOMS_Z.forEach(([z0, z1], zi) => {
      const w = x1 - x0, d = z1 - z0;
      const shape = roomShape(xi, zi);
      const tagBase = { source_tier: '【图】', textbook_ref: '图11-5；§11.3.1', stage: '回采', assumption: true };

      // 拉底块 0–3m
      const bg = roomGeometry(shape, Y0, CUT_H);
      const bGroup = new THREE.Group();
      const bMesh = new THREE.Mesh(bg, M.ore);
      bGroup.add(bMesh);
      bGroup.add(solidOutline(bg, 0xb06034, 0.22));
      layers.ore.add(bGroup);
      registry.tag(bMesh, {
        type_code: 'ORE', name: `矿房${xi * ROOMS_Z.length + zi + 1} 拉底矿体`,
        mining_state: 'unmined', mined: false, backfilled: false,
        ...tagBase, dimensions: `${w}m × 3m × ${d}m`,
      });
      roomBottoms.push(bGroup);

      // 挑顶块 3–10m
      const tg = roomGeometry(shape, Y0 + CUT_H, Y1 - Y0 - CUT_H);
      const tGroup = new THREE.Group();
      const tMesh = new THREE.Mesh(tg, M.ore);
      tGroup.add(tMesh);
      tGroup.add(solidOutline(tg, 0xb06034, 0.22));
      layers.ore.add(tGroup);
      registry.tag(tMesh, {
        type_code: 'ORE', name: `矿房${xi * ROOMS_Z.length + zi + 1} 挑顶矿体`,
        mining_state: 'unmined', mined: false, backfilled: false,
        ...tagBase, dimensions: `${w}m × 7m × ${d}m`,
      });
      roomTops.push(tGroup);

      // 暗色底板 + 虚线边界（拉底后露出）
      const floorGeo = roomGeometry(shape, Y0 + 0.04, 0);
      const floor = addMesh(layers.stope, floorGeo, M.stopeFloor, {
        type_code: 'STOPE-A',
        name: `矿房${xi * ROOMS_Z.length + zi + 1} 采空区底板`,
        mining_state: 'mined_out', mined: true, backfilled: false,
        source_tier: '【推】', textbook_ref: '图11-5；§11.3.1',
        dimensions: `${w}m × ${d}m`,
        stage: '回采',
      }, registry, { renderOrder: 6 });
      roomFloors.push(floor);
    });
  });

  // ---------------- 巷道系统 ----------------
  const archHaul = archSection(4.2, 3.6, 9);
  const archSmall = archSection(3.0, 3.0, 9);
  const cutZ = -38;
  const chamberZ = -40;
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-32, -6, chamberZ], [32, -6, chamberZ]], archHaul,
  ), M.driftXray, {
    type_code: 'DRIFT', name: '阶段运输巷道 ①', source_tier: '【图】',
    textbook_ref: '图11-5①；§11.3.1', elevation_z: -6, dimensions: '断面4.2×3.6m，沿走向',
    stage: '采准', connectivity: ['放矿溜井'],
  }, registry);

  const raises = CENTERLINES.map((x, i) => addMesh(layers.drift, hollowTunnel(
    [[x, Y0, cutZ], [x, Y0, 6]], archSmall,
  ), M.driftXray, {
    type_code: 'DRIFT', name: `上山 ⑤（第${i + 1}列矿房）`, source_tier: '【图】',
    textbook_ref: '图11-5⑤；§11.3.1', elevation_z: Y0, dimensions: '断面3.0×3.0m，沿中心线贴底板',
    stage: '采准', connectivity: ['切割平巷', '联络平巷'],
  }, registry));

  const cutDrift = addMesh(layers.drift, hollowTunnel(
    [[-26, Y0, cutZ], [26, Y0, cutZ]], archSmall,
  ), M.driftXray, {
    type_code: 'DRIFT', name: '切割平巷 ③（矿房下部边界）', source_tier: '【图】',
    textbook_ref: '图11-5③；§11.3.1', elevation_z: Y0, dimensions: '断面3.0×3.0m，沿走向',
    stage: '采准', connectivity: ['上山', '相邻矿房', '电耙硐室'],
  }, registry);

  const connDrift = addMesh(layers.drift, hollowTunnel(
    [[CENTERLINES[0], Y0, 4], [CENTERLINES.at(-1), Y0, 4]], archSmall,
  ), M.driftXray, {
    type_code: 'DRIFT', name: '联络平巷 ⑥', source_tier: '【图】',
    textbook_ref: '图11-5⑥；§11.3.1', elevation_z: Y0, dimensions: '断面3.0×3.0m',
    stage: '采准', connectivity: ['上山', '矿房'],
  }, registry);

  const passX = CENTERLINES[0];
  const orePass = addMesh(layers.shaft, shaftCylinder(passX, chamberZ, -3.1, Y0 + 0.15, 1, 18), M.xray, {
    type_code: 'PASS', name: '放矿溜井 ②', source_tier: '【图】',
    textbook_ref: '图11-5②；§11.3.1', dimensions: 'φ2.0m，电耙硐室→底板运输巷',
    stage: '采准', connectivity: ['阶段运输巷道', '电耙硐室'],
  }, registry);

  const chamber = addMesh(layers.drift, hollowTunnel(
    [[passX, Y0, -42], [passX, Y0, -37]], rectSection(5, 3),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '电耙硐室 ④', source_tier: '【图】',
    textbook_ref: '图11-5④；§11.3.1', elevation_z: Y0, dimensions: '5×3×5m',
    stage: '采准', connectivity: ['放矿溜井', '切割平巷'],
  }, registry);

  // ---------------- 过程演示 ----------------
  const prepGroups = [...raises, cutDrift, connDrift, orePass, chamber];
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、矿房回采', color: '#ffcb6b' },
    { id: 'post', name: '五、顶板与矿柱管理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷道', desc: '掘阶段运输巷道①，形成矿块外部运输系统。', reveal: ['dev'], cut: false, mined: 0 },
    { phase: 'prep', title: '上山、切割平巷、联络平巷、溜井与电耙硐室', desc: '沿矿房中心线贴底板掘上山⑤，掘切割平巷③/联络平巷⑥，自运输巷掘放矿溜井②与电耙硐室④。', reveal: ['prep'], cut: false, mined: 0 },
    { phase: 'cut', title: '拉底（3 m）', desc: '自切割平巷与上山交口起，按 3m 高拉底，贯通矿房底部，形成初始回采空间与电耙道。', reveal: [], cut: true, mined: 0 },
  ];
  for (let i = 0; i < roomTops.length; i++) {
    steps.push({
      phase: 'stope', title: `矿房 ${i + 1} 挑顶回采`, cut: true, mined: i + 1,
      desc: `矿房 ${i + 1} 挑顶 7m，矿石经拉底层电耙至溜井②；规则矿柱与盘区矿柱保持。`,
      reveal: [],
    });
  }
  steps.push({
    phase: 'post', title: '顶板管理与矿柱管理', cut: true, mined: roomTops.length,
    desc: '顶板采用锚杆/护顶矿柱维护；规则矿柱与盘区矿柱永久保留，采空区靠矿柱自稳。',
    reveal: [],
  });

  function setMining(roomCount, cutDone, ghostTops = false) {
    roomBottoms.forEach((g) => { g.visible = !cutDone; });
    roomFloors.forEach((floor) => { floor.visible = cutDone; });
    roomTops.forEach((g, i) => {
      g.visible = i >= roomCount;
      g.children.forEach((c) => {
        if (!c.isMesh) return;
        c.material = ghostTops ? M.oreGhost : M.ore;
      });
    });
  }

  function update(p) {
    if (p <= 0.05) { setMining(0, false); return; }
    if (p <= 0.2) { setMining(0, true, true); return; }
    const n = Math.min(roomTops.length, Math.ceil(((p - 0.2) / 0.8) * roomTops.length));
    setMining(n, true);
  }

  const LABEL_VIS = {
    dev: ['dev', 'prep'],
    prep: ['prep', 'cut'],
    cut: ['cut'],
    stope: ['stope', 'post'],
  };
  function setLabelPhase(phase) {
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (!p || p === 'dynamic') return;
      o.visible = p === 'always' || (LABEL_VIS[p] || []).includes(phase);
    });
  }

  function applyProcess(index) {
    const i = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[i];
    const visible = new Set();
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((key) => visible.add(key));
    haulage.visible = visible.has('dev');
    prepGroups.forEach((o) => { o.visible = visible.has('prep'); });
    setMining(step.mined || 0, step.cut === true, step.phase === 'cut');
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true;
    prepGroups.forEach((o) => { o.visible = true; });
    setMining(0, false);
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体（房柱法）', sub: '近水平展示简化 · 厚10m', pos: [-36, 13, -15], tone: '#f0a05a', height: 4.2, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '底板下方', pos: [-28, -5, -44], tone: '#9fd0ff', height: 3, pri: 80, phase: 'dev' },
    { text: '盘区矿柱', sub: '边界连续矿柱', pos: [-33, 14, -22], tone: '#d0a070', height: 3.2, pri: 88, phase: 'always' },
    { text: '规则矿柱 ⑦', sub: '4m × 4m 方柱', pos: [12, 13, -16], tone: '#d0a070', height: 3.2, pri: 86, phase: 'always' },
    { text: '上山 ⑤', sub: '沿矿房中心线贴底板', pos: [-18, 3, 16], tone: '#9fd0ff', height: 3.2, pri: 84, phase: 'prep' },
    { text: '切割平巷 ③', sub: '矿房下部边界', pos: [-20, -1, -46], tone: '#9fd0ff', height: 3.0, pri: 80, phase: 'prep' },
    { text: '放矿溜井 ②', sub: '电耙硐室→运输巷', pos: [-24, -4, -40], tone: '#6fe3d8', height: 3.0, pri: 78, phase: 'prep' },
    { text: '电耙硐室 ④', sub: '下部矿柱内', pos: [-10, 0, -30], tone: '#9fd0ff', height: 3.0, pri: 76, phase: 'prep' },
    { text: '拉底 3m', sub: '贯通矿房底部 · 电耙道', pos: [-2, 2, 6], tone: '#ff7a4f', height: 3.2, pri: 90, phase: 'cut' },
    { text: '矿房/采空区', sub: '挑顶后靠矿柱支撑', pos: [2, 8, -8], tone: '#ffcb6b', height: 3.6, pri: 92, phase: 'stope' },
  ]);

  update(meta.defaults.progress);

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.4 },
    stageIndex: (p) => (p <= 0.05 ? 0 : p <= 0.2 ? 1 : p < 1 ? 2 : 3),
    progressText: (p) => (p <= 0.05 ? '采准' : p <= 0.2 ? '拉底' : p < 1 ? '挑顶/矿房回采' : '矿柱与顶板管理'),
    bounds: new THREE.Box3(new THREE.Vector3(-38, -8, -48), new THREE.Vector3(38, 16, 18)),
  };
}
