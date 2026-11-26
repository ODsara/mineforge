// 阶段崩落法共用骨架：C-4 阶段强制崩落 / C-5 阶段自然崩落
// 依据：教材B §10.5（印263–269）、图10-53/10-54/10-57/10-60；交付成果04 C-4/C-5档案
// 急倾斜厚大矿体；底柱 12m；双排电耙道—漏斗—斗颈—拉底巷道；
// C-4 用补偿空间 + 上部凿岩天井/硐室 + 深孔强制崩落；
// C-5 用穿脉运输巷 + 拉底深孔诱导自然崩落；两者均为覆岩下放矿。
import * as THREE from 'three';
import {
  archSection, hollowTunnel, oreBody, dippingSlab, pillarBlock, funnelCavity, shaftBox,
  cylinderBetween, boxBetween, dipZ, dashedOutline, solidOutline, fanHoles,
} from '../geometry.js';
import { createLayerGroups, addMesh } from '../layers.js';
import { createRegistry } from '../registry.js';
import { addLabelLayer } from '../labels.js';

const DIP = 78, TH = 34;
const X0 = -40, X1 = 40;
const BOTTOM = 12;              // 底柱 12–14m（教材 §10.5.1.2）
const RAKE_Y = 2.8;             // 电耙道底板标高
const NECK_TOP = 6.2;           // 斗颈顶
const RAKE_ROOF = RAKE_Y + 2.4;
const FUNNEL_TOP = BOTTOM;      // 漏斗上口与底柱顶接合
const UNDERCUT_Y = BOTTOM;      // 拉底巷道底板接漏斗上口
const COMP_H = 8;               // 教学模型的补偿/拉底高度
const ROW_OFF = 8;              // 双排电耙道相对矿体中心面的 z 偏移
const FUNNEL_XS = [-28, -14, 0, 14, 28];

