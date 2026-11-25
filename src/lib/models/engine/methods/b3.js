// B-3 下向分层充填采矿法
// 依据：教材B §12.3（印316–320）、图12-11/12-13/12-14/12-15/12-16/12-17；
//       交付成果04 F-11档案、09§十一
// 展示参数：急倾斜中厚矿体 75°/10m；矿块32m×50m；间柱8m/顶柱5m/底柱5m；
//           分层3m；自上而下16层；胶结充填体底面=人工假顶。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, pillarBlock, oreBody, dippingSlab, stopeBackWall,
  cylinderBetween, boxBetween, dipZ, dashedOutline, solidOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'B-3',
  name: '下向分层充填法',
  en: 'Underhand Cut-and-Fill',
  category: '充填采矿法 · 分层充填法（表6-1 组7 / 典型方法11）',
  refs: '教材B §12.3，印316–320 · 图12-11（水力方案）、图12-16（胶结方案）、图12-17（龙首矿六角形）',
  tier: 'A 级资料（图12-16/12-17 全构件标注）',
  summary:
    '自上而下逐层回采：第一层回采后充填，充填体底面形成下一分层的"人工假顶"；' +
    '在假顶保护下回采下一分层，再充填接顶，逐层向下推进。相邻进路间隔开采，' +
    '上下分层巷道交错布置，充填体强度底强顶弱——这是充填法中"在人工顶板下作业"的典型。',
  teaching: [
    '下向回采：第一层（顶部）先采，充填后其底面成为下一层的人工假顶。',
    '人工假顶=上一分层胶结充填体底面，是下向分层法的核心安全结构。',
    '相邻进路间隔开采，上下分层巷道交错，避免上部充填体大面积暴露。',
    '溜井/人行天井随分层下降逐层消失，充填管自上部充填巷道接入。',
  ],
  stages: ['采准', '第一层回采/充填', '下向分层回采/充填', '接顶/下一矿块'],
  params: [
    ['矿体倾角 / 厚度', '75° / 10 m', '展示假设：急倾斜中厚矿体'],
    ['矿块长度 / 高度', '32 m / 60 m', '矿块沿走向30–50m'],
    ['间柱 / 顶柱 / 底柱', '8 m / 5 m / 5 m', '间柱6–8m、顶柱4–5m、底柱5m'],
    ['分层高度', '3 m', '巷道回采3–4m；展示取3m'],
    ['分层数', '16', '48m / 3m'],
    ['人工假顶', '0.3 m 胶结层', '上一分层胶结充填体底面（强度4–5MPa，印323）'],
    ['相邻进路', '间隔开采', '中间为胶结充填体；上下分层巷道交错'],
    ['顺路溜井 / 人行天井', 'φ1.5 m / 1.2×1.2 m', '随分层下降逐层消失'],
    ['充填天井', '2×2.4 m', '自上部充填巷道接入'],
    ['脱水砂门', '切割巷道两端', '图12-13/12-14'],
  ],
  assumptions: [
    '人工假顶按连续、理想胶结体表达；真实强度分带与接顶质量不建模（【假】）。',
    '相邻进路间隔开采以分层整体色带表达，未逐条进路建模（展示简化）。',
    '六角形巷道断面（龙首矿）未采用，采用矩形巷道（展示简化）。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'fill', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '矿柱（未开采）', fill: '充填体/人工假顶', shaft: '井筒',
    lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'backfill', 'current_slice', 'excavation'],
  camera: { pos: [84, 60, 152], target: [0, 28, -2] },
  defaults: { cut: 0.5, progress: 0.55 },
};

const DIP = 75, TH = 10;
const X0 = -36, X1 = 48, Y0 = 0, Y1 = 60;
const SILL_TOP = 5, STOPE_TOP = 55, CROWN_TOP = 60;
const STOPE_X0 = -16, STOPE_X1 = 16;
const LAYER_H = 3.0, CAP_H = 0.3, LAYERS = 16;
const FILL_TOP = STOPE_TOP; // 55
const FILL_MIN = FILL_TOP - LAYERS * LAYER_H;         // 第16层底 7m；5–7m 为底部残留矿体

