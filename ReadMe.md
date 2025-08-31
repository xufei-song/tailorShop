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
