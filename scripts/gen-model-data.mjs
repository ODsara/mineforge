// 模型替换轮数据生成：从 mining-methods-3d 引擎模块提取 15 法图层/工序/默认关层，
// 写回 src/data/methods.json 的 model 字段。presets 的 az/el 沿用原表（视角习惯不变），
// id=zoom 的 preset 补 focus:'细部'。用法：node scripts/gen-model-data.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import * as a1 from "../src/lib/models/engine/methods/a1.js";
import * as a2 from "../src/lib/models/engine/methods/a2.js";
import * as a4 from "../src/lib/models/engine/methods/a4.js";
import * as a5 from "../src/lib/models/engine/methods/a5.js";
import * as a6 from "../src/lib/models/engine/methods/a6.js";
import * as b1 from "../src/lib/models/engine/methods/b1.js";
import * as b3 from "../src/lib/models/engine/methods/b3.js";
import * as b4 from "../src/lib/models/engine/methods/b4.js";
import * as c1 from "../src/lib/models/engine/methods/c1.js";
import * as c19 from "../src/lib/models/engine/methods/c19.js";
import * as c2 from "../src/lib/models/engine/methods/c2.js";
import * as c4 from "../src/lib/models/engine/methods/c4.js";
import * as c5 from "../src/lib/models/engine/methods/c5.js";
import * as f9 from "../src/lib/models/engine/methods/f9.js";
import * as s3 from "../src/lib/models/engine/methods/s3.js";

import { layersOf, layersOffOf, phasesOf, probeOf, stagesOf, stepsOf } from "../src/lib/models/adapt.ts";

const SLUG_TO_DEF = {
  comprehensive: a1,
  "room-pillar": a2,
  "stage-room": a4,
  "sublevel-room": a5,
  "sublevel-drilling-stage-room": a6,
  "single-layer": b1,
  "downward-slice": b3,
  "sublevel-backfill": b4,
  "single-layer-caving": c1,
  "sublevel-caving-no-pillar": c19,
  "sublevel-caving-bottom-pillar": c2,
  "stage-forced-caving": c4,
  "stage-natural-caving": c5,
  "upward-horizontal-slice": f9,
  shrinkage: s3,
};

// 引擎工序亮色 → 岩矿色谱（移植独立版 ui.js THEME_COLOR 的 7 个实际用到的阶段色）
const PHASE_TONE = {
  "#6fe3d8": "#7396A3",
  "#9fd0ff": "#7396A3",
  "#ff7a4f": "#A3352B",
  "#ffcb6b": "#C97A45",
  "#8fd6b0": "#78967F",
  "#c9b48a": "#716D64",
  "#ffa94d": "#C97A45",
};

const path = fileURLToPath(new URL("../src/data/methods.json", import.meta.url));
const data = JSON.parse(readFileSync(path, "utf8"));

for (const m of data.methods) {
  const def = SLUG_TO_DEF[m.slug];
  if (!def) throw new Error(`slug ${m.slug} 无引擎模块映射`);
  const model = (m.model ??= {});
  model.status = "ready";
  model.source = "procedural";
  model.layers = layersOf(def);
  model.layersOff = layersOffOf(def);
  model.stages = stagesOf(def).map(({ label, note }) => ({ label, ...(note ? { note } : {}) }));
  model.steps = stepsOf(def).map(({ title, desc, phase }) => ({
    label: title,
    ...(desc ? { note: desc } : {}),
    ...(phase ? { phase } : {}),
  }));
  model.stepCount = model.steps.length;
  // 过程演示迁移轮（11/24）：阶段全集（含 steps 引用但未注册的兜底档，如 B-4 的 post）、
  // 播放速度基准与自由探索初始态；阶段亮色映射到岩矿色谱（同独立版 ui.js THEME_COLOR，仅 UI）。
  model.phases = phasesOf(def).map(({ id, name, color }) => ({ id, name, color: PHASE_TONE[color?.toLowerCase?.()] ?? "#716D64" }));
  model.stepDuration = probeOf(def).stepDuration;
  model.defaults = probeOf(def).defaults;
  for (const p of model.presets ?? []) {
    if (p.id === "zoom") p.focus = "细部";
    if (p.variant === undefined) p.variant = "iso";
  }
  delete model.glb;
  delete model.poster;
  delete model.anchors;
  delete model.bbox;
  delete model.bytes;
  model.engineCode = def.meta.code;
  model.updated = "2026-11-24";
  console.log(`${m.slug.padEnd(32)} ${def.meta.code.padEnd(5)} layers=${model.layers.length} steps=${model.stepCount} phases=${model.phases.length} dur=${model.stepDuration}s`);
}

data.updated = "2026-11-24";
writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("methods.json 已更新");
