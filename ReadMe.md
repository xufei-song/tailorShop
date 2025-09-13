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
