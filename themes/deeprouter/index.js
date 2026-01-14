/**
 * DeepRouter 主题
 * 终端风格浅色博客主题
 */

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import SmartLink from '@/components/SmartLink'
import { useRef } from 'react'
import dynamic from 'next/dynamic'

// 动态导入 - 减少首屏 JS 体积
const NotionPage = dynamic(() => import('@/components/NotionPage'), { ssr: true })
const PageFindSearchModal = dynamic(() => import('@/components/PageFindSearchModal'), { ssr: false })
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })

// 主题组件导入
import { Style } from './style'
import CONFIG from './config'
import Header from './components/Header'
import Footer from './components/Footer'
import PostCard from './components/PostCard'
import Pagination from './components/Pagination'
import SearchBox from './components/SearchBox'
import CategoryGrid from './components/CategoryGrid'
import TagCloud from './components/TagCloud'
import Breadcrumb from './components/Breadcrumb'
import TerminalCard from './components/TerminalCard'
import { formatDateFmt } from '@/lib/utils/formatDate'

// 非首屏组件 - 动态加载
const TableOfContents = dynamic(() => import('./components/TableOfContents'), { ssr: false })
const RelatedPosts = dynamic(() => import('./components/RelatedPosts'), { ssr: false })
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false })
const BackToTop = dynamic(() => import('./components/BackToTop'), { ssr: false })

// 主题全局状态
const ThemeGlobalDeepRouter = createContext()
export const useDeepRouterGlobal = () => useContext(ThemeGlobalDeepRouter)

/**
 * 基础布局 - 被 _app.js 调用
 */
const LayoutBase = props => {
    const { children } = props
    const { fullWidth } = useGlobal()
    const searchModal = useRef(null)

    return (
        <ThemeGlobalDeepRouter.Provider value={{ searchModal }}>
            {/* 搜索弹窗 - 使用 PageFind */}
            <PageFindSearchModal cRef={searchModal} />

            {/* CSS样式 */}
            <Style />

            <div
                id='theme-deeprouter'
                className='bg-[#FAFAFA] w-full h-full min-h-screen font-mono text-[#1A1A1A]'>

                {/* 顶部导航栏 */}
                <Header {...props} onSearch={() => searchModal.current?.openSearch()} />

                {/* 主内容区 */}
                <main
                    id='container-wrapper'
                    className={`${fullWidth ? '' : 'max-w-7xl'} mx-auto px-4 py-8 min-h-screen`}>
                    {children}
                </main>

                {/* 底部 */}
                <Footer notice={props.notice} />

                {/* 返回顶部按钮 */}
                <BackToTop />
            </div>
        </ThemeGlobalDeepRouter.Provider>
    )
}

/**
 * 首页
 */
const LayoutIndex = props => {
    return <LayoutPostList {...props} />
}

/**
 * 博客列表
 */
const LayoutPostList = props => {
    const { posts, page = 1, postCount, prefix = '', siteInfo, NOTION_CONFIG, category, tag } = props

    // 计算总页数 (NotionNext 传递 postCount 而不是 totalPage)
    const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
    const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)

    // 确定页面类型和标题
    const isCategory = prefix?.includes('/category') || category
    const isTag = prefix?.includes('/tag') || tag
    const pageTitle = category || tag

    return (
        <>
            {/* SEO: 页面 H1 */}
            {isCategory && pageTitle && (
                <h1 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                    <span>📁</span> 分类: {pageTitle}
                </h1>
            )}
            {isTag && pageTitle && (
                <h1 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                    <span>🏷️</span> 标签: {pageTitle}
                </h1>
            )}
            {!isCategory && !isTag && page == 1 && (
                <h1 className='sr-only'>{siteInfo?.title} - {siteInfo?.description}</h1>
            )}

            {/* 文章列表 */}
            <div className='space-y-4'>
                {posts?.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                ))}
            </div>

            {/* 分页 */}
            <Pagination page={parseInt(page)} totalPage={totalPage} prefix={prefix} />
        </>
    )
}

/**
 * 文章详情
 */
