import {
  buildSitemapLoc,
  getUniqueSitemapFields,
  normalizeSitemapBaseUrl,
  normalizeSitemapLocale,
  toSitemapDateString
} from '@/lib/sitemap-utils'

describe('sitemap-utils', () => {
  describe('normalizeSitemapBaseUrl', () => {
    it('trims and removes trailing slashes', () => {
      expect(normalizeSitemapBaseUrl(' https://example.com/// ')).toBe(
        'https://example.com'
      )
    })

    it('returns empty string for non-string values', () => {
      expect(normalizeSitemapBaseUrl(null)).toBe('')
      expect(normalizeSitemapBaseUrl(undefined)).toBe('')
    })
  })

  describe('normalizeSitemapLocale', () => {
    it('normalizes locale prefix with leading slash', () => {
      expect(normalizeSitemapLocale('zh')).toBe('/zh')
      expect(normalizeSitemapLocale('/en')).toBe('/en')
    })

    it('returns empty string for empty values', () => {
      expect(normalizeSitemapLocale('')).toBe('')
      expect(normalizeSitemapLocale(null)).toBe('')
    })
  })

  describe('buildSitemapLoc', () => {
    const baseUrl = 'https://example.com'

    it('builds locale home URL when slug is empty', () => {
      expect(
        buildSitemapLoc({
          baseUrl,
          locale: 'zh'
        })
      ).toBe('https://example.com/zh')
    })

    it('builds URL for relative slug', () => {
      expect(
        buildSitemapLoc({
          baseUrl,
          locale: 'zh',
          slug: '/post/hello'
        })
      ).toBe('https://example.com/zh/post/hello')
    })

    it('returns null for external absolute URL', () => {
      expect(
        buildSitemapLoc({
          baseUrl,
          slug: 'https://external.com/page'
        })
      ).toBeNull()
    })

    it('keeps absolute URL when it points to the same host', () => {
      expect(
        buildSitemapLoc({
          baseUrl,
          slug: 'https://example.com/path/to/page'
        })
      ).toBe('https://example.com/path/to/page')
    })

    it('returns null for invalid absolute URL', () => {
      expect(
        buildSitemapLoc({
          baseUrl,
          slug: 'https://'
        })
      ).toBeNull()
    })
  })

  describe('toSitemapDateString', () => {
    it('formats valid date to YYYY-MM-DD', () => {
      expect(toSitemapDateString('2026-02-21T12:34:56.000Z')).toBe('2026-02-21')
    })

    it('falls back when date is invalid', () => {
      expect(toSitemapDateString('not-a-date', '2026-01-01')).toBe('2026-01-01')
    })
  })

  describe('getUniqueSitemapFields', () => {
    it('keeps one field per loc, prefers the newest lastmod, and drops non-indexable routes', () => {
      expect(
        getUniqueSitemapFields([
          {
            loc: 'https://example.com/archive',
            lastmod: '2026-01-01',
            changefreq: 'daily'
          },
          {
            loc: 'https://example.com/archive',
            lastmod: '2026-02-01',
            changefreq: 'weekly'
          },
          {
            loc: 'https://example.com/tag',
            lastmod: '2026-01-01',
            changefreq: 'daily'
          },
          {
            loc: 'https://example.com/search',
            lastmod: '2026-01-01',
            changefreq: 'daily'
          },
          {
            loc: 'https://example.com/search/NotionNext',
            lastmod: '2026-01-01',
            changefreq: 'daily'
          },
          {
            loc: 'https://example.com/404',
            lastmod: '2026-01-01',
            changefreq: 'daily'
          },
          null
        ])
      ).toEqual([
        {
          loc: 'https://example.com/archive',
          lastmod: '2026-02-01',
          changefreq: 'weekly'
        },
        {
          loc: 'https://example.com/tag',
          lastmod: '2026-01-01',
          changefreq: 'daily'
        }
      ])
    })
  })
})
