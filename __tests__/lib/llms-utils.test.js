import { createLlmsTxt } from '@/lib/llms-utils'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultVal, extendConfig = {}) => {
    if (
      extendConfig &&
      Object.prototype.hasOwnProperty.call(extendConfig, key)
    ) {
      return extendConfig[key]
    }
    return defaultVal
  })
}))

describe('createLlmsTxt', () => {
  const baseProps = {
    siteInfo: {
      title: 'Example Site',
      description: 'Useful notes',
      link: 'https://example.com'
    },
    NOTION_CONFIG: {
      LINK: 'https://example.com',
      LANG: 'en-US'
    }
  }

  it('builds a markdown llms.txt with canonical public content', () => {
    const content = createLlmsTxt({
      ...baseProps,
      allPages: [
        {
          title: 'Hello [World]',
          slug: '/article/hello',
          summary: 'A concise summary',
          status: 'Published',
          type: 'Post',
          tags: ['AI', 'Search'],
          category: 'Notes',
          publishDay: '2026-06-01'
        }
      ]
    })

    expect(content).toContain('# Example Site')
    expect(content).toContain('Last updated:')
    expect(content).toContain(
      '[Hello \\[World\\]](https://example.com/article/hello)'
    )
    expect(content).toContain('Tags: AI, Search')
    expect(content).toContain('[Sitemap](https://example.com/sitemap.xml)')
  })

  it('omits private, unpublished, and external pages', () => {
    const content = createLlmsTxt({
      ...baseProps,
      allPages: [
        {
          title: 'Draft',
          slug: '/draft',
          status: 'Draft',
          type: 'Post'
        },
        {
          title: 'Secret',
          slug: '/secret',
          password: '123',
          status: 'Published',
          type: 'Post'
        },
        {
          title: 'External',
          slug: 'https://external.com/page',
          status: 'Published',
          type: 'Post'
        }
      ]
    })

    expect(content).not.toContain('Draft')
    expect(content).not.toContain('Secret')
    expect(content).not.toContain('External')
  })

  it('deduplicates content by final URL', () => {
    const content = createLlmsTxt({
      ...baseProps,
      allPages: [
        {
          title: 'Canonical',
          slug: '/article/same',
          status: 'Published',
          type: 'Post',
          publishDay: '2026-06-02'
        },
        {
          title: 'Duplicate',
          slug: 'https://example.com/article/same',
          status: 'Published',
          type: 'Post',
          publishDay: '2026-06-01'
        }
      ]
    })

    expect(
      content.match(/https:\/\/example\.com\/article\/same/g)
    ).toHaveLength(1)
  })
})
