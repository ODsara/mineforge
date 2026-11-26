import { Plan, opening, pass, orePass, ramp, upperLink, joinTo, fillPipe, passX, passZ, ventY, baseY, haulJoin, passBase } from './plan.js';

const left = -5.7;
const right = 5.7;
const bottom = 1.64;
const top = 8.69;
const thinFloor = 1.28;
const thinTop = 2.62;
const thinZ = 3.26;
const thinBack = -3.25;
const cutX = left + 0.76;
const xsDraw = [-4.9, -2.45, 0, 2.45, 4.9];

const sorted = values => [...new Set(values)].sort((a, b) => a - b);
const lineX = (xs, y, z) => xs.map(x => [x, y, z]);
const panel = (p, name, x0, x1, layer, y0 = thinFloor, y1 = thinTop) =>
  p.volume(name, [x0, x1, y0, y1, thinBack, thinZ], layer);
const room = (p, name, x0, x1, y0, y1, b, layer, style = layer) =>
  p.volume(name, [x0, x1, y0, y1, -b, b], layer, style);

function thin(plan, method) {
  const s = plan.phase;
  const caving = method === 'longwall';
  const filled = method === 'flatfill';
  const regular = method === 'room';
  const roomXs = [-4.55, -1.5, 1.55, 4.55];
  const ends = regular ? (s === 3 ? [-1, 1, 2.35, thinZ] : [thinBack, thinBack, thinBack, thinBack]) : [];
  const front = [left, left, cutX, -1.7, filled || caving ? -0.04 : right, 3.15, right][s];
  const low = thinZ - 0.08;
  const high = 3.38;
  const back = thinBack + 0.16;
  const dropXs = regular ? roomXs : [-4.7, -2.05, 0.4, 2.75, 4.95];
  const haulStops = lineX(dropXs, baseY, 5.05);
  opening(plan, { thin: true, high, haulStops });
  plan.volume('底板围岩剖面', [left - 0.1, right + 0.1, 0.06, thinFloor - 0.035, thinBack, low + 0.20], 'rock', 'rock');
  if (s >= 1) {
    const vent = upperLink(plan, passX, back, high);
    const dropZ = low + 0.46;
    const localRoutes = dropXs.map((x, i) => {
      const mouth = [x, thinFloor, low];
      const outlet = [x, baseY, dropZ];
      const route = orePass(plan, '放矿斜溜井 ' + (i + 1), [mouth], outlet, { inclined: true });
      plan.line('装车巷道联络 ' + (i + 1), [outlet, haulStops[i]]);
      return [...route(mouth), ...haulStops.slice(i), haulJoin, ...plan.transport.slice(2)];
    });
    const branchXs = regular ? roomXs : s >= 2 ? [cutX, ...(s >= 3 ? [front === right ? 5.35 : front - 0.36] : [])] : [];
    const lowXs = sorted([left, ...branchXs, ...dropXs, right]);
    plan.line(s >= 2 ? '低侧切割平巷' : '低侧装矿联络巷', lineX(lowXs, thinFloor, low));
    const topXs = sorted([left, ...(regular ? roomXs : [cutX, front === right ? 5.35 : front - 0.36]), passX]);
    plan.line('高侧联络与回风道', [...lineX(topXs, thinFloor, back), vent]);
    if (s >= 2) {
      if (regular) {
        for (const [i, x] of roomXs.entries()) {
          plan.line('矿房 ' + (i + 1) + ' 中心上山', [[x, thinFloor, low], [x, thinFloor, Math.max(back, Math.min(low, ends[i]))], [x, thinFloor, back]]);
        }
      } else {
        const x = front === right ? 5.35 : front - 0.36;
        if (s <= 3) plan.line('边界切割上山', [[cutX, thinFloor, low], [cutX, thinFloor, back]]);
        if (s >= 3) plan.line('全厚回采作业带', [[x, thinFloor, low], [x, thinFloor, 0.9], [x, thinFloor, back]], 'face');
      }
      if (s >= 3 && !(caving && s === 6) && !(filled && s === 6)) {
        const x = regular ? roomXs[s === 3 ? 1 : 3] : front === right ? 5.35 : front - 0.36;
        const start = [x, thinFloor, regular ? Math.max(back, Math.min(low, ends[s === 3 ? 1 : 3])) : 0.9];
        const pick = dropXs.reduce((best, value, i) => Math.abs(value - x) < Math.abs(dropXs[best] - x) ? i : best, 0);
        const chosen = dropXs[pick];
        plan.label('本工序出矿斜溜井', [chosen, (thinFloor + baseY) / 2, low + 0.23], 'access');
        const path = lowXs.filter(value => value >= Math.min(x, chosen) && value <= Math.max(x, chosen));
        if (x > chosen) path.reverse();
        plan.flow('工作面 → 低侧切割平巷 → 分布式斜溜井 → 阶段运输', [
          start, ...lineX(path, thinFloor, low), ...localRoutes[pick],
        ]);
      }
    } else {
      joinTo(plan, '边界采准联络', [left, thinFloor, low], [left, thinFloor, back]);
    }
    if (filled) {
      const fillTo = s >= 4 ? (s === 6 ? right : s === 4 ? -1.25 : 1.68) : left;
      const x = s < 4 ? cutX - 0.22 : fillTo - 0.43;
      const headerY = thinTop - 0.53;
      // The pipe arrives from the upper stage and crosses the current fill strip under the roof.
      fillPipe(plan, {
        name: '上阶段沿脉充填巷与条带支路',
        high: headerY, collar: [left - 0.88, 0, back - 0.55],
        branch: [[x, headerY, back - 0.55], [x, headerY, s >= 4 ? 1.8 : back - 0.29]],
        nozzle: [x, thinTop - 0.30, s >= 4 ? 1.8 : back - 0.29], active: s >= 4,
      });
      if (s >= 4 && s < 6) {
        plan.volume('沿走向拦砂隔层', [fillTo - 0.08, fillTo + 0.08, thinFloor, thinTop, thinBack, low - 0.24], 'fill', 'bulkhead');
        plan.volume('低侧脱水砂门', [fillTo - 0.57, fillTo - 0.15, thinFloor, thinFloor + 0.45, low - 0.57, low - 0.41], 'fill', 'bulkhead');
        plan.fitting('砂门泄水孔', [fillTo - 0.36, thinFloor + 0.21, low - 0.41], 'drain', 'fill');
      }
    }
  }

  if (regular) {
    if (s < 3) {
      panel(plan, '待采矿层', left, right, 'ore');
    } else {
      const boundaries = [left, -3.05, 0, 3.05, right];
      for (const [i, end] of ends.entries()) {
        const z = Math.min(end, thinZ - 0.05);
        plan.volume('第 ' + (i + 1) + ' 矿房', [boundaries[i], boundaries[i + 1], thinFloor, thinTop, z, thinZ], 'void');
        plan.volume(null, [boundaries[i], boundaries[i + 1], thinFloor, thinTop, thinBack, z], 'ore');
        for (const cz of [-2.1, 0.08, 1.95]) {
          if (i === 3 || cz <= z + 0.45) continue;
          const px = boundaries[i + 1];
          const radius = 0.36;
          plan.volume('规则圆柱形点柱', [px - radius, px + radius, thinFloor, thinTop, cz - radius, cz + radius],
            'pillar', 'roundPillar');
        }
      }
      for (const x of [left - 0.43, right]) {
        panel(plan, '盘区边界矿柱', x, x + 0.43, 'pillar');
      }
    }
    return;
  }

  panel(plan, '待采矿层', front, right, 'ore');
  if (s === 2) panel(plan, '切割上山自由面', left, cutX, 'void');
  if (s < 3) return;

  const rear = filled ? ([left, left, left, left, -1.25, 1.68, right][s])
    : caving ? ([left, left, left, left, -1.31, 1.6, right][s]) : left;
  panel(plan, caving || filled ? '回采作业带' : '采空区', rear, front, 'void');
  if (front < right) plan.mark('贯穿矿层的回采工作面', [front, thinTop, thinBack], [front, thinTop, thinZ - 0.08]);
  if (filled && s >= 4) {
    const earlier = [left, left, left, left, left, -1.25, 1.68][s];
    panel(plan, '已完成的分带充填体', left, earlier, 'fill');
    const strips = 6;
    for (let i = 0; i < strips; i++) {
      const z1 = thinZ - (thinZ - thinBack) * i / strips;
      const z0 = thinZ - (thinZ - thinBack) * (i + 1) / strips;
      plan.volume(i === 0 ? '自低侧向高侧分带充填' : null,
        [earlier, rear, thinFloor, thinTop, z0, z1], 'fill', 'fill');
      plan.volumes.at(-1).fillSequence = i / (strips - 1);
    }
  }
  if (caving) {
    plan.volume('崩落顶板', [left, rear, thinFloor, thinTop + 0.72, thinBack, low - 0.12], 'waste', 'rubble');
    plan.volume('采场上方围岩', [rear, right, thinTop + 0.08, thinTop + 0.48, thinBack - 0.08, -2.48], 'rock');
  }
  if (!filled && !caving) {
    for (const [x, z, w] of [[-4.22, -1.95, 0.69], [-3.1, 0.53, 0.45], [-4.55, 2.12, 0.39], [-1.12, -1.45, 0.55], [1.25, 1.24, 0.7], [3.53, -0.25, 0.58]]) {
      if (x + w < front) {
        plan.volume('选择性支撑矿柱', [x - w, x + w, thinFloor, thinTop, z - w, z + w * 0.71], 'pillar', 'irregular');
      }
    }
  }
  if ((filled || caving) && s < 6) {
    for (let z = thinBack + 0.42; z < 2.9; z += 0.77) {
      const x = front - 0.52;
      plan.mark('工作带支柱', [x, thinFloor, z], [x, thinTop, z], 'pillar');
    }
  }
}

