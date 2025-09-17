# TailorShop API 接口文档

## 概述

TailorShop 项目提供两套 API 接口：
- **前端 API** (端口 3000)：面向客户端的预约接口
- **管理后台 API** (端口 3001)：管理功能更丰富的接口

所有 API 都返回统一的 JSON 格式：
```json
{
  "success": boolean,
  "data": any,
  "message": string
}
```

## 数据模型

### Appointment（预约）

| 字段 | 类型 | 说明 | 必填 |
|------|------|------|------|
| id | Int | 主键，自增 | - |
| appointmentTime | DateTime | 预约时间 | ✅ |
| name | String | 姓名 | ✅ |
| phone | String | 手机号 | ✅ |
| email | String | 邮箱地址 | ✅ |
| notes | String? | 备注（可选） | ❌ |
| isProcessed | Boolean | 是否处理（默认 false） | ❌ |
| createdAt | DateTime | 创建时间 | - |
| updatedAt | DateTime | 更新时间 | - |

## 前端 API (端口 3000)

### 1. 获取预约列表

**接口：** `GET /api/appointments`

**查询参数：**
- `isProcessed` (boolean, 可选) - 是否处理
- `page` (number, 可选) - 页码，默认 1
- `limit` (number, 可选) - 每页数量，默认 10

**示例请求：**
```http
GET http://localhost:3000/api/appointments?isProcessed=false&page=1&limit=10
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointmentTime": "2024-01-15T10:00:00.000Z",
      "name": "张三",
      "phone": "13800138001",
      "email": "zhangsan@example.com",
      "notes": "首次预约，需要量体",
      "isProcessed": false,
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T08:00:00.000Z"
    }
  ]
}
```

### 2. 创建预约

**接口：** `POST /api/appointments`

**请求体：**
```json
{
  "appointmentTime": "2024-01-15T10:00:00Z",
  "name": "张三",
  "phone": "13800138001",
  "email": "zhangsan@example.com",
  "notes": "备注信息"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentTime": "2024-01-15T10:00:00.000Z",
    "name": "张三",
    "phone": "13800138001",
    "email": "zhangsan@example.com",
    "notes": "备注信息",
    "isProcessed": false,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "message": "预约创建成功"
}
```

### 3. 获取轮播图配置

**接口：** `GET /api/carousel`

**响应示例：**
```json
{
  "slides": [
    {
      "id": 1,
      "image": "/hero/slide1.jpg",
      "title": "专业定制",
      "description": "为您提供专业的服装定制服务"
    }
  ]
}
```

### 7. 测试接口

**接口：** `GET /api/hello`

**响应示例：**
```
你好，来自 mock API 的文本
```

## 管理后台 API (端口 3001)

### 1. 获取预约列表（管理后台版本）

**接口：** `GET /api/appointments`

**查询参数：**
- `isProcessed` (boolean, 可选) - 是否处理
- `page` (number, 可选) - 页码，默认 1
- `limit` (number, 可选) - 每页数量，默认 20
- `startDate` (string, 可选) - 开始日期
- `endDate` (string, 可选) - 结束日期

**响应示例：**
```json
{
  "success": true,
  "data": [...],
  "stats": {
    "total": 10,
    "processed": 3,
    "pending": 7
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10
  }
}
```

### 2. 获取预约统计

**接口：** `GET /api/appointments/stats`

**响应示例：**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "processed": 3,
    "pending": 7
  }
}
```

### 3. 获取单个预约详情

**接口：** `GET /api/appointments/[id]`

**路径参数：**
- `id` (number) - 预约ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentTime": "2024-01-15T10:00:00.000Z",
    "name": "张三",
    "phone": "13800138001",
    "email": "zhangsan@example.com",
    "notes": "首次预约，需要量体",
    "isProcessed": false,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  }
}
```

### 4. 更新预约

**接口：** `PUT /api/appointments/[id]`

**路径参数：**
- `id` (number) - 预约ID

**请求体：**
```json
{
  "appointmentTime": "2024-01-16T14:00:00Z",
  "name": "更新后的姓名",
  "phone": "13900139000",
  "email": "updated@example.com",
  "notes": "更新后的备注",
  "isProcessed": true
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "appointmentTime": "2024-01-16T14:00:00.000Z",
    "name": "更新后的姓名",
    "phone": "13900139000",
    "email": "updated@example.com",
    "notes": "更新后的备注",
    "isProcessed": true,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-16T14:00:00.000Z"
  },
  "message": "预约更新成功"
}
```

### 5. 快速标记为已处理

**接口：** `PATCH /api/appointments/[id]`

**路径参数：**
- `id` (number) - 预约ID

**请求体：**
```json
{
  "action": "mark-processed"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isProcessed": true,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "预约已标记为处理完成"
}
```

### 6. 删除预约

**接口：** `DELETE /api/appointments/[id]`

**路径参数：**
- `id` (number) - 预约ID

**响应示例：**
```json
{
  "success": true,
  "message": "预约删除成功"
}
```

## 错误响应

### 400 Bad Request
```json
{
  "success": false,
  "message": "预约时间、姓名、手机号和邮箱为必填项"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "预约不存在"
}
```

### 405 Method Not Allowed
```json
{
  "success": false,
  "message": "方法 POST 不被允许"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "服务器内部错误"
}
```

## 使用示例

### JavaScript/TypeScript

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

// 更新预约
const updatedAppointment = await fetch('/api/appointments/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    isProcessed: true
  })
})
```

### cURL

```bash
# 获取预约列表
curl http://localhost:3000/api/appointments

# 创建预约
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentTime": "2024-01-20T10:00:00Z",
    "name": "测试用户",
    "phone": "13800138000",
    "email": "test@example.com",
    "notes": "测试预约"
  }'

# 获取统计信息
curl http://localhost:3001/api/appointments/stats
```

## 测试

使用提供的 `test/api-test.http` 文件进行 API 测试：

1. 安装 REST Client 扩展（VS Code）
2. 启动开发服务器：
   ```bash
   npm run dev:web    # 前端 (端口 3000)
   npm run dev:admin  # 管理后台 (端口 3001)
   ```
3. 打开 `test/api-test.http` 文件
4. 点击请求上方的 "Send Request" 按钮

## 注意事项

1. 所有时间格式使用 ISO 8601 标准
2. 分页从 1 开始，不是 0
3. 管理后台 API 提供更多管理功能
4. 所有 API 都需要正确的 Content-Type 头
5. 错误响应包含详细的错误信息
