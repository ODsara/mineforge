// F-9 上向水平分层充填采矿法
// 依据：教材B §12.2（印309–315）、图12-2（水力典型方案）、图12-4（混凝土底板）、
//       图12-6（机械化）、图12-8（盘区式）；交付成果09§十、11§四
// 展示参数：急倾斜中厚矿体 75°/10m；矿房长32m；间柱8m/顶柱5m/底柱5m；
//           分层高3m（水力2–3m/机械化3–4m 取3m）；胶结铺面0.3m；隔墙0.8m
import * as THREE from 'three';
import {
  archSection, hollowTunnel, cylinderBetween, boxBetween,
  oreBody, dippingSlab, dippingSlabOpen, stopeBackWall, pillarBlock, prismAlongX, dipZ, dashedOutline, solidOutline, polyline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'F-9',
  name: '上向水平分层充填法',
  en: 'Overhand Cut-and-Fill (Upward Horizontal Slicing)',
  category: '充填采矿法 · 分层充填法（表6-1 组7 / 典型方法9）',
  refs: '教材B §12.2，印309–315 · 图12-2（水力典型方案）、图12-4（混凝土底板）、图12-6（机械化）、图12-8（盘区式）',
  tier: 'A 级资料（图12-2 全构件标注）',
  summary:
    '矿房自下而上按水平分层回采，每层采完后充填，并在充填体表面浇筑胶结铺面作为下一分层的工作底板；' +
    '充填体逐层堆叠，形成"一层矿石、一层充填体"的结构。顺路溜井、人行-滤水井、充填天井竖向贯穿并随分层延伸；' +
    '矿房与间柱之间设隔墙，为第二步回采矿柱创造条件。',
  teaching: [
    '充填体是独立对象：它替换了采出的矿石空间，承担工作底板与人工矿柱的双重作用。',
    '分层循环：凿岩爆破 → 出矿 → 充填 → 浇筑胶结铺面（每层3m，铺面0.3m）。',
    '顺路溜井/滤水井随分层"长高"，始终贯穿充填体——竖向物流的教学点。',
    '两步骤回采：先采矿房并充填，间柱/顶柱作为第二步（本模型以隔墙与人工矿柱表达衔接）。',
    '状态：未采矿体（实体）→ 已回采空腔（暗色）→ 分层充填体（实体、逐层）；已充填区不再显示为矿体。',
  ],
  stages: ['拉底/浇灌底板', '分层回采-充填循环', '接顶充填', '矿柱回采（第二步）'],
  params: [
    ['矿体倾角 / 厚度', '75° / 10 m', '展示假设：急倾斜中厚矿体'],
    ['矿块长度 / 高度', '32 m / 60 m', '矿块沿走向 30–50 m'],
    ['间柱 / 顶柱 / 底柱', '8 m / 5 m / 5 m', '间柱6–8m、顶柱4–5m、底柱5m（§12.2.1.1）'],
    ['分层高度', '3 m', '水力2–3m / 机械化3–4m；取3m并统一'],
    ['胶结铺面', '0.3 m', '尾砂胶结铺面0.3–0.5m（印313）；水力垫层0.15–0.2m'],
    ['钢筋混凝土底板', '1.0 m', '拉底层0.8–1.2m双层筋（图12-4）'],
    ['顺路溜井', 'φ1.5 m，壁厚300 mm', '图12-2⑤；§12.2.1.1'],
    ['人行-滤水井', '1.2 × 1.2 m', '预制混凝土件/预留泄水孔（图12-3）'],
    ['充填天井', '2 × 2.4 m，90°', '图12-2②；设在间柱内'],
    ['隔墙', '0.8 m', '矿房-间柱交界，预制砖+混凝土（印311）'],
  ],
  assumptions: [
    '充填体密实度均一、接顶质量为理想状态（教材无几何数据，【假】）。',
    '胶结充填体强度以颜色区分，不做强度数值映射（【假】）。',
    '机械化方案的斜坡道-指状联络道因真实坡度需数百米折返，本模型不建（LOD2 展开口径，见README）。',
  ],
  layers: ['ore', 'rock', 'drift', 'stope', 'pillar', 'fill', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体',
    rock: '围岩',
    drift: '巷道（中空）',
    stope: '已回采空间',
    pillar: '矿柱（未开采）',
    fill: '充填体',
    cut: '切割工程',
    shaft: '井筒',
    lod2: 'LOD2 辅助细节',
    labels: '标注',
  },
  states: ['unmined', 'mined_out', 'backfill', 'current_slice', 'excavation'],
  camera: { pos: [104, 84, 112], target: [0, 30, -5] },
  defaults: { cut: 0.5, progress: 0.55 },
};