function extraction(plan, y, b, { name = '阶段电耙', baseStyle = 'pillar', active = true, positions = xsDraw } = {}) {
  const railZ = b + 0.58;
  const levelXs = [...positions, passX];
  const toPass = [passX, y, passZ];
  plan.line(name + '出矿巷', [...lineX(levelXs, y, railZ), toPass]);
  room(plan, baseStyle === 'concrete' ? '堑沟式人工假底柱' : name + '底柱',
    left - 0.25, right + 0.25, y - 0.22, y + 0.95, b, 'pillar', baseStyle);
  if (active) {
    for (const x of positions) {
      plan.line(name + '漏斗及斗颈', [[x, y + 0.93, 0.8], [x, y, 0.8]], 'bell');
      plan.line(name + '装运横巷', [[x, y, 0.8], [x, y, railZ]]);
    }
  }
  return x => [[x, y + 0.93, 0.8], [x, y, 0.8], ...lineX(levelXs.filter(i => i >= x), y, railZ)];
}

function frame(plan, b, bottomY = bottom, topY = top, cap = true) {
  if (cap) room(plan, '顶柱', left - 0.54, right + 0.54, topY, topY + 0.48, b, 'pillar');
  room(plan, '两侧间柱', left - 0.58, left, bottomY, topY, b, 'pillar');
  room(plan, '两侧间柱', right, right + 0.58, bottomY, topY, b, 'pillar');
}

