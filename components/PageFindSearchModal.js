import replaceSearchResult from '@/components/Mark'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash/throttle'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import {
    Fragment,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const ShortCutActions = [
    {
        key: '↑ ↓',
        action: '选择'
    },
    {
        key: 'Enter',
        action: '跳转'
    },
    {
        key: 'Esc',
        action: '关闭'
    }
]

/**
 * 结合 PageFind 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 */
export default function PageFindSearchModal({ cRef }) {
    const [searchResults, setSearchResults] = useState([])
    const [allResults, setAllResults] = useState([]) // 存储所有搜索结果用于分页
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [page, setPage] = useState(0)
    const [keyword, setKeyword] = useState(null)
    const [totalPage, setTotalPage] = useState(0)
    const [totalHit, setTotalHit] = useState(0)
    const [useTime, setUseTime] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [pagefind, setPagefind] = useState(null)

    const inputRef = useRef(null)
    const searchTimer = useRef(null)
    const router = useRouter()

    useEffect(() => {
        // 动态加载 PageFind
        const loadPageFind = async () => {
            try {
                // 使用 eval 绕过 webpack 打包，直接从浏览器加载
                const load = new Function('url', 'return import(url)')
                const pf = await load('/pagefind/pagefind.js')
                console.log('PageFind module loaded:', pf)

                // 初始化 PageFind
                if (pf.init) {
                    await pf.init()
                    console.log('PageFind initialized successfully')
                }

                setPagefind(pf)
                console.log('PageFind set to state')
            } catch (e) {
                console.warn('PageFind failed to load. It might only be available after build.', e)
            }
        }
        loadPageFind()
    }, [])

    /**
     * 快捷键设置
     */
    useHotkeys('ctrl+k', e => {
        e.preventDefault()
        setIsModalOpen(true)
    })

    useHotkeys(
        'down',
        e => {
            if (isInputFocused) {
                e.preventDefault()
                if (activeIndex < searchResults.length - 1) {
                    setActiveIndex(activeIndex + 1)
                }
            }
        },
        { enableOnFormTags: true }
    )

    useHotkeys(
        'up',
        e => {
            if (isInputFocused) {
                e.preventDefault()
                if (activeIndex > 0) {
                    setActiveIndex(activeIndex - 1)
                }
            }
        },
        { enableOnFormTags: true }
    )

    useHotkeys(
        'esc',
        e => {
            if (isInputFocused) {
                e.preventDefault()
                setIsModalOpen(false)
            }
        },
        { enableOnFormTags: true }
    )

    useHotkeys(
        'enter',
        e => {
            if (isInputFocused && searchResults.length > 0) {
                onJumpSearchResult(activeIndex)
            }
        },
        { enableOnFormTags: true }
    )

    // 跳转Search结果
    const onJumpSearchResult = (index) => {
        if (searchResults.length > 0) {
            const searchResult = searchResults[index]
            if (searchResult.url) {
                // PageFind returns full URL or relative path. We ensure it works with Next.js router
                // Typically PageFind returns URL starting with /
                window.location.href = searchResult.url
            }
        }
    }

    const resetSearch = () => {
        setActiveIndex(0)
        setKeyword('')
        setSearchResults([])
        setUseTime(0)
        setTotalPage(0)
        setTotalHit(0)
        if (inputRef.current) inputRef.current.value = ''
    }

    /**
     * 页面路径变化后，自动关闭此modal
     */
    useEffect(() => {
        setIsModalOpen(false)
    }, [router])

    /**
     * 自动聚焦搜索框
     */
    useEffect(() => {
        if (isModalOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        } else {
            resetSearch()
        }
    }, [isModalOpen])

    /**
     * 对外暴露方法
     **/
    useImperativeHandle(cRef, () => {
        return {
            openSearch: () => {
                setIsModalOpen(true)
            }
        }
    })

    /**
     * 搜索
     * @param {*} query
     */
    const handleSearch = async (query) => {
        setKeyword(query)
        setSearchResults([])
        setAllResults([])
        setUseTime(0)
        setTotalPage(0)
        setTotalHit(0)
        setActiveIndex(0)

        if (!query || query === '') {
            return
        }

        if (!pagefind) {
            console.warn('PageFind not loaded yet')
            return
        }

        setIsLoading(true)
        const startTime = Date.now()
        try {
            const search = await pagefind.search(query)
            // 加载所有结果以支持分页
            const results = await Promise.all(search.results.map(r => r.data()))

            setUseTime(Date.now() - startTime)
            setTotalHit(search.results.length)
            setTotalPage(Math.ceil(search.results.length / 10)) // Simple pagination simulation

            // Map PageFind results to expected format
            // PageFind results have: url, content, meta: { title, image }
            const hits = results.map(r => ({
                objectID: r.url,
                title: r.meta.title,
                slug: r.url,
                ...r
            }))

            // 去重：根据标题去除重复结果
            const uniqueHits = []
            const seenTitles = new Set()
            for (const hit of hits) {
                // 过滤首页和分页列表页
                if (hit.url === '/' || hit.url === '/index' || hit.url === '/index.html' ||
                    /^\/page\/\d+(\.html)?$/.test(hit.url)) {
                    continue
                }
                if (!seenTitles.has(hit.title)) {
                    seenTitles.add(hit.title)
                    uniqueHits.push(hit)
                }
            }

            // 存储所有结果并更新分页
            setAllResults(uniqueHits)
            setTotalPage(Math.ceil(uniqueHits.length / 10))
            setPage(0) // 重置为第一页
            // 显示第一页结果
            setSearchResults(uniqueHits.slice(0, 10))
            setIsLoading(false)

            const doms = document
                .getElementById('search-wrapper')
                .getElementsByClassName('replace')

            setTimeout(() => {
                replaceSearchResult({
                    doms,
                    search: query,
                    target: {
                        element: 'span',
                        className: 'font-bold border-b border-dashed'
                    }
                })
            }, 200) // 延时高亮
        } catch (error) {
            console.error('PageFind search error:', error)
            setIsLoading(false)
        }
    }

    // 修改input的onChange事件处理函数 - 使用简单的防抖
    const handleInputChange = e => {
        const query = e.target.value

        // 如果已经有计时器在等待搜索，先清除之前的计时器
        if (searchTimer.current) {
            clearTimeout(searchTimer.current)
        }

        // 设置新的计时器，在用户停止输入500ms后触发搜索
        searchTimer.current = setTimeout(() => {
            handleSearch(query)
        }, 500)
    }

    /**
     * 切换页码
     */
    const switchPage = newPage => {
        setPage(newPage)
        const start = newPage * 10
        const end = start + 10
        setSearchResults(allResults.slice(start, end))
        setActiveIndex(0) // 重置选中项
    }

    /**
     * 关闭弹窗
     */
    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div
            id='search-wrapper'
            className={`${isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'
                } z-30 fixed h-screen w-screen left-0 top-0 sm:mt-[10vh] flex items-start justify-center mt-0`}>
            {/* 模态框 */}
            <div
                className={`${isModalOpen ? 'opacity-100' : 'invisible opacity-0 translate-y-10'
                    } max-h-[80vh] flex flex-col justify-between w-full min-h-[10rem] h-full md:h-fit max-w-xl dark:bg-hexo-black-gray dark:border-gray-800 bg-white dark:bg- p-5 rounded-lg z-50 shadow border hover:border-orange-500 duration-300 transition-all `}>
                <div className='flex justify-between items-center'>
                    <div className='text-2xl text-orange-500 dark:text-orange-600 font-bold'>
                        搜索
                    </div>
                    <div>
                        <i
                            className='text-gray-600 fa-solid fa-xmark p-1 cursor-pointer hover:text-orange-500'
                            onClick={closeModal}></i>
                    </div>
                </div>

                <input
                    type='text'
                    placeholder='在这里输入搜索关键词...'
                    onChange={e => handleInputChange(e)}
                    onFocus={() => setIsInputFocused(true)} // 聚焦时
                    onBlur={() => setIsInputFocused(false)} // 失去焦点时
                    className='text-black dark:text-gray-200 bg-gray-50 dark:bg-gray-600 w-full px-4 my-2 py-1 mb-4 border border-gray-300 dark:border-gray-500 rounded-md focus:border-orange-500 focus:outline-none'
                    autoComplete='off'
                    ref={inputRef}
                />

                {!pagefind && (
                    <div className="text-red-500 text-sm mb-2 text-center">
                        PageFind 索引未加载 (请运行 build 生成索引)
                    </div>
                )}

                {/* 标签组 */}
                <div className='mb-4'>
                    <TagGroups />
                </div>
                {searchResults.length === 0 && keyword && !isLoading && (
                    <div>
                        <p className=' text-slate-600 text-center my-4 text-base'>
                            {' '}
                            无法找到相关结果
                            <span className='font-semibold'>&quot;{keyword}&quot;</span>
                        </p>
                    </div>
                )}
                <ul className='flex-1 overflow-auto'>
                    {searchResults.map((result, index) => (
                        <li
                            key={result.objectID}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => onJumpSearchResult(index)}
                            className={`cursor-pointer replace my-2 p-2 duration-100 
              rounded-lg
              ${activeIndex === index ? 'bg-orange-500 dark:bg-orange-600' : ''}`}>
                            <a
                                className={`${activeIndex === index ? ' text-white' : ' text-black dark:text-gray-300 '}`}>
                                {result.title}
                            </a>
                        </li>
                    ))}
                </ul>
                <Pagination totalPage={totalPage} page={page} switchPage={switchPage} />
                <div className='flex items-center justify-between mt-2 sm:text-sm text-xs dark:text-gray-300'>
                    {totalHit === 0 && (
                        <div className='flex items-center'>
                            {ShortCutActions.map((action, index) => {
                                return (
                                    <Fragment key={index}>
                                        <div className='border-gray-300 dark:text-gray-300 text-gray-600 px-2 rounded border inline-block'>
                                            {action.key}
                                        </div>
                                        <span className='ml-2 mr-4  text-gray-600 dark:text-gray-300'>
                                            {action.action}
                                        </span>
                                    </Fragment>
                                )
                            })}
                        </div>
                    )}
                    <div>
                        {totalHit > 0 && (
                            <p>
                                共搜索到 {totalHit} 条结果，用时 {useTime} 毫秒
                            </p>
                        )}
                    </div>
                    <div className='text-gray-600 dark:text-gray-300  text-right'>
                        <span>
                            <i className='fas fa-search'></i> PageFind 提供搜索服务
                        </span>
                    </div>
                </div>
            </div>

            {/* 遮罩 */}
            <div
                onClick={closeModal}
                className='z-30 fixed top-0 left-0 w-full h-full flex items-center justify-center glassmorphism'
            />
        </div>
    )
}

