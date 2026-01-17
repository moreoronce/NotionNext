/* eslint-disable react/no-unknown-property */
/**
 * DeepRouter 终端风格浅色主题样式
 */
import { useEffect } from 'react'

const Style = () => {
  // 处理有序列表的 start 属性 - 修复 react-notion-x 的列表编号问题
  useEffect(() => {
    const updateListCounters = () => {
      // 获取所有有序列表
      const lists = Array.from(document.querySelectorAll('#theme-deeprouter .notion-list-numbered'))

      // 1. 第一步：读取所有 DOM 信息 (避免 Layout Thrashing)
      const listMetrics = lists.map(ol => {
        const rect = ol.getBoundingClientRect()
        const liCount = ol.querySelectorAll(':scope > li').length
        const originalStart = parseInt(ol.getAttribute('start') || '1', 10)
        return { ol, rect, liCount, originalStart }
      })

      // 按照 DOM 顺序处理，跟踪应该的起始序号
      let expectedStart = 1
      let lastListEndY = 0

      // 2. 第二步：计算并写入样式
      listMetrics.forEach((metric, index) => {
        const { ol, rect, liCount, originalStart } = metric

        // 判断是否是被打断的连续列表
        if (index > 0 && rect.top - lastListEndY < 200 && originalStart === 2 && expectedStart > 2) {
          ol.style.counterReset = `notion-ol-counter ${expectedStart - 1}`
        } else if (originalStart === 1) {
          expectedStart = 1
          ol.style.counterReset = `notion-ol-counter 0`
        } else {
          ol.style.counterReset = `notion-ol-counter ${originalStart - 1}`
          expectedStart = originalStart
        }

        expectedStart += liCount
        lastListEndY = rect.bottom
      })
    }

    // 延迟执行确保 DOM 完全渲染
    const timer = setTimeout(updateListCounters, 300)

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
      setTimeout(updateListCounters, 100)
    })
    const container = document.getElementById('theme-deeprouter')
    if (container) {
      observer.observe(container, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return (
    <style jsx global>{`
      /* ===== CSS变量 - Skillsmp 官方提取配色 ===== */
      :root {
        --dr-bg: #FFFFFF; /* 官方: #fff */
        --dr-bg-card: #FFFFFF;
        --dr-border: #E5E7EB; /* 接近官方风格的淡灰 */
        --dr-border-hover: #D1D5DB;
        --dr-text: #111827; /* 官方: #111827 */
        --dr-text-secondary: #4B5563;
        --dr-text-muted: #6B7280;
        
        /* 核心主色 */
        --dr-brand: #cc7a60; /* 官方: #cc7a60 暖红褐 */
        
        --dr-keyword: #cc7a60; /* 统一使用主色 */
        --dr-link: #cc7a60;
        --dr-link-hover: #b4654d; /* 加深一点用于悬停 */
        
        --dr-teal: #cc7a60; /* 替换掉原来的青色 */
        --dr-orange: #cc7a60; /* 替换掉原来的橙色 */
        
        --dr-dot-red: #EF4444; /* 调整为更现代的红 */
        --dr-dot-yellow: #F59E0B;
        --dr-dot-green: #10B981;
        --dr-telegram: #0369a1;
        --dr-tag-bg: #cc7a60;
        --dr-nav-bg: rgba(255, 255, 255, 0.9);
      }

      /* ===== 动画定义 ===== */
      @keyframes pulse-border {
        0%, 100% {
          border-color: #E5E7EB;
          box-shadow: 0 0 0 0 rgba(204, 122, 96, 0);
        }
        50% {
          border-color: rgba(204, 122, 96, 0.3);
          box-shadow: 0 0 6px 1px rgba(204, 122, 96, 0.1);
        }
      }

      @keyframes cursor-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }

      /* ===== 全局样式 ===== */
      #theme-deeprouter {
        background-color: var(--dr-bg);
        color: var(--dr-text);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 优先无衬线 */
        min-height: 100vh;
        font-size: 14px;
        line-height: 1.6;
        /* 移除点阵背景，还原干净纯白 */
        background-image: none;
      }

      /* Mono字体仅用于代码块 */
      code, pre, .font-mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }

      /* 全局背景 */
      html, body {
        background-color: var(--dr-bg) !important;
        background-image: none !important;
      }

      /* Screen reader only - 隐藏元素但对搜索引擎和屏幕阅读器可见 */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      #theme-deeprouter * {
        box-sizing: border-box;
      }

      /* ===== 终端窗口卡片 ===== */
      .terminal-card {
        background: var(--dr-bg-card);
        border: 1px solid var(--dr-border);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: all 0.3s ease;
      }

      .terminal-card:hover {
        box-shadow: 0 8px 24px rgba(234, 88, 12, 0.08);
        border-color: var(--dr-border-hover);
      }

      .terminal-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: linear-gradient(180deg, #F8F8F8 0%, #F2F2F2 100%);
        border-bottom: 1px solid var(--dr-border);
      }

      .terminal-title {
        color: var(--dr-text-secondary);
        font-size: 12px;
      }

      .terminal-body {
        padding: 16px;
        /* 包含中文等宽/无衬线字体的字体栈 */
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 
                     'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 
                     'Source Han Sans SC', monospace, sans-serif !important;
      }

      .terminal-body h1,
      .terminal-body h2,
      .terminal-body h3,
      .terminal-body p,
      .terminal-body span {
        font-family: inherit !important;
      }

      /* ===== 终端命令导航按钮 ===== */
      .nav-cmd-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: 1px solid #E5E5E5;
        border-radius: 8px;
        background: #FFFFFF;
        color: #4B5563;
        font-size: 13px;
        font-family: inherit;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .nav-cmd-btn:hover {
        background: rgba(204, 122, 96, 0.08); /* #cc7a60 极淡背景 */
        border-color: rgba(204, 122, 96, 0.4);
        color: #cc7a60;
      }

      .nav-cmd-btn:active {
        transform: scale(0.98);
      }

      .nav-cmd-btn .cmd-prefix {
        color: var(--dr-orange);
        font-weight: 500;
      }

      /* ===== 代码行号 ===== */
      .line-numbers {
        display: flex;
        flex-direction: column;
        color: var(--dr-text-muted);
        font-size: 13px;
        user-select: none;
        padding-right: 12px;
        border-right: 1px solid var(--dr-border);
        margin-right: 12px;
        text-align: right;
        min-width: 24px;
      }

      /* ===== 语法高亮 ===== */
      .code-keyword { color: var(--dr-keyword); font-weight: 500; }
      .code-string { color: var(--dr-link); }
      .code-comment { color: var(--dr-text-muted); }

      /* ===== 链接样式 ===== */
      #theme-deeprouter a {
        color: var(--dr-link);
        text-decoration: none;
        transition: color 0.2s ease;
      }

      #theme-deeprouter a:hover {
        color: var(--dr-link-hover);
      }

      /* 按钮式链接保持白色文字 */
      #theme-deeprouter a[class*="bg-"][class*="text-white"],
      #theme-deeprouter a[class*="bg-"][class*="text-white"]:hover {
        color: white !important;
      }

      /* ===== 标签徽章 ===== */
      .tag-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        background: var(--dr-tag-bg);
        border: none;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        transition: all 0.2s ease;
      }

      .tag-badge:hover {
        background: var(--dr-link-hover);
        transform: translateY(-1px);
      }

      /* ===== 分页组件 ===== */
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin-top: 32px;
        flex-wrap: wrap;
      }

      .pagination-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 36px;
        height: 36px;
        padding: 0 12px;
        border: 1px solid var(--dr-border);
        border-radius: 6px;
        background: var(--dr-card-bg);
        color: var(--dr-text-secondary);
        font-size: 14px;
        font-family: inherit;
        transition: all 0.2s ease;
      }

      .pagination-btn:hover {
        border-color: var(--dr-link);
        color: var(--dr-link);
        background: var(--dr-bg);
      }

      #theme-deeprouter .pagination-btn.active,
      #theme-deeprouter .pagination-btn.active:hover {
        background: var(--dr-link);
        border-color: var(--dr-link);
        color: white !important;
      }

      /* ===== 社交按钮容器 ===== */
      #theme-deeprouter .social-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* ===== Telegram 按钮 ===== */
      #theme-deeprouter .telegram-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: var(--dr-telegram);
        border: none;
        border-radius: 6px;
        color: white;
        font-family: inherit;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      #theme-deeprouter .telegram-btn:hover {
        background: #1E88BC;
        color: white;
      }

      /* ===== Twitter/X 按钮 ===== */
      #theme-deeprouter .twitter-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: #000000;
        border: none;
        border-radius: 6px;
        color: white;
        font-family: inherit;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      #theme-deeprouter .twitter-btn:hover {
        background: #333333;
        color: white;
      }

      /* 移动端社交按钮 - 仅图标时使用方形样式 */
      @media (max-width: 768px) {
        #theme-deeprouter .telegram-btn,
        #theme-deeprouter .twitter-btn {
          padding: 8px;
          border-radius: 8px;
        }
      }

      /* ===== 表格样式 ===== */
      .md-table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 13px;
      }

      .md-table th,
      .md-table td {
        padding: 10px 14px;
        border: 1px solid var(--dr-border);
        text-align: left;
      }

      .md-table th {
        background: rgba(201, 122, 74, 0.08);
        color: var(--dr-keyword);
        font-weight: 500;
      }

      /* ===== 分类网格 - 文件夹风格 ===== */
      .folder-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        background: var(--dr-bg-card);
        border: 1px solid var(--dr-border);
        border-radius: 8px;
        text-decoration: none;
        transition: all 0.2s ease;
        font-family: 'JetBrains Mono', Consolas, monospace;
      }

      .folder-card:hover {
        border-color: var(--dr-brand);
        box-shadow: 0 4px 12px rgba(204, 122, 96, 0.1);
      }

      .folder-icon {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .folder-name {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--dr-text);
        text-align: center;
        margin-bottom: 4px;
      }

      .folder-count {
        font-size: 0.75rem;
        color: var(--dr-brand);
      }

      /* ===== 文章内容 - 统一字体和颜色 ===== */
      .article-content,
      .article-content .notion-text,
      .article-content .notion-list,
      .article-content .notion-list li,
      .article-content .notion-callout,
      .article-content .notion-quote,
      .article-content .notion-toggle {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif !important;
        font-size: 1rem !important;
        line-height: 1.8 !important;
        letter-spacing: 0.01em;
        color: #111827 !important;
      }

      .article-content h1,
      .article-content h2,
      .article-content h3,
      .article-content .notion-h1,
      .article-content .notion-h2,
      .article-content .notion-h3 {
        color: #111827 !important;
        margin: 28px 0 16px;
        font-weight: 600;
        padding-left: 12px;
        border-left: 3px solid var(--dr-brand);
        scroll-margin-top: 100px;
      }

      /* 标题内的 span 容器 - 使用 inline-flex 重新排序子元素 */
      .article-content h1 > span,
      .article-content h2 > span,
      .article-content h3 > span,
      .article-content .notion-h1 > span,
      .article-content .notion-h2 > span,
      .article-content .notion-h3 > span {
        display: inline-flex !important;
        align-items: center;
        flex-direction: row;
      }

      /* 隐藏锚点 div */
      .article-content .notion-header-anchor {
        order: 0;
      }

      /* 锚点链接图标 - 移到最后 */
      .article-content .notion-hash-link {
        order: 2 !important;
        margin-left: 8px;
        opacity: 0.3;
        font-size: 0.8em;
      }

      /* 标题文本 */
      .article-content .notion-h-title {
        order: 1 !important;
      }

      .article-content h1:hover .notion-hash-link,
      .article-content h2:hover .notion-hash-link,
      .article-content h3:hover .notion-hash-link {
        opacity: 0.7;
      }

      .article-content h1, .article-content .notion-h1 { font-size: 1.5rem !important; }
      .article-content h2, .article-content .notion-h2 { font-size: 1.25rem !important; }
      .article-content h3, .article-content .notion-h3 { font-size: 1.1rem !important; border-left-width: 2px; }

      .article-content p,
      .article-content .notion-text {
        margin: 16px 0;
        color: #111827 !important;
      }

      .article-content a {
        color: var(--dr-brand);
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .article-content a:hover {
        color: var(--dr-link-hover);
      }

      .article-content ul,
      .article-content ol {
        padding-left: 24px;
        margin: 16px 0;
      }

      .article-content li {
        margin: 2px 0;
        color: var(--dr-text-secondary);
      }

      .article-content blockquote {
        margin: 20px 0;
        padding: 12px 16px;
        border-left: 4px solid var(--dr-brand);
        background: rgba(204, 122, 96, 0.05);
        color: var(--dr-text-secondary);
        font-style: italic;
      }

      .article-content code {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
        background: rgba(204, 122, 96, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.85em;
        color: var(--dr-brand);
      }

      .article-content pre {
        background: #1E1E1E;
        padding: 16px;
        border-radius: 8px;
        overflow-x: auto;
        border: none;
        margin: 20px 0;
      }

      .article-content pre code {
        background: transparent;
        color: #D4D4D4;
        padding: 0;
        font-size: 0.9em;
      }

      /* Notion 代码块样式覆盖 */
      .article-content .notion-code,
      .article-content .code-toolbar {
        position: relative;
        background: #1E1E1E !important;
        border-radius: 8px !important;
        border: none !important;
        box-shadow: none !important;
        margin: 20px 0 !important;
        overflow: hidden;
      }

      /* Prism 工具栏定位修复 */
      .code-toolbar > .toolbar {
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        opacity: 1 !important;
      }

      /* 工具栏按钮容器 - 移除背景 */
      .code-toolbar > .toolbar > .toolbar-item {
        background: transparent !important;
        border: none !important;
        margin-left: 4px !important;
      }

      /* 工具栏按钮本身 */
      .code-toolbar > .toolbar > .toolbar-item > button,
      .code-toolbar > .toolbar > .toolbar-item > a,
      .code-toolbar > .toolbar > .toolbar-item > span {
        background: rgba(60, 60, 60, 0.8) !important;
        color: #aaa !important;
        font-size: 12px !important;
        padding: 4px 10px !important;
        border-radius: 4px !important;
        border: none !important;
        cursor: pointer !important;
      }

      .code-toolbar > .toolbar > .toolbar-item > button:hover,
      .code-toolbar > .toolbar > .toolbar-item > a:hover,
      .code-toolbar > .toolbar > .toolbar-item > span:hover {
        color: #fff !important;
        background: rgba(80, 80, 80, 0.9) !important;
      }

      /* 代码块头部（显示语言名称） */
      .article-content .notion-code > div:first-child {
        background: #2D2D2D !important;
        border-bottom: 1px solid #333 !important;
        padding: 8px 12px !important;
        color: #888 !important;
        font-size: 12px !important;
        font-family: 'JetBrains Mono', Consolas, monospace !important;
      }

      /* 代码块头部按钮 */
      .article-content .notion-code button {
        color: #666 !important;
        background: transparent !important;
      }

      /* 图片骨架屏动画 */
      @keyframes skeleton-pulse {
        0% { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }

      /* Notion 图片容器 - 占位符 */
      .article-content .notion-asset-wrapper {
        position: relative;
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200px 100%;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
        border-radius: 8px;
        min-height: 200px;
        overflow: hidden;
      }

      /* 图片加载完成后隐藏骨架屏效果 */
      .article-content .notion-asset-wrapper:has(img[src]:not([src=""])) {
        background: transparent;
        animation: none;
        min-height: auto;
      }

      .article-content img {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin: 16px 0;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      /* 图片加载完成后显示 */
      .article-content img[src]:not([src=""]) {
        opacity: 1;
      }

      /* lazy-image-placeholder 类样式 */
      .lazy-image-placeholder {
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200px 100%;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }

      .article-content hr {
        border: none;
        border-top: 1px dashed var(--dr-border);
        margin: 32px 0;
      }

      .article-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 0.95em;
      }

      .article-content th,
      .article-content td {
        border: 1px solid var(--dr-border);
        padding: 10px 14px;
        text-align: left;
      }

      .article-content th {
        background: rgba(204, 122, 96, 0.08);
        font-weight: 600;
      }

      /* ===== Notion 列表间距覆盖 ===== */
      #theme-deeprouter .notion-list {
        margin-block-start: 0.2em;
        margin-block-end: 0.2em;
      }

      #theme-deeprouter .notion-list li {
        padding: 2px 0;
      }

      /* ===== 有序列表 - 使用 CSS 计数器正确处理 start 属性 ===== */
      #theme-deeprouter .notion-list-numbered {
        list-style-type: none !important;
        padding-inline-start: 1.6em !important;
        /* counter-reset 由 JavaScript 动态设置 */
      }

      #theme-deeprouter .notion-list-numbered > li {
        counter-increment: notion-ol-counter;
        position: relative;
      }

      #theme-deeprouter .notion-list-numbered > li::before {
        content: counter(notion-ol-counter) ". ";
        position: absolute;
        left: -1.6em;
        width: 1.4em;
        text-align: right;
        color: var(--dr-text);
      }

      /* ===== 面包屑 ===== */
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--dr-text-muted);
        padding: 12px 0;
      }

      .breadcrumb a {
        color: var(--dr-text-secondary);
      }

      .breadcrumb a:hover {
        color: var(--dr-link);
      }

      /* ===== 分页 ===== */
      .pagination {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin: 32px 0;
      }

      .pagination-btn {
        padding: 8px 16px;
        border: 1px solid var(--dr-border);
        border-radius: 6px;
        background: var(--dr-bg-card);
        color: var(--dr-text);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .pagination-btn:hover {
        border-color: var(--dr-link);
        color: var(--dr-link);
      }

      .pagination-btn.active {
        background: var(--dr-link);
        border-color: var(--dr-link);
        color: white;
      }

      /* ===== 分类文件夹 ===== */
      .folder-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background: var(--dr-bg-card);
        border: 1px solid var(--dr-border);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .folder-card:hover {
        border-color: var(--dr-link);
        transform: translateY(-2px);
      }

      .folder-icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      .folder-name {
        font-weight: 500;
        color: var(--dr-text);
      }

      .folder-count {
        color: var(--dr-link);
        font-size: 13px;
      }

      /* ===== 响应式 ===== */
      @media (max-width: 768px) {
        #theme-deeprouter {
          font-size: 13px;
        }

        .terminal-body {
          padding: 12px;
        }
      }
    `}</style>
  )
}

export { Style }



