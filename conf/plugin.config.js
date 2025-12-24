/**
 * 一些插件
 */
module.exports = {
  // 网站全文搜索
  ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'QLRHOGG4OX', // 在这里查看 https://dashboard.algolia.com/account/api-keys/
  ALGOLIA_ADMIN_APP_KEY: process.env.ALGOLIA_ADMIN_APP_KEY || null, // 管理后台的KEY，不要暴露在代码中，在这里查看 https://dashboard.algolia.com/account/api-keys/
  ALGOLIA_SEARCH_ONLY_APP_KEY:
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_APP_KEY || 'dcade3be84b3cfb2b357e2b99b34e45d', // 客户端搜索用的KEY
  ALGOLIA_INDEX: process.env.NEXT_PUBLIC_ALGOLIA_INDEX || 'notionnext', // 在Algolia中创建一个index用作数据库
}
