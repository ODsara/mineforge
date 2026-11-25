// A-6 分段凿岩阶段矿房法（图11-24）
// 急倾斜中厚矿体；阶段矿房全高；底柱内电耙道—漏斗—拉底巷道；端部切割立槽；
// A-6 在矿房内增设 3 条分段凿岩巷道，沿走向分 3 个竖分条崩矿。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, pillarBlock, oreBody, dippingSlab, stopeBackWall,
  funnelCavity, boxBetween, cylinderBetween, dipZ, dashedOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';
import { buildEndSlot, sectionTraces } from './stageGeometry.js';

const DIP = 75, TH = 16;
const X0 = -36, X1 = 36, Y0 = 0, Y1 = 60;
const RX0 = -20, RX1 = 20, SILL = 6, CROWN = 54;
const HAUL_Z = -34;
const RAKE_Z = dipZ(4.5, DIP);
const MAN_X = 28;

export function buildStageRoom(M, meta, cfg) {
  const registry = createRegistry(meta.code);
  const { group, layers } = createLayerGroups();
  const processFx = new THREE.Group();
  processFx.name = 'processFx';
  group.add(processFx);

  const envelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // ---------------- 矿柱 ----------------
  [[-36, -20, '左间柱'], [20, 36, '右间柱']].forEach(([x0, x1, nm]) => {
    addMesh(layers.pillar, pillarBlock({
      x0, x1, y0: SILL, y1: CROWN, dip: DIP, halfThick: TH / 2, margin: 0,
    }), M.pillar, {
      type_code: 'PILLAR-R', name: nm, source_tier: '【图】',
      textbook_ref: '图11-24；§11.6', dimensions: '宽16m，高48m', stage: '—',
    }, registry);
  });
  addMesh(layers.pillar, pillarBlock({
    x0: -36, x1: 36, y0: 0, y1: SILL, dip: DIP, halfThick: TH / 2, margin: 0,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '底柱', source_tier: '【图】',
    textbook_ref: '图11-24；§11.6', dimensions: '高6m', stage: '—',
  }, registry);
  addMesh(layers.pillar, pillarBlock({
    x0: -36, x1: 36, y0: CROWN, y1: 60, dip: DIP, halfThick: TH / 2, margin: 0,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '顶柱', source_tier: '【图】',
    textbook_ref: '图11-24；§11.6', dimensions: '厚6m', stage: '—',
  }, registry);

  // 分条分别显示未采矿石、崩落矿石与采空区。
  const N = cfg.slices;
  const sliceW = (RX1 - RX0) / N;
  const slices = [];
  for (let i = 0; i < N; i++) {
    const x0 = RX0 + i * sliceW;
    const x1 = x0 + sliceW;
    const oreX0 = i === 0 ? x0 + 3 : x0 + 0.06;
    const ore = addMesh(layers.ore, dippingSlab({
      x0: oreX0, x1: x1 - 0.06, y0: SILL, y1: CROWN,
      dip: DIP, thickness: TH, inset: 0.06,
    }), M.oreSolid, {
      type_code: 'ORE', name: `矿房矿体（第${i + 1}分条）`,
      source_tier: '【图】', textbook_ref: '图11-24；§11.6',
      dimensions: `宽约${(x1 - oreX0).toFixed(1)}m × 厚16m × 高48m`, stage: '回采', assumption: true,
    }, registry);
    const muck = addMesh(layers.muck, dippingSlab({
      x0: oreX0 + 0.08, x1: x1 - 0.15, y0: SILL, y1: CROWN - 0.2,
      dip: DIP, thickness: TH, inset: 0.15,
    }), M.cavedOre, {
      type_code: 'MUCK', name: `崩落矿石（第${i + 1}分条）`,
      source_tier: '【假】', textbook_ref: '§11.6.1；图11-24',
      dimensions: '分条内崩落矿石', stage: '放矿', assumption: true,
    }, registry);

    const voidWall = addMesh(layers.stope, stopeBackWall({
      x0, x1, y0: SILL, y1: CROWN, dip: DIP, thickness: TH, zOffset: 0.08,
    }), M.stopeBack, {
      type_code: 'STOPE-A', name: `矿房空场（第${i + 1}分条）`,
      source_tier: '【教】', textbook_ref: '图11-24；§11.6',
      dimensions: '贯穿分条全高', stage: '回采',
    }, registry);
    const voidOutline = dashedOutline(dippingSlab({
      x0: x0 + 0.08, x1: x1 - 0.08, y0: SILL, y1: CROWN, dip: DIP, thickness: TH, inset: 0.04,
    }), 0xffc178, 0.4, 2, 1.8);
    layers.stope.add(voidOutline);

    const holes = sectionTraces(cfg.subDrillYs.flatMap((y, level) => {
      const from = [y + 1.1, dipZ(y, DIP)];
      const tipY = cfg.subDrillYs[level + 1] ?? CROWN;
      const tipZ = dipZ(tipY, DIP);
      return [oreX0 + 1.8, x1 - 2.5].map((x) => ({
        x, from, to: [[tipY - 3, tipZ - 4.5], [tipY, tipZ], [tipY - 3, tipZ + 5.5]],
      }));
    }));
    processFx.add(holes);
    slices.push({ ore, muck, voidWall, voidOutline, holes });
  }

  // ---------------- 底部结构 ----------------
  const zBottom = RAKE_Z;
  const rake = addMesh(layers.drift, hollowTunnel(
    [[RX0 - 2, 2.2, zBottom], [RX1 + 2, 2.2, zBottom]], archSection(2.8, 2.4, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '电耙道', source_tier: '【教】',
    textbook_ref: '图11-24；§11.6', elevation_z: 2.2,
    dimensions: '2.8×2.4m', stage: '采准', connectivity: ['漏斗颈', '溜井'],
  }, registry);
  const under = addMesh(layers.drift, hollowTunnel(
    [[RX0, SILL - 0.04, zBottom], [RX1, SILL - 0.04, zBottom]], archSection(3.0, 3.0, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '拉底巷道', source_tier: '【教】',
    textbook_ref: '图11-24；§11.6', elevation_z: SILL - 0.04,
    dimensions: '3.0×3.0m', stage: '切割', connectivity: ['漏斗', '矿房'],
  }, registry);

  const funnels = [];
  const necks = [];
  [-15, -5, 5, 15].forEach((x) => {
    const zc = dipZ(4.5, DIP);
    const cone = new THREE.Mesh(funnelCavity(x, zc, 3.2, 6, 0.7, 2.4, 18), M.funnel);
    layers.stope.add(cone);
    registry.tag(cone, {
      type_code: 'STOPE-A', name: `漏斗（x${x}）`, mining_state: 'excavation',
      mined: true, backfilled: false, source_tier: '【图】',
      textbook_ref: '图11-24⑤；§11.6', dimensions: '上口r2.4m', stage: '采准',
    });
    funnels.push(cone);
    const neck = new THREE.Mesh(cylinderBetween([x, 2.4, zc], [x, 3.2, zc], 0.7), M.funnel);
    layers.stope.add(neck);
    registry.tag(neck, {
      type_code: 'PASS', name: `漏斗颈（x${x}）`, mining_state: 'excavation',
      mined: true, backfilled: false, source_tier: '【图】',
      textbook_ref: '图11-24⑤；§11.6', dimensions: '1.4×1.4m', stage: '采准',
    });
    necks.push(neck);
  });

  // 切割天井 + 切割槽
  const cutRaise = addMesh(layers.cut, boxBetween(
    [RX0 + 1.5, SILL - 0.1, zBottom], [RX0 + 1.5, CROWN, dipZ(CROWN, DIP)], 2, 2,
  ), M.xray, {
    type_code: 'PASS', name: '切割天井', source_tier: '【图】',
    textbook_ref: '图11-24⑥；§11.6', dimensions: '2×2m，全高', stage: '切割',
  }, registry);
  const slot = buildEndSlot(layers, registry, M, {
    x0: RX0 + 0.06, x1: RX0 + 3, y0: SILL, y1: CROWN,
    dip: DIP, thickness: TH, inset: 0.06,
  }, '切割立槽', '图11-25；§11.6.1');

  // ---------------- 凿岩巷道 ----------------
  const drillDrifts = [];
  cfg.subDrillYs.forEach((y, i) => {
    const d = addMesh(layers.drift, hollowTunnel(
      [[RX0 + 1, y, dipZ(y, DIP)], [RX1 - 1, y, dipZ(y, DIP)], [MAN_X, y, dipZ(y, DIP)]], archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `分段凿岩巷道（${i + 1}）`,
      source_tier: '【图】', textbook_ref: '图11-24③；§11.6.1',
      elevation_z: y, dimensions: '3.0×3.0m', stage: '采准',
      connectivity: ['通风人行天井', '切割天井', '矿房'],
    }, registry);
    drillDrifts.push(d);
  });

  // ---------------- 开拓 ----------------
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-42, -4, HAUL_Z], [42, -4, HAUL_Z]], archSection(4.2, 3.6, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道', source_tier: '【图】',
    textbook_ref: '图11-24①；§11.6', elevation_z: -4,
    dimensions: '4.2×3.6m', stage: '开拓', connectivity: ['溜井'],
  }, registry);
  const airway = addMesh(layers.drift, hollowTunnel(
    [[-42, 62, dipZ(62, DIP)], [42, 62, dipZ(62, DIP)]], archSection(3.6, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '上水平回风巷道', source_tier: '【图】',
    textbook_ref: '图11-24④；§11.6', elevation_z: 62,
    dimensions: '3.6×3.2m', stage: '开拓', connectivity: ['通风天井'],
  }, registry);
  const orePass = addMesh(layers.shaft, cylinderBetween(
    [-29, -1.3, HAUL_Z], [-29, 2.3, HAUL_Z], 1.2, 18,
  ), M.xray, {
    type_code: 'PASS', name: '矿石溜井', source_tier: '【图】',
    textbook_ref: '图11-24⑦；§11.6', dimensions: 'φ2.4m', stage: '开拓',
  }, registry);
  const human = addMesh(layers.shaft, boxBetween(
    [MAN_X, 2.2, RAKE_Z], [MAN_X, 62.3, dipZ(62.3, DIP)], 2.4, 2.4,
  ), M.xray, {
    type_code: 'PASS', name: '通风人行天井', source_tier: '【图】',
    textbook_ref: '图11-24④；§11.6', dimensions: '2.4×2.4m', stage: '开拓',
  }, registry);

  const drawLink = addMesh(layers.drift, hollowTunnel(
    [[MAN_X, 2.2, RAKE_Z], [RX1 + 2, 2.2, RAKE_Z]], archSection(2.8, 2.4, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '天井联络巷', source_tier: '【推】',
    textbook_ref: '图11-24；§11.6', dimensions: '2.8×2.4m', stage: '采准',
    connectivity: ['电耙道', '通风人行天井'], assumption: true,
  }, registry);

  const oreLink = addMesh(layers.drift, hollowTunnel(
    [[RX0 - 2, 2.2, RAKE_Z], [-29, 2.2, RAKE_Z], [-29, 2.2, HAUL_Z]], archSection(2.8, 2.4, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '溜井联络巷', source_tier: '【推】',
    textbook_ref: '图11-24；§11.6', dimensions: '2.8×2.4m', stage: '采准',
    connectivity: ['电耙道', '矿石溜井'], assumption: true,
  }, registry);

  function setSlice(s, state) {
    s.ore.visible = state === 'ore';
    s.muck.visible = state === 'blasted';
    s.voidWall.visible = state === 'drawn';
    s.voidOutline.visible = state === 'drawn';
    s.holes.visible = false;
  }

  // ---------------- 过程 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、矿房回采', color: '#ffcb6b' },
    { id: 'post', name: '五、采场处理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷、回风巷与溜井', reveal: ['dev'], desc: '掘下盘阶段运输巷道、上水平回风巷道，掘矿石溜井与通风人行天井。' },
    { phase: 'prep', title: '底柱内电耙道、漏斗与拉底巷道', reveal: ['prep1'], desc: '在底柱内掘电耙道、4 个漏斗及漏斗颈，掘拉底巷道，形成底部受矿—放矿系统。' },
    { phase: 'prep', title: '分段凿岩巷道与切割天井', reveal: ['prep2'], desc: '从间柱内人行天井进入 3 条分段凿岩巷道，并掘矿房端部切割天井。' },
    { phase: 'cut', title: '端部切割立槽', reveal: ['cut'], desc: '沿矿房端部拉开 3m 宽切割立槽，为深孔爆破提供自由面。' },
  ];
  for (let i = 0; i < N; i++) {
    steps.push({
      phase: 'stope', title: `第${i + 1}分条凿岩`, reveal: [`drill${i}`],
      desc: `自 3 条分段凿岩巷道向上展开凿岩，覆盖第${i + 1}分条。`,
    });
    steps.push({
      phase: 'stope', title: `第${i + 1}分条崩矿`, reveal: [`blast${i}`],
      desc: `第${i + 1}分条朝向自由面崩矿，崩落矿石暂留在该分条内。`,
    });
    steps.push({
      phase: 'stope', title: `第${i + 1}分条放矿`, reveal: [`draw${i}`],
      desc: `崩落矿石经漏斗—电耙道—溜井放出；矿房形成空场，保留底柱/顶柱/间柱。`,
    });
  }
  steps.push({ phase: 'post', title: '采场处理与矿柱管理', reveal: ['post'], desc: '矿房回采完毕；空场暂留，顶柱/底柱/间柱待后续回收或处理。' });

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
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((r) => rev.add(r));
    haulage.visible = rev.has('dev');
    airway.visible = rev.has('dev');
    orePass.visible = rev.has('dev');
    human.visible = rev.has('dev');
    rake.visible = rev.has('prep1');
    drawLink.visible = rake.visible;
    oreLink.visible = rake.visible;
    under.visible = rev.has('prep1') || rev.has('cut');
    funnels.forEach((f) => { f.visible = rev.has('prep1'); });
    necks.forEach((f) => { f.visible = rev.has('prep1'); });
    cutRaise.visible = rev.has('prep2') && !rev.has('cut');
    drillDrifts.forEach((d) => { d.visible = rev.has('prep2'); });
    slot.set(rev.has('cut'), rev.has('blast0'));

    for (let k = 0; k < N; k++) {
      let state = 'ore';
      if (rev.has(`draw${k}`)) state = 'drawn';
      else if (rev.has(`blast${k}`)) state = 'blasted';
      setSlice(slices[k], state);
    }
    const drillIdx = slices.findIndex((_, k) => steps[i].reveal?.includes(`drill${k}`));
    slices.forEach((s, k) => { s.holes.visible = k === drillIdx; });
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
    rake.visible = true; under.visible = true; drawLink.visible = true; oreLink.visible = true;
    funnels.forEach((f) => { f.visible = true; });
    necks.forEach((f) => { f.visible = true; });
    cutRaise.visible = true; drillDrifts.forEach((d) => { d.visible = true; });
    slot.set(false, false);
    slices.forEach((s) => setSlice(s, 'ore'));
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  const labels = [
    { text: '矿体', sub: '急倾斜中厚矿体 75° / 16m', pos: [-42, 48, 8], tone: '#f0a05a', height: 4.2, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘脉外', pos: [-40, -7, -37], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '矿石溜井', sub: 'φ2.4m', pos: [-29, 0, -37], tone: '#6fe3d8', height: 3.0, pri: 82, phase: 'dev' },
    { text: '电耙道', sub: '底柱内 · 2.8×2.4m', pos: [-24, 2, -10], tone: '#9fd0ff', height: 3.0, pri: 86, phase: 'prep' },
    { text: '漏斗 + 漏斗颈', sub: '4 个 · 受矿—放矿', pos: [0, 8, 8], tone: '#ffcb6b', height: 3.0, pri: 84, phase: 'prep' },
    { text: '拉底巷道', sub: '矿房底部', pos: [16, 7, 8], tone: '#9fd0ff', height: 3.0, pri: 80, phase: 'prep' },
    { text: '分段凿岩巷道', sub: '3 条 · 分段钻深孔', pos: [-8, 44, 8], tone: '#9fd0ff', height: 3.2, pri: 88, phase: 'prep' },
    { text: '切割立槽', sub: '宽3m · 贯穿矿房', pos: [-18, 30, 10], tone: '#ff7a4f', height: 3.0, pri: 82, phase: 'cut' },
    { text: '顶柱 / 底柱 / 间柱', sub: '矿柱矿量待回收', pos: [26, 30, 8], tone: '#d08a5a', height: 3.2, pri: 86, phase: 'post' },
  ];
  labels.push({ text: '分段凿岩阶段矿房', sub: '3 条分段凿岩巷道', pos: [4, 40, 10], tone: '#ffcb6b', height: 3.4, pri: 92, phase: 'stope' });
  addLabelLayer(layers.labels, labels);

  return {
    group, layers, registry,
    update(p) {
      const n = p <= 0.1 ? 0 : Math.min(N, Math.floor((p - 0.1) / 0.85 * N) + 1);
      slices.forEach((s, i) => {
        const state = p >= 0.98 || i < n - 1 ? 'drawn' : i === n - 1 ? 'blasted' : 'ore';
        setSlice(s, state);
      });
      slot.set(p > 0.1, n > 0);
      cutRaise.visible = p <= 0.1;
    },
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.4 },
    stageIndex: (p) => (p <= 0.1 ? 0 : p < 1 ? 1 : 2),
    progressText: (p) => (p <= 0.1 ? '采准' : p < 1 ? '矿房回采' : '采场处理'),
    bounds: new THREE.Box3(new THREE.Vector3(-46, -8, -48), new THREE.Vector3(46, 70, 24)),
  };
}
