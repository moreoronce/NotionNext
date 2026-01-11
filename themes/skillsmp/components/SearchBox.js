import { useState } from 'react'
import { useRouter } from 'next/router'
import TerminalCard from './TerminalCard'

/**
 * 搜索框组件 - 终端风格 (暖色系)
 */
export default function SearchBox({ keyword }) {
    const router = useRouter()
    const [searchValue, setSearchValue] = useState(keyword || '')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchValue.trim()) {
            router.push(`/search/${encodeURIComponent(searchValue)}`)
        }
    }

    return (
        <TerminalCard title="search">
            <form onSubmit={handleSearch} className="flex gap-3">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="搜索文章..."
                    className="flex-1 px-4 py-2 border border-[#E5E5E5] rounded-md 
                     bg-white text-[#1A1A1A] 
                     focus:outline-none focus:border-[#ea580c]
                     placeholder:text-[#666666]"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-[#ea580c] text-white rounded-md 
                     hover:bg-[#c2410c] transition-colors"
                >
                    Search
                </button>
            </form>
        </TerminalCard>
    )
}
