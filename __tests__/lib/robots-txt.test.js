import { createRobotsTxt } from '@/lib/utils/robots.txt'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultVal, extendConfig = {}) => {
    if (extendConfig && Object.prototype.hasOwnProperty.call(extendConfig, key)) {
      return extendConfig[key]
    }
    return defaultVal
  })
}))

describe('createRobotsTxt', () => {
  it('allows search bots and can disallow training bots independently', () => {
    const robots = createRobotsTxt({
      siteInfo: {
        link: 'https://example.com'
      },
      NOTION_CONFIG: {
        GEO_AI_SEARCH_ENABLED: true,
        GEO_AI_TRAINING_ENABLED: false
      }
    })

    expect(robots).toContain('User-agent: OAI-SearchBot\nAllow: /')
    expect(robots).toContain('User-agent: Claude-SearchBot\nAllow: /')
    expect(robots).toContain('User-agent: GPTBot\nDisallow: /')
    expect(robots).toContain('User-agent: Google-Extended\nDisallow: /')
    expect(robots).toContain('Sitemap: https://example.com/sitemap.xml')
    expect(robots).toContain('# LLM context: https://example.com/llms.txt')
  })
})
