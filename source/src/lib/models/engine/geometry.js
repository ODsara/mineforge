// 几何生成规则（交付成果10的可执行实现）
// 核心原则：
//  - 巷道/井筒/采场 = 中空体：只生成内壁面，材质用 BackSide，从外部可见"空腔"
//  - 矿体/围岩/充填体/崩落体 = 独立实体，禁止合并
//  - 矿柱 = 由矿体与采场空区边界围合出的独立实体（本模型按参数直接生成边界）
//  - 所有尺寸单位：米；Y = 标高
import * as THREE from 'three';

export const DEG = Math.PI / 180;

/** 计算矿体中心面 z（倾角 dipDeg，+Z 为倾向方向，向上则 z 减小） */
export function dipZ(y, dipDeg, zBase = 0, yBase = 0) {
  return zBase - (y - yBase) / Math.tan(dipDeg * DEG);
}

/** 拱形断面（宽 w、高 h）：直墙 + 半椭圆拱，顺时针闭合（含底板） */
export function archSection(w, h, seg = 10) {
  const rise = Math.min(w * 0.42, h * 0.5);
  const wall = h - rise;
  const pts = [[-w / 2, 0], [-w / 2, wall]];
  for (let i = 1; i <= seg; i++) {
    const a = Math.PI - (Math.PI * i) / seg;
    pts.push([Math.cos(a) * (w / 2), wall + Math.sin(a) * rise]);
  }
  pts.push([w / 2, 0]);
  return pts;
}

/** 矩形断面（顺时针闭合） */
export function rectSection(w, h) {
  return [[-w / 2, 0], [-w / 2, h], [w / 2, h], [w / 2, 0]];
}

/**
 * 为自定义 BufferGeometry 生成盒式平面 UV（按三角面法线选择投影轴）。
 * 纹理材质（map/bumpMap）依赖 UV；自定义拉伸/扫掠几何默认没有 UV，
 * 否则所有面都采样同一纹素，看起来像纯色。
 */
export function ensurePlanarUV(geometry, scale = 0.12) {
  if (geometry.getAttribute('uv')) return geometry;
  const pos = geometry.getAttribute('position');
  if (!pos || pos.count < 3) return geometry;
  const uv = new Float32Array(pos.count * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i + 2 < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    ab.subVectors(b, a); ac.subVectors(c, a); n.crossVectors(ab, ac);
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    for (let j = 0; j < 3; j++) {
      const v = j === 0 ? a : j === 1 ? b : c;
      let u, w;
      if (az >= ax && az >= ay) { u = v.x; w = v.y; }
      else if (ax >= ay) { u = v.z; w = v.y; }
      else { u = v.x; w = v.z; }
      uv[(i + j) * 2] = u * scale;
      uv[(i + j) * 2 + 1] = w * scale;
    }
  }
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return geometry;
}


/**
 * 中空巷道：断面沿折线路径扫掠，只生成内壁（法线朝外 + BackSide 渲染）。
 * @param {Array<[number,number,number]>} path 中心线节点
 * @param {Array<[number,number]>} section 断面轮廓（顺时针、闭合、含底板）
 */
