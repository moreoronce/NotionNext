import fs from 'fs'

export async function generateRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link
  const content = `
# *
User-agent: *
Disallow: /article/horace-and-pete
Disallow: /article/nier-automata-ver-1-1a
Disallow: /sign-in
Disallow: /sign-up
Disallow: /dashboard
Disallow: /auth
Disallow: /api
Allow: /

# Sitemaps
Sitemap: ${LINK}/sitemap.xml
`.trim()
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
