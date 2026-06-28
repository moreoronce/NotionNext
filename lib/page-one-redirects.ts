export const getPageOneRedirectPath = (pathname: string) => {
  if (pathname === '/page/1' || pathname === '/page/1/') {
    return '/'
  }

  const pageOneMatch = pathname.match(
    /^\/(tag|category|search)\/([^/]+)\/page\/1\/?$/
  )
  if (!pageOneMatch) {
    return null
  }

  return `/${pageOneMatch[1]}/${pageOneMatch[2]}`
}
