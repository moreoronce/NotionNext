import BLOG from '@/blog.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { createLlmsTxt } from '@/lib/llms-utils'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'

export const getServerSideProps = async ctx => {
  const siteIds = BLOG.NOTION_PAGE_ID.split(',')
  const contents = []

  for (let index = 0; index < siteIds.length; index++) {
    const siteId = siteIds[index]
    const id = extractLangId(siteId)
    const locale = extractLangPrefix(siteId)
    const siteData = await fetchGlobalAllData({
      pageId: id,
      from: 'llms.txt'
    })

    contents.push(createLlmsTxt({ ...siteData, locale }))
  }

  const body = contents.filter(Boolean).join('\n---\n')

  ctx.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  ctx.res.write(body)
  ctx.res.end()

  return { props: {} }
}

const LlmsTxt = () => null

export default LlmsTxt
