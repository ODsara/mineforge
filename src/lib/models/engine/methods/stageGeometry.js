import * as THREE from 'three';
import { dippingSlab, dashedOutline } from '../geometry.js';
import { addMesh } from '../layers.js';

/** The end slot replaces a strip of ore when the slot is opened. */
export function buildEndSlot(layers, registry, M, profile, name, reference) {
  const geo = dippingSlab(profile);
  const ore = addMesh(layers.ore, geo, M.oreSolid, {
    type_code: 'ORE', name: `${name}（待切割矿体）`, source_tier: '【假】',
    textbook_ref: reference, dimensions: '宽3m，贯穿矿房', stage: '切割', assumption: true,
  }, registry);
  const slot = addMesh(layers.cut, geo, M.stopeVoid, {
    type_code: 'STOPE-A', name, mining_state: 'excavation',
    source_tier: '【图】', textbook_ref: reference, dimensions: '宽3m，贯穿矿房', stage: '切割',
  }, registry);
  const outline = dashedOutline(geo, 0xffc178, 0.5, 2, 1.6);
  layers.cut.add(outline);
  function set(open, mined) {
    ore.visible = !open && !mined;
    slot.visible = open && !mined;
    outline.visible = slot.visible;
  }
  set(false, false);
  return { set };
}

/** Draw simplified drill traces in vertical cross-sections through the drift. */
export function sectionTraces(rows) {
  const points = [];
  for (const { x, from, to } of rows) {
    for (const [y, z] of to) {
      points.push(x, ...from, x, y, z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xffb964, transparent: true, opacity: 0.84 });
  const traces = new THREE.LineSegments(geometry, material);
  traces.visible = false;
  return traces;
}
