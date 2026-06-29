import { renderToStaticMarkup } from 'react-dom/server.node'

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: jest.fn()
}))

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn((key, defaultVal) => defaultVal)
}))

jest.mock('@/themes/theme', () => ({
  DynamicLayout: () => null
}))

const { SeoArchiveLinks, cleanArchivePost } = require('@/pages/archive')

describe('archive SEO links', () => {
  it('renders article anchors in the server HTML fallback', () => {
    const html = renderToStaticMarkup(
      <SeoArchiveLinks
        posts={[
          {
            id: 'post-1',
            title: 'KixDNS Guide',
            href: '/article/kixdns-bypass-gateway-dns-guide'
          },
          {
            id: 'post-2',
            title: 'Codex SQLite Fix',
            slug: 'article/codex-desktop-trace-logs-sqlite-fix'
          }
        ]}
      />
    )

    expect(html).toContain('href="/article/kixdns-bypass-gateway-dns-guide"')
    expect(html).toContain(
      'href="/article/codex-desktop-trace-logs-sqlite-fix"'
    )
  })

  it('keeps href data when archive posts are trimmed', () => {
    expect(
      cleanArchivePost({
        id: 'post-1',
        title: 'KixDNS Guide',
        slug: 'article/kixdns-bypass-gateway-dns-guide',
        href: '/article/kixdns-bypass-gateway-dns-guide',
        publishDate: 1782660200000,
        date: 1782660200000,
        blockMap: { large: true }
      })
    ).toEqual({
      id: 'post-1',
      title: 'KixDNS Guide',
      slug: 'article/kixdns-bypass-gateway-dns-guide',
      href: '/article/kixdns-bypass-gateway-dns-guide',
      publishDate: 1782660200000,
      date: 1782660200000
    })
  })
})
