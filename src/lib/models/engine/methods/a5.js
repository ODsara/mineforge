// A-5 分段矿房法
// 依据：教材B §11.5（印290–292）、图11-23；交付成果04 A-5档案、09§八
// 急倾斜中厚矿体；阶段内分 3 个分段（15m）；每分段设下盘分段运输平巷、
// 装运横巷、堑沟平巷、靠上盘凿岩平巷；分段间留斜顶柱；端部切割横巷/天井/立槽。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, pillarBlock, oreBody, dippingSlab, stopeBackWall,
  funnelCavity, shaftBox, cylinderBetween, boxBetween, dipZ,
  dashedOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';
import { buildEndSlot, sectionTraces } from './stageGeometry.js';

export const meta = {
  code: 'A-5',
  name: '分段矿房法',
  en: 'Sublevel Room Stoping',
  category: '空场采矿法 · 分段矿房法（表6-1 组8 / 典型方法4）',
  refs: '教材B §11.5，印290–292 · 图11-23（分段矿房典型方案）',
  tier: 'A 级资料（图11-23 全构件标注）',
  summary:
    '阶段内划分 3 个分段，每个分段布置独立的分段矿房：下盘分段运输平巷经装运横巷通到堑沟平巷，' +
    '靠上盘掘凿岩平巷；分段之间留斜顶柱，矿房之间留间柱。端部切割横巷/天井形成切割槽，' +
    '分段凿岩、崩矿，矿石经堑沟—装运横巷—分段运输平巷运出。',
  teaching: [
    '分段矿房 = 阶段内按 15m 分段布置矿房，每个分段有独立的运输、堑沟、凿岩系统。',
    '下盘分段运输平巷 + 装运横巷 + 堑沟平巷 + 靠上盘凿岩平巷，是无轨分段矿房的典型采准。',
    '分段之间留斜顶柱，矿房之间留间柱；矿柱矿量较大。',
    '端部切割横巷/天井形成切割槽；分段凿岩、崩矿，矿石经堑沟自重放出。',
  ],
  stages: ['采准（分段系统）', '切割', '分段凿岩/崩矿', '放矿与矿柱管理'],
  params: [
    ['矿体倾角 / 厚度', '75° / 14 m', '急倾斜中厚矿体【假】'],
    ['阶段高度', '60 m', '40–60 m【教】'],
    ['分段高度 / 分段数', '15 m / 3', '15–25 m【教】'],
    ['矿房沿走向长度', '40 m', '35–40 m【教】'],
    ['间柱 / 斜顶柱', '16 m / 3 m', '间柱 6–8 m、斜顶柱 5–6 m【教】/展示'],
    ['分段运输平巷', '3.6×3.4 m', '下盘脉外【图】'],
    ['装运横巷', '3.0×3.0 m，间距约 12 m', '图11-23②【图】'],
    ['堑沟平巷', '3.0×3.0 m', '图11-23③【图】'],
    ['凿岩平巷', '3.0×3.0 m，靠上盘', '图11-23④【图】'],
    ['切割横巷 / 切割天井', '3.0×3.0 m / 2×2 m', '图11-23⑥⑨【图】'],
    ['漏斗 / 漏斗颈', '3 个/分段，上口 r2.2 m', '堑沟受矿【图】'],
    ['斜坡道', '3.6×3.8 m', '联通各分段运输平巷【图】/【假】'],
  ],
  assumptions: [
    '矿体倾角、厚度、间柱宽度为展示值【假】。',
    '斜顶柱按 3m 水平矿柱带表达；教材为斜顶柱，倾角未建模【假】。',
    '装运横巷按 3 条/分段、间距约 12m 表达；实际按 10–12m 布置【图】。',
    '崩矿视图以纹理示意分段内崩落矿石，放矿完成后显示空场【假】。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'muck', 'cut', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '矿柱（间柱/斜顶柱）', muck: '崩落矿石', cut: '切割工程',
    shaft: '井筒', lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'caved_ore', 'excavation'],
  camera: { pos: [142, 100, 122], target: [0, 28, -6] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 75, TH = 14;
const X0 = -36, X1 = 36, Y0 = 0, Y1 = 60;
const RX0 = -20, RX1 = 20, SILL = 6, CROWN = 51;
const HAUL_Z = -40;
const RAMP_Z = -48;
const SUBS = [
  { id: 'SL1', y0: 6, y1: 21, oreTop: 18 },
  { id: 'SL2', y0: 21, y1: 36, oreTop: 33 },
  { id: 'SL3', y0: 36, y1: 51, oreTop: 48 },
];

export function build(M) {
  const registry = createRegistry('A-5');
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
      textbook_ref: '图11-23；§11.5', dimensions: '宽16m，高45m', stage: '—',
    }, registry);
  });
  addMesh(layers.pillar, pillarBlock({
    x0: -36, x1: 36, y0: 0, y1: SILL, dip: DIP, halfThick: TH / 2, margin: 0,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '阶段底柱', source_tier: '【图】',
    textbook_ref: '图11-23；§11.5', dimensions: '高6m', stage: '—',
  }, registry);
  addMesh(layers.pillar, pillarBlock({
    x0: -36, x1: 36, y0: CROWN, y1: 60, dip: DIP, halfThick: TH / 2, margin: 0,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '顶柱', source_tier: '【图】',
    textbook_ref: '图11-23；§11.5', dimensions: '厚9m', stage: '—',
  }, registry);
  // 斜顶柱（3 道）
  [18, 33, 48].forEach((y0) => {
    addMesh(layers.pillar, pillarBlock({
      x0: RX0, x1: RX1, y0, y1: y0 + 3, dip: DIP, halfThick: TH / 2, margin: 0,
    }), M.pillar, {
      type_code: 'PILLAR-R', name: '斜顶柱', source_tier: '【图】',
      textbook_ref: '图11-23⑩；§11.5', dimensions: '厚3m（水平带示意）', stage: '—',
      assumption: true,
    }, registry);
  });

  // ---------------- 分段矿房 ----------------
  const subs = SUBS.map((sl) => {
    const ore = addMesh(layers.ore, dippingSlab({
      x0: RX0 + 3, x1: RX1 - 0.06, y0: sl.y0, y1: sl.oreTop,
      dip: DIP, thickness: TH, inset: 0.06,
    }), M.oreSolid, {
      type_code: 'ORE', name: `${sl.id} 分段矿房矿体`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【图】', textbook_ref: '图11-23；§11.5',
      dimensions: '40m × 厚14m × 高12m', stage: '—', assumption: true,
    }, registry, { renderOrder: 2 });

    const muck = new THREE.Mesh(dippingSlab({
      x0: RX0 + 3.08, x1: RX1 - 0.15, y0: sl.y0, y1: sl.oreTop - 0.1,
      dip: DIP, thickness: TH, inset: 0.15,
    }), M.cavedOre);
    muck.visible = false;
    layers.muck.add(muck);
    registry.tag(muck, {
      type_code: 'MUCK', name: `${sl.id} 崩落矿石`,
      mining_state: 'caved_ore', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§11.5；图11-23',
      dimensions: '分段矿房内崩落矿石', stage: '放矿', assumption: true,
    }, registry, { renderOrder: 5 });

    const back = stopeBackWall({
      x0: RX0 + 0.06, x1: RX1 - 0.06, y0: sl.y0, y1: sl.oreTop,
      dip: DIP, thickness: TH, zOffset: 0.08,
    });
    const voidWall = new THREE.Mesh(back, M.stopeBack);
    voidWall.visible = false;
    layers.stope.add(voidWall);
    registry.tag(voidWall, {
      type_code: 'STOPE-A', name: `${sl.id} 矿房空场`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【推】', textbook_ref: '§11.5',
      dimensions: '40m × 厚14m × 高12m', stage: '回采',
    }, registry, { renderOrder: 7 });
    const voidOutline = dashedOutline(dippingSlab({
      x0: RX0 + 0.08, x1: RX1 - 0.08, y0: sl.y0, y1: sl.oreTop,
      dip: DIP, thickness: TH, inset: 0.04,
    }), 0xffc178, 0.35, 2.0, 1.8);
    voidOutline.visible = false;
    layers.stope.add(voidOutline);

    return { ...sl, ore, muck, voidWall, voidOutline, parts: [] };
  });

  // ---------------- 每分段采准/切割 ----------------
  subs.forEach((sl, i) => {
    const driftY = sl.y0 + 2.5;
    const zCenter = dipZ(driftY, DIP) - TH / 2 + 2.3;
    const zFoot = dipZ(driftY, DIP) - TH / 2 - 18;
    const side = i % 2 === 0 ? 1 : -1;
    const junctionZ = RAMP_Z - (i + 1) * 9;

    const haul = addMesh(layers.drift, hollowTunnel(
      [[RX0 - 8, driftY, zFoot], [RX1 + 8, driftY, zFoot]], archSection(3.6, 3.4, 9),
    ), M.drift, {
      type_code: 'DRIFT', name: `${sl.id} 分段运输平巷`,
      source_tier: '【图】', textbook_ref: '图11-23①；§11.5',
      elevation_z: driftY, dimensions: '3.6×3.4m，下盘脉外',
      stage: '采准', connectivity: ['装运横巷', '斜坡道'],
    }, registry);
    const rampLink = addMesh(layers.drift, hollowTunnel(
      [[side * 27, driftY, zFoot], [side * 27, driftY, junctionZ], [side * 47, driftY, junctionZ]],
      archSection(3.6, 3.4, 9),
    ), M.drift, {
      type_code: 'DRIFT', name: `${sl.id} 斜坡道联络巷`, source_tier: '【推】',
      textbook_ref: '图11-23；§11.5', dimensions: '3.6×3.4m', stage: '采准',
      connectivity: ['分段运输平巷', '斜坡道'], assumption: true,
    }, registry);
    const passLink = addMesh(layers.drift, hollowTunnel(
      [[-27, driftY, zFoot], [-27, driftY, HAUL_Z], [-30, driftY, HAUL_Z]],
      archSection(3, 3, 9),
    ), M.drift, {
      type_code: 'DRIFT', name: `${sl.id} 溜井联络巷`, source_tier: '【推】',
      textbook_ref: '图11-23；§11.5', dimensions: '3.0×3.0m', stage: '采准',
      connectivity: ['分段运输平巷', '矿石溜井'], assumption: true,
    }, registry);
    sl.parts.push(haul, rampLink, passLink);

    [-12, 0, 12].forEach((x) => {
      const c = addMesh(layers.drift, hollowTunnel(
        [[x, driftY, zFoot], [x, driftY, zCenter]], archSection(3.0, 3.0, 9),
      ), M.driftXray, {
        type_code: 'DRIFT', name: `${sl.id} 装运横巷（x${x}）`,
        source_tier: '【图】', textbook_ref: '图11-23②；§11.5',
        elevation_z: driftY, dimensions: '3.0×3.0m',
        stage: '采准', connectivity: ['分段运输平巷', '堑沟平巷'],
      }, registry);
      sl.parts.push(c);
    });

    const trench = addMesh(layers.drift, hollowTunnel(
      [[RX0, driftY, zCenter], [RX1, driftY, zCenter]], archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${sl.id} 堑沟平巷`,
      source_tier: '【图】', textbook_ref: '图11-23③；§11.5',
      elevation_z: driftY, dimensions: '3.0×3.0m，沿走向',
      stage: '采准', connectivity: ['装运横巷', '漏斗'],
    }, registry);
    sl.parts.push(trench);

    const drillY = sl.y0 + 1.2;
    const drillZ = dipZ(drillY, DIP) + TH / 2 - 2.6;
    const drill = addMesh(layers.drift, hollowTunnel(
      [[RX0 + 1.5, drillY, drillZ], [RX1 - 1, drillY, drillZ]],
      archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${sl.id} 凿岩平巷`,
      source_tier: '【图】', textbook_ref: '图11-23④；§11.5',
      elevation_z: drillY, dimensions: '3.0×3.0m，靠上盘',
      stage: '采准', connectivity: ['切割横巷', '矿房'],
    }, registry);
    sl.parts.push(drill);
    sl.holes = sectionTraces([-12, 0, 12].map((x) => ({
      x,
      from: [drillY + 1.1, drillZ],
      to: [
        [sl.oreTop - 1.8, dipZ(sl.oreTop - 1.8, DIP) - 5.1],
        [sl.oreTop - 0.3, dipZ(sl.oreTop - 0.3, DIP)],
        [sl.oreTop - 1.8, dipZ(sl.oreTop - 1.8, DIP) + 4.5],
      ],
    })));
    processFx.add(sl.holes);

    // 漏斗/颈
    [-12, 0, 12].forEach((x) => {
      const zc = zCenter;
      const fb = sl.y0 + 4.8;
      const ft = sl.y0 + 7.4;
      const cone = new THREE.Mesh(funnelCavity(x, zc, fb, ft, 0.6, 2.2, 18), M.funnel);
      layers.stope.add(cone);
      registry.tag(cone, {
        type_code: 'STOPE-A', name: `${sl.id} 漏斗（x${x}）`,
        mining_state: 'excavation', mined: true, backfilled: false,
        source_tier: '【图】', textbook_ref: '图11-23③；§11.5',
        dimensions: '上口r2.2m', stage: '采准',
      });
      sl.parts.push(cone);
      const neck = new THREE.Mesh(cylinderBetween([x, driftY + 1.6, zc], [x, fb, zc], 0.6), M.funnel);
      layers.stope.add(neck);
      registry.tag(neck, {
        type_code: 'PASS', name: `${sl.id} 漏斗颈（x${x}）`,
        mining_state: 'excavation', mined: true, backfilled: false,
        source_tier: '【图】', textbook_ref: '图11-23③；§11.5',
        dimensions: 'φ1.2m', stage: '采准',
      });
      sl.parts.push(neck);
    });

    // 切割横巷/天井/立槽
    const cutCross = addMesh(layers.cut, hollowTunnel(
      [[RX0 + 1.5, driftY, zFoot], [RX0 + 1.5, driftY, zCenter], [RX0 + 1.5, drillY, drillZ]], archSection(3.0, 3.0, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: `${sl.id} 切割横巷`,
      source_tier: '【图】', textbook_ref: '图11-23⑥；§11.5',
      elevation_z: driftY, dimensions: '3.0×3.0m', stage: '切割',
    }, registry);
    sl.parts.push(cutCross);
    const cutRaise = addMesh(layers.cut, boxBetween(
      [RX0 + 1.5, driftY, zCenter], [RX0 + 1.5, sl.oreTop, zCenter], 2, 2,
    ), M.xray, {
      type_code: 'PASS', name: `${sl.id} 切割天井`,
      source_tier: '【图】', textbook_ref: '图11-23⑨；§11.5',
      dimensions: '2×2m', stage: '切割',
    }, registry);
    sl.parts.push(cutRaise);

    sl.slot = buildEndSlot(layers, registry, M, {
      x0: RX0 + 0.06, x1: RX0 + 3, y0: sl.y0, y1: sl.oreTop, dip: DIP, thickness: TH, inset: 0.06,
    }, `${sl.id} 切割立槽`, '图11-23；§11.5');
    sl.cutCross = cutCross;
    sl.cutRaise = cutRaise;
  });

  // ---------------- 开拓：阶段运输巷、回风巷、溜井、斜坡道 ----------------
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-50, -4, HAUL_Z], [50, -4, HAUL_Z]], archSection(4.2, 3.6, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道', source_tier: '【图】',
    textbook_ref: '图11-23；§11.5', elevation_z: -4,
    dimensions: '4.2×3.6m', stage: '开拓', connectivity: ['溜井', '斜坡道'],
  }, registry);
  const airway = addMesh(layers.drift, hollowTunnel(
    [[-50, 62, HAUL_Z], [50, 62, HAUL_Z]], archSection(3.6, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '上水平回风巷道', source_tier: '【图】',
    textbook_ref: '图11-23；§11.5', elevation_z: 62,
    dimensions: '3.6×3.2m', stage: '开拓', connectivity: ['通风天井'],
  }, registry);
  const orePass = addMesh(layers.shaft, cylinderBetween(
    [-30, -1.3, HAUL_Z], [-30, 39, HAUL_Z], 1.2, 18,
  ), M.xray, {
    type_code: 'PASS', name: '矿石溜井', source_tier: '【图】',
    textbook_ref: '图11-23；§11.5', dimensions: 'φ2.4m', stage: '开拓',
  }, registry);
  const human = addMesh(layers.shaft, shaftBox(28, 30.4, HAUL_Z - 1.2, HAUL_Z + 1.2, -1.3, 62.3), M.xray, {
    type_code: 'PASS', name: '通风人行天井', source_tier: '【图】',
    textbook_ref: '图11-23；§11.5', dimensions: '2.4×2.4m', stage: '开拓',
  }, registry);
  const rampRoute = [
    [-47, -4, HAUL_Z],
    [-47, -4, RAMP_Z],
    ...SUBS.flatMap((sl, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const y = sl.y0 + 2.5;
      const z = RAMP_Z - (i + 1) * 9;
      return [[side * 44, y, z + 3], [side * 47, y, z], [side * 44, y, z - 3]];
    }),
  ];
  const ramp = addMesh(layers.drift, hollowTunnel(rampRoute, archSection(3.6, 3.8, 10)), M.drift, {
    type_code: 'DRIFT', name: '斜坡道（联通各分段运输平巷）',
    source_tier: '【图】', textbook_ref: '图11-23；§11.5',
    dimensions: '3.6×3.8m', stage: '开拓', connectivity: ['阶段运输巷道', '斜坡道联络巷'],
  }, registry);

  function setSub(sl, state, cutOpen) {
    sl.ore.visible = state === 'ore';
    sl.muck.visible = state === 'blasted';
    sl.voidWall.visible = state === 'drawn';
    sl.voidOutline.visible = state === 'drawn';
    sl.holes.visible = false;
    sl.slot.set(cutOpen, state !== 'ore');
    sl.cutRaise.visible = sl.cutCross.visible && !cutOpen;
  }

  function update(p) {
    const n = p <= 0.12 ? 0 : Math.min(subs.length, Math.floor((p - 0.12) / 0.85 * subs.length) + 1);
    subs.forEach((sl, i) => {
      const state = p >= 0.98 || i < n - 1 ? 'drawn' : i === n - 1 ? 'blasted' : 'ore';
      setSub(sl, state, p > 0.12);
    });
  }

  // ---------------- 过程 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准（分段系统）', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、分段回采', color: '#ffcb6b' },
    { id: 'post', name: '五、采场处理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷、回风巷、溜井与斜坡道', reveal: ['dev'],
      desc: '掘阶段运输巷道、回风巷道、矿石溜井、人行天井和斜坡道，形成各分段的运输/通风通道。' },
  ];
  SUBS.forEach((sl, i) => {
    steps.push({
      phase: 'prep', title: `${sl.id} 分段运输平巷、装运横巷、堑沟平巷与凿岩平巷`,
      reveal: [`prep${i}`],
      desc: `在 ${sl.id} 掘下盘分段运输平巷，经 3 条装运横巷通到堑沟平巷；靠上盘掘凿岩平巷，并扩 3 个漏斗。`,
    });
  });
  steps.push({ phase: 'cut', title: '三个分段切割横巷/天井/立槽', reveal: ['cut'],
    desc: '每个分段端部掘切割横巷与切割天井，拉开 3m 宽切割立槽，为分段凿岩提供自由面。' });
  SUBS.forEach((sl, i) => {
    steps.push({ phase: 'stope', title: `${sl.id} 凿岩`, reveal: [`drill${i}`],
      desc: `在 ${sl.id} 凿岩平巷钻上向扇形中深孔，覆盖分段矿房。` });
    steps.push({ phase: 'stope', title: `${sl.id} 崩矿`, reveal: [`blast${i}`],
      desc: `${sl.id} 向切割立槽爆破，崩落矿石充满分段矿房。` });
    steps.push({ phase: 'stope', title: `${sl.id} 放矿`, reveal: [`draw${i}`],
      desc: `${sl.id} 矿石经堑沟—装运横巷—分段运输平巷运出；矿房形成空场，斜顶柱/间柱保留。` });
  });
  steps.push({ phase: 'post', title: '采场处理与矿柱管理', reveal: ['post'],
    desc: '3 个分段回采完毕；分段空场保持，斜顶柱、间柱、顶底柱待回收或处理。' });

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
    ramp.visible = rev.has('dev');
    subs.forEach((sl, k) => {
      sl.parts.forEach((o) => { o.visible = rev.has(`prep${k}`) || rev.has('cut'); });
      sl.cutCross.visible = rev.has(`prep${k}`) || rev.has('cut');
    });
    for (let k = 0; k < subs.length; k++) {
      let st = 'ore';
      if (rev.has(`draw${k}`)) st = 'drawn';
      else if (rev.has(`blast${k}`)) st = 'blasted';
      setSub(subs[k], st, rev.has('cut'));
    }
    const drillIdx = SUBS.findIndex((_, k) => steps[i].reveal?.includes(`drill${k}`));
    subs.forEach((sl, k) => { sl.holes.visible = k === drillIdx; });
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
    ramp.visible = true;
    subs.forEach((sl) => {
      sl.parts.forEach((o) => { o.visible = true; });
      sl.cutCross.visible = true;
      setSub(sl, 'ore', false);
    });
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜中厚矿体 75° / 14m', pos: [-42, 46, 8], tone: '#f0a05a', height: 4.2, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘脉外', pos: [-40, -7, -43], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '斜坡道', sub: '联通各分段运输平巷', pos: [45, 22, -55], tone: '#9fd0ff', height: 3.0, pri: 82, phase: 'dev' },
    { text: '分段运输平巷', sub: '下盘脉外 · 3.6×3.4m', pos: [-26, 8, -32], tone: '#9fd0ff', height: 3.0, pri: 88, phase: 'prep' },
    { text: '装运横巷', sub: '间距约12m', pos: [2, 8, -24], tone: '#9fd0ff', height: 3.0, pri: 82, phase: 'prep' },
    { text: '堑沟平巷', sub: '沿走向 · 堑沟受矿', pos: [0, 9, 8], tone: '#ffcb6b', height: 3.0, pri: 86, phase: 'prep' },
    { text: '凿岩平巷', sub: '靠上盘 · 分段凿岩', pos: [-8, 16, 8], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'prep' },
    { text: '斜顶柱 / 间柱', sub: '分段矿柱 · 矿量较大', pos: [26, 22, 8], tone: '#d08a5a', height: 3.2, pri: 86, phase: 'post' },
    { text: '切割天井 / 立槽', sub: '端部 · 3m宽', pos: [-18, 26, 10], tone: '#ff7a4f', height: 3.0, pri: 82, phase: 'cut' },
    { text: '分段矿房（空场）', sub: '3 个分段 · 独立装运系统', pos: [4, 30, 8], tone: '#ffcb6b', height: 3.4, pri: 92, phase: 'stope' },
  ]);

  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.4 },
    stageIndex: (p) => (p <= 0.12 ? 0 : p < 1 ? 1 : 2),
    progressText: (p) => (p <= 0.12 ? '采准' : p < 1 ? '分段回采' : '采场处理'),
    bounds: new THREE.Box3(new THREE.Vector3(-53, -8, -80), new THREE.Vector3(53, 70, 24)),
  };
}
