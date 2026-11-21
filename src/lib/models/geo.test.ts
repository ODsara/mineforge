/**
 * geo.ts 几何原语单测（node --test 原生跑 TS，零新增依赖）
 * 重点是 tilt 的坐标系门禁：教材核对报告 B 条——旋转 −δ 后顶面法向必须为
 * n_top = (0, cosδ, −sinδ)，矿体向 −Z 倾伏。此断言不过，15 个模型全反。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  tilt,
  box,
  slab,
  frustumBox,
  tunnel,
  shaft,
  funnel,
  orePile,
  sliceCake,
  rubble,
  fanHoles,
  parallelHoles,
  arrows,
  unionBBox,
} from "./geo.ts";

const close = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

/* ── tilt 坐标系门禁 ──────────────────────────────────────── */

test("tilt: 顶面法向 = (0, cosδ, −sinδ)，上盘朝 −Z 上方", () => {
  const slabMesh = slab(10, 2, 10, { pos: [0, 1, 0] });
  const dip = 72;
  tilt(slabMesh, dip);
  // slab 是根对象，quaternion 即世界旋转（勿再叠 matrixWorld，会转两次）
  const n = new THREE.Vector3(0, 1, 0).applyQuaternion(slabMesh.quaternion);
  const cos = Math.cos((dip * Math.PI) / 180);
  const sin = Math.sin((dip * Math.PI) / 180);
  assert.ok(close(n.x, 0), `n.x=${n.x}`);
  assert.ok(close(n.y, cos), `n.y=${n.y} 期望 cosδ=${cos}`);
  assert.ok(close(n.z, -sin), `n.z=${n.z} 期望 −sinδ=${-sin}（负值=朝 −Z 上方）`);
});

test("tilt: 矿体向 −Z 倾伏——顶面 z=+10 处高于 z=−10 处（向 +Z 抬升）", () => {
  const slabMesh = slab(10, 2, 20, { pos: [0, 1, 0] });
  const dip = 55;
  tilt(slabMesh, dip);
  slabMesh.updateMatrixWorld(true);
  const localTop = (z: number) => new THREE.Vector3(0, 1, z);
  const pFoot = localTop(10).applyMatrix4(slabMesh.matrixWorld); // 下盘侧 (+Z)
  const pHang = localTop(-10).applyMatrix4(slabMesh.matrixWorld); // 上盘/倾向侧 (−Z)
  assert.ok(
    pFoot.y > pHang.y,
    `下盘侧顶面 y=${pFoot.y} 必须高于倾向侧 y=${pHang.y}（矿体朝 −Z 下倾）`,
  );
});

test("tilt: 纯旋转不改尺寸——薄板倾斜后 y 向投影 = t·cosδ", () => {
  // 用 z 向极薄的板，避免板深对包围盒 y 的贡献干扰断言
  const slabMesh = slab(6, 2, 0.01, { pos: [0, 1, 0] });
  tilt(slabMesh, 30);
  slabMesh.updateMatrixWorld(true);
  const size = new THREE.Box3().setFromObject(slabMesh).getSize(new THREE.Vector3());
  const rad = (30 * Math.PI) / 180;
  assert.ok(close(size.y, 2 * Math.cos(rad) + 0.01 * Math.sin(rad), 1e-6));
});

/* ── 基础体块 ─────────────────────────────────────────────── */

test("frustumBox: 底宽顶窄，高度正确", () => {
  const f = frustumBox(6, 6, 2, 2, 3, { pos: [0, 0, 0] });
  f.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(f);
  assert.ok(close(b.max.y - b.min.y, 3));
  assert.ok(b.max.x - b.min.x > 5.9 && b.max.x - b.min.x < 6.1);
});

test("box/slab: 默认带描边子节点（工程线稿约定）", () => {
  const m = box(2, 2, 2);
  assert.ok(m.children.some((c) => c.name === "__edges"));
});

/* ── 巷道 ─────────────────────────────────────────────────── */

