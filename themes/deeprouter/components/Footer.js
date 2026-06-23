import { siteConfig } from '@/lib/config'
import { useState, useEffect } from 'react'
import SmartLink from '@/components/SmartLink'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import CONFIG from '../config'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

/**
 * 页脚组件 - 终端目录列表风格
 */
export default function Footer({ notice }) {
    const since = siteConfig('SINCE')
    const [currentYear, setCurrentYear] = useState(since || '2024')
    const footerBrand = siteConfig('DEEPROUTER_FOOTER_BRAND', siteConfig('TITLE'), CONFIG)
    const footerDescription = siteConfig('DEEPROUTER_FOOTER_DESCRIPTION', siteConfig('DESCRIPTION'), CONFIG)
    const englishUrl = siteConfig('DEEPROUTER_FOOTER_EN_URL', '', CONFIG)
    const nowUrl = siteConfig('DEEPROUTER_FOOTER_NOW_URL', '', CONFIG)
    const wechatQr = siteConfig('DEEPROUTER_FOOTER_WECHAT_QR', '', CONFIG)
    const wechatQrWidth = 327
    const wechatQrHeight = 112

    useEffect(() => {
        setCurrentYear(new Date().getFullYear())
    }, [])

    const yearRange = since && since !== currentYear ? `${since} - ${currentYear}` : currentYear

    return (
        <footer className="border-t border-[#E5E5E5] py-12 mt-16 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto px-4">
                {/* 终端风格目录结构 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {/* README 部分 - 支持 Notion 公告 */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 font-mono text-sm text-[#666666]">
                            <span className="text-[#ea580c]">$</span>
                            <span className="select-none">cat README.md</span>
                        </div>
                        <div className="font-mono text-sm space-y-2 text-[#4A4A4A]">
                            {notice && notice.blockMap ? (
                                <div className="notice-content font-mono text-[#4B5563]">
                                    <NotionPage post={notice} className="text-left" />
                                </div>
                            ) : (
                                <>
                                    <p className="text-[#4A4A4A]">
                                        <span className="text-[#c2410c]">#</span> {footerBrand || 'README'}
                                    </p>
                                    {footerDescription && (
                                        <p className="text-[#666666]">
                                            {footerDescription}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* 资源目录 */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 font-mono text-sm text-[#666666]">
                            <span className="text-[#ea580c]">$</span>
                            <span>ls ./resources/</span>
                        </div>
                        <div className="font-mono text-sm space-y-2">
                            <SmartLink href="/archive" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#ea580c] transition-colors">
                                <span>📄</span> posts/
                            </SmartLink>
                            <SmartLink href="/category" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#ea580c] transition-colors">
                                <span>📁</span> categories/
                            </SmartLink>
                            <SmartLink href="/tag" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#ea580c] transition-colors">
                                <span>🏷️</span> tags/
                            </SmartLink>
                            {englishUrl && (
                                <a href={englishUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#ea580c] transition-colors">
                                    <span>🇺🇸</span> English Version
                                </a>
                            )}
                            {nowUrl && (
                                <a href={nowUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#ea580c] transition-colors">
                                    <span>⚡</span> Now
                                </a>
                            )}
                        </div>
                    </div>

                    {/* 微信公众号 */}
                    {wechatQr && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 font-mono text-sm text-[#666666]">
                                <span className="text-[#ea580c]">$</span>
                                <span>follow --wechat</span>
                            </div>
                            <div
                                className="relative w-full max-w-[327px] overflow-hidden rounded-lg"
                                style={{ aspectRatio: `${wechatQrWidth} / ${wechatQrHeight}` }}
                            >
                                <Image
                                    src={wechatQr}
                                    alt="微信公众号二维码"
                                    width={wechatQrWidth}
                                    height={wechatQrHeight}
                                    className="block h-full w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 底部版权 */}
                <div className="border-t border-[#E5E5E5] pt-6">
                    <div className="font-mono text-xs text-[#666666] text-center">
                        <span className="text-[#c2410c]">{'/*'}</span>
                        <span className="mx-2">© {yearRange} {siteConfig('TITLE')}</span>
                        <span className="mx-2">•</span>
                        <span>Powered by <a href="https://github.com/tangly1024/NotionNext" target="_blank" rel="noopener noreferrer" className="text-[#c2410c] underline hover:text-[#ea580c]">NotionNext</a></span>
                        <span className="text-[#c2410c] ml-2">{'*/'}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
