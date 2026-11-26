// 网站引导层：复刻独立演示 main.js 的材质整饰段（纹理绑定、凹凸、色板覆写、程序化环境贴图），
// 供 adapt.ts 与 ModelViewer 共享单例。Node（builders.test 环境）跳过依赖 document 的部分，
// 材质仍可创建、几何仍可构建——纹理/环境贴图仅影响呈现，不影响构建校验。
import * as THREE from 'three';
import { createMaterials } from './materials.js';
import { createTextures } from './textures.js';

let singleton = null;

function makeEnvTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.0, '#3d5f7e');
  g.addColorStop(0.42, '#94aab8');
  g.addColorStop(0.52, '#c7ad86');
  g.addColorStop(0.62, '#4a4238');
  g.addColorStop(1.0, '#0c0b09');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  const warm = ctx.createRadialGradient(390, 105, 4, 390, 105, 110);
  warm.addColorStop(0, 'rgba(255,214,150,0.90)');
  warm.addColorStop(1, 'rgba(255,214,150,0)');
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, 512, 256);
  const cool = ctx.createRadialGradient(110, 70, 4, 110, 70, 90);
  cool.addColorStop(0, 'rgba(150,205,255,0.60)');
  cool.addColorStop(1, 'rgba(150,205,255,0)');
  ctx.fillStyle = cool;
  ctx.fillRect(0, 0, 512, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function getEngine() {
  if (singleton) return singleton;

  // 初值 = 不裁剪；variant 剖切由 adapt.ts 写 normal/constant
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1e6);
  const M = createMaterials(clipPlane);
  let env = null;

  if (typeof document !== 'undefined') {
    const T = createTextures();
    T.ore.repeat.set(2.0, 2.0);
    T.rock.repeat.set(1.7, 1.7);
    T.muck.repeat.set(2.2, 2.2);
    T.cavedOre.repeat.set(2.0, 2.0);
    T.cavedRock.repeat.set(2.0, 2.0);
    T.fill.repeat.set(2.3, 2.3);
    T.dryFill.repeat.set(2.0, 2.0);
    T.concrete.repeat.set(1.8, 1.8);
    T.lining.repeat.set(2.0, 1.1);

    const textureBindings = [
      [T.ore, [[M.ore, 0.18], [M.oreGhost, 0], [M.oreSolid, 0.27], [M.oreRemaining, 0.23], [M.pillar, 0.26], [M.pillarSill, 0.20]]],
      [T.rock, [[M.rock, 0.20]]],
      [T.muck, [[M.muck, 0.34]]],
      [T.cavedOre, [[M.cavedOre, 0.38], [M.residual, 0.24]]],
      [T.cavedRock, [[M.cavedRock, 0.39], [M.overburden, 0.30]]],
      [T.fill, [[M.fillWater, 0.10], [M.fillWaterAlt, 0.10]]],
      [T.dryFill, [[M.fillDry, 0.28]]],
      [T.concrete, [[M.fillCemented, 0.13], [M.fillCap, 0.08], [M.concrete, 0.14], [M.pillarArtificial, 0.12]]],
      [T.lining, [[M.drift, 0.13], [M.driftActive, 0.13], [M.funnel, 0.10]]],
    ];

    for (const [albedo, materials] of textureBindings) {
      // 凹凸纹理是线性数据，复用图像与平铺参数，单独设置色彩空间。
      const bump = albedo.clone();
      bump.colorSpace = THREE.NoColorSpace;
      for (const [material, bumpScale] of materials) {
        material.map = albedo;
        if (bumpScale > 0) {
          material.bumpMap = bump;
          material.bumpScale = bumpScale;
        }
      }
    }

    env = makeEnvTexture();
  }

  // 共享材质标记：variant/stage 重建时 disposeTree 不得释放（材质跨构建复用）
  for (const mat of Object.values(M)) {
    if (mat && mat.isMaterial) mat.userData.mfShared = true;
  }

  singleton = { clipPlane, M, env };
  return singleton;
}
