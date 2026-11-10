import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getPwaConfig } from '@/lib/pwa'
import { createSiteUrl, normalizeSiteUrl } from '@/lib/sitemap-utils'
import { isHttpLink } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const getSiteMetaFallbacks = siteInfo => ({
  title: siteInfo?.title || siteConfig('TITLE') || '',
  description: siteInfo?.description || siteConfig('DESCRIPTION') || '',
  image:
    siteInfo?.pageCover || siteConfig('HOME_BANNER_IMAGE') || '/bg_image.jpg'
})

const NOINDEX_ROUTES = new Set([
  '/search',
  '/search/[keyword]',
  '/search/[keyword]/page/[page]',
  '/404',
  '/500'
])

const getSEORobots = router =>
  NOINDEX_ROUTES.has(router?.route)
    ? 'noindex, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    : 'follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1'

const normalizeCategory = category => {
  if (Array.isArray(category)) return category[0] || ''
  return category || ''
}

const getCanonicalUrl = (siteUrl, basePath = '', asPath = '/') => {
  const link = normalizeSiteUrl(siteUrl).replace(/\/+$/, '')
  const cleanPath = String(asPath || '/').split('#')[0].split('?')[0]
  const pathSuffix = cleanPath === '/' ? '' : cleanPath
  return `${link}${basePath}${pathSuffix}`
}

