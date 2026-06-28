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
})