function fan(plan, name, x, y, b, size = 1.2) {
  for (let i = -3; i <= 3; i++) {
    plan.mark(name, [x, y, b - 0.03], [x + i * size / 3, y + size * (1.37 - Math.abs(i) * 0.12), b + 0.035]);
  }
}

function stageRoom(plan, method) {
  const s = plan.phase;
  const shrink = method === 'shrink';
  const vcr = method === 'stage';
  const subDrill = method === 'subdrill';
  const forced = method === 'forced';
  const natural = method === 'natural';
  const b = shrink ? 1.42 : method === 'stage' ? 2.1 : 2.68;
  const floor = 1.65;
  const rail = floor - 0.93;
  const drillLevel = vcr ? [top + 0.15] : forced ? [2.85, 4.16, 5.47, 6.78, 8.09] : subDrill ? [2, 4.18, 6.34] : [];
  const activeP = [-4.9, -2.45];
  const stop = s < 2 ? left : s === 2 ? cutX : s === 3 ? -2.9 : s === 4 ? 2.8 : right;
  const drillFrom = subDrill ? (s === 5 ? right - 0.08 : s >= 3 ? stop : cutX) : left;
  opening(plan);
  if (!forced && !natural) frame(plan, b, floor, top, true);

  if (s >= 1) {
    const yList = [...new Set([rail, ...drillLevel, ...(shrink || natural ? [ventY] : [])])];
    const access = ramp(plan, yList, !vcr);
    const toYard = pass(plan, [rail]);
    const fromDraw = extraction(plan, rail, b, { active: s >= 2, name: vcr ? '阶段铲运' : '阶段电耙', baseStyle: vcr ? 'concrete' : 'pillar' });
    if (shrink || natural) {
      const y = shrink ? Math.min(top - 0.27, [floor, floor, floor + 0.33, 4.73, 8.27, 8.27][s]) : 5.85;
      const low = [right + 0.31, rail, b + 0.35];
      const high = [right + 0.31, ventY, b + 0.35];
      const accessRail = [passX, rail, passZ];
      const slotPoint = [right + 0.31, y, b + 0.35];
      joinTo(plan, '天井下部联络道', accessRail, low);
      plan.line(natural ? '边界切帮及观察天井' : '人行通风天井', [low, slotPoint, high], 'shaft');
      joinTo(plan, '天井上部联络道', access(ventY), high);
      if (shrink) {
        const leftTop = upperLink(plan, left - 0.31, b + 0.35);
        const leftLedge = [left - 0.31, y, b + 0.35];
        const leftBase = [left - 0.31, rail, b + 0.35];
        joinTo(plan, '另一端天井井底联络', accessRail, leftBase);
        plan.line('另一端人行通风天井', [leftBase, leftLedge, leftTop], 'shaft');
        if (s >= 2) plan.line('另一端分层联络道', [leftLedge, [left, y, b + 0.35], [left, y, b - 0.15]]);
      }
      if (s >= 2) {
        plan.line(natural ? '切帮观察联络道' : '分层人行联络道', [slotPoint, [right, y, b + 0.35], [right, y, b - 0.15]]);
      }
      if (natural && s >= 2) {
        const otherTop = upperLink(plan, left - 0.29, b + 0.36);
        const ledge = [otherTop[0], 6.55, otherTop[2]];
        const lower = [otherTop[0], rail, otherTop[2]];
        joinTo(plan, '切帮井下部联络', accessRail, lower);
        plan.line('另一端切帮天井', [lower, ledge, otherTop], 'shaft');
        plan.line('切帮平巷', [ledge, [left, ledge[1], ledge[2]], [left, ledge[1], -b]]);
      }
    }
    if (drillLevel.length) {
      for (const [i, y] of drillLevel.entries()) {
        const start = [right + 0.06, y, b - 0.14];
        joinTo(plan, (vcr ? '上部钻机联络道' : '凿岩层联络道 ' + (i + 1)), access(y), start);
        plan.line(vcr ? '顶部凿岩硐室' : '凿岩巷／硐室 ' + (i + 1), [start, [drillFrom, y, b - 0.14]]);
      }
    }
    if (s >= 2 && subDrill && s <= 3) {
      const point = [drillFrom, drillLevel[0], b - 0.14];
      plan.line('切割天井', [point, [point[0], top, point[2]]], 'shaft');
    }
    if (s >= 3 && !(subDrill && s === 5) && !(forced && s === 3)) {
      const list = natural ? (s >= 4 ? [-2.45, 0, 2.45] : [0]) : (forced || subDrill ? activeP : xsDraw);
      for (const x of list) plan.flow('底部漏斗 → 阶段运输 → 主井', [...fromDraw(x), ...toYard(rail)]);
    }
  }

  if (natural) return naturalFront(plan, b, floor);
  if (shrink) {
    const face = [floor, floor, 2.26, 5.25, top, top][s];
    room(plan, '未采矿体', left, right, face, top, b, 'ore');
    if (s === 2) room(plan, '水平拉底空间', left, right, floor, face, b, 'void');
    if (s >= 3) {
      room(plan, '空场与凿岩空间', left, right, floor, face, b, 'void');
      const pile = [0, 0, 0, 4.47, 7.54, 2.04][s];
      room(plan, s === 5 ? '最终放矿残余矿堆' : '留矿作业平台', left, right, floor, pile, b, 'broken', 'rubble');
    }
    return;
  }
  if (vcr) {
    const face = [floor, floor, 2.54, 5.84, top][s];
    room(plan, '原生矿体', left, right, face, top, b, 'ore');
    if (s >= 2) room(plan, s === 2 ? '拉底补偿空间' : '阶段全高矿房', left, right, floor, face, b, 'void');
    if (s === 3) {
      room(plan, '暂存松散矿石', left, right, floor, 3.45, b, 'broken', 'rubble');
      for (let x = -5.24; x < right; x += 0.86) {
        plan.mark('顶部下向平行深孔', [x, top + 0.12, b - 0.14], [x, face, b - 0.14]);
      }
    }
    if (s === 4) room(plan, '底部装运余矿', left, right, floor, floor + 0.4, b, 'broken', 'rubble');
    return;
  }
  if (forced) {
    const boundary = 0.28;
    room(plan, '相邻待采矿块', boundary, right, floor, top, b, 'ore');
    room(plan, '待强制崩落矿块', left, boundary, [floor, floor, 3.1, top, top][s], top, b, 'ore');
    if (s === 2) {
      room(plan, '下部补偿空间', left, boundary, floor, 3.1, b, 'void');
      for (const y of drillLevel.filter(y => y > 3.1)) {
        plan.mark('侧向水平深孔', [left, y, b - 0.14], [boundary - 0.16, y, b - 0.14]);
      }
    }
    if (s >= 3) {
      const boundaryY = s === 3 ? 7.98 : 5.35;
      room(plan, '全阶段崩落矿堆', left, boundary, floor, boundaryY, b, 'broken', 'rubble');
      room(plan, '覆盖岩随放矿下降', left, boundary, boundaryY, top + 0.37, b, 'waste', 'rubble');
    }
    room(plan, '上覆围岩', left, right, top + 0.36, top + 0.85, b, 'rock', 'rockLight');
    return;
  }

  const edges = s === 3 ? [stop + 0.34, stop, stop - 0.36] : [stop, stop, stop];
  const levels = [floor, 4.14, 6.28, top];
  for (let i = 0; i < edges.length; i++) {
    room(plan, '待采矿体', edges[i], right, levels[i], levels[i + 1], b, 'ore');
    room(plan, s === 2 ? '侧向切割槽' : '贯通的阶段矿房', left, edges[i], levels[i], levels[i + 1], b, 'void');
  }
  if (s >= 3 && s < 5) {
    room(plan, '落矿汇至同一底部', left, stop - 0.25, floor, s === 3 ? 2.95 : 2.12, b, 'broken', 'rubble');
    for (const y of drillLevel) fan(plan, '分段上向扇形孔', Math.min(stop + 0.75, right - 1), y, b);
  }
}

