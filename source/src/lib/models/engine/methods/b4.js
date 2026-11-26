// B-4 分段充填采矿法（概念示意）
// 说明：教材B无"分段充填采矿法"这一独立名称；固定名单将 B-4 列为待裁决项。
// 本模型按"分段空场嗣后充填"的通用工程结构做概念示意，明确不等同于进路充填法。
// 依据：教材B §12.5（分段空场嗣后充填，印325–329）、图12-22/12-23 的分段充填/嗣后充填结构；
//       交付成果04 B-4档案（名实关系待确认）。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, pillarBlock, oreBody, dippingSlab, stopeBackWall,
  funnelCavity, shaftBox, cylinderBetween, dipZ, dashedOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'B-4',
  name: '分段充填采矿法（概念示意）',
  en: 'Sublevel Fill Stoping (concept)',
  category: '充填采矿法 · 分段充填（名实关系待确认）',
  refs: '教材B 无"分段充填采矿法"独立名称；按 §12.5 分段空场嗣后充填结构概念示意',
  tier: 'C 级资料（教材无此名；结构按 §12.5 分段嗣后充填概念表达）',
  summary:
    '阶段内划分 3 个 15m 分段，自下而上逐段回采；每分段矿房采完后用尾砂/胶结充填料嗣后充填，' +
    '充填体作为下一分段的底板/人工支护。本模型为"分段空场嗣后充填"的概念示意；' +
    '教材B无"分段充填采矿法"独立名称，不能视为进路充填法的同义词，名实关系待项目确认。',
  teaching: [
    '分段充填 = 以分段为单元回采，采后对该分段采空区进行嗣后充填。',
    '自下而上逐段回采/充填：下分段充填体为上分段提供底板/人工支护。',
    '每分段有独立的装运横巷、堑沟平巷、凿岩平巷；充填体接顶。',
    '名实边界：教材无此名；本模型不等同于进路充填法，仅作概念对照。',
  ],
  stages: ['采准', '切割', '分段回采', '嗣后充填'],
  params: [
    ['矿体倾角 / 厚度', '75° / 14 m', '急倾斜中厚矿体【假】'],
    ['阶段高度 / 分段', '60 m / 3 × 15 m', '分段高 15m【假】'],
    ['矿房沿走向长度', '40 m', '展示值【假】'],
    ['间柱 / 顶柱 / 底柱', '16 m / 9 m / 6 m', '展示值【假】'],
    ['分段运输平巷', '3.6×3.4 m', '下盘脉外【图】'],
    ['装运横巷 / 堑沟平巷', '3.0×3.0 m', '每分段 3 条/沿走向【图】'],
    ['凿岩平巷', '3.0×3.0 m，靠上盘', '每分段【图】'],
    ['充填体', '尾砂/胶结充填，接顶', '分段嗣后充填【教】/【假】'],
    ['充填挡墙', '0.4 m 厚', '分段端部【图】'],
  ],
  assumptions: [
    '教材B无"分段充填采矿法"独立名称；本模型按分段空场嗣后充填结构概念示意，名实关系待确认。',
    '不等同于进路充填法：未按进路/分条进路布置，不表达进路充填的横巷系统。',
    '充填体密实、接顶理想；未模拟脱水、沉降与强度分带【假】。',
    '自下而上回采/充填顺序为展示选择；实际可按矿山设计调整。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'fill', 'muck', 'cut', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '矿柱（间柱/顶底柱）', fill: '分段充填体', muck: '崩落/采下矿石',
    cut: '切割工程', shaft: '井筒', lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'backfill', 'caved_ore', 'excavation'],
  camera: { pos: [142, 102, 122], target: [0, 28, -6] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 75, TH = 14;
const X0 = -36, X1 = 36, Y0 = 0, Y1 = 60;
const RX0 = -20, RX1 = 20, SILL = 6, CROWN = 51;
const SLOT_END = RX0 + 3;
const LEVEL_Z = -36;
const SUBS = [
  { id: 'SL1', y0: 6, y1: 21 },
  { id: 'SL2', y0: 21, y1: 36 },
  { id: 'SL3', y0: 36, y1: 51 },
];

const EXPLORE_STATES = ['cut', 'mined', 'drawn', 'filled'];

function exploreStep(p) {
  if (p <= 0.1) return -1;
  const count = EXPLORE_STATES.length * SUBS.length;
  return Math.min(count - 1, Math.floor((p - 0.1) / 0.9 * count));
}

export function build(M) {
  const registry = createRegistry('B-4');
  const { group, layers } = createLayerGroups();

  const envelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // 矿柱
  [[-36, -20, '左间柱'], [20, 36, '右间柱']].forEach(([x0, x1, nm]) => {
    addMesh(layers.pillar, pillarBlock({
      x0, x1, y0: 0, y1: 60, dip: DIP, halfThick: TH / 2,
    }), M.pillar, {
      type_code: 'PILLAR-R', name: nm, source_tier: '【假】',
      textbook_ref: '§12.5 概念', dimensions: '宽16m，全高', stage: '—',
    }, registry);
  });
  addMesh(layers.pillar, pillarBlock({
    x0: RX0, x1: RX1, y0: 0, y1: SILL, margin: 0, dip: DIP, halfThick: TH / 2,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '底柱', source_tier: '【假】',
    textbook_ref: '§12.5 概念', dimensions: '高6m', stage: '—',
  }, registry);
  addMesh(layers.pillar, pillarBlock({
    x0: RX0, x1: RX1, y0: CROWN, y1: 60, margin: 0, dip: DIP, halfThick: TH / 2,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '顶柱', source_tier: '【假】',
    textbook_ref: '§12.5 概念', dimensions: '厚9m', stage: '—',
  }, registry);

  const subs = SUBS.map((sl) => {
    const ore = addMesh(layers.ore, dippingSlab({
      x0: RX0 + 0.06, x1: RX1 - 0.06, y0: sl.y0, y1: sl.y1,
      dip: DIP, thickness: TH, inset: 0.06,
    }), M.oreSolid, {
      type_code: 'ORE', name: `${sl.id} 分段矿体`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      dimensions: '40m × 厚14m × 高15m', stage: '—', assumption: true,
    }, registry, { renderOrder: 2 });

    const oreAfterCut = dippingSlab({
      x0: SLOT_END, x1: RX1 - 0.06, y0: sl.y0, y1: sl.y1,
      dip: DIP, thickness: TH, inset: 0.06,
    });
    const oreBeforeCut = ore.geometry;
    const muck = new THREE.Mesh(dippingSlab({
      x0: RX0 + 0.15, x1: RX1 - 0.15, y0: sl.y0, y1: sl.y0 + 5, dip: DIP, thickness: TH - 0.6,
    }), M.cavedOre);
    muck.visible = false;
    layers.muck.add(muck);
    registry.tag(muck, {
      type_code: 'MUCK', name: `${sl.id} 采下矿石`,
      mining_state: 'caved_ore', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      dimensions: '分段矿房内采下矿石', stage: '回采', assumption: true,
    }, registry, { renderOrder: 5 });

    const fill = new THREE.Mesh(dippingSlab({
      x0: RX0 + 0.1, x1: RX1 - 0.1, y0: sl.y0, y1: sl.y1, dip: DIP, thickness: TH - 0.2,
    }), M.fillWater);
    fill.visible = false;
    layers.fill.add(fill);
    registry.tag(fill, {
      type_code: 'FILL', name: `${sl.id} 分段充填体`,
      mining_state: 'backfill', mined: true, backfilled: true,
      source_tier: '【教】', textbook_ref: '§12.5 嗣后充填',
      dimensions: '分段全高15m，接顶', stage: '充填',
    });

    const back = stopeBackWall({
      x0: RX0 + 0.06, x1: RX1 - 0.06, y0: sl.y0, y1: sl.y1,
      dip: DIP, thickness: TH, zOffset: 0.08,
    });
    const voidWall = new THREE.Mesh(back, M.stopeBack);
    voidWall.visible = false;
    layers.stope.add(voidWall);
    registry.tag(voidWall, {
      type_code: 'STOPE-A', name: `${sl.id} 分段空场`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      dimensions: '40m × 厚14m × 高15m', stage: '回采',
    }, registry, { renderOrder: 7 });

    const driftY = sl.y0 + 0.15;
    const zCenter = dipZ(driftY + 1.5, DIP);
    const wallZ = zCenter - TH / 2 - 0.6;
    const parts = [];
    const haul = addMesh(layers.drift, hollowTunnel(
      [[-30, driftY, LEVEL_Z], [30, driftY, LEVEL_Z]], archSection(3.6, 3.4, 9),
    ), M.drift, {
      type_code: 'DRIFT', name: `${sl.id} 分段运输平巷`,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      elevation_z: driftY, dimensions: '3.6×3.4m', stage: '采准',
    }, registry);
    parts.push(haul);
    const bulkheads = [];
    [-12, 0, 12].forEach((x) => {
      const c = addMesh(layers.drift, hollowTunnel(
        [[x, driftY, LEVEL_Z], [x, driftY, zCenter]], archSection(3.0, 3.0, 9),
      ), M.driftXray, {
        type_code: 'DRIFT', name: `${sl.id} 装运横巷（x${x}）`,
        source_tier: '【假】', textbook_ref: '§12.5 概念',
        elevation_z: driftY, dimensions: '3.0×3.0m', stage: '采准',
      }, registry);
      parts.push(c);
      const profile = new THREE.Shape(archSection(3, 3, 9).map(([u, v]) => new THREE.Vector2(u, v)));
      const wallGeo = new THREE.ExtrudeGeometry(profile, { depth: 0.4, bevelEnabled: false });
      wallGeo.translate(x, driftY, wallZ);
      bulkheads.push(addMesh(layers.fill, wallGeo, M.concrete, {
        type_code: 'SURF', name: `${sl.id} 装运横巷充填挡墙（x${x}）`,
        mining_state: 'backfill', mined: true, backfilled: true,
        source_tier: '【假】', textbook_ref: '§12.5 概念', dimensions: '厚0.4m', stage: '充填',
        connectivity: ['分段充填体', '装运横巷'],
      }, registry));
    });
    const trench = addMesh(layers.drift, hollowTunnel(
      [[RX0, driftY, zCenter], [RX1, driftY, zCenter]], archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${sl.id} 堑沟平巷`,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      elevation_z: driftY, dimensions: '3.0×3.0m', stage: '采准',
    }, registry);
    parts.push(trench);
    const drillY = sl.y1 - 3.0;
    const drill = addMesh(layers.drift, hollowTunnel(
      [[RX0 + 1, drillY, dipZ(drillY, DIP) + TH / 2 - 3], [RX1 - 1, drillY, dipZ(drillY, DIP) + TH / 2 - 3]],
      archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${sl.id} 凿岩平巷`,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      elevation_z: drillY, dimensions: '3.0×3.0m', stage: '采准',
    }, registry);
    parts.push(drill);
    const cone = new THREE.Mesh(funnelCavity(0, zCenter, driftY + 3.0, driftY + 5.0, 0.7, 2.2, 18), M.funnel);
    layers.stope.add(cone);
    registry.tag(cone, {
      type_code: 'STOPE-A', name: `${sl.id} 受矿漏斗`,
      mining_state: 'excavation', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      dimensions: '上口r2.2m', stage: '采准',
    });
    parts.push(cone);
    const slotGeo = dippingSlab({
      x0: RX0 + 0.06, x1: SLOT_END, y0: sl.y0, y1: sl.y1, dip: DIP, thickness: TH - 0.12,
    });
    const slot = new THREE.Mesh(slotGeo, M.stopeVoid);
    slot.visible = false;
    layers.cut.add(slot);
    registry.tag(slot, {
      type_code: 'STOPE-A', name: `${sl.id} 切割立槽`,
      mining_state: 'excavation', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§12.5 概念',
      dimensions: '宽3m', stage: '切割',
    });
    const slotOutline = dashedOutline(slotGeo, 0xffc178, 0.5, 2.0, 1.6);
    slotOutline.visible = false;
    layers.cut.add(slotOutline);

    return { ...sl, ore, oreBeforeCut, oreAfterCut, muck, fill, voidWall, parts, bulkheads, slot, slotOutline };
  });

  // 开拓
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-44, -4, LEVEL_Z], [44, -4, LEVEL_Z]], archSection(4.2, 3.6, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道', source_tier: '【图】',
    textbook_ref: '§12.5', elevation_z: -4, dimensions: '4.2×3.6m', stage: '开拓',
  }, registry);
  const airway = addMesh(layers.drift, hollowTunnel(
    [[-44, 62, LEVEL_Z], [44, 62, LEVEL_Z]], archSection(3.6, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '回风巷道', source_tier: '【图】',
    textbook_ref: '§12.5', elevation_z: 62, dimensions: '3.6×3.2m', stage: '开拓',
  }, registry);
  const orePass = addMesh(layers.shaft, cylinderBetween(
    [-30, -4, LEVEL_Z], [-30, 38, LEVEL_Z], 1.2, 18,
  ), M.xray, {
    type_code: 'PASS', name: '矿石溜井', source_tier: '【图】',
    textbook_ref: '§12.5', dimensions: 'φ2.4m', stage: '开拓',
  }, registry);
  const human = addMesh(layers.shaft, shaftBox(28.8, 31.2, LEVEL_Z - 1.2, LEVEL_Z + 1.2, -4, 62), M.xray, {
    type_code: 'PASS', name: '充填/人行天井', source_tier: '【图】',
    textbook_ref: '§12.5', dimensions: '2.4×2.4m', stage: '开拓',
  }, registry);

  function setSub(i, state) {
    const sl = subs[i];
    sl.ore.visible = state === 'ore' || state === 'cut';
    sl.ore.geometry = state === 'cut' ? sl.oreAfterCut : sl.oreBeforeCut;
    sl.muck.visible = state === 'mined';
    sl.fill.visible = state === 'filled';
    sl.voidWall.visible = state === 'mined' || state === 'drawn';
    sl.slot.visible = sl.slotOutline.visible = state === 'cut';
    sl.bulkheads.forEach((wall) => { wall.visible = state === 'filled'; });
  }

  function update(p) {
    const position = exploreStep(p);
    subs.forEach((_, i) => {
      const index = position - i * EXPLORE_STATES.length;
      const state = index < 0 ? 'ore' : EXPLORE_STATES[Math.min(index, EXPLORE_STATES.length - 1)];
      setSub(i, state);
    });
    subs.forEach((sl) => { sl.parts.forEach((o) => { o.visible = true; }); });
    haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
  }

  // 过程
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、分段回采', color: '#ffcb6b' },
    { id: 'fill', name: '五、嗣后充填', color: '#8fd6b0' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷、回风巷与溜井', reveal: ['dev'],
      desc: '掘阶段运输巷道、回风巷道、矿石溜井与充填/人行天井。' },
    { phase: 'prep', title: 'SL1 分段运输平巷、装运横巷、堑沟平巷与凿岩平巷', reveal: ['prep0'],
      desc: '在 SL1 掘下盘分段运输平巷，经 3 条装运横巷通到堑沟平巷；靠上盘掘凿岩平巷，扩受矿漏斗。' },
    { phase: 'cut', title: 'SL1 切割立槽', reveal: ['cut0'],
      desc: '在 SL1 端部拉开 3m 宽切割立槽，为分段凿岩提供自由面。' },
    { phase: 'stope', title: 'SL1 回采', reveal: ['mine0'],
      desc: 'SL1 回采后采下矿石暂留在堑沟以上，下一步出矿。' },
    { phase: 'stope', title: 'SL1 出矿 / 采空区', reveal: ['draw0'],
      desc: '出矿完成，采下矿石从矿房移除，准备封堵横巷后充填。' },
    { phase: 'fill', title: 'SL1 嗣后充填', reveal: ['fill0'],
      desc: 'SL1 采空区用尾砂/胶结充填料嗣后充填，充填体接顶，作为 SL2 的底板/人工支护。' },
    { phase: 'prep', title: 'SL2 采准', reveal: ['prep1'],
      desc: '在 SL1 充填体上方掘 SL2 分段运输平巷、装运横巷、堑沟平巷与凿岩平巷。' },
    { phase: 'cut', title: 'SL2 切割立槽', reveal: ['cut1'],
      desc: '在本分段端部形成独立切割自由面。' },
    { phase: 'stope', title: 'SL2 回采', reveal: ['mine1'],
      desc: 'SL2 回采后暂留采下矿石，下一步经分段系统运出。' },
    { phase: 'stope', title: 'SL2 出矿 / 采空区', reveal: ['draw1'],
      desc: '出矿完成，采下矿石从矿房移除，准备封堵横巷后充填。' },
    { phase: 'fill', title: 'SL2 嗣后充填', reveal: ['fill1'],
      desc: 'SL2 采空区嗣后充填，充填体接顶。' },
    { phase: 'prep', title: 'SL3 采准', reveal: ['prep2'],
      desc: '在 SL2 充填体上方掘 SL3 分段系统。' },
    { phase: 'cut', title: 'SL3 切割立槽', reveal: ['cut2'],
      desc: '在本分段端部形成独立切割自由面。' },
    { phase: 'stope', title: 'SL3 回采', reveal: ['mine2'],
      desc: 'SL3 回采后暂留采下矿石，下一步经分段系统运出。' },
    { phase: 'stope', title: 'SL3 出矿 / 采空区', reveal: ['draw2'],
      desc: '出矿完成，采下矿石从矿房移除，准备封堵横巷后充填。' },
    { phase: 'fill', title: 'SL3 嗣后充填 / 接顶', reveal: ['fill2'],
      desc: 'SL3 采空区嗣后充填并接顶；三个分段全部充填。' },
    { phase: 'post', title: '采场处理', reveal: ['post'],
      desc: '三个分段回采/充填完成；间柱、顶底柱保留；充填体接顶。' },
  ];

  const LABEL_VIS = {
    dev: ['dev', 'prep'], prep: ['prep', 'cut', 'stope'], cut: ['cut', 'stope'],
    stope: ['stope', 'fill'], fill: ['fill'], post: ['post'],
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
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((r) => rev.add(r));
    haulage.visible = rev.has('dev');
    airway.visible = rev.has('dev');
    orePass.visible = rev.has('dev');
    human.visible = rev.has('dev');
    subs.forEach((sl, k) => {
      sl.parts.forEach((o) => { o.visible = rev.has(`prep${k}`) || rev.has(`cut${k}`); });
      let st = 'ore';
      if (rev.has(`fill${k}`)) st = 'filled';
      else if (rev.has(`draw${k}`)) st = 'drawn';
      else if (rev.has(`mine${k}`)) st = 'mined';
      else if (rev.has(`cut${k}`)) st = 'cut';
      setSub(k, st);
    });
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
    subs.forEach((sl, i) => {
      sl.parts.forEach((o) => { o.visible = true; });
      setSub(i, 'ore');
    });
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜中厚矿体 75° / 14m', pos: [-42, 46, 8], tone: '#f0a05a', height: 4.2, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘脉外', pos: [-40, -7, -46], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '分段运输平巷', sub: '下盘脉外 · 3.6×3.4m', pos: [-26, 8, -32], tone: '#9fd0ff', height: 3.0, pri: 88, phase: 'prep' },
    { text: '装运横巷 / 堑沟平巷', sub: '每分段独立装运系统', pos: [2, 9, 8], tone: '#ffcb6b', height: 3.0, pri: 86, phase: 'prep' },
    { text: '凿岩平巷', sub: '靠上盘', pos: [-8, 16, 8], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'prep' },
    { text: '切割立槽', sub: '端部 · 3m宽', pos: [-18, 28, 10], tone: '#ff7a4f', height: 3.0, pri: 82, phase: 'cut' },
    { text: '分段充填体', sub: '嗣后充填 · 接顶（概念示意）', pos: [10, 18, 8], tone: '#8fd6b0', height: 3.6, pri: 92, phase: 'fill' },
    { text: '分段回采（概念）', sub: '自下而上 · 逐段充填', pos: [4, 32, 8], tone: '#ffcb6b', height: 3.2, pri: 88, phase: 'stope' },
    { text: '名实边界', sub: '教材无此名 · 不等同进路充填法', pos: [0, 42, 10], tone: '#ffa94d', height: 3.2, pri: 90, phase: 'stope' },
  ]);

  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.5 },
    stageIndex(p) {
      const step = exploreStep(p);
      return step < 0 ? 0 : [1, 2, 2, 3][step % EXPLORE_STATES.length];
    },
    progressText(p) {
      const step = exploreStep(p);
      if (step < 0) return '采准';
      if (p >= 1) return '三个分段均已充填接顶';
      const sub = SUBS[Math.floor(step / EXPLORE_STATES.length)];
      const title = ['切割立槽', '回采', '出矿 / 采空区', '嗣后充填'][step % EXPLORE_STATES.length];
      return `${sub.id} · ${title}`;
    },
    bounds: new THREE.Box3(new THREE.Vector3(-46, -8, -48), new THREE.Vector3(46, 70, 24)),
  };
}
