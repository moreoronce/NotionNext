import SmartLink from '@/components/SmartLink'
import TerminalCard from './TerminalCard'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 文章卡片 - 终端代码风格
 */
export default function PostCard({ post, index = 0 }) {
    if (!post) return null

    const fileName = post.slug ? `${post.slug}.md` : 'article.md'

    return (
        <SmartLink href={post.href || `/${post.slug}`} className="block mb-4">
            <TerminalCard title={fileName}>
                <div className="flex">
                    {/* 行号 */}
                    <div className="line-numbers">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <span key={num}>{num}</span>
                        ))}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                        {/* 第1行: export */}
                        <div className="mb-1">
                            <span className="code-keyword">export</span>
                        </div>

                        {/* 第2行: 标题 */}
                        <div className="mb-2">
                            <span className="font-semibold text-[#1A1A1A] text-base">
                                {post.title}
                            </span>
                        </div>

                        {/* 第3-4行: 摘要 */}
                        <div className="text-[#6B6B6B] text-sm mb-3 line-clamp-2">
                            {post.summary || post.description || ''}
                        </div>

                        {/* 第5行: 标签 */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {post.category && (
                                <span className="tag-badge">
                                    {post.category}
                                </span>
                            )}
                            {post.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="tag-badge">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* 第6行: 日期 */}
                        <div className="text-[#8B8B8B] text-xs">
                            {formatDateFmt(post.publishDate || post.date, 'yyyy-MM-dd')}
                        </div>
                    </div>
                </div>
            </TerminalCard>
        </SmartLink>
    )
}

