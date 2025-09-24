# TailorShop 日志系统设置指南

## 概述

本指南将详细介绍如何配置和使用TailorShop项目中的日志系统，实现将代码中所有的日志打印重定向到文件中。

## 功能特点

- 支持多种日志级别：debug、info、warn、error
- 自动将日志输出到控制台和文件
- 格式化的日志输出，包含时间戳、日志级别和元数据
- 可通过环境变量灵活配置
- 支持替换全局console对象，实现无侵入式日志重定向

## 配置环境变量

首先，确保在`.env`或`.env.production`文件中配置以下环境变量：

```env
# 日志级别：debug, info, warn, error
LOG_LEVEL="info"
# 日志文件路径（相对或绝对路径）
LOG_FILE="logs/app.log"
```

- `LOG_LEVEL`：控制日志输出的最低级别，设置为`info`时，只会输出`info`、`warn`和`error`级别的日志
- `LOG_FILE`：指定日志文件的存储路径，默认为`logs/app.log`

## 日志系统结构

我们已经在`admin/lib`目录下创建了`logger.js`文件，实现了完整的日志处理功能：

- **Logger类**：核心日志处理类，提供debug、info、warn、error等方法
- **formatMessage函数**：格式化日志消息，添加时间戳和日志级别
- **writeToFile函数**：将日志写入指定的文件
- **shouldLog函数**：根据当前配置的日志级别决定是否输出日志

## 集成到代码中

### 方法一：直接使用logger模块

这是推荐的方法，适用于新代码或可重构的代码：

1. 在文件顶部导入logger模块：
   ```javascript
   const { logger } = require('../../lib/logger');
   ```

2. 替换现有的console.log语句：
   ```javascript
   // 原始代码
   console.log('处理GET请求');
   console.error('发生错误', error);
   
   // 替换为
   logger.info('处理GET请求');
   logger.error('发生错误', error);
   ```

### 方法二：替换全局console对象

这是一种无侵入式的方法，适用于不想大规模修改代码的情况：

1. 在应用入口文件中添加以下代码：
   ```javascript
   const { logger } = require('../../lib/logger');
   
   // 替换全局console对象
   const originalConsole = logger.replaceConsole();
   
   // 如果需要恢复原始console
   // logger.restoreConsole(originalConsole);
   ```

   对于Next.js应用，可以在`_app.js`文件中添加这段代码。

## 示例：替换API路由中的日志

以`admin/pages/api/appointments/index.js`文件为例，下面是具体的替换步骤：

1. 在文件顶部添加导入：
   ```javascript
   const { logger } = require('../../lib/logger');
   ```

2. 替换调试日志：
   ```javascript
   // 原始代码
   console.log('=== 管理后台 API 请求调试信息 ===')
   console.log('请求方法:', method)
   console.log('请求 URL:', req.url)
   console.log('查询参数:', req.query)
   // ...
   
   // 替换为
   logger.info('管理后台 API 请求', {
     method,
     url: req.url,
     query: req.query,
     headers: req.headers
   });
   ```

3. 替换操作日志：
   ```javascript
   // 原始代码
   console.log('处理 GET 请求 - 获取预约列表')
   
   // 替换为
   logger.info('处理 GET 请求 - 获取预约列表', { query: req.query });
   ```

4. 替换参数解析日志：
   ```javascript
   // 原始代码
   console.log('查询参数解析:', { isProcessed, status, page, limit, skip, startDate, endDate })
   
   // 替换为
   logger.debug('查询参数解析', { isProcessed, status, page, limit, skip, startDate, endDate });
   ```

5. 替换错误日志：
   ```javascript
   // 原始代码
   console.error('=== 管理后台 API 错误详情 ===')
   console.error('错误类型:', error.constructor.name)
   console.error('错误消息:', error.message)
   console.error('错误堆栈:', error.stack)
   
   // 替换为
   logger.error('管理后台 API 错误', error);
   ```

## 日志文件管理

1. 日志文件默认存储在`logs`目录下，文件名为`app.log`
2. 系统会自动创建日志目录（如果不存在）
3. 日志会以追加方式写入文件，不会覆盖之前的日志
4. 建议定期归档和清理日志文件，以避免文件过大

## 生产环境优化

在生产环境中，建议：

1. 设置`LOG_LEVEL`为`info`或`warn`，减少日志量
2. 不要使用`replaceGlobalConsole`方法，而是显式使用`logger`模块
3. 定期备份日志文件
4. 考虑使用日志轮转工具（如logrotate）管理日志文件

## 查看和分析日志

1. 直接查看日志文件：
   ```bash
   # Linux/macOS
   cat logs/app.log
   tail -f logs/app.log
   
   # Windows PowerShell
   Get-Content logs/app.log -Tail 100
   ```

2. 使用简单的日志分析工具：
   ```bash
   # 统计错误日志数量
   grep -c "\[ERROR\]" logs/app.log
   
   # 查找特定时间范围内的日志
   grep "2024-09-23" logs/app.log
   ```

## 日志格式说明

生成的日志格式如下：

```
[2024-09-23T10:15:30.123Z] [INFO] 日志消息 - {"元数据键":"元数据值"}
```

- `2024-09-23T10:15:30.123Z`：ISO格式的时间戳
- `INFO`：日志级别
- `日志消息`：实际的日志文本
- `{"元数据键":"元数据值"}`：可选的JSON格式元数据

## 完整示例代码

我们已经在`admin/lib/logger-example.js`文件中提供了完整的使用示例，包括：

- 基础日志记录
- 错误日志记录
- API路由中的使用
- 替换全局console对象
- 为appointment API提供的具体替换示例

请参考该文件了解更多详细的使用方法。

## 注意事项

1. 不要在日志中包含敏感信息（如密码、API密钥等）
2. 避免在高频率调用的代码中使用过多的debug日志，以免影响性能
3. 确保日志文件的存储路径有足够的磁盘空间
4. 在开发环境中，可以设置`LOG_LEVEL=debug`以获取更详细的日志信息

## 常见问题

**Q: 日志文件没有生成怎么办？**
A: 检查以下几点：
- 确保`LOG_FILE`环境变量已正确设置
- 确保应用有创建和写入日志文件的权限
- 查看控制台是否有关于日志文件的错误信息

**Q: 如何调整日志级别？**
A: 修改`LOG_LEVEL`环境变量的值，可选值为`debug`、`info`、`warn`和`error`

**Q: 可以同时输出到多个日志文件吗？**
A: 目前的实现只支持输出到单个日志文件，如果需要更复杂的日志处理，可以扩展`logger.js`文件

## 总结

通过配置环境变量和使用我们提供的logger模块，您可以轻松实现将代码中所有的日志打印重定向到文件中。这种方式不仅可以帮助您更好地监控应用运行状态，还可以为问题排查提供有力的支持。

如果您在使用过程中遇到任何问题，请参考示例代码或联系开发团队获取帮助。