export function hollowTunnel(path, section) {
  const pts = path.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const n = pts.length;
  const rings = [];
  for (let i = 0; i < n; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(n - 1, i + 1)];
    const t = new THREE.Vector3().subVectors(next, prev);
    if (t.lengthSq() < 1e-9) t.set(0, 0, 1);
    t.normalize();
    let up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(t.dot(up)) > 0.94) up.set(0, 0, 1);
    const lat = new THREE.Vector3().crossVectors(up, t).normalize();
    const vdir = new THREE.Vector3().crossVectors(t, lat).normalize();
    rings.push({ c: pts[i], lat, vdir });
  }

  const pos = [];
  const normals = [];
  const uv = [];
  const textureScale = 0.12;
  const sectionDistance = [0];
  const pathDistance = [0];

  for (let i = 1; i < n; i++) {
    pathDistance.push(pathDistance[i - 1] + pts[i].distanceTo(pts[i - 1]));
  }
  const edges = section.map(([u, v], j) => {
    const [nextU, nextV] = section[(j + 1) % section.length];
    const du = nextU - u;
    const dv = nextV - v;
    const length = Math.hypot(du, dv);
    sectionDistance.push(sectionDistance[j] + length);
    return [-dv / length, du / length];
  });
  const wallNormal = (ring, [u, v]) => ring.lat.clone().multiplyScalar(u).addScaledVector(ring.vdir, v);
  const sectionPoint = (ring, [u, v]) => ring.c.clone().addScaledVector(ring.lat, u).addScaledVector(ring.vdir, v);
  const push = (point, normal, i, j) => {
    pos.push(point.x, point.y, point.z);
    normals.push(normal.x, normal.y, normal.z);
    uv.push(pathDistance[i] * textureScale, sectionDistance[j] * textureScale);
  };

  for (let i = 0; i < n - 1; i++) {
    const r0 = rings[i];
    const r1 = rings[i + 1];
    for (let j = 0; j < section.length; j++) {
      const p0 = section[j];
      const p1 = section[(j + 1) % section.length];
      const a = sectionPoint(r0, p0);
      const b = sectionPoint(r0, p1);
      const c = sectionPoint(r1, p1);
      const d = sectionPoint(r1, p0);
      const n0 = wallNormal(r0, edges[j]);
      const n1 = wallNormal(r1, edges[j]);

      // 外向绕序与法线一致，BackSide 可见的是巷道内侧。
      push(a, n0, i, j); push(c, n1, i + 1, j + 1); push(b, n0, i, j + 1);
      push(a, n0, i, j); push(d, n1, i + 1, j); push(c, n1, i + 1, j + 1);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeBoundingSphere();
  return g;
}

/** 中空矩形/多边形断面沿 Z 或 X 轴直巷（hollowTunnel 的便捷封装） */
export function straightTunnel(a, b, section) {
  return hollowTunnel([a, b], section);
}

/** 中空井筒（圆） */
export function shaftCylinder(x, z, y0, y1, r, seg = 20) {
  const h = y1 - y0;
  const g = new THREE.CylinderGeometry(r, r, h, seg, 1, true);
  g.translate(x, y0 + h / 2, z);
  return g;
}

/** 任意两点间的圆管（用于随倾角的天井） */
export function cylinderBetween(p0, p1, r, seg = 18) {
  const a = new THREE.Vector3(p0[0], p0[1], p0[2]);
  const b = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r, r, len, seg, 1, true);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  g.applyQuaternion(q);
  g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
  return g;
}

/** 任意两点间的开口矩形通道，断面中心通过两端节点。 */
export function boxBetween(p0, p1, w, h) {
  const section = rectSection(w, h).map(([u, v]) => [u, v - h / 2]);
  return hollowTunnel([p0, p1], section);
}

/** 矩形井筒：保留四壁，上下端与相邻工程贯通。 */
export function shaftBox(x0, x1, z0, z1, y0, y1) {
  const x = (x0 + x1) / 2;
  const z = (z0 + z1) / 2;
  return boxBetween([x, y0, z], [x, y1, z], x1 - x0, z1 - z0);
}

/** 空腔喇叭漏斗（上大下小，开口圆台，BackSide 显示内壁） */
export function funnelCavity(cx, cz, yBottom, yTop, rBottom, rTop, seg = 18) {
  const h = yTop - yBottom;
  const g = new THREE.CylinderGeometry(rTop, rBottom, h, seg, 1, true);
  g.translate(cx, yBottom + h / 2, cz);
  return g;
}

/** 水平圆环（漏斗口/喉口强调环）：位于标高 y、以 (cx, cz) 为圆心 */
export function horizontalRing(cx, cz, y, radius, tube = 0.12, radialSeg = 8, tubularSeg = 40) {
  const g = new THREE.TorusGeometry(radius, tube, radialSeg, tubularSeg);
  g.rotateX(Math.PI / 2);
  g.translate(cx, y, cz);
  return g;
}

