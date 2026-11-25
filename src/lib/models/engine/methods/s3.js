// S-3 留矿采矿法
// 依据：教材B §11.4（印282–290）、图11-9（标准结构）、图11-10/11-11（天井布置）、图11-16（漏斗）
// 展示参数：急倾斜薄矿脉 80°/4m；阶段高55m；间柱4m/顶柱3m/底柱5m；漏斗间距6m，薄脉上口收窄
import * as THREE from 'three';
import {
  archSection, rectSection, hollowTunnel, shaftCylinder, shaftBox, cylinderBetween, boxBetween,
  oreBody, dippingSlab, dippingSlabOpen, stopeBackWall, pillarBlock, dipZ, dashedOutline, funnelCavity, polyline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'S-3',
  name: '留矿采矿法',
  en: 'Shrinkage Stoping',
  category: '空场采矿法 · 留矿采矿法（表6-1 组3 / 典型方法3）',
  refs: '教材B §11.4，印282–290 · 图11-9（标准结构）、图11-10/11-11（天井布置）、图11-16（漏斗出矿）',
  tier: 'A 级资料（图11-9 全构件标注）',
  summary:
    '矿房自下而上分层回采，每次崩落的矿石只放出约三分之一，其余暂留矿房内作为工作平台（留矿堆），' +
    '工人站在矿堆表面凿岩、平场、撬顶；矿房采完后进行大量放矿。矿柱支撑两帮，采空区靠矿柱与围岩自稳。' +
    '教材明文：留矿堆只作工作平台，不能作为支撑上盘围岩的主要手段（印306）。',
  teaching: [
    '空场法的两步骤逻辑：先采矿房、后采矿柱，矿房靠间柱/顶柱/底柱支撑。',
    '暂留矿石=工作平台：分层上采时矿堆面随工作面上升（本模型可拖动"回采进程"观察）。',
    '漏斗群在底柱内连接拉底空间和阶段运输巷，常见间距5–7m。',
    '先进天井在间柱内、每4–5m开联络道；顺路天井随回采在矿房内逐层架设。',
    '状态：未采矿体/矿柱（实体）→ 已回采空腔（暗色）→ 留矿堆（碎块矿石）；大量放矿后空腔增大、矿堆下降。',
  ],
  stages: ['拉底 / 辟漏', '分层回采（留矿堆上升）', '矿房采完（待大量放矿）', '大量放矿'],
  params: [
    ['矿体倾角 / 厚度', '80° / 4 m', '展示假设：急倾斜薄矿脉'],
    ['阶段高度', '55 m', '教材区间 40–60 m'],
    ['矿房长度', '24 m', '展示值（矿块长 40–60 m 分两个矿房）'],
    ['间柱 / 顶柱 / 底柱', '4 m / 3 m / 5 m', '薄脉档：间柱2–6m、顶柱2–3m、底柱4–6m（图11-9）'],
    ['分层高度', '2.5 m', '教材区间 2–3 m（§11.4.4）'],
    ['漏斗间距 / 上口', '6 m / 5.9×3.7 m', '间距5–7m；薄脉模型沿厚度方向收窄漏斗口'],
    ['拉底高度', '2.5 m', '教材区间 2–2.5 m（§11.4.3）'],
    ['先进天井 / 联络道间距', 'φ2 m / 4.5 m', '联络道教材 4–5 m，展示取4.5 m'],
    ['顺路天井', '2 × 2 m', '随回采逐层架设（图11-10/11-11）'],
  ],
  assumptions: [
    '留矿堆表面按水平工作平台示意，真实堆积面为不规则面（【假】）。',
    '留矿堆高度为工序示意，局部放出约三分之一指每次崩下的矿石量。',
    '漏斗间脊部残留、最终放矿漏斗面形态未建模（教材仅给理论式，【假】）。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'muck', 'cut', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体',
    drift: '巷道（中空）',
    stope: '已回采空间',
    pillar: '矿柱（未开采）',
    muck: '留矿堆',
    cut: '切割/拉底',
    shaft: '井筒',
    lod2: 'LOD2 辅助细节',
    labels: '标注',
  },
  states: ['unmined', 'mined_out', 'retained_ore', 'excavation'],
  camera: { pos: [48, 40, 142], target: [0, 25, -4] },
  defaults: { cut: 0.0, progress: 0.5 },
};

