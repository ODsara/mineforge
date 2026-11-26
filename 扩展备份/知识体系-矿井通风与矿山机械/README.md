# 知识体系扩展备份 —— 矿井通风与安全 / 矿山机械与运输

删除日期：2026-11-26（随站改版一并移出站点，留作后期扩展）

## 备份内容
- `taxonomy.json.备份原版`：删除前 `source/src/data/taxonomy.json` 的完整原样副本（唯一数据源，两板块的全部文字、主题链接、学习路径与工程专题互引都在里面）。
- `被删条目抽取.json`：从原版里抽出的增量清单——
  - `domains`：`ventilation-safety`（矿井通风与安全，order 4）与 `machinery-transport`（矿山机械与运输，order 5）两个完整条目；
  - `learningPathStepsReferencing`：第三步「联系工程系统」原来关联的 slug 列表；
  - `engineeringRelatedDomainsBefore`：ventilation / haulage / safety 三个工程专题 `relatedDomains` 的原值。
- `站点页面快照/`：删除时线上两页的渲染 HTML，供查阅版式与内容。

注意：工程技术版块的「矿井通风」「矿山运输」「安全」专题页未删除，仍保留在 `/engineering/` 下；两板块 topics 指向的正是这些页面，恢复时链接依旧有效。

## 恢复步骤（后期扩展时）
1. 从 `taxonomy.json.备份原版`（或 `被删条目抽取.json` 的 `domains`）把两个条目原样加回 `source/src/data/taxonomy.json` 的 `domains` 数组。
2. 把 `design-digital` 的 `order` 改回 6，其余 order 未动。
3. 恢复 `learningPath` 第三步的 `domains`：`["ventilation-safety","machinery-transport","design-digital"]`。
4. 恢复三个工程专题的 `relatedDomains`（见 `engineeringRelatedDomainsBefore`）。
5. `source/src/pages/knowledge/index.astro`：把「四个学科方向」改回「六个学科方向」，Hero description 补回「通风与安全、机械运输」。
6. 在 `source/` 下 `npm run build`，用 `dist` 覆盖上一级 `site/`，删除本次构建遗留的孤立 `_astro` 文件。

页面模板与路由（`pages/knowledge/[domain].astro`、导航、检索索引）全部数据驱动，恢复无需改任何组件代码。