function naturalFront(plan, b, floor) {
  const s = plan.phase;
  const reach = [0, 0, 3.4, 3.25, 4.65, 5.85][s];
  const rise = [0, 0, 0.63, 2.94, 5.38, 7.83][s];
  const bottomCut = [0, 0, 3.4, 3.4, 4.75, 5.85][s];
  const n = 25;
  for (let i = 0; i < n; i++) {
    const a = left + (right - left) * i / n;
    const x1 = left + (right - left) * (i + 1) / n;
    const x = (a + x1) / 2;
    const canopy = Math.abs(x) < reach ? rise * Math.sqrt(1 - (x / reach) ** 2) : 0;
    const cut = Math.abs(x) < bottomCut ? 0.61 : 0;
    const lower = Math.min(top, floor + Math.max(canopy, cut));
    room(plan, null, a, x1, lower, top, b, 'ore', 'plainOre');
    if (s === 2) room(plan, null, a, x1, floor, lower, b, 'void', 'thinVoid');
    if (s >= 3) {
      const split = s === 5 ? Math.min(6.52, lower - 0.22) : lower - 0.19;
      room(plan, null, a, x1, floor, split, b, 'broken', 'rubble');
      if (s === 5) room(plan, null, a, x1, Math.max(floor, split), lower, b, 'waste', 'rubble');
      plan.mark(null, [a, lower, b + 0.03], [x1, lower, b + 0.03]);
    }
  }
  plan.label('上覆围岩', [1.6, top + 0.57, b], 'rock');
  if (s < 5) room(plan, null, left, right, top + 0.04, top + 0.82, b, 'rock', 'rockLight');
  else {
    room(plan, null, left, -2.8, top + 0.04, top + 0.82, b, 'rock', 'rockLight');
    room(plan, null, 2.8, right, top + 0.04, top + 0.82, b, 'rock', 'rockLight');
    room(plan, '崩落带贯入覆岩', -2.8, 2.8, top - 0.04, top + 0.77, b, 'waste', 'rubble');
  }
  if (s < 5) plan.label('未崩矿体', [3.8, 7.6, b], 'ore');
  if (s === 2) plan.label('拉底自由面', [0.5, floor + 0.5, b + 0.02], 'void');
  if (s >= 3) plan.label('自然崩落前缘', [0, Math.min(top, floor + rise), b + 0.04], 'work');
}

