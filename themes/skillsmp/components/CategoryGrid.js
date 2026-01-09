import SmartLink from '@/components/SmartLink'

/**
 * 分类网格 - 文件夹风格
 */
export default function CategoryGrid({ categories }) {
    if (!categories || categories.length === 0) return null

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => (
                <SmartLink
                    key={category.name}
                    href={`/category/${encodeURIComponent(category.name)}`}
                    className="folder-card"
                >
                    <span className="folder-icon">📁</span>
                    <span className="folder-name">{category.name}</span>
                    <span className="folder-count">[{category.count}篇]</span>
                </SmartLink>
            ))}
        </div>
    )
}


