const fs = require('fs');
const path = require('path');

/**
 * 日志级别枚举
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

/**
 * 从环境变量获取配置
 */
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';
const LOG_FILE = process.env.LOG_FILE || 'logs/app.log';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * 确保日志目录存在
 */
function ensureLogDirectory() {
  try {
    const logDir = path.dirname(LOG_FILE);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Failed to create log directory:', error.message);
    return false;
  }
}

/**
 * 格式化日志消息
 */
function formatMessage(level, message, metadata = null) {
  const timestamp = new Date().toISOString();
  let logMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (metadata) {
    if (typeof metadata === 'string') {
      logMessage += ` - ${metadata}`;
    } else {
      try {
        logMessage += ` - ${JSON.stringify(metadata)}`;
      } catch (e) {
        logMessage += ` - [无法序列化的元数据]`;
      }
    }
  }
  
  return logMessage;
}

/**
 * 写入日志到文件
 */
function writeToFile(message) {
  if (!ensureLogDirectory()) return;
  
  try {
    fs.appendFileSync(LOG_FILE, message + '\n', 'utf8');
  } catch (error) {
    console.error('Failed to write to log file:', error.message);
  }
}

/**
 * 检查是否应该记录此级别的日志
 */
function shouldLog(level) {
  const currentLevel = LOG_LEVELS[LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO;
  return level >= currentLevel;
}

/**
 * 日志记录器类
 */
class Logger {
  constructor() {
    this.logLevel = LOG_LEVELS[LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO;
  }

  /**
   * 调试日志
   */
  debug(message, metadata = null) {
    if (!shouldLog(LOG_LEVELS.DEBUG)) return;
    
    const formattedMessage = formatMessage('DEBUG', message, metadata);
    
    // 开发环境输出到控制台，生产环境可选
    if (!IS_PRODUCTION) {
      console.log(formattedMessage);
    }
    
    writeToFile(formattedMessage);
  }

  /**
   * 信息日志
   */
  info(message, metadata = null) {
    if (!shouldLog(LOG_LEVELS.INFO)) return;
    
    const formattedMessage = formatMessage('INFO', message, metadata);
    
    // 始终输出到控制台
    console.log(formattedMessage);
    
    writeToFile(formattedMessage);
  }

  /**
   * 警告日志
   */
  warn(message, metadata = null) {
    if (!shouldLog(LOG_LEVELS.WARN)) return;
    
    const formattedMessage = formatMessage('WARN', message, metadata);
    
    // 始终输出到控制台
    console.warn(formattedMessage);
    
    writeToFile(formattedMessage);
  }

  /**
   * 错误日志
   */
  error(message, error = null) {
    if (!shouldLog(LOG_LEVELS.ERROR)) return;
    
    let metadata = null;
    if (error instanceof Error) {
      metadata = {
        message: error.message,
        stack: error.stack,
        name: error.name
      };
    } else if (error) {
      metadata = error;
    }
    
    const formattedMessage = formatMessage('ERROR', message, metadata);
    
    // 始终输出到控制台
    console.error(formattedMessage);
    
    writeToFile(formattedMessage);
  }

  /**
   * 替换全局console方法（可选）
   */
  replaceConsole() {
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    };

    console.log = (...args) => {
      originalConsole.log(...args);
      if (args.length > 0) {
        const message = args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        writeToFile(formatMessage('INFO', message));
      }
    };

    console.info = console.log;

    console.warn = (...args) => {
      originalConsole.warn(...args);
      if (args.length > 0) {
        const message = args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        writeToFile(formatMessage('WARN', message));
      }
    };

    console.error = (...args) => {
      originalConsole.error(...args);
      if (args.length > 0) {
        const message = args.map(arg => {
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        writeToFile(formatMessage('ERROR', message));
      }
    };

    return originalConsole;
  }

  /**
   * 恢复原始console方法
   */
  restoreConsole(originalConsole) {
    if (originalConsole) {
      console.log = originalConsole.log;
      console.info = originalConsole.info;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    }
  }
}

// 创建单例实例
const logger = new Logger();

module.exports = {
  Logger,
  logger,
  LOG_LEVELS,
  formatMessage
};