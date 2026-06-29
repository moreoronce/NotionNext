import { renderToStaticMarkup } from 'react-dom/server.node'

import {
  ArchiveSeoHead,
  ArchiveSeoLinks,
  getArchiveSeoMeta,
  getArchiveSeoPosts
} from '@/lib/archive-seo-links'

jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))
jest.mock('@/lib/config', () => ({ siteConfig: jest.fn() }))
jest.mock('@/themes/theme', () => ({ DynamicLayout: () => null }))

const { cleanArchivePost } = require('@/pages/archive')

describe('archive SEO links', () => {
  it('renders article anchors in the server HTML fallback', () => {
    const html = renderToStaticMarkup(
      <ArchiveSeoLinks
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

  it('extracts archive posts from Next document data only on archive pages', () => {
    expect(
      getArchiveSeoPosts({
        page: '/archive',
        props: {
          pageProps: {
            posts: [
              { title: 'KixDNS Guide', href: '/article/kixdns-bypass-gateway-dns-guide' },
              { title: 'No URL' }
            ]
          }
        }
      })
    ).toEqual([
      { title: 'KixDNS Guide', href: '/article/kixdns-bypass-gateway-dns-guide' }
    ])

    expect(
      getArchiveSeoPosts({
        page: '/tag',
        props: { pageProps: { posts: [{ href: '/article/one' }] } }
      })
    ).toEqual([])
  })

  it('renders archive title and description in the document fallback head', () => {
    const meta = getArchiveSeoMeta({
      page: '/archive',
      props: {
        pageProps: {
          siteInfo: {
            title: 'Deep Router',
            description: 'Network optimization notes.',
            link: 'https://deeprouter.org'
          }
        }
      }
    })

    const html = renderToStaticMarkup(<ArchiveSeoHead meta={meta} />)

    expect(html).toContain('<title>归档 | Deep Router</title>')
    expect(html).toContain(
      '<meta name="description" content="归档 | Network optimization notes."/>'
    )
    expect(html).toContain(
      '<link rel="canonical" href="https://deeprouter.org/archive"/>'
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
