// 统一材质库。所有可被"剖切"的对象共享同一个裁剪平面。
// 材质体系（2026-11-23 重制）：中性细节纹理 + 材质 color 着色，
// 冷板岩围岩 / 暖铜矿体 / 石灰岩巷道 / 钢制漏斗衬壁；避免全场景单一棕橙色。
import * as THREE from 'three';

// 语义色板：暖铜矿体、深板岩围岩、石灰岩巷道、钢蓝井筒、
// 鼠尾草绿充填、赭褐崩落矿、暖灰崩落岩、石墨设备；切割红只作小面积强调。
export const COLORS = {
  ore: 0xb45e36,
  rock: 0x646c76,
  drift: 0xd6d0c0,
  driftActive: 0xe8ae6e,
  stope: 0x0b0a09,
  pillar: 0x8e4c2c,
  muck: 0xb07a48,
  overburden: 0x716d64,
  residual: 0x95603e,
  fillWater: 0x9fb8a6,
  fillCemented: 0x78967f,
  fillCap: 0xddd7c8,
  fillDry: 0xb8a98c,
  concrete: 0xcfc9ba,
  cut: 0xa3352b,
  shaft: 0x83a0ab,
  pipe: 0x8ba6ac,
  rebar: 0xa68558,
  equipment: 0x68727a,
};