export function buildStageCaving(M, meta, cfg) {
  const registry = createRegistry(meta.code);
  const { group, layers } = createLayerGroups();
  const processFx = new THREE.Group();
  processFx.name = 'processFx';
  group.add(processFx);
  const topY = cfg.topY;
  const haulZ = -46, ventZ = -42, outletZ = -39;
  const compensationPercent = Math.round(100 * COMP_H / (topY - BOTTOM - COMP_H));
  const zRows = [dipZ(RAKE_Y, DIP) - ROW_OFF, dipZ(RAKE_Y, DIP) + ROW_OFF];
  const orePassX = -32, humanX = 32;
  const cutKindName = cfg.natural ? '拉底空间' : '补偿空间';

  const envelope = oreBody({ x0: X0, x1: X1, y0: 0, y1: topY, dip: DIP, thickness: TH });
  layers.ore.add(dashedOutline(envelope, 0xf0a05a, 0.45, 2.2, 1.8));

  // 底柱（底部结构所在）
  addMesh(layers.pillar, pillarBlock({
    x0: X0, x1: X1, y0: 0, y1: BOTTOM, dip: DIP, halfThick: TH / 2,
  }), M.pillar, {
    type_code: 'PILLAR-R', name: '底柱（底部结构）',
    source_tier: '【教】', textbook_ref: '图10-53/10-60；§10.5.1.2',
    dimensions: '高12m（教材12–14m），内布双排电耙道/漏斗/拉底巷道', stage: '—',
  }, registry);

  // 矿体：初始为底柱顶以上全高；切割后底段被补偿/拉底空间置换
  const ore = addMesh(layers.ore, dippingSlab({
    x0: X0 + 0.1, x1: X1 - 0.1, y0: BOTTOM, y1: topY, dip: DIP, thickness: TH, inset: 0.1,
  }), M.ore, {
    type_code: 'ORE', name: '阶段矿体',
    mining_state: 'unmined', mined: false, backfilled: false,
    source_tier: '【教】', textbook_ref: '§10.5；图10-53/10-60',
    dimensions: `80m × 厚34m × 高${topY - BOTTOM}m`, stage: '—', assumption: true,
  }, registry, { renderOrder: 2 });

  // 崩落矿石 + 覆岩
  const caved = new THREE.Mesh(new THREE.BufferGeometry(), M.cavedOre);
  caved.visible = false;
  layers.muck.add(caved);
  registry.tag(caved, {
    type_code: 'MUCK', name: '崩落矿石',
    mining_state: 'caved_ore', mined: true, backfilled: false,
    source_tier: '【假】', textbook_ref: '§10.5；图10-53/10-57',
    dimensions: '阶段内崩落矿石', stage: '放矿', assumption: true,
  }, registry, { renderOrder: 5 });
  const cover = new THREE.Mesh(dippingSlab({
    x0: X0 + 0.3, x1: X1 - 0.3, y0: topY, y1: topY + 16, dip: DIP, thickness: TH - 0.6,
  }), M.cavedRock);
  cover.visible = false;
  layers.muck.add(cover);
  registry.tag(cover, {
    type_code: 'MUCK', name: '崩落覆岩',
    mining_state: 'caved_rock', mined: true, backfilled: false,
    source_tier: '【教】', textbook_ref: '§10.5；图10-53',
    dimensions: '阶段顶上方16m覆盖范围，矿岩界面随放矿下移', stage: '放矿', assumption: true,
  }, registry, { renderOrder: 6 });
  const coverOutline = solidOutline(cover.geometry, 0x9a8a70, 0.3);
  coverOutline.visible = false;
  layers.muck.add(coverOutline);

  // 补偿空间（C-4）/ 拉底空间（C-5）：底柱顶以上 8m 的整层空腔
  const cutGeo = () => dippingSlab({
    x0: X0 + 0.2, x1: X1 - 0.2, y0: BOTTOM, y1: BOTTOM + COMP_H,
    dip: DIP, thickness: TH, inset: 0.2,
  });
  const cutSpace = new THREE.Mesh(cutGeo(), M.stopeVoid);
  cutSpace.visible = false;
  layers.stope.add(cutSpace);
  registry.tag(cutSpace, {
    type_code: 'STOPE-A', name: cutKindName,
    mining_state: 'mined_out', mined: true, backfilled: false,
    source_tier: '【教】',
    textbook_ref: cfg.natural ? '图10-60；§10.5.2' : '图10-53⑧；§10.5.1',
    dimensions: cfg.natural ? `示意拉底空间，高${COMP_H}m`
      : `高${COMP_H}m，约为剩余崩落矿体体积的${compensationPercent}%`, stage: '切割',
  }, registry, { renderOrder: 7 });
  const cutOutline = dashedOutline(cutGeo(), 0xffc178, 0.5, 2.0, 1.6);
  cutOutline.visible = false;
  layers.cut.add(cutOutline);

  // 底部结构：双排电耙道 + 每排 5 个斗颈/漏斗
  const rakes = zRows.map((zr, i) => addMesh(layers.drift, hollowTunnel(
    [[X0 - 2, RAKE_Y, zr], [X1 + 2, RAKE_Y, zr]], archSection(2.8, 2.4, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: `电耙道（第${i + 1}排）`, source_tier: '【图】',
    textbook_ref: cfg.natural ? '图10-60④；§10.5.2' : '图10-53③；§10.5.1',
    elevation_z: RAKE_Y,
    dimensions: '2.8×2.4m，双排沿走向', stage: '采准',
    connectivity: ['斗颈', '出矿短巷', '溜井'],
  }, registry));

  const funnels = [];
  const necks = [];
  zRows.forEach((zr, ri) => {
    FUNNEL_XS.forEach((x) => {
      const neck = new THREE.Mesh(shaftBox(x - 0.8, x + 0.8, zr - 0.8, zr + 0.8, RAKE_ROOF, NECK_TOP), M.funnel);
      layers.stope.add(neck);
      registry.tag(neck, {
        type_code: 'PASS', name: `斗颈（R${ri + 1} · x${x}）`, mining_state: 'excavation',
        mined: true, backfilled: false, source_tier: '【图】',
        textbook_ref: cfg.natural ? '图10-60⑤；§10.5.2' : '图10-53⑦；§10.5.1',
        dimensions: '1.6×1.6m', stage: '采准',
      });
      necks.push(neck);

      const cone = new THREE.Mesh(funnelCavity(x, zr, NECK_TOP, FUNNEL_TOP, 0.7, 2.6, 18), M.funnel);
      layers.stope.add(cone);
      registry.tag(cone, {
        type_code: 'STOPE-A', name: `受矿漏斗（R${ri + 1} · x${x}）`, mining_state: 'excavation',
        mined: true, backfilled: false, source_tier: '【图】',
        textbook_ref: cfg.natural ? '图10-60⑤；§10.5.2' : '图10-53⑦；§10.5.1',
        dimensions: '上口r2.6m，下口r0.7m', stage: '采准',
      });
      funnels.push(cone);
    });
  });

  // 双排拉底巷道（底柱顶以上）
  const unders = zRows.map((zr, i) => addMesh(layers.drift, hollowTunnel(
    [[X0 + 2, UNDERCUT_Y, zr], [X1 - 2, UNDERCUT_Y, zr]], archSection(3.2, 3.2, 9),
  ), M.driftXray, {
    type_code: 'DRIFT', name: `拉底巷道（第${i + 1}排）`, source_tier: '【教】',
    textbook_ref: cfg.natural ? '图10-60⑦；§10.5.2' : '图10-53；§10.5.1',
    elevation_z: UNDERCUT_Y, dimensions: '3.2×3.2m，双排沿走向', stage: '切割',
    connectivity: ['漏斗', '凿岩巷道', '矿体'],
  }, registry));

  // 两端出矿/通风联络：沿 z 向贯通双排电耙道，西端接溜井、东端接行人通风天井
  const crossParts = [];
  const crossWest = addMesh(layers.drift, hollowTunnel(
    [[orePassX, RAKE_Y, zRows[1] + 2], [orePassX, RAKE_Y, outletZ]], archSection(2.4, 2.4, 8),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '出矿短巷（西端·贯通双排电耙道）', source_tier: '【推】',
    textbook_ref: cfg.natural ? '图10-60②；§10.5.2' : '图10-53⑤；§10.5.1',
    elevation_z: RAKE_Y, dimensions: '2.4×2.4m', stage: '采准',
    connectivity: ['电耙道', '矿石溜井'],
  }, registry);
  crossParts.push(crossWest);
  const crossEast = addMesh(layers.drift, hollowTunnel(
    [[humanX, RAKE_Y, zRows[1] + 2], [humanX, RAKE_Y, ventZ]], archSection(2.4, 2.4, 8),
  ), M.driftXray, {
    type_code: 'DRIFT', name: '通风联络道（东端·贯通双排电耙道）', source_tier: '【推】',
    textbook_ref: cfg.natural ? '图10-60③；§10.5.2' : '图10-53⑤；§10.5.1',
    elevation_z: RAKE_Y, dimensions: '2.4×2.4m', stage: '采准',
    connectivity: ['电耙道', '行人通风天井'],
  }, registry);
  crossParts.push(crossEast);

  // 行人通风小井：电耙道层 → 拉底巷道层
  const ventShaft = addMesh(layers.shaft, shaftBox(
    humanX - 1, humanX + 1, zRows[1] - 1, zRows[1] + 1, RAKE_ROOF, UNDERCUT_Y + 1.4,
  ), M.xray, {
    type_code: 'PASS', name: cfg.natural ? '通风小井' : '行人通风小井',
    source_tier: '【图】',
    textbook_ref: cfg.natural ? '图10-60⑥；§10.5.2' : '图10-53⑥；§10.5.1',
    dimensions: '2×2m，电耙道—拉底巷道', stage: '采准',
    connectivity: ['电耙道', '拉底巷道'],
  }, registry);

  // 上部凿岩天井/硐室（C-4）或拉底深孔（C-5）
  let drill = null;
  const raises = [];
  let holes = null;
  if (!cfg.natural) {
    const drillY = topY - 7;
    const drillZ = dipZ(drillY, DIP);
    drill = addMesh(layers.drift, hollowTunnel(
      [[X0 + 4, drillY, drillZ], [X1 - 4, drillY, drillZ]], archSection(3.2, 3.2, 9),
    ), M.driftXray, {
      type_code: 'DRIFT', name: '上部凿岩硐室/巷道', source_tier: '【图】',
      textbook_ref: '图10-53⑨；§10.5.1', elevation_z: drillY,
      dimensions: '3.2×3.2m，阶段上部', stage: '采准',
      connectivity: ['凿岩天井', '深孔'],
    }, registry);

    [-24, 24].forEach((x) => {
      const r = addMesh(layers.shaft, boxBetween(
        [x, BOTTOM + COMP_H, dipZ(BOTTOM + COMP_H, DIP)], [x, drillY + 0.4, drillZ], 3, 3,
      ), M.xray, {
        type_code: 'PASS', name: `凿岩天井（x${x}）`, source_tier: '【图】',
        textbook_ref: '图10-53⑨；§10.5.1', dimensions: '3×3m，通天井—硐室',
        stage: '采准', connectivity: ['凿岩硐室', '补偿空间'],
      }, registry);
      raises.push(r);
    });

    // 垂直扇形深孔（教材并列水平深孔方案；本模型取垂直扇形表达）
    holes = new THREE.Group();
    [-24, 0, 24].forEach((x) => {
      holes.add(fanHoles({
        baseX: x, baseY: drillY + 1.2, baseZ: drillZ,
        radius: drillY + 1.2 - BOTTOM - COMP_H, count: 7, spreadDeg: 50, rows: 1, rowStep: 0, down: true,
      }));
    });
    holes.visible = false;
    processFx.add(holes);
  } else {
    // 拉底深孔：自拉底巷道向上扇形钻进，诱导矿体自然崩落
    holes = new THREE.Group();
    for (const x of FUNNEL_XS) {
      for (const z of zRows) {
        holes.add(fanHoles({
          baseX: x, baseY: UNDERCUT_Y + 1.2, baseZ: z,
          radius: 11, count: 7, spreadDeg: 60, rows: 1, rowStep: 0,
        }));
      }
    }
    holes.visible = false;
    processFx.add(holes);
  }

  // 开拓
  const haulage = addMesh(layers.drift, hollowTunnel(
    [[-46, -4, haulZ], [46, -4, haulZ]], archSection(4.2, 3.6, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '阶段运输巷道（沿脉）', source_tier: '【图】',
    textbook_ref: cfg.natural ? '图10-60①；§10.5.2' : '图10-53①；§10.5.1',
    elevation_z: -4, dimensions: '4.2×3.6m', stage: '开拓', connectivity: ['穿脉运输巷道', '溜井'],
  }, registry);

  const crossHauls = [];
  if (cfg.natural) {
    [-24, 24].forEach((x) => {
      const c = addMesh(layers.drift, hollowTunnel(
        [[x, -4, -46], [x, -4, 18]], archSection(3.6, 3.2, 9),
      ), M.drift, {
        type_code: 'DRIFT', name: `穿脉运输巷道（x${x}）`, source_tier: '【图】',
        textbook_ref: '图10-60②；§10.5.2', elevation_z: -4,
        dimensions: '3.6×3.2m，穿脉', stage: '开拓', connectivity: ['沿脉运输巷道', '底部结构'],
      }, registry);
      crossHauls.push(c);
    });
  }

  const airway = addMesh(layers.drift, hollowTunnel(
    [[-46, topY + 18, ventZ], [46, topY + 18, ventZ]], archSection(3.6, 3.2, 9),
  ), M.drift, {
    type_code: 'DRIFT', name: '回风/通风巷道', source_tier: '【图】',
    textbook_ref: cfg.natural ? '图10-60③；§10.5.2' : '图10-53④；§10.5.1',
    elevation_z: topY + 18, dimensions: '3.6×3.2m', stage: '开拓', connectivity: ['通风天井'],
  }, registry);
  const orePass = addMesh(layers.shaft, cylinderBetween(
    [orePassX, -4, haulZ], [orePassX, RAKE_Y + 1.2, outletZ], 1.4, 18,
  ), M.xray, {
    type_code: 'PASS', name: '矿石溜井', source_tier: '【图】',
    textbook_ref: cfg.natural ? '图10-60；§10.5.2' : '图10-53②；§10.5.1',
    dimensions: 'φ2.8m', stage: '开拓', connectivity: ['阶段运输巷道', '出矿短巷'],
  }, registry);
  const human = addMesh(layers.shaft, shaftBox(humanX - 1.2, humanX + 1.2, ventZ - 1.2, ventZ + 1.2, RAKE_Y, topY + 18), M.xray, {
    type_code: 'PASS', name: '通风人行天井', source_tier: '【图】',
    textbook_ref: cfg.natural ? '图10-60；§10.5.2' : '图10-53⑥；§10.5.1',
    dimensions: '2.4×2.4m', stage: '开拓',
  }, registry);

  // ---------------- 状态控制 ----------------
  function setOre(y0) {
    ore.geometry.dispose();
    ore.geometry = dippingSlab({
      x0: X0 + 0.1, x1: X1 - 0.1, y0, y1: topY, dip: DIP, thickness: TH, inset: 0.1,
    });
  }

  function setCaved(y0, y1) {
    caved.visible = true;
    caved.geometry.dispose();
    caved.geometry = dippingSlab({
      x0: X0 + 0.3, x1: X1 - 0.3, y0, y1, dip: DIP, thickness: TH - 0.6,
    });
  }

  function setCover(y0) {
    cover.geometry.dispose();
    cover.geometry = dippingSlab({
      x0: X0 + 0.3, x1: X1 - 0.3, y0, y1: topY + 16, dip: DIP, thickness: TH - 0.6,
    });
    coverOutline.geometry.dispose();
    coverOutline.geometry = new THREE.EdgesGeometry(cover.geometry, 22);
    coverOutline.computeLineDistances();
  }

  // state: ore（未切割）/ cut（补偿或拉底空间已开）/ drill（深孔已钻）
  //        blasted|caved（崩落充满）/ drawn（覆岩下放矿后）
  function settle(state, drawFraction = 0) {
    const isOre = state === 'ore';
    const isCut = state === 'cut' || state === 'drill';
    ore.visible = isOre || isCut;
    if (ore.visible) setOre(isOre ? BOTTOM : BOTTOM + COMP_H);
    cutSpace.visible = isCut;
    cutOutline.visible = isCut;
    const cavedOn = state === 'blasted' || state === 'caved' || state === 'drawn';
    caved.visible = cavedOn;
    cover.visible = cavedOn;
    coverOutline.visible = cavedOn;
    if (cavedOn) {
      if (state === 'drawn') {
        const interfaceY = THREE.MathUtils.lerp(topY, BOTTOM + COMP_H, drawFraction);
        setCaved(BOTTOM, interfaceY);
        setCover(interfaceY);
      } else {
        setCaved(BOTTOM, topY);
        setCover(topY);
      }
    }
  }

  // ---------------- 过程 ----------------
  const phases = [
    { id: 'dev', name: '一、开拓工程', color: '#6fe3d8' },
    { id: 'prep', name: '二、采准/底部结构', color: '#9fd0ff' },
    { id: 'cut', name: '三、切割/凿岩', color: '#ff7a4f' },
    { id: 'stope', name: '四、阶段崩落/放矿', color: '#ffcb6b' },
    { id: 'post', name: '五、采场处理', color: '#c9b48a' },
  ];
  const steps = [
    {
      phase: 'dev', title: cfg.natural ? '沿脉/穿脉运输巷、通风巷与溜井' : '阶段运输巷、回风巷与溜井',
      state: 'ore', reveal: ['dev'],
      desc: cfg.natural
        ? '掘阶段沿脉运输巷道、2 条穿脉运输巷道、回风巷道、矿石溜井与通风人行天井。'
        : '掘阶段运输巷道、回风巷道、矿石溜井与通风人行天井。',
    },
    {
      phase: 'prep', title: '底部结构（双排电耙道、10 漏斗/斗颈、出矿短巷）',
      state: 'ore', reveal: ['prep1'],
      desc: '在 12m 底柱内沿走向掘 2 条电耙道；每排 5 条斗颈并扩成受矿漏斗；两端出矿/通风联络道贯通双排电耙道，接矿石溜井与行人通风天井。',
    },
    {
      phase: 'prep', title: '双排拉底巷道', state: 'ore', reveal: ['prep2'],
      desc: '在底柱顶以上沿走向掘 2 条拉底巷道，与各漏斗/斗颈贯通，形成受矿—放矿通路。',
    },
  ];
  if (!cfg.natural) {
    steps.push({
      phase: 'prep', title: '凿岩天井与上部凿岩硐室', state: 'ore', reveal: ['prep3'],
      desc: '在矿体上部掘 2 条凿岩天井与沿走向凿岩硐室/巷道，作为深孔凿岩作业空间。',
    });
  }
  steps.push({
    phase: 'cut', title: cfg.natural ? '拉底诱导空间' : '切割与补偿空间',
    state: 'cut', reveal: ['cut'],
    desc: cfg.natural
      ? '沿阶段底部拉开 8m 高拉底空间，为矿体自重/地压自然崩落提供自由面与补偿空间。'
      : `在崩落矿块下部打开 ${COMP_H}m 高补偿空间；按展示模型计算，约为剩余待崩矿体体积的 ${compensationPercent}%。`,
  });
  steps.push({
    phase: 'cut', title: cfg.natural ? '拉底深孔凿岩' : '深孔/中深孔凿岩',
    state: 'drill', reveal: ['drill'],
    desc: cfg.natural
      ? '双排拉底巷道内分别示意上向扇形深孔。'
      : '自上部凿岩硐室向下钻垂直扇形深孔（教材并列水平深孔方案，此处取垂直扇形表达），示意凿岩硐室与补偿空间的关系。',
  });
  if (!cfg.natural) {
    steps.push({
      phase: 'stope', title: '强制崩落（深孔/药室）', state: 'blasted', reveal: ['blast'],
      desc: '深孔/药室爆破，强制崩落矿石与上覆围岩；崩落矿石充满阶段，补偿空间被碎胀矿石占据。',
    });
  } else {
    steps.push({
      phase: 'stope', title: '自然崩落', state: 'caved', reveal: ['cave'],
      desc: '拉底后矿体在自重与节理作用下自然崩落，崩落矿石充满阶段，覆岩随之下移。',
    });
  }
  steps.push({
    phase: 'stope', title: '覆岩下放矿', state: 'drawn', reveal: ['draw'],
    desc: '崩落矿石经漏斗—斗颈—电耙道—溜井放出；覆岩随放矿下移，矿岩界面随出矿逐步下降。',
  });
  steps.push({
    phase: 'post', title: '采场处理', state: 'drawn', reveal: ['post'],
    desc: '阶段回采完毕；崩落矿石/覆岩充满采空区，底柱与底部结构保留。',
  });

  const LABEL_VIS = {
    dev: ['dev', 'prep'], prep: ['prep', 'cut'], cut: ['cut', 'stope'],
    cutonly: ['cut'],
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
    crossHauls.forEach((c) => { c.visible = rev.has('dev'); });

    rakes.forEach((r) => { r.visible = rev.has('prep1'); });
    funnels.forEach((f) => { f.visible = rev.has('prep1'); });
    necks.forEach((f) => { f.visible = rev.has('prep1'); });
    crossParts.forEach((c) => { c.visible = rev.has('prep1'); });
    ventShaft.visible = rev.has('prep1');
    unders.forEach((u) => { u.visible = rev.has('prep2'); });
    if (drill) drill.visible = rev.has('prep3');
    raises.forEach((r) => { r.visible = rev.has('prep3'); });
    const drillIdx = steps.findIndex((s) => (s.reveal || []).includes('drill'));
    holes.visible = i === drillIdx;

    settle(step.state, step.phase === 'post' ? 1 : 0.55);
    setLabelPhase(step.phase);
  }

  function resetProcess() {
    haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
    crossHauls.forEach((c) => { c.visible = true; });
    rakes.forEach((r) => { r.visible = true; });
    funnels.forEach((f) => { f.visible = true; });
    necks.forEach((f) => { f.visible = true; });
    crossParts.forEach((c) => { c.visible = true; });
    ventShaft.visible = true;
    unders.forEach((u) => { u.visible = true; });
    if (drill) drill.visible = true;
    raises.forEach((r) => { r.visible = true; });
    holes.visible = false;
    settle('ore');
    layers.labels.traverse((o) => {
      const p = o.userData && o.userData.phase;
      if (p && p !== 'dynamic') o.visible = true;
    });
  }

  // ---------------- 标注 ----------------
  const labels = [
    { text: '矿体', sub: `急倾斜厚大矿体 78° / 34m`, pos: [-48, topY - 12, 10], tone: '#f0a05a', height: 4.4, pri: 96, phase: 'always' },
    { text: '阶段运输巷道（沿脉）', sub: '下盘脉外 · 标高 −4m', pos: [-44, -8, -48], tone: '#9fd0ff', height: 3.0, pri: 84, phase: 'dev' },
    { text: '矿石溜井', sub: 'φ2.8m · 服务全阶段', pos: [-32, RAKE_Y + 8, outletZ], tone: '#6fe3d8', height: 3.0, pri: 82, phase: 'dev' },
    { text: '双排电耙道', sub: '2×2.8×2.4m · 10 漏斗', pos: [-28, 5, 12], tone: '#9fd0ff', height: 3.0, pri: 88, phase: 'prep' },
    { text: '斗颈 + 受矿漏斗', sub: '每排5个 · 上口r2.6m', pos: [8, 8, 12], tone: '#ffcb6b', height: 3.0, pri: 86, phase: 'prep' },
    { text: '双排拉底巷道', sub: '底柱顶 · 3.2×3.2m', pos: [24, 13, 10], tone: '#ff7a4f', height: 3.0, pri: 84, phase: 'cut' },
    { text: cutKindName, sub: cfg.natural ? '拉底诱导 · 高8m' : `高${COMP_H}m · 约为剩余待崩矿体${compensationPercent}%`, pos: [0, 16, 12], tone: '#ff7a4f', height: 3.2, pri: 90, phase: 'cutonly' },
    { text: cfg.natural ? '拉底深孔' : '深孔 / 药室', sub: cfg.natural ? '上向扇形 · 诱导崩落' : '垂直扇形深孔', pos: [0, topY - 8, 14], tone: '#c9b48a', height: 3.6, pri: 90, phase: 'cutonly' },
    { text: cfg.natural ? '自然崩落' : '强制崩落', sub: cfg.natural ? '拉底诱导 · 自重崩落' : '深孔/药室 · 强制崩落', pos: [0, topY - 16, 12], tone: '#c9b48a', height: 3.8, pri: 92, phase: 'stope' },
    { text: '崩落矿石', sub: '覆岩下放矿', pos: [16, 16, 12], tone: '#b08a62', height: 3.4, pri: 88, phase: 'stope' },
    { text: '崩落覆岩', sub: '随放矿下移', pos: [-16, topY + 12, 10], tone: '#c9b48a', height: 3.4, pri: 86, phase: 'stope' },
  ];
  if (!cfg.natural) {
    labels.push({ text: '凿岩天井和硐室', sub: '2条天井 + 上部硐室', pos: [-24, topY + 8, 2], tone: '#6fe3d8', height: 3.2, pri: 88, phase: 'prep' });
    labels.push({ text: '行人通风小井', sub: '电耙道—拉底巷道', pos: [34, 8, -2], tone: '#6fe3d8', height: 2.8, pri: 78, phase: 'prep' });
  } else {
    labels.push({ text: '穿脉运输巷道', sub: '2条 · 接沿脉运输巷', pos: [24, -8, 14], tone: '#9fd0ff', height: 3.0, pri: 86, phase: 'dev' });
    labels.push({ text: '通风小井', sub: '电耙道—拉底巷道', pos: [34, 8, -2], tone: '#6fe3d8', height: 2.8, pri: 78, phase: 'prep' });
  }
  addLabelLayer(layers.labels, labels);

  function stageIndex(p) {
    if (p <= 0.12) return 0;
    if (p <= 0.28) return 1;
    if (p <= 0.42) return cfg.natural ? 1 : 2;
    if (p <= 0.5) return cfg.natural ? 2 : 3;
    return cfg.natural ? 3 : 4;
  }

  settle('ore');
  layers.lod2.visible = false;

  return {
    group, layers, registry,
    update(p) {
      if (p <= 0.12) settle('ore');
      else if (p <= 0.28) settle('cut');
      else if (p <= 0.42) settle('drill');
      else if (p <= 0.5) settle(cfg.natural ? 'caved' : 'blasted');
      else settle('drawn', (p - 0.5) / 0.5);
      haulage.visible = true; airway.visible = true; orePass.visible = true; human.visible = true;
      crossHauls.forEach((c) => { c.visible = true; });
      rakes.forEach((r) => { r.visible = true; });
      funnels.forEach((f) => { f.visible = true; });
      necks.forEach((f) => { f.visible = true; });
      crossParts.forEach((c) => { c.visible = true; });
      ventShaft.visible = true;
      unders.forEach((u) => { u.visible = true; });
      if (drill) drill.visible = true;
      raises.forEach((r) => { r.visible = true; });
      holes.visible = p > 0.28 && p <= 0.42;
      // 补偿/拉底空间与深孔只存在于切割—凿岩阶段，自由探索时按进度显隐
      const cutStage = p > 0.12 && p <= 0.42;
      layers.labels.traverse((o) => {
        if (o.userData && o.userData.phase === 'cutonly') o.visible = cutStage;
      });
    },
    meta,
    process: { phases, steps, apply: applyProcess, reset: resetProcess, stepDuration: 2.5 },
    stageIndex,
    progressText: (p) => p >= 1 ? '覆岩下放矿完成' : meta.stages[stageIndex(p)],
    bounds: new THREE.Box3(new THREE.Vector3(-52, -10, -52), new THREE.Vector3(52, topY + 26, 28)),
  };
}
