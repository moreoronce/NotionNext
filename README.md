# DeepRouter Blog

基于 [NotionNext](https://github.com/tangly1024/NotionNext) 的个人博客，使用 Notion 作为 CMS，静态导出部署在 [Cloudflare Pages](https://pages.cloudflare.com/) 上。

线上站点：[deeprouter.org](https://deeprouter.org)

## ✨ 主题特色

**DeepRouter** 是一个自定义的终端/代码风格主题，具有以下特点：

- 🎨 **暖色调设计** - 以 `#cc7a60` 为主色调的温暖配色
- 💻 **终端风格卡片** - PostCard 采用代码块样式展示文章
- 🔤 **等宽字体** - JetBrains Mono + 中文字体优化
- 📱 **响应式布局** - 适配桌面和移动端
- 🤖 **AI 引擎友好** - 生成 `/llms.txt`（供 ChatGPT / Perplexity / Claude 等推理时抓取），并在 `robots.txt` 中可分别放行 AI 搜索与 AI 训练爬虫
- ⚡ **首屏性能优化** - PageFind 搜索按需挂载，静态资源长缓存，CLS 修复

## 🚀 最新更新

### v4.10.2-deeprouter (2026-06-24)

#### AI 引擎友好（新增能力）
- ✅ **`/llms.txt` 生成** - 为 ChatGPT / Perplexity / Claude 等提供精简站点地图（`pages/llms.txt.js`、`lib/llms-utils.js`）
- ✅ **`robots.txt` AI 策略** - 区分「AI 搜索」与「AI 训练」两类爬虫，可单独开关（`lib/utils/robots.txt.js`）
- ✅ **Content-Signal 指令** - `robots.txt` 注入 Cloudflare 语义化许可声明（`search` / `ai-input` / `ai-train`），与 AI 开关联动
- ✅ **Markdown 内容协商** - build 时为每篇文章生成 `.md` 静态文件，配合反代 Worker 实现 `Accept: text/markdown` 内容协商，AI Agent 可直接拿 Markdown 而非 HTML（省 token、更快）（`lib/utils/markdown.js`、`pages/index.js`）
- ✅ **GEO 配置文件** - 新增 `conf/geo.config.js`，集中管理 llms.txt 与爬虫策略开关
- ✅ **Meta 地理标签** - `components/SEO.js` 注入 region/country/placename 标签
- ✅ **环境变量** - `.env.example` 新增 `NEXT_PUBLIC_LLMS_TXT_*`、`NEXT_PUBLIC_GEO_*`、`NOTION_INTEGRATION_TOKEN` 系列变量

> ℹ️ 说明：`llms.txt` 对 **Google AI Overviews 无效**（[Google 官方明确](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)），主要受益对象是 ChatGPT / Perplexity / Claude 等第三方 AI 引擎的「推理时抓取」。Google AI 搜索仍依赖核心搜索索引 + 基础 SEO。
>
> ⚙️ **Markdown 协商前置条件**：需在 Notion 建 Integration 并授权博客根页面，在 Cloudflare Pages 环境变量配置 `NOTION_INTEGRATION_TOKEN`，且反代 Worker 需实现 `Accept: text/markdown` 协商逻辑（参考仓库根目录的 Worker 配置）。

#### 性能优化（PSI / LCP）
- ✅ **PageFind 按需挂载** - 搜索弹窗改为点击 / `Ctrl+K` 后才加载，减少首屏 JS（`themes/deeprouter/index.js`、`components/PageFindSearchModal.js`）
- ✅ **数据 props 精简** - 搜索 / 归档页裁剪传给前端的数据字段，降低 hydration 成本（`lib/db/SiteDataApi.js`、`pages/search/*`、`pages/archive/index.js`）
- ✅ **CLS 布局偏移修复** - 页脚微信二维码图加 `aspect-ratio` 容器，避免图片加载位移（`themes/deeprouter/components/Footer.js`）
- ✅ **字体预连接按需化** - 仅在使用 Google Fonts 时才注入 preconnect（`components/SEO.js`）
- ✅ **Font Awesome 加载优化** - 按需注入，避免无条件阻塞（`pages/_document.js`）

#### 主题配置
- ✅ **Header / Footer / PostCard 重构** - deeprouter 主题组件样式与交互打磨（`themes/deeprouter/components/*`）

> 历史版本：v4.9.2-deeprouter (2026-01-12) - 代码块样式、列表行间距、标题锚点、目录导航、图片占位符、终端风格分类页、动态公告与版权年份。

## 📁 项目结构

```
themes/deeprouter/
├── index.js              # 主题入口，布局定义
├── style.js              # 全局样式 (CSS-in-JS)
├── components/
│   ├── Header.js         # 顶部导航
│   ├── Footer.js         # 页脚
│   ├── PostCard.js       # 文章卡片 (终端风格)
│   ├── CategoryGrid.js   # 分类网格
│   ├── TableOfContents.js # 文章目录
│   └── ...

conf/
├── geo.config.js         # GEO / AI 搜索优化配置（llms.txt、爬虫策略）

lib/
├── llms-utils.js         # /llms.txt 内容生成逻辑
└── utils/
    └── robots.txt.js     # robots.txt 生成（含 AI 爬虫策略）

pages/
├── index.js              # 首页（静态导出 + ISR）
├── llms.txt.js           # /llms.txt 路由
└── [prefix]/[slug]/      # 文章详情页
```

## ⚙️ 配置

### 环境变量

```env
# 必填
NOTION_PAGE_ID=你的Notion页面ID

# GEO / AI 搜索优化（可选，以下为默认值）
NEXT_PUBLIC_LLMS_TXT_ENABLED=true
NEXT_PUBLIC_LLMS_TXT_POST_LIMIT=80
NEXT_PUBLIC_GEO_AI_SEARCH_ENABLED=true
NEXT_PUBLIC_GEO_AI_TRAINING_ENABLED=true
NEXT_PUBLIC_GEO_REGION=CN

# Markdown 内容协商（可选，需 Notion Integration + 授权页面）
NOTION_INTEGRATION_TOKEN=ntn_你的Integration_Token
MARKDOWN_ENABLED=true
MARKDOWN_CONCURRENCY=3
```

完整变量见 `.env.example`。

### blog.config.js

```javascript
BLOG: {
  THEME: 'deeprouter',
  // ...
}
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 静态导出（部署到 Cloudflare Pages）
npm run build  # next.config.js 中已开启 output: 'export'
```

## 📦 部署

构建产物输出到 `out/`，部署到 **Cloudflare Pages**：

1. 在 Cloudflare Pages 创建项目，连接 GitHub 仓库
2. 构建命令：`npm run build`，输出目录：`out`
3. 推送到 GitHub 后自动触发部署

> 缓存策略可通过仓库根目录的 `public/_headers` 文件自定义（Cloudflare Pages 原生支持）。

## 🙏 致谢

- [NotionNext](https://github.com/tangly1024/NotionNext) - 原始项目
- [react-notion-x](https://github.com/NotionX/react-notion-x) - Notion 渲染
- [Tailwind CSS](https://tailwindcss.com) - 样式框架

<p align="center">
  <a href="https://x.com/moreoronce">
    <img src="https://img.shields.io/badge/X-Follow_@moreoronce-black?style=for-the-badge&logo=x&logoColor=white" height="40" alt="X @moreoronce">
  </a>
</p>

## 📄 License

MIT License
