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
