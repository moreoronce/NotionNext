import SmartLink from '@/components/SmartLink'

/**
 * 分类网格 - 终端文件卡片风格
 */
export default function CategoryGrid({ categories }) {
    if (!categories || categories.length === 0) return null

    // 将分类名转为 kebab-case 文件名
    const toFileName = (name) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, '-') + '.ts'
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(category => (
                <SmartLink
                    key={category.name}
                    href={`/category/${encodeURIComponent(category.name)}`}
                    className="block"
                >
                    <div className="terminal-card">
                        {/* 文件头部 */}
                        <div className="terminal-header">
                            <span className="terminal-title font-mono text-xs">
                                {toFileName(category.name)}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6] ml-auto"></span>
                        </div>
                        {/* 代码内容 */}
                        <div className="p-4 font-mono text-sm">
                            <div className="mb-1">
                                <span className="text-[#cc7a60]">import</span>
                                <span className="text-[#1A1A1A] font-semibold ml-2">{category.name}</span>
                            </div>
                            <div className="text-[#cc7a60]">
                                // {category.count} 篇文章
                            </div>
                        </div>
                    </div>
                </SmartLink>
            ))}
        </div>
    )
}
