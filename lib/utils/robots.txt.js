import fs from 'fs'
import { siteConfig } from '@/lib/config'

const searchUserAgents = [
  'Googlebot',
  'bingbot',
  'Applebot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'meta-externalfetcher',
  'facebookexternalhit'
]

const trainingUserAgents = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent'
]

const privatePaths = [
  '/article/horace-and-pete',
  '/article/nier-automata-ver-1-1a',
  '/sign-in',
  '/sign-up',
  '/dashboard',
  '/auth',
  '/api'
]

export function createRobotsTxt(props) {
  const { siteInfo, NOTION_CONFIG } = props
  const LINK = siteInfo?.link
  const aiSearchEnabled = siteConfig('GEO_AI_SEARCH_ENABLED', true, NOTION_CONFIG)
  const aiTrainingEnabled = siteConfig(
    'GEO_AI_TRAINING_ENABLED',
    true,
    NOTION_CONFIG
  )
  const crawlDelay = siteConfig('GEO_CRAWL_DELAY', '', NOTION_CONFIG)
  const privateDisallow = privatePaths.map(path => `Disallow: ${path}`).join('\n')
  const crawlDelayRule = crawlDelay ? `\nCrawl-delay: ${crawlDelay}` : ''
  const searchRules = searchUserAgents
    .map(
      userAgent => `User-agent: ${userAgent}
${aiSearchEnabled ? 'Allow: /' : 'Disallow: /'}${crawlDelayRule}`
    )
    .join('\n\n')
  const trainingRules = trainingUserAgents
    .map(
      userAgent => `User-agent: ${userAgent}
${aiTrainingEnabled ? 'Allow: /' : 'Disallow: /'}${crawlDelayRule}`
    )
    .join('\n\n')

  return `
# Search and answer engines
${searchRules}

# AI model training crawlers
${trainingRules}

# Default policy
# *
User-agent: *
${privateDisallow}

Allow: /

# Content discovery
Sitemap: ${LINK}/sitemap.xml
# LLM context: ${LINK}/llms.txt
`.trim()
}

export function generateRobotsTxt(props) {
  const content = createRobotsTxt(props)
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
