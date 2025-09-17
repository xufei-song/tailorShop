# JWT 解密错误故障排除指南

## 🔍 错误类型

### JWEDecryptionFailed 错误
```
JWEDecryptionFailed: decryption operation failed
```

**错误原因：**
- JWT token 使用了不同的 NEXTAUTH_SECRET 密钥
- 浏览器缓存了旧的 session token
- 环境变量配置冲突

## 🛠️ 快速修复

### 方法1：使用修复脚本（推荐）
```bash
npm run fix-jwt
```

### 方法2：手动修复
```bash
# 1. 生成新的密钥
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 2. 更新 .env 文件
# 将生成的密钥替换 NEXTAUTH_SECRET

# 3. 清除浏览器缓存
# F12 → Application → Storage → Clear storage

# 4. 重启服务器
npm run dev:admin
```

## 🔧 详细解决步骤

### 步骤1：生成新的 NEXTAUTH_SECRET
```bash
# 使用 Node.js 生成
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 使用 OpenSSL 生成
openssl rand -base64 32

# 在线生成
# https://generate-secret.vercel.app/32
```

### 步骤2：更新环境变量
```bash
# 编辑 .env 文件
NEXTAUTH_SECRET="your-new-secret-here"
```

### 步骤3：清除浏览器数据
1. **Chrome/Edge:**
   - 按 `F12` 打开开发者工具
   - 点击 **Application** 标签页
   - 左侧找到 **Storage** → **Clear storage**
   - 勾选所有选项，点击 **Clear site data**
   - 按 `Ctrl + Shift + R` 硬刷新

2. **Firefox:**
   - 按 `F12` 打开开发者工具
   - 点击 **Storage** 标签页
   - 右键点击域名 → **Delete All**
   - 按 `Ctrl + Shift + R` 硬刷新

3. **Safari:**
   - 按 `Cmd + Option + I` 打开开发者工具
   - 点击 **Storage** 标签页
   - 点击 **Clear All**
   - 按 `Cmd + Shift + R` 硬刷新

### 步骤4：重启服务器
```bash
# 停止服务器
taskkill /F /IM node.exe  # Windows
# 或
pkill -f node            # Linux/macOS

# 重新启动
npm run dev:admin
```

## 🔍 验证修复

### 检查1：访问管理后台
```bash
# 访问 http://localhost:3001/
# 应该自动跳转到登录页面
```

### 检查2：测试登录
```bash
# 使用默认凭据登录
# 用户名：admin
# 密码：admin123
# 应该成功进入管理后台
```

### 检查3：检查控制台
```bash
# 应该看到类似输出：
# 🔐 认证配置加载: 生产环境配置
# 服务端认证检查 - Session: 存在
```

## 🚨 常见问题

### Q1: 修复后仍然出现错误
**解决方案：**
1. 确保完全清除了浏览器缓存
2. 检查 .env 文件是否正确更新
3. 重启服务器
4. 尝试无痕模式访问

### Q2: 环境变量未生效
**解决方案：**
```bash
# 检查环境变量
node -e "console.log(process.env.NEXTAUTH_SECRET)"

# 重启服务器
npm run dev:admin
```

### Q3: 多个浏览器都有问题
**解决方案：**
1. 清除所有浏览器的缓存
2. 检查是否有代理或扩展干扰
3. 尝试不同的网络环境

## 🔒 预防措施

### 1. 环境变量管理
```bash
# 开发环境
.env.local
NEXTAUTH_SECRET="dev-secret"

# 生产环境
.env.production
NEXTAUTH_SECRET="prod-secret"
```

### 2. 密钥轮换
```bash
# 定期更新密钥
npm run fix-jwt
```

### 3. 监控和日志
```javascript
// 添加 JWT 错误监控
if (error.name === 'JWEDecryptionFailed') {
  console.error('JWT 解密失败，可能需要更新密钥');
  // 发送到监控系统
}
```

## 📚 相关文档

- [NextAuth.js JWT 配置](https://next-auth.js.org/configuration/options#jwt)
- [环境变量管理指南](./ENVIRONMENT_VARIABLES.md)
- [认证配置管理指南](./AUTH_CONFIG_GUIDE.md)
- [部署配置说明](./DEPLOYMENT_GUIDE.md)

## 🆘 获取帮助

如果问题仍然存在，请提供以下信息：

1. **错误信息**：完整的错误堆栈
2. **环境信息**：Node.js 版本、Next.js 版本
3. **配置信息**：.env 文件内容（隐藏敏感信息）
4. **操作步骤**：重现问题的具体步骤
5. **浏览器信息**：浏览器类型和版本
