import { makeReviewedBuilder } from "./reviewed.ts";

const reviewedMethods = {
  comprehensive: ["open", "A-1"],
  "room-pillar": ["room", "A-2"],
  shrinkage: ["shrink", "S-3"],
  "stage-room": ["stage", "A-4"],
  "sublevel-room": ["subroom", "A-5"],
  "sublevel-drilling-stage-room": ["subdrill", "A-6"],
  "single-layer": ["flatfill", "B-1"],
  "upward-horizontal-slice": ["overhand", "F-9"],
  "downward-slice": ["underhand", "B-3"],
  "sublevel-backfill": ["subfill", "B-4"],
  "single-layer-caving": ["longwall", "C-1"],
  "sublevel-caving-bottom-pillar": ["pillared", "C-2"],
  "sublevel-caving-no-pillar": ["pillarless", "C-19"],
  "stage-forced-caving": ["forced", "C-4"],
  "stage-natural-caving": ["natural", "C-5"],
};

export const registry = Object.fromEntries(
  Object.entries(reviewedMethods).map(([slug, [method, code]]) => [slug, makeReviewedBuilder(method, code)]),
);
