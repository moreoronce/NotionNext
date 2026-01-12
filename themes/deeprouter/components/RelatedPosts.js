import SmartLink from '@/components/SmartLink'
import TerminalCard from './TerminalCard'

/**
 * 相关文章列表 - 暖色系
 */
export default function RelatedPosts({ posts }) {
    if (!posts || posts.length === 0) return null

    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">相关文章</h3>
            <div className="space-y-2">
                {posts.slice(0, 5).map((post, index) => (
                    <SmartLink
                        key={index}
                        href={post.href || `/${post.slug}`}
                        className="flex items-center gap-2 text-sm group"
                    >
                        <span className="text-[#cc7a60]">import</span>
                        <span className="text-[#ea580c] group-hover:underline truncate">
                            '{post.title}'
                        </span>
                    </SmartLink>
                ))}
            </div>
        </div>
    )
}
