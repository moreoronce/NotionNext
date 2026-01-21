import SmartLink from '@/components/SmartLink'
import TerminalCard from './TerminalCard'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 文章卡片 - JSON 模块风格
 */
export default function PostCard({ post, index = 0 }) {
    if (!post) return null

    const fileName = post.slug ? `${post.slug}.tsx` : 'module.tsx'

    return (
        <SmartLink href={post.href || `/${post.slug}`} className="block mb-4 group">
            <div
                className="terminal-card"
                style={{
                    contentVisibility: 'auto',
                    containIntrinsicSize: '0 280px'
                }}
            >
                {/* 文件标题栏 */}
                <div className="terminal-header">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#27C93F]"></span>
                    </div>
                    <span className="terminal-title font-mono">{fileName}</span>
                </div>

                {/* JSON 模块风格内容 - 带行号 */}
                <div className="terminal-body font-mono text-sm p-4">
                    <CodeRow line={1}>
                        <div className="mb-0">
                            <span style={{ color: 'lab(52.0183% 66.11 -78.2316)' }}>name: </span>
                            <h2 className="inline font-mono font-semibold text-[#111827] text-base">
                                '{post.title}'
                            </h2>
                        </div>
                    </CodeRow>

                    {post.summary && (
                        <CodeRow line={2}>
                            <div className="mb-0">
                                <span className="text-[#cc7a60]">desc: </span>
                                <span className="font-mono text-[#4B5563] line-clamp-2 inline max-w-[90%] align-top">
                                    '{post.summary}'
                                </span>
                            </div>
                        </CodeRow>
                    )}
                </div>

                {/* 底部信息栏 - 独立区域 */}
                <div className="border-t border-[#E5E7EB] px-4 py-3 flex items-center justify-between bg-white text-sm text-[#6B7280]">
                    <span>{formatDateFmt(post.publishDate || post.date, 'yyyy-MM-dd')}</span>

                    {/* Tags & Categories 互换位置：Tags在前，Category在后 */}
                    <div className="flex items-center gap-2">
                        {post.tags?.slice(0, 3).map((tag, idx) => (
                            <span key={tag} className="text-xs text-[#6B7280] hover:text-[#cc7a60] transition-colors">
                                #{tag}
                            </span>
                        ))}
                        {post.category && (
                            <span className="px-2 py-0.5 rounded text-xs border border-[#E5E7EB] bg-gray-50 text-[#4B5563]">
                                {post.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </SmartLink>
    )
}

// 辅助组件：代码行结构
const CodeRow = ({ line, children }) => (
    <div className="flex gap-4 min-h-[1.5em]">
        <div className="flex-none w-6 text-right text-[#9CA3AF] select-none border-r border-[#E5E7EB] pr-3 leading-6 font-mono text-xs pt-[2px]">
            {line}
        </div>
        <div className="flex-1 min-w-0 leading-6 break-words">
            {children}
        </div>
    </div>
)
