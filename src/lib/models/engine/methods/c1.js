// C-1 单层崩落法（长壁式）
// 依据：教材B §10.2（印234–241）、图10-17/10-18；交付成果09§九
// 展示参数：缓倾斜薄矿体 25°/2.8m；走向72m、倾斜方向36m；全厚一次回采；
//           长壁工作面沿走向推进，采空区顶板随采随落，工作面用单体支柱维护。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, gentlyDippingSlab, prismAlongX, shaftCylinder,
  ensurePlanarUV, dashedOutline, solidOutline,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

export const meta = {
  code: 'C-1',
  name: '单层崩落法（长壁式）',
  en: 'Single-layer Caving (Longwall)',
  category: '崩落采矿法 · 单层崩落法（表6-1 组10 / 典型方法14）',
  refs: '教材B §10.2，印234–241 · 图10-17（庞家堡长壁式）、图10-18（工作面形式）',
  tier: 'A 级资料（图10-17 全构件标注）',
  summary:
    '缓倾斜薄矿体全厚一次回采，长壁工作面沿走向连续推进；' +
    '工作面用单体支柱/铰接顶梁维护，采空区顶板随采随落（切顶），崩落围岩充填采空区。' +
    '与全面法的区别：不靠矿柱长期支撑，而是主动切顶、让顶板崩落管理地压。',
  teaching: [
    '单层 = 矿体全厚一次采出；长壁工作面沿走向连续推进。',
    '工作面支护用单体支柱 + 铰接顶梁；采空区侧主动切顶，顶板随采随落。',
    '崩落围岩充填采空区，地压由崩落矸石和工作面支架共同承担。',
    '适用于顶板不稳固、地表允许塌陷的缓倾斜薄矿体（教材庞家堡铁矿）。',
  ],
  stages: ['采准', '切割', '长壁工作面推进', '切顶/顶板管理'],
  params: [
    ['矿体倾角 / 厚度', '25° / 2.8 m', '缓倾斜薄矿体（展示简化）【假】'],
    ['走向长度 / 倾斜方向', '72 m / 36 m', '展示值【假】'],
    ['工作面斜长', '39.7 m（沿倾斜）', '36 m 为 Z 向水平投影；沿倾斜面约 39.7 m【假】'],
    ['推进步距', '9 m', '8 个推进步距【假】'],
    ['支柱', '单体支柱 + 铰接顶梁', '排距/柱距展示值【图】'],
    ['切割上山', '2.4×2.4 m', '矿块一侧沿倾斜【图】'],
    ['切割巷道', '3.0×3.0 m', '沿走向，位于矿体下边界【图】'],
    ['安全道', '1.8×2.0 m', '采场上缘，经联络巷接回风巷【图】/【假】'],
    ['阶段运输巷 / 回风巷', '4.2×3.4 m / 3.2×3.0 m', '下盘脉外【图】'],
    ['放矿溜井', 'φ2.0 m', '两处放矿溜井示意【假】'],
    ['崩落顶板', '随采随落，充填采空区', '切顶管理【教】'],
  ],
  assumptions: [
    '矿体倾角取 25° 展示；教材庞家堡为 25–35°【教】/【假】。',
    '按一个推进步距示意控顶区，崩落体外缘为示意轮廓【假】。',
    '两排单体支柱及顶梁为支护示意，未按实际柱距布置【假】。',
    '工作面刮板输送机、采煤机未建，仅以工作面/安全道表达【假】。',
  ],
  layers: ['ore', 'drift', 'stope', 'pillar', 'muck', 'shaft', 'lod2', 'labels'],
  layerLabels: {
    ore: '未开采矿体', drift: '巷道（中空）', stope: '已回采空间',
    pillar: '工作面支护', muck: '崩落顶板/矸石', shaft: '井筒',
    lod2: 'LOD2 辅助细节', labels: '标注',
  },
  states: ['unmined', 'mined_out', 'caved_rock', 'excavation'],
  camera: { pos: [94, 52, 96], target: [0, 5, 0] },
  defaults: { cut: 0.0, progress: 0.55 },
};

const DIP = 25, TH = 2.8;
const X0 = -36, X1 = 36, Z0 = -18, Z1 = 18;
const YTOP = 9;
const SLICES = 8;
const SLICE_W = (X1 - X0) / SLICES;
const CAVE_H = 8;

function seamTop(z) { return YTOP - z * Math.tan(DIP * Math.PI / 180); }
function seamBottom(z) { return seamTop(z) - TH; }

