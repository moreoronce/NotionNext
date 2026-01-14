import { Noto_Sans_SC, Bitter } from 'next/font/google'

export const notoSansSC = Noto_Sans_SC({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
})

export const bitter = Bitter({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-serif',
})
