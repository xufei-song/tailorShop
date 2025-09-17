# NextAuth.js 集成完成指南

## 概述

已成功将 NextAuth.js 集成到 TailorShop 管理后台，参考了 `next.js/examples/auth/` 示例的实现模式。

## 完成的功能

### ✅ 数据库模型
- 在 `prisma/schema.prisma` 中添加了 `AdminUser` 模型
- 支持用户名、邮箱、密码哈希、登录限制等字段

### ✅ NextAuth.js 配置
- 更新了 `admin/pages/api/auth/[...nextauth].js`
- 支持凭据认证（用户名/密码）
- 集成了 Prisma 数据库
- 添加了安全功能（密码加密、登录限制、账户锁定）

### ✅ 登录页面集成
- 更新了 `admin/pages/login.js`
- 集成了 NextAuth.js 的 `signIn` 函数
- 添加了错误处理和用户反馈
- 保持了原有的美观 UI 设计

### ✅ 管理后台认证
- 更新了 `admin/pages/index.js`
- 添加了服务端认证检查
- 集成了用户信息显示和登出功能
- 添加了 SessionProvider 支持

### ✅ 会话管理
- 在 `admin/pages/_app.js` 中添加了 SessionProvider
- 支持客户端和服务端会话管理

## 使用方法

### 1. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push

# 创建默认管理员用户
npm run create-admin-user
```

### 2. 启动应用

```bash
# 启动管理后台
npm run dev:admin
```

### 3. 登录

访问 `http://localhost:3001/login`，使用以下凭据：

- **用户名**: `admin`
- **密码**: `admin123`
- **邮箱**: `admin@tailorshop.com`

## 安全特性

### 🔐 密码安全
- 使用 bcrypt 加密存储密码（12轮加密）
- 密码不会以明文形式存储

### 🚫 登录保护
- 连续 5 次登录失败后账户锁定 15 分钟
- 支持账户激活/禁用状态管理
- 详细的错误信息提示

### ⏰ 会话管理
- JWT Token 认证
- 24 小时会话有效期
- 自动登出功能
- 服务端会话验证

### 🛡️ 安全特性
- CSRF 保护
- 安全的 Cookie 设置
- 环境变量配置

## 文件结构

```
admin/
├── pages/
│   ├── _app.js                 # 添加了 SessionProvider
│   ├── index.js               # 更新了认证检查和用户界面
│   ├── login.js               # 集成了 NextAuth.js 登录
│   └── api/auth/
│       └── [...nextauth].js   # NextAuth.js 配置
├── components/
│   └── SessionProvider.js     # 会话提供者组件
└── lib/
    └── prisma.ts              # Prisma 客户端

prisma/
└── schema.prisma              # 添加了 AdminUser 模型

scripts/
└── create-admin-user.js       # 管理员用户创建脚本
```

## 环境变量

确保在 `.env.local` 中设置以下变量：

```env
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth.js 配置
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3001"
```

## 参考示例

本实现参考了以下 Next.js examples：

1. **`next.js/examples/auth/`** - NextAuth.js 基础配置
2. **`next.js/examples/prisma-postgres/`** - Prisma 数据库集成
3. **`next.js/examples/with-passport/`** - 认证流程和 UI 设计

## 下一步

1. **生产环境配置**
   - 修改默认密码
   - 配置强随机 NEXTAUTH_SECRET
   - 设置正确的 NEXTAUTH_URL

2. **功能扩展**
   - 添加密码重置功能
   - 支持多管理员用户
   - 添加角色权限管理

3. **监控和日志**
   - 添加登录日志记录
   - 监控异常登录尝试
   - 定期备份用户数据

## 故障排除

### 常见问题

1. **登录失败**
   - 检查数据库连接
   - 确认管理员用户已创建
   - 检查环境变量配置

2. **会话过期**
   - 检查 NEXTAUTH_SECRET 配置
   - 确认 NEXTAUTH_URL 正确

3. **数据库错误**
   - 运行 `npm run db:push` 更新数据库结构
   - 检查 DATABASE_URL 配置

## 支持

如有问题，请查看：
- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [Prisma 官方文档](https://www.prisma.io/docs/)
- 项目 Issues 页面