function levelsWithRooms(plan, method) {
  const s = plan.phase;
  const subroom = method === 'subroom';
  const b = subroom ? 2.4 : 2.58;
  const y0 = [1.52, 5.24];
  const y1 = [4.84, 8.55];
  const active = subroom ? (s >= 3 && s <= 5 ? 1 : s >= 6 ? 0 : -1) : (s === 3 || s === 4 ? 0 : s === 6 || s === 7 ? 1 : -1);
  opening(plan);
  if (!subroom) frame(plan, b, y0[0], y1[1]);
  else {
    room(plan, '保留间柱', right, right + 0.58, y0[0], y1[1] + 0.43, b, 'pillar');
    if (s < 4) room(plan, '上分段待回收间柱', left - 0.58, left, y0[1], y1[1], b, 'pillar');
    if (s < 7) room(plan, '下分段待回收间柱', left - 0.58, left, y0[0], y1[0], b, 'pillar');
    if (s < 5) room(plan, '上段待回收顶柱', left, right, y1[1], y1[1] + 0.43, b, 'pillar');
  }
  if (subroom && s < 8) {
    // Stair-stepped section through the inclined crown left between the sublevel rooms.
    for (let i = 0; i < 8; i++) {
      const z = -b + 2 * b * i / 8;
      const offset = (i / 7 - 0.5) * 0.38;
      plan.volume('分段间斜顶柱', [left, right, y1[0] + offset, y0[1] + offset, z, z + 2 * b / 8], 'pillar');
    }
  }
  const drill = y0.map(y => y + 0.22);
  const reach = s >= 1 ? ramp(plan, y0) : null;
  const toYard = s >= 1 ? pass(plan, y0) : null;
  for (const [i, floor] of y0.entries()) {
    const roof = y1[i];
    const ready = subroom ? (i === 1 ? s >= 2 : s >= 6) : (i === 0 ? s >= 2 : s >= 6);
    const mined = subroom ? (i === 1 ? s >= 4 : s >= 7) : (i === 0 ? s >= 4 : s >= 7);
    const sheltered = !subroom && (i === 0 ? s >= 5 : s >= 8);
    const xEnd = mined ? right : i === active ? 0.82 : ready ? cutX : left;
    if (subroom) {
      for (let j = 0; j < 8; j++) {
        const z0 = -b + 2 * b * j / 8;
        const roll = (j / 7 - 0.5) * 0.38;
        const low = i === 1 ? floor + roll : floor;
        const high = i === 0 ? roof + roll : roof;
        plan.volume(null, [xEnd, right, low, high, z0, z0 + 2 * b / 8], 'ore', 'plainOre');
        plan.volume(null, [left, xEnd, low, high, z0, z0 + 2 * b / 8], 'void', 'thinVoid');
      }
      if (xEnd > left) plan.label('分段 ' + (i + 1) + ' 矿房空间', [(left + xEnd) / 2, floor + 1.1, b], 'void');
      if (xEnd < right) plan.label('分段 ' + (i + 1) + ' 未采矿体', [(xEnd + right) / 2, floor + 1.05, b], 'ore');
      if (i === 1 && s >= 6) room(plan, '上分段处理后的空区', left, right, floor, roof, b, 'waste', 'rubble');
      if (i === 0 && s === 8) room(plan, '斜顶柱回收后的处理区', left, right, roof - 0.25, roof + 0.52, b, 'waste', 'rubble');
    } else {
      room(plan, '分段 ' + (i + 1) + ' 未采矿体', xEnd, right, floor, roof, b, 'ore');
      room(plan, '分段 ' + (i + 1) + (sheltered ? ' 胶结充填体' : ' 切割与回采空间'), left, xEnd,
        floor, roof, b, sheltered ? 'fill' : 'void');
      if (i === 0) room(plan, '分段隔离层', left, right, roof, y0[1], b, 'pillar');
    }
    if (s === 0) continue;
    const isPillarOre = subroom && (s === 4 || s === 5 || s === 7 || s === 8) && i === active;
    const xWork = isPillarOre ? left + 0.46 : Math.max(cutX, Math.min(right - 0.1, xEnd - 0.23));
    const trunkZ = b + 0.68;
    const lowerEntry = [passX, floor, passZ];
    const trunk = [passX, floor, trunkZ];
    const tail = [right + 0.36, floor, trunkZ];
    const row = [xWork, floor, trunkZ];
    const bin = [xWork, floor, b - 0.15];
    joinTo(plan, '分段设备联络道 ' + (i + 1), reach(floor), lowerEntry);
    plan.line('分段运输平巷 ' + (i + 1), [lowerEntry, trunk, tail, row]);
    plan.line('分段装运横巷 ' + (i + 1), sheltered ? [row, [xWork, floor, b + 0.21]] : [row, bin]);
    if (sheltered) {
      plan.volume('充填挡墙 ' + (i + 1), [xWork - 0.4, xWork + 0.4, floor - 0.08, floor + 0.67, b + 0.12, b + 0.28], 'fill', 'bulkhead');
      continue;
    }
    const dr = [xWork, drill[i], b - 0.15];
    const dEnd = [right, drill[i], b - 0.15];
    const slot = [cutX, drill[i], b - 0.15];
    plan.line(subroom ? '堑沟平巷与装矿口 ' + (i + 1) : '下部装矿口 ' + (i + 1), [bin, dr, slot]);
    plan.line('分段凿岩平巷 ' + (i + 1), [dr, dEnd]);
    if (ready && !mined) {
      plan.line('分段切割天井 ' + (i + 1), [slot, [cutX, roof - 0.21, b - 0.15]], 'shaft');
      if (i !== active) room(plan, '分段切割槽 ' + (i + 1), left, cutX, floor, roof, b, 'void');
    }
    if (i === active) {
      if (!mined) fan(plan, '分段扇形凿岩', xEnd + 0.27, drill[i], b);
      const pileName = isPillarOre ? '回收矿柱矿石' : '分段落矿堆';
      plan.volume(pileName, [Math.max(left - 0.15, xWork - 1.1), xWork, floor, floor + 0.74, -b + 0.2, b], 'broken', 'rubble');
      plan.flow('本分段装运 → 矿石溜井 → 阶段运输', [bin, row, tail, trunk, ...toYard(floor)]);
    }
  }
  if (!subroom && s >= 1) {
    const i = s >= 6 ? 1 : 0;
    const supplyY = y1[i] + 0.16;
    fillPipe(plan, {
      name: '上部凿岩巷兼充填联络',
      high: supplyY, collar: [left - 0.91, 0, -b - 0.42],
      branch: [[left + 1.7, supplyY, -b - 0.42], [left + 1.7, supplyY, -1.15]],
      nozzle: [left + 1.7, y1[i] - 0.48, -1.15], active: s === 5 || s === 8, bore: true,
    });
  }
}

