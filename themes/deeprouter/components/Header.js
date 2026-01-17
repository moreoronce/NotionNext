import React, { useState } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 顶部导航栏 - 终端命令风格
 */
export default function Header(props) {
    const { customNav, customMenu, categoryOptions, tagOptions } = props
    const { locale } = useGlobal()

    // 终端命令风格导航
    const defaultLinks = [
        { name: '首页', cmd: 'cd /home', href: '/', show: true },
        { name: '文章', cmd: 'ls ./posts', href: '/archive', show: true },
        {
            name: '分类',
            cmd: 'cd /categories',
            href: '/category',
            show: siteConfig('DEEPROUTER_MENU_CATEGORY', null, CONFIG),
            subMenus: categoryOptions?.map(c => ({
                title: `${c.name} (${c.count})`,
                href: `/category/${c.name}`
            }))
        },
        {
            name: '标签',
            cmd: 'grep tags',
            href: '/tag',
            show: siteConfig('DEEPROUTER_MENU_TAG', null, CONFIG),
            subMenus: tagOptions?.slice(0, 15).map(t => ({
                title: `${t.name} (${t.count})`,
                href: `/tag/${t.name}`
            }))
        },
        { name: '搜索', cmd: 'ai --search', href: '/search', show: siteConfig('DEEPROUTER_MENU_SEARCH', null, CONFIG) }
    ]

    let links = defaultLinks.concat(customNav || [])

    if (siteConfig('CUSTOM_MENU')) {
        links = customMenu || links
    }

    const telegramUrl = siteConfig('DEEPROUTER_TELEGRAM_URL', null, CONFIG)
    const twitterUrl = siteConfig('DEEPROUTER_TWITTER_URL', null, CONFIG)

    return (
        <header className="sticky top-0 z-50 bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[rgba(0,0,0,0.05)]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo - 带闪烁光标 */}
                <SmartLink href="/" className="flex items-center gap-2 text-lg font-semibold text-[#1A1A1A] hover:text-[#1A1A1A]">
                    <span className="text-[#cc7a60]">&gt;_</span>
                    <span>{siteConfig('TITLE') || 'DeepRouter'}</span>
                    <span className="w-2 h-5 bg-[#ea580c] animate-[cursor-blink_1s_ease-in-out_infinite]"></span>
                </SmartLink>

                {/* 导航菜单 - 终端命令风格 */}
                <nav className="hidden md:flex items-center gap-3">
                    {links?.filter(link => link.show).map((link, index) => {
                        if (link.subMenus && link.subMenus.length > 0) {
                            return (
                                <div key={index} className="relative group pb-2 pt-2">
                                    <SmartLink
                                        href={link.href}
                                        className="nav-cmd-btn"
                                    >
                                        <span className="cmd-prefix">$</span>
                                        <span>{link.cmd || link.name}</span>
                                        <svg className="w-3 h-3 text-[#666666] group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </SmartLink>
                                    <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-44 bg-white border border-[#E5E5E5] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                                        <div className="py-1">
                                            {link.subMenus.map((sub, idx) => (
                                                <SmartLink
                                                    key={idx}
                                                    href={sub.href}
                                                    className="block px-4 py-2 text-sm text-[#4B5563] hover:bg-[rgba(204,122,96,0.08)] hover:text-[#cc7a60] truncate"
                                                >
                                                    <span className="text-[#cc7a60] mr-2">→</span>
                                                    {sub.title}
                                                </SmartLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <SmartLink
                                key={index}
                                href={link.href}
                                className="nav-cmd-btn"
                                onClick={(e) => {
                                    if (link.href === '/search') {
                                        e.preventDefault()
                                        props.onSearch?.()
                                    }
                                }}
                            >
                                <span className="cmd-prefix">$</span>
                                <span>{link.cmd || link.name}</span>
                            </SmartLink>
                        )
                    })}
                </nav>

                {/* 社交按钮 - 移动端仅图标，桌面端图标+文字 */}
                <div className="social-buttons flex items-center gap-2">
                    {telegramUrl && (
                        <a
                            href={telegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="telegram-btn"
                            aria-label="Telegram"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                            <span className="hidden md:inline">Telegram</span>
                        </a>
                    )}
                    {twitterUrl && (
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="twitter-btn"
                            aria-label="X.com"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="hidden md:inline">X.com</span>
                        </a>
                    )}
                </div>

                {/* 移动端菜单按钮 */}
                <MobileMenuButton links={links} telegramUrl={telegramUrl} twitterUrl={twitterUrl} onSearch={props.onSearch} />
            </div>
        </header>
    )
}

/**
 * 移动端菜单按钮 - 终端风格
 */
function MobileMenuButton({ links, telegramUrl, twitterUrl, onSearch }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[#0d9488] hover:text-[#ea580c] transition-colors"
                aria-label={isOpen ? "关闭菜单" : "打开菜单"}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* 移动端菜单 - 终端风格 */}
            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-[#FAFAFA] border-b border-[#E5E5E5] py-4 px-4 shadow-lg">
                    {links?.filter(link => link.show).map((link, index) => (
                        <div key={index}>
                            <SmartLink
                                href={link.href}
                                className="flex items-center gap-2 py-3 text-[#111827] hover:text-[#cc7a60] transition-colors"
                                onClick={(e) => {
                                    setIsOpen(false)
                                    if (link.href === '/search') {
                                        e.preventDefault()
                                        onSearch?.()
                                    }
                                }}
                            >
                                <span className="text-[#cc7a60] font-mono">$</span>
                                <span>{link.cmd || link.name}</span>
                            </SmartLink>
                            {link.subMenus && link.subMenus.length > 0 && (
                                <div className="pl-6 border-l-2 border-[#E5E7EB] ml-3 space-y-1">
                                    {link.subMenus.map((sub, idx) => (
                                        <SmartLink
                                            key={idx}
                                            href={sub.href}
                                            className="flex items-center gap-2 py-2 text-sm text-[#4B5563] hover:text-[#cc7a60]"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="text-[#cc7a60]">→</span>
                                            {sub.title}
                                        </SmartLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {telegramUrl && (
                        <a
                            href={telegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="telegram-btn mt-4 w-full justify-center"
                        >
                            Telegram
                        </a>
                    )}
                    {twitterUrl && (
                        <a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="twitter-btn mt-2 w-full justify-center"
                        >
                            X.com
                        </a>
                    )}
                </div>
            )}
        </div>
    )
}




