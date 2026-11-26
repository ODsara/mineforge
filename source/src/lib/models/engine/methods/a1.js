// A-1 全面采矿法
// 依据：教材B §11.2（印277–279）、图11-1/11-2/11-3/11-4；交付成果04 A-1档案、09§三
// 展示参数：缓倾斜薄矿体 12°/4m；走向72m、倾斜方向36m；全厚一次回采；
//           沿走向分条推进，留不规则矿柱与废石垛，电耙出矿。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, gentlyDippingSlab, ensurePlanarUV, cylinderBetween,
  dashedOutline, solidOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'A-1',
  name: '全面采矿法',
  en: 'Comprehensive Mining Method',
  category: '空场采矿法 · 全面采矿法（表6-1 组2 / 典型方法1）',
  refs: '教材B §11.2，印277–279 · 图11-1（三视图）、图11-2（矿柱布置）、图11-3（电耙出矿）',
  tier: 'A 级资料（图11-1 全构件标注）',
  summary:
    '在缓倾斜薄矿体中，沿走向将矿体全厚一次采出，工作面沿走向连续推进；' +
    '采空区靠不规则矿柱、废石垛和顶板管理维持稳定，矿石经电耙或溜井运出。' +
    '与房柱法不同：不划分规则矿房，工作面是一条连续推进的长工作面。',
  teaching: [
    '全厚一次回采：不分层、不划分矿房，工作面沿走向连续推进。',
    '缓倾斜薄矿体：顶板暴露面积大，靠不规则矿柱 + 废石垛 + 锚杆管理。',
    '矿石用电耙沿底板耙至溜井，再经阶段运输巷运出。',
    '采空区不充填（空场法），靠矿柱自稳；地表允许塌陷时也可后续处理。',
  ],
  stages: ['采准', '切割', '沿走向推进', '矿柱与顶板管理'],
  params: [
    ['矿体倾角', '12°', '缓倾斜薄矿体（展示简化）【假】'],
    ['矿体厚度', '4 m', '薄矿体；全厚一次回采【假】'],
    ['走向长度 / 倾斜方向', '72 m / 36 m', '展示值【假】'],
    ['回采条带宽度', '9 m', '沿走向分条推进；8 条【假】'],
    ['上下阶段巷道高差', '15 m', '展示值【假】'],
    ['不规则矿柱', '2–3 m × 3–4 m', '留设于采空区，间距不等【图】'],
    ['废石垛', '4 m × 6 m，高 2 m', '采空区废石充填垛【图】'],
    ['切割平巷', '3.0 × 3.0 m', '沿走向，位于矿体下边界【图】'],
    ['上山 / 天井', '2.4 × 2.4 m', '两端联络阶段运输巷【图】'],
    ['阶段运输巷 / 回风巷', '4.2×3.4 m / 3.2×3.0 m', '下盘脉外【图】'],
    ['放矿溜井', 'φ2.0 m', '两个溜井，沿走向间距 30 m【假】'],
  ],
  assumptions: [
    '矿体倾角取 12° 展示；教材为缓倾斜（5–30°）【假】。',
    '回采条带按 9 m 等宽表达；实际推进步距随凿岩/耙运设备变化【假】。',
    '保留三个不规则矿柱，平面形状及位置为展示值【假】。',
    '顶板锚杆、护顶措施仅以标签说明，未做个体支护符号（LOD2）。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'muck', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '矿柱（未开采）', muck: '废石垛', shaft: '井筒',
    lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'excavation'],
  camera: { pos: [92, 48, 92], target: [0, 5, 0] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 12, TH = 4;
const X0 = -36, X1 = 36, Z0 = -18, Z1 = 18;
const YTOP = 10;
const SLICES = 8;
const SLICE_W = (X1 - X0) / SLICES;

function seamTop(z) { return YTOP - z * Math.tan(DIP * Math.PI / 180); }

function pillarGeometry(footprint) {
  const shape = new THREE.Shape(footprint.map(([x, z]) => new THREE.Vector2(x, -z)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: TH, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  const vertices = geo.getAttribute('position');
  for (let i = 0; i < vertices.count; i++) {
    vertices.setY(i, vertices.getY(i) + seamTop(vertices.getZ(i)) - TH);
  }
  geo.computeVertexNormals();
  geo.deleteAttribute('uv');
  return ensurePlanarUV(geo);
}

export function build(M) {
  const registry = createRegistry('A-1');
  const { group, layers } = createLayerGroups();

  // ---------------- 矿体包络 ----------------
  const envelope = gentlyDippingSlab({
    x0: X0, x1: X1, z0: Z0, z1: Z1, yTop: YTOP, thickness: TH, dip: DIP,
  });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // ---------------- 8 条回采条带 + 采空区底板 ----------------
  const slices = [];
  const floors = [];
  for (let i = 0; i < SLICES; i++) {
    const sx0 = X0 + i * SLICE_W;
    const sx1 = sx0 + SLICE_W;
    const g = new THREE.Group();
    const geo = gentlyDippingSlab({
      x0: sx0 + 0.05, x1: sx1 - 0.05, z0: Z0 + 0.05, z1: Z1 - 0.05,
      yTop: YTOP, thickness: TH, dip: DIP,
    });
    const mesh = new THREE.Mesh(geo, M.oreSolid);
    g.add(mesh);
    g.add(solidOutline(geo, 0xc97a46, 0.28));
    layers.ore.add(g);
    registry.tag(mesh, {
      type_code: 'ORE', name: `未采矿体（第${i + 1}条带）`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【图】', textbook_ref: '图11-1；§11.2',
      dimensions: `走向9m × 厚4m × 倾斜36m`,
      stage: '回采', assumption: true,
    });
    slices.push(g);

    const floorGeo = gentlyDippingSlab({
      x0: sx0 + 0.1, x1: sx1 - 0.1, z0: Z0 + 0.1, z1: Z1 - 0.1,
      yTop: YTOP - TH, thickness: 0.12, dip: DIP,
    });
    const floor = new THREE.Mesh(floorGeo, M.stopeFloor);
    floor.visible = false;
    layers.stope.add(floor);
    registry.tag(floor, {
      type_code: 'STOPE-A', name: `采空区底板（第${i + 1}条带）`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【推】', textbook_ref: '图11-1；§11.2',
      dimensions: '9m × 36m', stage: '回采',
    }, registry, { renderOrder: 6 });
    floors.push(floor);
  }

  // 矿柱在所在条带采出后才从完整矿体中显露。
  const pillars = [
    [[-22,-9], [-19.8,-9.4], [-19,-7.7], [-19.4,-5.7], [-21.6,-5.4], [-22.2,-7.1]],
    [[0.8,6], [2.6,6.3], [3.7,7.6], [2.9,10], [1.1,9.6], [0.6,8.1]],
    [[20,-10.4], [22.4,-11], [23.1,-9.1], [22.4,-7.2], [20.4,-7.4], [19.8,-8.8]],
  ].map((footprint, i) => {
    const geo = pillarGeometry(footprint);
    const assembly = new THREE.Group();
    layers.pillar.add(assembly);
    addMesh(assembly, geo, M.pillar, {
      type_code: 'PILLAR-R', name: `不规则矿柱 ${i + 1}`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【图】', textbook_ref: '图11-2；§11.2',
      dimensions: '约 3m × 4m，全厚', stage: '回采', assumption: true,
    }, registry);
    assembly.add(solidOutline(geo, 0xd08a5a, 0.35));
    const slice = Math.floor((footprint[0][0] - X0) / SLICE_W);
    return { assembly, slice };
  });

  // ---------------- 废石垛 ----------------
  const waste1Geo = gentlyDippingSlab({
    x0: -33, x1: -29, z0: 8, z1: 14, yTop: YTOP - TH + 2, thickness: 2, dip: DIP,
  });
  const waste1 = new THREE.Mesh(waste1Geo, M.cavedRock);
  waste1.visible = false;
  layers.muck.add(waste1);
  registry.tag(waste1, {
    type_code: 'MUCK', name: '废石垛①',
    mining_state: 'caved_rock', mined: false, backfilled: false,
    source_tier: '【图】', textbook_ref: '图11-2；§11.2',
    dimensions: '4m × 6m × 高2m', stage: '回采', assumption: true,
  });
  const waste2Geo = gentlyDippingSlab({
    x0: 12, x1: 16, z0: -14, z1: -8, yTop: YTOP - TH + 2, thickness: 2, dip: DIP,
  });
  const waste2 = new THREE.Mesh(waste2Geo, M.cavedRock);
  waste2.visible = false;
  layers.muck.add(waste2);
  registry.tag(waste2, {
    type_code: 'MUCK', name: '废石垛②',
    mining_state: 'caved_rock', mined: false, backfilled: false,
    source_tier: '【图】', textbook_ref: '图11-2；§11.2',
    dimensions: '4m × 6m × 高2m', stage: '回采', assumption: true,
  });

  // ---------------- 采准巷道 ----------------
  const haulZ = 24;
  const cutZ = 18.8;
  const cutY = seamTop(Z1) - TH;
  const airwayZ = -21;
  const airwayY = 11;
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-42, -4, haulZ], [42, -4, haulZ]], archSection(4.2, 3.4, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道',
    source_tier: '【图】', textbook_ref: '图11-1；§11.2',
    elevation_z: -4, dimensions: '断面4.2×3.4m，下盘脉外',
    stage: '采准', connectivity: ['放矿溜井', '上山'],
  }, registry);

  const airway = addMesh(layers.drift, hollowTunnel(
    [[-42, airwayY, airwayZ], [42, airwayY, airwayZ]], archSection(3.2, 3.0, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段回风巷道',
    source_tier: '【图】', textbook_ref: '图11-1；§11.2',
    elevation_z: airwayY, dimensions: '断面3.2×3.0m',
    stage: '采准', connectivity: ['上山'],
  }, registry);

  const rises = [-37, 37].map((x, i) => addMesh(layers.shaft, hollowTunnel(
    [[x, -4, haulZ], [x, cutY, cutZ], [x, seamTop(Z0) - TH, Z0], [x, airwayY, airwayZ]],
    archSection(2.4, 2.4, 9),
  ), M.driftThin, {
    type_code: 'PASS', name: `上山 ${i + 1}`,
    source_tier: '【图】', textbook_ref: '图11-1；§11.2',
    dimensions: '2.4×2.4m', stage: '采准',
    connectivity: ['阶段运输巷道', '切割平巷', '阶段回风巷道'],
  }, registry));

  const cutDrift = addMesh(layers.drift, hollowTunnel(
    [[-38, cutY, cutZ], [38, cutY, cutZ]], archSection(3.0, 3.0, 9),
  ), M.driftThin, {
    type_code: 'DRIFT', name: '切割平巷',
    source_tier: '【图】', textbook_ref: '图11-1；§11.2',
    elevation_z: cutY, dimensions: '断面3.0×3.0m，沿走向',
    stage: '切割', connectivity: ['上山', '放矿溜井', '工作面'],
  }, registry);

  const orePasses = [-9, 21].map((x, i) => addMesh(layers.shaft, cylinderBetween(
    [x, -1.2, haulZ], [x, cutY + 0.7, cutZ], 1.0, 18,
  ), M.xray, {
    type_code: 'PASS', name: `放矿溜井 ${i + 1}`,
    source_tier: '【图】', textbook_ref: '图11-1；§11.2',
    dimensions: 'φ2.0m', stage: '采准',
    connectivity: ['阶段运输巷道', '切割平巷'],
  }, registry));

  // ---------------- 工作面标记 ----------------
  const faceGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, seamTop(Z0) + 0.15, Z0),
    new THREE.Vector3(0, seamTop(Z1) + 0.15, Z1),
  ]);
  const faceLine = new THREE.Line(faceGeo, new THREE.LineBasicMaterial({
    color: 0xffcb6b, transparent: true, opacity: 0.95,
  }));
  faceLine.visible = false;
  layers.stope.add(faceLine);

  let mined = 0;
  function setMined(n) {
    mined = Math.max(0, Math.min(SLICES, n));
    slices.forEach((g, i) => { g.visible = i < SLICES - mined; });
    floors.forEach((f, i) => { f.visible = i >= SLICES - mined; });
    pillars.forEach(({ assembly, slice }) => { assembly.visible = slice >= SLICES - mined; });
    waste2.visible = mined >= 3;
    waste1.visible = mined >= 8;
    const fx = mined === 0 ? X1 : X1 - mined * SLICE_W;
    faceLine.visible = mined > 0 && mined < SLICES;
    faceLine.position.x = Math.min(X1, fx);
  }

  function update(p) {
    if (p <= 0.08) setMined(0);
    else if (p <= 0.18) setMined(1);
    else {
      const n = 1 + Math.ceil(((p - 0.18) / 0.82) * (SLICES - 1));
      setMined(n);
    }
    haulage.visible = true;
    airway.visible = true;
    rises.forEach((r) => { r.visible = true; });
    cutDrift.visible = true;
    orePasses.forEach((pass) => { pass.visible = true; });
  }

  // ---------------- 过程演示 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、沿走向推进', color: '#ffcb6b' },
    { id: 'post', name: '五、矿柱与顶板管理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷道与回风巷道', mined: 0, reveal: ['dev'],
      desc: '掘下盘阶段运输巷道与阶段回风巷道，形成矿块外部运输、通风系统。' },
    { phase: 'prep', title: '两端上山/天井', mined: 0, reveal: ['prep1'],
      desc: '在矿块两端掘上山/天井，自阶段运输巷通达矿体底板，作为行人、通风与切割通道。' },
    { phase: 'prep', title: '切割平巷与放矿溜井', mined: 0, reveal: ['prep2'],
      desc: '沿矿体下边界掘切割平巷，掘放矿溜井，形成初始回采工作面的出矿条件。' },
    { phase: 'cut', title: '初始工作面（第1条带）', mined: 1, reveal: ['cut'],
      desc: '自切割平巷拉开初始工作面，全厚回采第1条带；采空区底板显露，后续随工作面推进保留矿柱并码放废石垛。' },
  ];
  for (let i = 2; i <= SLICES; i++) {
    steps.push({
      phase: 'stope', title: `沿走向推进（第${i}条带）`, mined: i, reveal: [],
      desc: `工作面沿走向推进，全厚回采第${i}条带；矿石经底板耙运至溜井，采空区靠不规则矿柱/废石垛维护。`,
    });
  }
  steps.push({
    phase: 'post', title: '矿柱与顶板管理', mined: SLICES, reveal: ['post'],
    desc: '8 条带回采完毕；不规则矿柱与废石垛留在采空区，顶板靠矿柱和锚杆管理；空场暂不处理。',
  });

  const LABEL_VIS = {
    dev: ['dev', 'prep'],
    prep: ['prep', 'cut'],
    cut: ['cut', 'stope'],
    stope: ['stope', 'post'],
    post: ['post'],
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
    const revealed = new Set();
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((r) => revealed.add(r));
    haulage.visible = revealed.has('dev');
    airway.visible = revealed.has('dev');
    orePasses.forEach((pass) => { pass.visible = revealed.has('prep2'); });
    rises.forEach((r) => { r.visible = revealed.has('prep1'); });
    cutDrift.visible = revealed.has('prep2') || revealed.has('cut');
    setMined(step.mined);
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePasses.forEach((pass) => { pass.visible = true; });
    rises.forEach((r) => { r.visible = true; });
    cutDrift.visible = true;
    setMined(0);
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '缓倾斜薄矿体 12° / 4m', pos: [-40, 15, 8], tone: '#f0a05a', height: 4.0, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘脉外 · 标高 −4m', pos: [-38, -7, 26], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '回风巷道', sub: '上水平', pos: [30, 15, -20], tone: '#9fd0ff', height: 3.0, pri: 82, phase: 'dev' },
    { text: '上山/天井', sub: '两端联络运输巷', pos: [-37, 7, -14], tone: '#6fe3d8', height: 3.0, pri: 86, phase: 'prep' },
    { text: '切割平巷', sub: '沿矿体下边界', pos: [-6, 2, 22], tone: '#ff7a4f', height: 3.0, pri: 84, phase: 'prep' },
    { text: '放矿溜井', sub: 'φ2.0m', pos: [21, -2, 26], tone: '#6fe3d8', height: 3.0, pri: 80, phase: 'prep' },
    { text: '工作面', sub: '全厚一次回采 · 沿走向推进', pos: [0, 12, 0], tone: '#ffcb6b', height: 3.6, pri: 90, phase: 'cut' },
    { text: '不规则矿柱', sub: '2–3m × 3–4m', pos: [21, 14, -9], tone: '#d08a5a', height: 3.2, pri: 88, phase: 'stope' },
    { text: '废石垛', sub: '采空区废石充填', pos: [-29, 10, 11], tone: '#c9b48a', height: 3.0, pri: 78, phase: 'stope' },
    { text: '采空区', sub: '空场靠矿柱自稳', pos: [26, 13, 10], tone: '#9fb9cc', height: 3.2, pri: 82, phase: 'stope' },
    { text: '矿柱与顶板管理', sub: '空场暂不处理 · 靠矿柱自稳', pos: [8, 14, 8], tone: '#ffa94d', height: 3.4, pri: 86, phase: 'post' },
  ]);

  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.4 },
    stageIndex: (p) => (p <= 0.08 ? 0 : p <= 0.18 ? 1 : p < 1 ? 2 : 3),
    progressText: (p) => (p <= 0.08 ? '采准' : p <= 0.18 ? '切割' : p < 1 ? '沿走向推进' : '矿柱与顶板管理'),
    bounds: new THREE.Box3(new THREE.Vector3(-44, -8, -30), new THREE.Vector3(44, 20, 26)),
  };
}
