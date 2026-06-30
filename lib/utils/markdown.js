import BLOG from '@/blog.config'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/lib/config'
import { normalizeSitemapBaseUrl } from '@/lib/sitemap-utils'
import { createLlmsTxt } from '@/lib/llms-utils'
import pLimit from 'p-limit'

/**
 * Markdown 文件生成器（用于 AI Agent 内容协商 / GEO 优化）
 *
 * 在 build 阶段为每篇已发布文章调用 Notion 官方 Markdown API，
 * 把返回的 enhanced markdown 写成 public/${slug}.md 静态文件。
 * 配合反代 Worker 的 Accept: text/markdown 协商，AI Agent 可直接
 * 拿到 Markdown 而非 HTML（省 token、更快）。
 *
 * 前置条件：
 *   1. 在 Notion 建 Integration，拿到 token，配置为环境变量
 *      NOTION_INTEGRATION_TOKEN（或 NOTION_TOKEN_V2 作为回退）
 *   2. 把博客根页面授权给该 Integration（Apply to all sub-pages）
 *
 * API 文档：https://developers.notion.com/reference/retrieve-page-markdown
 *   GET https://api.notion.com/v1/pages/{page_id}/markdown
 *   Headers: Authorization: Bearer <token>, Notion-Version: 2026-03-11
 */

const NOTION_MARKDOWN_API_VERSION = '2026-03-11'
const NOTION_API_BASE = 'https://api.notion.com/v1'

const decodeHtmlEntities = value =>
  String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

const normalizeMarkdownTableCell = value => {
  let cell = String(value || '')
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/<\/p>\s*<p[^>]*>/gi, '<br>')
    .replace(/^<p[^>]*>/i, '')
    .replace(/<\/p>$/i, '')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, content) => {
      const text = decodeHtmlEntities(content).replace(/`/g, '\\`').trim()
      return text ? `\`${text}\`` : ''
    })
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(
      /<a[^>]*href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi,
      (_, doubleHref, singleHref, bareHref, text) => {
        const href = doubleHref || singleHref || bareHref || ''
        const label = decodeHtmlEntities(text.replace(/<[^>]+>/g, '')).trim()
        return label && href ? `[${label}](${href})` : label
      }
    )
    .replace(/<[^>]+>/g, '')

  cell = decodeHtmlEntities(cell)
    .replace(/\r?\n+/g, '<br>')
    .replace(/\s+/g, ' ')
    .replace(/\s*<br>\s*/g, '<br>')
    .trim()

  return cell.replace(/\|/g, '\\|')
}

const normalizeMarkdownTable = tableHtml => {
  const rows = [...String(tableHtml || '').matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map(rowMatch =>
      [...rowMatch[1].matchAll(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi)].map(
        cellMatch => ({
          tag: cellMatch[1].toLowerCase(),
          value: normalizeMarkdownTableCell(cellMatch[2])
        })
      )
    )
    .filter(row => row.length > 0)

  if (rows.length === 0) return tableHtml

  const columnCount = Math.max(...rows.map(row => row.length))
  const normalizedRows = rows.map(row => {
    const values = row.map(cell => cell.value)
    while (values.length < columnCount) values.push('')
    return values
  })

  const hasHeader =
    /<table[^>]*header-row=(?:"true"|'true'|true)[^>]*>/i.test(tableHtml) ||
    rows[0].some(cell => cell.tag === 'th')
  const header = hasHeader
    ? normalizedRows[0]
    : Array.from({ length: columnCount }, (_, index) => `Column ${index + 1}`)
  const bodyRows = hasHeader ? normalizedRows.slice(1) : normalizedRows
  const separator = Array.from({ length: columnCount }, () => '---')

  return [header, separator, ...bodyRows]
    .map(row => `| ${row.join(' | ')} |`)
    .join('\n')
}

export const normalizeGeneratedMarkdown = markdown => {
  if (!markdown) return markdown

  return String(markdown)
    .split(/(```[\s\S]*?```)/g)
    .map(part => {
      if (part.startsWith('```')) return part
      return part.replace(/<table[\s\S]*?<\/table>/gi, normalizeMarkdownTable)
    })
    .join('')
}

// 复用 llms-utils 的公开内容页过滤逻辑
const isPublicContentPage = post => {
  if (!post?.slug || post.slug.startsWith('#')) return false
  if (post.password) return false
  return post.status === BLOG.NOTION_PROPERTY_NAME.status_publish
}

/**
 * 调用 Notion 官方 API 拿单篇文章的 Markdown
 * @param {string} pageId 文章的 Notion page id（32 位或带连字符）
 * @param {string} token Integration token
 * @returns {Promise<string|null>} Markdown 字符串；失败返回 null
 */
const fetchPageMarkdown = async (pageId, token) => {
  if (!pageId || !token) return null
  try {
    const res = await fetch(
      `${NOTION_API_BASE}/pages/${pageId}/markdown`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': NOTION_MARKDOWN_API_VERSION
        }
      }
    )
    if (!res.ok) {
      // 404 通常是该页面未授权给 integration；429 是速率限制
      // 这两种情况不抛错，记日志后跳过该篇
      if (res.status === 404) {
        console.warn(
          `[markdown] 跳过 ${pageId}：页面未授权给 Integration（404）`
        )
      } else if (res.status === 429) {
        console.warn(`[markdown] ${pageId} 触发速率限制（429），稍后重试`)
      } else {
        console.warn(`[markdown] ${pageId} 请求失败：HTTP ${res.status}`)
      }
      return null
    }
    const data = await res.json()
    const md = data?.markdown
    if (!md) return null
    if (data?.truncated) {
      console.warn(`[markdown] ${pageId} 内容被截断（truncated: true）`)
    }
    return md
  } catch (err) {
    console.warn(`[markdown] ${pageId} 抓取异常：`, err?.message || err)
    return null
  }
}

