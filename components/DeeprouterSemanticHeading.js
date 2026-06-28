import { siteConfig } from '@/lib/config'

const getLang = pageProps =>
  pageProps?.NOTION_CONFIG?.LANG || siteConfig('LANG') || 'zh-CN'

const getLabels = pageProps => {
  const isEnglish = String(getLang(pageProps)).toLowerCase().startsWith('en')
  return isEnglish
    ? {
        archive: 'Archive',
        category: 'Category',
        categoryIndex: 'Category',
        page: 'Page',
        search: 'Search',
        tag: 'Tag',
        tagIndex: 'Tags',
        notFound: 'Page not found'
      }
    : {
        archive: '归档',
        category: '分类',
        categoryIndex: '文章分类',
        page: 'Page',
        search: '搜索',
        tag: '标签',
        tagIndex: '文章标签',
        notFound: '页面未找到'
      }
}

const getSiteTitle = pageProps =>
  pageProps?.siteInfo?.title || siteConfig('TITLE') || ''

export const getDeeprouterSemanticHeading = ({ pageProps = {}, router }) => {
  const route = router?.route
  const labels = getLabels(pageProps)

  if (pageProps?.post?.title) {
    return pageProps.post.title
  }

  if (route === '/') {
    return getSiteTitle(pageProps)
  }

  if (route === '/page/[page]') {
    return `${getSiteTitle(pageProps)} - ${labels.page} ${pageProps.page || router?.query?.page || ''}`.trim()
  }

  if (route === '/archive') {
    return labels.archive
  }

  if (route === '/tag') {
    return labels.tagIndex
  }

  if (route === '/category') {
    return labels.categoryIndex
  }

  if (route === '/tag/[tag]' || route === '/tag/[tag]/page/[page]') {
    const tag = pageProps.tag || router?.query?.tag
    return tag ? `${labels.tag}: ${tag}` : labels.tagIndex
  }

  if (route === '/category/[category]' || route === '/category/[category]/page/[page]') {
    const category = pageProps.category || router?.query?.category
    return category ? `${labels.category}: ${category}` : labels.categoryIndex
  }

  if (route === '/search' || route === '/search/[keyword]' || route === '/search/[keyword]/page/[page]') {
    const keyword = pageProps.keyword || router?.query?.keyword || router?.query?.s
    return keyword ? `${labels.search}: ${keyword}` : labels.search
  }

  if (route === '/404') {
    return labels.notFound
  }

  return getSiteTitle(pageProps)
}

const DeeprouterSemanticHeading = ({ pageProps, router, theme }) => {
  if (theme !== 'deeprouter') return null

  const heading = getDeeprouterSemanticHeading({ pageProps, router })
  if (!heading) return null

  const isPost = Boolean(pageProps?.post?.title)

  return (
    <h1
      className={
        isPost
          ? 'text-3xl font-bold text-[#cc7a60] mb-4'
          : 'text-2xl font-bold text-[#111827] mb-6'
      }>
      {heading}
    </h1>
  )
}

export default DeeprouterSemanticHeading
