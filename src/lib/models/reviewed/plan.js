import { sectionFor } from './sections.js';

export const baseY = 0.32;
export const exit = [7.75, baseY, 5.05];
export const collar = [7.75, 10.52, 5.05];
export const yard = [9.1, 10.52, 5.05];
export const passX = 6.45;
export const passZ = 3.65;
export const passBase = [passX, baseY, passZ];
export const haulJoin = [passX, baseY, 5.05];
export const ventX = -7.6;
export const ventY = 9.45;
export const ventZ = 4.42;
export const ventHead = [ventX, ventY, ventZ];

const same = (a, b) => a.every((value, i) => Math.abs(value - b[i]) < 1e-6);
const key = p => p.map(value => Math.round(value * 1e6)).join(',');
const edgeKey = (a, b) => [key(a), key(b)].sort().join('/');
const axisAligned = (a, b) => a.filter((value, i) => Math.abs(value - b[i]) > 1e-6).length === 1;

export class Plan {
  constructor(phase) {
    this.phase = phase;
    this.links = [];
    this.volumes = [];
    this.labels = [];
    this.routes = [];
    this.technical = [];
    this.fittings = [];
    this.pipelines = [];
    this.orePasses = [];
    this.edges = new Map();
    this.transport = [passBase, haulJoin, exit, collar, yard];
    this.network = new Map();
  }

  line(name, points, kind = 'drift', layer = 'access', cut = true) {
    const section = sectionFor(name, kind);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (same(a, b)) continue;
      const link = { a, b, kind, layer, cut, name, section };
      this.links.push(link);
      this.edges.set(edgeKey(a, b), link);
      for (const [p, q] of [[a, b], [b, a]]) {
        const list = this.network.get(key(p)) ?? [];
        list.push(key(q));
        this.network.set(key(p), list);
      }
    }
    const middle = Math.floor((points.length - 1) / 2);
    const position = points[middle].map((value, i) => (value + points[middle + 1][i]) / 2);
    this.label(name, position, layer, section?.name);
  }

  label(name, position, layer, detail) {
    if (!name || this.labels.some(item => item.name === name)) return;
    this.labels.push({ name, position, layer, detail });
  }

  volume(name, bounds, layer, style = layer, condition) {
    if (bounds.some(value => !Number.isFinite(value))) throw new Error('Invalid volume ' + name);
    if (bounds[0] >= bounds[1] || bounds[2] >= bounds[3] || bounds[4] >= bounds[5]) return;
    this.volumes.push({ bounds, layer, style, condition, name });
    const [x0, x1, y0, y1, , z1] = bounds;
    this.label(name, [(x0 + x1) / 2, (y0 + y1) / 2, z1], layer);
  }

  mark(name, a, b, style = 'work') {
    this.technical.push({ a, b, style });
    this.label(name, a.map((value, i) => (value + b[i]) / 2), style);
  }

  fitting(name, point, shape, layer = 'access') {
    this.fittings.push({ name, point, shape, layer });
    this.label(name, point, layer);
  }

  flow(name, points, type = 'ore') {
    const list = points.filter((p, i) => i === 0 || !same(p, points[i - 1]));
    this.routes.push({ name, points: list, type });
  }
}

export function opening(plan, { thin = false, high = ventY, haulStops = [] } = {}) {
  const tail = [-7.95, baseY, 5.05];
  const shaftBottom = [exit[0], -0.18, exit[2]];
  const ventTop = [ventX, 10.52, ventZ];
  const head = [9.1, 10.52, ventZ];
  const highJoin = [7.75, high, 5.05];
  const upper = [7.75, high, ventZ];
  plan.transport.splice(3, 0, highJoin);
  plan.line('主井', [shaftBottom, exit, highJoin, collar], 'shaft');
  const haulage = [tail, ...haulStops, haulJoin, exit];
  plan.line('阶段运输巷道', haulage);
  plan.line('地表卸矿线', [collar, yard], 'surface', 'rock', false);
  if (high !== ventY) plan.line(null, [ventHead, [ventX, high, ventZ]], 'shaft');
  plan.line('回风井', [ventHead, ventTop], 'shaft');
  plan.line('地表检修通道', [ventTop, [7.75, 10.52, ventZ], head, yard], 'surface', 'rock', false);
  plan.line('上部回风联络道', [[ventX, high, ventZ], upper, highJoin]);
  plan.volume(null, [-8.45, 8.5, -0.88, -0.4, -4.95, 5.48], 'rock', 'foundation');
  plan.volume('围岩剖切面', [-6.8, 6.8, -0.37, 0.07, -4.65, 4.3], 'rock', 'rock');
  plan.volume(null, [-6.75, 6.45, 0.07, thin ? 2.6 : 9.5, -3.95, -3.4], 'rock', 'rockDark');
  plan.volume('井口平台', [7.27, 9.32, 10.37, 10.52, 3.93, 5.68], 'rock', 'foundation');
  const towerTop = 11.25;
  for (const x of [7.39, 8.11]) {
    for (const z of [4.69, 5.41]) {
      plan.mark('提升井架', [x, 10.52, z], [x, towerTop, z], 'rock');
      plan.mark(null, [x, towerTop, z], [x, towerTop, 10.1 - z], 'rock');
      plan.mark(null, [x, towerTop, z], [15.5 - x, towerTop, z], 'rock');
    }
  }
  if (plan.phase === 0) plan.flow('阶段运输与主井提升', [...haulage, highJoin, collar, yard], 'opening');
}

