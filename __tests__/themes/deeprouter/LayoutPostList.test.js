import { render, screen } from '@testing-library/react'
import { LayoutPostList } from '@/themes/deeprouter'
import { siteConfig } from '@/lib/config'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

jest.mock('@/components/SmartLink', () => ({
  __esModule: true,
  default: ({ children, className = '', href = '' }) => (
    <a className={className} href={href}>
      {children}
    </a>
  )
}))

jest.mock('@/themes/deeprouter/components/PostCard', () => ({
  __esModule: true,
  default: ({ post }) => <article>{post.title}</article>
}))

const posts = Array.from({ length: 12 }, (_, index) => ({
  id: `post-${index}`,
  title: `Post ${index}`
}))

describe('deeprouter LayoutPostList', () => {
  beforeEach(() => {
    siteConfig.mockImplementation((key, defaultVal) => {
      if (key === 'POSTS_PER_PAGE') return 12
      if (key === 'DEEPROUTER_POSTS_PER_PAGE') return 10
      return defaultVal
    })
  })

  it('uses the global page size when calculating pagination links', () => {
    render(
      <LayoutPostList
        posts={posts}
        page={10}
        postCount={128}
        siteInfo={{ title: 'Deep Router', description: 'Network notes' }}
      />
    )

    expect(screen.getByRole('link', { name: '11' })).toHaveAttribute(
      'href',
      '/page/11'
    )
    expect(screen.queryByRole('link', { name: '12' })).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '下一页 →' })
    ).toHaveAttribute('href', '/page/11')
  })

  it('keeps tag pagination under the tag route', () => {
    render(
      <LayoutPostList
        posts={posts}
        page={1}
        postCount={25}
        tag='家庭网络'
        siteInfo={{ title: 'Deep Router', description: 'Network notes' }}
      />
    )

    expect(
      screen.getByRole('link', { name: '下一页 →' })
    ).toHaveAttribute(
      'href',
      '/tag/%E5%AE%B6%E5%BA%AD%E7%BD%91%E7%BB%9C/page/2'
    )
    expect(screen.queryByRole('link', { name: '4' })).not.toBeInTheDocument()
  })

  it('keeps category pagination under the category route', () => {
    render(
      <LayoutPostList
        posts={posts}
        page={1}
        postCount={25}
        category='技术分享'
        siteInfo={{ title: 'Deep Router', description: 'Network notes' }}
      />
    )

    expect(
      screen.getByRole('link', { name: '下一页 →' })
    ).toHaveAttribute(
      'href',
      '/category/%E6%8A%80%E6%9C%AF%E5%88%86%E4%BA%AB/page/2'
    )
    expect(screen.queryByRole('link', { name: '4' })).not.toBeInTheDocument()
  })
})