/**
 * 标签组
 */
function TagGroups() {
    const { tagOptions } = useGlobal()
    //  获取tagOptions数组前十个
    const firstTenTags = tagOptions?.slice(0, 10)

    return (
        <div id='tags-group' className='dark:border-gray-700 space-y-2'>
            {firstTenTags?.map((tag, index) => {
                return (
                    <SmartLink
                        passHref
                        key={index}
                        href={`/tag/${encodeURIComponent(tag.name)}`}
                        className={'cursor-pointer inline-block whitespace-nowrap'}>
                        <div
                            className={
                                'flex items-center text-black dark:text-gray-300 hover:bg-orange-500 dark:hover:bg-orange-600 hover:scale-110 hover:text-white rounded-lg px-2 py-0.5 duration-150 transition-all'
                            }>
                            <div className='text-lg'>{tag.name} </div>
                            {tag.count ? (
                                <sup className='relative ml-1'>{tag.count}</sup>
                            ) : (
                                <></>
                            )}
                        </div>
                    </SmartLink>
                )
            })}
        </div>
    )
}

/**
 * 分页
 * @param {*} param0
 */
function Pagination(props) {
    const { totalPage, page, switchPage } = props
    if (totalPage <= 0) {
        return <></>
    }
    return (
        <div className='flex space-x-1 w-full justify-center py-1'>
            {Array.from({ length: totalPage }, (_, i) => {
                const classNames =
                    page === i
                        ? 'font-bold text-white bg-orange-500 dark:bg-orange-600 rounded'
                        : 'hover:text-orange-500 hover:font-bold dark:text-gray-300'

                return (
                    <div
                        onClick={() => switchPage(i)}
                        className={`text-center cursor-pointer w-6 h-6 ${classNames}`}
                        key={i}>
                        {i + 1}
                    </div>
                )
            })}
        </div>
    )
}
