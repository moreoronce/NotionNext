# SkillsMP Blog

基于 [NotionNext](https://github.com/tangly1024/NotionNext) 的个人博客，使用 Notion 作为 CMS，部署在 Vercel 上。

## ✨ 主题特色

**SkillsMP** 是一个自定义的终端/代码风格主题，具有以下特点：

- 🎨 **暖色调设计** - 以 `#cc7a60` 为主色调的温暖配色
- 💻 **终端风格卡片** - PostCard 采用代码块样式展示文章
- 🔤 **等宽字体** - JetBrains Mono + 中文字体优化
- 📱 **响应式布局** - 适配桌面和移动端

## 🚀 最新更新

### v4.9.2-skillsmp (2026-01-12)

#### 文章页优化
- ✅ **代码块样式** - 深色主题 `prism-okaidia`，工具栏按钮修复
- ✅ **列表行间距** - 减小到 2px，更紧凑
- ✅ **标题锚点** - 图标移至文本末尾，hover 时显示
- ✅ **目录导航** - 修复 TOC 链接 ID 匹配问题
- ✅ **图片占位符** - 骨架屏动画，防止布局跳动

#### 分类/标签页
- ✅ **终端风格** - 命令行样式标题 (`$ ls ./categories/`)
- ✅ **文件卡片** - 模拟代码文件的分类展示

#### 页脚优化
- ✅ **动态公告** - 从 Notion 读取公告内容
- ✅ **动态版权年份** - 自动更新当前年份

## 📁 项目结构

```
themes/skillsmp/
├── index.js              # 主题入口，布局定义
├── style.js              # 全局样式 (CSS-in-JS)
├── components/
│   ├── Header.js         # 顶部导航
│   ├── Footer.js         # 页脚
│   ├── PostCard.js       # 文章卡片 (终端风格)
│   ├── CategoryGrid.js   # 分类网格
│   ├── TableOfContents.js # 文章目录
│   └── ...
```

## ⚙️ 配置

### 环境变量

```env
NOTION_PAGE_ID=你的Notion页面ID
```

### blog.config.js

```javascript
BLOG: {
  THEME: 'skillsmp',
  // ...
}
```

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📦 部署

推送到 GitHub 后，Vercel 会自动触发部署。

## 🙏 致谢

- [NotionNext](https://github.com/tangly1024/NotionNext) - 原始项目
- [react-notion-x](https://github.com/NotionX/react-notion-x) - Notion 渲染
- [Tailwind CSS](https://tailwindcss.com) - 样式框架

## 📄 License

MIT License
