# 认证配置管理指南

## 📖 概述

本项目支持通过环境变量动态切换 NextAuth.js 的认证配置，包括开发环境和生产环境两种配置模式。

## 🔧 配置文件结构

```
admin/lib/
├── auth.js              # 开发环境配置（详细日志、宽松安全设置）
├── auth-production.js   # 生产环境配置（简化日志、严格安全设置）
├── auth-loader.js       # 配置加载器（根据环境变量选择配置）
└── auth-config.js       # 统一配置（可选，包含所有配置逻辑）
```

## 🌍 环境变量控制

### 主要环境变量

| 环境变量 | 值 | 效果 | 优先级 |
|---------|-----|------|--------|
| `USE_DEV_AUTH` | `true` | 强制使用开发环境配置 | 1（最高） |
| `USE_PRODUCTION_AUTH` | `true` | 强制使用生产环境配置 | 2 |
| `NODE_ENV` | `production` | 自动使用生产环境配置 | 3 |
| 无设置 | - | 默认使用开发环境配置 | 4（最低） |

### 配置示例

#### 1. 强制使用生产环境配置
```bash
# 方法1：命令行设置
USE_PRODUCTION_AUTH=true npm run dev:admin

# 方法2：.env 文件设置
echo "USE_PRODUCTION_AUTH=true" >> .env
npm run dev:admin
```

#### 2. 强制使用开发环境配置
```bash
# 方法1：命令行设置
USE_DEV_AUTH=true npm run dev:admin

# 方法2：.env 文件设置
echo "USE_DEV_AUTH=true" >> .env
npm run dev:admin
```

#### 3. 自动环境检测
```bash
# 开发环境（默认）
npm run dev:admin

# 生产环境
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## 🔍 配置差异对比

### 开发环境配置 (`auth.js`)

**特点：**
- ✅ 详细的控制台日志输出
- ✅ 自动设置环境变量
- ✅ 宽松的安全设置
- ✅ 便于调试和问题排查

**适用场景：**
- 本地开发
- 功能测试
- 问题调试

### 生产环境配置 (`auth-production.js`)

**特点：**
- ✅ 简化的日志输出
- ✅ 严格的安全设置
- ✅ 优化的性能配置
- ✅ 防止敏感信息泄露

**适用场景：**
- 生产环境部署
- 性能测试
- 安全验证

## 🚀 部署配置

### 开发环境
```bash
# 使用默认开发配置
npm run dev:admin

# 或强制使用开发配置
USE_DEV_AUTH=true npm run dev:admin
```

### 生产环境
```bash
# 方法1：使用 NODE_ENV
NODE_ENV=production npm run build
NODE_ENV=production npm start

# 方法2：强制使用生产配置
USE_PRODUCTION_AUTH=true npm run build
USE_PRODUCTION_AUTH=true npm start
```

### Docker 部署
```dockerfile
# Dockerfile
ENV NODE_ENV=production
ENV USE_PRODUCTION_AUTH=true
```

### Vercel 部署
```json
// vercel.json
{
  "env": {
    "NODE_ENV": "production",
    "USE_PRODUCTION_AUTH": "true"
  }
}
```

## 🧪 测试配置

### 运行配置测试
```bash
# 测试所有配置场景
node scripts/test-auth-config.js
```

### 验证当前配置
```bash
# 查看当前使用的配置
curl http://localhost:3001/api/auth/session
```

## 🔒 安全注意事项

### 开发环境
- 使用非安全 Cookie（便于本地测试）
- 输出详细调试信息
- 自动设置默认环境变量

### 生产环境
- 强制使用安全 Cookie
- 关闭调试信息
- 依赖外部环境变量配置
- 记录安全相关日志

## 📝 最佳实践

### 1. 环境变量管理
```bash
# 开发环境 .env.local
NODE_ENV=development
USE_DEV_AUTH=true

# 生产环境 .env.production
NODE_ENV=production
USE_PRODUCTION_AUTH=true
```

### 2. 配置验证
```javascript
// 在应用启动时验证配置
console.log('🔐 当前认证配置:', process.env.USE_PRODUCTION_AUTH ? '生产环境' : '开发环境')
```

### 3. 日志监控
```javascript
// 生产环境监控
if (process.env.NODE_ENV === 'production') {
  // 发送安全事件到监控系统
  monitorSecurityEvent('auth_config_loaded', { config: 'production' })
}
```

## 🐛 故障排除

### 常见问题

1. **配置未生效**
   - 检查环境变量是否正确设置
   - 重启服务器
   - 清除浏览器缓存

2. **导入错误**
   - 检查文件路径是否正确
   - 确保所有依赖已安装
   - 检查 Node.js 版本兼容性

3. **环境变量未读取**
   - 确保 .env 文件在正确位置
   - 检查环境变量名称拼写
   - 重启开发服务器

### 调试命令
```bash
# 查看环境变量
node -e "console.log(process.env)"

# 测试配置加载
node -e "const { authOptions } = require('./admin/lib/auth-loader'); console.log('配置加载成功')"

# 验证 NextAuth 配置
curl -X GET http://localhost:3001/api/auth/providers
```

## 📚 相关文档

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [环境变量配置指南](./ENVIRONMENT_VARIABLES.md)
- [部署配置说明](./DEPLOYMENT_GUIDE.md)
- [安全最佳实践](./SECURITY_GUIDE.md)
