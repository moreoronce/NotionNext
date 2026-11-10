# Cross Review: Upstream Merge v4.10.9 → v4.11.1

> **用途**:交由第二双眼睛(GPT / 他人)做交叉审查。上一轮合并的审查文档见 `REVIEW_UPSTREAM_MERGE.md`(v4.10.3..v4.10.8)。
>
> **Repository**: `moreoronce/NotionNext`(tangly1024/NotionNext 的深度定制 fork,自研 deeprouter 主题)
> **Merge commit**: `c07bcc02`
> **Base(fork 侧)**: `9337a1c3`(backup 分支:`backup-main-pre-merge-20261110`)
> **Upstream 侧**: `63bb6e77`(v4.11.1,notionnext-org/NotionNext)
> **规模**: 272 个上游提交 / 337 文件变更 / +19361 −2834 / 129 个冲突

---

## 0. Fork 定制基线(审查前提)

fork 相对上游有五类主动定制,合并时**全部需要存活**,这是判断每个冲突解法对错的基准:

| # | 定制 | 体现 |
|---|------|------|
| 1 | **主题精简**:19 个上游主题已删(heo/hexo/magzine/proxio/commerce/...),保留 claude/deeprouter(自研)/endspace/fuwari/medium/opc/thoughtlite/typography + 本次新增 xuhome | `themes/` 目录 |
| 2 | **搜索**:Algolia 全删,纯 PageFind(`components/PageFindSearchModal`) | `614fcd67` |
| 3 | **认证**:Clerk/OAuth/auth 页面全删 | `2634daa9` |
| 4 | **性能**:fontawesome 4KB 子集、无 next/font CJK 字体(Next 15 会自托管 1.15MB Noto Sans SC)、异步 CSS 字体加载、SEO `@graph` 结构化数据、页面有效载荷精简 | `f5e22784`/`00918f00`/`9337a1c3` |
| 5 | **基础设施**:自建 Notion API 代理 `API_BASE_URL=yawata.notion.site`、静态导出部署 Cloudflare Pages、i18n 只留 zh/en、Node 26 本地环境 | `blog.config.js` |

---

## 1. 冲突全景(129 个)与处理

### 1.1 modify/delete × 114 —— 全部保持 fork 删除

- **102 个已删主题文件**:上游改了它们,fork 保持删除。机械处理。
- **12 个非主题** = 三组 fork 主动删除 vs 上游修改,全部保持删除:
  - `components/AlgoliaSearchModal.js` + `lib/plugins/algolia.js`(上游修了 Algolia 生命周期 `87ac4513`,与 fork 无关)
  - `pages/auth/*`、`pages/dashboard/*`、`pages/api/auth/callback/notion.ts`(上游 OAuth 服务端流程 `6d52061e`,fork 不用 OAuth)
  - `lib/lang/{fr-FR,ja-JP,tr-TR,zh-HK,zh-TW}.js`(上游改了翻译,fork 只留部分语言)
  - `.github/workflows/pushUrl.yml`(fork 多次删除过)

> ⚠️ **审查点 1**:确认 fork 站点确实没有依赖 OAuth 仪表盘 / 多语言路由(如 `/ja-JP/...`)的存量链接。

### 1.2 content 冲突 × 15 —— 逐个决策表

