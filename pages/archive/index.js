import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { isBrowser } from '@/lib/utils'
import { formatDateFmt } from '@/lib/utils/formatDate'
import { DynamicLayout } from '@/themes/theme'
import { useEffect } from 'react'

/**
 * 归档首页
 * @param {*} props
 * @returns
 */
const ArchiveIndex = props => {
  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1))
          if (anchorElement) {
            anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, [])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      <SeoArchiveLinks posts={props.posts} />
      <DynamicLayout theme={theme} layoutName='LayoutArchive' {...props} />
    </>
  )
}

const SeoArchiveLinks = ({ posts = [] }) => {
  const archivePosts = posts.filter(post => post?.href || post?.slug)
  if (archivePosts.length === 0) {
    return null
  }

  return (
    <nav className='sr-only' aria-label='Archive article links'>
      <ul>
        {archivePosts.map(post => (
          <li key={post.id || post.href || post.slug}>
            <a href={post.href || `/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'archive-index', locale })
  // 处理分页
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  props.posts = props.posts?.map(cleanArchivePost)
  delete props.allPages

  const postsSortByDate = Object.create(props.posts)

  postsSortByDate.sort((a, b) => {
    return b?.publishDate - a?.publishDate
  })

  const archivePosts = {}

  postsSortByDate.forEach(post => {
    const date = formatDateFmt(post.publishDate, 'yyyy-MM')
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })

  props.archivePosts = archivePosts
  if (siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG) === 'deeprouter') {
    delete props.archivePosts
  }
  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default ArchiveIndex
export { SeoArchiveLinks }

export function cleanArchivePost(post) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    href: post.href,
    publishDate: post.publishDate,
    date: post.date
  }
}
