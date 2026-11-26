// C-2 有底柱分段崩落采矿法
// 依据：教材B §10.3（印242–249）、图10-26/10-27/10-28/10-32；交付成果09§二
// 展示参数：急倾斜厚矿体 78°/26m；阶段高60m；4个分段×15m；底柱7m；
//           电耙道—斗颈—堑沟受矿；分段凿岩巷道+切割立槽；电耙放矿。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, pillarBlock, oreBody, dippingSlab, stopeBackWall,
  funnelCavity, horizontalRing, shaftBox, cylinderBetween, boxBetween, dipZ, dashedOutline, solidOutline,
  fanHoles,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'C-2',
  name: '有底柱分段崩落法',
  en: 'Sublevel Caving with Sill Pillar',
  category: '崩落采矿法 · 分段崩落法（表6-1 组12 / 有底柱分段）',
  refs: '教材B §10.3，印242–249 · 图10-26（底部结构）、图10-27（堑沟受矿）、图10-28（电耙道）、图10-32（切割立槽）',
  tier: 'A 级资料（图10-26 全构件标注）',
  summary:
    '每个分段在底部留 6–8m 底柱，底柱内布置电耙道、斗颈与堑沟受矿；' +
    '分段凿岩巷道钻扇形中深孔，向端部切割立槽崩矿，崩落矿石经堑沟—斗颈—电耙道—溜井放出。' +
    '底柱是永久损失矿量，也是本方法与无底柱分段崩落法的根本区别。',
  teaching: [
    '有底柱 = 每个分段底部留底柱，底柱内做电耙道、斗颈、堑沟，形成完整受矿—放矿系统。',
    '回采顺序：分段凿岩 → 向切割立槽崩矿 → 堑沟受矿 → 斗颈 → 电耙道 → 溜井。',
    '本示例保留分段底柱，底柱矿量计入损失；底柱稳定性关系放矿安全。',
    '覆盖岩下放矿：上部分段崩落矿岩覆盖，放矿时覆盖岩随之下移。',
  ],
  stages: ['采准（底部结构）', '切割立槽', '分段凿岩/崩矿', '堑沟放矿', '底柱与覆盖岩管理'],
  params: [
    ['矿体倾角 / 厚度', '78° / 26 m', '展示假设：急倾斜厚矿体'],
    ['阶段高度', '60 m', '教材 60–120m；展示取60m'],
    ['分段高度', '15 m', '教材 10–25m（§10.3.1）'],
    ['底柱高度', '7 m', '教材 6–8m；底柱内布置电耙道'],
    ['电耙道', '2.8 × 2.4 m', '沿走向，位于底柱中部'],
    ['斗颈', '1.6 × 1.6 m', '间距8m，共4条/分段'],
    ['堑沟 / 受矿漏斗', '高3.8m，上口r3.0 / 下口r0.8', 'V形堑沟+漏斗受矿（图10-27）'],
    ['凿岩巷道', '3.0 × 3.0 m', '位于底柱顶板以上，钻扇形中深孔'],
    ['切割立槽', '3 m 宽，贯穿分段', '端部拉槽，形成初始自由面（图10-32）'],
    ['溜井 / 行人天井', 'φ2.4 m / 2.2×2.2 m', '下盘围岩内，服务各分段'],
  ],
  assumptions: [
    '堑沟以 4 个受矿漏斗+斗颈表达，未做连续 V 形槽的精确开挖（【假】）。',
    '电耙道、凿岩巷道用透视材质显示，便于观察底柱内部结构（展示表达）。',
    '底柱按完整弹性体表达，未模拟底柱破坏与放矿松动（【假】）。',
    '顶部分段用覆盖岩下移示意覆岩下放矿，下部分段的放矿后空间作独立示意【假】。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'muck', 'cut', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '矿柱（底柱）', muck: '崩落矿岩', cut: '切割工程',
    shaft: '井筒', lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'caved_ore', 'caved_rock', 'excavation'],
  camera: { pos: [132, 94, 118], target: [0, 32, -6] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 78, TH = 26;
const X0 = -40, X1 = 40, Y0 = 0, Y1 = 60;
const STOPE_X0 = -20, STOPE_X1 = 20;
const SHAFT_X = -6, HUMAN_X = 8;
const SHAFT_Z = dipZ(30, DIP) - 26;
const FUNNEL_XS = [-12, -4, 4, 12];

const SUBS = [
  { id: 'SL4', y0: 45, y1: 60, oreBase: 52, label: '上部' },
  { id: 'SL3', y0: 30, y1: 45, oreBase: 37, label: '上中部' },
  { id: 'SL2', y0: 15, y1: 30, oreBase: 22, label: '下中部' },
  { id: 'SL1', y0: 0, y1: 15, oreBase: 7, label: '下部' },
];

export function build(M) {
  const registry = createRegistry('C-2');
  const { group, layers } = createLayerGroups();
  const processFx = new THREE.Group();
  processFx.name = 'processFx';
  group.add(processFx);

  // ---------------- 矿体包络 + 端部未采矿体 ----------------
  const envelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.42, 2.2, 1.8));
  [[-40, -20, '左端块'], [20, 40, '右端块']].forEach(([x0, x1, nm]) => {
    const geo = oreBody({
      x0, x1, y0: 0, y1: 60, dip: DIP, thickness: TH, inflate: -0.06,
    });
    addMesh(layers.ore, geo, M.oreSolid, {
      type_code: 'ORE', name: `未开采矿体（${nm}）`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【教】', textbook_ref: '§10.3，印242；图10-26',
      dimensions: `走向20m × 厚26m × 高60m`,
      stage: '—', assumption: true,
    }, registry, { renderOrder: 2 });
    layers.ore.add(solidOutline(geo, 0xe09a62, 0.3));
  });

  // ---------------- 分段：底柱 + 未采矿体 + 底部结构 + 切割槽 ----------------
  const subs = SUBS.map((sl, i) => {
    const bottomTop = sl.oreBase;
    const zBottom = dipZ((sl.y0 + bottomTop) / 2, DIP);
    const rakeY = sl.y0 + 0.6;

    // 底柱
    const pillarGeo = pillarBlock({
      x0: STOPE_X0, x1: STOPE_X1, y0: sl.y0, y1: bottomTop,
      dip: DIP, halfThick: TH / 2, margin: 0,
    });
    addMesh(layers.pillar, pillarGeo, M.pillarSill, {
      type_code: 'PILLAR-R', name: `底柱（${sl.id}）`,
      source_tier: '【教】', textbook_ref: '§10.3.1，印243；图10-26',
      dimensions: '高7m，分段底柱不回采', stage: '—',
    }, registry, { renderOrder: 4 });
    layers.pillar.add(solidOutline(pillarGeo, 0xffb27a, 0.5));

    // 未采矿体（底柱顶以上）
    const oreGeo = dippingSlab({
      x0: STOPE_X0 + 0.12, x1: STOPE_X1 - 0.12,
      y0: sl.oreBase, y1: sl.y1, dip: DIP, thickness: TH, inset: 0.12,
    });
    const ore = addMesh(layers.ore, oreGeo, M.ore, {
      type_code: 'ORE', name: `未开采矿体（${sl.id}，${sl.label}分段）`,
      mining_state: 'unmined', mined: false, backfilled: false,
      source_tier: '【教】', textbook_ref: '§10.3，印242–249；图10-26',
      dimensions: `走向40m × 厚26m × 高${sl.y1 - sl.oreBase}m`,
      stage: '—', assumption: true,
    }, registry, { renderOrder: 2 });
    const oreOutline = solidOutline(oreGeo, 0xe09a62, 0.22);
    layers.ore.add(oreOutline);

    // 电耙道（底柱中部，沿走向）
    const rakeDrift = addMesh(layers.drift, hollowTunnel(
      [[STOPE_X0, rakeY, zBottom], [STOPE_X1, rakeY, zBottom]],
      archSection(2.8, 2.4, 9),
    ), M.driftGhost, {
      type_code: 'DRIFT', name: `电耙道（${sl.id}）`,
      source_tier: '【教】', textbook_ref: '图10-26⑦；§10.3.2',
      elevation_z: rakeY, dimensions: '断面2.8×2.4m，沿走向',
      stage: '采准', connectivity: ['斗颈', '溜井'],
    }, registry);

    // 斗颈 + 堑沟受矿漏斗（放矿漏斗放大并加亮色口环，保证在半透明底柱中可读）
    const necks = [];
    const funnels = [];
    const rims = [];
    FUNNEL_XS.forEach((x) => {
      const ft = bottomTop;
      const fb = bottomTop - 3.8;
      const neckBottom = rakeY + 2.2;
      const neck = new THREE.Mesh(shaftBox(x - 0.8, x + 0.8, zBottom - 0.8, zBottom + 0.8, neckBottom, fb), M.funnel);
      layers.stope.add(neck);
      registry.tag(neck, {
        type_code: 'PASS', name: `斗颈（${sl.id} · x${x}）`,
        mining_state: 'excavation', mined: true, backfilled: false,
        source_tier: '【教】', textbook_ref: '图10-26⑧；§10.3.2',
        dimensions: '1.6×1.6m', stage: '采准',
      });
      necks.push(neck);

      const cone = new THREE.Mesh(funnelCavity(x, zBottom, fb, ft, 0.8, 3.0, 24), M.funnel);
      layers.stope.add(cone);
      registry.tag(cone, {
        type_code: 'STOPE-A', name: `堑沟受矿漏斗（${sl.id} · x${x}）`,
        mining_state: 'excavation', mined: true, backfilled: false,
        source_tier: '【图】', textbook_ref: '图10-27；§10.3.2',
        dimensions: '高3.8m，上口r3.0m，下口r0.8m', stage: '采准',
      });
      funnels.push(cone);

      // 口环/喉环/暗色口盘为纯视觉强调，不进入对象清单；随底部结构一起显隐
      const mouth = new THREE.Mesh(horizontalRing(x, zBottom, ft - 0.06, 3.02, 0.16, 10, 48), M.funnelRim);
      mouth.renderOrder = 20;
      layers.stope.add(mouth);
      const throat = new THREE.Mesh(horizontalRing(x, zBottom, fb + 0.06, 0.84, 0.10, 8, 32), M.funnelRim);
      throat.renderOrder = 20;
      layers.stope.add(throat);
      rims.push(mouth, throat);
    });

    // 凿岩巷道（底柱顶板以上，位于矿体内）
    const drillY = sl.oreBase + 0.45;
    const drillDrift = addMesh(layers.drift, hollowTunnel(
      [[STOPE_X0 + 2, drillY, dipZ(drillY + 1.4, DIP)], [STOPE_X1 - 2, drillY, dipZ(drillY + 1.4, DIP)]],
      archSection(3.0, 3.0, 9),
    ), M.driftGhost, {
      type_code: 'DRIFT', name: `凿岩巷道（${sl.id}）`,
      source_tier: '【教】', textbook_ref: '图10-26⑨；§10.3.2',
      elevation_z: drillY, dimensions: '断面3.0×3.0m，沿走向',
      stage: '采准', connectivity: ['电耙道', '切割立槽'],
    }, registry);

    // 电耙道→凿岩巷道联络天井
    const drillZ = dipZ(drillY + 1.4, DIP);
    const raise = new THREE.Mesh(boxBetween([18, rakeY + 1.5, zBottom], [18, drillY + 0.25, drillZ], 1.2, 1.2), M.xray);
    layers.shaft.add(raise);
    registry.tag(raise, {
      type_code: 'PASS', name: `行人/联络天井（${sl.id}）`,
      mining_state: 'excavation', mined: true, backfilled: false,
      source_tier: '【推】', textbook_ref: '图10-26；§10.3.2',
      dimensions: '1.2×1.2m', stage: '采准',
    });

    // 电耙道→溜井短巷
    const cross = addMesh(layers.drift, hollowTunnel(
      [[SHAFT_X, rakeY, zBottom], [SHAFT_X, rakeY, SHAFT_Z]],
      archSection(2.2, 2.2, 8),
    ), M.driftGhost, {
      type_code: 'DRIFT', name: `出矿短巷（${sl.id}）`,
      source_tier: '【推】', textbook_ref: '图10-26；§10.3.2',
      elevation_z: rakeY, dimensions: '断面2.2×2.2m',
      stage: '采准', connectivity: ['电耙道', '溜井'],
    }, registry);

    const humanCross = addMesh(layers.drift, hollowTunnel(
      [[HUMAN_X, drillY, drillZ], [HUMAN_X, drillY, SHAFT_Z]],
      archSection(2.2, 2.2, 8),
    ), M.driftGhost, {
      type_code: 'DRIFT', name: `行人通风联络巷（${sl.id}）`,
      source_tier: '【图】', textbook_ref: '图10-26⑨；§10.3.2',
      elevation_z: drillY, dimensions: '断面2.2×2.2m',
      stage: '采准', connectivity: ['凿岩巷道', '行人通风天井'],
    }, registry);

    // 切割立槽（端部，贯穿可采矿体高度）
    const slotGeo = dippingSlab({
      x0: STOPE_X0 + 1.5, x1: STOPE_X0 + 4.5,
      y0: sl.oreBase, y1: sl.y1, dip: DIP, thickness: TH - 8,
    });
    const slot = new THREE.Mesh(slotGeo, M.stopeVoid);
    slot.visible = false;
    layers.cut.add(slot);
    registry.tag(slot, {
      type_code: 'STOPE-A', name: `切割立槽（${sl.id}）`,
      mining_state: 'excavation', mined: true, backfilled: false,
      source_tier: '【教】', textbook_ref: '图10-32；§10.3.3',
      dimensions: '宽3m，贯穿分段高', stage: '切割',
    });
    const slotOutline = dashedOutline(slotGeo, 0xffc178, 0.5, 2.0, 1.6);
    slotOutline.visible = false;
    layers.cut.add(slotOutline);

    // 崩落矿石（回采后置换）
    const drawnTop = sl.oreBase + 3;
    const cavedGeometry = (y1) => dippingSlab({
      x0: STOPE_X0 + 0.15, x1: STOPE_X1 - 0.15,
      y0: sl.oreBase, y1, dip: DIP, thickness: TH, inset: 0.15,
    });
    const blastedGeo = cavedGeometry(sl.y1);
    const drawnGeo = cavedGeometry(drawnTop);
    const caved = new THREE.Mesh(blastedGeo, M.cavedOre);
    caved.visible = false;
    layers.muck.add(caved);
    registry.tag(caved, {
      type_code: 'MUCK', name: `崩落矿石（${sl.id}）`,
      mining_state: 'caved_ore', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§10.3.5；图10-28',
      dimensions: '分段内崩落矿柱', stage: '放矿', assumption: true,
    });
    caved.renderOrder = 5;

    // 放矿后空区（暗色后壁 + 虚线轮廓）
    const voidGeo = stopeBackWall({
      x0: STOPE_X0 + 0.08, x1: STOPE_X1 - 0.08,
      y0: sl.oreBase, y1: sl.y1, dip: DIP, thickness: TH, zOffset: 0.08,
    });
    const voidWall = new THREE.Mesh(voidGeo, M.stopeBack);
    voidWall.visible = false;
    layers.stope.add(voidWall);
    registry.tag(voidWall, {
      type_code: 'STOPE-A', name: `放矿后空区（${sl.id}）`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【推】', textbook_ref: '§10.3.5',
      dimensions: '分段回采空间', stage: '放矿',
    }, registry, { renderOrder: 7 });
    const voidOutline = dashedOutline(dippingSlab({
      x0: STOPE_X0 + 0.1, x1: STOPE_X1 - 0.1, y0: sl.oreBase, y1: sl.y1,
      dip: DIP, thickness: TH, inset: 0.05,
    }), 0xffc178, 0.35, 2.0, 1.8);
    voidOutline.visible = false;
    layers.stope.add(voidOutline);

    // 扇形中深孔（过程演示专用）
    const holes = fanHoles({
      baseX: 0, baseY: drillY + 2.2, baseZ: drillZ,
      radius: 5.0, count: 8, spreadDeg: 112, rows: 1, rowStep: 0,
    });
    holes.visible = false;
    processFx.add(holes);

    return {
      ...sl, ore, oreOutline, slot, slotOutline, caved, blastedGeo, drawnGeo, drawnTop,
      voidWall, voidOutline, holes,
      bottomParts: [rakeDrift, ...necks, ...funnels, ...rims, drillDrift, raise, cross, humanCross],
    };
  });

  // 覆盖岩（仅顶部分段上方）
  const cover = new THREE.Mesh(dippingSlab({
    x0: STOPE_X0 + 0.15, x1: STOPE_X1 - 0.15, y0: Y1, y1: Y1 + 12,
    dip: DIP, thickness: TH, inset: 0.15,
  }), M.cavedRock);
  cover.visible = false;
  layers.muck.add(cover);
  registry.tag(cover, {
    type_code: 'MUCK', name: '崩落覆盖岩',
    mining_state: 'caved_rock', mined: true, backfilled: false,
    source_tier: '【教】', textbook_ref: '§10.3.5，印247；图10-28',
    dimensions: '顶部分段上方覆盖层', stage: '放矿', assumption: true,
  });
  cover.renderOrder = 6;
  const coverOutline = solidOutline(cover.geometry, 0x9a8a70, 0.3);
  coverOutline.visible = false;
  layers.muck.add(coverOutline);

  // ---------------- 开拓工程：阶段运输巷、回风巷、溜井、行人天井 ----------------
  const haulZ = SHAFT_Z;
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-44, -4, haulZ], [44, -4, haulZ]], archSection(4.2, 3.6, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道',
    source_tier: '【图】', textbook_ref: '图10-26；§7.5',
    elevation_z: -4, dimensions: '断面4.2×3.6m', stage: '开拓',
    connectivity: ['矿石溜井', '行人通风天井'],
  }, registry);

  const airWay = addMesh(layers.drift, hollowTunnel(
    [[-44, 64, SHAFT_Z], [44, 64, SHAFT_Z]], archSection(3.6, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '上水平回风巷道',
    source_tier: '【图】', textbook_ref: '图10-26；§7.5',
    elevation_z: 64, dimensions: '断面3.6×3.2m', stage: '开拓',
    connectivity: ['行人天井'],
  }, registry);

  const orePass = addMesh(layers.shaft, cylinderBetween(
    [SHAFT_X, -4, SHAFT_Z], [SHAFT_X, 66, SHAFT_Z], 1.2, 18,
  ), M.xray, {
    type_code: 'PASS', name: '矿石溜井',
    source_tier: '【图】', textbook_ref: '图10-26③；§7.6',
    dimensions: 'φ2.4m，服务4个分段', stage: '开拓',
    connectivity: ['阶段运输巷道', '各分段电耙道'],
  }, registry);
  const human = addMesh(layers.shaft, shaftBox(
    HUMAN_X - 1.1, HUMAN_X + 1.1, SHAFT_Z - 1.1, SHAFT_Z + 1.1, -4, 66,
  ), M.xray, {
    type_code: 'PASS', name: '行人通风天井',
    source_tier: '【图】', textbook_ref: '图10-26；§7.6',
    dimensions: '2.2×2.2m', stage: '开拓',
    connectivity: ['阶段运输巷道', '上水平回风巷道', '行人通风联络巷'], 
  }, registry);

  // ---------------- 状态控制 ----------------
  let muckSprite = null;
  let coverSprite = null;

  function setSublevelStates(states) {
    subs.forEach((s, i) => {
      const state = states[i];
      s.ore.visible = state === 'ore';
      s.oreOutline.visible = s.ore.visible;
      s.caved.visible = state !== 'ore';
      s.caved.geometry = state === 'drawn' ? s.drawnGeo : s.blastedGeo;
      s.voidWall.visible = state === 'drawn' && i > 0;
      s.voidOutline.visible = s.voidWall.visible;
    });

    const topState = states[0];
    const drop = topState === 'drawn' ? subs[0].y1 - subs[0].drawnTop : 0;
    cover.visible = topState !== 'ore';
    cover.position.set(0, -drop, dipZ(-drop, DIP));
    coverOutline.visible = cover.visible;
    coverOutline.position.copy(cover.position);
    coverSprite.visible = cover.visible;
    coverSprite.position.y = 70 - drop;
    coverSprite.position.z = 12 + cover.position.z;

    const active = subs[Math.max(states.lastIndexOf('blasted'), states.lastIndexOf('drawn'))];
    muckSprite.visible = Boolean(active);
    if (active) muckSprite.position.set(16, active.oreBase + 3, 16);
  }

  function update(p) {
    const progress = Math.max(0, (p - 0.34) / (0.99 - 0.34));
    const index = Math.floor(progress * subs.length);
    const states = subs.map((_, i) => {
      if (i < index) return 'drawn';
      return i === index && progress > 0 ? 'blasted' : 'ore';
    });
    setSublevelStates(states);
    subs.forEach((s) => {
      s.bottomParts.forEach((o) => { o.visible = true; });
      s.slot.visible = p >= 0.28 && s.ore.visible;
      s.slotOutline.visible = s.slot.visible;
      s.holes.visible = false;
    });
  }

  // ---------------- 过程演示 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准（底部结构）', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割立槽', color: '#ff7a4f' },
    { id: 'stope', name: '四、分段凿岩/崩矿/放矿', color: '#ffcb6b' },
    { id: 'post', name: '五、底柱与覆盖岩管理', color: '#c9b48a' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷、回风巷、溜井与行人天井',
      desc: '掘阶段运输巷道与上水平回风巷道，在下盘围岩中掘矿石溜井与行人通风天井，服务 4 个分段。',
      reveal: ['dev'] },
  ];
  SUBS.forEach((sl, i) => {
    steps.push({
      phase: 'prep', title: `${sl.id} 底部结构（电耙道、斗颈、堑沟、凿岩巷道）`,
      desc: `在 ${sl.id} 底柱内掘电耙道，向上掘 4 条斗颈并扩成堑沟受矿漏斗；底柱顶板以上掘凿岩巷道，经联络天井与电耙道相通。`,
      reveal: [`prep${i}`],
    });
  });
  SUBS.forEach((sl, i) => {
    steps.push({
      phase: 'cut', title: `${sl.id} 切割立槽`,
      desc: `在 ${sl.id} 端部贯通底柱以上的可采矿体，形成初始自由面。`,
      reveal: [`cut${i}`],
    });
  });
  SUBS.forEach((sl, i) => {
    steps.push({
      phase: 'stope', title: `${sl.id} 凿岩（扇形中深孔）`,
      desc: `由 ${sl.id} 凿岩巷道向矿体布置示意扇形孔。`,
      reveal: [`fan${i}`],
    });
    steps.push({
      phase: 'stope', title: `${sl.id} 崩矿`,
      desc: `${sl.id} 中深孔向切割立槽爆破，矿石崩落并充满分段空间；底柱与堑沟保持。`,
      reveal: [`blast${i}`],
    });
    steps.push({
      phase: 'stope', title: `${sl.id} 堑沟放矿`,
      desc: `${sl.id} 崩落矿石经堑沟、斗颈和电耙道进入溜井。${i === 0 ? '上覆崩落围岩随放矿下移。' : '示意分段放矿后的剩余崩落矿石。'}`,
      reveal: [`draw${i}`],
    });
  });
  steps.push({
    phase: 'post', title: '底柱与覆盖岩管理',
    desc: '四个分段自上而下回采完毕，各分段底柱保留；顶部分段内可见放矿后下移的覆岩。',
    reveal: ['post'],
  });

  const LABEL_VIS = {
    dev: ['dev', 'prep'],
    prep: ['prep', 'cut'],
    cut: ['cut', 'stope'],
    stope: ['stope'],
    post: ['post'],
  };
  function setLabelPhase(phase) {
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (!p || p === 'always' || p === 'dynamic') return;
      o.visible = (LABEL_VIS[p] || []).includes(phase);
    });
  }

  function applyProcess(index) {
    const i = Math.max(0, Math.min(index, steps.length - 1));
    const step = steps[i];
    const revealed = new Set();
    for (let k = 0; k <= i; k++) (steps[k].reveal || []).forEach((r) => revealed.add(r));

    haulage.visible = revealed.has('dev');
    airWay.visible = revealed.has('dev');
    orePass.visible = revealed.has('dev');
    human.visible = revealed.has('dev');

    subs.forEach((s, k) => {
      s.bottomParts.forEach((o) => { o.visible = revealed.has(`prep${k}`); });
      s.slot.visible = revealed.has(`cut${k}`) && !revealed.has(`blast${k}`);
      s.slotOutline.visible = s.slot.visible;
      s.holes.visible = revealed.has(`fan${k}`) && !revealed.has(`blast${k}`);
    });

    const states = subs.map((_, k) => {
      if (revealed.has(`draw${k}`)) return 'drawn';
      return revealed.has(`blast${k}`) ? 'blasted' : 'ore';
    });
    setSublevelStates(states);
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airWay.visible = true; orePass.visible = true; human.visible = true;
    subs.forEach((s) => {
      s.bottomParts.forEach((o) => { o.visible = true; });
      s.slot.visible = true; s.slotOutline.visible = true; s.holes.visible = false;
    });
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'always') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜厚矿体 78° / 26m', pos: [-48, 50, 10], tone: '#f0a05a', height: 4.4, pri: 96, phase: 'always' },
    { text: '阶段运输巷道', sub: '下盘 · 标高 −4m', pos: [-38, -7, SHAFT_Z - 2], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '矿石溜井', sub: 'φ2.4m · 服务各分段', pos: [SHAFT_X, 70, SHAFT_Z], tone: '#6fe3d8', height: 3.2, pri: 92, phase: 'dev' },
    { text: '行人通风天井', sub: '2.2×2.2m', pos: [HUMAN_X + 4, 68, SHAFT_Z], tone: '#6fe3d8', height: 3.0, pri: 88, phase: 'dev' },
    { text: '底柱 7m', sub: '永久损失矿量 · 内有电耙道', pos: [24, 4, 6], tone: '#d08a5a', height: 3.2, pri: 86, phase: 'prep' },
    { text: '电耙道', sub: '沿走向 · 2.8×2.4m', pos: [-24, 2.4, 12], tone: '#9fd0ff', height: 3.0, pri: 90, phase: 'prep' },
    { text: '放矿漏斗', sub: '每分段4个 · 亮色口环标示', pos: [4, 30, 12], tone: '#ffcb6b', height: 3.2, pri: 88, phase: 'prep' },
    { text: '凿岩巷道', sub: '底柱顶板上方 · 扇形中深孔', pos: [22, 12, 10], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'prep' },
    { text: '切割立槽', sub: '宽3m · 贯穿分段', pos: [-18, 26, 14], tone: '#ff7a4f', height: 3.2, pri: 82, phase: 'cut' },
    { text: '4个分段 × 15m', sub: '自上而下回采', pos: [30, 34, 10], tone: '#ffcb6b', height: 3.0, pri: 78, phase: 'prep' },
    { text: '底柱矿量损失', sub: '4个分段底柱不回采', pos: [0, 4, 16], tone: '#d08a5a', height: 3.2, pri: 88, phase: 'post' },
  ]);
  const dyn = addLabelLayer(layers.labels, [
    { text: '崩落矿石', sub: '堑沟受矿 → 斗颈 → 电耙道', pos: [-4, 30, 14], tone: '#b08a62', height: 3.6, pri: 90, phase: 'dynamic' },
    { text: '覆盖岩', sub: '随放矿下移', pos: [-16, 70, 12], tone: '#c9b48a', height: 3.6, pri: 86, phase: 'dynamic' },
  ]);
  muckSprite = dyn.children[0];
  coverSprite = dyn.children[1];
  muckSprite.visible = false;
  coverSprite.visible = false;

  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.3 },
    stageIndex: (p) => (p <= 0.02 ? 0 : p < 0.28 ? 1 : p < 0.34 ? 2 : p < 0.99 ? 3 : 4),
    progressText: (p) => (p <= 0.02 ? '采准' : p < 0.28 ? '底部结构' : p < 0.34 ? '切割立槽' : p < 0.99 ? '分段凿岩/崩矿/放矿' : '底柱与覆盖岩'),
    bounds: new THREE.Box3(new THREE.Vector3(-54, -12, -50), new THREE.Vector3(54, 76, 26)),
  };
}
