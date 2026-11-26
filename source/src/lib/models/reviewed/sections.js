const profiles = {
  haul: { name: '拱形运输断面', shape: 'arch', width: 0.78, height: 0.72, crown: 0.68, rail: true, support: 'lining' },
  ramp: { name: '拱形斜坡道', shape: 'arch', width: 0.72, height: 0.65, crown: 0.62, support: 'lining' },
  air: { name: '拱形回风断面', shape: 'arch', width: 0.56, height: 0.57, crown: 0.60, support: 'lining' },
  drift: { name: '拱形联络断面', shape: 'arch', width: 0.51, height: 0.53, crown: 0.64, support: 'ribs' },
  loading: { name: '圆弧拱装运断面', shape: 'arch', width: 0.60, height: 0.54, crown: 0.73, support: 'ribs' },
  production: { name: '圆弧拱回采断面', shape: 'arch', width: 0.70, height: 0.68, crown: 0.70, support: 'ribs' },
  drill: { name: '拱形凿岩硐室', shape: 'arch', width: 0.71, height: 0.75, crown: 0.70, support: 'ribs' },
  cut: { name: '矩形切割／薄层断面', shape: 'rectangle', width: 0.54, height: 0.44, support: 'frames' },
  scraper: { name: '梯形电耙断面', shape: 'trapezoid', width: 0.57, height: 0.53, support: 'frames' },
  main: { name: '圆形提升井筒', radius: 0.28, shape: 'circle' },
  vent: { name: '圆形回风井筒', radius: 0.21, shape: 'circle' },
  raise: { name: '矩形天井', radius: 0.19, shape: 'rectangle' },
  pass: { name: '圆形垂直溜井', radius: 0.207, shape: 'circle' },
  incline: { name: '矩形斜溜道', radius: 0.18, shape: 'rectangle' },
  hopper: { name: '收缩形漏斗与斗颈', radius: 0.41, shape: 'hopper' },
  service: { name: '拱形充填联络断面', shape: 'arch', width: 0.50, height: 0.56, crown: 0.64, support: 'ribs' },
  fillBore: { name: '专用圆形充填钻孔', radius: 0.13, shape: 'circle' },
};

export function sectionFor(name, kind) {
  if (kind === 'shaft') {
    if (name === '主井') return profiles.main;
    if (!name || name === '回风井') return profiles.vent;
    return profiles.raise;
  }
  if (kind === 'gravity') return profiles.pass;
  if (kind === 'chute') return profiles.incline;
  if (kind === 'bell') return profiles.hopper;
  if (kind === 'ramp') return profiles.ramp;
  if (kind === 'fillBore') return profiles.fillBore;
  if (kind === 'service') return profiles.service;
  if (kind !== 'drift' && kind !== 'face') return null;
  if (kind === 'face' || /低侧|切割|中心上山|顺路人行/.test(name)) return profiles.cut;
  if (/电耙/.test(name)) return profiles.scraper;
  if (/回风/.test(name)) return profiles.air;
  if (/回采进路|出矿作业/.test(name)) return profiles.production;
  if (/凿岩|钻机/.test(name)) return profiles.drill;
  if (/装运|装矿|装车|出矿巷/.test(name)) return profiles.loading;
  if (name === '阶段运输巷道') return profiles.haul;
  if (/分段运输|分层运输/.test(name)) return profiles.ramp;
  return profiles.drift;
}

export function outlineFor(profile) {
  const w = profile.width / 2;
  const h = profile.height;
  if (profile.shape === 'rectangle') return [[-w, 0], [w, 0], [w, h], [-w, h]];
  if (profile.shape === 'trapezoid') return [[-w, 0], [w, 0], [w * 0.72, h], [-w * 0.72, h]];
  const rise = h * (1 - profile.crown);
  const radius = (w * w + rise * rise) / (2 * rise);
  const sideAngle = Math.asin(w / radius);
  return [[-w, 0], [w, 0], ...Array.from({ length: 11 }, (_, i) => {
    const angle = sideAngle * (1 - 2 * i / 10);
    return [radius * Math.sin(angle), h - radius * (1 - Math.cos(angle))];
  })];
}
