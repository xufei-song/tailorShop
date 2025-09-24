/**
 * Logger 模块使用示例
 * 此文件展示如何使用我们的自定义 logger 模块替换原生的 console.log
 */

// 导入 logger 模块
const { logger } = require('./logger');

/**
 * 示例 1: 基础日志记录
 */
function basicLoggingExample() {
  console.log('这是原生 console.log，不会重定向到文件');
  
  // 使用 logger 模块记录日志
  logger.debug('这是调试日志，只有在 LOG_LEVEL=debug 时才会显示');
  logger.info('这是信息日志，包含时间戳和日志级别');
  logger.warn('这是警告日志，会同时输出到控制台和文件');
  
  // 带元数据的日志
  logger.info('用户登录成功', {
    username: 'admin',
    role: 'admin',
    ip: '192.168.1.1'
  });
}

/**
 * 示例 2: 错误日志记录
 */
function errorLoggingExample() {
  try {
    throw new Error('测试错误');
  } catch (error) {
    console.error('这是原生 console.error');
    
    // 使用 logger 模块记录错误日志
    logger.error('操作失败', error);
  }
}

/**
 * 示例 3: 在 API 路由中使用
 * 此示例展示如何在 Next.js API 路由中使用 logger
 */
function apiRouteExample(req, res) {
  // 记录请求信息
  logger.info('API 请求', {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: req.headers
  });
  
  try {
    // 业务逻辑
    // ...
    
    // 记录操作结果
    logger.info('操作成功', {
      result: 'success',
      data: { /* 结果数据 */ }
    });
    
    res.status(200).json({
      success: true,
      message: '操作成功'
    });
  } catch (error) {
    // 记录错误信息
    logger.error('API 处理失败', error);
    
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
}

/**
 * 示例 4: 替换全局 console 对象
 * 注意：此方法会替换所有代码中的 console 方法，使用时请谨慎
 */
function replaceGlobalConsole() {
  const { logger } = require('./logger');
  
  // 保存原始 console 对象，以便稍后恢复
  const originalConsole = logger.replaceConsole();
  
  // 现在所有的 console.log/warn/error 都会自动重定向到文件
  console.log('这条日志会自动重定向到文件');
  console.warn('这条警告会自动重定向到文件');
  console.error('这条错误会自动重定向到文件');
  
  // 如果需要，可以恢复原始 console
  // logger.restoreConsole(originalConsole);
}

/**
 * 为 admin/pages/api/appointments/index.js 文件提供的替换示例
 * 下面是如何将该文件中的 console 日志替换为 logger 日志的具体示例
 */
function appointmentApiLoggerExample() {
  // 1. 在文件顶部添加导入
  // const { logger } = require('../../lib/logger');
  
  // 2. 替换调试日志
  // console.log('=== 管理后台 API 请求调试信息 ===')
  // console.log('请求方法:', method)
  // console.log('请求 URL:', req.url)
  // 替换为:
  logger.info('管理后台 API 请求', {
    method,
    url: req.url,
    query: req.query,
    headers: req.headers
  });
  
  // 3. 替换操作日志
  // console.log('处理 GET 请求 - 获取预约列表')
  // 替换为:
  logger.info('处理 GET 请求 - 获取预约列表', { query: req.query });
  
  // 4. 替换参数解析日志
  // console.log('查询参数解析:', { isProcessed, status, page, limit, skip, startDate, endDate })
  // 替换为:
  logger.debug('查询参数解析', { isProcessed, status, page, limit, skip, startDate, endDate });
  
  // 5. 替换错误日志
  // console.error('=== 管理后台 API 错误详情 ===')
  // console.error('错误类型:', error.constructor.name)
  // console.error('错误消息:', error.message)
  // console.error('错误堆栈:', error.stack)
  // 替换为:
  logger.error('管理后台 API 错误', error);
}

// 运行示例
// basicLoggingExample();
// errorLoggingExample();
// replaceGlobalConsole();

module.exports = {
  basicLoggingExample,
  errorLoggingExample,
  apiRouteExample,
  replaceGlobalConsole,
  appointmentApiLoggerExample
};