const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  // 去除 LINK / SUB_PATH 可能存在的首尾斜杠，避免拼接出 // 双斜杠
  const link = normalizeSiteUrl(
    siteConfig('LINK', siteInfo?.link, NOTION_CONFIG)
  ).replace(/\/+$/, '')
  const subPath = siteConfig('SUB_PATH', '').replace(/^\/+|\/+$/g, '')
  // 子目录部署时的前缀，例如部署在 example.com/blog/ 时为 /blog
  const basePath = siteConfig('PATH')?.length && subPath ? `/${subPath}` : ''
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')
  const webFontUrls = Array.isArray(webFontUrl)
    ? webFontUrl
    : webFontUrl
      ? [webFontUrl]
      : []
  const hasWebFontUrl = webFontUrls.length > 0
  const usesGoogleFonts = webFontUrls.some(url =>
    url?.includes('fonts.googleapis.com')
  )

  // router.asPath 已经是当前页面路径；不要再追加 meta.slug，否则文章路径会重复。
  const url = getCanonicalUrl(link, basePath, router?.asPath)

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    // 确保 image 是绝对 URL（Twitter/Facebook 需要）
    image = getAbsoluteImageUrl(meta.image || '/bg_image.jpg', link)
  }
  const TITLE = siteConfig('TITLE')
  const AUTHOR = siteConfig('AUTHOR')
  const fallbackMeta = getSiteMetaFallbacks(siteInfo)
  const title = meta?.title || fallbackMeta.title
  const description = meta?.description || fallbackMeta.description
  const type = meta?.type === 'Post' ? 'article' : meta?.type || 'website'
  const category = meta?.category || KEYWORDS // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const ENABLE_RSS = siteConfig('ENABLE_RSS')
  // 订阅文件的绝对地址，与 lib/utils/rss.js 的静态输出路径保持一致
  const rssUrl = createSiteUrl(
    subPath ? `${link}/${subPath}` : link,
    'rss/feed.xml'
  )
  const language =
    router?.locale || siteConfig('LANG', 'zh-CN', NOTION_CONFIG)
  const lang = String(language).replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)
  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)
  const TWITTER_SITE = siteConfig('TWITTER_SITE', '', NOTION_CONFIG)
  const TWITTER_CREATOR = siteConfig('TWITTER_CREATOR', '', NOTION_CONFIG)

  return (
    <Head>
      <meta charSet='UTF-8' />
      <title>{title}</title>
      <link
        rel='alternate'
        type='text/plain'
        href={`${siteConfig('LINK')}/llms.txt`}
        title='llms.txt'
      />
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta name='robots' content={getSEORobots(router)} />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />

      {/* 搜索引擎验证 */}
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {/* 基础SEO元数据 */}
      <link rel='canonical' href={url} />
      {/* RSS 自动发现：浏览器地址栏与阅读器依赖此声明 */}
      {ENABLE_RSS && rssUrl && (
        <link
          rel='alternate'
          type='application/rss+xml'
          title={`${TITLE} RSS`}
          href={rssUrl}
        />
      )}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='NotionNext' />

      {/* 语言和地区 */}
      <meta httpEquiv='content-language' content={language} />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />
      {siteConfig('GEO_PLACENAME', '', NOTION_CONFIG) && (
        <meta
          name='geo.placename'
          content={siteConfig('GEO_PLACENAME', '', NOTION_CONFIG)}
        />
      )}
      {/* Open Graph 元数据 */}
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:alt' content={title} />
      <meta property='og:site_name' content={siteConfig('TITLE')} />
      <meta property='og:type' content={type} />

      {/* Twitter Card 元数据 */}
      <meta name='twitter:card' content='summary_large_image' />
      {TWITTER_SITE && <meta name='twitter:site' content={TWITTER_SITE} />}
      {TWITTER_CREATOR && (
        <meta name='twitter:creator' content={TWITTER_CREATOR} />
      )}
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:image:alt' content={title} />

      <link rel='icon' href={BLOG_FAVICON} />
      <link rel='dns-prefetch' href='https://cdnjs.cloudflare.com' />
      <link rel='dns-prefetch' href='https://cdn.jsdelivr.net' />

      {/* 文章特定元数据 */}
      {meta?.type === 'Post' && (
        <>
          {meta.publishTime && (
            <meta property='article:published_time' content={meta.publishTime} />
          )}
          {meta.modifiedTime && (
            <meta
              property='article:modified_time'
              content={meta.modifiedTime}
            />
          )}
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          {FACEBOOK_PAGE && (
            <meta property='article:publisher' content={FACEBOOK_PAGE} />
          )}
        </>
      )}

      {/* 结构化数据 */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData(meta, siteInfo, url, image, AUTHOR, router)
          )
        }}
      />

      {/* DNS预取和预连接 */}
      {usesGoogleFonts && (
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      )}
      <link rel='dns-prefetch' href='//www.google-analytics.com' />
      <link rel='dns-prefetch' href='//www.googletagmanager.com' />
      {usesGoogleFonts && (
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      )}

      {/* 字体优化：异步加载 CSS，避免阻塞渲染 */}
      {webFontUrls.map((url, index) => (
        <link
          key={index}
          rel='stylesheet'
          href={url}
          media='print'
          onLoad="this.media='all'"
        />
      ))}
      <noscript>
        {webFontUrls.map((url, index) => (
          <link key={index} rel='stylesheet' href={url} />
        ))}
      </noscript>

      {children}
    </Head>
  )
}

/**
 * 站点发布者（Organization）
 */
const buildOrganization = siteInfo => ({
  '@type': 'Organization',
  '@id': `${siteConfig('LINK')}/#organization`,
  name: siteInfo?.title,
  url: siteConfig('LINK'),
  logo: {
    '@type': 'ImageObject',
    url: siteInfo?.icon
  }
})

/**
 * 作者（Person）
 */
const buildAuthor = (author, siteInfo) => ({
  '@type': 'Person',
  '@id': `${siteConfig('LINK')}/#person`,
  name: author,
  url: siteConfig('LINK')
})

/**
 * 站点级 WebSite 实体（含站内搜索 Action）
 */
const buildWebSite = siteInfo => {
  const website = {
    '@type': 'WebSite',
    '@id': `${siteConfig('LINK')}/#website`,
    name: siteInfo?.title,
    description: siteInfo?.description,
    url: siteConfig('LINK'),
    inLanguage: siteConfig('LANG'),
    publisher: { '@id': `${siteConfig('LINK')}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig('LINK')}/search?s={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
  return website
}

/**
 * 面包屑（BreadcrumbList）
 * @param {Array<{name:string, url?:string}>} items
 */
const buildBreadcrumb = items => {
  if (!items || items.length === 0) return null
  return {
    '@type': 'BreadcrumbList',
    '@id': `${siteConfig('LINK')}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {})
    }))
  }
}

