TailorShop 根目录示例（基于 Next.js，根目录构建，参考工程只读）

目录结构

```
.
├─ package.json
├─ next.config.js
├─ pages
│  ├─ index.js                # 前端页面：按钮调用 API 并显示返回文本
│  └─ api
│     └─ hello.js             # Mock API：返回纯文本
├─ admin
│  └─ pages
│     └─ index.js             # Admin 管理页骨架（独立端口）
├─ .cursorrules               # 项目规则（根构建、next.js 为参考只读）
└─ next.js/                   # 官方仓库下载的参考工程（只读，不修改）
```

运行

```
npm i
# 前台
npm run dev:web      # http://localhost:3000
# 或
npm run dev          # 等价于 dev:web

# 管理后台（独立端口）
npm run dev:admin    # http://localhost:3001
```

说明

- 根目录构建与运行；`next.js` 目录为参考工程，禁止修改。
- 前台首页位于 `pages/index.js`（现代风格纯前端主页）。
- Admin 位于 `admin/pages/index.js`，通过 `npm run dev:admin` 在 3001 端口启动。


# 数据库浏览
$env:DATABASE_URL="file:../dev.db"; npx prisma studio --browser none

Necessary MCP Tools
- 
BrowserTools MCP 启动与连接（Windows）

```
# 1) 启动 BrowserTools Server（聚合器）——先开这个窗口并保持运行
$env:BROWSER_TOOLS_HOST="127.0.0.1"; $env:BROWSER_TOOLS_PORT="3025"; npx -y @agentdeskai/browser-tools-server@1.2.0

# 可选：确认端口在监听
Get-NetTCPConnection -LocalAddress 127.0.0.1 -LocalPort 3025 -State Listen

# 2) 在 Edge/Chrome 打开目标页面，按 F12 打开 DevTools
#    面板栏里找到 BrowserToolsMCP 面板（可能在 >> 里），
#    Server Host 填 127.0.0.1，Server Port 填 3025，Test Connection

# 3) 启动 BrowserTools MCP（与聚合器同一 host/port）
$env:BROWSER_TOOLS_HOST="127.0.0.1"; $env:BROWSER_TOOLS_PORT="3025"; npx -y @agentdeskai/browser-tools-mcp@1.2.0

# 4) 在 Cursor 中新增 MCP Server（同一 host/port）
{
  "name": "browser-tools",
  "command": "npx",
  "args": ["-y","@agentdeskai/browser-tools-mcp@1.2.0"],
  "env": { "BROWSER_TOOLS_HOST": "127.0.0.1", "BROWSER_TOOLS_PORT": "3025" }
}

# 端口被占用时：将 3025 改为 3026，三处同时修改（server、扩展面板、MCP）
# 防火墙：首次运行允许 node.exe 通过专用网络
```

# 邮件发送功能

## 当前配置

项目已集成 Resend 邮件发送功能，支持自动发送预约确认邮件。

- **发送邮箱**：`onboarding@resend.dev`（Resend 测试域名）
- **收件人限制**：目前只能发送到 `songxf17@gmail.com`（测试模式限制）
- **API 接口**：管理端 `PUT /api/appointments` 支持邮件发送

## 生产环境配置

### 购买并配置自定义域名

1. **购买域名**
   - 购买一个自定义域名（如 `yourcompany.com`）
   - 确保域名解析服务正常

2. **在 Resend 中添加域名**
   - 访问 [Resend 域名管理页面](https://resend.com/domains/add)
   - 登录 Resend 账户
   - 点击 "Add Domain" 添加您的域名
   - 按照指示配置 DNS 记录（SPF、DKIM 等）

3. **更新环境变量**
   ```env
   # 在 .env.local 中配置
   RESEND_API_KEY="your-resend-api-key"
   FROM_EMAIL="noreply@yourcompany.com"
   ```

4. **更新代码配置**
   - 修改 `lib/email/simple-test.js` 中的 `FROM_EMAIL`
   - 修改 `admin/pages/api/appointments/index.js` 中的 `FROM_EMAIL`

### 验证域名配置

域名验证成功后，您将能够：
- 发送邮件到任何邮箱地址
- 使用自定义的发送邮箱地址
- 提高邮件投递率
- 建立品牌信任度

### 相关文档

- [Resend 域名配置指南](https://resend.com/docs/domains/introduction)
- [Resend 域名管理页面](https://resend.com/domains/add)
- [邮件发送 API 文档](./EMAIL_SETUP.md)