import SmartLink from '@/components/SmartLink'

/**
 * 面包屑导航
 */
export default function Breadcrumb({ items }) {
    if (!items || items.length === 0) return null

    return (
        <nav className="breadcrumb">
            <SmartLink href="/">首页</SmartLink>
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    <span>/</span>
                    {item.href ? (
                        <SmartLink href={item.href}>{item.name}</SmartLink>
                    ) : (
                        <span className="text-[#1A1A1A]">{item.name}</span>
                    )}
                </span>
            ))}
        </nav>
    )
}



