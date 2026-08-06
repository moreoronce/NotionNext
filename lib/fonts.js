import { Bitter } from 'next/font/google'

// NOTE: Noto Sans SC is intentionally NOT loaded via next/font on Next 15+.
// Next 15 changed next/font's CJK subset handling: even with subsets:['latin']
// it self-hosts the full Noto Sans SC family (~1.15MB across 21 woff2 chunks),
// which tripled Style&Layout time and TBT on mobile (measured via Lighthouse).
// The CJK glyphs are already covered by the FONT_SANS system fallback stack
// (PingFang SC / Microsoft YaHei / Source Han Sans SC / Noto Sans CJK SC),
// so we expose the family name directly without next/font hosting.
export const notoSansSC = {
  style: { fontFamily: '"Noto Sans SC", "PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif' }
}

export const bitter = Bitter({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  preload: false
})
