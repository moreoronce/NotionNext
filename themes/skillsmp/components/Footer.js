import { siteConfig } from '@/lib/config'
import { useState, useEffect } from 'react'

/**
 * 页脚组件
 */
export default function Footer() {
    const since = siteConfig('SINCE')
    // 使用静态值作为初始值，避免 SSR/CSR hydration 不匹配
    const [currentYear, setCurrentYear] = useState(since || '2024')

    useEffect(() => {
        setCurrentYear(new Date().getFullYear())
    }, [])

    const yearRange = since && since !== currentYear ? `${since} - ${currentYear}` : currentYear

    return (
        <footer className="border-t border-[#E5E5E5] py-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 text-center text-[#666666] text-sm">
                <p>
                    © {yearRange} <span className="text-[#a35a3a]">DeepRouter</span>
                </p>
                <p className="mt-2">
                    Powered by{' '}
                    <a
                        href="https://github.com/tangly1024/NotionNext"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a35a3a] hover:underline"
                    >
                        NotionNext
                    </a>
                </p>
            </div>
        </footer>
    )
}

