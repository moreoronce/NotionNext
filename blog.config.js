// 注: process.env.xx是vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a
const blog = {
  // important page_id！！！duplicate template from  https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5
  notion_page_id:
    process.env.notion_page_id ||
    '02ab3b8678004aa69e9e415905ef32a5,en:7c1d570661754c8fbc568e00a01fd70e',
  pseudo_static: process.env.next_public_pseudo_static || true, // 伪静态路径，开启后所有文章url都以 .html 结尾。
  next_revalidate_second: process.env.next_public_revalidate_second || 5, // 更新内容缓存间隔 单位(秒)；即每个页面有5秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省vercel资源、同时提升访问速率，但也会使文章更新有延迟。
  theme: process.env.next_public_theme || 'medium', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 example,fukasawa,gitbook,heo,hexo,landing,matery,medium,next,nobelium,plog,simple
  theme_switch: process.env.next_public_theme_switch || false, // 是否显示切换主题按钮
  lang: process.env.next_public_lang || 'zh-cn', // e.g 'zh-cn','en-us'  see /lib/lang.js for more.
  since: process.env.next_public_since || 2021, // e.g if leave this empty, current year will be used.
  appearance: process.env.next_public_appearance || 'light', // ['light', 'dark', 'auto'], // light 日间模式 ， dark夜间模式， auto根据时间和主题自动夜间模式
  appearance_dark_time: process.env.next_public_appearance_dark_time || [18, 6], // 夜间模式起至时间，false时关闭根据时间自动切换夜间模式

  tag_sort_by_count: true, // 标签是否按照文章数量倒序排列，文章多的标签排在前。
  is_tag_color_distinguished:
    process.env.next_public_is_tag_color_distinguished === 'true' || true, // 对于名称相同的tag是否区分tag的颜色

  // 3.14.1版本后，欢迎语在此配置，英文逗号隔开 ,  即可支持多个欢迎语打字效果。
  greeting_words:
    process.env.next_public_greeting_words ||
    '',

  custom_menu: process.env.next_public_custom_menu || false, // 支持menu 类型，从3.12.0版本起，各主题将逐步支持灵活的二级菜单配置，替代了原来的page类型，此配置是试验功能、默认关闭。

  author: process.env.next_public_author || '', // 您的昵称 例如 tangly1024
  bio: process.env.next_public_bio || '', // 作者简介
  link: process.env.next_public_link || 'https://www.dolingou.com', // 网站地址
  keywords: process.env.next_public_keyword || 'notion, 博客', // 网站关键词 英文逗号隔开

  // 社交链接，不需要可留空白，例如 contact_weibo:''
  contact_email: process.env.next_public_contact_email || '', // 邮箱地址 例如mail@tangly1024.com
  contact_weibo: process.env.next_public_contact_weibo || '', // 你的微博个人主页
  contact_twitter: process.env.next_public_contact_twitter || '', // 你的twitter个人主页
  contact_github: process.env.next_public_contact_github || '', // 你的github个人主页 例如 https://github.com/tangly1024
  contact_telegram: process.env.next_public_contact_telegram || '', // 你的telegram 地址 例如 https://t.me/tangly_1024
  contact_linkedin: process.env.next_public_contact_linkedin || '', // 你的linkedin 首页
  contact_instagram: process.env.next_public_contact_instagram || '', // 您的instagram地址
  contact_bilibili: process.env.next_public_contact_bilibili || '', // b站主页
  contact_youtube: process.env.next_public_contact_youtube || '', // youtube主页
  contact_xiaohongshu: process.env.next_public_contact_xiaohongshu || '', // 小红书主页
  contact_zhishixingqiu: process.env.next_public_contact_zhishixingqiu || '', // 知识星球
  contact_wehchat_public: process.env.next_public_contact_wehchat_public || '', // 微信公众号 格式：https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=【xxxxxx】==#wechat_redirect

  notion_host: process.env.next_public_notion_host || 'https://www.notion.so', // notion域名，您可以选择用自己的域名进行反向代理，如果不懂得什么是反向代理，请勿修改此项

  blog_favicon: process.env.next_public_favicon || '/favicon.ico', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png

  image_compress_width: process.env.next_public_image_compress_width || 800, // 图片压缩宽度默认值，作用于博客封面和文章内容 越小加载图片越快
  image_zoom_in_width: process.env.next_public_image_zoom_in_width || 1200, // 文章图片点击放大后的画质宽度，不代表在网页中的实际展示宽度
  random_image_url: process.env.next_public_random_image_url || '', // 随机图片api,如果未配置下面的关键字，主页封面，头像，文章封面图都会被替换为随机图片
  random_image_replace_text:
    process.env.next_public_random_image_not_replace_text ||
    'images.unsplash.com', // 触发替换图片的 url 关键字(多个支持用英文逗号分开)，只有图片地址中包含此关键字才会替换为上方随机图片url
  // eg: images.unsplash.com(notion图床的所有图片都会替换),如果你在 notion 里已经添加了一个随机图片 url，恰巧那个服务跑路或者挂掉，想一键切换所有配图可以将该 url 配置在这里
  // 默认下会将你上传到 notion的主页封面图和头像也给替换，建议将主页封面图和头像放在其他图床，在 notion 里配置 link 即可。

  // start ************网站字体*****************
  // ['font-serif','font-sans'] 两种可选，分别是衬线和无衬线: 参考 https://www.jianshu.com/p/55e410bd2115
  // 后面空格隔开的font-light的字体粗细，留空是默认粗细；参考 https://www.tailwindcss.cn/docs/font-weight
  font_style: process.env.next_public_font_style || 'font-sans font-light',
  // 字体css 例如 https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css
  font_url: [
    // 'https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css',
    'https://fonts.googleapis.com/css?family=bitter&display=swap',
    'https://fonts.googleapis.com/css2?family=noto+sans+sc:wght@300&display=swap',
    'https://fonts.googleapis.com/css2?family=noto+serif+sc:wght@300&display=swap'
  ],
  // 无衬线字体 例如'"lxgw wenkai"'
  font_sans: [
    // '"lxgw wenkai"',
    '"pingfang sc"',
    '-apple-system',
    'blinkmacsystemfont',
    '"hiragino sans gb"',
    '"microsoft yahei"',
    '"segoe ui emoji"',
    '"segoe ui symbol"',
    '"segoe ui"',
    '"noto sans sc"',
    'harmonyos_regular',
    '"helvetica neue"',
    'helvetica',
    '"source han sans sc"',
    'arial',
    'sans-serif',
    '"apple color emoji"'
  ],
  // 衬线字体 例如'"lxgw wenkai"'
  font_serif: [
    // '"lxgw wenkai"',
    'bitter',
    '"noto serif sc"',
    'simsun',
    '"times new roman"',
    'times',
    'serif',
    '"segoe ui emoji"',
    '"segoe ui symbol"',
    '"apple color emoji"'
  ],
  font_awesome:
    process.env.next_public_font_awesome_path ||
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', // font-awesome 字体图标地址; 可选 /css/all.min.css ， https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-m/font-awesome/6.0.0/css/all.min.css

  // end ************网站字体*****************

  // 路径和组件映射，不同路径分别展示主题的什么组件
  layout_mappings: {
    '-1': 'layoutbase',
    '/': 'layoutindex',
    '/archive': 'layoutarchive',
    '/page/[page]': 'layoutpostlist',
    '/category/[category]': 'layoutpostlist',
    '/category/[category]/page/[page]': 'layoutpostlist',
    '/tag/[tag]': 'layoutpostlist',
    '/tag/[tag]/page/[page]': 'layoutpostlist',
    '/search': 'layoutsearch',
    '/search/[keyword]': 'layoutsearch',
    '/search/[keyword]/page/[page]': 'layoutsearch',
    '/404': 'layout404',
    '/tag': 'layouttagindex',
    '/category': 'layoutcategoryindex',
    '/[prefix]': 'layoutslug',
    '/[prefix]/[slug]': 'layoutslug',
    '/[prefix]/[slug]/[...suffix]': 'layoutslug',
    '/signin': 'layoutsignin',
    '/signup': 'layoutsignup'
  },

  can_copy: process.env.next_public_can_copy || true, // 是否允许复制页面内容 默认允许，如果设置为false、则全栈禁止复制内容。
  // 自定义右键菜单
  custom_right_click_context_menu:
    process.env.next_public_custom_right_click_context_menu || false, // 自定义右键菜单，覆盖系统菜单
  custom_right_click_context_menu_theme_switch:
    process.env.next_public_custom_right_click_context_menu_theme_switch ||
    true, // 是否显示切换主题
  custom_right_click_context_menu_dark_mode:
    process.env.next_public_custom_right_click_context_menu_dark_mode || true, // 是否显示深色模式
  custom_right_click_context_menu_share_link:
    process.env.next_public_custom_right_click_context_menu_share_link || false, // 是否显示分享链接
  custom_right_click_context_menu_random_post:
    process.env.next_public_custom_right_click_context_menu_random_post || false, // 是否显示随机博客
  custom_right_click_context_menu_category:
    process.env.next_public_custom_right_click_context_menu_category || true, // 是否显示分类
  custom_right_click_context_menu_tag:
    process.env.next_public_custom_right_click_context_menu_theme_tag || true, // 是否显示标签

  // 自定义外部脚本，外部样式
  custom_external_js: [''], // e.g. ['http://xx.com/script.js','http://xx.com/script.js']
  custom_external_css: [''], // e.g. ['http://xx.com/style.css','http://xx.com/style.css']

  // 侧栏布局 是否反转(左变右,右变左) 已支持主题: hexo next medium fukasawa example
  layout_sidebar_reverse:
    process.env.next_public_layout_sidebar_reverse || false,

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  facebook_page_title: process.env.next_public_facebook_page_title || null, // 邊欄 facebook page widget 的標題欄，填''則無標題欄 e.g facebook 粉絲團'
  facebook_page: process.env.next_public_facebook_page || null, // facebook page 的連結 e.g https://www.facebook.com/tw.andys.pro
  facebook_page_id: process.env.next_public_facebook_page_id || '', // facebook page id 來啟用 messenger 聊天功能
  facebook_app_id: process.env.next_public_facebook_app_id || '', // facebook app id 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/

  bei_an: process.env.next_public_bei_an || '', // 备案号 闽icp备xxxxxxx

  // start********代码相关********
  // prismjs 代码相关
  prism_js_path: 'https://npm.elemecdn.com/prismjs@1.29.0/components/',
  prism_js_auto_loader:
    'https://npm.elemecdn.com/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js',

  // 代码主题 @see https://github.com/prismjs/prism-themes
  prism_theme_prefix_path:
    process.env.next_public_prism_theme_prefix_path ||
    'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-okaidia.css', // 代码块默认主题
  prism_theme_switch: process.env.next_public_prism_theme_switch || true, // 是否开启浅色/深色模式代码主题切换； 开启后将显示以下两个主题
  prism_theme_light_path:
    process.env.next_public_prism_theme_light_path ||
    'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-solarizedlight.css', // 浅色模式主题
  prism_theme_dark_path:
    process.env.next_public_prism_theme_dark_path ||
    'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-okaidia.min.css', // 深色模式主题

  code_mac_bar: process.env.next_public_code_mac_bar || true, // 代码左上角显示mac的红黄绿图标
  code_line_numbers: process.env.next_public_code_line_numbers || false, // 是否显示行号
  code_collapse: process.env.next_public_code_collapse || true, // 是否支持折叠代码框
  code_collapse_expand_default:
    process.env.next_public_code_collapse_expand_default || true, // 折叠代码默认是展开状态

  // end********代码相关********

  // mermaid 图表cdn
  mermaid_cdn:
    process.env.next_public_mermaid_cdn ||
    'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.2.4/mermaid.min.js', // cdn
  // qrcodecdn
  qr_code_cdn:
    process.env.next_public_qr_code_cdn ||
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',

  background_light: '#eeeeee', // use hex value, don't forget '#' e.g #fffefc
  background_dark: '#000000', // use hex value, don't forget '#'
  sub_path: '', // leave this empty unless you want to deploy in a folder

  post_share_bar_enable: process.env.next_public_post_share_bar || 'false', // 文章分享功能 ，将在底部显示一个分享条
  posts_share_services:
    process.env.next_public_post_share_services ||
    'link,wechat,qq,weibo,email,facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin', // 分享的服務，按顺序显示,逗号隔开
  // 所有支持的分享服务：link(复制链接),wechat(微信),qq,weibo(微博),email(邮件),facebook,twitter,telegram,messenger,line,reddit,whatsapp,linkedin,vkshare,okshare,tumblr,livejournal,mailru,viber,workplace,pocket,instapaper,hatena

  // 文章url前缀
  post_url_prefix: process.env.next_public_post_url_prefix ?? 'article',
  // post类型文章的默认路径前缀，例如默认post类型的路径是  /article/[slug]
  // 如果此项配置为 '' 空， 则文章将没有前缀路径
  // 支援類似 wp 可自訂文章連結格式的功能：https://wordpress.org/documentation/article/customize-permalinks/，目前只先實作 %year%/%month%/%day%
  // 例：如想連結改成前綴 article + 時間戳記，可變更為： 'article/%year%/%month%/%day%'

  post_list_style: process.env.next_public_post_list_style || 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  post_list_preview: process.env.next_public_post_preview || 'false', //  是否在列表加载文章预览
  post_preview_lines: process.env.next_public_post_post_preview_lines || 12, // 预览博客行数
  post_recommend_count: process.env.next_public_post_recommend_count || 6, // 推荐文章数量
  posts_per_page: process.env.next_public_post_per_page || 12, // post counts per page
  posts_sort_by: process.env.next_public_post_sort_by || 'notion', // 排序方式 'date'按时间,'notion'由notion控制

  post_waiting_time_for_404:
    process.env.next_public_post_waiting_time_for_404 || '8', // 文章加载超时时间，单位秒；超时后跳转到404页面

  algolia_app_id: process.env.next_public_algolia_app_id || null, // 在这里查看 https://dashboard.algolia.com/account/api-keys/
  algolia_admin_app_key: process.env.algolia_admin_app_key || null, // 管理后台的key，不要暴露在代码中，在这里查看 https://dashboard.algolia.com/account/api-keys/
  algolia_search_only_app_key:
    process.env.next_public_algolia_search_only_app_key || null, // 客户端搜索用的key
  algolia_index: process.env.next_public_algolia_index || null, // 在algolia中创建一个index用作数据库
  //   algolia_recreate_data: process.env.algolia_recreate_data || process.env.npm_lifecycle_event === 'build', // 为true时重新构建索引数据; 默认在build时会构建

  preview_category_count: 16, // 首页最多展示的分类数量，0为不限制
  preview_tag_count: 16, // 首页最多展示的标签数量，0为不限制

  post_title_icon: process.env.next_public_post_title_icon || true, // 是否显示标题icon
  post_disable_gallery_click:
    process.env.next_public_post_disable_gallery_click || false, // 画册视图禁止点击，方便在友链页面的画册插入链接

  //   ********动态特效相关********
  // 鼠标点击烟花特效
  fireworks: process.env.next_public_fireworks || false, // 开关
  // 烟花色彩，感谢 https://github.com/vixcity 提交的色彩
  fireworks_color: [
    '255, 20, 97',
    '24, 255, 146',
    '90, 135, 255',
    '251, 243, 140'
  ],

  // 鼠标跟随特效
  mouse_follow: process.env.next_public_mouse_follow || false, // 开关
  // 这两个只有在鼠标跟随特效开启时才生效
  // 鼠标类型 1：路劲散点 2：下降散点 3：上升散点 4：边缘向鼠标移动散点 5：跟踪转圈散点 6：路径线条 7：聚集散点 8：聚集网格 9：移动网格 10：上升粒子 11：转圈随机颜色粒子 12：圆锥放射跟随蓝色粒子
  mouse_follow_effect_type: 11, // 1-12
  mouse_follow_effect_color: '#ef672a', // 鼠标点击特效颜色 #xxxxxx 或者 rgba(r,g,b,a)

  // 樱花飘落特效
  sakura: process.env.next_public_sakura || false, // 开关
  // 漂浮线段特效
  nest: process.env.next_public_nest || false, // 开关
  // 动态彩带特效
  flutteringribbon: process.env.next_public_flutteringribbon || false, // 开关
  // 静态彩带特效
  ribbon: process.env.next_public_ribbon || false, // 开关
  // 星空雨特效 黑夜模式才会生效
  starry_sky: process.env.next_public_starry_sky || false, // 开关

  //   ********挂件组件相关********
  // ai 文章摘要生成 @see https://docs_s.tianli0.top/
  tianligpt_css:
    process.env.next_public_tianli_gpt_css ||
    'https://cdn1.tianli0.top/gh/zhheo/post-abstract-ai@0.15.2/tianli_gpt.css',
  tianligpt_js:
    process.env.next_public_tianli_gpt_js ||
    'https://cdn1.tianli0.top/gh/zhheo/post-abstract-ai@0.15.2/tianli_gpt.js',
  tianligpt_key: process.env.next_public_tianli_gpt_key || '',

  // chatbase 是否显示chatbase机器人 https://www.chatbase.co/
  chatbase_id: process.env.next_public_chatbase_id || null,
  // webwhizai 机器人 @see https://github.com/webwhiz-ai/webwhiz
  web_whiz_enabled: process.env.next_public_web_whiz_enabled || false, // 是否显示
  web_whiz_base_url:
    process.env.next_public_web_whiz_base_url || 'https://api.webwhiz.ai', // 可以自建服务器
  web_whiz_chat_bot_id: process.env.next_public_web_whiz_chat_bot_id || null, // 在后台获取id
  dify_chatbot_enabled: process.env.next_public_dify_chatbot_enabled || false,
  dify_chatbot_base_url: process.env.next_public_dify_chatbot_base_url || '',
  dify_chatbot_token: process.env.next_public_dify_chatbot_token || '',
  // 悬浮挂件
  widget_pet: process.env.next_public_widget_pet || false, // 是否显示宠物挂件
  widget_pet_link:
    process.env.next_public_widget_pet_link ||
    'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  widget_pet_switch_theme:
    process.env.next_public_widget_pet_switch_theme || false, // 点击宠物挂件切换博客主题

  // 音乐播放插件
  music_player: process.env.next_public_music_player || false, // 是否使用音乐播放插件
  music_player_visible: process.env.next_public_music_player_visible || true, // 是否在左下角显示播放和切换，如果使用播放器，打开自动播放再隐藏，就会以类似背景音乐的方式播放，无法取消和暂停
  music_player_auto_play:
    process.env.next_public_music_player_auto_play || true, // 是否自动播放，不过自动播放时常不生效（移动设备不支持自动播放）
  music_player_lrc_type: process.env.next_public_music_player_lrc_type || '0', // 歌词显示类型，可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）（前提是有配置歌词路径，对 meting 无效）
  music_player_cdn_url:
    process.env.next_public_music_player_cdn_url ||
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-m/aplayer/1.10.1/aplayer.min.js',
  music_player_order: process.env.next_public_music_player_order || 'list', // 默认播放方式，顺序 list，随机 random
  music_player_audio_list: [
    // 示例音乐列表。除了以下配置外，还可配置歌词，具体配置项看此文档 https://aplayer.js.org/#/zh-hans/
    {
      name: '风を共に舞う気持ち',
      artist: 'falcom sound team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731419.mp3',
      cover:
        'https://p2.music.126.net/kn6ugistonvqjh3lhlaptq==/599233837187278.jpg'
    },
    {
      name: '王都グランセル',
      artist: 'falcom sound team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731355.mp3',
      cover:
        'https://p1.music.126.net/kn6ugistonvqjh3lhlaptq==/599233837187278.jpg'
    }
  ],
  music_player_meting: process.env.next_public_music_player_meting || false, // 是否要开启 metingjs，从平台获取歌单。会覆盖自定义的 music_player_audio_list，更多配置信息：https://github.com/metowolf/metingjs
  music_player_meting_server:
    process.env.next_public_music_player_meting_server || 'netease', // 音乐平台，[netease, tencent, kugou, xiami, baidu]
  music_player_meting_id:
    process.env.next_public_music_player_meting_id || '60198', // 对应歌单的 id
  music_player_meting_lrc_type:
    process.env.next_public_music_player_meting_lrc_type || '1', // 可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）

  //   ********挂件组件相关********
  // ----> 评论互动 可同时开启多个支持 waline valine giscus cusdis utterrances gitalk

  comment_hide_single_tab:
    process.env.next_public_comment_hide_single_tab || false, // whether hide the tab when there's no tabs. 只有一个评论组件时是否隐藏切换组件的标签页

  // artalk 评论插件
  comment_artalk_server: process.env.next_public_comment_artalk_server || '', // artalkservert后端地址 https://artalk.js.org/guide/deploy.html
  comment_artalk_js:
    process.env.next_public_comment_artalk_js ||
    'https://cdnjs.cloudflare.com/ajax/libs/artalk/2.5.5/artalk.js', // artalkservert js cdn
  comment_artalk_css:
    process.env.next_public_comment_artalk_css ||
    'https://cdnjs.cloudflare.com/ajax/libs/artalk/2.5.5/artalk.css', // artalkservert css cdn

  // twikoo
  comment_twikoo_env_id: process.env.next_public_comment_env_id || '', // twikoo后端地址 腾讯云环境填envid；vercel环境填域名，教程：https://tangly1024.com/article/notionnext-twikoo
  comment_twikoo_count_enable:
    process.env.next_public_comment_twikoo_count_enable || false, // 博客列表是否显示评论数
  comment_twikoo_cdn_url:
    process.env.next_public_comment_twikoo_cdn_url ||
    'https://cdn.staticfile.net/twikoo/1.6.17/twikoo.min.js', // twikoo客户端cdn

  // utterance
  comment_utterrances_repo:
    process.env.next_public_comment_utterrances_repo || '', // 你的代码仓库名， 例如我是 'tangly1024/notionnext'； 更多文档参考 https://utteranc.es/

  // giscus @see https://giscus.app/
  comment_giscus_repo: process.env.next_public_comment_giscus_repo || '', // 你的github仓库名 e.g 'tangly1024/notionnext'
  comment_giscus_repo_id: process.env.next_public_comment_giscus_repo_id || '', // 你的github repo id e.g ( 設定完 giscus 即可看到 )
  comment_giscus_category_id:
    process.env.next_public_comment_giscus_category_id || '', // 你的github discussions 內的 category id ( 設定完 giscus 即可看到 )
  comment_giscus_mapping:
    process.env.next_public_comment_giscus_mapping || 'pathname', // 你的github discussions 使用哪種方式來標定文章, 預設 'pathname'
  comment_giscus_reactions_enabled:
    process.env.next_public_comment_giscus_reactions_enabled || '1', // 你的 giscus 是否開啟文章表情符號 '1' 開啟 "0" 關閉 預設開啟
  comment_giscus_emit_metadata:
    process.env.next_public_comment_giscus_emit_metadata || '0', // 你的 giscus 是否提取 metadata '1' 開啟 '0' 關閉 預設關閉
  comment_giscus_input_position:
    process.env.next_public_comment_giscus_input_position || 'bottom', // 你的 giscus 發表留言位置 'bottom' 尾部 'top' 頂部, 預設 'bottom'
  comment_giscus_lang: process.env.next_public_comment_giscus_lang || 'zh-cn', // 你的 giscus 語言 e.g 'en', 'zh-tw', 'zh-cn', 預設 'en'
  comment_giscus_loading:
    process.env.next_public_comment_giscus_loading || 'lazy', // 你的 giscus 載入是否漸進式載入, 預設 'lazy'
  comment_giscus_crossorigin:
    process.env.next_public_comment_giscus_crossorigin || 'anonymous', // 你的 giscus 可以跨網域, 預設 'anonymous'

  comment_cusdis_app_id: process.env.next_public_comment_cusdis_app_id || '', // data-app-id 36位 see https://cusdis.com/
  comment_cusdis_host:
    process.env.next_public_comment_cusdis_host || 'https://cusdis.com', // data-host, change this if you're using self-hosted version
  comment_cusdis_script_src:
    process.env.next_public_comment_cusdis_script_src || '/js/cusdis.es.js', // change this if you're using self-hosted version

  // gitalk评论插件 更多参考 https://gitalk.github.io/
  comment_gitalk_repo: process.env.next_public_comment_gitalk_repo || '', // 你的github仓库名，例如 'notionnext'
  comment_gitalk_owner: process.env.next_public_comment_gitalk_owner || '', // 你的用户名 e.g tangly1024
  comment_gitalk_admin: process.env.next_public_comment_gitalk_admin || '', // 管理员用户名、一般是自己 e.g 'tangly1024'
  comment_gitalk_client_id:
    process.env.next_public_comment_gitalk_client_id || '', // e.g 20位id ， 在gitalk后台获取
  comment_gitalk_client_secret:
    process.env.next_public_comment_gitalk_client_secret || '', // e.g 40位id， 在gitalk后台获取
  comment_gitalk_distraction_free_mode: false, // 类似facebook的无干扰模式
  comment_gitalk_js_cdn_url:
    process.env.next_public_comment_gitalk_js_cdn_url ||
    'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js', // gitalk客户端 js cdn
  comment_gitalk_css_cdn_url:
    process.env.next_public_comment_gitalk_css_cdn_url ||
    'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css', // gitalk客户端 css cdn

  comment_gitter_room: process.env.next_public_comment_gitter_room || '', // gitter聊天室 see https://gitter.im/ 不需要则留空
  comment_dao_voice_id: process.env.next_public_comment_dao_voice_id || '', // daovoice http://dashboard.daovoice.io/get-started
  comment_tidio_id: process.env.next_public_comment_tidio_id || '', // [tidio_id] -> //code.tidio.co/[tidio_id].js

  comment_valine_cdn:
    process.env.next_public_valine_cdn ||
    'https://unpkg.com/valine@1.5.1/dist/valine.min.js',
  comment_valine_app_id: process.env.next_public_valine_id || '', // valine @see https://valine.js.org/quickstart.html 或 https://github.com/stonehank/react-valine#%e8%8e%b7%e5%8f%96app-id-%e5%92%8c-app-key
  comment_valine_app_key: process.env.next_public_valine_key || '',
  comment_valine_server_urls: process.env.next_public_valine_server_urls || '', // 该配置适用于国内自定义域名用户, 海外版本会自动检测(无需手动填写) @see https://valine.js.org/configuration.html#serverurls
  comment_valine_placeholder:
    process.env.next_public_valine_placeholder || '抢个沙发吧~', // 可以搭配后台管理评论 https://github.com/desertsp/valine-admin  便于查看评论，以及邮件通知，垃圾评论过滤等功能

  comment_waline_server_url: process.env.next_public_waline_server_url || '', // 请配置完整的waline评论地址 例如 hhttps://preview-waline.tangly1024.com @see https://waline.js.org/guide/get-started.html
  comment_waline_recent: process.env.next_public_waline_recent || false, // 最新评论

  // 此评论系统基于webmention，细节可参考https://webmention.io
  // 它是一个基于indieweb理念的开放式评论系统，下方comment_webmention包含的属性皆需配置：
  // enable: 是否开启
  // auth: webmention使用的indielogin，可使用twitter或github个人页面连结
  // hostname: webmention绑定之网域，通常即为本站网址
  // twitter_username: 评论显示区域需要的资讯
  // token: webmention的api token
  comment_webmention_enable: process.env.next_public_webmention_enable || false,
  comment_webmention_auth: process.env.next_public_webmention_auth || '',
  comment_webmention_hostname:
    process.env.next_public_webmention_hostname || '',
  comment_webmention_twitter_username:
    process.env.next_public_twitter_username || '',
  comment_webmention_token: process.env.next_public_webmention_token || '',

  // <---- 评论插件

  // ----> 站点统计
  analytics_vercel: process.env.next_public_analytics_vercel || false, // vercel自带的统计 https://vercel.com/docs/concepts/analytics/quickstart https://github.com/tangly1024/notionnext/issues/897
  analytics_busuanzi_enable:
    process.env.next_public_analytics_busuanzi_enable || true, // 展示网站阅读量、访问数 see http://busuanzi.ibruce.info/
  analytics_baidu_id: process.env.next_public_analytics_baidu_id || '', // e.g 只需要填写百度统计的id，[baidu_id] -> https://hm.baidu.com/hm.js?[baidu_id]
  analytics_cnzz_id: process.env.next_public_analytics_cnzz_id || '', // 只需要填写站长统计的id, [cnzz_id] -> https://s9.cnzz.com/z_stat.php?id=[cnzz_id]&web_id=[cnzz_id]
  analytics_google_id: process.env.next_public_analytics_google_id || '', // 谷歌analytics的id e.g: g-xxxxxxxxxx

  // 51la 站点统计 https://www.51.la/
  analytics_51la_id: process.env.next_public_analytics_51la_id || '', // id，在51la后台获取 参阅 https://docs.tangly1024.com/article/notion-next-51-la
  analytics_51la_ck: process.env.next_public_analytics_51la_ck || '', // ck，在51la后台获取

  // matomo 网站统计
  matomo_host_url: process.env.next_public_matomo_host_url || '', // matomo服务器地址，不带斜杠
  matomo_site_id: process.env.next_public_matomo_site_id || '', // matomo网站id
  // ackee网站访客统计工具
  analytics_ackee_tracker:
    process.env.next_public_analytics_ackee_tracker || '', // e.g 'https://ackee.tangly1024.com/tracker.js'
  analytics_ackee_data_server:
    process.env.next_public_analytics_ackee_data_server || '', // e.g https://ackee.tangly1024.com , don't end with a slash
  analytics_ackee_domain_id:
    process.env.next_public_analytics_ackee_domain_id || '', // e.g '82e51db6-dec2-423a-b7c9-b4ff7ebb3302'

  seo_google_site_verification:
    process.env.next_public_seo_google_site_verification || '', // remove the value or replace it with your own google site verification code

  seo_baidu_site_verification:
    process.env.next_public_seo_baidu_site_verification || '', // remove the value or replace it with your own google site verification code

  // 微软 clarity 站点分析
  clarity_id: process.env.next_public_clarity_id || null, // 只需要复制clarity脚本中的id部分，id是一个十位的英文数字组合

  // <---- 站点统计

  // start---->营收相关

  // 谷歌广告
  adsense_google_id: process.env.next_public_adsense_google_id || '', // 谷歌广告id e.g ca-pub-xxxxxxxxxxxxxxxx
  adsense_google_test: process.env.next_public_adsense_google_test || false, // 谷歌广告id测试模式，这种模式获取假的测试广告，用于开发 https://www.tangly1024.com/article/local-dev-google-adsense
  adsense_google_slot_in_article:
    process.env.next_public_adsense_google_slot_in_article || '3806269138', // google adscene>广告>按单元广告>新建文章内嵌广告 粘贴html代码中的data-ad-slot值
  adsense_google_slot_flow:
    process.env.next_public_adsense_google_slot_flow || '1510444138', // google adscene>广告>按单元广告>新建信息流广告
  adsense_google_slot_native:
    process.env.next_public_adsense_google_slot_native || '4980048999', // google adscene>广告>按单元广告>新建原生广告
  adsense_google_slot_auto:
    process.env.next_public_adsense_google_slot_auto || '8807314373', // google adscene>广告>按单元广告>新建展示广告 （自动广告）

  // 万维广告
  ad_wwads_id: process.env.next_public_wwad_id || null, // https://wwads.cn/ 创建您的万维广告单元id
  ad_wwads_block_detect: process.env.next_public_wwads_ad_block_detect || false, // 是否开启wwads广告屏蔽插件检测,开启后会在广告位上以文字提示 @see https://github.com/bytegravity/whitelist-wwads

  // end<----营收相关

  // 自定义配置notion数据库字段名
  notion_property_name: {
    password: process.env.next_public_notion_property_password || 'password',
    type: process.env.next_public_notion_property_type || 'type', // 文章类型，
    type_post: process.env.next_public_notion_property_type_post || 'post', // 当type文章类型与此值相同时，为博文。
    type_page: process.env.next_public_notion_property_type_page || 'page', // 当type文章类型与此值相同时，为单页。
    type_notice:
      process.env.next_public_notion_property_type_notice || 'notice', // 当type文章类型与此值相同时，为公告。
    type_menu: process.env.next_public_notion_property_type_menu || 'menu', // 当type文章类型与此值相同时，为菜单。
    type_sub_menu:
      process.env.next_public_notion_property_type_sub_menu || 'submenu', // 当type文章类型与此值相同时，为子菜单。
    title: process.env.next_public_notion_property_title || 'title', // 文章标题
    status: process.env.next_public_notion_property_status || 'status',
    status_publish:
      process.env.next_public_notion_property_status_publish || 'published', // 当status状态值与此相同时为发布，可以为中文
    status_invisible:
      process.env.next_public_notion_property_status_invisible || 'invisible', // 当status状态值与此相同时为隐藏发布，可以为中文 ， 除此之外其他页面状态不会显示在博客上
    summary: process.env.next_public_notion_property_summary || 'summary',
    slug: process.env.next_public_notion_property_slug || 'slug',
    category: process.env.next_public_notion_property_category || 'category',
    date: process.env.next_public_notion_property_date || 'date',
    tags: process.env.next_public_notion_property_tags || 'tags',
    icon: process.env.next_public_notion_property_icon || 'icon',
    ext: process.env.next_public_notion_property_ext || 'ext' // 扩展字段，存放json-string，用于复杂业务
  },

  // rss订阅
  enable_rss: process.env.next_public_enable_rss || true, // 是否开启rss订阅功能
  mailchimp_list_id: process.env.mailchimp_list_id || null, // 开启mailichimp邮件订阅 客户列表id ，具体使用方法参阅文档
  mailchimp_api_key: process.env.mailchimp_api_key || null, // 开启mailichimp邮件订阅 apikey

  // animate.css 动画
  animate_css_url:
    process.env.next_public_animate_css_url ||
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', // 动画cdn

  // 网站图片
  img_lazy_load_placeholder:
    process.env.next_public_img_lazy_load_placeholder ||
    'data:image/gif;base64,r0lgodlhaqabaiaaap///waaach5baeaaaaalaaaaaabaaeaaaicraeaow==', // 懒加载占位图片地址，支持base64或url
  img_url_type: process.env.next_public_img_type || 'notion', // 此配置已失效，请勿使用；amazon方案不再支持，仅支持notion方案。 ['notion','amazon'] 站点图片前缀 默认 notion:(https://notion.so/images/xx) ， amazon(https://s3.us-west-2.amazonaws.com/xxx)
  img_shadow: process.env.next_public_img_shadow || false, // 文章图片是否自动添加阴影
  img_compress_width: process.env.next_public_img_compress_width || 800, // notion图片压缩宽度

  // 作废配置
  avatar: process.env.next_public_avatar || '/avatar.svg', // 作者头像，被notion中的icon覆盖。若无icon则取public目录下的avatar.png
  title: process.env.next_public_title || 'notionnext blog', // 站点标题 ，被notion中的页面标题覆盖；此处请勿留空白，否则服务器无法编译
  home_banner_image:
    process.env.next_public_home_banner_image || '/bg_image.jpg', // 首页背景大图, 会被notion中的封面图覆盖，若无封面图则会使用代码中的 /public/bg_image.jpg 文件
  description:
    process.env.next_public_description || 'damn it all to do now', // 站点描述，被notion中的页面描述覆盖

  // 开发相关
  notion_access_token: process.env.notion_access_token || '', // useful if you prefer not to make your database public
  debug: process.env.next_public_debug || false, // 是否显示调试按钮
  enable_cache:
    process.env.enable_cache ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.npm_lifecycle_event === 'export', // 在打包过程中默认开启缓存，开发或运行时开启此功能意义不大。
  isprod: process.env.vercel_env === 'production' || process.env.export, // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)  isprod: process.env.vercel_env === 'production' // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  bundle_analyzer: process.env.analyze === 'true' || false, // 是否展示编译依赖内容与大小
  version: process.env.next_public_version // 版本号
}

module.exports = blog
