# 预约时间范围查询功能

## 功能概述

预约列表API现在支持按时间范围查询预约记录，可以查询指定时间段内的所有预约。

## API 接口

### 获取预约列表（支持时间范围查询）

**请求方式：** `GET /api/appointments`

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| `startDate` | string | 否 | 开始日期（YYYY-MM-DD格式） | `2025-09-01` |
| `endDate` | string | 否 | 结束日期（YYYY-MM-DD格式） | `2025-10-01` |
| `isProcessed` | boolean | 否 | 是否已处理 | `true` / `false` |
| `page` | number | 否 | 页码（默认1） | `1` |
| `limit` | number | 否 | 每页数量（默认10） | `10` |

## 使用示例

### 1. 查询2025年9月1日到10月1日的预约

```http
GET /api/appointments?startDate=2025-09-01&endDate=2025-10-01
```

### 2. 查询2025年9月1日之后的所有预约

```http
GET /api/appointments?startDate=2025-09-01
```

### 3. 查询2025年10月1日之前的所有预约

```http
GET /api/appointments?endDate=2025-10-01
```

### 4. 组合查询：时间范围 + 处理状态 + 分页

```http
GET /api/appointments?startDate=2025-09-01&endDate=2025-10-01&isProcessed=false&page=1&limit=10
```

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "appointmentTime": "2025-09-15T14:00:00.000Z",
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "notes": "预约备注",
      "isProcessed": false,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  ]
}
```

### 错误响应

#### 日期格式错误

```json
{
  "success": false,
  "message": "开始日期格式不正确，请使用 YYYY-MM-DD 格式"
}
```

#### 日期范围错误

```json
{
  "success": false,
  "message": "开始日期不能晚于结束日期"
}
```

## 注意事项

1. **日期格式**：必须使用 `YYYY-MM-DD` 格式，例如 `2025-09-01`
2. **时区处理**：查询时会自动处理时区转换
3. **日期范围**：开始日期不能晚于结束日期
4. **可选参数**：`startDate` 和 `endDate` 都是可选的，可以单独使用
5. **兼容性**：新功能完全向后兼容，不影响现有的查询方式

## 测试用例

可以使用 `test/api-test.http` 文件中的测试用例来验证功能：

- 测试用例 4.1-4.4：正常的时间范围查询
- 测试用例 25-26：错误处理测试
- 测试用例 27：管理后台时间范围查询

## 数据库查询优化

查询使用了 Prisma 的 `gte`（大于等于）和 `lte`（小于等于）操作符，确保高效的数据库查询性能。
