// 图层分组：与交付成果05的对象类型对应，UI 可逐层开关。
import * as THREE from 'three';

export const LAYER_KEYS = ['ore', 'rock', 'drift', 'stope', 'pillar', 'fill', 'muck', 'cut', 'shaft', 'lod2', 'labels'];

export const LAYER_LABEL = {
  ore: '矿体 ORE',
  rock: '围岩 ROCK',
  drift: '巷道 DRIFT',
  stope: '采场空区 STOPE',
  pillar: '矿柱 PILLAR',
  fill: '充填体 FILL',
  muck: '崩落体/残留 MUCK',
  cut: '切割工程 DEV-CUT',
  shaft: '井筒 PASS',
  lod2: 'LOD2 辅助细节',
  labels: '标注 LABEL',
};

export function createLayerGroups() {
  const group = new THREE.Group();
  const layers = {};
  for (const key of LAYER_KEYS) {
    const lg = new THREE.Group();
    lg.name = key;
    group.add(lg);
    layers[key] = lg;
  }
  return { group, layers };
}

/** 创建 Mesh、写入溯源字段并挂到图层 */
export function addMesh(layer, geometry, material, meta, registry, { outline = null, renderOrder } = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  if (renderOrder !== undefined) mesh.renderOrder = renderOrder;
  registry.tag(mesh, meta);
  layer.add(mesh);
  if (outline) layer.add(outline);
  return mesh;
}