function layeredFill(plan, method) {
  const s = plan.phase;
  const down = method === 'underhand';
  const b = down ? 2.24 : 1.85;
  const y = [1.78, 4.03, 6.28, 8.53];
  const order = down ? [2, 1, 0] : [0, 1, 2];
  const active = [0, 0, 0, 0, 0, 1, 1, 2, 2][s];
  const filling = s >= 4 && s % 2 === 0;
  const filled = [0, 0, 0, 0, 1, 1, 2, 2, 3][s];
  const open = s >= 2 && !filling;
  const fillX = -4.4;
  opening(plan);
  if (!down) frame(plan, b, y[0], y[3]);
  else {
    plan.volume('上盘围岩', [left, right, y[3], y[3] + 0.42, -b, b], 'rock', 'rockLight');
  }
  if (s >= 1) {
    const doors = y.slice(0, 3).map(h => h + 0.12);
    const approach = ramp(plan, doors, !down);
    plan.line('井底装运联络道至提升车场', [passBase, haulJoin]);
    const passPositions = down ? [0.45] : [0.45, 3.63];
    const passZInside = 0.55;
    const highest = doors[order[active]];
    const internalRoutes = passPositions.map((x, index) => {
      const drop = [x, baseY, passZInside];
      // The downhand ore pass loses its upper segments as extraction descends.
      const mouths = doors.filter(h => h <= highest).map(h => [x, h, passZInside]);
      const internal = orePass(plan, down ? '分层中央溜矿井' : '顺路放矿溜井 ' + (index + 1), mouths, drop);
      const bottomLink = [x, baseY, 3.65];
      plan.line('井底装矿道 ' + (index + 1), [drop, bottomLink, passBase]);
      return y => [...internal([x, y, passZInside]), bottomLink, ...plan.transport];
    });
    for (let i = 0; i < doors.length; i++) {
      const floor = doors[i];
      const junction = [passX, floor, passZ];
      joinTo(plan, '分层联络道 ' + (i + 1), approach(floor), junction);
      const spout = [right - 0.4, floor, down ? 0.04 : b - 0.13];
      const outlet = [spout[0], floor, b + 0.55];
      const link = [passX, floor, outlet[2]];
      plan.line('分层运输巷 ' + (i + 1), [junction, link, outlet]);
      if (open && i === order[active]) {
        const face = [s === 2 ? left + 0.44 : -1.3, floor, spout[2]];
        const x = passPositions[0];
        const turn = [x, floor, face[2]];
        const mouth = [x, floor, passZInside];
        const drift = s === 2 ? [outlet, spout, face] : [outlet, spout, turn, face];
        plan.line(s === 2 ? (down ? '上层切割平巷' : '拉底巷道') : '分层出矿作业通道', drift);
        if (s > 2) {
          plan.line(down ? '分区至中央溜矿井' : '作业面至顺路溜井', [turn, mouth]);
          plan.flow(down ? '分区工作面 → 中央溜井 → 阶段运输' : '当前作业面 → 顺路溜井 → 阶段运输',
            [face, turn, ...internalRoutes[0](floor)]);
        }
      }
      if (order.indexOf(i) < filled) {
        plan.volume((down ? '分层脱水砂门 ' : '充填隔墙 ') + (i + 1),
          [spout[0] - 0.31, spout[0] + 0.32, floor - 0.1, floor + 0.57, b + 0.09, b + 0.28], 'fill', 'bulkhead');
        if (down) plan.fitting('砂门泄水孔', [spout[0], floor + 0.18, b + 0.28], 'drain', 'fill');
      }
    }
    const roof = y[order[active] + 1];
    const headerY = down ? roof - 0.57 : ventY - 0.56;
    const farEnd = down ? 2.3 : fillX;
    fillPipe(plan, {
      name: down ? '分层切割巷近顶充填支管' : '上阶段充填巷与充填天井',
      high: headerY, collar: [left - 0.91, 0, down ? 0.04 : -0.66],
      branch: down ? [[left + 0.04, headerY, 0.04], [farEnd - 1.2, headerY, 0.04], [farEnd, headerY, 0.04]] : [[farEnd, headerY, -0.66]],
      nozzle: [farEnd, roof - (down ? 0.26 : 0.30), down ? 0.04 : -0.66],
      active: filling, endRise: down ? 1.2 * Math.tan(Math.PI / 36) : 0,
    });
    const topHook = upperLink(plan, left - 0.25, b + 0.34);
    const base = [left - 0.25, doors[0], b + 0.34];
    const activeDoor = [left - 0.25, doors[order[active]], b + 0.34];
    plan.line(down ? '回风人行天井' : '顺路人行滤水井', [base, activeDoor, topHook], 'shaft');
    if (open) plan.line('采场人行联络口', [activeDoor, [left - 0.25, activeDoor[1], b - 0.1], [left + 0.42, activeDoor[1], b - 0.1]]);
    if (!down && filling) plan.fitting('滤水井泄水出口', base, 'drain', 'fill');
  }
  for (const [step, i] of order.entries()) {
    const floor = y[i];
    const roof = y[i + 1];
    if (step < filled) {
      const wearing = !down && step < order.length - 1;
      room(plan, '第 ' + (step + 1) + ' 轮充填体', left, right, floor + (down ? 0.16 : 0),
        roof - (wearing ? 0.11 : 0), b, 'fill');
      if (down) room(plan, '钢筋混凝土人工假顶 ' + (step + 1), left, right, floor, floor + 0.16, b, 'fill', 'concrete');
      if (wearing) room(plan, '充填体上的作业底板 ' + (step + 1), left, right, roof - 0.11, roof, b, 'fill', 'concrete');
    } else if (step === active && open) {
      const cut = s === 2 ? floor + 0.63 : roof;
      if (!down || s === 2) room(plan, s === 2 ? '首层切割空间' : '当前分层作业空间', left, right, floor, cut, b, 'void');
      room(plan, '未采矿体', left, right, cut, roof, b, 'ore');
      if (down && s > 2) {
        for (let j = 0; j < 6; j++) {
          const z0 = -b + (2 * b / 6) * j;
          const z1 = -b + (2 * b / 6) * (j + 1);
          const x0 = 2.2 + 0.52 * Math.abs(j - 2.5);
          plan.volume('分区壁式回采前缘', [x0, right, floor, roof, z0, z1], 'ore', 'plainOre');
          plan.volume('已采分区空间', [left, x0, floor, roof, z0, z1], 'void', 'thinVoid');
        }
      }
      if (s > 2) {
        plan.volume('待装运矿堆', [-3.37, -0.58, floor, floor + 0.75, -0.56, b - 0.05], 'broken', 'rubble');
        plan.mark(down ? '下向分层作业面' : '上向分层作业面', [-4.4, down ? floor : roof, b + 0.05], [4.4, down ? floor : roof, b + 0.05]);
      }
    } else {
      room(plan, '未采矿体', left, right, floor, roof, b, 'ore');
    }
  }
}

