/**
 * builder 自检 + 数据一致性测试（T8 校验门 · 2026-11-23 模型替换轮重写）
 *
 * 新契约（mining-methods-3d 引擎经 adapt.ts 包装）：
 * 1) 每个注册 builder 的 selfCheck() 无问题；
 * 2) registry 的 slug 与 methods.json 的 procedural 条目一一对应（15/15）；
 * 3) builder LAYERS / LAYERS_OFF 与 methods.json layers / layersOff 逐字一致；
 *    presets 恰 4 个；「围岩」存在时排最后；图层名全部在受控词表内；
 * 4) 锚点 1–8 个（只包含当前工序可见标注）；focusPoints 含「细部」；
 * 5) STAGES（phase 分档标题）与 methods.json stages 逐字一致，档数 4–6；
 *    逐档可构建、bbox 有效、无 NaN、至少一个可见实体；
 * 6) 阶段推进：首档可见对象数 < 末档（工序累积显隐）；
 * 7) 过程演示数据契约（2026-11-24 迁移轮）：phases 全集覆盖 steps 的每个 phase
 *    （含 B-4 post 兜底档）、色值合法、stepDuration/defaults 数值域正常。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as THREE from "three";
import { registry } from "./registry.ts";
import { LAYER_NAMES } from "./types.ts";
import { getEngine } from "./engine/bootstrap.js";

interface ModelJson {
  status: string;
  source?: string;
  layers?: string[];
  layersOff?: string[];
  presets?: { id: string; label: string; az: number; el: number; variant?: string; focus?: string }[];
  stages?: { label: string; note?: string }[];
  steps?: { label: string; note?: string; phase?: string }[];
  stepCount?: number;
  phases?: { id: string; name: string; color: string }[];
  stepDuration?: number;
  defaults?: { cut: number; progress: number };
}
const methodsJson = JSON.parse(readFileSync(new URL("../../data/methods.json", import.meta.url), "utf8")) as {
  methods: { slug: string; name: string; model?: ModelJson }[];
};

const visibleMeshCount = (group: THREE.Object3D): number => {
  let n = 0;
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    let p: THREE.Object3D | null = o;
    while (p) {
      if (!p.visible) return;
      p = p.parent;
    }
    n += 1;
  });
  return n;
};

test("每个注册 builder 的 selfCheck 无问题", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const problems = builder.selfCheck?.() ?? [];
    assert.deepEqual(problems, [], `${slug} selfCheck: ${problems.join("; ")}`);
  }
});

test("registry 与 methods.json procedural 条目一一对应（15/15 ready）", () => {
  assert.equal(methodsJson.methods.length, 15);
  const procedural = methodsJson.methods
    .filter((m) => m.model?.status === "ready" && m.model.source === "procedural")
    .map((m) => m.slug);
  assert.equal(procedural.length, 15, "应有 15 条 ready-procedural");
  assert.deepEqual(procedural.sort(), Object.keys(registry).sort());
});

test("图层/预设契约：LAYERS 逐字一致、词表合法、围岩末位、presets=4", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const entry = methodsJson.methods.find((m) => m.slug === slug);
    assert.ok(entry?.model, `${slug} 缺 model 字段`);
    const model = entry.model as ModelJson;
    assert.deepEqual([...builder.LAYERS], model.layers, `${slug} 图层与 methods.json 不一致`);
    assert.deepEqual(
      [...((builder as unknown as { LAYERS_OFF: string[] }).LAYERS_OFF)],
      model.layersOff,
      `${slug} layersOff 与 methods.json 不一致`,
    );
    for (const l of builder.LAYERS) {
      assert.ok((LAYER_NAMES as readonly string[]).includes(l), `${slug} 非法图层名: ${l}`);
    }
    assert.equal(model.presets?.length, 4, `${slug} presets 应为 4 个`);
    if (model.layers?.includes("围岩")) {
      assert.equal(model.layers.at(-1), "围岩", `${slug} 围岩应排最后（默认关）`);
      assert.ok(model.layersOff?.includes("围岩"), `${slug} 围岩存在时应默认关`);
    }
  }
});

test("锚点与细部焦点：iso 构建 anchors 1–8、focusPoints 含细部、bbox 有限", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const r = builder.build({ variant: "iso" });
    assert.ok(r.anchors.length >= 1, `${slug} 缺少当前工序的锚点`);
    assert.ok(r.anchors.length <= 8, `${slug} 锚点 ${r.anchors.length} > 8`);
    for (const a of r.anchors) {
      assert.ok(a.label.length > 0, `${slug} 空锚点标签`);
      assert.ok(a.pos.every(Number.isFinite), `${slug} 锚点坐标 NaN: ${a.label}`);
    }
    assert.ok(Array.isArray(r.focusPoints?.["细部"]), `${slug} 缺「细部」焦点`);
    assert.ok(
      [...r.bbox.min, ...r.bbox.max].every(Number.isFinite),
      `${slug} bbox 含 NaN`,
    );
  }
});

test("工艺阶段：builder STAGES 与 methods.json stages 逐字一致，档数 4–10（开拓拆档），逐档可构建无 NaN", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const stages = (builder as unknown as { STAGES: readonly string[] }).STAGES;
    const entry = methodsJson.methods.find((m) => m.slug === slug);
    const jsonStages = (entry?.model as ModelJson | undefined)?.stages ?? [];
    assert.ok(stages.length >= 4 && stages.length <= 10, `${slug} 阶段档数异常: ${stages.length}`);
    assert.deepEqual(
      [...stages],
      jsonStages.map((s) => s.label),
      `${slug} 阶段标题与 methods.json 不一致`,
    );
    for (let s = 1; s <= stages.length; s++) {
      const r = builder.build({ stage: s });
      assert.ok(r.bbox.max[1] > r.bbox.min[1], `${slug} stage${s} bbox 无效`);
      let nan = 0;
      let vis = 0;
      r.group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.position && Number.isNaN(m.position.x + m.position.y + m.position.z)) nan += 1;
        if (m.isMesh) vis += 1;
      });
      assert.equal(nan, 0, `${slug} stage${s} 存在 NaN 位置`);
      assert.ok(visibleMeshCount(r.group) >= 1, `${slug} stage${s} 无可见实体`);
      assert.ok(vis > 0, `${slug} stage${s} 无网格`);
    }
  }
});

test("阶段推进：首末档可见对象集不同、中段逐档推进（末档采场处理允许为概念步）", () => {
  const visSet = (group: THREE.Object3D): Set<string> => {
    const s = new Set<string>();
    group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      let p: THREE.Object3D | null = o;
      while (p) {
        if (!p.visible) return;
        p = p.parent;
      }
      s.add(String(mesh.userData?.object_id ?? "anon"));
    });
    return s;
  };
  const diff = (a: Set<string>, b: Set<string>): number => {
    let n = 0;
    for (const x of a) if (!b.has(x)) n += 1;
    for (const x of b) if (!a.has(x)) n += 1;
    return n;
  };
  for (const [slug, builder] of Object.entries(registry)) {
    const stages = (builder as unknown as { STAGES: readonly string[] }).STAGES;
    const sets: Set<string>[] = [];
    for (let s = 1; s <= stages.length; s++) sets.push(visSet(builder.build({ stage: s }).group));
    assert.ok(diff(sets[0], sets[sets.length - 1]) > 0, `${slug} 首末档可见对象集相同`);
    for (let s = 2; s < stages.length; s++) {
      assert.ok(diff(sets[s - 2], sets[s - 1]) > 0, `${slug} 第 ${s - 1}→${s} 档无推进`);
    }
  }
});

test("原始工序可逐步构建，概览终帧与逐步回放终帧一致", () => {
  let total = 0;
  for (const { slug, model } of methodsJson.methods) {
    const builder = registry[slug];
    assert.ok(builder && model?.steps?.length && model.stages?.length, slug);
    assert.equal(model.steps.length, model.stepCount, slug);
    total += model.steps.length;
    for (const [index, step] of model.steps.entries()) {
      assert.ok(step.label && step.phase, slug);
      const frame = builder.build({ step: index + 1 });
      assert.ok(visibleMeshCount(frame.group) >= 1, slug);
      assert.ok(frame.anchors.length >= 1 && frame.anchors.length <= 8, slug);
    }
    const summary = builder.build({ stage: model.stages.length });
    const final = builder.build({ step: model.steps.length });
    assert.equal(visibleMeshCount(summary.group), visibleMeshCount(final.group), slug);
  }
  assert.equal(total, 243);
});

test("过程演示数据契约：phases 覆盖全部 step.phase、stepDuration/defaults 数值域", () => {
  for (const { slug, model } of methodsJson.methods) {
    assert.ok(slug && model, slug);
    const phases = model.phases ?? [];
    assert.ok(phases.length >= 4, `${slug} phases 少于 4 档`);
    const ids = new Set(phases.map((p) => p.id));
    assert.ok(ids.size === phases.length, `${slug} phases id 重复`);
    for (const [i, step] of (model.steps ?? []).entries()) {
      assert.ok(step.phase && ids.has(step.phase), `${slug} 步 ${i + 1} 的 phase "${step.phase}" 不在 phases 内`);
    }
    for (const p of phases) {
      assert.ok(p.name.length > 0, `${slug} 阶段 ${p.id} 缺名字`);
      assert.match(p.color, /^#[0-9a-fA-F]{6}$/, `${slug} 阶段 ${p.id} 色值非法: ${p.color}`);
    }
    assert.ok(
      typeof model.stepDuration === "number" && model.stepDuration > 0 && model.stepDuration <= 10,
      `${slug} stepDuration 异常: ${model.stepDuration}`,
    );
    const d = model.defaults;
    assert.ok(d && d.cut >= 0 && d.cut <= 1 && d.progress >= 0 && d.progress <= 1, `${slug} defaults 越界`);
  }
});

test("B-3 逐层开挖与逐层充填，标注跟随工序和剖面", () => {
  const builder = registry["downward-slice"];
  const cut = builder.build({ step: 3 });
  const fill = builder.build({ step: 4 });
  const next = builder.build({ step: 5 });
  const cross = builder.build({ step: 5, variant: "cross" });
  const counts = [cut, fill, next].map(({ group }) => {
    let voids = 0;
    let fills = 0;
    group.traverseVisible((object) => {
      if (object.userData.type_code === "STOPE-A") voids += 1;
      if (object.userData.type_code === "FILL") fills += 1;
    });
    return [voids, fills];
  });
  assert.deepEqual(counts, [[1, 0], [0, 1], [1, 1]]);
  assert.ok(fill.anchors.some(({ label }) => label === "充填体"));
  assert.ok(!fill.anchors.some(({ label }) => label.startsWith("人工假顶")));
  assert.ok(next.anchors.some(({ label }) => label.startsWith("人工假顶")));
  const midpoint = (cross.bbox.min[0] + cross.bbox.max[0]) / 2;
  assert.ok(cross.anchors.every(({ pos }) => pos[0] <= midpoint));
});

test("自由探索按视角切换剖切轴，回到过程演示恢复预设剖面", () => {
  const session = registry["upward-horizontal-slice"].createLive({ variant: "long", step: 1 });
  const { clipPlane } = getEngine();
  try {
    session.setCut(0.25);
    session.explore(0.55);
    assert.deepEqual(clipPlane.normal.toArray(), [0, 0, -1]);
    const longitudinal = session.bounds.max.z + 3 - 0.25 * (session.bounds.max.z - session.bounds.min.z + 6);
    assert.equal(clipPlane.constant, longitudinal);

    session.setVariant("cross");
    session.setCut(0.25);
    session.explore(0.55);
    assert.deepEqual(clipPlane.normal.toArray(), [-1, 0, 0]);
    const transverse = session.bounds.max.x + 3 - 0.25 * (session.bounds.max.x - session.bounds.min.x + 6);
    assert.equal(clipPlane.constant, transverse);

    session.step(1);
    assert.deepEqual(clipPlane.normal.toArray(), [-1, 0, 0]);
    assert.equal(clipPlane.constant, (session.bounds.min.x + session.bounds.max.x) / 2);
  } finally {
    session.dispose();
  }
});
