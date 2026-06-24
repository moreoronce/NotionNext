import BLOG from '@/blog.config'
import { siteConfig } from './config'
import { buildSitemapLoc, normalizeSitemapBaseUrl } from './sitemap-utils'

const trimText = (value, maxLength = 240) => {
  if (value === undefined || value === null) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trim()}...`
}

const escapeMarkdownLinkText = value =>
  trimText(value, 120).replace(/[[\]\\]/g, '\\$&')

const isPublicContentPage = post => {
  if (!post?.slug || post.slug.startsWith('#')) return false
  if (post.password) return false
  return post.status === BLOG.NOTION_PROPERTY_NAME.status_publish
}

const getPostPriorityDate = post =>
  new Date(post?.publishDate || post?.publishDay || post?.lastEditedDay || 0)

const getPageUrl = ({ baseUrl, locale, slug }) =>
  buildSitemapLoc({ baseUrl, locale, slug })

const getUniqueByUrl = entries => {
  const map = new Map()
  entries.forEach(entry => {
    if (!entry?.url || map.has(entry.url)) return
    map.set(entry.url, entry)
  })
  return Array.from(map.values())
}

export const createLlmsTxt = ({
  allPages = [],
  siteInfo = {},
  NOTION_CONFIG = {},
  locale = ''
} = {}) => {
  const enabled = siteConfig('LLMS_TXT_ENABLED', true, NOTION_CONFIG)
  if (!enabled) return ''

  const baseUrl = normalizeSitemapBaseUrl(
    siteConfig('LINK', siteInfo?.link || BLOG.LINK, NOTION_CONFIG)
  )
  if (!baseUrl) return ''

  const title = trimText(siteInfo?.title || siteConfig('TITLE', BLOG.TITLE, NOTION_CONFIG), 120)
  const description = trimText(
    siteConfig('LLMS_TXT_SITE_SUMMARY', '', NOTION_CONFIG) ||
      siteInfo?.description ||
      siteConfig('DESCRIPTION', BLOG.DESCRIPTION, NOTION_CONFIG),
    300
  )
  const language = siteConfig('LANG', BLOG.LANG, NOTION_CONFIG)
  const author = trimText(siteConfig('AUTHOR', BLOG.AUTHOR, NOTION_CONFIG), 120)
  const postLimit = Number(siteConfig('LLMS_TXT_POST_LIMIT', 80, NOTION_CONFIG)) || 80
  const includePages = siteConfig('LLMS_TXT_INCLUDE_PAGES', true, NOTION_CONFIG)

  const publicPages = allPages
    .filter(isPublicContentPage)
    .filter(page => includePages || page.type === 'Post')
    .sort((a, b) => getPostPriorityDate(b) - getPostPriorityDate(a))
    .map(page => {
      const url = getPageUrl({ baseUrl, locale, slug: page.slug })
      if (!url) return null
      const tags = Array.isArray(page.tags) ? page.tags.join(', ') : ''
      const noteParts = [
        trimText(page.summary || page.description, 180),
        page.category ? `Category: ${trimText(page.category, 60)}` : '',
        tags ? `Tags: ${trimText(tags, 100)}` : ''
      ].filter(Boolean)
      return {
        title: page.title || page.slug,
        url,
        note: noteParts.join('; ')
      }
    })
    .filter(Boolean)
  const publicContentEntries = getUniqueByUrl(publicPages).slice(0, postLimit)

  const categories = getUniqueByUrl(
    allPages
      .filter(isPublicContentPage)
      .map(page => {
        const category = Array.isArray(page.category)
          ? page.category[0]
          : page.category
        if (!category) return null
        return {
          title: category,
          url: getPageUrl({
            baseUrl,
            locale,
            slug: `category/${encodeURIComponent(category)}`
          }),
          note: 'Content grouped by category'
        }
      })
      .filter(Boolean)
  ).slice(0, 30)

  const lines = [
    `# ${title || 'NotionNext site'}`,
    '',
    `> ${description || 'A NotionNext-powered website.'}`,
    '',
    `Canonical site: ${baseUrl}`,
    `Primary language: ${language}`,
    author ? `Author / publisher: ${author}` : '',
    'Purpose: help search engines, answer engines, and LLM agents identify canonical public content for citation and retrieval.',
    '',
    '## Core',
    `- [Home](${baseUrl}${locale ? `/${locale}` : ''}): Site homepage and latest updates`,
    `- [Sitemap](${baseUrl}/sitemap.xml): Complete crawlable URL index`,
    `- [RSS feed](${baseUrl}/rss/feed.xml): Fresh public posts when RSS is enabled`,
    '',
    '## Content'
  ].filter(line => line !== '')

  publicContentEntries.forEach(page => {
    lines.push(
      `- [${escapeMarkdownLinkText(page.title)}](${page.url})${
        page.note ? `: ${page.note}` : ''
      }`
    )
  })

  if (categories.length > 0) {
    lines.push('', '## Topics')
    categories.forEach(category => {
      lines.push(
        `- [${escapeMarkdownLinkText(category.title)}](${category.url}): ${category.note}`
      )
    })
  }

  lines.push(
    '',
    '## Optional',
    `- [Tags](${baseUrl}${locale ? `/${locale}` : ''}/tag): Tag archive for entity and topic discovery`,
    `- [Archive](${baseUrl}${locale ? `/${locale}` : ''}/archive): Chronological archive`
  )

  return `${lines.join('\n')}\n`
}

export const writeLlmsTxt = props => {
  const fs = require('fs')
  const content = createLlmsTxt(props)
  if (!content) return

  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/llms.txt', content)
  } catch (error) {
    // Vercel runtime is read-only; build and export phases can still write it.
  }
}
