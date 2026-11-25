import * as T from 'three';
import { layers, methods } from './content.js';
import { createPlan } from './cases.js';
import { verifyPlan } from './plan.js';
import { outlineFor } from './sections.js';

const vec = (point) => new T.Vector3(...point);
const up = new T.Vector3(0, 1, 0);
const rand = (seed) => () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};

export function createMaterials(colors) {
  const material = (color, extra = {}) => new T.MeshStandardMaterial({ color, roughness: 0.95, flatShading: true, ...extra });
  const stone = (color, banding) => {
    const surface = material(color);
    surface.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 samplePosition;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nsamplePosition = (modelMatrix * vec4(position, 1.0)).xyz;');
      shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
        varying vec3 samplePosition;
        float grain(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 21.173))) * 43758.5453); }
      `).replace('#include <color_fragment>', `#include <color_fragment>
        float mineral = grain(floor(samplePosition * 48.0)) * 0.12;
        float seam = smoothstep(0.72, 0.94, sin(samplePosition.y * 13.0 + samplePosition.z * 1.7));
        diffuseColor.rgb *= 0.93 + mineral - seam * ${banding};
      `);
    };
    surface.customProgramCacheKey = () => 'strata:' + banding;
    return surface;
  };
  return {
    rock: stone(colors.rock, '0.13'),
    rockLight: stone(colors.rockLight, '0.16'),
    rockDark: stone(colors.rockDark, '0.12'),
    ore: stone(colors.ore, '0.09'),
    fill: stone(colors.fill, '0.14'),
    bulkhead: material(colors.rockLight),
    concrete: material(colors.concrete),
    pipe: material(colors.pipe),
    pipeTrace: new T.LineDashedMaterial({ color: colors.pipe, dashSize: 0.19, gapSize: 0.11, depthWrite: false }),
    void: material(colors.trim, { transparent: true, opacity: 0.13, depthWrite: false, side: T.DoubleSide }),
    thinVoid: material(colors.trim, { transparent: true, opacity: 0.07, depthWrite: false, side: T.DoubleSide }),
    pillar: stone(colors.pillar, '0.12'),
    foundation: material(colors.rockDark),
    broken: material(colors.broken),
    waste: material(colors.waste),
    access: material(colors.access),
    bed: material(colors.bed),
    gallery: material(colors.access, { transparent: true, opacity: 0.19, depthWrite: false, side: T.DoubleSide }),
    scraperFrame: material(colors.concrete),
    trim: material(colors.trim),
    slot: material(colors.access, { transparent: true, opacity: 0.22, depthWrite: false, side: T.DoubleSide }),
    diagram: material(colors.work, { emissive: colors.work, emissiveIntensity: 0.11, depthTest: false }),
    work: material(colors.work, { emissive: colors.work, emissiveIntensity: 0.14 }),
    edges: new T.LineBasicMaterial({ color: colors.edge, transparent: true, opacity: 0.33 }),
    slotEdge: new T.LineBasicMaterial({ color: colors.trim, transparent: true, opacity: 0.78 }),
  };
}

class Model {
  constructor(materials) {
    this.materials = materials;
    this.root = new T.Group();
    this.layers = {};
    for (const id of Object.keys(layers)) {
      this.layers[id] = new T.Group();
      this.root.add(this.layers[id]);
    }
    this.annotations = [];
    this.layers.shaft = new T.Group();
    this.layers.base = new T.Group();
    this.root.add(this.layers.shaft, this.layers.base);
    this.pipeTrace = new T.Group();
    this.pipeTrace.visible = false;
    this.activePipe = false;
    this.layers.fill.add(this.pipeTrace);
    this.growingFill = [];
    this.flows = [];
    this.particles = new T.IcosahedronGeometry(1, 0);
    this.seed = 701;
  }

  add(geometry, layer, surface, outline = true) {
    const mesh = new T.Mesh(geometry, this.materials[surface]);
    if (this.info) Object.assign(mesh.userData, this.info);
    if (outline) {
      const edges = new T.LineSegments(new T.EdgesGeometry(geometry, 25),
        this.materials[surface === 'slot' ? 'slotEdge' : 'edges']);
      mesh.add(edges);
    }
    this.layers[layer].add(mesh);
    return mesh;
  }

  box(x0, x1, y0, y1, z0, z1, layer, surface = layer, dip = 0, outline = true) {
    if (x1 - x0 < 0.025 || y1 - y0 < 0.025 || z1 - z0 < 0.025) return;
    const shape = new T.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
    shape.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    if (dip) {
      const pos = shape.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) - pos.getZ(i) * dip);
      shape.computeVertexNormals();
    }
    return this.add(shape, layer, surface, outline);
  }

  rod(a, b, width, layer, surface = layer, sides = 8) {
    const start = vec(a);
    const end = vec(b);
    const d = end.clone().sub(start);
    if (d.lengthSq() < 0.001) return;
    const geometry = new T.CylinderGeometry(width, width, d.length(), sides);
    const item = this.add(geometry, layer, surface, false);
    item.quaternion.setFromUnitVectors(up, d.normalize());
    item.position.copy(start.lerp(end, 0.5));
    return item;
  }

  loft(first, last, surface) {
    const vertices = [];
    for (let i = 0; i < first.length; i++) {
      const j = (i + 1) % first.length;
      for (const p of [first[i], first[j], last[j], first[i], last[j], last[i]]) vertices.push(...p.toArray());
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    this.add(geometry, 'access', surface, false);
  }

  rim(points, surface = 'trim') {
    const geometry = new T.BufferGeometry().setFromPoints([...points, points[0]]);
    const ring = new T.Line(geometry, this.materials.slotEdge);
    this.layers.access.add(ring);
    if (surface === 'scraperFrame') {
      for (let i = 0; i < points.length; i++) {
        this.rod(points[i].toArray(), points[(i + 1) % points.length].toArray(), 0.018, 'access', surface);
      }
    }
  }

  gallery(a, b, profile) {
    const start = vec(a);
    const end = vec(b);
    const heading = end.clone().sub(start);
    const side = heading.clone().cross(up).normalize();
    if (side.lengthSq() < 0.1) {
      this.bore(a, b, { shape: 'rectangle', radius: profile.width * 0.34 });
      return;
    }
    const section = outlineFor(profile);
    const measure = heading.length();
    const ring = (point, scale = 1) => section.map(([x, y]) => point.clone()
      .addScaledVector(side, x * scale).addScaledVector(up, y * scale));
    const first = ring(start);
    const last = ring(end);
    this.loft(first, last, 'gallery');
    this.rim(first);
    this.rim(last);
    const ribs = Math.floor(measure / (profile.support === 'lining' ? 2.3 : 1.15));
    for (let i = 1; i <= ribs; i++) {
      const center = start.clone().lerp(end, i / (ribs + 1));
      this.rim(ring(center), profile.support === 'frames' ? 'scraperFrame' : 'trim');
    }
    const floorWidth = profile.width * 0.5;
    const railOffset = side.clone().multiplyScalar(-profile.width * 0.09);
    for (const sign of [-1, 1]) {
      const offset = side.clone().multiplyScalar(floorWidth * sign);
      this.rod(start.clone().add(offset).toArray(), end.clone().add(offset).toArray(), 0.025, 'access', 'trim');
      if (!profile.rail) continue;
      offset.multiplyScalar(0.48).add(railOffset);
      this.rod(start.clone().add(offset).toArray(), end.clone().add(offset).toArray(), 0.022, 'access', 'bed');
    }
    if (profile.rail) {
      for (let i = 0.27; i < measure; i += 0.53) {
        const center = start.clone().lerp(end, i / measure).add(railOffset);
        const sleeper = side.clone().multiplyScalar(floorWidth * 0.60);
        this.rod(center.clone().sub(sleeper).toArray(), center.clone().add(sleeper).toArray(), 0.024, 'access', 'bed');
      }
    }
  }

  bore(a, b, profile) {
    const start = vec(a);
    const end = vec(b);
    const direction = end.clone().sub(start).normalize();
    const u = Math.abs(direction.y) > 0.94 ? new T.Vector3(1, 0, 0) : direction.clone().cross(up).normalize();
    const v = direction.clone().cross(u).normalize();
    const square = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
    const outline = profile.shape === 'circle' ? Array.from({ length: 14 }, (_, i) => {
      const angle = 2 * Math.PI * i / 14;
      return [Math.cos(angle), Math.sin(angle)];
    }) : square;
    const ring = (p, radius) => outline.map(([x, z]) => p.clone().addScaledVector(u, radius * x).addScaledVector(v, radius * z));
    const first = ring(start, profile.radius);
    const hopper = profile.shape === 'hopper';
    if (hopper) {
      const neck = ring(start.clone().lerp(end, 0.69), profile.radius * 0.36);
      const foot = ring(end, profile.radius * 0.36);
      this.loft(first, neck, 'slot');
      this.loft(neck, foot, 'slot');
      this.rim(neck);
      this.rim(foot);
    } else {
      const last = ring(end, profile.radius);
      this.loft(first, last, 'slot');
      this.rim(last);
    }
    this.rim(first);
  }

  fitting({ point: [x, y, z], shape, layer }) {
    if (shape === 'grizzly') {
      for (const offset of [-0.16, -0.08, 0, 0.08, 0.16]) {
        this.rod([x - 0.23, y + 0.025, z + offset], [x + 0.23, y + 0.09, z + offset], 0.013, layer, 'trim', 5);
      }
      return;
    }
    if (shape === 'gate') {
      for (const side of [-0.18, 0.18]) this.rod([x + side, y - 0.05, z], [x + side, y + 0.30, z], 0.024, layer, 'trim');
      this.rod([x - 0.19, y + 0.30, z], [x + 0.19, y + 0.30, z], 0.032, layer, 'trim');
      this.box(x - 0.16, x + 0.16, y + 0.16, y + 0.25, z - 0.028, z + 0.028, layer, 'scraperFrame');
      return;
    }
    if (shape === 'storage') {
      const bin = new T.CylinderGeometry(0.29, 0.17, 0.31, 12, 1, true);
      bin.translate(x, y + 0.15, z);
      this.add(bin, layer, 'slot');
      return;
    }
    if (shape === 'drain') {
      for (const dx of [-0.13, 0, 0.13]) {
        this.rod([x + dx, y, z - 0.10], [x + dx, y - 0.035, z + 0.18], 0.017, layer, 'bed');
      }
      return;
    }
    if (shape === 'nozzle') {
      this.rod([x, y + 0.14, z], [x, y, z], 0.082, layer, 'pipe');
      return;
    }
    this.rod([x, y, z], [x, y + 0.11, z], 0.014, layer, 'scraperFrame', 5);
  }

  label(layer, name, point) {
    this.annotations.push({ layer, name, world: vec(point) });
  }

  rubble(layer, bounds, size, volume, packing = 1) {
    const [x0, x1, y0, y1, z0, z1] = bounds;
    const random = rand(this.seed++);
    const step = size * 1.42 * packing;
    const spots = [];
    for (let x = x0 + step / 2; x < x1; x += step) {
      for (let z = z0 + step / 2; z < z1; z += step) {
        for (let y = y0 + step / 2; y < y1; y += step) {
          const shift = () => (random() - 0.5) * step * 0.75;
          const point = [x + shift(), y + shift(), z + shift()];
          if (volume(...point)) spots.push(point);
        }
      }
    }
    if (!spots.length) return;
    const mesh = new T.InstancedMesh(this.particles, this.materials[layer], spots.length);
    if (this.info) Object.assign(mesh.userData, this.info);
    const pose = new T.Object3D();
    const tint = new T.Color();
    spots.forEach(([x, y, z], index) => {
      pose.position.set(x, y, z);
      pose.rotation.set(random() * 6, random() * 6, random() * 6);
      const scale = size * (0.6 + random() * 0.6);
      pose.scale.set(scale, scale * 0.75, scale * (0.7 + random() * 0.48));
      pose.updateMatrix();
      mesh.setMatrixAt(index, pose.matrix);
      tint.setScalar(0.52 + random() * 0.77);
      mesh.setColorAt(index, tint);
    });
    this.layers[layer].add(mesh);
  }

  flow(points, type) {
    const path = new T.CurvePath();
    for (let i = 1; i < points.length; i++) path.add(new T.LineCurve3(vec(points[i - 1]), vec(points[i])));
    if (!path.getLength()) return;
    const layer = type === 'fill' ? 'fill' : 'work';
    const surface = type === 'fill' ? 'bulkhead' : 'work';
    points.slice(1).forEach((point, index) => {
      this.rod(points[index], point, 0.026, layer, surface);
    });
    const particles = [];
    for (let i = 0; i < 3; i++) {
      const mesh = new T.Mesh(this.particles, this.materials[surface]);
      mesh.scale.setScalar(0.16);
      this.layers[layer].add(mesh);
      particles.push(mesh);
    }
    this.flows.push({ path, particles });
  }

}

function envelopes(link) {
  if (!link.cut || !link.section) return [];
  const { a, b, section } = link;
  const width = section.radius ?? section.width / 2;
  const upright = Math.abs(b[1] - a[1]) > Math.hypot(b[0] - a[0], b[2] - a[2]);
  const above = section.radius ? (upright ? 0.07 : width) : section.height + 0.02;
  const below = section.radius && !upright ? width : 0.075;
  const diagonal = a.filter((value, axis) => value !== b[axis]).length > 1;
  const n = diagonal ? Math.max(2, Math.ceil(Math.hypot(...b.map((v, i) => v - a[i])) / 0.35)) : 1;
  return Array.from({ length: n }, (_, i) => {
    const first = a.map((v, j) => v + (b[j] - v) * i / n);
    const last = a.map((v, j) => v + (b[j] - v) * (i + 1) / n);
    const dx = diagonal || first[0] === last[0] ? width + 0.015 : 0.045;
    const dz = diagonal || first[2] === last[2] ? width + 0.015 : 0.045;
    return [
      Math.min(first[0], last[0]) - dx, Math.max(first[0], last[0]) + dx,
      Math.min(first[1], last[1]) - below, Math.max(first[1], last[1]) + above,
      Math.min(first[2], last[2]) - dz, Math.max(first[2], last[2]) + dz,
    ];
  });
}

const overlaps = (a, b) => [0, 2, 4].every(i => a[i] < b[i + 1] - 1e-6 && a[i + 1] > b[i] + 1e-6);

function subtract(bounds, space) {
  if (!overlaps(bounds, space)) return [bounds];
  const pieces = [];
  const inner = bounds.slice();
  for (const i of [0, 2, 4]) {
    if (inner[i] < space[i] - 1e-6) {
      const piece = inner.slice();
      piece[i + 1] = space[i];
      pieces.push(piece);
      inner[i] = space[i];
    }
    if (inner[i + 1] > space[i + 1] + 1e-6) {
      const piece = inner.slice();
      piece[i] = space[i + 1];
      pieces.push(piece);
      inner[i + 1] = space[i + 1];
    }
  }
  return pieces;
}

function occupied(bounds, x, y, z, tolerance = 0) {
  return [x, y, z].every((value, axis) =>
    value > bounds[axis * 2] + tolerance && value < bounds[axis * 2 + 1] - tolerance);
}

export function solidPieces(plan) {
  const cuts = plan.links.flatMap(envelopes);
  return plan.volumes.flatMap(volume => {
    const { bounds, layer, style } = volume;
    if (layer === 'void' || style === 'rubble' || style === 'bulkhead') return [{ ...volume, bounds }];
    const intersecting = cuts.filter(space => overlaps(bounds, space));
    return intersecting.reduce((parts, space) => parts.flatMap(part => subtract(part, space)), [bounds])
      .map(part => ({ ...volume, bounds: part, cutFragment: intersecting.length > 0 }));
  });
}

export function verifyGeometry(plan) {
  const errors = verifyPlan(plan);
  const solids = solidPieces(plan).filter(v => v.layer !== 'void' && v.style !== 'rubble');
  for (const link of plan.links) {
    if (!link.cut) continue;
    for (const t of [0.05, 0.25, 0.5, 0.75, 0.95]) {
      const point = link.a.map((value, i) => value + t * (link.b[i] - value));
      if (solids.some(({ bounds, style }) => style !== 'bulkhead' && occupied(bounds, ...point, 0.02))) {
        errors.push('井巷中心线被实体阻断 ' + link.name + ' ' + point.join(','));
        break;
      }
    }
  }
  const bulkheads = solids.filter(volume => volume.style === 'bulkhead');
  for (const route of plan.routes.filter(route => route.type === 'ore')) {
    for (let i = 1; i < route.points.length; i++) {
      if (bulkheads.some(({ bounds }) => crossesInterior(route.points[i - 1], route.points[i], bounds))) {
        errors.push('矿流穿过封堵挡墙 ' + route.name);
      }
    }
  }
  return errors;
}

function crossesInterior(a, b, bounds) {
  let from = 0;
  let to = 1;
  for (let axis = 0; axis < 3; axis++) {
    const lo = bounds[axis * 2] + 0.005;
    const hi = bounds[axis * 2 + 1] - 0.005;
    const change = b[axis] - a[axis];
    if (Math.abs(change) < 1e-6) {
      if (a[axis] <= lo || a[axis] >= hi) return false;
    } else {
      const t0 = (lo - a[axis]) / change;
      const t1 = (hi - a[axis]) / change;
      from = Math.max(from, Math.min(t0, t1));
      to = Math.min(to, Math.max(t0, t1));
      if (to <= from) return false;
    }
  }
  return to > from;
}

function createVolume(model, volume, plan, previousFill) {
  const { bounds, layer, style } = volume;
  if (style === 'rubble') {
    const size = plan.phase > 3 && layer === 'broken' ? 0.32 : layer === 'waste' ? 0.39 : 0.31;
    const openWays = plan.links.flatMap(envelopes).filter(space => overlaps(bounds, space));
    model.rubble(layer, bounds, size, (x, y, z) =>
      occupied(bounds, x, y, z) && !openWays.some(space => occupied(space, x, y, z)));
    return;
  }
  const [x0, x1, y0, y1, z0, z1] = bounds;
  if (style === 'roundPillar' || style === 'irregular') {
    const radius = Math.min(x1 - x0, z1 - z0) / 2;
    const irregular = style === 'irregular';
    const topRadius = irregular ? radius * 0.91 : radius;
    const geo = new T.CylinderGeometry(topRadius, radius, y1 - y0, irregular ? 7 : 32);
    geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    model.add(geo, layer, 'pillar');
    return;
  }
  const surface = style === 'plainOre' ? 'ore' : style;
  const outline = !volume.cutFragment && !['thinVoid', 'plainOre', 'rockDark'].includes(style);
  const mesh = model.box(...bounds, layer, surface, 0, outline);
  if (mesh && volume.layer === 'fill' && volume.style === 'fill' &&
      !previousFill.some(v => v.style === 'fill' && occupied(v.bounds, (x0+x1)/2, (y0+y1)/2, (z0+z1)/2))) {
    model.growingFill.push({ mesh, floor: y0, delay: (volume.fillSequence ?? 0) * 0.83 });
  }
}

function createLink(model, link) {
  const { a, b, kind, layer, section } = link;
  if (kind === 'surface') model.rod(a, b, 0.055, 'rock', 'rock');
  else if (kind === 'pipe') model.rod(a, b, 0.055, layer, 'pipe', 12);
  else if (section?.radius) model.bore(a, b, section);
  else if (section) model.gallery(a, b, section);
}

const shaftKinds = new Set(['shaft', 'gravity', 'chute', 'bell', 'fillBore']);
const stateForLayer = { ore: 'unmined', pillar: 'unmined', void: 'mined_out', waste: 'caved_rock', access: 'excavation', shaft: 'excavation' };

function describe(name, layer, shape, code, id, step, reference) {
  return {
    object_id: id,
    name,
    type_code: code,
    stage: step,
    mining_state: stateForLayer[layer] ?? (code === 'FILL' ? 'backfill' : code === 'RETAINED' ? 'retained_ore' : layer === 'broken' ? 'caved_ore' : 'object'),
    mined: ['void', 'broken'].includes(layer) || code === 'FILL',
    backfilled: layer === 'fill' && code === 'FILL',
    textbook_ref: reference,
    source_tier: '【教】',
    assumption: true,
    dimensions: shape ?? '教学示意',
  };
}
export function buildModel(materials, method, phase, plan = createPlan(method, phase)) {
  const model = new Model(materials);
  const earlier = phase ? createPlan(method, phase - 1) : null;
  const entry = methods[method];
  const reference = '《采矿学（第2版）》§' + entry.section + ' · 图 ' + entry.figure.number;
  const step = entry.steps[phase][0];
  const describePart = (name, layer, shape, code, id) =>
    describe(name, layer, shape, code, method + '-' + id, step, reference);
  for (const [i, volume] of solidPieces(plan).entries()) {
    if (volume.style === 'foundation' && volume.bounds[3] < 0) {
      model.info = null;
      const before = model.layers.rock.children.length;
      createVolume(model, volume, plan, []);
      const base = model.layers.rock.children.slice(before);
      if (base.length) model.layers.base.add(...base);
      continue;
    }
    const label = volume.name ?? layers[volume.layer].name;
    const code = volume.layer === 'broken' ? (method === 'shrink' ? 'RETAINED' : 'BROKEN') : volume.layer === 'fill' ? (volume.style === 'fill' ? 'FILL' : 'SUPPORT') :
      volume.layer === 'void' ? 'STOPE-A' : volume.layer.toUpperCase();
    model.info = describePart(label, volume.layer, volume.style === 'roundPillar' ? '圆柱形点柱' : undefined, code, 'v-' + i);
    createVolume(model, volume, plan, earlier?.volumes ?? []);
  }
  for (const [i, link] of plan.links.entries()) {
    const shaft = shaftKinds.has(link.kind);
    const before = model.layers.access.children.length;
    const name = link.name ?? link.section?.name ?? '联络线';
    model.info = describePart(name, shaft ? 'shaft' : link.layer, link.section?.name, shaft ? 'SHAFT' : 'DRIFT', 'r-' + i);
    createLink(model, link);
    if (shaft && model.layers.access.children.length > before) model.layers.shaft.add(...model.layers.access.children.slice(before));
  }
  model.info = null;
  for (const pipe of plan.pipelines) {
    const line = new T.Line(new T.BufferGeometry().setFromPoints(pipe.route.map(vec)), materials.pipeTrace);
    line.computeLineDistances();
    line.renderOrder = 10;
    model.pipeTrace.add(line);
  }
  model.activePipe = plan.pipelines.some(pipe => pipe.active);
  for (const [i, fitting] of plan.fittings.entries()) {
    const before = model.layers.access.children.length;
    model.info = describePart(fitting.name ?? '井巷附属设施', fitting.layer, undefined, 'FITTING', 'f-' + i);
    model.fitting(fitting);
    if (model.layers.access.children.length > before) model.layers.shaft.add(...model.layers.access.children.slice(before));
  }
  model.info = null;
  for (const marker of plan.technical) {
    const surface = marker.style === 'work' ? 'diagram' : marker.style === 'rock' ? 'rockLight' : 'pillar';
    const mesh = model.rod(marker.a, marker.b, marker.style === 'work' ? 0.028 : 0.062, marker.style, surface);
    if (mesh && surface === 'diagram') mesh.renderOrder = 8;
  }
  const shaftNames = new Set(plan.links.filter(link => shaftKinds.has(link.kind)).map(link => link.name));
  for (const fitting of plan.fittings.filter(item => item.layer === 'access')) shaftNames.add(fitting.name);
  for (const { name, position, layer } of plan.labels) {
    model.label(shaftNames.has(name) ? 'shaft' : layer, name, position);
  }
  for (const route of plan.routes) model.flow(route.points, route.type);
  model.routeNames = [...new Set(plan.routes.map(route => route.name))];
  return model;
}

export function disposeModel(model) {
  for (const layer of Object.values(model.layers)) layer.traverse(object => {
    if (object.isInstancedMesh) object.dispose();
    if (object.geometry && object.geometry !== model.particles) object.geometry.dispose();
  });
  model.particles.dispose();
}
