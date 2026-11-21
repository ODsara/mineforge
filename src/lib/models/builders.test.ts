/**
 * builder 自检 + 数据一致性测试（T8 校验门）
 * 1) 每个已注册 builder 的 selfCheck() 无问题；
 * 2) registry 的 slug 与 methods.json 的 procedural 条目一一对应；
 * 3) builder LAYERS 与 methods.json layers 逐字一致（授权书 §7 检查单第 4 项）；
 * 4) 锚点 ≤8；presets 恰 4 个；围岩排最后。
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registry } from "./registry.ts";

const methodsJson = JSON.parse(readFileSync(new URL("../../data/methods.json", import.meta.url), "utf8")) as {
  methods: { slug: string; model?: { status: string; source?: string; layers?: string[]; presets?: unknown[] } }[];
};

test("每个注册 builder 的 selfCheck 无问题", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const problems = builder.selfCheck?.() ?? [];
    assert.deepEqual(problems, [], `${slug} selfCheck: ${problems.join("; ")}`);
  }
});

test("registry 与 methods.json procedural 条目一一对应", () => {
  const procedural = methodsJson.methods.filter((m) => m.model?.status === "ready" && m.model.source === "procedural").map((m) => m.slug);
  assert.deepEqual(procedural.sort(), Object.keys(registry).sort());
});

test("builder LAYERS 与 methods.json layers 逐字一致；锚点≤8；presets=4；围岩最后", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const entry = methodsJson.methods.find((m) => m.slug === slug);
    assert.ok(entry?.model, `${slug} 缺 model 字段`);
    const model = entry.model as NonNullable<typeof entry.model>;
    assert.deepEqual(builder.LAYERS, model.layers, `${slug} 图层不一致`);
    assert.equal(model.presets?.length, 4, `${slug} presets 应为 4 个`);
    assert.equal(model.layers?.at(-1), "围岩", `${slug} 围岩应排最后（默认关）`);
    const r = builder.build({ variant: "iso" });
    assert.ok(r.anchors.length <= 8, `${slug} 锚点 ${r.anchors.length} > 8`);
    assert.ok(r.anchors.length >= 4, `${slug} 锚点仅 ${r.anchors.length} 个，教学信息不足`);
  }
});

test("全量轮后：15/15 全部 ready-procedural", () => {
  assert.equal(methodsJson.methods.length, 15);
  const ready = methodsJson.methods.filter((m) => m.model?.status === "ready" && m.model.source === "procedural").length;
  assert.equal(ready, 15);
});

test("工艺阶段：builder STAGES 与 methods.json stages 逐字一致，逐阶段可构建无 NaN", () => {
  for (const [slug, builder] of Object.entries(registry)) {
    const stages = (builder as unknown as { STAGES: readonly string[] }).STAGES;
    const entry = methodsJson.methods.find((m) => m.slug === slug);
    const jsonStages = (entry?.model as { stages?: { label: string }[] } | undefined)?.stages ?? [];
    assert.equal(stages.length, 5, `${slug} 应为 5 阶段`);
    assert.deepEqual(
      [...stages],
      jsonStages.map((s) => s.label),
      `${slug} 阶段标题与 methods.json 不一致`,
    );
    for (let s = 1; s <= stages.length; s++) {
      const r = builder.build({ stage: s });
      assert.ok(r.bbox.max[1] > r.bbox.min[1], `${slug} stage${s} bbox 无效`);
      let nan = 0;
      r.group.traverse((o) => {
        const m = o as import("three").Mesh;
        if (m.position && Number.isNaN(m.position.x + m.position.y + m.position.z)) nan++;
      });
      assert.equal(nan, 0, `${slug} stage${s} 存在 NaN 位置`);
    }
  }
});

test("工艺阶段几何递增：开拓巷道随阶段出现、回采矿量随阶段减少", () => {
  const tri = (b: { build(o: { stage: number }): { group: import("three").Object3D } }, s: number): number => {
    let n = 0;
    b.build({ stage: s }).group.traverse((o) => {
      const m = o as import("three").Mesh;
      if (m.geometry?.index) n += m.geometry.index.count / 3;
    });
    return n;
  };
  const rp = registry["room-pillar"];
  const np = registry["sublevel-caving-no-pillar"];
  // 房柱：S1（仅采准巷道，无矿柱无采空）→ S3（拉底+矿柱+采空壳显现）
  assert.ok(tri(rp, 3) > tri(rp, 1), "拉底阶段应比采准阶段几何更多（矿柱/采空壳显现）");
  // 无底柱：S1（运巷+井筒）→ S2（+分段巷网）→ S5（+进路/深孔/崩落带）
  assert.ok(tri(np, 2) > tri(np, 1), "切割阶段应出现分段巷道网");
  assert.ok(tri(np, 5) > tri(np, 2), "末阶段应含进路/深孔/崩落岩");
});