// Each intake is a work-floor waypoint. Ore drops to the shaft below that level.
export function orePass(plan, name, mouths, outlet, { inclined = false } = {}) {
  const intakes = mouths.slice().sort((a, b) => a[1] - b[1]);
  const rise = intakes[0][1] - outlet[1];
  const delta = Math.min(0.31, rise * 0.43);
  const foot = [outlet[0], outlet[1] + delta, outlet[2] - delta * 0.70];
  const entries = intakes.map(point => [point[0], point[1] - delta * 0.77, foot[2]]);
  if (inclined) {
    // The local ore pass descends in a rectangular bore directly from the grizzly.
    plan.line(name, [intakes[0], outlet], 'chute');
    plan.fitting(name + '卸矿格筛', intakes[0], 'grizzly');
  } else {
    plan.line(name, [foot, ...entries], 'gravity');
    for (const [i, entry] of entries.entries()) {
      plan.line(i === entries.length - 1 ? '卸矿口及短斜溜道' : '中间卸矿口及分支斜溜道',
        [intakes[i], entry], 'chute');
      plan.fitting('卸矿格筛', intakes[i], 'grizzly');
    }
    plan.line('井底收口与放矿溜口', [foot, outlet], 'chute');
    if (intakes.at(-1)[1] - outlet[1] >= 1.3) plan.fitting('井底贮矿段', foot, 'storage');
  }
  plan.fitting(inclined ? '斜溜井底放矿闸门' : '井底放矿闸门', outlet, 'gate');
  plan.orePasses.push({ name, intakes, entries, outlet, inclined });
  return mouth => {
    const i = intakes.findIndex(point => same(point, mouth));
    return inclined ? [mouth, outlet] : [mouth, ...entries.slice(0, i + 1).reverse(), foot, outlet];
  };
}

export function pass(plan, levels) {
  const mouths = [...new Set(levels)].sort((a, b) => a - b).map(y => [passX, y, passZ]);
  const route = orePass(plan, '矿石溜井', mouths, passBase);
  plan.line('溜井底部装运联络道', [passBase, haulJoin]);
  return y => [...route([passX, y, passZ]), ...plan.transport.slice(1)];
}

export function ramp(plan, levels, rail = false) {
  const ys = [...new Set(levels)].sort((a, b) => a - b);
  const root = [8.4, baseY, 5.05];
  plan.line('井底联络道', [exit, root]);
  const points = [root];
  const stops = new Map();
  for (const y of ys) {
    const start = points.at(-1);
    if (rail) points.push([8.4, y, 5.05]);
    else {
      const runs = Math.ceil((y - start[1]) / 1.28);
      for (let i = 1; i <= runs; i++) {
        const [x, , z] = points.at(-1);
        const nextY = i === runs ? y : start[1] + (y - start[1]) * i / runs;
        const turnX = x === 8.4 ? 9.02 : 8.4;
        points.push([x, nextY, z === 5.05 ? -3.35 : 5.05]);
        points.push([turnX, nextY, points.at(-1)[2]]);
      }
    }
    stops.set(y, points.at(-1));
  }
  plan.line(rail ? '通风人行天井' : '折返式采准斜坡道', points, rail ? 'shaft' : 'ramp');
  return y => stops.get(y);
}

export function upperLink(plan, x, z, top = ventY) {
  const hook = [x, top, z];
  const ventBranch = [ventX, top, z];
  plan.line('回风穿脉', [hook, ventBranch, [ventX, top, ventZ]]);
  return hook;
}

