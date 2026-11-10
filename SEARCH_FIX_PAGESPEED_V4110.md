# deeprouter 搜索修复与 PageSpeed 检查

日期：2026-11-10（Asia/Singapore）。范围：当前使用的 deeprouter 两个搜索问题，以及待更新版本的性能变化。未推送或部署。

**结论：两个搜索问题已修复并通过静态站点浏览器验证。完整更新在本地移动端三轮对照中有小幅回落：首页中位数 98 → 97，文章 97 → 95。线上文章现有的 PSI 77 分属于尚未更新的旧站，不能归因于此次本地更新。**

## 修复

- `themes/deeprouter/index.js`：动态弹窗挂上 ref 时通知父组件就绪；保留打开请求，待就绪后执行。首次点击不会再丢失，关闭后再次点击也会重新打开。保留按需加载，不把 PageFind 提前加入首屏请求。
- `themes/deeprouter/components/SearchBox.js`：独立搜索页提交时将去除首尾空白的关键词交给主题的 PageFind 打开方法，取消跳转 `/search/<keyword>`。
- `components/PageFindSearchModal.js`：兼容原有无参 `openSearch()`；新增可选初始关键词，支持预填并立即全文搜索。

新增测试位于 `__tests__/themes/deeprouter/search.test.js` 和 `__tests__/components/PageFindSearchModal.test.js`。修复前两项回归测试实跑失败：延迟挂载 ref 后打开方法调用次数仍为 0；独立搜索提交仍调用 router.push。修复后这两项和真实弹窗的初始关键词测试全部通过。

验证结果：

| 检查 | 结果 |
| --- | --- |
| 全量 Jest | **89 套件 / 588 项通过**；另 1 套件 / 1 项跳过。 |
| Lint | 退出码 0，0 errors / 44 warnings。 |
| 完整 `npm run export` | 退出码 0，Next 15.5.28，265/265 静态生成任务完成；PageFind 索引 261 页 / 49,363 词；收尾脚本成功。 |
| 产物检查 | 本地脚本/样式引用无缺失，136 个正文页均有 blockMap；没有非脱敏密码字段。当前站点无加密文章可作真实浏览器测试。 |
| 浏览器：鼠标入口 | 首页首次点击打开；Escape 关闭后，鼠标再次点击可打开。 |
| 浏览器：独立搜索 | `/search` 提交 `KixDNS` 后仍留在 `/search`，弹窗预填关键词并显示 62 条索引结果，不再请求未导出的动态搜索路径。 |
| 浏览器：结果跳转 | 点击对应结果成功打开 KixDNS 全文；所测流程无 JavaScript error。 |

搜索修复截图：

![PageFind 搜索修复验证](E:/Github/NotionNext/.perf/update-validation-20261110/search-fixed.jpg)

## 线上 PageSpeed Insights

实测页面为 `https://deeprouter.org/` 与 `/article/kixdns-bypass-gateway-dns-guide`。PSI 网页端成功生成报告；直接 API 调用返回每日配额用尽，未把配额错误当作测量结果。

