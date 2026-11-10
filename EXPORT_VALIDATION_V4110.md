# deeprouter 完整静态导出验证

后续已修复本文发现的两个搜索问题，并完成新的导出、浏览器和性能对照；最新状态见 [SEARCH_FIX_PAGESPEED_V4110.md](SEARCH_FIX_PAGESPEED_V4110.md)。下文保留修复前的验证记录。

日期：2026-11-10（Asia/Singapore）
对象：`c07bcc02`；实际主题 `deeprouter`；本地 Node `v26.13.0`。

**结论：完整导出通过，但当前 deeprouter 的搜索入口存在两个可复现问题，建议修复后再更新生产。** 这两个问题的相关实现与合并前 `9337a1c3` 相同，不应误归因为本轮上游合并新增。此前 fuwari / xuhome 的发现不是当前主题的上线阻塞依据。

本轮只做验证和记录，没有修改产品代码、提交、推送或部署。

## 实际执行结果

| 检查 | 结果 |
| --- | --- |
| 完整静态导出 | `npm run export`，退出码 **0**。执行仓库现有 export 脚本；当前 shell 无 Yarn，未更改依赖或锁文件。 |
| Next 构建 | Next **15.5.28**，生产编译及类型检查通过，**265/265** 静态生成任务完成。 |
| 导出收尾 | PageFind、next-sitemap、`finalize-static-export.js` 均执行完成。 |
| PageFind | **261 页 / 49,363 词 / 1 种语言**。有 1 个无 lang 属性页面被合并进主语言索引的提示，不影响退出码。 |
| 产物扫描 | `out/` 共 **261 个 HTML**；260 个含 `__NEXT_DATA__` 的页面均使用本轮 Build ID `axmYgC--t4bIrFmnSmhEY`，未混入旧构建。 |
| 实际主题 | 259 个页面明确配置为 `deeprouter`；另 1 个为不携带站点配置的 `/500` 错误页。 |
| 正文完整性 | **131 个 `/article/` 正文页 + 5 个其他正文页**，均有非空 blockMap；日志中 **0** 条正文降级记录、**0** 条预渲染错误。这不等同于逐篇人工校对内容。 |
| 静态资源 | HTML 引用的 `/_next/static/` 本地脚本与样式资源均存在。 |
| 必备产物 | 首页、404、search、archive、`llms.txt`、`sitemap.xml`、`rss/feed.xml`、`pagefind/pagefind.js` 均存在且非空。 |
| 密码数据 | 导出页面 props 中未发现非 `protected` 的非空 password 字段；**当前没有加密正文页**。 |
| 锁页专项测试 | 3 个套件 / **50 项通过**：postAccess、useProtectedPost、finalize-static-export。属于既有测试的专项复跑，不与上一轮 585 项相加。 |
| Lint | `npm run lint` 退出码 **0**；**0 errors / 44 warnings**。没有把文档之前的“6 warnings”当成本次结果。 |
| Git | 已跟踪源码没有变化，`git diff --check` 通过。 |

## 浏览器验证

直接用 Python 静态文件服务器托管新生成的 `out/`，监听 `127.0.0.1:4173`；支持无扩展名路径映射到相应 `.html`，没有 Next 服务端、API 或动态搜索回退。验证完成后已停止该临时服务器。

通过项：

- 首页使用 deeprouter，中文内容和文章卡片显示正常。
- 首页点击“下一页 →”可进入 `/page/2` 并显示第二页文章，没有运行时 error 日志。
- 用快捷键打开 PageFind，输入 `KixDNS`，显示 62 条搜索结果，第一项为对应文章。
- 点击第一项，成功打开已导出的 KixDNS 全文页；可见正文、目录、表格和代码块，不是摘要占位页。
- 文章页包含 RSS 自动发现链接；JSON-LD `@graph` 包含 Organization、Person、WebSite、BlogPosting、BreadcrumbList 五类实体。
- 所查首页、文章及分页流程没有捕获到 JavaScript error；有 Next runtime config 弃用提示。

