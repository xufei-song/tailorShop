#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getKillCommand() {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return 'taskkill /f /im node.exe';
    case 'darwin':
    case 'linux':
      return 'pkill -f node';
    default:
      return 'pkill -f node';
  }
}

async function resetPrisma() {
  colorLog('🔄 开始重置 Prisma 客户端...', 'cyan');
  console.log();

  try {
    // 1. 可选：停止所有Node.js进程（避免文件占用）
    const args = process.argv.slice(2);
    const killProcesses = args.includes('--kill') || args.includes('-k');
    
    if (killProcesses) {
      colorLog('1️⃣ 停止所有Node.js进程...', 'yellow');
      try {
        const killCmd = getKillCommand();
        execSync(killCmd, { stdio: 'ignore' });
        colorLog('   ✅ Node.js进程已停止', 'green');
      } catch (error) {
        colorLog('   ℹ️  没有运行的Node.js进程', 'blue');
      }
      console.log();
    }

    // 2. 删除Prisma客户端目录
    colorLog(`${killProcesses ? '2' : '1'}️⃣ 清理Prisma客户端目录...`, 'yellow');
    const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma');
    
    if (fs.existsSync(prismaClientPath)) {
      fs.rmSync(prismaClientPath, { recursive: true, force: true });
      colorLog('   ✅ Prisma客户端目录已删除', 'green');
    } else {
      colorLog('   ℹ️  Prisma客户端目录不存在', 'blue');
    }

    // 3. 重新生成Prisma客户端
    console.log();
    colorLog(`${killProcesses ? '3' : '2'}️⃣ 重新生成Prisma客户端...`, 'yellow');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    colorLog('   ✅ Prisma客户端生成成功', 'green');

    // 4. 推送数据库结构（确保同步）
    console.log();
    colorLog(`${killProcesses ? '4' : '3'}️⃣ 同步数据库结构...`, 'yellow');
    execSync('npx prisma db push', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    colorLog('   ✅ 数据库结构同步成功', 'green');

    // 5. 验证Prisma客户端
    console.log();
    colorLog(`${killProcesses ? '5' : '4'}️⃣ 验证Prisma客户端...`, 'yellow');
    const { PrismaClient } = require('@prisma/client');
    
    // 确保环境变量被设置
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = "file:./dev.db";
    }
    
    const prisma = new PrismaClient();
    
    // 测试连接
    await prisma.$connect();
    colorLog('   ✅ 数据库连接成功', 'green');
    
    // 测试查询
    const appointments = await prisma.appointment.findMany({ take: 1 });
    colorLog('   ✅ Appointment表查询成功', 'green');
    
    const adminUsers = await prisma.adminUser.findMany({ take: 1 });
    colorLog('   ✅ AdminUser表查询成功', 'green');
    
    const adminSessions = await prisma.adminSession.findMany({ take: 1 });
    colorLog('   ✅ AdminSession表查询成功', 'green');
    
    await prisma.$disconnect();
    
    console.log();
    colorLog('🎉 Prisma客户端重置完成！', 'green');
    colorLog('📋 可用的表:', 'cyan');
    colorLog('   - appointments (预约表)', 'blue');
    colorLog('   - admin_users (管理员用户表)', 'blue');
    colorLog('   - admin_sessions (管理员会话表)', 'blue');
    colorLog('   - verification_codes (验证码表)', 'blue');
    
    console.log();
    colorLog('✨ 重置完成！现在可以正常使用Prisma客户端了。', 'green');
    
    // 显示使用说明
    if (!killProcesses) {
      console.log();
      colorLog('💡 提示:', 'cyan');
      colorLog('   如果遇到文件占用问题，可以运行:', 'blue');
      colorLog('   npm run reset-prisma -- --kill', 'yellow');
    }
    
  } catch (error) {
    console.log();
    colorLog('❌ 重置失败:', 'red');
    colorLog(error.message, 'red');
    
    if (error.message.includes('EPERM') || error.message.includes('permission')) {
      console.log();
      colorLog('💡 权限问题解决方案:', 'yellow');
      colorLog('   Windows: 以管理员身份运行PowerShell', 'blue');
      colorLog('   Linux/macOS: 使用 sudo 运行或检查文件权限', 'blue');
    }
    
    if (error.message.includes('EBUSY') || error.message.includes('busy')) {
      console.log();
      colorLog('💡 文件占用问题解决方案:', 'yellow');
      colorLog('   运行: npm run reset-prisma -- --kill', 'blue');
    }
    
    process.exit(1);
  }
}

// 运行重置函数
resetPrisma();
