import { render } from '@testing-library/react'
import SEO, {
  getCanonicalUrl,
  generateStructuredData,
  getSEOMeta,
  getSEORobots
} from '@/components/SEO'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/lib/global', () => ({
  useGlobal: () => ({
    locale: {
      NAV: { ARCHIVE: 'Archive', SEARCH: 'Search', PAGE_NOT_FOUND: 'Not Found' },
      COMMON: { CATEGORY: 'Category', TAGS: 'Tags' }
    }
  })
}))

const { siteConfig } = require('@/lib/config')

const baseSiteConfig = {
  AUTHOR: 'Example Author',
  BACKGROUND_DARK: '#ffffff',
  BLOG_FAVICON: '/favicon.ico',
  ENABLE_RSS: true,
  FONT_URL: '',
  KEYWORDS: 'notion,next',
  LANG: 'en-US',
  LINK: 'https://example.com',
  PATH: '',
  SUB_PATH: '',
  TITLE: 'Example Blog'
}

// 默认为所有测试安装基础配置 mock（restoreMocks 会在每个测试后还原），
// 使直接调用 generateStructuredData 等导出函数的测试也能取到 LINK/LANG 等配置。
beforeEach(() => {
  siteConfig.mockImplementation((key, defaultVal) => {
    if (key === 'FONT_URL') return ''
    return Object.prototype.hasOwnProperty.call(baseSiteConfig, key)
      ? baseSiteConfig[key]
      : defaultVal
  })
})

const renderSeo = fontUrl => {
  siteConfig.mockImplementation((key, defaultVal) => {
    if (key === 'FONT_URL') return fontUrl
    return Object.prototype.hasOwnProperty.call(baseSiteConfig, key)
      ? baseSiteConfig[key]
      : defaultVal
  })

  return render(
    <SEO
      siteInfo={{
        title: 'Example Blog',
        description: 'Example description',
        icon: '/logo.png',
        pageCover: '/cover.png',
        link: 'https://example.com'
      }}
    />
  )
}

describe('SEO metadata', () => {
  it('uses the current route once when building canonical URLs', () => {
    expect(
      getCanonicalUrl(
        'https://deeprouter.org/',
        '',
        '/article/kixdns-bypass-gateway-dns-guide?source=test#intro'
      )
    ).toBe(
      'https://deeprouter.org/article/kixdns-bypass-gateway-dns-guide'
    )
  })

  it('returns archive title and description even when locale is not available', () => {
    const meta = getSEOMeta(
      {
        siteInfo: {
          title: 'Deep Router',
          description: 'Network optimization notes',
          pageCover: '/cover.jpg'
        }
      },
      { route: '/archive', query: {} },
      undefined
    )

    expect(meta.title).toBe('归档 | Deep Router')
    expect(meta.description).toBe('归档 | Network optimization notes')
    expect(meta.image).toBe('/cover.jpg')
  })

  it('marks search result pages as noindex', () => {
    expect(getSEORobots({ route: '/search' })).toContain('noindex')
    expect(getSEORobots({ route: '/search/[keyword]' })).toContain('noindex')
    expect(getSEORobots({ route: '/tag/[tag]' })).toContain('index')
  })

  it('adds page numbers to tag and category pagination metadata', () => {
    const siteInfo = {
      title: 'Deep Router',
      description: 'Network optimization notes'
    }

    expect(
      getSEOMeta(
        { siteInfo, category: '技术分享', page: '2' },
        { route: '/category/[category]/page/[page]', query: {} },
        undefined
      ).title
    ).toBe('技术分享 - 第 2 页 | 分类 | Deep Router')

    expect(
      getSEOMeta(
        { siteInfo, tag: '家庭网络', page: '3' },
        { route: '/tag/[tag]/page/[page]', query: {} },
        undefined
      ).description
    ).toBe('家庭网络 - 第 3 页 | 标签 | Network optimization notes')
  })

  it('adds SearchAction and CollectionPage structured data', () => {
    const data = generateStructuredData(
      {
        title: '家庭网络 - 第 2 页 | 标签 | Deep Router',
        description: '家庭网络 - 第 2 页 | 标签 | Network notes'
      },
      {
        title: 'Deep Router',
        description: 'Network notes'
      },
      'https://deeprouter.org/tag/家庭网络/page/2',
      'https://deeprouter.org/cover.jpg',
      'Moreo',
      { route: '/tag/[tag]/page/[page]', query: { tag: '家庭网络' } }
    )

    expect(
      data['@graph'].find(item => item['@type'] === 'WebSite').potentialAction[
        '@type'
      ]
    ).toBe('SearchAction')
    expect(
      data['@graph'].some(item => item['@type'] === 'CollectionPage')
    ).toBe(true)
  })

  it('keeps string post category intact for structured data', () => {
    const meta = getSEOMeta(
      {
        siteInfo: {
          title: 'Deep Router',
          description: 'Network notes'
        },
        post: {
          title: 'KixDNS Guide',
          summary: 'DNS notes',
          type: 'Post',
          slug: 'article/kixdns-bypass-gateway-dns-guide',
          category: '技术分享',
          tags: ['DNS'],
          wordCount: 1000
        }
      },
      { route: '/[prefix]/[slug]', query: {} },
      undefined
    )

    const data = generateStructuredData(
      meta,
      {
        title: 'Deep Router',
        description: 'Network notes'
      },
      'https://deeprouter.org/article/kixdns-bypass-gateway-dns-guide',
      'https://deeprouter.org/cover.jpg',
      'Moreo',
      { route: '/[prefix]/[slug]', query: {} }
    )
    const post = data['@graph'].find(item => item['@type'] === 'BlogPosting')
    const breadcrumb = data['@graph'].find(
      item => item['@type'] === 'BreadcrumbList'
    )

    expect(meta.category).toBe('技术分享')
    expect(post.articleSection).toBe('技术分享')
    expect(breadcrumb.itemListElement[1].name).toBe('技术分享')
    expect(breadcrumb.itemListElement[1].item).toBe(
      'https://example.com/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB'
    )
  })
})

