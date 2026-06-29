const archiveLinksStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
}

export const getArchiveSeoPosts = nextData => {
  if (nextData?.page !== '/archive') {
    return []
  }

  const posts = nextData?.props?.pageProps?.posts
  if (!Array.isArray(posts)) {
    return []
  }

  return posts.filter(post => post?.href || post?.slug)
}

export const getArchiveSeoMeta = nextData => {
  if (nextData?.page !== '/archive') {
    return null
  }

  const pageProps = nextData?.props?.pageProps || {}
  const siteInfo = pageProps.siteInfo || {}
  const notionConfig = pageProps.NOTION_CONFIG || {}
  const siteTitle = siteInfo.title || notionConfig.TITLE || 'Deep Router'
  const siteDescription =
    siteInfo.description || notionConfig.DESCRIPTION || siteTitle
  const siteLink = (
    notionConfig.LINK ||
    siteInfo.link ||
    'https://deeprouter.org'
  ).replace(/\/+$/, '')
  const title = `归档 | ${siteTitle}`
  const description = `归档 | ${siteDescription}`
  const url = `${siteLink}/archive`

  return {
    title,
    description,
    url,
    siteTitle
  }
}

export const ArchiveSeoHead = ({ meta }) => {
  if (!meta?.title || !meta?.description) {
    return null
  }

  return (
    <>
      <title>{meta.title}</title>
      <meta name='description' content={meta.description} />
      <meta property='og:title' content={meta.title} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:url' content={meta.url} />
      <meta property='og:site_name' content={meta.siteTitle} />
      <meta property='og:type' content='website' />
      <meta name='twitter:title' content={meta.title} />
      <meta name='twitter:description' content={meta.description} />
      <link rel='canonical' href={meta.url} />
    </>
  )
}

export const ArchiveSeoLinks = ({ posts = [] }) => {
  if (posts.length === 0) {
    return null
  }

  return (
    <nav style={archiveLinksStyle} aria-label='Archive article links'>
      <ul>
        {posts.map(post => (
          <li key={post.id || post.href || post.slug}>
            <a href={post.href || `/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