const DIP = 75;
const TH = 10;
const X0 = -36, X1 = 48;
const Y0 = 0, Y1 = 60;
const SILL_TOP = 5;
const FILL_BASE = SILL_TOP + 1;
const CUT_TOP = SILL_TOP + 2.5;
const LAYER_H = 3.0;
const CAP_H = 0.3;
const LAYERS = 16;
const STOPE_X0 = -16, STOPE_X1 = 16;
const STOPE_TOP = 55;
const CROWN_TOP = 60;

export function build(M) {
  const registry = createRegistry('F-9');
  const { group, layers } = createLayerGroups();

  // ---------------- 矿体：原始包络虚线 + 未开采端块（矿房内不再覆盖矿体幽灵体） ----------------
  const oreEnvelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(oreEnvelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // 左侧未采矿体端部（左间柱以外）。拆成两块，避开顶柱/底柱体积。
  for (const [bx0, bx1, by0, by1, label] of [
    [-36, -30, 0, 60, '左端块·全高'],
    [-30, -24, 5, 55, '左端块·顶底柱之间'],
  ]) {
    addMesh(layers.ore, oreBody({
      x0: bx0, x1: bx1, y0: by0, y1: by1, dip: DIP, thickness: TH, inflate: -0.06,
    }), M.oreSolid, {
      type_code: 'ORE',
      name: `未开采矿体（${label}）`,
      mining_state: 'unmined',
      mined: false,
      backfilled: false,
      source_tier: '【教】',
      textbook_ref: '§12.2，印309；§6.2',
      dimensions: `走向${bx1 - bx0}m × 厚10m × 高${by1 - by0}m`,
      stage: '—',
      assumption: true,
    }, registry, { renderOrder: 2 });
  }

  // 右侧矿体端部（人工矿柱以外）
  addMesh(layers.ore, oreBody({
    x0: 46, x1: 48, y0: 0, y1: 60, dip: DIP, thickness: TH, inflate: -0.06,
  }), M.oreSolid, {
    type_code: 'ORE',
    name: '未开采矿体（右端块）',
    mining_state: 'unmined',
    mined: false,
    backfilled: false,
    source_tier: '【教】',
    textbook_ref: '§12.2，印309；§6.2',
    dimensions: '走向2m × 厚10m × 高60m',
    stage: '—',
    assumption: true,
  }, registry, { renderOrder: 2 });

  // 围岩（可选，默认关闭）
  const rockGeo = prismAlongX([[-40, -10], [20, -10], [20, 74], [-40, 74]], -58, 58);
  addMesh(layers.rock, rockGeo, M.rock, {
    type_code: 'ROCK',
    name: '上/下盘围岩壳体',
    source_tier: '【假】',
    textbook_ref: '图6-3；§12.2.2',
    dimensions: '展示范围：矿体厚度3~5倍',
    assumption: true,
  }, registry, { renderOrder: 0 });

  // ---------------- 矿柱：底柱、顶柱、间柱 ----------------
  addMesh(layers.pillar, pillarBlock({ x0: -30, x1: 46, y0: 0, y1: SILL_TOP, dip: DIP, halfThick: TH / 2 }), M.pillar, {
    type_code: 'PILLAR-R',
    name: '底柱',
    source_tier: '【教】',
    textbook_ref: '§12.2.1.1，印310',
    dimensions: '高5m（或混凝土假巷）',
    stage: '—',
  }, registry);

  addMesh(layers.pillar, pillarBlock({ x0: -30, x1: 46, y0: STOPE_TOP, y1: CROWN_TOP, dip: DIP, halfThick: TH / 2 }), M.pillar, {
    type_code: 'PILLAR-R',
    name: '顶柱',
    source_tier: '【教】',
    textbook_ref: '§12.2.1.1，印310',
    dimensions: '厚5m（4–5m）',
    stage: '—',
  }, registry);

  [[-24, -16, '左间柱'], [16, 24, '右间柱']].forEach(([x0, x1, nm]) => {
    addMesh(layers.pillar, pillarBlock({ x0, x1, y0: SILL_TOP, y1: STOPE_TOP, dip: DIP, halfThick: TH / 2, margin: 0 }), M.pillar, {
      type_code: 'PILLAR-R',
      name: `${nm}（6–8m）`,
      source_tier: '【教】',
      textbook_ref: '§12.2.1.1，印310',
      dimensions: '宽8m，衔接顶柱与底柱',
      stage: '—',
    }, registry);
  });

  // 第一步胶结充填矿房（人工矿柱，展示两步骤衔接）
  addMesh(layers.pillar, oreBody({ x0: 24, x1: 46, y0: SILL_TOP, y1: STOPE_TOP, dip: DIP, thickness: TH, inflate: -0.08 }), M.pillarArtificial, {
    type_code: 'PILLAR-A',
    name: '第一步胶结充填矿房（人工矿柱）',
    source_tier: '【教】',
    textbook_ref: '§12.2.1.2，印312',
    dimensions: '相邻矿房已胶结充填，承托第二步水力充填',
    stage: '充填',
  }, registry);

  // ---------------- 采场空区（负实体轮廓） ----------------
  const voidGeo = dippingSlabOpen({
    x0: STOPE_X0 + 0.06, x1: STOPE_X1 - 0.06, y0: SILL_TOP, y1: STOPE_TOP,
    dip: DIP, thickness: TH, inset: 0.03,
  });
  const backGeo = stopeBackWall({
    x0: STOPE_X0 + 0.06, x1: STOPE_X1 - 0.06, y0: SILL_TOP, y1: STOPE_TOP,
    dip: DIP, thickness: TH, zOffset: 0.08,
  });
  const stopeVoidMesh = addMesh(layers.stope, backGeo, M.stopeBack, {
    type_code: 'STOPE-A',
    name: '矿房（分层回采空间）',
    mining_state: 'mined_out',
    mined: true,
    backfilled: false,
    source_tier: '【教】',
    textbook_ref: '§12.2.1，印309–312；图12-2',
    dimensions: '长32m × 厚10m × 高50m',
    stage: '回采/充填',
  }, registry, { renderOrder: 7 });
  stopeVoidMesh.userData.isStopeVoid = true;
  const stopeOutline = dashedOutline(voidGeo, 0xffc178, 0.45, 2.0, 1.8);
  layers.stope.add(stopeOutline);

  // 钢筋混凝土底板（拉底层，图12-4）
  addMesh(layers.fill, dippingSlab({
    x0: STOPE_X0 + 0.2, x1: STOPE_X1 - 0.2, y0: SILL_TOP, y1: FILL_BASE,
    dip: DIP, thickness: TH - 0.4,
  }), M.concrete, {
    type_code: 'FILL-AC',
    name: '钢筋混凝土底板（拉底层）',
    source_tier: '【教】',
    textbook_ref: '图12-4；§12.2.1.1',
    dimensions: '厚1.0m（教材0.8–1.2m双层筋）',
    stage: '拉底',
    assumption: true,
  }, registry, { renderOrder: 3 });

  // ---------------- 分层充填体（逐层堆叠，层界面可见） ----------------
  const layerGroups = [];
  for (let i = 0; i < LAYERS; i++) {
    const y0 = FILL_BASE + i * LAYER_H;
    const yBody = y0 + (LAYER_H - CAP_H);
    const yTop = y0 + LAYER_H;
    const lg = new THREE.Group();
    lg.name = `fill-layer-${i + 1}`;

    const body = new THREE.Mesh(
      dippingSlab({
        x0: STOPE_X0 + 0.8, x1: STOPE_X1 - 0.8, y0, y1: yBody,
        dip: DIP, thickness: TH - 0.36,
      }),
      i % 2 === 0 ? M.fillWater : M.fillWaterAlt,
    );
    lg.add(body);

    const cap = new THREE.Mesh(
      dippingSlab({
        x0: STOPE_X0 + 0.8, x1: STOPE_X1 - 0.8, y0: yBody, y1: yTop,
        dip: DIP, thickness: TH - 0.24,
      }),
      M.fillCap,
    );
    lg.add(cap);
    lg.visible = false;
    layers.fill.add(lg);
    registry.tag(body, {
      type_code: 'FILL',
      name: `分层充填体 第${i + 1}层（水砂+胶结铺面）`,
      mining_state: 'backfill',
      mined: true,
      backfilled: true,
      source_tier: '【教】',
      textbook_ref: '§12.2.1.1，印310-312；图12-2/12-4',
      dimensions: `层高3m = 水砂2.7m + 胶结铺面0.3m`,
      stage: '充填',
    });
    layerGroups.push(lg);
  }

  // 接顶充填（最后一层至顶柱）
  const topFillGeo = dippingSlab({
    x0: STOPE_X0 + 0.8, x1: STOPE_X1 - 0.8,
    y0: FILL_BASE + LAYERS * LAYER_H, y1: STOPE_TOP,
    dip: DIP, thickness: TH - 0.36,
  });
  const topFill = new THREE.Mesh(topFillGeo, M.fillWater);
  topFill.visible = false;
  layers.fill.add(topFill);
  registry.tag(topFill, {
    type_code: 'FILL',
    name: '接顶充填体',
    mining_state: 'backfill',
    mined: true,
    backfilled: true,
    source_tier: '【教】',
    textbook_ref: '§12.2.1.1；图12-2',
    dimensions: '分层充填至顶柱底',
    stage: '充填',
  });

  // ---------------- 隔墙（矿房-间柱交界，随充填高度上升） ----------------
  const wallMeshes = [];
  for (const wx of [STOPE_X0, STOPE_X1]) {
    const w = new THREE.Mesh(new THREE.BufferGeometry(), M.concrete);
    layers.fill.add(w);
    registry.tag(w, {
      type_code: 'SURF',
      name: `隔墙（x=${wx} 矿房-间柱交界）`,
      mining_state: 'backfill',
      mined: true,
      backfilled: true,
      source_tier: '【教】',
      textbook_ref: '§12.2.1.1，印311',
      dimensions: '总厚0.8m，随充填面上升',
      stage: '充填',
    });
    wallMeshes.push({ mesh: w, x: wx });
  }

  function wallGeo(x, yTop) {
    const z0 = dipZ(FILL_BASE, DIP), z1 = dipZ(yTop, DIP);
    const poly = [
      [z0 - TH / 2, FILL_BASE], [z0 + TH / 2, FILL_BASE],
      [z1 + TH / 2, yTop], [z1 - TH / 2, yTop],
    ];
    return x === STOPE_X0 ? prismAlongX(poly, x, x + 0.8) : prismAlongX(poly, x - 0.8, x);
  }

  // ---------------- 井筒：顺路溜井 / 人行-滤水井 / 充填天井 ----------------
  // 顺路溜井 φ1.5m，壁厚300mm（外径0.75，内径0.45）
  const oreShaftPoint = (y) => [-10, y, dipZ(y, DIP) - 3.2];
  const filterShaftPoint = (y) => [8, y, dipZ(y, DIP) - 3.0];
  const oreShaftBottom = oreShaftPoint(-3.4);
  const oreShaft = addMesh(layers.shaft, new THREE.BufferGeometry(), M.xray, {
    type_code: 'PASS',
    name: '顺路放矿溜井 ⑤',
    source_tier: '【教】',
    textbook_ref: '图12-2⑤；§12.2.1.1',
    dimensions: 'φ1.5m，壁厚300mm，随分层延伸',
    stage: '采准/回采',
    connectivity: ['底柱出矿口', '阶段运输巷'],
  }, registry);
  const oreLining = addMesh(layers.shaft, new THREE.BufferGeometry(), M.funnel, {
    type_code: 'PASS',
    name: '顺路溜井内壁',
    source_tier: '【图】',
    textbook_ref: '图12-2⑤',
    dimensions: '内径φ0.9m',
    stage: '采准/回采',
  }, registry);

  // 人行-滤水井 1.2×1.2
  const filterShaft = addMesh(layers.shaft, new THREE.BufferGeometry(), M.xray, {
    type_code: 'PASS',
    name: '人行-滤水井 ④',
    source_tier: '【教】',
    textbook_ref: '图12-2④；图12-3',
    dimensions: '1.2×1.2m，预制混凝土件/泄水孔',
    stage: '采准/回采',
    connectivity: ['各分层', '底部滤水结构'],
  }, registry);

  // 充填天井 2×2.4m（间柱内，80°–90°）
  addMesh(layers.shaft, boxBetween(
    [20, 49, dipZ(62, DIP)], [20, 62, dipZ(62, DIP)], 2.0, 2.4,
  ), M.xray, {
    type_code: 'PASS',
    name: '充填天井 ②',
    source_tier: '【教】',
    textbook_ref: '图12-2②；§12.2.1.1',
    dimensions: '2×2.4m，内设充填管',
    stage: '采准/充填',
    connectivity: ['上水平', '充填管路'],
  }, registry);

  // ---------------- 阶段运输巷 / 回风巷 ----------------
  addMesh(layers.drift, hollowTunnel(
    [[-36, -3.4, dipZ(2.5, DIP)], [50, -3.4, dipZ(2.5, DIP)]],
    archSection(4.2, 3.4, 9),
  ), M.drift, {
    type_code: 'DRIFT',
    name: '阶段运输巷道',
    source_tier: '【图】',
    textbook_ref: '图12-2；§12.2.1',
    elevation_z: -3.4,
    dimensions: '断面4.2×3.4m',
    stage: '采准',
    connectivity: ['底柱出矿口', '溜井'],
  }, registry);

  addMesh(layers.drift, hollowTunnel(
    [[-36, 62, dipZ(62, DIP)], [50, 62, dipZ(62, DIP)]],
    archSection(3.5, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT',
    name: '上水平回风/充填巷道',
    source_tier: '【图】',
    textbook_ref: '图12-2①；§12.2.2',
    elevation_z: 62,
    dimensions: '断面3.5×3.2m',
    stage: '采准/通风',
    connectivity: ['充填天井'],
  }, registry);

  // ---------------- LOD2：钢筋网 + 充填管路 ----------------
  const rebar = new THREE.Group();
  for (let i = 0; i <= 16; i++) {
    const x = STOPE_X0 + 0.6 + (i / 16) * (STOPE_X1 - STOPE_X0 - 1.2);
    const z0 = dipZ(FILL_BASE, DIP) - TH / 2 + 0.5;
    const z1 = dipZ(FILL_BASE, DIP) + TH / 2 - 0.5;
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, SILL_TOP + 0.75, z0),
      new THREE.Vector3(x, SILL_TOP + 0.75, z1),
    ]);
    rebar.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xd6b25e, transparent: true, opacity: 0.8 })));
  }
  for (let j = 0; j <= 6; j++) {
    const z = dipZ(FILL_BASE, DIP) - TH / 2 + 0.5 + (j / 6) * (TH - 1);
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(STOPE_X0 + 0.6, FILL_BASE + 0.16, z),
      new THREE.Vector3(STOPE_X1 - 0.6, FILL_BASE + 0.16, z),
    ]);
    rebar.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xd6b25e, transparent: true, opacity: 0.8 })));
  }
  layers.lod2.add(rebar);

  const fillPipe = polyline([
    [20, 62, dipZ(62, DIP)],
    [20, 52, dipZ(62, DIP)],
    [10, 50, dipZ(50, DIP) + 1.0],
  ], 0x63d5ff, 0.9);
  layers.lod2.add(fillPipe);

  // ---------------- 标注 ----------------
  const labelsGroup = addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜中厚矿体 75° / 10m', pos: [-42, 46, 8], tone: '#f0a05a', height: 4.4 },
    { text: '矿房', sub: '32m × 10m × 50m', pos: [0, 44, 9], tone: '#9fd0ff', height: 3.6, phase: 'stope' },
    { text: '间柱', sub: '8m，第二步回采', pos: [-70, 30, 8], tone: '#d0a070', height: 3.2, pri: 80 },
    { text: '顶柱', sub: '5m', pos: [8, 66, 2], tone: '#d0a070', height: 2.8 },
    { text: '底柱', sub: '5m', pos: [-34, 3, 8], tone: '#d0a070', height: 2.8 },
    { text: '钢筋混凝土底板', sub: '拉底层 · 双层筋', pos: [22, 7, 9], tone: '#c9cfd6', height: 3.0, phase: 'cut' },
    { text: '竖向井系统', sub: '顺路溜井⑤ / 滤水井④ / 充填天井② · 贯穿充填体', pos: [16, 74, -14], tone: '#6fe3d8', height: 3.4, pri: 92, phase: 'prep' },
                { text: '人工矿柱', sub: '第一步胶结充填矿房', pos: [40, 36, 2], tone: '#64c9b8', height: 3.2, pri: 84, phase: 'fill' },
      ]);

  // 回采面上方的未采矿体：随充填面上升而缩小，接顶时消失
  const remainingOre = new THREE.Mesh(new THREE.BufferGeometry(), M.oreRemaining);
  layers.ore.add(remainingOre);
  registry.tag(remainingOre, {
    type_code: 'ORE',
    name: '未采矿体（矿房回采面上方）',
    mining_state: 'unmined',
    mined: false,
    backfilled: false,
    source_tier: '【教】',
    textbook_ref: '§12.2.1，印309；图12-2',
    dimensions: '随充填面上升而缩小，接顶时消失',
    stage: '回采',
    assumption: true,
  });
  let lastProgress = meta.defaults.progress;

  // 动态"当前作业分层"标注
  const workingLabel = addLabelLayer(layers.labels, [
    { text: '当前作业分层 / 充填体', sub: '充填层3m（水砂2.7m+铺面0.3m）· 示意当前开挖范围', pos: [0, 12, 8], tone: '#ffd166', height: 3.4, pri: 98, phase: 'dynamic' },
  ]);
  const workingSprite = workingLabel.children[0];

  // ---------------- 回采进程 ----------------
  // 当前回采分层：随充填面上移的琥珀色虚线框（只表达状态，不新增实体几何）
  const currentSlice = solidOutline(new THREE.BoxGeometry(1, 1, 1), 0xffcb6b, 0.92);
  currentSlice.visible = false;
  layers.stope.add(currentSlice);

  function setLayerState(nInput, mode = 'mine', shaftsReady = true) {
    const n = Math.max(0, Math.min(LAYERS, Math.floor(nInput + 1e-6)));
    for (let i = 0; i < LAYERS; i++) layerGroups[i].visible = i < n;
    topFill.visible = n >= LAYERS;
    const fillTop = n >= LAYERS ? STOPE_TOP : FILL_BASE + n * LAYER_H;

    let oreY0 = fillTop;
    if (mode === 'pre') oreY0 = SILL_TOP;
    if (mode === 'cut') oreY0 = CUT_TOP;
    if (mode === 'mine') oreY0 = n === LAYERS - 1 ? STOPE_TOP : fillTop + LAYER_H;
    const hasVoid = oreY0 > fillTop + 0.05;
    stopeVoidMesh.visible = hasVoid;
    stopeOutline.visible = hasVoid;
    if (hasVoid) {
      const span = { x0: STOPE_X0 + 0.06, x1: STOPE_X1 - 0.06, y0: fillTop, y1: oreY0, dip: DIP, thickness: TH };
      stopeVoidMesh.geometry.dispose();
      stopeVoidMesh.geometry = stopeBackWall(span);
      const volume = dippingSlab(span);
      stopeOutline.geometry.dispose();
      stopeOutline.geometry = new THREE.EdgesGeometry(volume, 18);
      stopeOutline.computeLineDistances();
      volume.dispose();
    }
    const shaftTop = Math.min(oreY0, fillTop + 0.7);
    oreShaft.visible = oreLining.visible = filterShaft.visible = shaftsReady;
    if (shaftsReady) {
      for (const [mesh, geometry] of [
        [oreShaft, cylinderBetween(oreShaftBottom, oreShaftPoint(shaftTop), 0.75, 18)],
        [oreLining, cylinderBetween(oreShaftBottom, oreShaftPoint(shaftTop), 0.45, 16)],
        [filterShaft, boxBetween(filterShaftPoint(-3.4), filterShaftPoint(shaftTop), 1.2, 1.2)],
      ]) {
        mesh.geometry.dispose();
        mesh.geometry = geometry;
      }
    }

    // 当前回采分层框：mine 模式位于充填面之上，层高 3m
    if (mode === 'mine' && n < LAYERS) {
      currentSlice.visible = true;
      const sliceGeo = dippingSlab({
        x0: STOPE_X0 + 0.55, x1: STOPE_X1 - 0.55,
        y0: fillTop, y1: oreY0,
        dip: DIP, thickness: TH - 0.7,
      });
      currentSlice.geometry.dispose();
      currentSlice.geometry = new THREE.EdgesGeometry(sliceGeo, 18);
      sliceGeo.dispose();
      currentSlice.computeLineDistances();
    } else {
      currentSlice.visible = false;
    }

    // 剩余未采矿体从实际开挖顶面向上延伸。
    if (oreY0 < STOPE_TOP - 0.05) {
      remainingOre.visible = true;
      remainingOre.geometry.dispose();
      remainingOre.geometry = dippingSlab({
        x0: STOPE_X0 + 0.1, x1: STOPE_X1 - 0.1,
        y0: oreY0, y1: STOPE_TOP, dip: DIP, thickness: TH - 0.2,
      });
    } else {
      remainingOre.visible = false;
    }

    for (const { mesh, x } of wallMeshes) {
      mesh.geometry.dispose();
      if (n > 0) {
        mesh.geometry = wallGeo(x, fillTop);
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    }
    if (workingSprite) {
      workingSprite.visible = mode === 'mine' && n < LAYERS;
      if (workingSprite.visible) workingSprite.position.set(0, Math.min(fillTop + 3.2, 58), 9);
    }
  }

  function update(p) {
    lastProgress = p;
    const n = Math.max(0, Math.min(LAYERS, Math.floor(p * LAYERS + 1e-6)));
    setLayerState(n, n >= LAYERS ? 'fill' : 'mine');
  }
  update(meta.defaults.progress);

  layers.lod2.visible = false;

  // ---------------- 过程演示 ----------------
  const meshesOf = (pred) => registry.objects.filter(pred).map((o) => o.mesh);
  const processGroups = new Map([
    ['dev', meshesOf((o) => /阶段运输巷道|上水平回风/.test(o.name))],
    ['prep', meshesOf((o) => /充填天井 ②/.test(o.name))],
    ['floor', meshesOf((o) => /钢筋混凝土底板/.test(o.name))],
    ['pillar', meshesOf((o) => /第一步胶结充填矿房/.test(o.name))],
  ]);

  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、分层回采', color: '#ffcb6b' },
    { id: 'fill', name: '五、分层充填与接顶', color: '#8fd6b0' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷与上水平回风/充填巷', mode: 'pre', fillCount: 0,
      desc: '掘阶段运输巷道与上水平回风/充填巷道，形成矿块外部运输、通风与充填通道。', reveal: ['dev'] },
    { phase: 'prep', title: '顺路溜井、滤水井与充填天井', mode: 'pre', fillCount: 0,
      desc: '先接通顺路溜井和人行-滤水井的底部，预掘间柱中的充填天井；井口随分层充填面上升。', reveal: ['prep'] },
    { phase: 'cut', title: '拉底与钢筋混凝土底板', mode: 'cut', fillCount: 0,
      desc: '拉底形成初始回采空间，浇灌钢筋混凝土底板；此时尚未进入第一分层的回采循环。', reveal: ['floor'] },
  ];
  for (let k = 1; k <= LAYERS; k++) {
    steps.push({
      phase: 'stope', title: `第 ${k} 分层回采`, mode: 'mine', fillCount: k - 1,
      desc: k === LAYERS
        ? '回采最后一层及其上方 1 m 收尾矿石，采至顶柱底，准备充填接顶。'
        : `回采第 ${k} 分层（3 m），充填体以上为当前作业空间，上方保留未采矿体。`,
      reveal: [],
    });
    steps.push({
      phase: 'fill', title: `第 ${k} 分层充填${k === LAYERS ? ' / 接顶' : ''}`, mode: 'fill', fillCount: k,
      desc: k === LAYERS
        ? '第 16 分层充填并接顶：充填体到顶柱底，矿房内未采矿体全部消失，形成完整充填体。'
        : `第 ${k} 分层充填：水砂 2.7 m + 胶结铺面 0.3 m；充填体逐层形成，作为上部分层的工作底板。`,
      reveal: k === 1 ? ['pillar'] : [],
    });
  }

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
    setLayerState(step.fillCount ?? 0, step.mode ?? 'pre', visible.has('prep'));
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    for (const objs of processGroups.values()) for (const o of objs) o.visible = true;
    update(lastProgress);
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
      stepDuration: 2.2,
    },
    stageIndex: (p) => (p < 0.999 ? 1 : 2),
    progressText: (p) => {
      const n = Math.max(0, Math.min(LAYERS, Math.floor(p * LAYERS + 1e-6)));
      return n >= LAYERS ? '接顶充填完成（16层）' : `第 ${n + 1} 分层回采 · 已充填 ${n} 层`;
    },
    bounds: new THREE.Box3(new THREE.Vector3(-44, -8, -38), new THREE.Vector3(54, 68, 22)),
  };
}