function fillLayerY(k) { // k=1..16, top-down
  const y1 = FILL_TOP - (k - 1) * LAYER_H;
  return { y0: y1 - LAYER_H, y1 };
}

export function build(M) {
  const registry = createRegistry('B-3');
  const { group, layers } = createLayerGroups();

  // ---------------- 矿体包络 + 未开采端块 ----------------
  const envelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));
  const oreBlock = (bx0, bx1, by0, by1, label) => addMesh(layers.ore, oreBody({
    x0: bx0, x1: bx1, y0: by0, y1: by1, dip: DIP, thickness: TH, inflate: -0.06,
  }), M.oreSolid, {
    type_code: 'ORE', name: `未开采矿体（${label}）`,
    mining_state: 'unmined', mined: false, backfilled: false,
    source_tier: '【教】', textbook_ref: '§12.3，印316；图12-11',
    dimensions: `走向${bx1 - bx0}m × 厚10m × 高${by1 - by0}m`,
    stage: '—', assumption: true,
  }, registry, { renderOrder: 2 });
  oreBlock(-36, -30, 0, 60, '左端块·全高');
  oreBlock(-30, -24, 5, 55, '左端块·顶底柱之间');
  oreBlock(24, 46, 5, 55, '右端块·顶底柱之间');
  oreBlock(46, 48, 0, 60, '右端块');

  // ---------------- 矿柱：底柱/顶柱/间柱 ----------------
  addMesh(layers.pillar, pillarBlock({ x0: -30, x1: 34, y0: 0, y1: SILL_TOP, dip: DIP, halfThick: TH / 2 }), M.pillar, {
    type_code: 'PILLAR-R', name: '底柱', source_tier: '【教】', textbook_ref: '§12.3.1，印317',
    dimensions: '高5m', stage: '—',
  }, registry);
  addMesh(layers.pillar, pillarBlock({ x0: -30, x1: 34, y0: STOPE_TOP, y1: CROWN_TOP, dip: DIP, halfThick: TH / 2 }), M.pillar, {
    type_code: 'PILLAR-R', name: '顶柱', source_tier: '【教】', textbook_ref: '§12.3.1，印317',
    dimensions: '厚5m', stage: '—',
  }, registry);
  [[-24, -16, '左间柱'], [16, 24, '右间柱']].forEach(([x0, x1, nm]) => {
    addMesh(layers.pillar, pillarBlock({ x0, x1, y0: 0, y1: CROWN_TOP, dip: DIP, halfThick: TH / 2 }), M.pillar, {
      type_code: 'PILLAR-R', name: nm, source_tier: '【教】', textbook_ref: '§12.3.1，印316',
      dimensions: '宽8m，全高', stage: '—',
    }, registry);
  });

  // ---------------- 采场空区（暗色后壁 + 虚线轮廓） ----------------
  const backGeo = stopeBackWall({
    x0: STOPE_X0 + 0.06, x1: STOPE_X1 - 0.06, y0: SILL_TOP, y1: STOPE_TOP,
    dip: DIP, thickness: TH, zOffset: 0.08,
  });
  const outlineGeo = dippingSlab({
    x0: STOPE_X0 + 0.06, x1: STOPE_X1 - 0.06, y0: SILL_TOP, y1: STOPE_TOP,
    dip: DIP, thickness: TH, inset: 0.03,
  });
  const stopeVoidMesh = addMesh(layers.stope, backGeo, M.stopeBack, {
    type_code: 'STOPE-A', name: '矿房（下向分层回采空间）',
    mining_state: 'mined_out', mined: true, backfilled: false,
    source_tier: '【教】', textbook_ref: '§12.3，印316–320；图12-11',
    dimensions: '长32m × 厚10m × 高50m', stage: '回采/充填',
  }, registry, { renderOrder: 7 });
  stopeVoidMesh.userData.isStopeVoid = true;
  const stopeOutline = dashedOutline(outlineGeo, 0xffc178, 0.45, 2.0, 1.8);
  layers.stope.add(stopeOutline);

  // ---------------- 充填层：自上而下，胶结铺面在层底（人工假顶） ----------------
  const layerGroups = [];
  for (let k = 1; k <= LAYERS; k++) {
    const { y0, y1 } = fillLayerY(k);
    const yCapTop = y0 + CAP_H;
    const lg = new THREE.Group();
    lg.name = `b3-fill-layer-${k}`;
    const body = new THREE.Mesh(dippingSlab({
      x0: STOPE_X0 + 0.18, x1: STOPE_X1 - 0.18, y0: yCapTop, y1,
      dip: DIP, thickness: TH - 0.36,
    }), k % 2 === 0 ? M.fillWater : M.fillWaterAlt);
    lg.add(body);
    const cap = new THREE.Mesh(dippingSlab({
      x0: STOPE_X0 + 0.12, x1: STOPE_X1 - 0.12, y0, y1: yCapTop,
      dip: DIP, thickness: TH - 0.24,
    }), M.fillCap);
    lg.add(cap);
    lg.visible = false;
    layers.fill.add(lg);
    registry.tag(body, {
      type_code: 'FILL', name: `下向第${k}分层充填体（胶结铺面在层底）`,
      mining_state: 'backfill', mined: true, backfilled: true,
      source_tier: '【教】', textbook_ref: '§12.3.2，印319；图12-16',
      dimensions: '层高3m = 水砂2.7m + 层底胶结铺面0.3m',
      stage: '充填',
    });
    layerGroups.push(lg);
  }

  // ---------------- 动态剩余矿体（当前分层以下） ----------------
  const remainingOre = new THREE.Mesh(new THREE.BufferGeometry(), M.oreRemaining);
  layers.ore.add(remainingOre);
  registry.tag(remainingOre, {
    type_code: 'ORE', name: '未采矿体（人工假顶下方剩余矿体）',
    mining_state: 'unmined', mined: false, backfilled: false,
    source_tier: '【教】', textbook_ref: '§12.3，印316；图12-11',
    dimensions: '随人工假顶下移而缩小，最终剩底柱以上2m',
    stage: '回采', assumption: true,
  });

  // ---------------- 巷道/井筒 ----------------
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-36, -3.4, dipZ(2.5, DIP)], [50, -3.4, dipZ(2.5, DIP)]], archSection(4.2, 3.4, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道', source_tier: '【图】', textbook_ref: '图12-11；§12.3.1',
    elevation_z: -3.4, dimensions: '断面4.2×3.4m', stage: '采准', connectivity: ['底柱出矿口', '溜井'],
  }, registry);

  const topAirway = addMesh(layers.drift, hollowTunnel(
    [[-36, 62, dipZ(62, DIP)], [50, 62, dipZ(62, DIP)]], archSection(3.5, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '上水平回风/充填巷道', source_tier: '【图】', textbook_ref: '图12-11；§12.3.1',
    elevation_z: 62, dimensions: '断面3.5×3.2m', stage: '采准', connectivity: ['充填天井'],
  }, registry);

  // 顶部第一层切割巷道（沿下盘接触带）
  const cutDrift = addMesh(layers.drift, hollowTunnel(
    [[STOPE_X0 + 1, 53, dipZ(53, DIP) - 4.0], [STOPE_X1 - 1, 53, dipZ(53, DIP) - 4.0]],
    archSection(3.0, 3.0, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '第一分层切割巷道（下盘接触带）',
    source_tier: '【图】', textbook_ref: '图12-11⑦；§12.3.1.2',
    elevation_z: 53, dimensions: '断面3.0×3.0m', stage: '切割',
    connectivity: ['回采巷道', '溜井'],
  }, registry);

  const orePassPoint = (y) => [-10, y, dipZ(y, DIP) - 3.2];
  const orePassBase = orePassPoint(-3.4);
  const oreShaft = addMesh(layers.shaft, cylinderBetween(
    orePassBase, orePassPoint(STOPE_TOP), 0.75, 18,
  ), M.xray, {
    type_code: 'PASS', name: '顺路溜井（随分层下降逐层消失）',
    source_tier: '【教】', textbook_ref: '图12-11⑤；§12.3.1.2',
    dimensions: 'φ1.5m，随分层下降', stage: '采准/回采',
  }, registry);
  const oreLining = addMesh(layers.shaft, cylinderBetween(
    orePassBase, orePassPoint(STOPE_TOP), 0.45, 16,
  ), M.funnel, {
    type_code: 'PASS', name: '顺路溜井内壁', source_tier: '【图】', textbook_ref: '图12-11⑤',
    dimensions: '内径φ0.9m', stage: '采准/回采',
  }, registry);

  const humanShaft = addMesh(layers.shaft, boxBetween(
    [8, -3.4, dipZ(-3.4, DIP) - 3.0], [8, 62, dipZ(62, DIP)], 1.2, 1.2,
  ), M.xray, {
    type_code: 'PASS', name: '人行天井（渐变为充填料中混凝土天井）',
    source_tier: '【教】', textbook_ref: '图12-11；§12.3.1.2',
    dimensions: '1.2×1.2m', stage: '采准/回采',
  }, registry);

  const fillShaft = addMesh(layers.shaft, boxBetween(
    [20, STOPE_TOP, dipZ(STOPE_TOP, DIP) - 2.5], [20, 62, dipZ(62, DIP)], 2.0, 2.4,
  ), M.xray, {
    type_code: 'PASS', name: '充填天井 ②',
    source_tier: '【教】', textbook_ref: '图12-11②；§12.3.1',
    dimensions: '2×2.4m，内设充填管', stage: '采准/充填',
  }, registry);

  // ---------------- 当前分层框 + 人工假顶标注 ----------------
  const currentSlice = solidOutline(new THREE.BoxGeometry(1, 1, 1), 0xffcb6b, 0.92);
  currentSlice.visible = false;
  layers.stope.add(currentSlice);
  function contactLine(color, opacity) {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(STOPE_X0 + 0.3, 0, 0),
      new THREE.Vector3(STOPE_X1 - 0.3, 0, 0),
    ]);
    const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    l.visible = false;
    layers.stope.add(l);
    return l;
  }
  const roofLine = contactLine(0xd8f3e4, 0.95);
  const floorLine = contactLine(0xffcb6b, 0.92);
  let roofSprite = null;

  let fillCount = 0;
  let oreTop = FILL_TOP;
  let sliceMode = 'full';

  function setState(fillN, oreTopY, mode, shaftsReady = true) {
    sliceMode = mode;
    fillCount = Math.max(0, Math.min(LAYERS, fillN));
    oreTop = Math.max(SILL_TOP, Math.min(FILL_TOP, oreTopY));
    for (let i = 0; i < LAYERS; i++) layerGroups[i].visible = i < fillCount;
    const fillBottom = FILL_TOP - fillCount * LAYER_H;

    const shaftTop = mode === 'mine' ? oreTop : fillBottom;
    for (const [mesh, radius, segments] of [[oreShaft, 0.75, 18], [oreLining, 0.45, 16]]) {
      mesh.visible = shaftsReady && fillCount < LAYERS;
      if (!mesh.visible) continue;
      mesh.geometry.dispose();
      mesh.geometry = cylinderBetween(orePassBase, orePassPoint(shaftTop), radius, segments);
    }

    const hasVoid = fillBottom > oreTop + 0.05;
    stopeVoidMesh.visible = hasVoid;
    stopeOutline.visible = hasVoid;
    if (hasVoid) {
      const span = { x0: STOPE_X0 + 0.06, x1: STOPE_X1 - 0.06, y0: oreTop, y1: fillBottom, dip: DIP, thickness: TH };
      stopeVoidMesh.geometry.dispose();
      stopeVoidMesh.geometry = stopeBackWall(span);
      const volume = dippingSlab(span);
      stopeOutline.geometry.dispose();
      stopeOutline.geometry = new THREE.EdgesGeometry(volume, 18);
      stopeOutline.computeLineDistances();
      volume.dispose();
    }

    // 剩余矿体：从底柱顶到 oreTop
    if (oreTop > SILL_TOP + 0.3) {
      remainingOre.visible = true;
      remainingOre.geometry.dispose();
      remainingOre.geometry = dippingSlab({
        x0: STOPE_X0 + 0.1, x1: STOPE_X1 - 0.1,
        y0: SILL_TOP, y1: oreTop, dip: DIP, thickness: TH - 0.2,
      });
    } else {
      remainingOre.visible = false;
    }

    // 当前分层框：每次只在假顶下方打开一个 3m 分层
    if (mode === 'mine' && fillBottom > oreTop + 0.5) {
      currentSlice.visible = true;
      const sliceGeo = dippingSlab({
        x0: STOPE_X0 + 0.55, x1: STOPE_X1 - 0.55,
        y0: oreTop, y1: fillBottom, dip: DIP, thickness: TH - 0.7,
      });
      currentSlice.geometry.dispose();
      currentSlice.geometry = new THREE.EdgesGeometry(sliceGeo, 18);
      sliceGeo.dispose();
      currentSlice.computeLineDistances();
    } else {
      currentSlice.visible = false;
    }
    syncRoof();
  }

  function syncRoof() {
    const fillBottom = FILL_TOP - fillCount * LAYER_H;
    const faceZ = (y) => dipZ(y, DIP) + TH / 2 + 0.06;
    roofLine.visible = fillCount > 0 && sliceMode === 'mine';
    roofLine.position.set(0, fillBottom, faceZ(fillBottom));
    floorLine.visible = sliceMode === 'mine';
    floorLine.position.set(0, oreTop, faceZ(oreTop));
    if (!roofSprite) return;
    roofSprite.visible = fillCount > 0 && sliceMode === 'mine';
    roofSprite.position.set(0, Math.max(fillBottom - 1.2, oreTop + 0.8), 9);
  }

  function update(p) {
    if (p <= 0.02) { setState(0, FILL_TOP, 'full'); return; }
    if (p >= 1) { setState(LAYERS, FILL_MIN, 'fill'); return; }
    const fillN = Math.floor(p * LAYERS);
    setState(fillN, fillLayerY(fillN + 1).y0, 'mine');
  }

  // ---------------- 过程演示 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割/首层', color: '#ff7a4f' },
    { id: 'stope', name: '四、下向分层回采', color: '#ffcb6b' },
    { id: 'fill', name: '五、分层充填与接顶', color: '#8fd6b0' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷与上水平回风/充填巷', fill: 0, oreTop: FILL_TOP, mode: 'full',
      desc: '掘阶段运输巷道与上水平回风/充填巷道，建立矿块外部运输、通风与充填通道。',
      reveal: ['dev'] },
    { phase: 'prep', title: '顺路溜井、人行天井、充填天井与首层切割巷道', fill: 0, oreTop: FILL_TOP, mode: 'full',
      desc: '布置顺路溜井、人行天井、充填天井，并沿下盘接触带掘第一分层切割巷道；顺路溜井配合分层下降，已充填层内的溜井段逐层隐去。',
      reveal: ['prep'] },
  ];
  for (let c = 1; c <= LAYERS; c++) {
    const fillN = c - 1;
    const mineTop = fillLayerY(c).y0;
    steps.push({
      phase: c === 1 ? 'cut' : 'stope',
      title: c === 1 ? '第 1 分层回采（首层切割）' : `第 ${c} 分层回采`,
      fill: fillN, oreTop: mineTop, mode: 'mine',
      desc: `在人工假顶（或首层顶板）保护下回采第 ${c} 分层（3 m），本步骤仅打开一层；先形成胶结人工假顶，再向下推进。`,
      reveal: c === 1 ? ['cut'] : [],
    });
    steps.push({
      phase: 'fill',
      title: `第 ${c} 分层充填${c === LAYERS ? ' / 接顶完成' : ''}`,
      fill: c, oreTop: mineTop, mode: 'fill',
      desc: c === LAYERS ? '充填最后一层并接顶，底柱以上保留 2 m 矿体。' : `充填第 ${c} 分层，底部胶结铺面成为下一分层的人工假顶。`,
      reveal: [],
    });
  }

  const LABEL_VIS = {
    prep: ['prep', 'cut'],
    cut: ['cut'],
    stope: ['cut', 'stope'],
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
    const visible = new Set();
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((key) => visible.add(key));
    haulage.visible = visible.has('dev');
    topAirway.visible = visible.has('dev');
    cutDrift.visible = visible.has('prep') || visible.has('cut');
    humanShaft.visible = visible.has('prep');
    fillShaft.visible = visible.has('prep');
    setState(step.fill, step.oreTop, step.mode, visible.has('prep'));
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; topAirway.visible = true; cutDrift.visible = true;
    humanShaft.visible = true; fillShaft.visible = true;
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
    syncRoof();
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜中厚 75° / 10m', pos: [-42, 46, 8], tone: '#f0a05a', height: 4.2, pri: 94, phase: 'always' },
    { text: '下向分层', sub: '自上而下 16 层 × 3m', pos: [20, 40, 6], tone: '#8fd6b0', height: 3.4, pri: 88, phase: 'stope' },
    { text: '充填体', sub: '胶结铺面在层底', pos: [20, 30, 6], tone: '#8fd6b0', height: 3.2, pri: 86, phase: 'fill' },
    { text: '顺路溜井', sub: '随分层下降逐层消失', pos: [-10, 58, -14], tone: '#6fe3d8', height: 3.0, pri: 84, phase: 'prep' },
    { text: '人行天井', sub: '渐变为充填料中混凝土天井', pos: [8, 58, -14], tone: '#6fe3d8', height: 3.0, pri: 82, phase: 'prep' },
    { text: '充填天井 ②', sub: '2×2.4m', pos: [22, 64, -20], tone: '#6fe3d8', height: 3.0, pri: 80, phase: 'prep' },
    { text: '第一分层切割巷道', sub: '沿下盘接触带', pos: [-18, 51, 8], tone: '#ff7a4f', height: 3.0, pri: 78, phase: 'cut' },
    { text: '未采矿体', sub: '人工假顶下方', pos: [0, 20, 8], tone: '#c97a46', height: 3.2, pri: 76, phase: 'stope' },
  ]);
  const roofLabel = addLabelLayer(layers.labels, [
    { text: '人工假顶（胶结面）', sub: '充填体底面 · 下向回采的安全顶板', pos: [0, 50, 9], tone: '#ffd166', height: 3.2, pri: 99, phase: 'dynamic' },
  ]);
  roofSprite = roofLabel.children[0];

  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.3 },
    stageIndex: (p) => (p <= 0.02 ? 0 : p < 1 / LAYERS ? 1 : p < 1 ? 2 : 3),
    progressText: (p) => (p <= 0.02 ? '采准' : p < 1 ? '下向分层回采/充填' : '接顶完成'),
    bounds: new THREE.Box3(new THREE.Vector3(-44, -8, -38), new THREE.Vector3(54, 68, 22)),
  };
}
