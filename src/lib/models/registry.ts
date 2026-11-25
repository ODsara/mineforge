/**
 * slug → builder 静态映射（2026-11-23 模型替换轮）
 *
 * 15 个采矿方法全部改由 mining-methods-3d 教学引擎（engine/methods/*.js）驱动，
 * 经 adapt.ts 包装为网站 ModelBuilder 契约；slug ↔ 引擎代码对照：
 *   A-1 comprehensive            A-2 room-pillar            A-4 stage-room
 *   A-5 sublevel-room            A-6 sublevel-drilling-stage-room
 *   B-1 single-layer             B-3 downward-slice         B-4 sublevel-backfill
 *   C-1 single-layer-caving      C-2 sublevel-caving-bottom-pillar
 *   C-4 stage-forced-caving      C-5 stage-natural-caving
 *   F-9 upward-horizontal-slice  S-3 shrinkage              C-19 sublevel-caving-no-pillar
 */
import { makeBuilder, type AdaptedBuilder, type EngineDef } from "./adapt.ts";

import * as a1 from "./engine/methods/a1.js";
import * as a2 from "./engine/methods/a2.js";
import * as a4 from "./engine/methods/a4.js";
import * as a5 from "./engine/methods/a5.js";
import * as a6 from "./engine/methods/a6.js";
import * as b1 from "./engine/methods/b1.js";
import * as b3 from "./engine/methods/b3.js";
import * as b4 from "./engine/methods/b4.js";
import * as c1 from "./engine/methods/c1.js";
import * as c19 from "./engine/methods/c19.js";
import * as c2 from "./engine/methods/c2.js";
import * as c4 from "./engine/methods/c4.js";
import * as c5 from "./engine/methods/c5.js";
import * as f9 from "./engine/methods/f9.js";
import * as s3 from "./engine/methods/s3.js";

const asDef = (m: unknown): EngineDef => m as EngineDef;

export const registry: Record<string, AdaptedBuilder> = {
  "comprehensive": makeBuilder(asDef(a1)),
  "room-pillar": makeBuilder(asDef(a2)),
  "stage-room": makeBuilder(asDef(a4)),
  "sublevel-room": makeBuilder(asDef(a5)),
  "sublevel-drilling-stage-room": makeBuilder(asDef(a6)),
  "single-layer": makeBuilder(asDef(b1)),
  "downward-slice": makeBuilder(asDef(b3)),
  "sublevel-backfill": makeBuilder(asDef(b4)),
  "single-layer-caving": makeBuilder(asDef(c1)),
  "sublevel-caving-no-pillar": makeBuilder(asDef(c19)),
  "sublevel-caving-bottom-pillar": makeBuilder(asDef(c2)),
  "stage-forced-caving": makeBuilder(asDef(c4)),
  "stage-natural-caving": makeBuilder(asDef(c5)),
  "upward-horizontal-slice": makeBuilder(asDef(f9)),
  "shrinkage": makeBuilder(asDef(s3)),
};