export function joinTo(plan, name, a, b, kind = 'drift') {
  const bend = [b[0], a[1], a[2]];
  const bend2 = [b[0], a[1], b[2]];
  plan.line(name, [a, bend, bend2, b], kind);
}

export function verifyPlan(plan) {
  const errors = [];
  const { edges, network, routes } = plan;
  const visited = new Set([key(exit)]);
  const queue = [key(exit)];
  for (let i = 0; i < queue.length; i++) {
    for (const node of network.get(queue[i]) ?? []) {
      if (visited.has(node)) continue;
      visited.add(node);
      queue.push(node);
    }
  }
  for (const { a, b, name, kind, cut } of plan.links) {
    if (!visited.has(key(a)) || !visited.has(key(b))) errors.push('孤立构筑物 ' + name + ' ' + key(a));
    if (cut && !['ramp', 'chute'].includes(kind) && !axisAligned(a, b)) errors.push('井巷剖切方向错误 ' + name);
  }
  for (const { name, points, type } of routes) {
    if (points.length < 2) errors.push('路线过短 ' + name);
    if (type === 'ore' && !same(points.at(-1), yard)) errors.push('矿流未到地表卸矿端 ' + name);
    if (type === 'fill' && !same(points[0], fillHead)) errors.push('充填线路未从供料端开始 ' + name);
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const link = edges.get(edgeKey(a, b));
      if (!link) {
        errors.push('流线跨过未连接节点 ' + name + ' ' + key(a) + ' → ' + key(b));
        continue;
      }
      if (['gravity', 'chute', 'bell'].includes(link.kind) && b[1] >= a[1]) errors.push('矿石沿溜井逆重力运动 ' + name);
      if (type === 'fill' && link.kind !== 'pipe') errors.push('料流离开充填管 ' + name);
      if (type === 'ore' && ['pipe', 'ramp', 'fillBore', 'service'].includes(link.kind)) errors.push('矿流进入不对应的线路 ' + name);
    }
  }
  return errors;
}

export const fillHead = [-7.2, 10.52, 4.42];
export function fillPipe(plan, { name, high, collar, branch, nozzle, active, endRise = 0, bore = false }) {
  const ventTop = [ventX, 10.52, ventZ];
  const topEntry = [collar[0], 10.52, collar[2]];
  const upper = [collar[0], high, collar[2]];
  const offsets = branch.map((point, i) => [point[0], point[1] + 0.39 + (i === branch.length - 1 ? endRise : 0), point[2]]);
  const pipeCollar = [topEntry[0], topEntry[1] + 0.10, topEntry[2]];
  const station = [fillHead[0], fillHead[1] + 0.1, fillHead[2]];
  const pipeUpper = [upper[0], high + 0.40, upper[2]];
  plan.line('地表充填站检修联络道', [ventTop, fillHead, [topEntry[0], 10.52, ventZ], topEntry], 'surface', 'rock', false);
  plan.volume('地表充填站', [-7.65, -6.65, 10.53, 11.2, 3.91, 4.93], 'fill', 'fill');
  if (bore) plan.line('地表充填钻孔', [topEntry, upper], 'fillBore');
  else plan.line('上部充填干线井', [topEntry, upper], 'shaft');
  plan.line(name, [upper, ...branch], 'service');
  const delivery = offsets.at(-1);
  if (delivery[1] > nozzle[1] && delivery[0] === nozzle[0] && delivery[2] === nozzle[2] && delivery[1] - nozzle[1] > 0.72) {
    plan.line('采场充填天井／下料孔', [delivery, nozzle], 'fillBore');
    plan.line(null, [delivery, branch.at(-1)], 'fillBore');
  }
  const route = [fillHead, station, [pipeCollar[0], station[1], station[2]], pipeCollar, pipeUpper, ...offsets, nozzle];
  plan.line('充填管路', route, 'pipe', 'fill', false);
  plan.fitting('充填下料口', nozzle, 'nozzle', 'fill');
  for (let i = 1; i < offsets.length; i++) {
    const a = offsets[i - 1];
    const b = offsets[i];
    if (a[0] === b[0] && a[2] === b[2]) continue;
    const mid = a.map((v, j) => (v + b[j]) / 2);
    plan.fitting('近顶吊挂充填管', mid, 'hanger', 'fill');
  }
  plan.pipelines.push({ name, nozzle, active, route, gallery: [upper, ...branch], nearRoof: offsets });
  if (active) plan.flow('料浆 → 充填天井或下料管 → 待填区域', route, 'fill');
}

