// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  // 静态输出：比赛现场需可离线演示，因此不启用任何服务端适配器
  output: "static",
  // 正文用 MDX：图表、参数表、三维容器都是正文的一部分，需要在正文流里就地插入
  // 公式：remark-math 识别 $...$ 与 $$...$$，rehype-katex 在构建期渲染成静态 HTML（不向浏览器发 JS）
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { throwOnError: false, strict: "ignore" }]],
    }),
  ],
  devToolbar: { enabled: false },
  trailingSlash: "ignore",
  // 地下采矿方法方向不重复建站，直接指向方法库（静态输出下生成跳转页）
  redirects: {
    "/knowledge/underground-mining/": "/methods/",
  },
  build: {
    format: "directory",
    inlineStylesheets: "auto",
  },
  vite: {
    // 顶层 vite 与 astro 内嵌 vite 各带一份类型声明，tailwindcss 插件的 Plugin 类型
    // 在两者间不兼容（仅类型层，构建与运行不受影响）——此处显式断言消除 astro check 报错
    plugins: [/** @type {any} */ (tailwindcss())],
    build: {
      // three.js 是独立 chunk，只在有 GLB 的页面动态加载，超过默认 500KB 属预期
      chunkSizeWarningLimit: 1200,
    },
  },
});
