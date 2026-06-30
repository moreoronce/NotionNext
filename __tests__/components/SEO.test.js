import {
  generateStructuredData,
  getSEOMeta,
  getSEORobots
} from '@/components/SEO'

describe('SEO metadata', () => {
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
      'https://test.com/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB'
    )
  })
})