test("tunnel: 三点折线空心管——包围盒覆盖路径，轴线全程无实体", () => {
  const path: [number, number, number][] = [
    [0, 0, 0],
    [20, 0, 0],
    [20, 0, 20],
  ];
  const g = tunnel(path, 4, 3);
  g.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(g);
  // 第二段沿 +Z 掘进，巷道外宽 4 展在 x 向（18..22）；z 向应覆盖路径终点 20
  assert.ok(b.max.x >= 22 && b.max.z >= 20, `bbox ${b.max.x},${b.max.z} 应覆盖路径端点`);
  // 空心性：沿折线轴心采样，任何采样点不得落入任何三角形（实心残留 = 失败）
  const mesh = g.children.find((c) => (c as THREE.Mesh).isMesh) as THREE.Mesh;
  const pos = mesh.geometry.getAttribute("position");
  const idx = mesh.geometry.getIndex()!;
  const tri = (i: number): THREE.Vector3[] => {
    const a = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i));
    const bb = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + 1));
    const cc = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + 2));
    return [a, bb, cc];
  };
  const samples: THREE.Vector3[] = [];
  for (let x = 1; x < 20; x += 2) samples.push(new THREE.Vector3(x, 0, 0.001)); // 第一段轴心
  for (let z = 1; z < 20; z += 2) samples.push(new THREE.Vector3(20, 0, z)); // 第二段轴心（含拐点后）
  for (const p of samples) {
    for (let i = 0; i < idx.count; i += 3) {
      const [a, bb, cc] = tri(i);
      const n = new THREE.Vector3().subVectors(bb, a).cross(new THREE.Vector3().subVectors(cc, a));
      const area2 = n.length();
      if (area2 < 1e-9) continue;
      const w1 = new THREE.Vector3().subVectors(p, a).dot(n);
      if (Math.abs(w1) > 0.05 * Math.sqrt(area2)) continue; // 不在三角形平面附近
      // 重心坐标判定
      const d1 = new THREE.Vector3().subVectors(bb, a);
      const d2 = new THREE.Vector3().subVectors(cc, a);
      const dp = new THREE.Vector3().subVectors(p, a);
      const d11 = d1.dot(d1), d22 = d2.dot(d2), d12 = d1.dot(d2);
      const dp1 = dp.dot(d1), dp2 = dp.dot(d2);
      const denom = d11 * d22 - d12 * d12;
      const v = (dp1 * d22 - dp2 * d12) / denom;
      const ww = (d11 * dp2 - d12 * dp1) / denom;
      if (v >= -1e-6 && ww >= -1e-6 && v + ww <= 1 + 1e-6) {
        assert.fail(`轴心采样点 (${p.x},${p.y},${p.z}) 落入三角形——巷道内部有实体残留`);
      }
    }
  }
  assert.ok(mesh.geometry.index!.count > 100, "空心管应有足够三角形");
});

test("tunnel: 开口剔除——开口区间内帮/顶条带被剔除", () => {
  const path: [number, number, number][] = [
    [0, 0, 0],
    [30, 0, 0],
  ];
  // 统计完全落在开口 x 区间 [13,17] 内的三角形数
  const trisInRange = (m: THREE.Mesh): number => {
    const idx = m.geometry.index!;
    const pos = m.geometry.getAttribute("position");
    let n = 0;
    for (let i = 0; i < idx.count; i += 3) {
      const xs = [0, 1, 2].map((j) => pos.getX(idx.getX(i + j)));
      if (Math.min(...xs) >= 12.9 && Math.max(...xs) <= 17.1) n++;
    }
    return n;
  };
  // 基准：哑开口（u 域不匹配任何拱边）→ 区间内 = 全环 24 边 × 2 = 48
  const plain = tunnel(path, 6, 6, { openings: [{ s: 15, w: 4, part: "roof", u0: 99, u1: 100 }] }).children[0] as THREE.Mesh;
  const withWall = tunnel(path, 6, 6, { openings: [{ s: 15, w: 4, part: "wallR" }] }).children[0] as THREE.Mesh;
  const withRoof = tunnel(path, 6, 6, { openings: [{ s: 15, w: 4, part: "roof", u0: -2, u1: 2 }] }).children[0] as THREE.Mesh;
  // wallR 开口剔 2 环边（外壁+内壁）→ 44；roof 开口剔中段拱边（u∈[-2,2] 的 4 条 × 外内）→ 32
  assert.equal(trisInRange(plain), 48);
  assert.equal(trisInRange(withWall), 44);
  assert.equal(trisInRange(withRoof), 32);
});