function cavingLevels(plan, bottoms) {
  const s = plan.phase;
  const b = 3.04;
  const levels = bottoms ? [1.74, 5.52] : [1.48, 5.15];
  opening(plan);
  const rails = levels.map(y => bottoms ? y - 0.93 : y);
  const toYard = s >= 1 ? pass(plan, rails) : null;
  const access = s >= 1 ? ramp(plan, rails, bottoms) : null;
  for (const [i, y] of levels.entries()) {
    const rail = rails[i];
    const roof = i === 0 ? levels[1] - (bottoms ? 1.15 : 0) : top;
    const production = s >= 3 && (i === 1 || s >= (bottoms ? 6 : 4));
    const ready = s >= 2 && (i === 1 || s >= (bottoms ? 5 : 3));
    const upper = i === 1;
    const junction = [passX, rail, passZ];
    if (s >= 1) joinTo(plan, '分段人行设备联络道 ' + (i + 1), access(rail), junction);
    if (bottoms) {
      const face = !ready ? left : !production ? cutX : upper ? (s === 3 ? -1.9 : s === 4 ? 0.55 : right) : -0.76;
      room(plan, '分段未落矿体', face, right, y, roof, b, 'ore');
      if (s >= 1) {
        const fromDraw = extraction(plan, rail, b, { name: '分段 ' + (i + 1) + ' 电耙', active: ready });
        const cut = [Math.max(cutX, face - 0.18), y + 0.16, b - 0.12];
        const head = [passX, y + 0.16, b - 0.12];
        joinTo(plan, '凿岩巷入口 ' + (i + 1), access(rail), head);
        plan.line('独立凿岩巷 ' + (i + 1), [head, cut]);
        if (ready && !production) {
          plan.line('切割井与堑沟联络 ' + (i + 1), [cut, [cut[0], roof, cut[2]]], 'shaft');
        }
        if (production) {
          const interfaceY = roof - (s >= 4 ? 0.97 : 0.3);
          room(plan, '分段崩落矿石', left, face, y, interfaceY, b, 'broken', 'rubble');
          room(plan, '侵入的覆盖岩', left, face, interfaceY, roof, b, 'waste', 'rubble');
          if (face < right) fan(plan, '分段凿岩方向', Math.min(face + 0.8, right - 0.95), y + 0.16, b, 1.05);
          for (const x of xsDraw.filter(x => x < face - 0.15).slice(-2)) {
            plan.flow('堑沟 → 漏斗 → 电耙巷 → 溜井', [...fromDraw(x), ...toYard(rail)]);
          }
        } else if (ready) room(plan, '堑沟及小补偿空间', left, face, y, roof, b, 'void');
      } else room(plan, '分段底柱', left, right, y - 0.95, y, b, 'pillar');
      continue;
    }

    const lanes = upper ? [-4.7, -2.3, 0.1, 2.5, 4.9] : [-3.55, -1.15, 1.25, 3.65];
    const front = !ready ? -b : !production ? -b + 0.48 : upper ? [-b,-b,-b,-1.25,0.02,1.63][s] : (s === 4 ? -1.5 : -0.24);
    plan.volume('原生矿体', [left, right, y, roof, front, b], 'ore');
    if (production) {
      plan.volume('端部后方崩落围岩', [left, right, y, roof, -b, front - 0.19], 'waste', 'rubble');
      plan.volume('端部松散矿堆', [left, right, y, y + 1.05, front - 0.51, front], 'broken', 'rubble');
    } else if (ready) {
      plan.volume('初始切割槽', [left, right, y, roof, -b, front], 'void');
    }
    if (s < 1) continue;
    const laneZ = b + 0.6;
    plan.line('分段运输平巷 ' + (i + 1), [...lineX([...lanes, passX], y, laneZ), junction]);
    for (const [j, x] of lanes.entries()) {
      const face = [x, y, front];
      const entry = [x, y, laneZ];
      plan.line('分段 ' + (i + 1) + ' 回采进路 ' + (j + 1), [face, entry]);
      if (production) {
        for (const d of [-0.75, 0, 0.75]) {
          plan.mark('端部上向扇形排孔', [x, y + 0.25, front], [x + d, y + 2.08 - 0.5 * Math.abs(d), front + 0.12]);
        }
        if (j === 1 || j === lanes.length - 1) {
          plan.flow('端部装矿 → 同一回采进路 → 分段运输', [face, ...lineX([...lanes.slice(j), passX], y, laneZ), ...toYard(y)]);
        }
      }
    }
    if (ready && !production) {
      plan.line('初始切割平巷', lineX(lanes, y, front));
      plan.line('切割天井', [[lanes[0], y, front], [lanes[0], roof, front]], 'shaft');
    }
  }
  room(plan, '上覆围岩', left, right, top, top + 0.55, b, 'rock', 'rockLight');
}

export function createPlan(method, phase) {
  const plan = new Plan(phase);
  if (['open', 'room', 'flatfill', 'longwall'].includes(method)) thin(plan, method);
  else if (['shrink', 'stage', 'subdrill', 'forced', 'natural'].includes(method)) stageRoom(plan, method);
  else if (['subroom', 'subfill'].includes(method)) levelsWithRooms(plan, method);
  else if (['overhand', 'underhand'].includes(method)) layeredFill(plan, method);
  else if (['pillared', 'pillarless'].includes(method)) cavingLevels(plan, method === 'pillared');
  else throw new Error('Unknown method ' + method);
  return plan;
}

