import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'

/**
 * 加密文章校验组件 - 暖色系
 */
export default function ArticleLock(props) {
    const { validPassword } = props
    const { locale } = useGlobal()
    const [error, setError] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const submitPassword = () => {
        const p = document.getElementById('password')
        const value = p?.value
        // validPassword 可能是同步布尔，也可能是 Promise（服务端校验）
        const result = validPassword(value)
        if (result && typeof result.then === 'function') {
            setSubmitting(true)
            result.then(ok => {
                setSubmitting(false)
                setError(!ok)
            })
        } else {
            setError(!result)
        }
    }

    const passwordInputRef = useRef(null)
    useEffect(() => {
        passwordInputRef.current?.focus()
    }, [])

    return (
        <div className="w-full flex justify-center items-center py-16">
            <div className="text-center space-y-4">
                <div className="text-[#ea580c] font-medium">
                    <span className="text-[#666666]">{'// '}</span>
                    {locale.COMMON.ARTICLE_LOCK_TIPS}
                </div>
                <div className="flex">
                    <input
                        id="password"
                        type="password"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                submitPassword()
                            }
                        }}
                        ref={passwordInputRef}
                        placeholder="输入密码..."
                        className="outline-none w-64 text-sm px-4 py-2
                       border border-[#E5E5E5] rounded-l-md
                       bg-white text-[#1A1A1A]
                       focus:border-[#ea580c]
                       placeholder:text-[#666666]"
                    />
                    <button
                        onClick={submitPassword}
                        disabled={submitting}
                        className="px-4 py-2 bg-[#ea580c] text-white rounded-r-md
                       hover:bg-[#c2410c] transition-colors
                       disabled:opacity-60"
                    >
                        {locale.COMMON.SUBMIT}
                    </button>
                </div>
                {error && (
                    <div className="text-sm text-[#E74C3C]">
                        {locale.COMMON.PASSWORD_ERROR}
                    </div>
                )}
            </div>
        </div>
    )
}
