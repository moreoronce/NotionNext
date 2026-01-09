/* eslint-disable react/no-unknown-property */
/**
 * DeepRouter 终端风格浅色主题样式
 */
const Style = () => {
  return (
    <style jsx global>{`
      /* ===== CSS变量 ===== */
      :root {
        --dr-bg: #F5F0E8;
        --dr-bg-card: #FFFFFF;
        --dr-border: #E8E4DC;
        --dr-border-hover: #D0CCC4;
        --dr-text: #1A1A1A;
        --dr-text-secondary: #4A4A4A;
        --dr-text-muted: #666666;
        --dr-keyword: #6B21A8;
        --dr-link: #a35a3a;
        --dr-link-hover: #7a3d28;
        --dr-purple: #9B59B6;
        --dr-red: #E74C3C;
        --dr-dot-red: #FF5F56;
        --dr-dot-yellow: #FFBD2E;
        --dr-dot-green: #27C93F;
        --dr-telegram: #0369a1;
        --dr-tag-bg: #a35a3a;
      }

      /* ===== 全局样式 ===== */
      #theme-deeprouter {
        background-color: var(--dr-bg);
        color: var(--dr-text);
        font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, 'Courier New', monospace;
        min-height: 100vh;
        font-size: 14px;
        line-height: 1.6;
      }

      /* 覆盖全局背景，移除蓝色光晕 */
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
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: box-shadow 0.2s ease, border-color 0.2s ease;
      }

      .terminal-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        border-color: var(--dr-border-hover);
      }

      .terminal-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: linear-gradient(180deg, #F8F8F8 0%, #F0F0F0 100%);
        border-bottom: 1px solid var(--dr-border);
      }



      .terminal-title {
        color: var(--dr-text-secondary);
        font-size: 12px;

      }

      .terminal-body {
        padding: 16px;
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

      /* ===== 文章内容 ===== */
      .article-content h1,
      .article-content h2,
      .article-content h3 {
        color: var(--dr-text);
        margin: 20px 0 12px;
        font-weight: 600;
      }

      .article-content h1 { font-size: 1.5rem; }
      .article-content h2 { font-size: 1.25rem; }
      .article-content h3 { font-size: 1.1rem; }

      .article-content p {
        margin: 12px 0;
        color: var(--dr-text-secondary);
      }

      .article-content ul,
      .article-content ol {
        padding-left: 20px;
        margin: 12px 0;
      }

      .article-content li {
        margin: 6px 0;
        color: var(--dr-text-secondary);
      }

      .article-content code {
        background: rgba(201, 122, 74, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.9em;
      }

      .article-content pre {
        background: #F5F5F5;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        border: 1px solid var(--dr-border);
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


