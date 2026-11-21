import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * 内容集合定义
 * 说明：articles / engineering 两个集合暂未启用——目录已建好，等正文按教材核对后再登记，
 * 现在登记会因目录为空而每次构建报警告。
 * 正文与元数据分离：JSON 存元数据（methods.json），Markdown 存正文。
 * 本文件只在第四轮接入正文时使用，页面渲染不依赖集合是否为空。
 */

const status = z.enum(["complete", "draft", "stub", "planned"]);

const methods = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/methods" }),
  schema: z.object({
    title: z.string(),
    status: status.default("stub"),
    updated: z.string().optional(),
    sourceLevel: z.string().optional(),
    tags: z.array(z.string()).default([]),
    terms: z.array(z.string()).default([]),
  }),
});

export const collections = { methods };