/**
 * 文章（BlogPosting）
 */
const buildBlogPosting = (meta, siteInfo, url, image, author) => {
  const posting = {
    '@type': 'BlogPosting',
    '@id': url,
    headline: meta.title,
    description: meta.description,
    image: {
      '@type': 'ImageObject',
      url: image
    },
    url: url,
    datePublished: meta.publishDay,
    dateModified: meta.lastEditedDay || meta.publishDay,
    author: { '@id': `${siteConfig('LINK')}/#person` },
    publisher: { '@id': `${siteConfig('LINK')}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    keywords: meta.tags?.join(', '),
    articleSection: meta.category,
    inLanguage: siteConfig('LANG'),
    isAccessibleForFree: true
  }
  // 仅当存在真实字数统计时才输出，不注入虚假数据
  if (meta.wordCount && meta.wordCount > 0) {
    posting.wordCount = meta.wordCount
  }
  return posting
}

const buildCollectionPage = (meta, url) => ({
  '@type': 'CollectionPage',
  '@id': url,
  name: meta?.title,
  description: meta?.description,
  url,
  inLanguage: siteConfig('LANG'),
  isPartOf: { '@id': `${siteConfig('LINK')}/#website` }
})

/**
 * 生成结构化数据（@graph 数组形式）
 * - 所有页面：Organization / WebSite / Person
 * - 文章页：追加 BlogPosting + BreadcrumbList
 * - 分类页 / 标签页：追加 BreadcrumbList
 * @param {*} meta
 * @param {*} siteInfo
 * @param {*} url 当前页面净化后的绝对 URL
 * @param {*} image
 * @param {*} author
 * @param {*} router next/router
 * @returns
 */
const generateStructuredData = (meta, siteInfo, url, image, author, router) => {
  const link = siteConfig('LINK').replace(/\/+$/, '')
  const graph = [
    buildOrganization(siteInfo),
    buildAuthor(author, siteInfo),
    buildWebSite(siteInfo)
  ]

  const route = router?.route

  // 文章页：BlogPosting + 面包屑（首页 > 分类 > 文章）
  if (meta?.type === 'Post') {
    graph.push(buildBlogPosting(meta, siteInfo, url, image, author))

    const crumbItems = [{ name: siteInfo?.title || 'Home', url: link }]
    if (meta.category) {
      crumbItems.push({
        name: meta.category,
        url: `${link}/category/${encodeURIComponent(meta.category)}`
      })
    }
    crumbItems.push({ name: meta.title })
    const breadcrumb = buildBreadcrumb(crumbItems)
    if (breadcrumb) graph.push(breadcrumb)
  } else if (
    route === '/archive' ||
    route === '/category' ||
    route === '/tag'
  ) {
    graph.push(buildCollectionPage(meta, url))
  } else if (
    route === '/category/[category]' ||
    route === '/category/[category]/page/[page]'
  ) {
    graph.push(buildCollectionPage(meta, url))
    // 分类页：面包屑（首页 > 分类）
    const category = meta?.categoryName || router?.query?.category
    if (category) {
      const breadcrumb = buildBreadcrumb([
        { name: siteInfo?.title || 'Home', url: link },
        { name: category }
      ])
      if (breadcrumb) graph.push(breadcrumb)
    }
  } else if (route === '/tag/[tag]' || route === '/tag/[tag]/page/[page]') {
    graph.push(buildCollectionPage(meta, url))
    // 标签页：面包屑（首页 > 标签）
    const tag = router?.query?.tag
    if (tag) {
      const breadcrumb = buildBreadcrumb([
        { name: siteInfo?.title || 'Home', url: link },
        { name: tag }
      ])
      if (breadcrumb) graph.push(breadcrumb)
    }
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  }
}

const containsGoogleFontsUrl = fontUrl => {
  const urls = Array.isArray(fontUrl) ? fontUrl : [fontUrl]

  return urls.filter(Boolean).some(url => {
    try {
      return new URL(url).hostname === 'fonts.googleapis.com'
    } catch {
      return false
    }
  })
}

const getAbsoluteImageUrl = (image, siteUrl) => {
  if (typeof image !== 'string') return ''

  const rawImage = image.trim()
  if (!rawImage) return ''
  if (isHttpLink(rawImage) || rawImage.startsWith('data:')) {
    return rawImage
  }

  return createSiteUrl(siteUrl, rawImage) || rawImage
}

const getIsoTime = value => {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString()
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.keyword || router?.query?.s
  const siteMeta = getSiteMetaFallbacks(siteInfo)
  const nav = locale?.NAV || {}
  const common = locale?.COMMON || {}
  const archiveLabel = nav.ARCHIVE || '归档'
  const searchLabel = nav.SEARCH || '搜索'
  const notFoundLabel = nav.PAGE_NOT_FOUND || '页面未找到'
  const categoryLabel = common.CATEGORY || '分类'
  const tagsLabel = common.TAGS || '标签'

  switch (router.route) {
    case '/':
      return {
        title: siteMeta.title,
        description: siteMeta.description,
        image: siteMeta.image,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${archiveLabel} | ${siteMeta.title}`,
        description: `${archiveLabel} | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteMeta.title}`,
        description: `${siteMeta.description} | ${page}`,
        image: siteMeta.image,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${categoryLabel} | ${siteMeta.title}`,
        description: `${category} | ${categoryLabel} | ${siteMeta.description}`,
        slug: 'category/' + category,
        image: siteMeta.image,
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} - 第 ${page} 页 | ${categoryLabel} | ${siteMeta.title}`,
        description: `${category} - 第 ${page} 页 | ${categoryLabel} | ${siteMeta.description}`,
        slug: `category/${category}/page/${page}`,
        image: siteMeta.image,
        type: 'website'
      }
    case '/tag/[tag]':
      return {
        title: `${tag} | ${tagsLabel} | ${siteMeta.title}`,
        description: `${tag} | ${tagsLabel} | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} - 第 ${page} 页 | ${tagsLabel} | ${siteMeta.title}`,
        description: `${tag} - 第 ${page} 页 | ${tagsLabel} | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: `tag/${tag}/page/${page}`,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${searchLabel} | ${siteMeta.title}`,
        description: `使用Algolia提供的搜索服务 | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${searchLabel} | ${siteMeta.title}`,
        description: siteConfig('TITLE'),
        image: siteMeta.image,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteMeta.title} | ${notFoundLabel}`,
        image: siteMeta.image
      }
    case '/tag':
      return {
        title: `${tagsLabel} | ${siteMeta.title}`,
        description: `${tagsLabel} | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${categoryLabel} | ${siteMeta.title}`,
        description: `${categoryLabel} | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: 'category',
        type: 'website'
      }
    default:
      const category = Array.isArray(post?.category)
        ? post?.category?.[0]
        : post?.category
      return {
        title: post
          ? `${post?.title} | ${siteMeta.title}`
          : `${siteMeta.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || siteMeta.image,
        category: normalizeCategory(post?.category),
        tags: post?.tags,
        wordCount: post?.wordCount,
        publishDay: post?.publishDay,
        lastEditedDay: post?.lastEditedDay,
        publishTime:
          getIsoTime(post?.publishDate) ||
          getIsoTime(post?.date?.start_date),
        modifiedTime: getIsoTime(post?.lastEditedTime || post?.lastEditedDate)
      }
  }
}

export { generateStructuredData, getCanonicalUrl, getSEOMeta, getSEORobots }
export default SEO
