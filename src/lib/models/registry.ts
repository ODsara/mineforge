/**
 * slug → builder 静态映射（建模方案 §3.2）
 * P0 注册 2 条示范；随 P1-P3 逐阶段扩容至 15 条。
 * ModelViewer 的 procedural 分支按 slug 取 builder 现场生成。
 */
import type { ModelRegistry } from "./types.ts";
import * as roomPillar from "./room-pillar.ts";
import * as sublevelCavingNoPillar from "./sublevel-caving-no-pillar.ts";
import * as comprehensive from "./comprehensive.ts";
import * as shrinkage from "./shrinkage.ts";
import * as stageRoom from "./stage-room.ts";
import * as sublevelRoom from "./sublevel-room.ts";
import * as sublevelDrillingStageRoom from "./sublevel-drilling-stage-room.ts";
import * as singleLayer from "./single-layer.ts";
import * as upwardHorizontalSlice from "./upward-horizontal-slice.ts";
import * as downwardSlice from "./downward-slice.ts";
import * as sublevelBackfill from "./sublevel-backfill.ts";
import * as singleLayerCaving from "./single-layer-caving.ts";
import * as sublevelCavingBottomPillar from "./sublevel-caving-bottom-pillar.ts";
import * as stageForcedCaving from "./stage-forced-caving.ts";
import * as stageNaturalCaving from "./stage-natural-caving.ts";

export const registry: ModelRegistry = {
  "room-pillar": roomPillar,
  "sublevel-caving-no-pillar": sublevelCavingNoPillar,
  "comprehensive": comprehensive,
  "shrinkage": shrinkage,
  "stage-room": stageRoom,
  "sublevel-room": sublevelRoom,
  "sublevel-drilling-stage-room": sublevelDrillingStageRoom,
  "single-layer": singleLayer,
  "upward-horizontal-slice": upwardHorizontalSlice,
  "downward-slice": downwardSlice,
  "sublevel-backfill": sublevelBackfill,
  "single-layer-caving": singleLayerCaving,
  "sublevel-caving-bottom-pillar": sublevelCavingBottomPillar,
  "stage-forced-caving": stageForcedCaving,
  "stage-natural-caving": stageNaturalCaving,
};