/** 平面轮廓沿 X/Z 轴拉伸，端盖支持凹轮廓。 */
function polygonPrism(poly, start, end, axis, caps) {
  const contour = poly.map(([u, v]) => new THREE.Vector2(u, v));
  if (contour[0].equals(contour.at(-1))) contour.pop();
  if (THREE.ShapeUtils.isClockWise(contour)) contour.reverse();

  const pos = [];
  const push = axis === 'x'
    ? (q, p) => pos.push(q, p.y, p.x)
    : (q, p) => pos.push(p.x, p.y, q);
  for (let i = 0; i < contour.length; i++) {
    const a = contour[i];
    const b = contour[(i + 1) % contour.length];
    if (axis === 'x') {
      push(start, a); push(end, a); push(end, b);
      push(start, a); push(end, b); push(start, b);
    } else {
      push(start, a); push(start, b); push(end, b);
      push(start, a); push(end, b); push(end, a);
    }
  }

  if (caps) {
    for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(contour, [])) {
      const a = contour[i];
      const b = contour[axis === 'x' ? j : k];
      const c = contour[axis === 'x' ? k : j];
      push(start, a); push(start, b); push(start, c);
      push(end, a); push(end, c); push(end, b);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return ensurePlanarUV(g);
}

/** 多边形沿 X 轴拉伸成实体，poly = [[z,y], ...]。 */
export function prismAlongX(poly, x0, x1) {
  return polygonPrism(poly, x0, x1, 'x', true);
}

/**
 * 缓倾斜/近水平薄矿体：沿 X 拉伸的板状体，顶面在 Z 方向按倾角下降。
 * poly 由 (z,y) 四点组成；yTop 为 zBase 处顶面标高，thickness 为垂直厚度。
 */
export function gentlyDippingSlab({ x0, x1, z0, z1, yTop, thickness, dip, zBase = 0 }) {
  const t = Math.tan(dip * DEG);
  const top0 = yTop - (z0 - zBase) * t;
  const top1 = yTop - (z1 - zBase) * t;
  const poly = [
    [z0, top0 - thickness],
    [z1, top1 - thickness],
    [z1, top1],
    [z0, top0],
  ];
  return prismAlongX(poly, x0, x1);
}

/** 多边形沿 X 轴拉伸成开口壳，仅保留侧壁。 */
export function prismAlongXOpen(poly, x0, x1) {
  return polygonPrism(poly, x0, x1, 'x', false);
}

/** 多边形沿 Z 轴拉伸成实体，poly = [[x,y], ...]。 */
export function prismAlongZ(poly, z0, z1) {
  return polygonPrism(poly, z0, z1, 'z', true);
}

/**
 * 倾斜矿体（沿走向 X 的板状体）
 * 中心面：z = zBase - (y-yBase)/tan(dip)
 */
export function oreBody({ x0, x1, y0, y1, dip, thickness, zBase = 0, yBase = 0, inflate = 0 }) {
  const t = thickness + inflate * 2;
  const z0 = dipZ(y0, dip, zBase, yBase);
  const z1 = dipZ(y1, dip, zBase, yBase);
  const poly = [
    [z0 - t / 2, y0],
    [z0 + t / 2, y0],
    [z1 + t / 2, y1],
    [z1 - t / 2, y1],
  ];
  return prismAlongX(poly, x0, x1);
}

/** 采场后壁（下盘侧暗色背景面，用于"已回采空间"而不遮挡矿体/矿堆） */
export function stopeBackWall({ x0, x1, y0, y1, dip, thickness, zOffset = 0.06 }) {
  const z0 = dipZ(y0, dip) - thickness / 2 - zOffset;
  const z1 = dipZ(y1, dip) - thickness / 2 - zOffset;
  const pos = [
    x0, y0, z0, x1, y0, z0, x1, y1, z1,
    x0, y0, z0, x1, y1, z1, x0, y1, z1,
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return ensurePlanarUV(g);
}

/** 沿矿体倾角的开口分层壳（无走向端盖，用于采空区/拉底） */
export function dippingSlabOpen({ x0, x1, y0, y1, dip, thickness, zBase = 0, yBase = 0, inset = 0 }) {
  const t = thickness - inset * 2;
  const z0 = dipZ(y0, dip, zBase, yBase);
  const z1 = dipZ(y1, dip, zBase, yBase);
  const poly = [
    [z0 - t / 2, y0], [z0 + t / 2, y0], [z1 + t / 2, y1], [z1 - t / 2, y1],
  ];
  return prismAlongXOpen(poly, x0, x1);
}

/** 沿矿体倾角的分层板（充填体/留矿堆/崩落层） */
export function dippingSlab({ x0, x1, y0, y1, dip, thickness, zBase = 0, yBase = 0, inset = 0 }) {
  return oreBody({ x0, x1, y0, y1, dip, thickness: thickness - inset * 2, zBase, yBase });
}

/** 从矿体中切出的矿柱：给定 x 区间与 z 相对中心面的偏移区间 */
export function pillarBlock({ x0, x1, y0, y1, dip, zCenterRel = 0, halfThick, zBase = 0, yBase = 0, margin = 0.06 }) {
  const t = halfThick * 2 + margin * 2;
  const z0 = dipZ(y0, dip, zBase, yBase) + zCenterRel;
  const z1 = dipZ(y1, dip, zBase, yBase) + zCenterRel;
  const poly = [
    [z0 - t / 2, y0], [z0 + t / 2, y0], [z1 + t / 2, y1], [z1 - t / 2, y1],
  ];
  return prismAlongX(poly, x0 - margin, x1 + margin);
}

/** 三角棱柱（残留体楔形）：poly 在 X-Y 平面，沿 Z 拉伸 */
export function wedgeAlongZ(polyXY, z0, z1) {
  return prismAlongZ(polyXY, z0, z1);
}

/** 世界坐标包围盒 */
export function boundsOf(objects) {
  const box = new THREE.Box3();
  let has = false;
  for (const o of objects) {
    if (!o) continue;
    const b = new THREE.Box3().setFromObject(o);
    if (!b.isEmpty()) { box.union(b); has = true; }
  }
  if (!has) box.set(new THREE.Vector3(-1, 0, -1), new THREE.Vector3(1, 1, 1));
  return box;
}

/** 虚线轮廓 */
export function dashedOutline(geometry, color = 0xffffff, opacity = 0.55, dash = 2.2, gap = 1.4) {
  const edges = new THREE.EdgesGeometry(geometry, 18);
  const mat = new THREE.LineDashedMaterial({
    color, transparent: true, opacity, dashSize: dash, gapSize: gap, depthWrite: false,
  });
  const line = new THREE.LineSegments(edges, mat);
  line.computeLineDistances();
  line.renderOrder = 5;
  return line;
}

/** 实线轮廓 */
export function solidOutline(geometry, color = 0xffffff, opacity = 0.35) {
  const edges = new THREE.EdgesGeometry(geometry, 18);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const line = new THREE.LineSegments(edges, mat);
  line.renderOrder = 5;
  return line;
}

/** 折线管路（炮孔/充填管/水流） */
export function polyline(points, color = 0xffc46b, opacity = 0.85, width = 1) {
  const g = new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, linewidth: width });
  return new THREE.Line(g, mat);
}

/**
 * 扇形炮孔组：在 X-Y 平面自基点扇形展开，沿 Z 多排。
 * down=true 时自基点向下扇形（阶段强制崩落的上部深孔）。
 */
export function fanHoles({ baseX, baseY, baseZ, radius, count, spreadDeg, rows, rowStep, tilt = 0, down = false }) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: 0xffb03a, transparent: true, opacity: 0.75 });
  const dir = down ? -1 : 1;
  for (let r = 0; r < rows; r++) {
    const z = baseZ + r * rowStep;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const a = (-spreadDeg / 2 + (spreadDeg * i) / (count - 1)) * DEG + tilt;
      pts.push(new THREE.Vector3(baseX, baseY, z));
      pts.push(new THREE.Vector3(
        baseX + Math.sin(a) * radius,
        baseY + dir * Math.cos(a) * radius,
        z,
      ));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.LineSegments(g, mat));
  }
  return group;
}
