import { render } from '@testing-library/react'
import PostCard from '@/themes/deeprouter/components/PostCard'

jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ children, className = '', href = '' }) => (
    <a className={className} href={href}>
      {children}
    </a>
  )
}))

jest.mock('@/components/LazyImage', () => ({
  __esModule: true,
  default: props => <img {...props} />
}))

describe('deeprouter PostCard', () => {
  it('does not defer card layout with content-visibility', () => {
    const { container } = render(
      <PostCard
        post={{
          slug: 'kixdns-bypass-gateway-dns-guide',
          title: 'KIXDNS bypass gateway DNS guide',
          summary: 'A practical networking note.',
          publishDate: '2026-06-01'
        }}
      />
    )

    const card = container.querySelector('.terminal-card')

    expect(card).toBeInTheDocument()
    expect(card).not.toHaveStyle({ contentVisibility: 'auto' })
    expect(card).not.toHaveStyle({ containIntrinsicSize: '0 280px' })
  })
})
