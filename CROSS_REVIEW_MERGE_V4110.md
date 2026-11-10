# v4.11.1 合并交叉审查

后续已完成当前 deeprouter 主题的完整静态导出及浏览器验证，最新结果见 [EXPORT_VALIDATION_V4110.md](EXPORT_VALIDATION_V4110.md)。本文件下方的“未重跑”描述对应最初交叉审查阶段。

审查日期：2026-11-10（Asia/Singapore）
审查对象：`c07bcc02`，fork 父提交 `9337a1c3`，上游父提交 `63bb6e77`。
依据：`REVIEW_MERGE_V4110.md`，对照 `REVIEW_UPSTREAM_MERGE.md`、当前代码和双亲差异。

结论：发现 **2 个 P2 功能问题**，均在本轮采纳的搜索界面；另有 3 处验证文档需要校正。现有 585 个通过的测试不能覆盖这两个问题。没有修改产品代码，也没有执行提交、推送或部署。

## 功能发现（按优先级）

### [P2] 新搜索输入仍进入服务端路由，不兼容 fork 的静态部署

位置：`themes/fuwari/components/SearchInput.js:29`、`themes/xuhome/components/SearchInput.js:16`。

两个输入框按 Enter 后分别执行：

```text
fuwari: /search/needle
xuhome: { pathname: '/search/[keyword]', query: { keyword: 'needle' } }
```

但 `pages/search/[keyword]/index.js:59` 的 `getStaticPaths()` 返回 `{ paths: [], fallback: 'blocking' }`，没有导出任意关键词页所需的 HTML/Next 数据，也没有在静态站点上执行按需生成的 Next 服务端。已安装的 Next 导出实现也明确拒绝纳入导出映射的 fallback 页面（`node_modules/next/dist/export/index.js`，`SSG_FALLBACK_EXPORT_ERROR`）。

因此，单独将 xuhome 的 modal import 换成 PageFind，并不代表它的搜索输入已完成适配。即使通过导出配置排除动态搜索页，让整个 export 通过，这些输入的搜索目的页仍不可用；若未排除，也可能在 export 阶段遇到 fallback 限制。本次没有运行完整 export，未把后一种情况当作已复现的构建失败。

建议：让两个输入都进入实际的 PageFind 查询流程，并把 xuhome 导航中的可见搜索入口接到该流程。不要只替换 modal 的 import。`/search?s=...` 可作基于现有摘要数据的客户端检索替代，但它不等价于 PageFind 全文搜索。

归因：动态搜索路由在合并前已存在；本轮新增的 xuhome 与 fuwari 输入组件继续调用它，新增界面没有遵守静态部署 / PageFind 基线。

### [P2] Fuwari 搜索分页丢失真实总数

位置：`themes/fuwari/index.js:234`。

服务端搜索在切片前计算 `props.postCount`，再按 `POSTS_PER_PAGE` 截取 `props.posts`。新的 `LayoutSearch` 却传入 `postCount={posts.length}`。

实证输入：`postCount=25`、`posts.length=12`、`POSTS_PER_PAGE=12`。真实 `LayoutSearch` 生成的 Pagination props 中 `postCount=12`；调用真实 Pagination 得到 `null`。因此，即使在支持服务端搜索的 Next 部署中，读者也看不到第 2、3 页入口。

建议：分页总数使用 `props.postCount`（缺失时再回退至数组长度），并覆盖超过一页的搜索结果。若按上一项改成 PageFind，应由 PageFind 结果总数驱动其分页。静态 `/search?s=...` 的分页还需保留查询参数，不能直接套用路径式分页。

归因：这是采纳的上游 `LayoutSearch` 实现问题，不是手工冲突块本身造成的问题。

## 文档校正

1. **PWA 引用链并非全部惰性。** `pages/_app.js:22,124` 静态导入并始终挂载 `PWAInstaller`。最小探针确认，关闭 PWA 时仍调用一次 `serviceWorker.getRegistration('/sw.js')`，可能继续执行 unregister；打开配置时会 register。`SiteDataApi` 也仍调用 `writePwaManifest`，后者受配置门控。当前默认 false 可以说明“不主动注册”，不能说明“相关代码没有执行”。SEO manifest 块的删除确实消除了原先的未定义变量，但没有彻底落实拒绝 PWA 的代码边界。
2. **CI / Docker 不是 Node 26。** `.nvmrc` 为 `22`；`.github/workflows/ci.yml` 使用该文件；`Dockerfile:4` 为 `node:22-alpine`。本次本地运行实测为 Node `v26.13.0`。应将 §5 的“本地/CI 用 Node 26”改为“本地 Node 26，仓库 CI 与 Docker Node 22”。`engines.node >=22` 与两者兼容，但本地测试不能替代 Node 22 的 CI 验证。
3. **不能称性能“全面 ≤ 原基线”。** 文档自己的 TBT 是 `306ms` 对 `205ms`，增加 `101ms`，约 `49%`；FCP/LCP 有改善，perf 分数持平。建议改为“总分持平、FCP/LCP 改善、TBT 仍高于 Next 14 基线”。本轮没有重跑 Lighthouse，也没有新的 profile，未独立验证 TBT 差额必然来自框架执行的因果归属。