const DIP = 80;
const TH = 4;
const X0 = -34, X1 = 34;
const Y0 = 0, Y1 = 55;
const FLOOR_Y = 0, SILL_TOP = 5;
const STOPE_TOP = 52;
const CROWN_TOP = 55;
const STOPES = [
  { x0: -26, x1: -2, funnels: [-23, -17, -11, -5], shaftX: -24 },
  { x0: 2, x1: 26, funnels: [5, 11, 17, 23], shaftX: 4 },
];
const HAUL_Y = -3.4;
const CUT_TOP = SILL_TOP + 2.5;
const DRAW_START = 0.92;
const CUT_Z = (y) => dipZ(y, DIP);

function muckSurface(p) {
  if (p < 0.05) return 8.0;
  if (p < 0.82) return 8.0 + ((p - 0.05) / 0.77) * 40.0;
  if (p < 0.92) return 48.0;
  return 48.0 - ((p - 0.92) / 0.08) * 39.0;
}

export function build(M) {
  const registry = createRegistry('S-3');
  const { group, layers } = createLayerGroups();

  // ---------------- 矿体：原始包络虚线 + 未开采端块（矿房内不再覆盖矿体幽灵体） ----------------
  const oreEnvelope = oreBody({ x0: X0, x1: X1, y0: Y0, y1: Y1, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(oreEnvelope, 0xf0a05a, 0.45, 2.2, 1.6));

  // 矿块两端未采矿体（左右间柱之外）
  for (const [bx0, bx1] of [[-34, -30], [30, 34]]) {
    addMesh(layers.ore, oreBody({
      x0: bx0, x1: bx1, y0: Y0, y1: Y1, dip: DIP, thickness: TH, inflate: -0.06,
    }), M.oreSolid, {
      type_code: 'ORE',
      name: `未开采矿体端块（x ${bx0}~${bx1}）`,
      mining_state: 'unmined',
      mined: false,
      backfilled: false,
      source_tier: '【教】',
      textbook_ref: '§11.4.1，印282；图11-9',
      dimensions: '走向4m × 厚4m × 高55m',
      stage: '—',
      assumption: true,
    }, registry, { renderOrder: 2 });
  }

  // ---------------- 矿柱（间柱 / 顶柱 / 底柱） ----------------
  const pillars = [
    { x0: -30, x1: -26, name: '间柱 ⑤（左端）' },
    { x0: -2, x1: 2, name: '间柱 ⑤（中央）' },
    { x0: 26, x1: 30, name: '间柱 ⑤（右端）' },
  ];
  pillars.forEach((p) => {
    const g = pillarBlock({ x0: p.x0, x1: p.x1, y0: SILL_TOP, y1: STOPE_TOP, margin: 0, dip: DIP, zCenterRel: 0, halfThick: TH / 2 });
    addMesh(layers.pillar, g, M.pillar, {
      type_code: 'PILLAR-R',
      name: p.name,
      source_tier: '【图】',
      textbook_ref: '图11-9⑤；§11.4.1',
      dimensions: '厚4m（薄脉档2–6m），衔接顶柱与底柱',
      stage: '—',
    }, registry);
  });

  // 顶柱
  addMesh(layers.pillar, pillarBlock({ x0: -30, x1: 30, margin: 0, y0: STOPE_TOP, y1: CROWN_TOP, dip: DIP, halfThick: TH / 2 }), M.pillar, {
    type_code: 'PILLAR-R',
    name: '顶柱 ②',
    source_tier: '【图】',
    textbook_ref: '图11-9②；§11.4.1',
    dimensions: '厚3m（薄脉档2–3m）',
    stage: '—',
  }, registry);

  // 底柱（半透明，露出漏斗群）
  addMesh(layers.pillar, pillarBlock({ x0: -30, x1: 30, margin: 0, y0: FLOOR_Y, y1: SILL_TOP, dip: DIP, halfThick: TH / 2 }), M.pillarSill, {
    type_code: 'PILLAR-R',
    name: '底柱 ⑦（内含漏斗群）',
    source_tier: '【图】',
    textbook_ref: '图11-9⑦；§11.4.1',
    dimensions: '厚5m（薄脉档4–6m）',
    stage: '—',
  }, registry, { renderOrder: 4 });

  // ---------------- 采场空区 + 拉底空间 ----------------
  const voids = [];
  STOPES.forEach((st, i) => {
    const voidGeo = dippingSlabOpen({
      x0: st.x0 + 0.08, x1: st.x1 - 0.08, y0: SILL_TOP, y1: STOPE_TOP,
      dip: DIP, thickness: TH, inset: 0.04,
    });
    const backGeo = stopeBackWall({
      x0: st.x0 + 0.08, x1: st.x1 - 0.08, y0: SILL_TOP, y1: STOPE_TOP,
      dip: DIP, thickness: TH, zOffset: 0.08,
    });
    const stopeVoidMesh = addMesh(layers.stope, backGeo, M.stopeBack, {
      type_code: 'STOPE-A',
      name: `矿房（回采空间）${i + 1}`,
      mining_state: 'mined_out',
      mined: true,
      backfilled: false,
      source_tier: '【教】',
      textbook_ref: '§11.4.4；图11-9',
      dimensions: `24m × 4m × 47m（长×厚×高），随倾角`,
      stage: '回采',
    }, registry, { renderOrder: 7 });
    stopeVoidMesh.userData.isStopeVoid = true;
    const outline = dashedOutline(voidGeo, 0xffc178, 0.5, 2.0, 1.6);
    layers.stope.add(outline);
    voids.push({ mesh: stopeVoidMesh, outline });
    voidGeo.dispose();

    // 拉底空间（底柱顶面以上 2.5m，随倾角）
    const lg = dippingSlabOpen({
      x0: st.x0 + 0.08, x1: st.x1 - 0.08, y0: SILL_TOP, y1: SILL_TOP + 2.5,
      dip: DIP, thickness: TH, inset: 0.04,
    });
    addMesh(layers.stope, lg, M.stopeVoid, {
      type_code: 'DEV-CUT',
      name: `拉底空间 ${i + 1}`,
      source_tier: '【教】',
      textbook_ref: '§11.4.3，印284；图11-12/11-13',
      dimensions: '24m × 4m × 2.5m',
      stage: '拉底',
    }, registry, { renderOrder: 7 });
  });

  // ---------------- 漏斗群（底柱内，间距6m，沿矿脉厚度方向收窄） ----------------
  STOPES.forEach((st) => {
    st.funnels.forEach((x, k) => {
      const cone = funnelCavity(x, 0, 1.8, SILL_TOP, 0.7, 2.95, 20);
      const acrossDip = new THREE.Matrix4().set(
        1, 0, 0, 0, 0, 1, 0, 0, 0, CUT_Z(1), 0.62, 0, 0, 0, 0, 1,
      );
      cone.applyMatrix4(acrossDip);
      addMesh(layers.stope, cone, M.funnel, {
        type_code: 'BASE-STR',
        name: `放矿漏斗 ⑧（${k + 1}）`,
        source_tier: '【教】',
        textbook_ref: '§11.4.2，印284；图11-9⑧/图11-16',
        dimensions: '上口5.9×3.7m、下口1.4×0.87m，走向剖面斜面≈55°',
        stage: '拉底/放矿',
      }, registry, { renderOrder: 8 });
      const neck = shaftCylinder(x, 0, 0, 1.8, 0.7, 16);
      neck.applyMatrix4(acrossDip);
      addMesh(layers.stope, neck, M.funnel, {
        type_code: 'BASE-STR',
        name: `漏斗颈（${k + 1}）`,
        source_tier: '【图】',
        textbook_ref: '图11-9⑧；图11-13',
        dimensions: '1.4×0.87m，高1.8m',
        stage: '拉底/放矿',
      }, registry, { renderOrder: 8 });
    });
  });

  // ---------------- 阶段运输巷 / 回风巷 ----------------
  addMesh(layers.drift, hollowTunnel([[-36, HAUL_Y, CUT_Z(0)], [36, HAUL_Y, CUT_Z(0)]], archSection(4.2, 3.4, 9)), M.drift, {
    type_code: 'DRIFT',
    name: '阶段运输巷道 ⑨',
    source_tier: '【图】',
    textbook_ref: '图11-9⑨；§11.4.2',
    elevation_z: HAUL_Y,
    dimensions: '断面4.2×3.4m，沿走向',
    stage: '采准',
    connectivity: ['漏斗颈', '溜井'],
  }, registry);

  addMesh(layers.drift, hollowTunnel([[-36, 55.2, CUT_Z(56)], [36, 55.2, CUT_Z(56)]], archSection(3.5, 3.2, 9)), M.drift, {
    type_code: 'DRIFT',
    name: '回风巷道 ①',
    source_tier: '【图】',
    textbook_ref: '图11-9①；§11.4.2',
    elevation_z: 55.2,
    dimensions: '断面3.5×3.2m',
    stage: '采准/通风',
    connectivity: ['先进天井'],
  }, registry);

  // ---------------- 先进天井（间柱内，随倾角） + 联络道 ----------------
  const shaftBottom = [0, 0, CUT_Z(0)];
  const shaftTop = [0, 55.4, CUT_Z(55.4)];
  addMesh(layers.shaft, cylinderBetween(shaftBottom, shaftTop, 1.0, 18), M.xray, {
    type_code: 'PASS',
    name: '先进天井 ③（间柱内）',
    source_tier: '【教】',
    textbook_ref: '§11.4.2，印283；图11-9③/11-10',
    dimensions: 'φ2.0m，沿矿体倾角',
    stage: '采准',
    connectivity: ['回风巷道', '联络道'],
  }, registry);

  const crosscuts = [];
  for (let level = 0; level < 10; level++) {
    const y = 8 + level * 4.5;
    for (const dir of [-1, 1]) {
      const z = CUT_Z(y);
      const path = [[0, y, z], [dir * 3.6, y, z]];
      const g = hollowTunnel(path, rectSection(2.0, 2.0));
      const m = addMesh(layers.drift, g, M.drift, {
        type_code: 'DRIFT',
        name: `分层联络道 ④（标高 ${y} m）`,
        source_tier: '【图】',
        textbook_ref: '图11-9④；§11.4.2',
        elevation_z: y,
        dimensions: '2.0×2.0m，每4.5m一条',
        stage: '回采',
        connectivity: ['先进天井', '矿房'],
      }, registry);
      crosscuts.push({ mesh: m, y });
    }
  }

  // ---------------- 留矿堆 + 回采面上方剩余矿体（随回采进程升降） ----------------
  const muckMeshes = [];
  const platforms = [];
  const shaftMeshes = [];
  const remainingOreMeshes = [];
  let preMining = false;
  let lastProgress = meta.defaults.progress;
  STOPES.forEach((st, i) => {
    const geo = dippingSlab({
      x0: st.x0 + 0.15, x1: st.x1 - 0.15, y0: 7.5, y1: 9.0,
      dip: DIP, thickness: TH - 0.4,
    });
    const m = addMesh(layers.muck, geo, M.muck, {
      type_code: 'MUCK',
      name: `留矿堆（暂留矿石，矿房${i + 1}）`,
      mining_state: 'retained_ore',
      mined: true,
      backfilled: false,
      source_tier: '【教】',
      textbook_ref: '§11.4，印282；图11-9⑥',
      dimensions: '局部放矿后暂留，回采时堆面作为工作平台',
      stage: '回采',
      assumption: true,
    }, registry, { renderOrder: 3 });
    muckMeshes.push(m);

    const platGeo = new THREE.BoxGeometry(st.x1 - st.x0 - 0.5, 0.18, TH - 0.5);
    const plat = new THREE.Mesh(platGeo, M.platform);
    plat.userData.isPlatform = true;
    layers.muck.add(plat);
    platforms.push(plat);

    // 顺路天井（随工作面架设，随进度重建）
    const sh = new THREE.Mesh(new THREE.BufferGeometry(), M.shaft);
    layers.shaft.add(sh);
    registry.tag(sh, {
      type_code: 'PASS', name: `顺路天井（矿房${i + 1}）`, source_tier: '【图】',
      textbook_ref: '图11-10/11-11', dimensions: '2×2m，随回采面架设', stage: '回采',
      connectivity: ['拉底空间', '工作平台'],
    });
    shaftMeshes.push(sh);

    // 回采面上方的未采矿体：随工作面上升而缩小，最终放矿后消失
    const rem = new THREE.Mesh(new THREE.BufferGeometry(), M.oreRemaining);
    layers.ore.add(rem);
    registry.tag(rem, {
      type_code: 'ORE',
      name: `未采矿体（矿房${i + 1} 回采面上方）`,
      mining_state: 'unmined',
      mined: false,
      backfilled: false,
      source_tier: '【教】',
      textbook_ref: '§11.4.4，印282；图11-9',
      dimensions: '随工作面上升而缩小，最终放矿后消失',
      stage: '回采',
      assumption: true,
    });
    remainingOreMeshes.push(rem);
  });


  function rebuildMuck(p) {
    const drawing = p >= DRAW_START;
    const face = preMining ? SILL_TOP : p < 0.05 ? CUT_TOP : p >= 0.82 ? STOPE_TOP
      : Math.min(STOPE_TOP, muckSurface(p) + 2.5 + Math.max(0, p - 0.75) * (1.5 / 0.07));
    const surf = p < 0.05 ? SILL_TOP : muckSurface(p);
    STOPES.forEach((st, i) => {
      const m = muckMeshes[i];
      const vis = p >= 0.05 && !preMining;
      m.visible = vis;
      if (vis) {
        const g = dippingSlab({
          x0: st.x0 + 0.15, x1: st.x1 - 0.15, y0: SILL_TOP, y1: surf,
          dip: DIP, thickness: TH - 0.4,
        });
        m.geometry.dispose();
        m.geometry = g;
      }
      // 工作平台
      const plat = platforms[i];
      plat.visible = vis && !drawing;
      const zc = dipZ(surf, DIP);
      plat.position.set((st.x0 + st.x1) / 2, surf + 0.09, zc);

      // 顺路天井：从拉底顶面架设到工作面以上1m
      const sh = shaftMeshes[i];
      const top = Math.max(CUT_TOP + 0.2, Math.min(surf + 1.2, face));
      sh.geometry.dispose();
      sh.geometry = boxBetween(
        [st.shaftX, 7.5, dipZ(7.5, DIP)],
        [st.shaftX, top, dipZ(top, DIP)],
        2.0, 2.0,
      );
      sh.visible = vis && !drawing;

      const { mesh: voidMesh, outline } = voids[i];
      voidMesh.visible = outline.visible = face > surf + 0.05;
      if (voidMesh.visible) {
        const span = { x0: st.x0 + 0.08, x1: st.x1 - 0.08, y0: surf, y1: face, dip: DIP, thickness: TH };
        voidMesh.geometry.dispose();
        voidMesh.geometry = stopeBackWall(span);
        const volume = dippingSlab(span);
        outline.geometry.dispose();
        outline.geometry = new THREE.EdgesGeometry(volume, 18);
        outline.computeLineDistances();
        volume.dispose();
      }

      // 回采面上方剩余矿体：随工作面上升缩小
      const rem = remainingOreMeshes[i];
      const y0 = face;
      if (y0 < STOPE_TOP - 0.05) {
        rem.visible = true;
        rem.geometry.dispose();
        rem.geometry = dippingSlab({
          x0: st.x0 + 0.12, x1: st.x1 - 0.12, y0, y1: STOPE_TOP,
          dip: DIP, thickness: TH - 0.24,
        });
      } else {
        rem.visible = false;
      }

    });
    for (const c of crosscuts) {
      c.mesh.visible = c.mesh.userData.processRevealed !== false && c.y >= surf - 1.2;
    }
  }


  // ---------------- LOD2：振动放矿机 + 水力冲洗管 ----------------
  STOPES.forEach((st) => {
    st.funnels.forEach((x) => {
      const g = new THREE.BoxGeometry(1.8, 1.4, 1.8);
      g.translate(x, HAUL_Y + 0.7, CUT_Z(0));
      const m = new THREE.Mesh(g, M.equipment);
      layers.lod2.add(m);
    });
  });
  const pipe = polyline([
    [-30, 55.5, CUT_Z(56)], [-14, 55.5, CUT_Z(56)],
    [-14, 46, CUT_Z(46)], [-14, 30, CUT_Z(30)],
  ], 0x63d5ff, 0.85);
  layers.lod2.add(pipe);

  // ---------------- 标注 ----------------
  addLabelLayer(layers.labels, [
    { text: '矿体', sub: '急倾斜薄矿脉 80° / 4m', pos: [-46, 48, 8], tone: '#f0a05a', height: 4.4, pri: 92 },
    { text: '矿房 + 留矿堆', sub: '矿堆面=工作平台；上方为未采矿体', pos: [-6, 42, 8], tone: '#9fd0ff', height: 3.6, pri: 90, phase: 'stope' },
    { text: '间柱 ⑤', sub: '薄脉 2–6m，支撑两帮', pos: [-34, 22, 8], tone: '#d0a070', height: 3.2, pri: 80 },
    { text: '顶柱 ②', sub: '厚3m', pos: [18, 58, 2], tone: '#d0a070', height: 2.8, pri: 78 },
    { text: '底柱 ⑦', sub: '厚5m · 内含漏斗群', pos: [-34, 2, 8], tone: '#d0a070', height: 3.0, pri: 76 },
    { text: '漏斗群 ⑧', sub: '间距6m · 上口随矿脉厚度收窄', pos: [-8, -2, 8], tone: '#ff9f5a', height: 3.2, pri: 82, phase: 'cut' },
    { text: '天井系统', sub: '先进天井③（间柱内） + 顺路天井（随回采架设）', pos: [-4, 66, -12], tone: '#6fe3d8', height: 3.4, pri: 88, phase: 'prep' },
    { text: '拉底空间', sub: '高2.5m · 漏斗上口', pos: [30, 2, 8], tone: '#ffc178', height: 3.0, pri: 74, phase: 'cut' },
  ]);

  // ---------------- 回采进程 ----------------
  function update(p) {
    lastProgress = p;
    rebuildMuck(p);
  }
  update(meta.defaults.progress);

  layers.lod2.visible = false;

  // ---------------- 过程演示 ----------------
  const meshesOf = (pred) => registry.objects.filter(pred).map((o) => o.mesh);
  const devMeshes = meshesOf((o) => /阶段运输巷道|回风巷道/.test(o.name));
  const prep1Meshes = [
    ...meshesOf((o) => /先进天井/.test(o.name)),
    ...meshesOf((o) => /分层联络道/.test(o.name) && o.elevation_z < 22),
  ];
  const prep2Meshes = meshesOf((o) => /分层联络道/.test(o.name) && o.elevation_z >= 22 && o.elevation_z < 37);
  const prep3Meshes = meshesOf((o) => /分层联络道/.test(o.name) && o.elevation_z >= 37);
  const cutMeshes = meshesOf((o) => /拉底空间|放矿漏斗|漏斗颈/.test(o.name));

  const processGroups = new Map([
    ['dev', devMeshes],
    ['prep1', prep1Meshes],
    ['prep2', prep2Meshes],
    ['prep3', prep3Meshes],
    ['cut', cutMeshes],
  ]);

  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、矿体回采', color: '#ffcb6b' },
    { id: 'post', name: '五、采场处理', color: '#ffa94d' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷与回风巷', p: 0.02, preMining: true, stopeVoid: false, stoping: false,
      desc: '掘阶段运输巷道与回风巷道，形成矿块外部的运输与通风系统。', reveal: ['dev'] },
    { phase: 'prep', title: '先进天井与下部联络道', p: 0.02, preMining: true, stopeVoid: false, stoping: false,
      desc: '在中央间柱内掘先进天井，并开下部联络道（标高约 8–22 m），形成人行/通风通道。', reveal: ['prep1'] },
    { phase: 'prep', title: '中部联络道', p: 0.02, preMining: true, stopeVoid: false, stoping: false,
      desc: '开中部联络道（约 22–37 m），先进天井逐段与矿房联通。', reveal: ['prep2'] },
    { phase: 'prep', title: '上部联络道', p: 0.02, preMining: true, stopeVoid: false, stoping: false,
      desc: '开上部联络道（约 37–49 m），先进天井上端接回风巷，采准系统完成。', reveal: ['prep3'] },
    { phase: 'cut', title: '拉底与漏斗群', p: 0.02, preMining: false, stopeVoid: true, stoping: false,
      desc: '自拉底平巷扩漏，形成高 2.5 m 拉底空间与 8 个放矿漏斗/斗颈，建立重力放矿条件。', reveal: ['cut'] },
    { phase: 'stope', title: '拉底/初始回采', p: 0.08, preMining: false, stopeVoid: true, stoping: true,
      desc: '自拉底开始自下而上分层回采；崩落矿石暂留矿房作工作平台，矿堆面约 9.6 m。', reveal: [] },
    { phase: 'stope', title: '分层上采至约 16 m', p: 0.2, preMining: false, stopeVoid: true, stoping: true,
      desc: '分层崩矿后局部放矿约 1/3，工人站在留矿堆表面平场、撬顶、凿岩。', reveal: [] },
    { phase: 'stope', title: '分层上采至约 24 m', p: 0.35, preMining: false, stopeVoid: true, stoping: true,
      desc: '留矿堆面随工作面上升；矿堆只作工作平台，不作为支撑上盘围岩的主要手段。', reveal: [] },
    { phase: 'stope', title: '分层上采至约 31 m', p: 0.5, preMining: false, stopeVoid: true, stoping: true,
      desc: '上部分层继续回采，矿房上方仍为未采矿体，采空空间仅为工作面附近。', reveal: [] },
    { phase: 'stope', title: '分层上采至约 39 m', p: 0.65, preMining: false, stopeVoid: true, stoping: true,
      desc: '分层循环推进；埋入矿堆的联络道逐层废弃，上部联络道继续使用。', reveal: [] },
    { phase: 'stope', title: '分层上采至约 47 m', p: 0.8, preMining: false, stopeVoid: true, stoping: true,
      desc: '接近顶柱，矿房内未采矿体逐渐减少，留矿堆接近设计高度。', reveal: [] },
    { phase: 'stope', title: '矿房采完', p: 0.92, preMining: false, stopeVoid: true, stoping: true,
      desc: '矿房采至顶柱下，留矿堆面约 48 m；准备进行大量放矿。', reveal: [] },
    { phase: 'post', title: '大量放矿', p: 0.96, preMining: false, stopeVoid: true, stoping: true,
      desc: '大量放矿：留矿堆面下降，采空空间迅速扩大，矿石经漏斗进入运输系统。', reveal: [] },
    { phase: 'post', title: '放矿完成/空场', p: 1.0, preMining: false, stopeVoid: true, stoping: true,
      desc: '放矿完成，矿房基本放空，底部残留少量矿石；采空区由矿柱与围岩自稳。', reveal: [] },
  ];

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
      for (const o of objs) {
        o.userData.processRevealed = visible.has(key);
        o.visible = visible.has(key);
      }
    }
    preMining = step.preMining === true;
    rebuildMuck(step.p ?? 0.02);
    if (!step.stoping) shaftMeshes.forEach((sh) => { sh.visible = false; });
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    for (const objs of processGroups.values()) {
      for (const o of objs) {
        o.userData.processRevealed = true;
        o.visible = true;
      }
    }
    shaftMeshes.forEach((sh) => { sh.visible = true; });
    preMining = false;
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
      stepDuration: 2.8,
    },
    stageIndex: (p) => (p < 0.05 ? 0 : p < 0.82 ? 1 : p < 0.92 ? 2 : 3),
    bounds: new THREE.Box3(new THREE.Vector3(-40, -8, -24), new THREE.Vector3(40, 60, 14)),
  };
}
