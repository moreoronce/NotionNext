import { useState, useEffect } from 'react'

/**
 * 返回顶部按钮 - 终端命令风格
 * $ cd ⬆ top
 */
export default function BackToTop() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!show) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                       flex items-center gap-2 px-4 py-2
                       bg-white/80 backdrop-blur-md border border-[#E5E5E5] rounded-lg shadow-lg
                       font-mono text-sm
                       hover:border-[#cc7a60] hover:shadow-xl
                       transition-all duration-300"
            aria-label="返回顶部"
        >
            <span className="text-[#cc7a60]">$</span>
            <span className="text-[#1A1A1A]">cd</span>
            <span className="text-[#cc7a60]">⬆</span>
            <span className="text-[#cc7a60]">top</span>
        </button>
    )
}
