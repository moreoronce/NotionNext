/**
 * DeepRouter 主题配置
 * 终端风格浅色主题
 */
const CONFIG = {
    // 主题信息
    THEME_NAME: 'DeepRouter',

    // 导航菜单配置
    DEEPROUTER_MENU_CATEGORY: true,
    DEEPROUTER_MENU_TAG: true,
    DEEPROUTER_MENU_ARCHIVE: true,
    DEEPROUTER_MENU_SEARCH: true,

    // Telegram 链接
    DEEPROUTER_TELEGRAM_URL: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/dolingouu',

    // Twitter/X 链接
    DEEPROUTER_TWITTER_URL: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/moreoronce',

    // 文章列表配置
    DEEPROUTER_POST_LIST_COVER: false,
    DEEPROUTER_POST_LIST_PREVIEW: true,
    DEEPROUTER_POST_LIST_CATEGORY: true,
    DEEPROUTER_POST_LIST_TAG: true,

    // 文章详情配置
    DEEPROUTER_POST_DETAIL_CATEGORY: true,
    DEEPROUTER_POST_DETAIL_TAG: true,

    // Widget 配置
    DEEPROUTER_WIDGET_TOC: true,
    DEEPROUTER_WIDGET_RELATED: true,

    // 侧边栏动作：copy-link | site-link | none
    DEEPROUTER_SIDEBAR_ACTION: process.env.NEXT_PUBLIC_DEEPROUTER_SIDEBAR_ACTION || 'copy-link',

    // 每页文章数
    DEEPROUTER_POSTS_PER_PAGE: 10,

    // 页脚配置
    DEEPROUTER_FOOTER_BRAND: process.env.NEXT_PUBLIC_DEEPROUTER_FOOTER_BRAND || '',
    DEEPROUTER_FOOTER_DESCRIPTION: process.env.NEXT_PUBLIC_DEEPROUTER_FOOTER_DESCRIPTION || '',
    DEEPROUTER_FOOTER_EN_URL: process.env.NEXT_PUBLIC_DEEPROUTER_FOOTER_EN_URL || '',
    DEEPROUTER_FOOTER_NOW_URL: process.env.NEXT_PUBLIC_DEEPROUTER_FOOTER_NOW_URL || '',
    DEEPROUTER_FOOTER_WECHAT_QR: process.env.NEXT_PUBLIC_DEEPROUTER_FOOTER_WECHAT_QR || '/wechat-qrcode.webp'
}

export default CONFIG



