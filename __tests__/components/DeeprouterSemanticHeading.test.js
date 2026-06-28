import { getDeeprouterSemanticHeading } from '@/components/DeeprouterSemanticHeading'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultVal) => {
    if (key === 'LANG') return 'zh-CN'
    if (key === 'TITLE') return 'Deep Router'
    return defaultVal
  })
}))

const siteInfo = {
  title: 'Deep Router'
}

describe('getDeeprouterSemanticHeading', () => {
  it.each([
    ['/', {}, 'Deep Router'],
    ['/page/[page]', { page: '10' }, 'Deep Router - Page 10'],
    ['/archive', {}, '归档'],
    ['/tag', {}, '文章标签'],
    ['/category', {}, '文章分类'],
    ['/tag/[tag]', { tag: '家庭网络' }, '标签: 家庭网络'],
    ['/category/[category]', { category: '工具分享' }, '分类: 工具分享']
  ])('returns a heading for %s', (route, pageProps, expected) => {
    expect(
      getDeeprouterSemanticHeading({
        pageProps: { siteInfo, ...pageProps },
        router: { route, query: {} }
      })
    ).toBe(expected)
  })

  it('uses the post title for article pages', () => {
    expect(
      getDeeprouterSemanticHeading({
        pageProps: {
          siteInfo,
          post: { title: 'Article Title' }
        },
        router: { route: '/[prefix]/[slug]', query: {} }
      })
    ).toBe('Article Title')
  })
})
