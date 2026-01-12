import { useEffect, useState } from 'react'

/**
 * 文章目录组件 - 暖色系
 */
export default function TableOfContents({ toc }) {
    const [activeId, setActiveId] = useState('')

    useEffect(() => {
        if (!toc || toc.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0px -80% 0px' }
        )

        toc.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [toc])

    if (!toc || toc.length === 0) return null

    return (
        <div className="">
            <nav className="space-y-1">
                {toc.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm py-1 transition-colors
                            ${item.level === 2 ? 'pl-0' : 'pl-3'}
              ${activeId === item.id
                                ? 'text-[#ea580c] font-medium'
                                : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
                            }`}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    )
}