describe('SEO RSS discovery', () => {
  it('exposes an RSS alternate link for readers and browsers', () => {
    const { container } = renderSeo('')
    const rssLink = container.querySelector(
      'link[rel="alternate"][type="application/rss+xml"]'
    )

    expect(rssLink).toBeInTheDocument()
    expect(rssLink.getAttribute('href')).toBe(
      'https://example.com/rss/feed.xml'
    )
  })

  it('omits the alternate link when RSS is disabled', () => {
    siteConfig.mockImplementation((key, defaultVal) => {
      if (key === 'ENABLE_RSS') return false
      return Object.prototype.hasOwnProperty.call(baseSiteConfig, key)
        ? baseSiteConfig[key]
        : defaultVal
    })

    const { container } = render(
      <SEO
        siteInfo={{
          title: 'Example Blog',
          description: 'Example description',
          link: 'https://example.com'
        }}
      />
    )

    expect(
      container.querySelector('link[type="application/rss+xml"]')
    ).not.toBeInTheDocument()
  })
})

describe('SEO font resource hints', () => {
  it('omits Google Fonts hints for non-Google font URLs', () => {
    const { container } = renderSeo(
      'https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css'
    )

    expect(
      container.querySelector('link[href="//fonts.googleapis.com"]')
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('link[href="https://fonts.gstatic.com"]')
    ).not.toBeInTheDocument()
  })

  it('emits Google Fonts hints for Google font URLs', () => {
    const { container } = renderSeo([
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'
    ])

    expect(
      container.querySelector('link[href="//fonts.googleapis.com"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('link[href="https://fonts.gstatic.com"]')
    ).toBeInTheDocument()
  })
})

describe('font config defaults', () => {
  const originalFontUrl = process.env.NEXT_PUBLIC_FONT_URL

  afterEach(() => {
    jest.resetModules()
    if (originalFontUrl === undefined) {
      delete process.env.NEXT_PUBLIC_FONT_URL
    } else {
      process.env.NEXT_PUBLIC_FONT_URL = originalFontUrl
    }
  })

  it('does not load large Chinese Google Fonts by default', () => {
    delete process.env.NEXT_PUBLIC_FONT_URL
    jest.resetModules()

    const fontConfig = require('@/conf/font.config')
    const defaultFontUrls = Array.isArray(fontConfig.FONT_URL)
      ? fontConfig.FONT_URL
      : [fontConfig.FONT_URL]

    expect(defaultFontUrls).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining('Noto+Sans+SC'),
        expect.stringContaining('Noto+Serif+SC')
      ])
    )
  })

  it('keeps NEXT_PUBLIC_FONT_URL opt-in support', () => {
    process.env.NEXT_PUBLIC_FONT_URL =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&display=swap'
    jest.resetModules()

    const fontConfig = require('@/conf/font.config')

    expect(fontConfig.FONT_URL).toBe(process.env.NEXT_PUBLIC_FONT_URL)
  })
})
