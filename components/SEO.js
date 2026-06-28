import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
// import { loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const getSiteMetaFallbacks = siteInfo => ({
  title: siteInfo?.title || siteConfig('TITLE') || '',
  description: siteInfo?.description || siteConfig('DESCRIPTION') || '',
  image: siteInfo?.pageCover || siteConfig('HOME_BANNER_IMAGE') || '/bg_image.jpg'
})

const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  // 去除 LINK / SUB_PATH 可能存在的首尾斜杠，避免拼接出 // 双斜杠
  const link = siteConfig('LINK').replace(/\/+$/, '')
  const subPath = siteConfig('SUB_PATH', '').replace(/^\/+|\/+$/g, '')
  // 子目录部署时的前缀，例如部署在 example.com/blog/ 时为 /blog
  const basePath = siteConfig('PATH')?.length && subPath ? `/${subPath}` : ''
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')
  const webFontUrls = Array.isArray(webFontUrl) ? webFontUrl : webFontUrl ? [webFontUrl] : []
  const usesGoogleFonts = webFontUrls.some(url => url?.includes('fonts.googleapis.com'))

  // 基于 router.asPath 计算净化后的 canonical URL：
  // 去除 query/hash，保证 canonical 精确自指；多语言前缀在静态导出下不存在，asPath 即裸路径
  const cleanPath = (router?.asPath || '/').split('#')[0].split('?')[0]
  const pathSuffix = cleanPath === '/' ? '' : cleanPath
  let url = `${link}${basePath}${pathSuffix}`

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    image = meta.image || '/bg_image.jpg'
    // 确保 image 是绝对 URL（Twitter/Facebook 需要）
    if (image && !image.startsWith('http')) {
      image = `${siteConfig('LINK')}${image}`
    }
  }

  const TITLE = siteConfig('TITLE')
  const AUTHOR = siteConfig('AUTHOR')
  const fallbackMeta = getSiteMetaFallbacks(siteInfo)
  const title = meta?.title || fallbackMeta.title
  const description = meta?.description || fallbackMeta.description
  const type = meta?.type || 'website'
  const category = meta?.category || KEYWORDS // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )
  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)
  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)

  return (
    <Head>
      <meta charSet='UTF-8' />
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <link rel='alternate' type='text/plain' href={`${siteConfig('LINK')}/llms.txt`} title='llms.txt' />
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta name='robots' content='follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1' />
      <meta charSet='UTF-8' />
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
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='NotionNext' />

      {/* 语言和地区 */}
      <meta httpEquiv='content-language' content={siteConfig('LANG')} />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />
      {siteConfig('GEO_PLACENAME', '', NOTION_CONFIG) && (
        <meta name='geo.placename' content={siteConfig('GEO_PLACENAME', '', NOTION_CONFIG)} />
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
      <meta name='twitter:site' content={siteConfig('TWITTER_SITE', '@NotionNext')} />
      <meta name='twitter:creator' content={siteConfig('TWITTER_CREATOR', '@NotionNext')} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:image:alt' content={title} />

      <link rel='icon' href={BLOG_FAVICON} />
      <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

      {/* 文章特定元数据 */}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:modified_time' content={meta.lastEditedDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />
        </>
      )}

      {/* 结构化数据 */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(meta, siteInfo, url, image, AUTHOR, router))
        }}
      />

      {/* DNS预取和预连接 */}
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link rel='dns-prefetch' href='//www.google-analytics.com' />
      <link rel='dns-prefetch' href='//www.googletagmanager.com' />
      {usesGoogleFonts && <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />}

      {/* 字体优化：异步加载 CSS，避免阻塞渲染 */}
      {webFontUrls.map((url, index) => (
        <link
          key={index}
          rel="stylesheet"
          href={url}
          media="print"
          onLoad="this.media='all'"
        />
      ))}
      <noscript>
        {webFontUrls.map((url, index) => (
          <link key={index} rel="stylesheet" href={url} />
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
    publisher: { '@id': `${siteConfig('LINK')}/#organization` }
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
        url: `${link}/category/${meta.category}`
      })
    }
    crumbItems.push({ name: meta.title })
    const breadcrumb = buildBreadcrumb(crumbItems)
    if (breadcrumb) graph.push(breadcrumb)
  } else if (route === '/category/[category]' || route === '/category/[category]/page/[page]') {
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

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s
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
        title: `${category} | ${categoryLabel} | ${siteMeta.title}`,
        description: `${category} | ${categoryLabel} | ${siteMeta.description}`,
        slug: 'category/' + category,
        image: siteMeta.image,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${tagsLabel} | ${siteMeta.title}`,
        description: `${tag} | ${tagsLabel} | ${siteMeta.description}`,
        image: siteMeta.image,
        slug: 'tag/' + tag,
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
      return {
        title: post
          ? `${post?.title} | ${siteMeta.title}`
          : `${siteMeta.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || siteMeta.image,
        category: post?.category?.[0],
        tags: post?.tags,
        wordCount: post?.wordCount
      }
  }
}

export { getSEOMeta }
export default SEO
