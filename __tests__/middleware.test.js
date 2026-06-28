import { getPageOneRedirectPath } from '@/lib/page-one-redirects'

describe('middleware page-one redirects', () => {
  it.each([
    ['/page/1', '/'],
    ['/page/1/', '/'],
    ['/tag/%E5%AE%B6%E5%BA%AD%E7%BD%91%E7%BB%9C/page/1', '/tag/%E5%AE%B6%E5%BA%AD%E7%BD%91%E7%BB%9C'],
    ['/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB/page/1', '/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB'],
    ['/search/NotionNext/page/1', '/search/NotionNext']
  ])('redirects %s to %s', (pathname, expected) => {
    expect(getPageOneRedirectPath(pathname)).toBe(expected)
  })

  it.each(['/page/2', '/tag/foo/page/2', '/category/foo', '/article/foo/page/1'])(
    'does not redirect %s',
    pathname => {
      expect(getPageOneRedirectPath(pathname)).toBeNull()
    }
  )
})