const LayoutSlug = props => {
    const { post, prev, next, lock, validPassword, recommendPosts = [] } = props

    if (!post) {
        return <div className='text-center py-20 text-[#666666]'>Loading...</div>
    }

    const fileName = post.slug ? `${post.slug}.md` : 'ARTICLE.md'

    return (
        <>
            {/* 面包屑 - 终端风格 */}
            <div className='text-sm mb-4 font-mono'>
                <span className='text-[#666666]'>$ pwd: ~ / </span>
                {post.category && (
                    <>
                        <SmartLink href={`/category/${post.category}`} className='text-[#cc7a60] hover:underline'>
                            {post.category}
                        </SmartLink>
                        <span className='text-[#666666]'> / </span>
                    </>
                )}
                <span className='text-[#1A1A1A]'>{post.slug}</span>
            </div>

            {/* 主布局: 内容 + 侧边栏 */}
            <div className='flex gap-8'>
                {/* 左侧主内容 */}
                <div className='flex-1 min-w-0'>
                    {/* 1. 文章基本信息 (无卡片包裹) */}
                    <div>
                        {/* H1 标题 */}
                        <h1 className='text-3xl font-bold text-[#cc7a60] mb-3'>
                            {post.title}
                        </h1>

                        {/* 描述 - 注释风格 */}
                        {post.summary && (
                            <p className='text-[#6B6B6B] mb-4 leading-relaxed'>
                                <span className='text-[#666666]'>// </span>
                                {post.summary}
                            </p>
                        )}

                        {/* Git log 风格信息栏 */}
                        <div className='mb-6'>
                            <TerminalCard title="git-status.log" readonly>
                                <div className='text-sm text-[#6B6B6B] font-mono'>
                                    <span className='text-[#666666]'>$ git log --oneline --stat</span>
                                    <div className='flex flex-wrap gap-4 mt-2'>
                                        {post.category && (
                                            <span>
                                                <span className='text-[#cc7a60]'>📁 category:</span> {post.category}
                                            </span>
                                        )}
                                        <span>
                                            <span className='text-[#cc7a60]'>📅 updated:</span> {formatDateFmt(post.lastEditedDate || post.publishDate || post.date, 'yyyy-MM-dd')}
                                        </span>
                                        {post.tags?.length > 0 && (
                                            <span>
                                                <span className='text-[#cc7a60]'>🏷️ tags:</span> {post.tags.slice(0, 3).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </TerminalCard>
                        </div>
                    </div>

                    {/* 文章锁 */}
                    {lock && <ArticleLock validPassword={validPassword} />}

                    {/* 2. 文章正文卡片 */}
                    {!lock && (
                        <div className='mt-8'>
                            <TerminalCard title={fileName} readonly>
                                <article id='article-wrapper' className='article-content flow-root'>
                                    {post && <NotionPage post={post} />}
                                </article>
                            </TerminalCard>
                        </div>
                    )}

                    {/* 7. 上一篇/下一篇导航 */}
                    <div className='flex justify-between mt-12 pt-6 border-t border-[#E8E4DC] text-sm'>
                        {prev ? (
                            <SmartLink href={prev.href || `/${prev.slug}`} className='flex items-center gap-2 text-[#ea580c] hover:underline'>
                                ← {prev.title}
                            </SmartLink>
                        ) : <div />}
                        {next ? (
                            <SmartLink href={next.href || `/${next.slug}`} className='flex items-center gap-2 text-[#ea580c] hover:underline'>
                                {next.title} →
                            </SmartLink>
                        ) : <div />}
                    </div>

                    {/* 评论区 */}
                    {!lock && (
                        <div className='mt-12'>
                            <TerminalCard title="comments.log" readonly>
                                <Comment frontMatter={post} />
                            </TerminalCard>
                        </div>
                    )}
                </div>

                {/* 右侧边栏 */}
                <aside className='hidden lg:block w-80 flex-shrink-0 space-y-6 sticky top-24 self-start'>
                    {/* package.json 风格信息卡 */}
                    <div className='terminal-card'>
                        <div className='terminal-header'>

                            <span className='terminal-title'>package.json</span>
                        </div>
                        <div className='terminal-body text-sm'>
                            <div className='flex items-center gap-2 mb-3'>
                                <span className='w-6 h-6 bg-[#E74C3C] rounded-full flex items-center justify-center text-white text-xs'>📦</span>
                                <div>
                                    <div className='text-[#ea580c]'>"author": "{post.author || siteConfig('AUTHOR')}"</div>
                                    <div className='text-[#ea580c]'>"category": "{post.category || 'Blog'}"</div>
                                </div>
                            </div>
                            <button className='w-full py-2 px-3 bg-[#FEF3E2] border border-[#E8E4DC] rounded text-sm text-[#4A4A4A] hover:bg-[#EDE8E0] transition'>
                                📋 $ gh browse
                            </button>
                        </div>
                    </div>

                    {/* 文章目录 */}
                    {post.toc?.length > 0 && (
                        <TerminalCard title="catalog" readonly>
                            <TableOfContents toc={post.toc} />
                        </TerminalCard>
                    )}

                    {/* related-imports.ts 风格相关文章 */}
                    {recommendPosts?.length > 0 && (
                        <div className='terminal-card'>
                            <div className='terminal-header'>
                                <div className='terminal-dots'>
                                    <span className='terminal-dot red'></span>
                                    <span className='terminal-dot yellow'></span>
                                    <span className='terminal-dot green'></span>
                                </div>
                                <span className='terminal-title'>related-imports.ts</span>
                            </div>
                            <div className='terminal-body'>
                                <div className='text-[#666666] text-xs mb-3'>// Related Skills</div>
                                <div className='space-y-3'>
                                    {recommendPosts.slice(0, 5).map(rPost => (
                                        <SmartLink
                                            key={rPost.id}
                                            href={rPost.href || `/${rPost.slug}`}
                                            className='flex items-start gap-2 text-sm group'
                                        >
                                            <span className='w-6 h-6 bg-[#ea580c] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0'>📄</span>
                                            <div className='min-w-0'>
                                                <div className='text-[#0d9488] group-hover:underline'>import <span className='text-[#ea580c]'>{rPost.title?.slice(0, 20)}</span></div>
                                                <div className='text-[#ea580c] text-xs truncate'>from "{rPost.category || 'posts'}"</div>
                                            </div>
                                        </SmartLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </>
    )
}

/**
 * 搜索页
 */
const LayoutSearch = props => {
    const { posts, keyword } = props

    return (
        <>
            {/* SEO: 搜索页 H1 */}
            <h1 className='text-2xl font-bold mb-6'>
                <span className='text-[#666666]'>// </span>搜索
                {keyword && <span className='text-[#ea580c] ml-2'>"{keyword}"</span>}
            </h1>

            {/* 搜索框 */}
            <div className='mb-8'>
                <SearchBox keyword={keyword} />
            </div>

            {/* 搜索结果 */}
            {keyword && (
                <div className='mb-4 text-[#6B6B6B]'>
                    找到 {posts?.length || 0} 篇相关文章
                </div>
            )}

            <div className='space-y-4'>
                {posts?.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                ))}
            </div>
        </>
    )
}

/**
 * 归档页
 */
const LayoutArchive = props => {
    const { posts } = props

    // 按年月分组
    const groups = {}
    posts?.forEach(post => {
        const date = new Date(post.publishDate || post.date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const key = `${year}-${month.toString().padStart(2, '0')}`
        if (!groups[key]) groups[key] = []
        groups[key].push(post)
    })

    return (
        <>
            <h1 className='text-2xl font-bold mb-6'>
                <span className='text-[#666666]'>// </span>归档
                <span className='text-[#666666] text-base ml-4'>共 {posts?.length || 0} 篇</span>
            </h1>

            <div className='space-y-8'>
                {Object.keys(groups).sort().reverse().map(key => (
                    <div key={key}>
                        <h2 className='text-lg font-semibold text-[#ea580c] mb-3'>{key}</h2>
                        <div className='space-y-2 border-l-2 border-[#E5E5E5] pl-4'>
                            {groups[key].map(post => (
                                <div key={post.id} className='flex items-center gap-3 text-sm'>
                                    <span className='text-[#666666] w-20'>
                                        {formatDateFmt(post.publishDate || post.date, 'MM-dd')}
                                    </span>
                                    <SmartLink
                                        href={post.href || `/${post.slug}`}
                                        className='text-[#1A1A1A] hover:text-[#ea580c]'
                                    >
                                        {post.title}
                                    </SmartLink>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

/**
 * 分类索引页
 */
const LayoutCategoryIndex = props => {
    const { categoryOptions } = props

    return (
        <>
            {/* SEO: 隐藏的 H1 */}
            <h1 className='sr-only'>分类目录</h1>

            {/* 终端风格标题 */}
            <div className='mb-6'>
                <div className='font-mono text-sm text-[#666666]'>
                    <span className='text-[#cc7a60]'>$</span> ls ./categories/
                </div>
            </div>

            {/* 分类网格 */}
            <CategoryGrid categories={categoryOptions} />
        </>
    )
}

/**
 * 标签索引页
 */
const LayoutTagIndex = props => {
    const { tagOptions } = props

    return (
        <>
            {/* SEO: 隐藏的 H1 */}
            <h1 className='sr-only'>标签索引</h1>

            {/* 终端风格标题 */}
            <div className='mb-6'>
                <div className='font-mono text-sm text-[#666666]'>
                    <span className='text-[#cc7a60]'>$</span> ls ./tags/
                </div>
            </div>

            {/* 标签云 */}
            <TagCloud tags={tagOptions} />
        </>
    )
}

/**
 * 404页面
 */
const Layout404 = props => {
    return (
        <div className='text-center py-20'>
            <TerminalCard title='error.log'>
                <div className='py-8'>
                    <div className='text-6xl font-bold text-[#E74C3C] mb-4'>404</div>
                    <div className='text-[#6B6B6B] mb-6'>
                        <span className='text-[#ea580c]'>Error:</span> Page not found
                    </div>
                    <SmartLink
                        href='/'
                        className='inline-block px-6 py-2 bg-[#ea580c] text-white rounded-md hover:bg-[#c2410c] transition-colors'
                    >
                        返回首页
                    </SmartLink>
                </div>
            </TerminalCard>
        </div>
    )
}

export {
    LayoutBase,
    LayoutIndex,
    LayoutPostList,
    LayoutSlug,
    LayoutSearch,
    LayoutArchive,
    LayoutCategoryIndex,
    LayoutTagIndex,
    Layout404,
    CONFIG as THEME_CONFIG
}