/**
 * 生成所有已发布文章的 .md 静态文件
 * 在 build/export 阶段由 pages/index.js 调用
 * @param {Object} props fetchGlobalAllData 返回的全站数据
 */
export async function generateMarkdownFiles(props) {
  const { allPages = [], NOTION_CONFIG = {} } = props || {}

  // 总开关（与 llms.txt 共用一套 GEO 配置）
  const enabled = siteConfig('MARKDOWN_ENABLED', true, NOTION_CONFIG)
  if (!enabled) return

  // Integration token：优先专用变量，回退到 token_v2
  const token =
    process.env.NOTION_INTEGRATION_TOKEN || process.env.NOTION_TOKEN_V2 || ''
  if (!token) {
    console.warn(
      '[markdown] 未配置 NOTION_INTEGRATION_TOKEN，跳过 Markdown 文件生成'
    )
    return
  }

  const baseUrl = normalizeSitemapBaseUrl(
    siteConfig('LINK', BLOG.LINK, NOTION_CONFIG)
  )
  if (!baseUrl) return

  // 过滤已发布的公开文章
  const posts = (allPages || []).filter(
    p => isPublicContentPage(p) && p.id && p.slug
  )
  if (posts.length === 0) return

  console.log(`[markdown] 开始为 ${posts.length} 篇文章生成 .md 文件`)

  // 并发控制：保守值 3，避免触发 Notion API 速率限制
  const limit = pLimit(
    Number(siteConfig('MARKDOWN_CONCURRENCY', 3, NOTION_CONFIG)) || 3
  )

  let success = 0
  let skipped = 0

  await Promise.all(
    posts.map(post =>
      limit(async () => {
        const md = normalizeGeneratedMarkdown(
          await fetchPageMarkdown(post.id, token)
        )
        if (!md) {
          skipped++
          return
        }

        // slug 可能含斜杠（如 'article/foo'），需要递归建目录
        // 文件路径与文章 URL 对应：URL /article/foo → public/article/foo.md
        const relPath = `${post.slug}.md`
        const absPath = path.join('./public', relPath)
        try {
          fs.mkdirSync(path.dirname(absPath), { recursive: true })
          fs.writeFileSync(absPath, md, 'utf-8')
          success++
        } catch (err) {
          // Vercel 运行时只读；build/export 阶段可写
          console.warn(`[markdown] 写入 ${relPath} 失败：`, err?.message || err)
          skipped++
        }
      })
    )
  )

  console.log(
    `[markdown] 完成：成功 ${success}，跳过 ${skipped}（共 ${posts.length}）`
  )

  // 生成首页 index.md：站点 Markdown 概览（复用 llms.txt 的内容）。
  // 关键：isitagentready 等工具用 GET / + Accept: text/markdown 判定站点是否支持
  // Markdown 协商，因此首页必须有对应的 .md，否则整站被判 fail。
  try {
    const homeMd = createLlmsTxt({
      allPages,
      siteInfo: props?.siteInfo,
      NOTION_CONFIG,
      locale: props?.locale || ''
    })
    if (homeMd) {
      fs.writeFileSync('./public/index.md', homeMd, 'utf-8')
      console.log('[markdown] 首页 index.md 已生成')
    }
  } catch (err) {
    console.warn('[markdown] 首页 index.md 生成失败：', err?.message || err)
  }
}
