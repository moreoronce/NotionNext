import { siteConfig } from '@/lib/config'
import { convertInnerUrl } from '@/lib/db/notion/convertInnerUrl'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { initGoogleAdsense } from './GoogleAdsense'

import { useGlobal } from '@/lib/global'
// import IconFont from './IconFont'
/**
 * 各种插件脚本
 * @param {*} props
 * @returns
 */
const ExternalPlugin = props => {
  const { NOTION_CONFIG } = props
  const { lang } = useGlobal()
  const NEST = siteConfig('NEST')
  const COMMENT_TWIKOO_COUNT_ENABLE = siteConfig('COMMENT_TWIKOO_COUNT_ENABLE')
  const GLOBAL_JS = siteConfig('GLOBAL_JS', '')
  const IMG_SHADOW = siteConfig('IMG_SHADOW')
  const ANIMATE_CSS_URL = siteConfig('ANIMATE_CSS_URL')
  const ADSENSE_GOOGLE_ID = siteConfig('ADSENSE_GOOGLE_ID')
  const DISABLE_PLUGIN = siteConfig('DISABLE_PLUGIN', null, NOTION_CONFIG)
  const CUSTOM_EXTERNAL_CSS = siteConfig(
    'CUSTOM_EXTERNAL_CSS',
    null,
    NOTION_CONFIG
  )
  const CUSTOM_EXTERNAL_JS = siteConfig(
    'CUSTOM_EXTERNAL_JS',
    null,
    NOTION_CONFIG
  )
  // 默认关闭NProgress
  const ENABLE_NPROGRSS = siteConfig('ENABLE_NPROGRSS', false)

  // 默认关闭AOS动画 (防止 Forced Reflow)
  const ENABLE_AOS = siteConfig('ENABLE_AOS', false)

  const ENABLE_ICON_FONT = siteConfig('ENABLE_ICON_FONT', false)

  const UMAMI_HOST = siteConfig('UMAMI_HOST', null, NOTION_CONFIG)
  const UMAMI_ID = siteConfig('UMAMI_ID', null, NOTION_CONFIG)

  const externalCssList = useMemo(() => {
    return Array.isArray(CUSTOM_EXTERNAL_CSS)
      ? CUSTOM_EXTERNAL_CSS.filter(url => !!url)
      : []
  }, [CUSTOM_EXTERNAL_CSS])

  const externalJsList = useMemo(() => {
    return Array.isArray(CUSTOM_EXTERNAL_JS)
      ? CUSTOM_EXTERNAL_JS.filter(url => !!url)
      : []
  }, [CUSTOM_EXTERNAL_JS])

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const scheduleTask = callback => {
      if (window.requestIdleCallback) {
        const taskId = window.requestIdleCallback(callback)
        return () => window.cancelIdleCallback(taskId)
      }
      const timeoutId = window.setTimeout(() => callback(), 0)
      return () => window.clearTimeout(timeoutId)
    }

    const cancelTasks = []
    cancelTasks.push(
      scheduleTask(() => {
        loadExternalResource('/css/custom.css', 'css')
        loadExternalResource('/js/custom.js', 'js')

        if (IMG_SHADOW) {
          loadExternalResource('/css/img-shadow.css', 'css')
        }

        if (ANIMATE_CSS_URL) {
          loadExternalResource(ANIMATE_CSS_URL, 'css')
        }

        for (const url of externalJsList) {
          loadExternalResource(url, 'js')
        }

        for (const url of externalCssList) {
          loadExternalResource(url, 'css')
        }
      })
    )

    return () => {
      cancelTasks.forEach(cancel => cancel?.())
    }
  }, [ANIMATE_CSS_URL, IMG_SHADOW, externalCssList, externalJsList])

  const router = useRouter()
  useEffect(() => {
    // 异步渲染谷歌广告
    if (ADSENSE_GOOGLE_ID) {
      setTimeout(() => {
        initGoogleAdsense(ADSENSE_GOOGLE_ID)
      }, 3000)
    }

    setTimeout(() => {
      // 映射url
      convertInnerUrl({
        allPages: props?.allLinkPages || props?.allNavPages,
        lang: lang
      })
    }, 500)
  }, [router])

  useEffect(() => {
    if (!isBrowser || !GLOBAL_JS || GLOBAL_JS.trim() === '') {
      return
    }

    try {
      // eslint-disable-next-line no-eval
      eval(GLOBAL_JS)
    } catch (error) {
      console.error('Failed to execute GLOBAL_JS:', error)
    }
  }, [GLOBAL_JS])

  if (DISABLE_PLUGIN) {
    return null
  }

  return (
    <>
      {/* 全局样式嵌入 */}
      <GlobalStyle />
      {ENABLE_ICON_FONT && <IconFont />}
      {NEST && <Nest />}
      {COMMENT_TWIKOO_COUNT_ENABLE && <TwikooCommentCounter {...props} />}
      {ENABLE_NPROGRSS && <LoadingProgress />}
      {ENABLE_AOS && <AosAnimation />}
    </>
  )
}

const TwikooCommentCounter = dynamic(
  () => import('@/components/TwikooCommentCounter'),
  { ssr: false }
)
const Nest = dynamic(() => import('@/components/Nest'), { ssr: false })
const LoadingProgress = dynamic(() => import('@/components/LoadingProgress'), {
  ssr: false
})
const AosAnimation = dynamic(() => import('@/components/AOSAnimation'), {
  ssr: false
})

const GlobalStyle = dynamic(() => import('./GlobalStyle').then(m => m.GlobalStyle), { ssr: true })
const IconFont = dynamic(() => import('./IconFont'), { ssr: false })

export default ExternalPlugin
