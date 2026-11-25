// 程序化纹理：不依赖任何外部贴图，保证离线可运行。
// 所有纹理均为"展示性表达"，不代表真实岩矿石结构（见 docs/参数档）。
import * as THREE from 'three';

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, y, seed) {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1013904223);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t) => t * t * (3 - 2 * t);

function valueNoise(x, y, seed, period = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const sample = period ? (u, v) => hash2(u % period, v % period, seed) : (u, v) => hash2(u, v, seed);
  const a = sample(xi, yi);
  const b = sample(xi + 1, yi);
  const c = sample(xi, yi + 1);
  const d = sample(xi + 1, yi + 1);
  return (a * (1 - xf) + b * xf) * (1 - yf) + (c * (1 - xf) + d * xf) * yf;
}

function fbm(x, y, seed, octaves = 4) {
  let v = 0, amp = 0.5, f = 1;
  for (let o = 0; o < octaves; o++) {
    v += valueNoise(x * f, y * f, seed + o * 17) * amp;
    f *= 2.03; amp *= 0.5;
  }
  return v;
}

function canvas2d(size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return { c, ctx: c.getContext('2d') };
}

function finish(c, repeat = 1) {
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** 矿石：中性暖灰细节纹理（由材质 color 着色为铜矿石）；细粒矿化斑点 + 层理感 */
function oreTexture() {
  const S = 256;
  const { c, ctx } = canvas2d(S);
  const img = ctx.createImageData(S, S);
  const rnd = mulberry32(20261122);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x / 18, y / 18, 11, 4);
      const band = 0.5 + 0.5 * Math.sin((y / S) * Math.PI * 6 + n * 4);
      const speck = hash2(x, y, 91) > 0.962;
      const i = (y * S + x) * 4;
      // 中性亮基底：材质 color 负责铜/赭色，贴图只负责矿物细节
      const v = 178 + n * 50 + band * 16;
      let r = v * 1.02;
      let g = v * 0.99;
      let b = v * 0.95;
      if (speck) { r += 42; g += 38; b += 30; }
      img.data[i] = Math.min(255, r);
      img.data[i + 1] = Math.min(255, g);
      img.data[i + 2] = Math.min(255, b);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // 暗色矿斑 + 浅色石英细脉，增加矿石的层次（着色后仍为铜色系）
  for (let k = 0; k < 14; k++) {
    const gx = rnd() * S, gy = rnd() * S;
    const gr = ctx.createRadialGradient(gx, gy, 2, gx, gy, 14 + rnd() * 26);
    gr.addColorStop(0, 'rgba(74,58,42,0.22)');
    gr.addColorStop(1, 'rgba(74,58,42,0)');
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.arc(gx, gy, 14 + rnd() * 26, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(238,228,206,0.42)';
  for (let k = 0; k < 10; k++) {
    ctx.lineWidth = 0.9 + rnd() * 1.4;
    ctx.beginPath();
    let x = rnd() * S, y = rnd() * S;
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) {
      x += (rnd() - 0.5) * 46; y += (rnd() - 0.5) * 46;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // 少量细裂隙
  ctx.strokeStyle = 'rgba(72,58,46,0.42)';
  for (let k = 0; k < 26; k++) {
    ctx.lineWidth = 0.6 + rnd() * 1.1;
    ctx.beginPath();
    let x = rnd() * S, y = rnd() * S;
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      x += (rnd() - 0.5) * 34; y += (rnd() - 0.5) * 34;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return finish(c);
}

/** 围岩：中性灰细节纹理（由材质 color 着色为深板岩）；斑驳 + 裂隙 */
function rockTexture() {
  const S = 256;
  const { c, ctx } = canvas2d(S);
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x / 24, y / 24, 47, 4);
      const n2 = fbm(x / 7, y / 7, 83, 3);
      const i = (y * S + x) * 4;
      const v = 150 + n * 55 + n2 * 14;
      img.data[i] = v * 1.00;
      img.data[i + 1] = v * 0.99;
      img.data[i + 2] = v * 0.97;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const rnd = mulberry32(7);
  ctx.strokeStyle = 'rgba(48,48,48,0.45)';
  for (let k = 0; k < 40; k++) {
    ctx.lineWidth = 0.5 + rnd();
    ctx.beginPath();
    let x = rnd() * S, y = rnd() * S;
    ctx.moveTo(x, y);
    const a = rnd() * Math.PI;
    ctx.lineTo(x + Math.cos(a) * (20 + rnd() * 50), y + Math.sin(a) * (20 + rnd() * 50));
    ctx.stroke();
  }
  return finish(c);
}

/** 碎块拼贴纹理：留矿堆 / 崩落矿石 / 崩落围岩共用生成器；中性灰，由材质 color 分色 */
function fragmentTexture({
  seed = 4242,
  bg = '#909090',
  tones = ['#c8c8c8', '#d6d6d6', '#b8b8b8', '#e2e2e2', '#a8a8a8', '#cfcfcf'],
  count = 420,
  rMin = 3,
  rMax = 14,
  stroke = 'rgba(55,55,55,0.55)',
  S = 256,
} = {}) {
  const { c, ctx } = canvas2d(S);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);
  const rnd = mulberry32(seed);
  for (let k = 0; k < count; k++) {
    const cx = rnd() * S, cy = rnd() * S;
    const r = rMin + rnd() * (rMax - rMin);
    const sides = 3 + Math.floor(rnd() * 3);
    const vertices = [];
    for (let s = 0; s < sides; s++) {
      const a = (s / sides) * Math.PI * 2 + rnd() * 0.35;
      const rr = r * (0.62 + rnd() * 0.55);
      vertices.push([Math.cos(a) * rr, Math.sin(a) * rr]);
    }
    const tone = tones[Math.floor(rnd() * tones.length)];
    const margin = r * 1.2;
    const offsetsX = [0];
    const offsetsY = [0];
    if (cx < margin) offsetsX.push(S);
    if (cx > S - margin) offsetsX.push(-S);
    if (cy < margin) offsetsY.push(S);
    if (cy > S - margin) offsetsY.push(-S);

    for (const dx of offsetsX) {
      for (const dy of offsetsY) {
        const x = cx + dx;
        const y = cy + dy;
        ctx.beginPath();
        ctx.moveTo(x + vertices[0][0], y + vertices[0][1]);
        for (const [u, v] of vertices.slice(1)) ctx.lineTo(x + u, y + v);
        ctx.closePath();
        ctx.fillStyle = tone;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // 破碎面保留小幅明暗变化，避免碎块看起来像均匀的彩色平片。
        const shade = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
        shade.addColorStop(0, 'rgba(255,255,255,0.16)');
        shade.addColorStop(0.55, 'rgba(255,255,255,0)');
        shade.addColorStop(1, 'rgba(0,0,0,0.22)');
        ctx.fillStyle = shade;
        ctx.fill();
      }
    }
  }
  return finish(c);
}

/** 留矿堆：中性碎块（材质 color 呈黄褐色） */
function muckTexture() {
  return fragmentTexture({
    seed: 4242,
    bg: '#8f8a84',
    tones: ['#d2c6b4', '#e0d2bc', '#c2b49e', '#eadcc6', '#b4a692', '#d8cab6'],
    count: 380, rMin: 3, rMax: 13,
    stroke: 'rgba(62,54,46,0.50)',
  });
}

/** 崩落矿石：中性偏暗碎块（材质 color 呈暗铜褐） */
function cavedOreTexture() {
  return fragmentTexture({
    seed: 777,
    bg: '#7d7a76',
    tones: ['#b8b2aa', '#c8c0b6', '#a49e96', '#d4ccc2', '#948e86', '#bcb4aa'],
    count: 560, rMin: 2.5, rMax: 10,
    stroke: 'rgba(48,44,40,0.60)',
  });
}

/** 崩落围岩：中性偏冷碎块（材质 color 呈灰褐） */
function cavedRockTexture() {
  return fragmentTexture({
    seed: 999,
    bg: '#848484',
    tones: ['#c0c2c0', '#d0d2d0', '#b0b2b0', '#dcdedc', '#a0a2a0', '#c8cac8'],
    count: 560, rMin: 2.5, rMax: 10,
    stroke: 'rgba(46,48,46,0.60)',
  });
}

/** 充填体：中性细砂质（材质 color 呈灰绿） */
function fillTexture() {
  const S = 256;
  const { c, ctx } = canvas2d(S);
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const grain = valueNoise(x * 64 / S, y * 64 / S, 131, 64);
      const strata = valueNoise(x * 8 / S, y * 8 / S, 213, 8);
      const i = (y * S + x) * 4;
      const v = 195 + grain * 36 + strata * 19;
      img.data[i] = v * 0.99;
      img.data[i + 1] = v * 1.00;
      img.data[i + 2] = v * 0.98;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return finish(c);
}

/** 混凝土/胶结面：中性浅灰 + 骨料点（材质 color 呈石灰/混凝土色） */
function concreteTexture() {
  const S = 256;
  const { c, ctx } = canvas2d(S);
  ctx.fillStyle = '#c4c4c4';
  ctx.fillRect(0, 0, S, S);
  const rnd = mulberry32(99);
  for (let k = 0; k < 1500; k++) {
    const g = 150 + Math.floor(rnd() * 80);
    ctx.fillStyle = `rgba(${g},${g},${g},${0.25 + rnd() * 0.5})`;
    ctx.beginPath();
    ctx.arc(rnd() * S, rnd() * S, 0.6 + rnd() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  return finish(c);
}

/** 巷道内壁：中性灰 + 细微磨损（材质 color 呈石灰岩色） */
function liningTexture() {
  const S = 128;
  const { c, ctx } = canvas2d(S);
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm(x / 12, y / 12, 311, 3);
      const i = (y * S + x) * 4;
      const v = 170 + n * 55;
      img.data[i] = v * 1.00;
      img.data[i + 1] = v * 0.99;
      img.data[i + 2] = v * 0.97;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return finish(c);
}

export function createTextures() {
  return {
    ore: oreTexture(),
    rock: rockTexture(),
    muck: muckTexture(),
    cavedOre: cavedOreTexture(),
    cavedRock: cavedRockTexture(),
    fill: fillTexture(),
    dryFill: fragmentTexture({
      seed: 649,
      bg: '#acaaa4',
      tones: ['#c8c6c1', '#d6d3ca', '#b8b5ae', '#dedbd4', '#a29e96'],
      count: 720, rMin: 1.2, rMax: 5,
      stroke: 'rgba(76,71,63,0.24)',
    }),
    concrete: concreteTexture(),
    lining: liningTexture(),
  };
}
