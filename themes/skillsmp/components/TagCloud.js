import SmartLink from '@/components/SmartLink'

/**
 * 标签云 - import 风格
 */
export default function TagCloud({ tags }) {
    if (!tags || tags.length === 0) return null

    return (
        <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
                <SmartLink
                    key={tag.name}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    className="inline-flex items-center px-3 py-2 
                     bg-white border border-[#E5E5E5] rounded-md
                     hover:border-[#a35a3a] transition-colors group"
                >
                    <span className="text-[#C97A4A] mr-1">import</span>
                    <span className="text-[#a35a3a] group-hover:underline">'{tag.name}'</span>
                    <span className="text-[#666666] ml-2">[{tag.count}]</span>
                </SmartLink>
            ))}
        </div>
    )
}



