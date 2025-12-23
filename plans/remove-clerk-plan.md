# 移除Clerk认证系统的计划

## 项目概述
这是一个NextJS项目，需要移除所有与Clerk相关的登录、注册、个人控制面板功能。

## 分析结果

### Clerk相关组件和文件
1. **依赖项** (package.json):
   - `@clerk/localizations`: ^3.17.1
   - `@clerk/nextjs`: ^5.7.5

2. **中间件** (middleware.ts):
   - 使用 `clerkMiddleware` 进行身份验证
   - 保护 `/dashboard` 和 `/user/*` 路由
   - 当环境变量 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 存在时启用Clerk

3. **全局状态** (lib/global.js):
   - 使用 `useUser` hook 获取用户信息
   - 提供 `isLoaded`, `isSignedIn`, `user` 状态

4. **页面文件**:
   - `pages/auth/index.js` - 认证页面
   - `pages/auth/result.js` - 认证结果页面
   - `pages/dashboard/[[...index]].js` - 个人控制面板
   - `pages/sign-in/[[...index]].js` - 登录页面
   - `pages/sign-up/[[...index]].js` - 注册页面

5. **API路由**:
   - `pages/api/auth/callback/notion.ts` - Notion认证回调
   - `pages/api/user.ts` - 用户相关API

## 修改计划

### 1. 移除Clerk依赖
- 从 `package.json` 中删除 `@clerk/localizations` 和 `@clerk/nextjs` 依赖项
- 运行 `npm install` 或 `yarn install` 更新依赖

### 2. 修改中间件 (middleware.ts)
- 移除 `clerkMiddleware` 导入
- 将 `authMiddleware` 替换为 `noAuthMiddleware`
- 移除所有Clerk相关的路由保护逻辑

### 3. 修改全局状态 (lib/global.js)
- 移除 `useUser` hook 的使用
- 将 `isLoaded`, `isSignedIn`, `user` 状态设置为默认值 (false)
- 移除Clerk相关的条件判断

### 4. 删除认证相关页面
- 删除 `pages/auth/` 目录及其内容
- 删除 `pages/dashboard/` 目录及其内容
- 删除 `pages/sign-in/` 目录及其内容
- 删除 `pages/sign-up/` 目录及其内容

### 5. 删除认证相关API
- 删除 `pages/api/auth/` 目录及其内容
- 删除 `pages/api/user.ts` 文件

### 6. 检查其他引用
- 确认项目中没有其他地方引用Clerk
- 检查配置文件中是否有Clerk相关设置

### 7. 测试验证
- 运行项目确保没有错误
- 检查页面正常加载
- 验证路由重定向正常工作

## 注意事项
- 移除Clerk后，所有需要认证的功能将不再可用
- 如果项目中有依赖用户认证的业务逻辑，需要相应调整
- 建议在生产环境部署前进行充分测试

## 预期结果
移除Clerk后，项目将成为一个纯静态博客系统，不再支持用户登录、注册和个人控制面板功能。