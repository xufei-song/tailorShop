# Prisma客户端管理脚本

## 🚀 快速使用

### 重置Prisma客户端（推荐）
```bash
# 方法1: 标准重置（推荐，跨平台）
npm run reset-prisma

# 方法2: 强制重置（包含进程终止）
npm run reset-prisma:kill

# 方法3: 直接运行脚本
node scripts/reset-prisma.js

# 方法4: 带参数运行
node scripts/reset-prisma.js --kill
```

### 创建管理员用户
```bash
npm run create-admin
```

## 📋 脚本功能

### `reset-prisma.js` - Prisma客户端重置脚本
**功能：**
- ✅ 删除损坏的Prisma客户端目录
- ✅ 重新生成Prisma客户端
- ✅ 同步数据库结构
- ✅ 验证所有表是否正常工作
- ✅ 跨平台兼容（Windows/Linux/macOS）
- ✅ 彩色输出，步骤清晰
- ✅ 可选的进程终止功能
- ✅ 详细的错误处理和解决建议

**使用方式：**
- `npm run reset-prisma` - 标准重置
- `npm run reset-prisma:kill` - 强制重置（包含进程终止）
- `node scripts/reset-prisma.js --kill` - 带参数运行

**适用场景：**
- Prisma客户端生成失败
- 数据库表结构不同步
- Schema更新后需要重新生成
- 日常维护和调试
- 文件占用问题

## 🔧 其他可用命令

```bash
# 数据库操作
npm run db:generate    # 生成Prisma客户端
npm run db:push        # 推送数据库结构
npm run db:seed        # 运行数据库种子

# 应用启动
npm run dev:admin      # 启动管理后台 (端口3001)
npm run dev:web        # 启动前端店铺 (端口3000)
```

## 🆘 常见问题解决

### 1. EPERM权限错误
```
Error: EPERM: operation not permitted
```
**解决方案：** 
- Windows: 以管理员身份运行PowerShell
- Linux/macOS: 使用 `sudo` 运行或检查文件权限

### 2. 表不存在错误
```
Error: Table 'admin_users' does not exist
```
**解决方案：** 运行 `npm run reset-prisma`

### 3. Prisma客户端未找到
```
Error: Cannot find module '@prisma/client'
```
**解决方案：** 
1. 运行 `npm install`
2. 运行 `npm run reset-prisma`

### 4. 数据库连接失败
```
Error: Can't reach database server
```
**解决方案：** 检查 `.env` 文件中的 `DATABASE_URL` 配置

### 5. 文件占用问题
```
Error: EBUSY: resource busy or locked
```
**解决方案：** 运行 `npm run reset-prisma:full`（会停止Node.js进程）

## 🎯 推荐工作流程

### 首次设置
```bash
# 1. 安装依赖
npm install

# 2. 重置Prisma客户端
npm run reset-prisma

# 3. 创建管理员用户
npm run create-admin

# 4. 启动管理后台
npm run dev:admin
```

### 日常开发
```bash
# 遇到Prisma问题时
npm run reset-prisma
```

### 严重问题时
```bash
# 强制重置（会停止所有Node.js进程）
npm run reset-prisma:kill
```

## 📝 注意事项

1. **首次使用**：确保已运行 `npm install` 安装依赖
2. **环境变量**：确保 `.env` 文件存在且配置正确
3. **数据安全**：重置脚本不会删除数据库数据
4. **跨平台**：JavaScript脚本在所有平台上都能正常工作
5. **权限问题**：如果遇到权限问题，请以管理员身份运行

## 🌟 脚本特点

- **跨平台兼容**：支持Windows、Linux、macOS
- **彩色输出**：清晰的步骤提示和状态显示
- **错误处理**：详细的错误信息和解决建议
- **安全可靠**：不会删除数据库数据
- **快速执行**：通常几秒钟内完成重置

现在您有了完整的跨平台Prisma客户端管理工具！🎉
