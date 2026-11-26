// A-4 阶段矿房法（概念示意，多矿房）
// 依据：教材B §11.6（印292–303）、图11-24 骨架；固定名单将阶段矿房法定为概念示意。
// 展示：沿走向 3 个矿房 + 2 个间柱 + 两侧端柱；每矿房独立底部结构/切割槽/凿岩巷道；
//       逐矿房凿岩—崩矿—放矿，突出"矿房—间柱—顶底柱"的平面关系。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, pillarBlock, oreBody, dippingSlab, stopeBackWall,
  funnelCavity, shaftBox, boxBetween, cylinderBetween, dipZ, dashedOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';
import { buildEndSlot, sectionTraces } from './stageGeometry.js';

export const meta = {
  code: 'A-4',
  name: '阶段矿房法',
  en: 'Stage Room Stoping (concept)',
  category: '空场采矿法 · 阶段矿房法（表6-1 组9 / 概念示意）',
  refs: '教材B §11.6，印292–303 · 图11-24（共用骨架）',
  tier: 'C 级概念示意（教材无独立深孔阶段矿房图；按图11-24 骨架概念示意）',
  summary:
    '沿走向布置 3 个阶段矿房，矿房之间留间柱、两端留端柱，顶底柱保护阶段巷道；' +
    '每个矿房全高一次回采，底柱内电耙道—漏斗—拉底巷道受矿，端部切割立槽提供自由面，' +
    '深孔崩矿、自重放矿。本模型为概念示意，细部构造以 A-6 分段凿岩阶段矿房法为准。',
  teaching: [
    '3 个矿房 + 2 个间柱 + 两端端柱：一眼读出阶段矿房法的平面矿柱关系。',
    '阶段矿房全高 48m；每矿房独立底部结构（电耙道—漏斗—拉底）与切割立槽。',
    '逐矿房凿岩—崩矿—放矿；矿房采空后顶/底/间柱仍保留。',
    '阶段矿房法是一类方法总称；深孔/分段凿岩/VCR 为落矿方式分支。',
  ],
  stages: ['采准', '切割', '逐矿房回采', '采场处理'],
  params: [
    ['矿体倾角 / 厚度', '75° / 16 m', '急倾斜中厚矿体【假】'],
    ['阶段高度', '60 m', '50–70 m【教】'],
    ['矿房数 / 长度', '3 个 / 20 m', '展示值；矿房沿走向 20m【假】'],
    ['间柱 / 端柱', '6 m / 12 m', '间柱 6–8m；端柱展示值【假】'],
    ['顶柱 / 底柱', '6 m / 6 m', '图11-24【图】'],
    ['底柱内电耙道', '2.8×2.4 m', '每矿房 1 条【图】'],
    ['漏斗 / 漏斗颈', '3 个/矿房，上口 r2.4 m', '图11-24⑤【图】'],
    ['拉底巷道', '3.0×3.0 m', '图11-24②【图】'],
    ['切割立槽', '3 m 宽，贯穿矿房', '图11-25【图】'],
    ['凿岩巷道', '3.0×3.0 m，矿房顶部', '概念示意【假】'],
  ],
  assumptions: [
    '本方法按"概念示意"处理：表达 3 个矿房、间柱/端柱、底部结构、切割槽，不细化深孔布置。',
    '凿岩巷道置于矿房顶部为概念表达；深孔/分段凿岩细部见 A-6。',
    '矿房长度 20m、间柱 6m、端柱 12m 为展示值【假】。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'muck', 'cut', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '矿柱（间柱/端柱/顶底柱）', muck: '崩落矿石', cut: '切割工程',
    shaft: '井筒', lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'caved_ore', 'excavation'],
  camera: { pos: [162, 112, 138], target: [0, 30, -4] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 75, TH = 16;
const X0 = -48, X1 = 48, Y0 = 0, Y1 = 60;
const SILL = 6, CROWN = 54;
const ROOMS = [
  { id: 'R1', x0: -36, x1: -16 },
  { id: 'R2', x0: -10, x1: 10 },
  { id: 'R3', x0: 16, x1: 36 },
];

export function build(M) {
  const registry = createRegistry('A-4');
  const { group, layers } = createLayerGroups();
  const processFx = new THREE.Group();
  processFx.name = 'processFx';
  group.add(processFx);

  const envelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // ---------------- 矿柱：端柱/间柱/顶底柱 ----------------
  [[-48, -36, '左端柱'], [36, 48, '右端柱']].forEach(([x0, x1, nm]) => {
    addMesh(layers.pillar, pillarBlock({
      x0, x1, y0: SILL, y1: CROWN, dip: DIP, halfThick: TH / 2, margin: 0,
    }), M.pillar, {
      type_code: 'PILLAR-R', name: nm, source_tier: '【图】',
      textbook_ref: '图11-24；§11.6', dimensions: '宽12m，高48m', stage: '—',
    }, registry);
  });
  [[-16, -10, '间柱①'], [10, 16, '间柱②']].forEach(([x0, x1, nm]) => {
    addMesh(layers.pillar, pillarBlock({
      x0, x1, y0: SILL, y1: CROWN, dip: DIP, halfThick: TH / 2, margin: 0,
    }), M.pillar, {
      type_code: 'PILLAR-R', name: nm, source_tier: '【图】',
      textbook_ref: '图11-24；§11.6', dimensions: '宽6m，高48m', stage: '—',
    }, registry);
  });
  addMesh(layers.pillar, pillarBlock({
    x0: -48, x1: 48, y0: 0, y1: SILL, dip: DIP, halfThick: TH / 2, margin: 0,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '底柱', source_tier: '【图】',
    textbook_ref: '图11-24；§11.6', dimensions: '高6m', stage: '—',
  }, registry);
  addMesh(layers.pillar, pillarBlock({
    x0: -48, x1: 48, y0: CROWN, y1: 60, dip: DIP, halfThick: TH / 2, margin: 0,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '顶柱', source_tier: '【图】',
    textbook_ref: '图11-24；§11.6', dimensions: '厚6m', stage: '—',
  }, registry);

  // ---------------- 三个矿房 ----------------
  const rooms = ROOMS.map((r) => {
    const zBottom = dipZ(4.5, DIP);
    const ore = addMesh(layers.ore, dippingSlab({
      x0: r.x0 + 3, x1: r.x1 - 0.06, y0: SILL, y1: CROWN,
      dip: DIP, thickness: TH, inset: 0.06,
    }), M.oreSolid, {
      type_code: 'ORE', name: `${r.id} 阶段矿房矿体`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【图】', textbook_ref: '图11-24；§11.6',
      dimensions: '20m × 厚16m × 高48m', stage: '—', assumption: true,
    }, registry, { renderOrder: 2 });

    const muck = new THREE.Mesh(dippingSlab({
      x0: r.x0 + 3.08, x1: r.x1 - 0.15, y0: SILL, y1: CROWN - 0.2,
      dip: DIP, thickness: TH, inset: 0.15,
    }), M.cavedOre);
    muck.visible = false;
    layers.muck.add(muck);
    registry.tag(muck, {
      type_code: 'MUCK', name: `${r.id} 崩落矿石`,
      mining_state: 'caved_ore', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§11.6.1；图11-24',
      dimensions: '矿房内崩落矿石', stage: '放矿', assumption: true,
    }, registry, { renderOrder: 5 });

    const back = stopeBackWall({
      x0: r.x0 + 0.06, x1: r.x1 - 0.06, y0: SILL, y1: CROWN,
      dip: DIP, thickness: TH, zOffset: 0.08,
    });
    const voidWall = new THREE.Mesh(back, M.stopeBack);
    voidWall.visible = false;
    layers.stope.add(voidWall);
    registry.tag(voidWall, {
      type_code: 'STOPE-A', name: `${r.id} 矿房空场`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【教】', textbook_ref: '图11-24；§11.6',
      dimensions: '20m × 厚16m × 高48m', stage: '回采',
    }, registry, { renderOrder: 7 });
    const voidOutline = dashedOutline(dippingSlab({
      x0: r.x0 + 0.08, x1: r.x1 - 0.08, y0: SILL, y1: CROWN,
      dip: DIP, thickness: TH, inset: 0.04,
    }), 0xffc178, 0.4, 2.0, 1.8);
    voidOutline.visible = false;
    layers.stope.add(voidOutline);

    // 底部结构：电耙道 + 3 漏斗/颈 + 拉底巷道
    const rake = addMesh(layers.drift, hollowTunnel(
      [[r.x0 - 1, 2.2, zBottom], [r.x1 + 1, 2.2, zBottom]], archSection(2.8, 2.4, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${r.id} 电耙道`, source_tier: '【图】',
      textbook_ref: '图11-24；§11.6', elevation_z: 2.2,
      dimensions: '2.8×2.4m', stage: '采准', connectivity: ['漏斗颈', '溜井'],
    }, registry);
    const under = addMesh(layers.drift, hollowTunnel(
      [[r.x0, SILL - 0.04, zBottom], [r.x1, SILL - 0.04, zBottom]], archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${r.id} 拉底巷道`, source_tier: '【图】',
      textbook_ref: '图11-24；§11.6', elevation_z: SILL - 0.04,
      dimensions: '3.0×3.0m', stage: '切割', connectivity: ['漏斗', '矿房'],
    }, registry);

    const funnels = [];
    const necks = [];
    const xs = [r.x0 + 5, (r.x0 + r.x1) / 2, r.x1 - 5];
    xs.forEach((x) => {
      const zc = dipZ(4.5, DIP);
      const cone = new THREE.Mesh(funnelCavity(x, zc, 3.2, 6, 0.7, 2.4, 18), M.funnel);
      layers.stope.add(cone);
      registry.tag(cone, {
        type_code: 'STOPE-A', name: `${r.id} 漏斗（x${x}）`,
        mining_state: 'excavation', mined: true, backfilled: false,
        source_tier: '【图】', textbook_ref: '图11-24⑤；§11.6',
        dimensions: '上口r2.4m', stage: '采准',
      });
      funnels.push(cone);
      const neck = new THREE.Mesh(shaftBox(x - 0.7, x + 0.7, zc - 0.7, zc + 0.7, 2.4, 3.2), M.funnel);
      layers.stope.add(neck);
      registry.tag(neck, {
        type_code: 'PASS', name: `${r.id} 漏斗颈（x${x}）`,
        mining_state: 'excavation', mined: true, backfilled: false,
        source_tier: '【图】', textbook_ref: '图11-24⑤；§11.6',
        dimensions: '1.4×1.4m', stage: '采准',
      });
      necks.push(neck);
    });

    // 切割天井/立槽
    const raiseX = r.x0 + 1.5;
    const cutRaise = addMesh(layers.cut, boxBetween(
      [raiseX, SILL - 0.1, zBottom], [raiseX, CROWN, dipZ(CROWN, DIP)], 2, 2,
    ), M.xray, {
      type_code: 'PASS', name: `${r.id} 切割天井`, source_tier: '【图】',
      textbook_ref: '图11-24⑥；§11.6', dimensions: '2×2m', stage: '切割',
    }, registry);
    const slot = buildEndSlot(layers, registry, M, {
      x0: r.x0 + 0.06, x1: r.x0 + 3, y0: SILL, y1: CROWN, dip: DIP, thickness: TH, inset: 0.06,
    }, `${r.id} 切割立槽`, '图11-25；§11.6');

    const drawLink = addMesh(layers.drift, hollowTunnel(
      [[r.x0 + 5, 2.2, zBottom], [r.x0 + 5, 2.2, -42]], archSection(2.8, 2.4, 9),
    ), M.drift, {
      type_code: 'DRIFT', name: `${r.id} 出矿联络巷`, source_tier: '【推】',
      textbook_ref: '图11-24；§11.6', dimensions: '2.8×2.4m', stage: '采准',
      connectivity: ['电耙道', '出矿汇集巷'], assumption: true,
    }, registry);

    // 顶部凿岩巷道
    const dy = 50;
    const drill = addMesh(layers.drift, hollowTunnel(
      [[r.x0 + 1, dy, dipZ(dy, DIP)], [r.x1 - 1, dy, dipZ(dy, DIP)]], archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${r.id} 凿岩巷道`, source_tier: '【假】',
      textbook_ref: '§11.6 概念', elevation_z: dy,
      dimensions: '3.0×3.0m', stage: '采准', connectivity: ['切割天井', '矿房'],
    }, registry);

    const holes = sectionTraces([r.x0 + 6, r.x0 + 13].map((x) => ({
      x,
      from: [dy + 1.4, dipZ(dy, DIP)],
      to: [[SILL + 1, dipZ(SILL + 1, DIP)]],
    })));
    processFx.add(holes);

    return { ...r, ore, muck, voidWall, voidOutline, rake, under, funnels, necks, cutRaise, slot, drill, holes, drawLink };
  });

  // ---------------- 开拓 ----------------
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-54, -4, -42], [54, -4, -42]], archSection(4.2, 3.6, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道', source_tier: '【图】',
    textbook_ref: '图11-24①；§11.6', elevation_z: -4,
    dimensions: '4.2×3.6m', stage: '开拓', connectivity: ['溜井'],
  }, registry);
  const airway = addMesh(layers.drift, hollowTunnel(
    [[-54, 62, -42], [54, 62, -42]], archSection(3.6, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '上水平回风巷道', source_tier: '【图】',
    textbook_ref: '图11-24④；§11.6', elevation_z: 62,
    dimensions: '3.6×3.2m', stage: '开拓', connectivity: ['通风天井'],
  }, registry);
  const orePass = addMesh(layers.shaft, cylinderBetween(
    [-42, -1.3, -42], [-42, 2.3, -42], 1.2, 18,
  ), M.xray, {
    type_code: 'PASS', name: '矿石溜井', source_tier: '【图】',
    textbook_ref: '图11-24⑦；§11.6', dimensions: 'φ2.4m', stage: '开拓',
  }, registry);
  const human = addMesh(layers.shaft, shaftBox(40, 42.4, -43.2, -40.8, -1.4, 62.3), M.xray, {
    type_code: 'PASS', name: '通风人行天井', source_tier: '【图】',
    textbook_ref: '图11-24④；§11.6', dimensions: '2.4×2.4m', stage: '开拓',
  }, registry);

  const drawCollector = addMesh(layers.drift, hollowTunnel(
    [[-42, 2.2, -42], [26, 2.2, -42]], archSection(2.8, 2.4, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '出矿汇集巷', source_tier: '【推】',
    textbook_ref: '图11-24；§11.6', dimensions: '2.8×2.4m', stage: '采准',
    connectivity: ['出矿联络巷', '矿石溜井'], assumption: true,
  }, registry);

  function setRoom(r, state, cutOpen) {
    r.ore.visible = state === 'ore';
    r.muck.visible = state === 'blasted';
    r.voidWall.visible = state === 'drawn';
    r.voidOutline.visible = state === 'drawn';
    r.slot.set(cutOpen, state !== 'ore');
    r.cutRaise.visible = r.drill.visible && !cutOpen;
    r.holes.visible = false;
  }

  // ---------------- 过程：逐矿房 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、逐矿房回采', color: '#ffcb6b' },
    { id: 'post', name: '五、采场处理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷、回风巷与溜井', reveal: ['dev'],
      desc: '掘阶段运输巷道、上水平回风巷道、矿石溜井与通风人行天井。' },
    { phase: 'prep', title: '三个矿房底部结构（电耙道—漏斗—拉底）', reveal: ['prep1'],
      desc: '三个矿房各掘电耙道、3 个漏斗/漏斗颈和拉底巷道，经联络巷汇入共用溜井。' },
    { phase: 'prep', title: '三个矿房凿岩巷道与切割天井', reveal: ['prep2'],
      desc: '每个矿房顶部掘凿岩巷道，端部掘切割天井，准备切割立槽。' },
    { phase: 'cut', title: '三个矿房切割立槽', reveal: ['cut'],
      desc: '三个矿房端部各拉开 3m 宽切割立槽，为深孔崩矿提供自由面。' },
  ];
  ROOMS.forEach((r, i) => {
    steps.push({ phase: 'stope', title: `${r.id} 凿岩`, reveal: [`drill${i}`],
      desc: `${r.id} 在矿房顶部凿岩巷道示意全高落矿方向。` });
    steps.push({ phase: 'stope', title: `${r.id} 崩矿`, reveal: [`blast${i}`],
      desc: `${r.id} 向切割立槽爆破，崩落矿石充满矿房。` });
    steps.push({ phase: 'stope', title: `${r.id} 放矿`, reveal: [`draw${i}`],
      desc: `${r.id} 崩落矿石经漏斗—电耙道—溜井放出；矿房形成空场，间柱/端柱/顶底柱保留。` });
  });
  steps.push({ phase: 'post', title: '采场处理与矿柱管理', reveal: ['post'],
    desc: '3 个矿房回采完毕；2 个间柱、2 个端柱、顶柱/底柱保留，空场暂留待处理。' });

  const LABEL_VIS = {
    dev: ['dev', 'prep'], prep: ['prep', 'cut'], cut: ['cut', 'stope'],
    stope: ['stope', 'post'], post: ['post'],
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
    const rev = new Set();
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((x) => rev.add(x));
    haulage.visible = rev.has('dev');
    airway.visible = rev.has('dev');
    orePass.visible = rev.has('dev');
    human.visible = rev.has('dev');
    drawCollector.visible = rev.has('prep1');
    rooms.forEach((r, k) => {
      r.rake.visible = rev.has('prep1');
      r.drawLink.visible = rev.has('prep1');
      r.under.visible = rev.has('prep1') || rev.has('cut');
      r.funnels.forEach((f) => { f.visible = rev.has('prep1'); });
      r.necks.forEach((f) => { f.visible = rev.has('prep1'); });
      r.drill.visible = rev.has('prep2');
      let st = 'ore';
      if (rev.has(`draw${k}`)) st = 'drawn';
      else if (rev.has(`blast${k}`)) st = 'blasted';
      setRoom(r, st, rev.has('cut'));
    });
    const drillIdx = ROOMS.findIndex((_, k) => steps[i].reveal?.includes(`drill${k}`));
    rooms.forEach((r, k) => { r.holes.visible = k === drillIdx; });
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
    drawCollector.visible = true;
    rooms.forEach((r) => {
      r.rake.visible = true; r.under.visible = true; r.drawLink.visible = true;
      r.funnels.forEach((f) => { f.visible = true; });
      r.necks.forEach((f) => { f.visible = true; });
      r.drill.visible = true;
      setRoom(r, 'ore', false);
    });
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜中厚矿体 75° / 16m', pos: [-54, 48, 8], tone: '#f0a05a', height: 4.2, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘脉外', pos: [-50, -7, -45], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '矿石溜井', sub: 'φ2.4m', pos: [-42, 1, -45], tone: '#6fe3d8', height: 3.0, pri: 82, phase: 'dev' },
    { text: '电耙道 + 漏斗', sub: '每矿房独立底部结构', pos: [-26, 5, -8], tone: '#9fd0ff', height: 3.0, pri: 86, phase: 'prep' },
    { text: '凿岩巷道', sub: '每矿房顶部', pos: [0, 52, 8], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'prep' },
    { text: '切割立槽', sub: '每矿房端部 · 3m宽', pos: [-34, 30, 10], tone: '#ff7a4f', height: 3.0, pri: 82, phase: 'cut' },
    { text: '矿房①', sub: '20m × 48m', pos: [-26, 36, 10], tone: '#ffcb6b', height: 3.2, pri: 90, phase: 'stope' },
    { text: '矿房②', sub: '20m × 48m', pos: [0, 40, 10], tone: '#ffcb6b', height: 3.2, pri: 90, phase: 'stope' },
    { text: '矿房③', sub: '20m × 48m', pos: [26, 36, 10], tone: '#ffcb6b', height: 3.2, pri: 90, phase: 'stope' },
    { text: '间柱', sub: '6m · 矿房间柱', pos: [-13, 30, 8], tone: '#d08a5a', height: 3.2, pri: 88, phase: 'post' },
    { text: '端柱 / 顶底柱', sub: '永久矿柱', pos: [42, 30, 8], tone: '#d08a5a', height: 3.2, pri: 86, phase: 'post' },
  ]);

  return {
    group, layers, registry,
    update(p) {
      const n = p <= 0.1 ? 0 : Math.min(ROOMS.length, Math.floor((p - 0.1) / 0.85 * ROOMS.length) + 1);
      rooms.forEach((r, i) => {
        const state = p >= 0.98 || i < n - 1 ? 'drawn' : i === n - 1 ? 'blasted' : 'ore';
        setRoom(r, state, p > 0.1);
      });
    },
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.5 },
    stageIndex: (p) => (p <= 0.1 ? 0 : p < 1 ? 1 : 2),
    progressText: (p) => (p <= 0.1 ? '采准' : p < 1 ? '逐矿房回采' : '采场处理'),
    bounds: new THREE.Box3(new THREE.Vector3(-58, -8, -56), new THREE.Vector3(58, 70, 26)),
  };
}
