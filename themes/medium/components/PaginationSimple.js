import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'

/**
 * 简易翻页插件
 * @param page 当前页码
 * @param totalPage 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationSimple = ({ page, totalPage }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  
  // Convert to numbers and validate
  const currentPage = parseInt(page) || 1
  const totalPages = parseInt(totalPage) || 1
  
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null
  }
  
  // Ensure currentPage is within valid bounds
  if (currentPage < 1 || currentPage > totalPages) {
    console.warn(`Invalid page number: ${currentPage}. Total pages: ${totalPages}`)
    return null
  }

  // More robust page prefix calculation - match any page number including 0
  const pagePrefix = router.asPath.split('?')[0].replace(/\/page\/\d+/, '').replace(/\/$/, '')

  return (
    <div className="my-10 flex justify-between font-medium text-black dark:text-gray-100 space-x-2">
      {currentPage > 1 && (
        <SmartLink
          href={{
            pathname: currentPage === 2 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          passHref
          rel="prev"
          className="text-center w-full duration-200 px-4 py-2 hover:border-green-500 border-b-2 hover:font-bold">
          ←{locale.PAGINATION.PREV}
        </SmartLink>
      )}
      {currentPage < totalPages && (
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          passHref
          rel="next"
          className="text-center w-full duration-200 px-4 py-2 hover:border-green-500 border-b-2 hover:font-bold">
          {locale.PAGINATION.NEXT}→
        </SmartLink>
      )}
    </div>
  )
}

export default PaginationSimple