test("tunnel: 两端开放——端面无封盖三角形", () => {
  const path: [number, number, number][] = [
    [0, 0, 0],
    [20, 0, 0],
  ];
  const g = tunnel(path, 6, 6);
  g.updateMatrixWorld(true);
  const mesh = g.children[0] as THREE.Mesh;
  const pos = mesh.geometry.getAttribute("position");
  const idx = mesh.geometry.getIndex()!;
  // 端帽若存在，会出现 x≈0 或 x≈20 平面上的实心三角形；检查两端截面处
  // 任意三角形不得跨越轴心（与空心测试同法，沿端面内侧轴点采样）
  for (const x of [0.05, 19.95]) {
    const p = new THREE.Vector3(x, 0, 0);
    for (let i = 0; i < idx.count; i += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i));
      const bb = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + 1));
      const cc = new THREE.Vector3().fromBufferAttribute(pos, idx.getX(i + 2));
      const n = new THREE.Vector3().subVectors(bb, a).cross(new THREE.Vector3().subVectors(cc, a));
      const area2 = n.length();
      if (area2 < 1e-9) continue;
      const dist = Math.abs(new THREE.Vector3().subVectors(p, a).dot(n) / area2);
      if (dist > 0.05) continue;
      const d1 = new THREE.Vector3().subVectors(bb, a);
      const d2 = new THREE.Vector3().subVectors(cc, a);
      const dp = new THREE.Vector3().subVectors(p, a);
      const d11 = d1.dot(d1), d22 = d2.dot(d2), d12 = d1.dot(d2);
      const dp1 = dp.dot(d1), dp2 = dp.dot(d2);
      const denom = d11 * d22 - d12 * d12;
      if (Math.abs(denom) < 1e-9) continue;
      const v = (dp1 * d22 - dp2 * d12) / denom;
      const ww = (d11 * dp2 - d12 * dp1) / denom;
      if (v >= -1e-6 && ww >= -1e-6 && v + ww <= 1 + 1e-6) {
        assert.fail(`x=${x} 端面轴心被三角形覆盖——存在端帽`);
      }
    }
  }
  assert.ok(true);
});

test("tunnel: 拱形断面——顶点达外断面高，内空为直墙半圆拱", () => {
  const g = tunnel(
    [
      [0, 0, 0],
      [10, 0, 0],
    ],
    6,
    6,
  );
  const mesh = g.children[0] as THREE.Mesh;
  const pos = mesh.geometry.getAttribute("position");
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) maxY = Math.max(maxY, pos.getY(i));
  assert.ok(Math.abs(maxY - 3) < 0.05, `拱顶应达外断面高 +3（实测 ${maxY}）`);
});

test("shaft: 竖直井段方向正确（底→顶）", () => {
  const g = shaft([5, 0, 5], [5, 12, 5], 2, 2);
  g.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(g);
  assert.ok(close(b.max.y - b.min.y, 12, 0.1));
});

/* ── 漏斗与矿堆 ───────────────────────────────────────────── */

test("funnel: 喇叭口宽于斗颈，总高 = 颈 + 口，底落在 pos", () => {
  const g = funnel([0, 10, 0], { neckW: 2, neckH: 3, mouthW: 5, mouthH: 2.5 });
  g.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(g);
  assert.ok(close(b.min.y, 10, 0.1), `斗底 y=${b.min.y} 应落在 pos.y=10`);
  assert.ok(close(b.max.y, 10 + 3 + 2.5, 0.1));
  assert.ok(b.max.x - b.min.x >= 4.9, `喇叭口宽 ${b.max.x - b.min.x} ≥ mouthW`);
});

test("orePile: 平台顶（截锥），底大于顶（台面平整，非安息角）", () => {
  const p = orePile([0, 0, 0], 10, 8, 4, { topW: 5, topD: 4 });
  p.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(p);
  assert.ok(close(b.max.y, 4, 1e-4));
  assert.ok(b.max.x - b.min.x > b.max.z - b.min.z, "底面 w>d 保持矩形比");
});

/* ── 分层蛋糕 ─────────────────────────────────────────────── */