| 当前线上页面 | 移动端性能 | 桌面端性能 | 移动端 FCP / LCP / TBT / CLS |
| --- | ---: | ---: | --- |
| [首页报告](https://pagespeed.web.dev/analysis/https-deeprouter-org/zgodo3gilq?form_factor=mobile) | **95** | **100** | 1.8s / 1.8s / 140ms / 0 |
| [KixDNS 文章报告](https://pagespeed.web.dev/analysis/https-deeprouter-org-article-kixdns-bypass-gateway-dns-guide/3w21jxmuzp?form_factor=mobile) | **77** | **99** | 2.0s / 4.4s / 200ms / 0 |

首页报告约在 17:01、文章报告约在 17:04 生成。PSI 使用 Lighthouse 13.6.0 / HeadlessChromium 157.0.8103.38。两个页面的无障碍 / 最佳做法 / SEO 分别为 91 / 96 / 100。

文章移动端 LCP 分解显示，LCP 元素是开头的大段 `.notion-text` 正文，元素渲染延迟约 2,540ms；该分解是报告底层追踪中的数据，不应与模拟后的 4.4s LCP 简单相加。报告的真实用户数据区显示 LCP 2.8s、INP 66ms、CLS 0、TTFB 2.1s，来自过去 28 天，不能作为刚改代码的即时效果。[PSI 官方数据说明](https://developers.google.com/speed/docs/insights/v5/about)

**这次没有部署新版。上述线上分数描述旧站，既不能证明新版已经降到 77，也不能证明部署后会保持原分数。**

## 同条件更新前后对照

为检查本轮待推送的全部更新，而不只比较最后一次合并，使用了：

- 更新前：`origin/main` 的 `2b969662`，独立 worktree 按其原始 yarn.lock 安装，实际 Next **14.2.35** / react-notion-x **7.10.0**。
- 更新后：`c07bcc02` 加当前搜索修复，Next **15.5.28** / react-notion-x **7.12.1**。
- 两边均完整静态导出，以相同 Python gzip 静态服务器提供首页和同一篇 KixDNS 文章，不依赖 Next 服务端。
- 同一台电脑、Node 26.13.0、Lighthouse **13.6.0**、Chrome **157.0.8103.39**，移动端默认模拟节流；每个页面、每个版本各跑 **3 次**，交替顺序，取中位数。共 12 次审计，均无 runWarnings。
- 确认对照文章两版均为 90 个块，SSR Notion 正文文本长度均为 4,938 字符，避免用空正文换取高分。
- 线上与本地更新前版本的 framework / main chunk 文件名一致；线上 `_app` hash 不同，因此这里是明确 Git 基线的对照，不声称完整复刻了线上环境。

| 移动端指标（中位数） | 首页更新前 | 首页更新后 | 文章更新前 | 文章更新后 |
| --- | ---: | ---: | ---: | ---: |
| 性能分 | **98** | **97** | **97** | **95** |
| FCP / LCP | 1,837ms | 1,985ms | 1,991ms | 2,130ms |
| TBT | 29.5ms | 65.5ms | 117.5ms | 165ms |
| CLS | 0 | 0 | 0 | 0 |
| JS 传输量 | 171,124 B | 187,573 B | 229,464 B | 229,845 B |
| woff2 请求 | 0 | 0 | 0 | 0 |
| 首屏 PageFind 请求 | 0 | 0 | 0 | 0 |

原始分数：首页更新前 `98 / 98 / 98`，更新后 `97 / 98 / 97`；文章更新前 `97 / 97 / 96`，更新后 `95 / 95 / 94`。

观察到的成本：首页 LCP 约增加 148ms、TBT 增加 36ms；文章 LCP 增加 139ms、TBT 增加约 48ms。首页 JS 传输增加约 16.1KiB。脚本执行时间中位数分别从约 325ms → 388ms、514ms → 597ms，与更高 TBT 一致。

这是小幅性能回落的证据，没有重现之前大体积 CJK 字体或 CLS 回归。变化覆盖框架、依赖和应用代码的整批更新；未逐提交二分，不能断言全部差额来自某一个包。搜索修复没有引入首屏 PageFind 请求。

**这些是本地同条件 Lighthouse 分数，不是新版线上 PSI 分数。** 网络/CDN、服务器、缓存和 PSI 测试地点不同，不能把本地的 97/95 直接预测为部署后的 PSI 结果；新版公开部署后才可得到对应的真实 PSI 报告。

## 证据与范围

原始报告与重跑脚本在 `.perf/update-validation-20261110/`（被 Git 忽略）：

- `summary.json`、`runs.json`：三轮中位数与 12 次逐次指标。
- `before-*.report.json/html`、`after-*.report.json/html`：完整 Lighthouse 报告。
- `diagnostics.json`：脚本执行与首屏 PageFind 请求统计。
- `psi-observations.json`：从 PSI 网页观察并记录的线上指标和报告链接。
- `run-comparison.cjs`：同条件对照脚本；需要对应的两个本地静态服务器。
- `baseline-site/`、`serve-export.py`、`comparison-context.json`：保留的旧版静态产物、同条件服务器与版本/运行环境记录。临时对照 worktree 及其依赖已清理；两台临时服务器已停止。
- `search-fixed.jpg`：浏览器截图。

本轮没有处理可选主题 fuwari/xuhome 的问题，也没有处理已有 `/archive` 双 canonical。后者仍使原先的“所有页面 canonical 唯一”附加检查失败，不影响 export 退出码；详见前一份导出验证报告。

就本轮两个实际搜索故障和完整静态导出而言，原阻塞已解除；性能上应接受并记录上述小幅成本，不能写成“完全没有回归”。当前修改尚未提交或推送。
