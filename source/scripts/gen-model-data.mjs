import { readFileSync, writeFileSync } from "node:fs";
import { registry } from "../src/lib/models/registry.ts";

const path = new URL("../src/data/methods.json", import.meta.url);
const data = JSON.parse(readFileSync(path, "utf8"));

for (const { slug, model } of data.methods) {
  const builder = registry[slug];
  if (!builder) throw new Error(`未注册三维模型 ${slug}`);
  Object.assign(model, {
    status: "ready",
    source: "procedural",
    engineCode: builder.engineCode,
    layers: builder.LAYERS,
    layersOff: builder.LAYERS_OFF,
    stages: builder.steps.map(({ label, note }) => ({ label, note })),
    steps: builder.steps,
    stepCount: builder.steps.length,
    phases: builder.phases,
    stepDuration: builder.stepDuration,
    defaults: builder.defaults,
    updated: "2026-11-25",
  });
  for (const view of model.presets ?? []) {
    if (view.variant === "long") view.az = 0;
    if (view.variant === "cross") view.az = 90;
  }
  console.log(slug, model.stepCount);
}
writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
