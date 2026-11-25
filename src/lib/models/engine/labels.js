// 标注（网站适配版）：原版为独立演示页的屏幕空间 DOM 标签；
// 网站 ModelViewer 自有锚点投影体系（DOM + 相机后方剔除），这里不再操作 document。
// makeLabel 仅把标签元数据写入锚点 Object3D 的 userData，适配层（adapt.ts）
// 在构建后遍历 labels 图层收集为 anchors，由查看器统一投影。
// 图层组结构、锚点位置与 phase 阶段显隐逻辑与原版保持一致。
import * as THREE from 'three';

export function initLabels() {} // 兼容桩：网站不调用 DOM 标注

export function makeLabel(text, { tone = '', sub = '', pri = 50 } = {}) {
  const anchor = new THREE.Object3D();
  anchor.userData = { isLabel: true, labelText: String(text), sub: sub || '', tone: tone || '', pri };
  return anchor;
}

export function addLabelLayer(parent, entries) {
  const group = new THREE.Group();
  group.name = 'labels';
  entries.forEach((e, i) => {
    const anchor = makeLabel(e.text, {
      tone: e.tone,
      sub: e.sub,
      pri: e.pri ?? (100 - i * 2),
    });
    anchor.position.set(e.pos[0], e.pos[1], e.pos[2]);
    anchor.userData.phase = e.phase || 'always';
    if (e.scale) anchor.scale.setScalar(e.scale);
    group.add(anchor);
  });
  parent.add(group);
  return group;
}

export function updateLabels() {} // 兼容桩