export function build(M) {
  const registry = createRegistry('C-1');
  const { group, layers } = createLayerGroups();

  const envelope = gentlyDippingSlab({
    x0: X0, x1: X1, z0: Z0, z1: Z1, yTop: YTOP, thickness: TH, dip: DIP,
  });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // ---------------- 条带：未采矿体 + 崩落顶板 ----------------
  const slices = [];
  const caved = [];
  const openFloors = [];
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
      source_tier: '【图】', textbook_ref: '图10-17；§10.2',
      dimensions: `走向9m × 厚2.8m × 倾斜36m`,
      stage: '回采', assumption: true,
    });
    slices.push(g);

    const roofPoints = [
      [Z0, seamTop(Z0) + CAVE_H * 0.55],
      [Z0 + 8, seamTop(Z0 + 8) + CAVE_H * 0.88],
      [Z1 - 10, seamTop(Z1 - 10) + CAVE_H],
      [Z1, seamTop(Z1) + CAVE_H * 0.62],
    ];
    const cGeo = prismAlongX([
      [Z0, seamBottom(Z0)], [Z1, seamBottom(Z1)], ...roofPoints.reverse(),
    ], sx0 + 0.04, sx1 - 0.04);
    const cm = addMesh(layers.muck, cGeo, M.cavedRock, {
      type_code: 'MUCK', name: `崩落顶板/矸石（第${SLICES - i}条带）`,
      mining_state: 'caved_rock', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '§10.2.1；图10-17',
      dimensions: '崩落围岩形态示意，最高达矿体顶面以上8m',
      stage: '切顶', assumption: true,
    }, registry, { renderOrder: 5 });
    caved.push(cm);

    const floor = new THREE.BufferGeometry();
    const y0 = seamBottom(Z0) - 0.03;
    const y1 = seamBottom(Z1) - 0.03;
    floor.setAttribute('position', new THREE.Float32BufferAttribute([
      sx0, y0, Z0, sx1, y1, Z1, sx1, y0, Z0,
      sx0, y0, Z0, sx0, y1, Z1, sx1, y1, Z1,
    ], 3));
    floor.computeVertexNormals();
    const openFloor = addMesh(layers.stope, ensurePlanarUV(floor), M.stopeFloor, {
      type_code: 'STOPE-A', name: `当前控顶空间底板（第${SLICES - i}条带）`,
      mining_state: 'mined_out', mined: true, backfilled: false,
      source_tier: '【假】', textbook_ref: '图10-20；§10.2.1',
      dimensions: '走向9m，Z向投影36m', stage: '回采', assumption: true,
    }, registry);
    openFloors.push(openFloor);
  }

  // ---------------- 工作面支柱 ----------------
  const props = new THREE.Group();
  props.name = 'props';
  layers.pillar.add(props);
  const propGeo = new THREE.CylinderGeometry(0.14, 0.18, TH - 0.16, 12);
  const baseGeo = new THREE.BoxGeometry(0.44, 0.12, 0.46);
  const beamGeo = new THREE.BoxGeometry(1.12, 0.16, 3.7);
  for (const row of [1.2, 4.8]) {
    for (const z of [-15, -9, -3, 3, 9, 15]) {
      const support = new THREE.Group();
      support.position.set(row, seamBottom(z), z);
      props.add(support);
      const post = new THREE.Mesh(propGeo, M.steel);
      post.position.y = TH / 2;
      const base = new THREE.Mesh(baseGeo, M.steel);
      base.position.y = 0.06;
      const beam = new THREE.Mesh(beamGeo, M.steel);
      beam.rotation.x = DIP * Math.PI / 180;
      beam.position.y = TH - 0.08;
      support.add(post, base, beam);
      registry.tag(post, {
        type_code: 'SURF', name: '单体支柱与铰接顶梁（示意）',
        mining_state: 'excavation', source_tier: '【图】', textbook_ref: '图10-17/10-20',
        dimensions: '两排支护构件示意', stage: '回采', assumption: true,
      });
    }
  }

  // 下缘出矿，上缘通风；采场两侧由沿倾斜的上山联系。
  const haulY = -6.8;
  const haulZ = Z1 + 8;
  const loadZ = Z1;
  const airZ = Z0 - 7;
  const lowerY = seamBottom(Z1);
  const upperY = seamBottom(Z0);
  const firstCutX = X1 - SLICE_W / 2;
  const roadway = (path, section, material, name, stage, dimensions, connectivity) =>
    addMesh(layers.drift, hollowTunnel(path, section), material, {
      type_code: 'DRIFT', name, stage, dimensions, connectivity,
      source_tier: '【图】', textbook_ref: '图10-17；§10.2.1',
      elevation_z: path[0][1], assumption: true,
    }, registry);

  const haulage = roadway(
    [[-42, haulY, haulZ], [42, haulY, haulZ]], archSection(4.2, 3.4, 9), M.drift,
    '阶段运输巷道', '采准', '断面4.2×3.4m', ['装矿联络巷道'],
  );
  const airway = roadway(
    [[-42, upperY, airZ], [42, upperY, airZ]], archSection(3.2, 3.0, 9), M.drift,
    '阶段回风巷道', '采准', '断面3.2×3.0m', ['上缘通风联络巷道'],
  );
  const loadDrift = roadway(
    [[-38, haulY, loadZ], [38, haulY, loadZ]], archSection(3.0, 2.8, 9), M.drift,
    '沿脉装矿巷道', '采准', '断面3.0×2.8m', ['装矿联络巷道', '放矿溜井'],
  );
  const access = [-32, firstCutX].flatMap((x) => [
    roadway([[x, haulY, haulZ], [x, haulY, loadZ]], archSection(2.8, 2.6, 8), M.drift,
      '装矿联络巷道', '采准', '断面2.8×2.6m', ['阶段运输巷道', '沿脉装矿巷道']),
    roadway([[x, upperY, Z0], [x, upperY, airZ]], archSection(1.8, 2.0, 8), M.drift,
      '上缘通风联络巷道', '采准', '断面1.8×2.0m', ['安全道', '阶段回风巷道']),
  ]);
  const cutRaise = roadway(
    [[firstCutX, lowerY, Z1], [firstCutX, upperY, Z0]], archSection(2.4, 2.4, 8), M.driftThin,
    '切割上山', '切割', '断面2.4×2.4m，沿倾斜', ['切割巷道', '安全道'],
  );
  const cutDrift = roadway(
    [[-38, lowerY, Z1], [38, lowerY, Z1]], archSection(3.0, TH, 9), M.driftThin,
    '切割巷道', '切割', '断面3.0×2.8m，沿下缘走向', ['切割上山', '放矿溜井', '工作面'],
  );
  const safety = roadway(
    [[-38, upperY, Z0], [38, upperY, Z0]], archSection(1.8, 2.0, 8), M.driftThin,
    '安全道', '采准', '断面1.8×2.0m，沿上缘', ['工作面', '上缘通风联络巷道'],
  );
  const orePasses = [-27, 27].map((x) => addMesh(layers.shaft,
    shaftCylinder(x, loadZ, haulY + 2.55, lowerY + 0.15, 1.0), M.xray, {
      type_code: 'PASS', name: '放矿溜井',
      source_tier: '【图】', textbook_ref: '图10-17；§10.2.1',
      dimensions: 'φ2.0m', stage: '采准', assumption: true,
      connectivity: ['沿脉装矿巷道', '切割巷道'],
    }, registry));
  const prepParts = [loadDrift, ...access, safety];
  const cutParts = [cutRaise, cutDrift, ...orePasses];

  const faceGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, seamTop(Z0) + 0.15, Z0),
    new THREE.Vector3(0, seamTop(Z1) + 0.15, Z1),
  ]);
  const faceLine = new THREE.Line(faceGeo, new THREE.LineBasicMaterial({
    color: 0xffcb6b, transparent: true, opacity: 0.95,
    clippingPlanes: M.stopeFloor.clippingPlanes,
  }));
  faceLine.visible = false;
  layers.stope.add(faceLine);

  let faceLabel;
  let supportLabel;
  function setMined(n, finished = false) {
    const front = SLICES - n;
    const caveStart = finished ? front : front + 1;
    const active = n > 0 && !finished;
    slices.forEach((g, i) => { g.visible = i < front; });
    caved.forEach((m, i) => { m.visible = i >= caveStart; });
    openFloors.forEach((m, i) => { m.visible = active && i === front; });

    const faceX = X0 + front * SLICE_W;
    faceLine.visible = active;
    faceLine.position.x = faceX;
    props.visible = active;
    props.position.x = faceX;
    faceLabel.position.x = faceX;
    supportLabel.position.x = faceX + 4.8;
    faceLabel.visible = active;
    supportLabel.visible = active;
  }

  function update(p) {
    if (p <= 0.08) setMined(0);
    else if (p <= 0.18) setMined(1);
    else if (p >= 1) setMined(SLICES, true);
    else setMined(1 + Math.ceil(((p - 0.18) / 0.82) * (SLICES - 1)));
    haulage.visible = true;
    airway.visible = true;
    prepParts.forEach((mesh) => { mesh.visible = true; });
    cutParts.forEach((mesh) => { mesh.visible = true; });
  }

  // ---------------- 过程演示 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准工程', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割工程', color: '#ff7a4f' },
    { id: 'stope', name: '四、长壁工作面推进', color: '#ffcb6b' },
    { id: 'post', name: '五、切顶/顶板管理', color: '#c9b48a' },
  ];
  const steps = [
    { phase: 'dev', title: '阶段运输巷道与回风巷道', mined: 0, reveal: ['dev'],
      desc: '掘下盘阶段运输巷道与阶段回风巷道，形成矿块外部运输、通风系统。' },
    { phase: 'prep', title: '装矿巷道与安全道', mined: 0, reveal: ['prep'],
      desc: '开通下缘装矿巷道与运输联络巷，上缘安全道通过联络巷接入回风巷。' },
    { phase: 'cut', title: '切割上山、下缘切割巷道与放矿溜井', mined: 0, reveal: ['cut'],
      desc: '沿首采侧布置切割上山，上接安全道，下接切割巷道；放矿溜井将切割巷道与装矿巷道连通。' },
    { phase: 'cut', title: '初始长壁工作面（第1条带）', mined: 1, reveal: ['cut'],
      desc: '拉开初始长壁工作面，全厚回采第1条带；架设单体支柱/铰接顶梁，准备切顶。' },
  ];
  for (let i = 2; i <= SLICES; i++) {
    steps.push({
      phase: 'stope', title: `长壁工作面推进（第${i}条带）`, mined: i, reveal: [],
      desc: `工作面沿走向推进至第${i}条带；采空区侧回柱切顶，顶板随采随落，崩落矸石充填采空区。`,
    });
  }
  steps.push({
    phase: 'post', title: '切顶与顶板管理', mined: SLICES, reveal: ['post'],
    desc: '8 条带回采完毕；采空区顶板全部崩落，崩落矸石充填采空区；工作面支柱回撤。',
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
    prepParts.forEach((mesh) => { mesh.visible = revealed.has('prep'); });
    cutParts.forEach((mesh) => { mesh.visible = revealed.has('cut'); });
    setMined(step.mined, step.phase === 'post');
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    update(0);
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  const annotations = addLabelLayer(layers.labels, [
    { text: '矿体', sub: '缓倾斜薄矿体 25° / 2.8m', pos: [-40, 16, 8], tone: '#f0a05a', height: 4.0, pri: 94, phase: 'always' },
    { text: '阶段运输巷道', sub: '下缘 · 经联络巷接装矿巷', pos: [-31, -6, 29], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '回风巷道', sub: '上水平', pos: [30, upperY + 3, airZ], tone: '#9fd0ff', height: 3.0, pri: 82, phase: 'dev' },
    { text: '沿脉装矿巷道', sub: '接放矿溜井与阶段运输巷', pos: [-25, haulY, loadZ], tone: '#6fe3d8', height: 3.0, pri: 86, phase: 'prep' },
    { text: '切割上山', sub: '沿倾斜 · 矿块一侧', pos: [firstCutX, 8, 7], tone: '#ff7a4f', height: 3.0, pri: 84, phase: 'prep' },
    { text: '安全道', sub: '上缘 · 通往回风巷', pos: [-25, upperY + 1, Z0], tone: '#9fd0ff', height: 3.0, pri: 80, phase: 'prep' },
    { text: '长壁工作面', sub: '全厚一次回采 · 沿走向推进', pos: [0, 17, 3], tone: '#ffcb6b', height: 3.8, pri: 92, phase: 'dynamic' },
    { text: '单体支柱', sub: '控顶区 · 两排支柱与铰接顶梁', pos: [0, 13, -8], tone: '#d8ddc9', height: 3.0, pri: 88, phase: 'dynamic' },
    { text: '崩落顶板', sub: '随采随落 · 矸石充填采空区', pos: [16, 22, 12], tone: '#c9b48a', height: 3.6, pri: 90, phase: 'stope' },
    { text: '切顶/顶板管理', sub: '崩落矸石充填采空区', pos: [12, 20, 8], tone: '#ffa94d', height: 3.4, pri: 86, phase: 'post' },
  ]);

  [faceLabel, supportLabel] = annotations.children.filter((label) => label.userData.phase === 'dynamic');
  update(meta.defaults.progress);
  layers.lod2.visible = false;

  return {
    group, layers, registry, update,
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.4 },
    stageIndex: (p) => (p <= 0.08 ? 0 : p <= 0.18 ? 1 : p < 1 ? 2 : 3),
    progressText: (p) => (p <= 0.08 ? '采准' : p <= 0.18 ? '切割' : p < 1 ? '长壁工作面推进' : '切顶/顶板管理'),
    bounds: new THREE.Box3(new THREE.Vector3(-44, -9, -29), new THREE.Vector3(44, 28, 30)),
  };
}