export function createMaterials(clipPlane) {
  const clip = [clipPlane];
  const base = {
    clippingPlanes: clip,
    clipShadows: true,
  };

  const mat = (opts) => new THREE.MeshStandardMaterial({ ...base, ...opts });

  return {
    // ---- 地质对象 ----
    // 未开采矿体（C-19 分段状态块）：暖铜色，半透明以看到内部巷道
    ore: mat({
      map: null, color: COLORS.ore, roughness: 0.84, metalness: 0.02,
      transparent: true, opacity: 0.65, depthWrite: false,
      side: THREE.DoubleSide, flatShading: true, envMapIntensity: 0.35,
    }),
    // 保留给极薄矿脉的原始包络（当前未使用）
    oreGhost: mat({
      color: 0xe8c0a0, roughness: 0.82, metalness: 0.06,
      transparent: true, opacity: 0.08, depthWrite: false,
      side: THREE.DoubleSide, flatShading: true,
    }),
    // 底柱内含漏斗，保持半透明以露出漏斗空腔
    pillarSill: mat({
      color: 0x9a5634, roughness: 0.82, metalness: 0.04,
      transparent: true, opacity: 0.55, depthWrite: false,
      side: THREE.DoubleSide, flatShading: true,
    }),
    // 未开采矿体的实体块（矿柱、顶底柱、矿体端块）
    oreSolid: mat({
      color: 0xc06a3e, roughness: 0.78, metalness: 0.06,
      side: THREE.DoubleSide, flatShading: true,
    }),
    // 回采面旁的剩余矿体：少量暖色补光，保留岩面质感
    oreRemaining: mat({
      color: 0xc67444, roughness: 0.85, metalness: 0.02,
      emissive: 0x50250e, emissiveIntensity: 0.16,
      side: THREE.DoubleSide, flatShading: true,
    }),
    rock: mat({
      color: COLORS.rock, roughness: 0.96, metalness: 0.02,
      transparent: true, opacity: 0.10, depthWrite: false, side: THREE.DoubleSide,
    }),

    // ---- 采场/巷道空腔（BackSide = 从中空管腔内部看到衬壁）----
    drift: mat({
      color: COLORS.drift, roughness: 0.90, metalness: 0.01,
      side: THREE.BackSide, emissive: 0x2d281f, emissiveIntensity: 0.34,
    }),
    driftActive: mat({
      color: COLORS.driftActive, roughness: 0.83, metalness: 0.02,
      side: THREE.BackSide, emissive: 0x5a3511, emissiveIntensity: 0.46,
    }),
    // 缓倾斜/近水平方法的采准巷道：透视显示，保证在矿体块下方仍可见
    driftXray: new THREE.MeshBasicMaterial({
      color: 0xb4cdd8, transparent: true, opacity: 0.30,
      depthTest: false, depthWrite: false, side: THREE.BackSide,
      clippingPlanes: clip,
    }),
    // 多层底柱内密集巷道：更低不透明度，避免多条巷道叠加成白块
    driftGhost: new THREE.MeshBasicMaterial({
      color: 0x9fbac6, transparent: true, opacity: 0.16,
      depthTest: false, depthWrite: false, side: THREE.BackSide,
      clippingPlanes: clip,
    }),
    // 薄矿体沿走向长巷道：更低不透明度，避免整条巷道叠加成灰色覆盖层
    driftThin: new THREE.MeshBasicMaterial({
      color: 0x9fbac6, transparent: true, opacity: 0.07,
      depthTest: false, depthWrite: false, side: THREE.BackSide,
      clippingPlanes: clip,
    }),
    // 已回采空间：接近黑色的空腔内壁，与矿体形成明显反差
    stopeVoid: mat({
      color: COLORS.stope, roughness: 1.0, metalness: 0.0,
      side: THREE.BackSide, transparent: true, opacity: 0.96, depthWrite: false,
      emissive: 0x030303, emissiveIntensity: 0.6,
    }),
    // 放矿漏斗/斗颈：暖钢衬壁，能被环境光读出轮廓
    funnel: mat({
      color: 0xc99a6c, roughness: 0.46, metalness: 0.24,
      side: THREE.BackSide, envMapIntensity: 0.9,
      emissive: 0x5a3214, emissiveIntensity: 0.55,
    }),
    // 漏斗口/喉口亮色环：教学强调，穿透半透明底柱/矿体显示
    funnelRim: new THREE.MeshBasicMaterial({
      color: 0xffc45e, transparent: true, opacity: 0.95,
      depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      toneMapped: false, clippingPlanes: clip,
    }),
    // 漏斗口暗色盘：把"口"读成孔洞，而不是一个金色圆环
    funnelMouth: new THREE.MeshBasicMaterial({
      color: 0x070605, transparent: true, opacity: 0.90,
      depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      toneMapped: false, clippingPlanes: clip,
    }),
    // 采场后壁：暗色平面，提供"已回采空间"的背景但不包裹/遮挡矿体
    stopeBack: mat({
      color: COLORS.stope, roughness: 1.0, metalness: 0.0,
      side: THREE.DoubleSide, transparent: true, opacity: 0.96, depthWrite: false,
      emissive: 0x030303, emissiveIntensity: 0.5,
    }),
    // 近水平采场的实体底板：不透明近黑，避免透出地面网格而被误读为浅色顶板
    stopeFloor: mat({
      color: 0x090807, roughness: 1.0, metalness: 0.0,
      side: THREE.DoubleSide,
    }),

    // ---- 矿柱 ----
    pillar: mat({
      color: COLORS.pillar, roughness: 0.80, metalness: 0.05,
      side: THREE.DoubleSide, flatShading: true,
    }),
    pillarArtificial: mat({
      color: 0x86a18c, roughness: 0.80, metalness: 0.03,
      side: THREE.DoubleSide, flatShading: true,
    }),

    // ---- 崩落体 / 留矿堆 / 残留 ----
    // 留矿堆：破碎矿石实体，表面为工作平台
    muck: mat({
      color: COLORS.muck, roughness: 1.0, metalness: 0.0,
      flatShading: true, side: THREE.DoubleSide,
    }),
    // 崩落矿石：破碎、比原位矿体更暗、更散
    cavedOre: mat({
      color: 0x855338, roughness: 1.0, metalness: 0.0,
      transparent: true, opacity: 0.72, depthWrite: false,
      flatShading: true, side: THREE.DoubleSide,
    }),
    // 崩落围岩：冷灰褐、独立于崩落矿石
    cavedRock: mat({
      color: COLORS.overburden, roughness: 1.0, metalness: 0.0,
      transparent: true, opacity: 0.77, depthWrite: false,
      flatShading: true, side: THREE.DoubleSide,
    }),
    // 覆岩轮廓用较低不透明度，内部放矿关系仍可见
    overburden: mat({
      color: COLORS.overburden, roughness: 1.0, metalness: 0.0,
      transparent: true, opacity: 0.56, depthWrite: false,
      flatShading: true, side: THREE.DoubleSide,
    }),
    // 残留矿体：永久损失，暖褐、可识别但比矿体暗
    residual: mat({
      color: COLORS.residual, roughness: 0.95, metalness: 0.0,
      transparent: true, opacity: 0.78, depthWrite: false,
      flatShading: true, side: THREE.DoubleSide,
    }),

    // ---- 充填体 ----
    fillWater: mat({
      color: COLORS.fillWater, roughness: 0.74, metalness: 0.0,
      flatShading: true, side: THREE.DoubleSide,
    }),
    fillWaterAlt: mat({
      color: 0x9ab29f, roughness: 0.74, metalness: 0.0,
      flatShading: true, side: THREE.DoubleSide,
    }),
    fillCemented: mat({
      color: COLORS.fillCemented, roughness: 0.88, metalness: 0.02,
      flatShading: true, side: THREE.DoubleSide,
    }),
    fillCap: mat({
      color: COLORS.fillCap, roughness: 0.68, metalness: 0.03,
      side: THREE.DoubleSide,
    }),
    fillDry: mat({
      color: COLORS.fillDry, roughness: 1.0, metalness: 0.0,
      flatShading: true, side: THREE.DoubleSide,
    }),
    concrete: mat({
      color: COLORS.concrete, roughness: 0.72, metalness: 0.05,
      side: THREE.DoubleSide,
    }),
    // 单体支柱/钢构件：金属高光，配合 scene.environment 产生反射
    steel: mat({
      color: 0x8a9298, roughness: 0.26, metalness: 0.85,
      side: THREE.DoubleSide,
    }),

    // ---- 切割工程 / 井筒 / 辅助 ----
    cut: mat({
      color: COLORS.cut, roughness: 0.6, metalness: 0.1,
      transparent: true, opacity: 0.35, depthWrite: false,
      side: THREE.DoubleSide, flatShading: true,
    }),
    shaft: mat({
      color: COLORS.shaft, roughness: 0.30, metalness: 0.42,
      side: THREE.DoubleSide, emissive: 0x1c282c, emissiveIntensity: 0.75,
    }),
    // 透视井筒：用于穿过矿柱/充填体的竖向井（教学示意，不遮挡）
    xray: new THREE.MeshBasicMaterial({
      color: 0x9dc2cc, transparent: true, opacity: 0.34,
      depthTest: false, depthWrite: false, side: THREE.DoubleSide,
      clippingPlanes: clip,
    }),
    pipe: mat({
      color: COLORS.pipe, roughness: 0.30, metalness: 0.50,
      side: THREE.DoubleSide,
    }),
    equipment: mat({
      color: COLORS.equipment, roughness: 0.45, metalness: 0.50,
      side: THREE.DoubleSide,
    }),
    rebar: mat({
      color: COLORS.rebar, roughness: 0.5, metalness: 0.6,
    }),
    platform: mat({
      color: 0xc9c3b4, roughness: 0.6, metalness: 0.1,
      side: THREE.DoubleSide,
    }),
  };
}
