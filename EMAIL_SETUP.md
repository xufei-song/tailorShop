# 邮件发送功能配置指南

## 概述

本项目已集成 Resend + React Email 的邮件发送功能，支持自动发送预约确认邮件和提醒邮件。

## 功能特性

- ✅ 预约创建时自动发送确认邮件
- ✅ 预约状态更新时发送通知邮件
- ✅ 支持预约提醒邮件
- ✅ 美观的 HTML 邮件模板
- ✅ 错误处理和日志记录
- ✅ 完整的 API 测试用例

## 环境配置

### 1. 安装依赖

依赖已添加到 `package.json` 中：

```json
{
  "dependencies": {
    "resend": "^3.2.0",
    "react-email": "^2.0.0",
    "@react-email/components": "^0.0.20"
  }
}
```

运行安装命令：

```bash
npm install
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp env.example .env.local
```

在 `.env.local` 中配置以下变量：

```env
# Resend API 配置
RESEND_API_KEY="re_xxxxxxxxx"
FROM_EMAIL="noreply@yourdomain.com"

# Next.js 应用 URL（用于内部 API 调用）
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 获取 Resend API Key

1. 访问 [Resend 官网](https://resend.com)
2. 注册账号并登录
3. 在控制台中创建 API Key
4. 将 API Key 配置到环境变量中

## 项目结构

```
TailorShop/
├── lib/
│   └── email/
│       ├── index.js                    # 邮件服务主文件
│       └── templates/
│           ├── AppointmentConfirmation.jsx  # 预约确认邮件模板
│           └── AppointmentReminder.jsx      # 预约提醒邮件模板
├── admin/
│   └── pages/
│       └── api/
│           └── appointments/
│               └── index.js            # 管理端预约 API（包含邮件发送功能）
└── test/
    └── api-test.http                   # API 测试用例
```

## API 接口

### 邮件发送接口（管理端）

**端点：** `PUT /api/appointments` (管理端端口 3001)

**请求体：**

```json
{
  "action": "send-email",
  "type": "appointment_confirmation",
  "appointment": {
    "name": "客户姓名",
    "phone": "13800138000",
    "email": "customer@example.com",
    "appointmentTime": "2024-12-25T10:00:00.000Z",
    "notes": "备注信息",
    "status": 0
  }
}
```

**支持的邮件类型：**

- `appointment_confirmation` - 预约确认邮件
- `appointment_reminder` - 预约提醒邮件
- `custom` - 自定义邮件

### 邮件服务状态接口

**端点：** `PUT /api/appointments` (管理端端口 3001)

**请求体：**

```json
{
  "action": "email-status"
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "service": "Resend",
    "configured": true,
    "fromEmail": "noreply@yourdomain.com",
    "supportedTypes": [
      "appointment_confirmation",
      "appointment_reminder",
      "custom"
    ]
  }
}
```

## 自动邮件发送

### 预约创建时

当用户创建新预约时，系统会自动发送确认邮件：

```javascript
// 在 shop/pages/api/appointments/index.js 中
const newAppointment = await AppointmentModel.create({...});

// 自动发送确认邮件（通过管理端接口）
const emailResult = await fetch('http://localhost:3001/api/appointments', {
  method: 'PUT',
  body: JSON.stringify({
    action: 'send-email',
    type: 'appointment_confirmation',
    appointment: newAppointment
  })
});
```

### 预约状态更新时

当管理员更新预约状态时，系统会发送通知邮件：

```javascript
// 在 admin/pages/api/appointments/[id].js 中
const updatedAppointment = await AppointmentModel.update(id, updateData);

// 如果状态发生变化，发送邮件通知
if (updateData.isProcessed !== undefined) {
  const emailResult = await fetch('http://localhost:3001/api/appointments', {
    method: 'PUT',
    body: JSON.stringify({
      action: 'send-email',
      type: 'appointment_confirmation',
      appointment: updatedAppointment
    })
  });
}
```

## 邮件模板

### 预约确认邮件模板

- 包含完整的预约信息
- 显示预约时间、客户信息
- 提供联系方式
- 响应式设计，支持各种邮件客户端

### 预约提醒邮件模板

- 简洁的提醒信息
- 突出预约时间
- 提供变更联系方式

## 测试

### 运行测试

使用提供的 HTTP 测试文件：

```bash
# 启动开发服务器
npm run dev

# 在 VS Code 中使用 REST Client 插件运行测试
# 或使用 curl 命令
```

### 测试用例

测试文件包含以下测试用例：

1. **邮件服务状态测试** - 检查服务配置
2. **预约确认邮件测试** - 测试确认邮件发送
3. **预约提醒邮件测试** - 测试提醒邮件发送
4. **错误处理测试** - 测试无效参数处理
5. **集成测试** - 测试预约创建时的自动邮件发送

## 错误处理

### 常见问题

1. **API Key 未配置**
   ```
   错误：RESEND_API_KEY 环境变量未设置
   解决：检查 .env.local 文件中的配置
   ```

2. **邮件发送失败**
   ```
   错误：邮件发送失败
   解决：检查 Resend API Key 是否有效，网络连接是否正常
   ```

3. **模板渲染错误**
   ```
   错误：React 组件渲染失败
   解决：检查邮件模板组件的 props 传递
   ```

### 日志记录

系统会记录详细的日志信息：

- 邮件发送成功/失败状态
- 错误详情和堆栈信息
- API 请求和响应信息

## 部署注意事项

### 生产环境配置

1. **环境变量**
   - 确保生产环境配置了正确的 `RESEND_API_KEY`
   - 设置正确的 `FROM_EMAIL` 域名
   - 配置正确的 `NEXTAUTH_URL`

2. **域名验证**
   - 在 Resend 控制台中验证发送域名
   - 配置 SPF、DKIM 记录

3. **监控和告警**
   - 监控邮件发送成功率
   - 设置失败告警机制

## 扩展功能

### 添加新的邮件模板

1. 在 `lib/email/templates/` 中创建新的模板组件
2. 在 `lib/email/index.js` 中添加发送函数
3. 在 `pages/api/email/send.js` 中添加新的邮件类型处理

### 自定义邮件样式

修改模板组件中的样式对象，支持：
- 响应式设计
- 深色模式
- 自定义品牌色彩
- 多语言支持

## 参考文档

- [Resend 官方文档](https://resend.com/docs)
- [React Email 文档](https://react.email/docs)
- [Next.js API 路由文档](https://nextjs.org/docs/api-routes/introduction)