## 六个隐藏问题的复核

| 问题 | 交叉审查结果 |
| --- | --- |
| SEO `pwaEnabled` 残留 | 未再找到该未定义变量的 render 路径；SEO 测试通过。但 PWAInstaller 仍挂载，见上面的文档校正。 |
| manifest 导入已删主题 | 语法检查通过，8 个保留主题 config import；deeprouter 不在面板中的情况没有被本次合并改变。相关主题配置测试通过，未实测面板 UI。 |
| proxio 游离文件 | 跟踪文件中未发现任何已删主题目录残留，包括 proxio 与 hexo。 |
| xuhome Algolia 引用 | 原模块引用已清零；PageFind modal 路径存在。不过实际搜索输入仍有上述功能问题。 |
| SEO mock 传染 | mock 只替换配置和环境依赖，没有 mock `generateStructuredData`；现有测试直接检查真实 `@graph` 的实体、文章分类和面包屑。修改断言域名与基础配置一致，没有发现通过 mock 绕过核心逻辑。 |
| deeprouter 锁异步化 | 真实调用链是异步函数，现有各主题异步拒绝测试全部通过。同步回退当前没有生产调用来源。未实测真实加密文章浏览器流程。 |

## 对五个开放问题的回答

1. **Comment / fuwari / 首页安全过滤与 fork 是否冲突？** 在本次检查范围内，没有发现这四处选用上游逻辑与 fork 基线的直接冲突。评论组件和 fuwari 共用 `hasEnabledComments`，fuwari 另检查 lock / Hide；侧栏逻辑独立读取页面属性；首页保留预览条数、并发及有效载荷精简，并在适配后过滤公开块。对应测试通过。fuwari 新搜索布局存在的独立问题已列为发现。
2. **同步回退是否有真实调用点？** 当前生产文章路由来自 `pages/[prefix]/index.js` 的 async wrapper，底层 `hooks/useProtectedPost.js` 也是 async。多级 slug 路由复用该文章组件。同步分支属于兼容路径；本次未发现其导致当前运行故障。若继续保留，建议与共享锁组件统一使用 `await` / pending 防重入模式。当前底层 hook 已把正常网络失败转成 false，不能仅因 deeprouter 没有 catch 就断言现有网络错误必然产生未处理 rejection。
3. **是否应该采纳 PWA / vercount？** 根据文档给定的主动定制基线，继续拒绝是合理的审查前提；用户的新偏好不能由 reviewer 代定。若拒绝指完全排除运行代码，PWAInstaller 的残留应另行处理。
4. **放宽 engines 会不会改变 CI / 镜像版本？** 不会自动改变：CI 使用 `.nvmrc` 的 22，Docker 使用 22。放宽只是允许本地 26 安装，不证明所有未来 Node 版本兼容；当前环境没有完成 Node 22 下的新一轮安装或构建。
5. **export 与加密文章验证是否应该先完成？** 对实际 Cloudflare Pages 部署，完整 export 应作为部署前检查，尤其本轮发现了静态搜索不兼容。加密文章需按两种目标分别验：静态产物不含正文且显示“无法解锁”的明确提示；若支持 Next 服务端部署，再验错密、正确密码、限流/网络失败。重要行为变化是 `resolvePostProps` 在 EXPORT=true 时始终设置锁页，正确密码也不会导出正文；静态 Pages 上不能用浏览器密码框恢复正文。只在 dev 中验证异步解锁不能证明静态部署中的加密文章可用。推送一个尚未部署的评审分支与允许生产部署是不同决策；这里只提出部署门槛，未执行任何推送。

## 本轮实际验证与边界

- 完整 Jest：`npx --no-install jest --silent --runInBand --json --outputFile=C:/Users/moreo/AppData/Local/Temp/notionnext-review-jest.json`。结果：**87 passed suites / 585 passed tests，1 skipped suite / 1 skipped test**，运行报告耗时 61.61s。
- 冲突标记、已删主题跟踪文件、Algolia 模块引用：全部为空；manifest `node -c` 通过，主题 config import 数量为 8。
- `git diff --check HEAD^1 HEAD` 通过。
- 临时探针：`node C:/Users/moreo/AppData/Local/Temp/notionnext-review-probes.cjs`。直接转译和调用当前组件函数，使用 router/config/React hook 的轻量替身；分页判定调用真实 Pagination。验证结果为：`postCount=12`、Pagination 为 null、两种输入进入动态搜索路径，以及禁用 PWA 后仍发生 registration 查询。该探针是组件逻辑验证，不是浏览器端到端测试。
- 未重跑 Next build、完整 export、浏览器、Lighthouse，也未把原文档里的这些历史结果当作本次重新验证的结果。
- 没有尝试还原 129 项原始冲突现场；冲突数量与机械删除分组属于原作者记录，本轮检查的是最终代码、双亲差异和行为证据。
- 本轮只新增此审查文档。原有两个 review 文件及其他未跟踪文件保持原样。