| 文件 | 决策 | 理由 |
|------|------|------|
| `package.json` | 取上游版本号 + Next 15.5.28;保留 fork 的 `pagefind`/`patch-package`;**`engines.node` 改为 `>=22`**(上游 `>=22 <25`,fork 本地 Node 26) | 见审查点 2 |
| `blog.config.js` | 保留 fork 的 `API_BASE_URL`(自建代理);采纳上游 `ENABLE_RSS`/`RSS_FULL_CONTENT`/`INNER_PAGE_URL_PARENT_PATH` | RSS fork 本来就在用(footer/sitemap/llms.txt 引用)但无开关 |
| `components/SEO.js` | 保留 fork:`@graph`、异步 CSS 字体、`getCanonicalUrl`(9337a1c3 的修复);采纳上游:RSS 自动发现 `<link rel=alternate type=application/rss+xml>`(变量名从上游的 `LINK/SUB_PATH` 适配为 fork 的 `link/subPath`);**删除**自动并入的 PWA manifest 块(`pwaEnabled` 未定义,见 §3.1) | fork 未启用 PWA |
| `components/Comment.js` | 采纳上游 `isCommentProviderEnabled()` 统一门控 + Artalk/Waline/Valine provider;**手工补回** fork 精简版丢失的:顶部 3 个 `siteConfig` 读取 + 底部 3 个 `dynamic()` 定义(Artalk/WalineComponent/ValineComponent) | 未配置的 provider 渲染为空,fork 哲学兼容 |
| `components/ExternalPlugins.js` | **整体取 fork(`--ours`)** | fork 精简哲学;上游新增的 vercount/PWA 加载器不进 bundle |
| `conf/analytics.config.js` | 取 fork 精简版,仅采纳上游的 issue URL 更新(`tangly1024` → `notionnext-org`) | busuanzi/vercount/baidu/cnzz 全部不进 fork |
| `conf/font.config.js` | 取上游 `FONT_URL: ''`(空字符串),fork 原为空数组——语义等价,且上游配套 SEO.js 逻辑按此写 | 上游 `12b23ed3` 与 fork 的字体精简方向趋同 |
| `jest.config.js` | 两侧都取:fork 的 `@theme-components` 映射 + 上游的 `lodash.throttle` 映射(指向仓库内置轻量实现) | |
| `pages/404.js` | 取 fork(fork 的 deeprouter 有效载荷精简是上游 `delete props.allPages` 的超集) | |
| `pages/index.js` | **取上游** `getPublicPostBlockMap(post, blockMap, props.allPages)` | 安全修复(密码/隐藏页块过滤),import 已自动并入 |
| `pages/search/index.js` | 取 fork 的 `cleanSearchPost`(搜索页载荷精简) | |
| `styles/notion.css` | 取上游(callout 修复,fork 无定制) | |
| `themes/fuwari/index.js` | 两处都取上游:`showSidePanel` 按页隐藏侧栏(#4500)、`shouldShowFuwariComments`(处理 lock 态,#4557);fork 侧的 `isCommentServiceConfigured` 引用在合并后**未被导入**,取上游是唯一可编译解 | |
| `__tests__/components/SEO.test.js` | 合并双方 import(fork 的命名导出 + 上游的 render/mock 体系);新增模块级 `beforeEach` 安装基础 mock;fork 旧断言的 `test.com` 域名改为 mock 的 `example.com` | 见 §3.5 |
| `yarn.lock` | 取上游 + `yarn install` 重解析 | |

---

## 2. 上游功能取舍清单

### 采纳 ✅
- **安全类(重点验证)**:
  - 服务端密码验证 `63c21c2f` / 静态锁 `a2845930`(自动并入)
  - 公开块过滤 `getPublicPostBlockMap`(§1.2 pages/index.js)
  - workspace 隔离 `fdcd9e48`/`9dff7b5b`(只渲染本站 workspace 的 Notion 内容)
- **功能类**:RSS 摘要开关、RSS 自动发现、内嵌子页父路径 URL、fuwari 按页隐藏侧栏、xuhome 新主题(搜索已重定向 PageFind)、Notion 系统时间字段、`file.notion.com` 新图片 CDN 签名刷新 `d31a029e`、评论 provider 门控
- **依赖类**:Next 15.5.28、notion-client/react-notion-x/notion-utils 7.12.1、其余 dependabot

### 拒绝 ❌(保持 fork 现状)
- **PWA**(`c27b9954`):`PWA_ENABLE` 默认 false;SEO.js 的 manifest 块已删;`pages/pwa*` 等新文件虽并入但惰性
- **busuanzi/vercount 访客统计**(`ea70f619` 给 8 个主题 footer 加了隐藏 span):fork 的 ExternalPlugins 不加载 vercount 脚本 → span 永远 `hidden`,**零请求零渲染**,惰性无害
- **Algolia 生命周期修复**:fork 无 Algolia
- **OAuth 服务端流程**:fork 无认证页
- **Mailchimp/Newsletter 修复**:相关组件在已删主题

> ⚠️ **审查点 3**:惰性 busuanzi span(5 个保留主题 footer)建议后续顺手删掉,或加 `ANALYTICS_BUSUANZI_ENABLE` 门控——当前虽无害但是死代码。

---

## 3. 合并中抓到的 6 个隐藏问题(请交叉验证修复正确性)

这是本次 review 的**核心价值区**:这些都逃过了 git 的冲突检测,由测试/构建/浏览器分层抓出。

### 3.1 SEO.js 的 `pwaEnabled` 残留(jest 抓出)
上游在冲突区**之外**(render 中段)新增了 `{pwaEnabled && (<link rel=manifest .../>)}`,自动并入;而 `pwaEnabled` 定义在我删除的冲突块里 → `ReferenceError`。
**修复**:删除该 render 块。
**交叉验证点**:确认 fork 不需要 PWA,且 `components/PWA*`/`pages/manifest*` 等上游新文件在本仓库中的引用链全部惰性。

### 3.2 themeSwitch.manifest 引用 19 个已删主题(构建前发现)
`conf/themeSwitch.manifest.js`(上游主题切换面板配置)静态 import 全部 27 个主题的 `config.js` → webpack `Module not found`。
**修复**:脚本清扫——删 19 个主题(hexo 含在内)的 import / config 映射 / manifest 条目(−306 行)。
**交叉验证点**:`node -c conf/themeSwitch.manifest.js` + 面板功能对保留主题仍可用;fork 的 deeprouter 本就不在面板里(上游 manifest 无此条目,非本次丢失)。

### 3.3 proxio 游离新文件(构建抓出)
上游 #4559/#4567 给 proxio 新增了 `Catalog.js`/`MobileCatalog.js`——**新文件不在 DU 冲突集里**,静默并入已删主题 → webpack 懒加载扫描 `themes/.*` 时炸。
**修复**:`git rm`。同理排查了全部 19 个已删主题目录,仅此 2 个游离文件。
**交叉验证点**:`git ls-files themes/` 不应再有已删主题的文件。

### 3.4 xuhome 引用已删 AlgoliaSearchModal(构建抓出)
上游新主题 xuhome 的 index.js 用 `@/components/AlgoliaSearchModal`。
**修复**:按 fuwari 的先例重定向到 `@/components/PageFindSearchModal`(保留变量名以减少与上游 diff)。
**交叉验证点**:`git grep -l "components/AlgoliaSearchModal"` 应为空。

### 3.5 SEO 测试的 mock 传染(jest 抓出)
上游测试文件的 `jest.mock('@/lib/config')` 会拦截**所有** siteConfig;fork 的 `generateStructuredData` 直接调用测试在未安装 mock 实现时拿到 `undefined` → `.replace()` 崩。
**修复**:模块级 `beforeEach` 安装基础 mock;另将 fork 旧断言里写死的 `test.com` 改为 mock 提供的 `example.com`。
**交叉验证点**:确认这两个结构化数据测试仍在真实覆盖 fork 的 `@graph` 逻辑而非仅仅过 mock。

### 3.6 deeprouter 锁组件不符合上游异步契约(上游新测试抓出)
上游 `63c21c2f` 引入异步密码验证契约:提交后**不立即**显示错误,`validPassword()` Promise resolve `false` 后才显示。fork 的 deeprouter `ArticleLock.js` 把 Promise 当同步布尔判断(永远不显示错误),且用 `innerHTML` 直接操作 DOM。
**修复**:React 状态重写(`error`/`submitting`),同步/异步两种 `validPassword` 都兼容,保留暖色样式与自动聚焦。
**交叉验证点**:真实站点上加密文章的密码错误提示路径(此修复只被单测覆盖过,未在浏览器实测——见 §5 遗留)。

---

## 4. 验证矩阵

| 验证层 | 结果 |
|--------|------|
| jest | ✅ **87 套件 / 585 全绿**(合并前 235;上游 +350,删 7 个孤儿套件) |
| `next build`(BUILD_MODE, SSG) | ✅ Next 15.5.28 构建成功(全量预渲染) |
| 浏览器(生产 `next start`) | ✅ 首页 + 文章页:标题/CJK 正常、`@graph` 五实体齐全、canonical 唯一、RSS link 存在、0 运行时错误 |
| Lighthouse(文章页 mobile) | ✅ perf **83** / FCP-LCP **2.9s** / TBT **306ms** / CLS **0** / **woff2 = 0** |
| 性能基线对比 | 全面 ≤ 合并前 Next 14 基线(83 / 3.3s / 205ms),字体修复(零 woff2)存活 |

**Lighthouse 三代对比(文章页 mobile)**:

| 指标 | v4.10.8 前(N14) | 上次合并+修复 | **本次合并后** |
|------|------|------|------|
| perf | 83 | 76 | **83** |
| FCP/LCP | 3252ms | 3431ms | **2865ms** |
| TBT | 205ms | 551ms | **306ms** |
| CLS | 0 | 0 | **0** |
| woff2 | 0 | 0 | **0** |

---

## 5. 已知遗留(有意不做,需要 owner 拍板)

1. **静态导出全链路未实测**:fork 部署走 `yarn export`(`EXPORT=true` + pagefind + sitemap + finalize 脚本)。本次只验证了 SSG `next build` + `next start`。finalize 静态导出的单测过了,但**完整 export(约 15-20 分钟)未跑**。部署前建议跑一次 `yarn export` 并抽查 `out/`。
2. **加密文章未在浏览器实测**:§3.6 的锁组件重写只有单测覆盖。建议本地 dev 起服务,对一篇加密文章输错密码验证提示。
3. **TBT 306ms vs 合并前 205ms**:Next 15 框架层余量(framework chunk eval),非字体/配置问题,收益递减,暂不追。
4. **`engines.node >=22` 放宽**:上游 `<25` 是保守约束,fork 本地/CI 用 Node 26。若未来回归上游 CI 需注意。
5. **上游仓库已迁移** `notionnext-org/NotionNext`,本地 upstream remote 仍指 `tangly1024/NotionNext`(可拉但建议更新)。
6. **`public/sitemap.xml` 工作流怪癖**:export 的 postbuild 会生成它,之后非导出构建会报 public/pages 冲突,需手动删(本次又清了一次)。
7. **456 个提交未推送 origin**(含上次合并+本次),仅存本地,备份分支两个:`backup-main-pre-merge-20260806`、`backup-main-pre-merge-20261110`。
8. 删除了 `.github/workflows/sync.yaml`(指向旧仓库、GitHub 侧合并必败于冲突)。

---

## 6. Reviewer 快速复核命令

```bash
# 1) 无冲突标记残留
git grep -lE "^(<<<<<<<|>>>>>>>)" -- .   # 期望为空

# 2) 已删主题零残留
git ls-files themes/ | grep -E "heo|hexo|magzine|proxio|commerce|example|fukasawa|game|gitbook|landing|matery|movie|nav/|nobelium|photo|plog|simple|starter"   # 期望为空

# 3) Algolia 零引用
git grep -l "components/AlgoliaSearchModal\|lib/plugins/algolia" -- themes/ components/ lib/ pages/   # 期望为空

# 4) 测试与构建
npx jest --silent          # 87 suites / 585 tests
npx cross-env BUILD_MODE=true next build

# 5) 字体修复存活(生产服务后)
# 页面 HTML 中不应有任何 /_next/static/media/*.woff2 的 @font-face(Noto Sans SC)

# 6) manifest 清扫结果
node -c conf/themeSwitch.manifest.js
git grep -c "^import.*Config from '@/themes/" -- conf/themeSwitch.manifest.js   # 8 个保留主题的 import（deeprouter 为 fork 自研，本就不在上游 manifest）
```

---

## 7. 请 Reviewer 重点回答的 5 个问题

1. §1.2 中**取上游**的 4 处(Comment 门控 / fuwari 两处 / pages/index 安全过滤)是否与 fork 的其余定制存在语义冲突?
2. §3.6 deeprouter `ArticleLock` 重写——同步回退分支(`typeof result.then !== 'function'`)是否可能在真实调用点引发问题(上游所有主题的 `validPassword` 现在都是 Promise 吗)?
3. §2 拒绝清单里是否有你实际想要的功能(尤其 PWA、vercount 统计)?
4. `engines.node` 放宽到 `>=22` 是否会影响你的 CI/部署镜像(Node 版本)?
5. §5 遗留 1/2(全量 export + 加密文实测)是否应在推送/部署前完成?
