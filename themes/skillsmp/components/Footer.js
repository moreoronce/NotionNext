import { siteConfig } from '@/lib/config'

/**
 * 页脚组件
 */
export default function Footer() {
    const currentYear = new Date().getFullYear()
    const since = siteConfig('SINCE')
    const yearRange = since && since !== currentYear ? `${since} - ${currentYear}` : currentYear

    return (
        <footer className="border-t border-[#E5E5E5] py-8 mt-16">
            <div className="max-w-5xl mx-auto px-4 text-center text-[#8B8B8B] text-sm">
                <p>
                    © {yearRange} <span className="text-[#cc7a60]">DeepRouter</span>
                </p>
                <p className="mt-2">
                    Powered by{' '}
                    <a
                        href="https://github.com/tangly1024/NotionNext"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#cc7a60] hover:underline"
                    >
                        NotionNext
                    </a>
                </p>
            </div>
        </footer>
    )
}

