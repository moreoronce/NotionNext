import { getSEOMeta } from '@/components/SEO'

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
})
