// B-1 单层充填采矿法
// 依据：教材B §12.1（印308–309）、图12-1/12-2；交付成果04 B-1档案、09§九
// 展示参数：缓倾斜薄矿体 14°/3.5m；走向72m、倾斜方向36m；全厚一次回采；
//           沿走向分条推进，采空区随工作面推进用尾砂/水砂充填，留充填挡墙。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, gentlyDippingSlab, boxBetween, cylinderBetween,
  dashedOutline, solidOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'B-1',
  name: '单层充填采矿法',
  en: 'Single-layer Cut-and-Fill',
  category: '充填采矿法 · 单层充填法（表6-1 组7 / 典型方法9）',
  refs: '教材B §12.1，印308–309 · 图12-1（单层充填）、图12-2（充填系统）',
  tier: 'A 级资料（图12-1 全构件标注）',
  summary:
    '缓倾斜薄矿体全厚一次回采，不沿高度分层；工作面沿走向推进，' +
    '采空区随推进用尾砂/水砂一次充填，充填体接触原顶板并支撑采空区。' +
    '与上向分层充填的区别：没有多层水平分层，只有一条沿走向推进的工作面和一道充填挡墙。',
  teaching: [
    '单层 = 矿体全厚一次采出，不按高度分层；充填体一次充满采空区。',
    '工作面沿走向连续推进，充填滞后于工作面，挡墙隔离未充填区。',
    '充填体接触原顶板，缩小顶板暴露范围。',
    '适用于顶板不稳固、地表不允许塌陷的缓倾斜薄矿体。',
  ],
  stages: ['采准', '切割', '沿走向回采', '采空区充填'],
  params: [
    ['矿体倾角 / 厚度', '14° / 3.5 m', '缓倾斜薄矿体（展示简化）【假】'],
    ['走向长度 / 倾斜方向', '72 m / 36 m', '展示值【假】'],
    ['回采条带宽度', '9 m', '8 条带；全厚一次回采【假】'],
    ['充填方式', '尾砂/水砂一次充填', '采空区随推进充填【教】'],
    ['充填挡墙', '0.4 m 厚', '隔离未充填工作面【图】'],
    ['切割平巷 / 上山', '3.0×3.0 m / 2.4×2.4 m', '沿矿体下边界/两端【图】'],
    ['阶段运输巷 / 回风巷', '4.2×3.4 m / 3.2×3.0 m', '下盘脉外【图】'],
    ['放矿溜井', 'φ2.0 m', '沿走向间距约 30 m【图】'],
  ],
  assumptions: [
    '矿体倾角取 14° 展示；教材为缓倾斜薄矿体【假】。',
    '自由探索按单条带推进，工序演示按两条带一循环；实际充填步距随挡墙/管路布置变化【假】。',
    '充填体密实、接顶理想；未模拟脱水、沉降与强度分带【假】。',
    '挡墙按 0.4m 直墙示意；实际为预制/砌筑挡墙【假】。',
  ],
  layers: ['ore', 'drift', 'stope', 'fill', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    fill: '充填体/挡墙', shaft: '井筒', lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'backfill', 'excavation'],
  camera: { pos: [92, 50, 94], target: [0, 5, 0] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 14, TH = 3.5;
const X0 = -36, X1 = 36, Z0 = -18, Z1 = 18;
const YTOP = 10;
const SLICES = 8;
const SLICE_W = (X1 - X0) / SLICES;
const CUT_Z = Z1 - 1.5;
const RISE_Z = -14;
const HAUL_Z = -23;

function seamTop(z) { return YTOP - z * Math.tan(DIP * Math.PI / 180); }

export function build(M) {
  const registry = createRegistry('B-1');
  const { group, layers } = createLayerGroups();

  const envelope = gentlyDippingSlab({
    x0: X0, x1: X1, z0: Z0, z1: Z1, yTop: YTOP, thickness: TH, dip: DIP,
  });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // ---------------- 条带：未采矿体 + 充填体 ----------------
  const slices = [];
  const fills = [];
  const floors = [];
  for (let i = 0; i < SLICES; i++) {
    const sx0 = X0 + i * SLICE_W;
    const sx1 = sx0 + SLICE_W;
    const geo = gentlyDippingSlab({
      x0: sx0 + 0.05, x1: sx1 - 0.05, z0: Z0 + 0.05, z1: Z1 - 0.05,
      yTop: YTOP, thickness: TH, dip: DIP,
    });
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(geo, M.oreSolid);
    g.add(mesh);
    g.add(solidOutline(geo, 0xc97a46, 0.28));
    layers.ore.add(g);
    registry.tag(mesh, {
      type_code: 'ORE', name: `未采矿体（第${SLICES - i}条带）`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【图】', textbook_ref: '图12-1；§12.1',
      dimensions: `走向9m × 厚3.5m × 倾斜36m`,
      stage: '回采', assumption: true,
    });
    slices.push(g);

    const fillGeo = gentlyDippingSlab({
      x0: sx0, x1: sx1, z0: Z0 + 0.06, z1: Z1 - 0.06,
      yTop: YTOP, thickness: TH, dip: DIP,
    });
    const fill = new THREE.Mesh(fillGeo, i % 2 ? M.fillWaterAlt : M.fillWater);
    fill.visible = false;
    layers.fill.add(fill);
    registry.tag(fill, {
      type_code: 'FILL', name: `单层充填体（第${SLICES - i}条带）`,
      mining_state: 'backfill', mined: true, backfilled: true,
      source_tier: '【教】', textbook_ref: '§12.1；图12-1',
      dimensions: '全厚3.5m，接顶充填', stage: '充填',
    });
    fills.push(fill);

    const floorGeo = gentlyDippingSlab({
      x0: sx0 + 0.1, x1: sx1 - 0.1, z0: Z0 + 0.1, z1: Z1 - 0.1,
      yTop: YTOP - TH, thickness: 0.12, dip: DIP,
    });
    const floor = new THREE.Mesh(floorGeo, M.stopeFloor);
    floor.visible = false;
    layers.stope.add(floor);
    registry.tag(floor, {
      type_code: 'STOPE-A', name: `待充填采空区底板（第${SLICES - i}条带）`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【推】', textbook_ref: '图12-1；§12.1',
      dimensions: '9m × 36m', stage: '回采',
    }, registry, { renderOrder: 6 });
    floors.push(floor);
  }

  // ---------------- 充填挡墙 ----------------
  const wall = new THREE.Mesh(new THREE.BufferGeometry(), M.fillCap);
  wall.visible = false;
  layers.fill.add(wall);
  registry.tag(wall, {
    type_code: 'SURF', name: '充填挡墙',
    mining_state: 'backfill', mined: true, backfilled: true,
    source_tier: '【图】', textbook_ref: '图12-1；§12.1',
    dimensions: '厚0.4m，全断面', stage: '充填',
  });

  // ---------------- 采准巷道 ----------------
  const haulZ = HAUL_Z;
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-42, -4, haulZ], [42, -4, haulZ]], archSection(4.2, 3.4, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道',
    source_tier: '【图】', textbook_ref: '图12-1；§12.1',
    elevation_z: -4, dimensions: '断面4.2×3.4m', stage: '采准',
    connectivity: ['放矿溜井', '上山'],
  }, registry);

  const airway = addMesh(layers.drift, hollowTunnel(
    [[-42, 15, -21], [42, 15, -21]], archSection(3.2, 3.0, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段回风巷道',
    source_tier: '【图】', textbook_ref: '图12-1；§12.1',
    elevation_z: 15, dimensions: '断面3.2×3.0m', stage: '采准',
    connectivity: ['上山'],
  }, registry);

  const rises = [];
  [-30, 30].forEach((x, i) => {
    const seamZ = RISE_Z;
    const bottom = seamTop(seamZ) - TH;
    const rise = addMesh(layers.shaft, boxBetween(
      [x, -3.4, haulZ], [x, bottom + 0.7, seamZ], 2.4, 2.4,
    ), M.xray, {
      type_code: 'PASS', name: `上山/天井${i === 0 ? '①' : '②'}`,
      source_tier: '【图】', textbook_ref: '图12-1；§12.1',
      dimensions: '2.4×2.4m', stage: '采准',
      connectivity: ['阶段运输巷', '切割平巷'],
    }, registry);
    rises.push(rise);
    rises.push(addMesh(layers.drift, hollowTunnel(
      [[x, bottom, seamZ], [x, 15, -21]], archSection(2.2, 2.2, 9),
    ), M.driftThin, {
      type_code: 'DRIFT', name: `上山—回风巷联络道 ${i + 1}`,
      source_tier: '【推】', textbook_ref: '图12-1；§12.1', stage: '采准',
      connectivity: ['上山', '阶段回风巷道'],
    }, registry));
    rises.push(addMesh(layers.drift, hollowTunnel(
      [[x, bottom, seamZ], [x, seamTop(CUT_Z) - TH, CUT_Z]], archSection(2.4, 2.4, 9),
    ), M.driftThin, {
      type_code: 'DRIFT', name: `上山—切割平巷联络道 ${i + 1}`,
      source_tier: '【推】', textbook_ref: '图12-1；§12.1', stage: '采准',
      connectivity: ['上山', '切割平巷'],
    }, registry));
  });

  const cutDrift = addMesh(layers.drift, hollowTunnel(
    [[X0, seamTop(CUT_Z) - TH, CUT_Z], [X1, seamTop(CUT_Z) - TH, CUT_Z]], archSection(3.0, 3.0, 9),
  ), M.driftThin, {
    type_code: 'DRIFT', name: '切割平巷',
    source_tier: '【图】', textbook_ref: '图12-1；§12.1',
    elevation_z: seamTop(CUT_Z) - TH, dimensions: '断面3.0×3.0m，沿走向',
    stage: '切割', connectivity: ['上山', '工作面'],
  }, registry);

  const orePass = addMesh(layers.shaft, cylinderBetween(
    [30, -3.6, haulZ], [30, seamTop(RISE_Z) - TH + 0.7, RISE_Z - 2], 1.0, 18,
  ), M.xray, {
    type_code: 'PASS', name: '放矿溜井',
    source_tier: '【图】', textbook_ref: '图12-1；§12.1',
    dimensions: 'φ2.0m', stage: '采准',
    connectivity: ['阶段运输巷', '采场'],
  }, registry);

  const faceGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, seamTop(Z0) + 0.15, Z0),
    new THREE.Vector3(0, seamTop(Z1) + 0.15, Z1),
  ]);
  const faceLine = new THREE.Line(faceGeo, new THREE.LineBasicMaterial({
    color: 0xffcb6b, transparent: true, opacity: 0.95,
  }));
  faceLine.visible = false;
  layers.stope.add(faceLine);

  let mined = 0, filled = 0;
  let wallSprite = null, goafSprite = null;
  function setState(m, f) {
    mined = Math.max(0, Math.min(SLICES, m));
    filled = Math.max(0, Math.min(mined, f));
    slices.forEach((g, i) => { g.visible = i < SLICES - mined; });
    fills.forEach((x, i) => { x.visible = i >= SLICES - filled; });
    floors.forEach((f, i) => { f.visible = i >= SLICES - mined && i < SLICES - filled; });
    if (filled > 0) {
      const wx = X1 - filled * SLICE_W;
      wall.geometry.dispose();
      wall.geometry = gentlyDippingSlab({
        x0: wx - 0.4, x1: wx, z0: Z0 + 0.05, z1: Z1 - 0.05,
        yTop: YTOP, thickness: TH, dip: DIP,
      });
      wall.position.set(0, 0, 0);
      wall.visible = filled < SLICES;
    } else {
      wall.visible = false;
    }
    if (wallSprite) {
      wallSprite.visible = wall.visible;
      wallSprite.position.x = X1 - filled * SLICE_W - 0.2;
    }
    if (goafSprite) {
      goafSprite.visible = filled < mined;
      goafSprite.position.x = X1 - ((mined + filled) / 2) * SLICE_W;
    }
    const fx = mined === 0 ? X1 : X1 - mined * SLICE_W;
    faceLine.visible = mined > 0 && mined < SLICES;
    faceLine.position.x = Math.max(X0, fx);
  }

  function update(p) {
    if (p >= 1) setState(SLICES, SLICES);
    else if (p <= 0.08) setState(0, 0);
    else if (p <= 0.18) setState(1, 0);
    else if (p <= 0.28) setState(1, 1);
    else {
      const n = 1 + Math.ceil(((p - 0.28) / 0.72) * (SLICES - 1));
      setState(n, Math.max(0, n - 1));
    }
    haulage.visible = true; airway.visible = true;
    rises.forEach((r) => { r.visible = true; });
    cutDrift.visible = true; orePass.visible = true;
  }

  // ---------------- 过程演示 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、沿走向回采', color: '#ffcb6b' },
    { id: 'fill', name: '五、采空区充填', color: '#8fd6b0' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷道与回风巷道', mined: 0, filled: 0, reveal: ['dev'],
      desc: '掘下盘阶段运输巷道与回风巷道，形成矿块外部运输、通风系统。' },
    { phase: 'prep', title: '两端上山/天井', mined: 0, filled: 0, reveal: ['prep1'],
      desc: '在矿块两端掘上山/天井，通达矿体底板，作为行人、通风与充填通道。' },
    { phase: 'prep', title: '切割平巷与放矿溜井', mined: 0, filled: 0, reveal: ['prep2'],
      desc: '沿矿体下边界掘切割平巷，掘放矿溜井，形成初始工作面的出矿与充填条件。' },
    { phase: 'cut', title: '初始工作面（第1条带）', mined: 1, filled: 0, reveal: ['cut'],
      desc: '自切割平巷拉开初始工作面，全厚回采第1条带；采空区暂未充填。' },
    { phase: 'stope', title: '第2条带回采', mined: 2, filled: 0, reveal: [],
      desc: '工作面沿走向推进至第2条带；第1条带作为待充填采空区。' },
    { phase: 'fill', title: '第1–2条带充填', mined: 2, filled: 2, reveal: [],
      desc: '在采空区端部架设充填挡墙，用尾砂/水砂一次充填第1–2条带，充填体接顶。' },
    { phase: 'stope', title: '第3–4条带回采', mined: 4, filled: 2, reveal: [],
      desc: '工作面继续沿走向推进，回采第3–4条带；已充填体接顶并约束相邻空区边界。' },
    { phase: 'fill', title: '第3–4条带充填', mined: 4, filled: 4, reveal: [],
      desc: '充填第3–4条带；充填挡墙随工作面推进前移。' },
    { phase: 'stope', title: '第5–6条带回采', mined: 6, filled: 4, reveal: [],
      desc: '回采第5–6条带；充填体滞后本回采循环，挡墙隔离待充填区。' },
    { phase: 'fill', title: '第5–6条带充填', mined: 6, filled: 6, reveal: [],
      desc: '充填第5–6条带，形成连续充填体。' },
    { phase: 'stope', title: '第7–8条带回采', mined: 8, filled: 6, reveal: [],
      desc: '回采最后两条带；矿体全厚采完。' },
    { phase: 'fill', title: '第7–8条带充填 / 接顶', mined: 8, filled: 8, reveal: ['post'],
      desc: '充填最后两条带并接顶；采空区全部由充填体替换，撤除挡墙。' },
  ];

  const LABEL_VIS = {
    dev: ['dev', 'prep'],
    prep: ['prep', 'cut'],
    cut: ['cut', 'stope'],
    stope: ['stope', 'fill'],
    fill: ['fill'],
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
    orePass.visible = revealed.has('prep2');
    rises.forEach((r) => { r.visible = revealed.has('prep1'); });
    cutDrift.visible = revealed.has('prep2') || revealed.has('cut');
    setState(step.mined, step.filled);
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePass.visible = true;
    rises.forEach((r) => { r.visible = true; });
    cutDrift.visible = true;
    setState(0, 0);
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '缓倾斜薄矿体 14° / 3.5m', pos: [-40, 15, 8], tone: '#f0a05a', height: 4.0, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘脉外 · 标高 −4m', pos: [-38, -7, -26], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '回风巷道', sub: '上水平', pos: [30, 18, -20], tone: '#9fd0ff', height: 3.0, pri: 82, phase: 'dev' },
    { text: '上山/天井', sub: '两端联络运输、回风及切割巷道', pos: [-30, 2, -14], tone: '#6fe3d8', height: 3.0, pri: 86, phase: 'prep' },
    { text: '切割平巷', sub: '沿矿体下边界', pos: [-6, 2, 22], tone: '#ff7a4f', height: 3.0, pri: 84, phase: 'prep' },
    { text: '放矿溜井', sub: 'φ2.0m', pos: [30, 8, -26], tone: '#6fe3d8', height: 3.0, pri: 80, phase: 'prep' },
    { text: '工作面', sub: '全厚一次回采', pos: [0, 12, 0], tone: '#ffcb6b', height: 3.6, pri: 90, phase: 'cut' },
    { text: '充填体', sub: '尾砂/水砂一次充填 · 接顶', pos: [20, 13, 6], tone: '#8fd6b0', height: 3.6, pri: 92, phase: 'fill' },
  ]);
  const dyn = addLabelLayer(layers.labels, [
    { text: '充填挡墙', sub: '随工作面推进前移', pos: [18, 12, 12], tone: '#d8ddc9', height: 3.0, pri: 86, phase: 'dynamic' },
    { text: '采空区（待充填）', sub: '工作面与充填体之间', pos: [6, 12, 4], tone: '#9fb9cc', height: 3.0, pri: 80, phase: 'dynamic' },
  ]);
  wallSprite = dyn.children[0];
  goafSprite = dyn.children[1];
  wallSprite.visible = false;
  goafSprite.visible = false;

  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.4 },
    stageIndex: (p) => (p <= 0.08 ? 0 : p <= 0.18 ? 1 : p < 1 ? 2 : 3),
    progressText: (p) => (p <= 0.08 ? '采准' : p <= 0.18 ? '切割' : p < 1 ? '沿走向回采/充填' : '接顶完成'),
    bounds: new THREE.Box3(new THREE.Vector3(-44, -8, -30), new THREE.Vector3(44, 20, 26)),
  };
}
