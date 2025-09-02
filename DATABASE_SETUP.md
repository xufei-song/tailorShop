# TailorShop 数据库设置指南

## 概述

本项目使用 Prisma ORM 和 SQLite 数据库来管理预约数据。数据库配置位于根目录，供 `shop` 和 `admin` 两个项目共享使用。

## 项目结构

```
TailorShop/
├── lib/
│   ├── prisma.ts              # Prisma 客户端配置
│   └── models/
│       └── Appointment.js     # 预约数据模型
├── prisma/
│   ├── schema.prisma          # 数据库模式定义
│   └── seed.ts               # 种子数据
├── shop/pages/api/appointments/  # 前端 API 路由
├── admin/pages/api/appointments/ # 管理后台 API 路由
└── env.example               # 环境变量示例
```

## 安装和设置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 文件并重命名为 `.env.local`：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，设置你的数据库连接字符串：

```env
DATABASE_URL="file:./dev.db"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式到数据库
npm run db:push

# 运行种子数据（可选）
npm run db:seed
```

## 数据模型

### Appointment（预约）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Int | 主键，自增 |
| appointmentTime | DateTime | 预约时间 |
| name | String | 姓名 |
| phone | String | 手机号 |
| email | String | 邮箱地址 |
| notes | String? | 备注（可选） |
| isProcessed | Boolean | 是否处理（默认 false） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

## API 接口

### 前端 API（shop）

#### 获取预约列表
```
GET /api/appointments
查询参数：
- isProcessed: boolean (可选) - 是否处理
- page: number (可选) - 页码，默认 1
- limit: number (可选) - 每页数量，默认 10
```

#### 创建预约
```
POST /api/appointments
请求体：
{
  "appointmentTime": "2024-01-15T10:00:00Z",
  "name": "张三",
  "phone": "13800138001",
  "email": "zhangsan@example.com",
  "notes": "备注信息"
}
```

#### 获取单个预约
```
GET /api/appointments/[id]
```

#### 更新预约
```
PUT /api/appointments/[id]
```

#### 删除预约
```
DELETE /api/appointments/[id]
```

### 管理后台 API（admin）

管理后台 API 提供额外的管理功能：

#### 获取预约统计
```
GET /api/appointments/stats
```

#### 快速标记为已处理
```
PATCH /api/appointments/[id]
请求体：
{
  "action": "mark-processed"
}
```

## 使用示例

### 在页面中使用

```javascript
// 获取预约列表
const response = await fetch('/api/appointments')
const data = await response.json()

// 创建新预约
const newAppointment = await fetch('/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    appointmentTime: new Date().toISOString(),
    name: '客户姓名',
    phone: '13800138000',
    email: 'customer@example.com',
    notes: '预约备注'
  })
})
```

### 在服务端使用

```javascript
import { AppointmentModel } from '../../lib/models/Appointment'

// 创建预约
const appointment = await AppointmentModel.create({
  appointmentTime: new Date(),
  name: '张三',
  phone: '13800138001',
  email: 'zhangsan@example.com',
  notes: '首次预约'
})

// 获取预约列表
const appointments = await AppointmentModel.findAll({
  isProcessed: false,
  skip: 0,
  take: 10
})
```

## 开发命令

```bash
# 启动前端开发服务器
npm run dev:web

# 启动管理后台开发服务器
npm run dev:admin

# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 运行种子数据
npm run db:seed
```

## 注意事项

1. 确保在运行应用前先执行 `npm run db:generate` 和 `npm run db:push`
2. 数据库文件 `dev.db` 会在项目根目录生成
3. 生产环境建议使用 PostgreSQL 或 MySQL
4. 所有 API 都返回统一的 JSON 格式：`{ success: boolean, data?: any, message?: string }`