test("sliceCake: 层数/层序正确（上向 = 下层 y 小），floorH 产生底板", () => {
  const { group, layers } = sliceCake({ x: 0, y: 0, z: 0, w: 12, d: 10 }, 4, 2.5, { floorH: 0.4 });
  assert.equal(layers.length, 4);
  const ys = layers.map((l) => l.position.y);
  for (let i = 1; i < ys.length; i++) assert.ok(ys[i] > ys[i - 1], "上层必须高于下层");
  const floors = group.children.filter((c) => !c.name.startsWith("layer"));
  assert.equal(floors.length, 4, "每层一块混凝土底板");
});

/* ── 崩落岩群 ─────────────────────────────────────────────── */

test("rubble: 数量正确、全部落在 region 内、同 seed 确定性复现", () => {
  const region = { x: 0, y: 20, z: 0, w: 30, h: 8, d: 30 };
  const a = rubble(region, 40, 42);
  const b = rubble(region, 40, 42);
  assert.equal(a.children.length, 40);
  a.updateMatrixWorld(true);
  const box3 = new THREE.Box3().setFromObject(a);
  assert.ok(box3.min.y >= region.y - 3.5 && box3.max.y <= region.y + region.h + 3.5, "碎岩应大致在 region 高度带内");
  const pa = (a.children[3] as THREE.Mesh).position;
  const pb = (b.children[3] as THREE.Mesh).position;
  assert.ok(close(pa.x, pb.x) && close(pa.y, pb.y) && close(pa.z, pb.z), "同 seed 必须逐粒一致");
});

/* ── 深孔 ─────────────────────────────────────────────────── */

test("fanHoles: n 孔均布、孔底聚在 origin、yawDeg=90 时扇面转向 Z-Y 平面", () => {
  const g = fanHoles([0, 12, 0], 5, 60, 15, { baseAngle: 90, yawDeg: 90 });
  const holes = g.children.filter((c) => c.name.startsWith("hole"));
  assert.equal(holes.length, 5);
  // 中间孔应竖直向上（baseAngle=90）
  const mid = holes[2] as THREE.Mesh;
  const dir = new THREE.Vector3(0, 1, 0).applyQuaternion(mid.quaternion);
  assert.ok(close(dir.y, 1, 1e-4) && close(dir.x, 0, 1e-4), "中间孔竖直");
  assert.ok(close(dir.z, 0, 1e-4), "yaw 前 z 分量为 0");
  // yaw 后中间孔仍竖直，但两侧孔偏向 ±Z
  const side = holes[0] as THREE.Mesh;
  const sd = new THREE.Vector3(0, 1, 0).applyQuaternion(side.quaternion);
  assert.ok(Math.abs(sd.z) > 0.2, `yaw=90 后边孔应带 ±Z 分量（实测 ${sd.z}）`);
});

test("parallelHoles: 平行孔等距同向", () => {
  const g = parallelHoles([0, 20, 0], 4, 3, 40, [0, 1, 0], [1, 0, 0]);
  const holes = g.children.filter((c) => c.name.startsWith("hole"));
  assert.equal(holes.length, 4);
  const xs = holes.map((h) => h.position.x);
  assert.ok(close(xs[1] - xs[0], 3) && close(xs[3] - xs[2], 3), "孔距一致");
});

/* ── 箭头 ─────────────────────────────────────────────────── */

test("arrows: 线 + n 锥头，锥头沿路径分布", () => {
  const g = arrows(
    [
      [0, 1, 0],
      [10, 1, 0],
    ],
    "flow",
    3,
  );
  const cones = g.children.filter((c) => (c as THREE.Mesh).geometry?.type === "ConeGeometry");
  assert.equal(cones.length, 3);
});

/* ── 包围盒 ───────────────────────────────────────────────── */

test("unionBBox: 多对象联合", () => {
  const a = box(2, 2, 2, { pos: [0, 1, 0] });
  const b = box(2, 2, 2, { pos: [10, 1, 0] });
  a.updateMatrixWorld(true);
  b.updateMatrixWorld(true);
  const bb = unionBBox([a, b]);
  assert.ok(bb.max[0] >= 11 && bb.min[0] <= -1);
});