**失败项一：[P2] 鼠标点击“全站搜索”无法打开弹窗。**

在首页点击导航入口后没有出现弹窗；刷新 KixDNS 文章页后再次点击，并等待搜索输入框可见 3 秒，仍得到 `openedByClick=false`，地址未变，也没有 JavaScript error。随后用 `Ctrl+K` 可以打开 PageFind，搜索和跳转正常。

相关位置：`themes/deeprouter/index.js:51–61,78`。父组件先设置动态挂载状态，再在 effect 中尝试访问 `searchModal.current`；动态子组件稍后挂好 ref 时不一定会重新触发该 effect。**这是与现象一致的时序原因，尚未通过修复对照测试最终确认根因。** 可以确认的是鼠标入口失败、快捷键路径成功，不能将“PageFind 索引生成成功”写成“顶部搜索入口完全可用”。

**失败项二：[P2] 独立 `/search` 页提交关键词后 404。**

在实际导出的 `/search` 页面输入 `KixDNS` 并点击 Search，浏览器进入 `/search/KixDNS`，返回文件不存在的 404；静态服务器同时记录该地址和 `/_next/data/<BuildID>/search/KixDNS.json` 的 404。

相关位置：`themes/deeprouter/components/SearchBox.js:15`。输入仍跳转 `/search/<keyword>`，对应 Next 动态搜索路由没有导出任意关键词页所需的文件；实际检查 `out/search/KixDNS.html` 和 `out/search/KixDNS/index.html` 均不存在。

建议将当前主题的鼠标入口与独立搜索页统一到已有 PageFind 流程，再复验首次打开、重复打开、Escape 关闭、全文查询和结果跳转。不要靠 Next 服务端来补救静态部署路径。

## 其他发现与边界

- `/archive` 原始 HTML 中有 **两个相同地址的 canonical**，分别来自公共 SEO 和 `_document` 中的 `ArchiveSeoHead`（`lib/archive-seo-links.js:70`）。这使本轮“所有页面 canonical 必须唯一”的附加扫描退出码为 **1**；它不是 export 命令失败，也不是密码过滤或资源缺失。相关实现与合并前一致，属于已有 SEO 重复问题，可单独处理。
- 无真实加密文章可供本轮浏览器实测。50 项专项测试覆盖静态导出即使收到正确密码也不导出正文等契约，但不能据此宣称已验证真实站点的加密文章。若今后使用加密文章，当前静态模式只显示“本文受密码保护，当前静态站点暂不支持解锁”。
- 未在 Node 22 上重装依赖或重跑构建；仓库 CI 和 Docker 仍使用 Node 22，本轮本地结果来自 Node 26。
- 未重跑 Lighthouse；未检查远端 Cloudflare 控制台的实际构建命令或环境变量，也未触发线上部署。
- export 生成了未跟踪文件 `public/llms.txt`，以及被忽略的 `.next/`、`out/` 等构建产物；它们不是本轮源码修改。审查文档、`quality-report.json`、`scratch_resolve.js` 原有未跟踪状态保持不变，不应使用 `git add .` 将临时文件一起提交。

## 本地证据

- 导出日志：`C:\Users\moreo\AppData\Local\Temp\notionnext-export-validation-20261110.log`
- 产物扫描：`C:\Users\moreo\AppData\Local\Temp\notionnext-export-artifact-validation-20261110.json`
- 扫描脚本：`C:\Users\moreo\AppData\Local\Temp\notionnext-validate-export.cjs`
- 锁页专项测试：`C:\Users\moreo\AppData\Local\Temp\notionnext-static-lock-validation-20261110.json`
- Lint 日志：`C:\Users\moreo\AppData\Local\Temp\notionnext-export-lint-20261110.log`

复跑完整导出可使用 `npm run export`（或环境提供 Yarn 时使用 `yarn export`）。它会重新生成本地产物，并访问 Notion 以拉取站点内容。
