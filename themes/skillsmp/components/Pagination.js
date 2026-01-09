import SmartLink from '@/components/SmartLink'

/**
 * 分页组件
 */
export default function Pagination({ page, totalPage, prefix = '' }) {
    if (!totalPage || totalPage <= 1) return null

    const pages = []
    const showPages = 5
    let start = Math.max(1, page - Math.floor(showPages / 2))
    let end = Math.min(totalPage, start + showPages - 1)

    if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    const getPageUrl = (p) => {
        if (p === 1) return prefix || '/'
        return `${prefix}/page/${p}`
    }

    return (
        <div className="pagination">
            {/* 上一页 */}
            {page > 1 && (
                <SmartLink href={getPageUrl(page - 1)} className="pagination-btn">
                    ← 上一页
                </SmartLink>
            )}

            {/* 页码 */}
            {pages.map(p => (
                <SmartLink
                    key={p}
                    href={getPageUrl(p)}
                    className={`pagination-btn ${p === page ? 'active' : ''}`}
                >
                    {p}
                </SmartLink>
            ))}

            {/* 下一页 */}
            {page < totalPage && (
                <SmartLink href={getPageUrl(page + 1)} className="pagination-btn">
                    下一页 →
                </SmartLink>
            )}
        </div>
    )
}



