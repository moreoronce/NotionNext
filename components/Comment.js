import Tabs from '@/components/Tabs'
import { siteConfig } from '@/lib/config'
import { isBrowser, isSearchEngineBot } from '@/lib/utils'
import { stripTransientQueryParamsFromAsPath } from '@/lib/utils/stripTransientUrlParams'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

/**
 * 评论组件
 * 只有当前组件在浏览器可见范围内才会加载内容
 * @param {*} param0
 * @returns
 */
const Comment = ({ frontMatter, className }) => {
  const router = useRouter()
  const [shouldLoad, setShouldLoad] = useState(false)
  const commentRef = useRef(null)

  const COMMENT_TWIKOO_ENV_ID = siteConfig('COMMENT_TWIKOO_ENV_ID')
  const COMMENT_GISCUS_REPO = siteConfig('COMMENT_GISCUS_REPO')

  useEffect(() => {
    // Check if the component is visible in the viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.unobserve(entry.target)
        }
      })
    })

    if (commentRef.current) {
      observer.observe(commentRef.current)
    }

    return () => {
      if (commentRef.current) {
        observer.unobserve(commentRef.current)
      }
    }
  }, [frontMatter])

  useEffect(() => {
    if (!isBrowser || !router.isReady) {
      return
    }
    const hasGiscus = 'giscus' in router.query
    const scrollComment = router.query.target === 'comment'
    if (!hasGiscus && !scrollComment) {
      return
    }
    if (scrollComment && !hasGiscus) {
      const cleanPath = stripTransientQueryParamsFromAsPath(router.asPath)
      window.history.replaceState(window.history.state, '', cleanPath)
      router
        .replace(cleanPath, undefined, { scroll: false, shallow: true })
        .catch(() => {})
    }
    if (scrollComment || hasGiscus) {
      const t = window.setTimeout(() => {
        document
          ?.getElementById('comment')
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }, 400)
      return () => window.clearTimeout(t)
    }
  }, [router.isReady, router.asPath, router.query])

  if (!frontMatter) {
    return null
  }

  if (isSearchEngineBot) {
    return null
  }

  // 特定文章关闭评论区
  if (frontMatter?.comment === 'Hide') {
    return null
  }

  return (
    <div
      key={frontMatter?.id}
      id='comment'
      ref={commentRef}
      className={`comment mt-5 text-gray-800 dark:text-gray-300 ${className || ''}`}>
      {/* 延迟加载评论区 */}
      {!shouldLoad && (
        <div className='text-center'>
          Loading...
          <i className='fas fa-spinner animate-spin text-3xl ' />
        </div>
      )}

      {shouldLoad && (
        <Tabs>
          {COMMENT_TWIKOO_ENV_ID && (
            <div key='Twikoo'>
              <TwikooCompenent />
            </div>
          )}

          {COMMENT_GISCUS_REPO && (
            <div key='Giscus'>
              <GiscusComponent className='px-2' />
            </div>
          )}
        </Tabs>
      )}
    </div>
  )
}

const TwikooCompenent = dynamic(
  () => {
    return import('@/components/Twikoo')
  },
  { ssr: false }
)

const GiscusComponent = dynamic(
  () => {
    return import('@/components/Giscus')
  },
  { ssr: false }
)

export default Comment
