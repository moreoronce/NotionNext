jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultVal) => {
    if (key === 'POSTS_PER_PAGE') return 10
    return defaultVal
  })
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn()
}))

jest.mock('@/themes/theme', () => ({
  DynamicLayout: () => null
}))

jest.mock('@/lib/cache/cache_manager', () => ({
  getDataFromCache: jest.fn()
}))

jest.mock('@/lib/db/notion/getPageContentText', () => ({
  getPageContentText: jest.fn(() => [])
}))

jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  getPageBlockCacheKey: jest.fn(() => 'page-block-cache-key')
}))

const { fetchGlobalAllData } = require('@/lib/db/SiteDataApi')

const posts = Array.from({ length: 25 }, (_, index) => ({
  id: `post-${index}`,
  type: 'Post',
  status: 'Published',
  category: ['技术分享'],
  tags: ['家庭网络']
}))

describe('tag/category paginated static paths', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetchGlobalAllData.mockResolvedValue({
      NOTION_CONFIG: {},
      allPages: posts,
      categoryOptions: [{ name: '技术分享' }],
      tagOptions: [{ name: '家庭网络' }]
    })
  })

  it('starts category pagination paths at page 2', async () => {
    const {
      getStaticPaths
    } = require('@/pages/category/[category]/page/[page]')

    await expect(getStaticPaths()).resolves.toEqual({
      paths: [
        { params: { category: '技术分享', page: '2' } },
        { params: { category: '技术分享', page: '3' } }
      ],
      fallback: true
    })
  })

  it('starts tag pagination paths at page 2', async () => {
    const { getStaticPaths } = require('@/pages/tag/[tag]/page/[page]')

    await expect(getStaticPaths()).resolves.toEqual({
      paths: [
        { params: { tag: '家庭网络', page: '2' } },
        { params: { tag: '家庭网络', page: '3' } }
      ],
      fallback: true
    })
  })

  it('does not pre-render keyword search fallback shells', () => {
    const { getStaticPaths: getSearchPaths } = require('@/pages/search/[keyword]')
    const {
      getStaticPaths: getSearchPagePaths
    } = require('@/pages/search/[keyword]/page/[page]')

    expect(getSearchPaths()).toEqual({
      paths: [],
      fallback: 'blocking'
    })
    expect(getSearchPagePaths()).toEqual({
      paths: [],
      fallback: 'blocking'
    })
  })
})
