#!/usr/bin/env node

// JWT 解密错误修复脚本
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔧 JWT 解密错误修复脚本\n');

// 1. 生成新的 NEXTAUTH_SECRET
const newSecret = crypto.randomBytes(32).toString('base64');
console.log('1. 生成新的 NEXTAUTH_SECRET:');
console.log(`   ${newSecret}\n`);

// 2. 更新 .env 文件
const envPath = path.join(__dirname, '..', '.env');
try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // 替换 NEXTAUTH_SECRET
  const secretRegex = /NEXTAUTH_SECRET="[^"]*"/;
  if (secretRegex.test(envContent)) {
    envContent = envContent.replace(secretRegex, `NEXTAUTH_SECRET="${newSecret}"`);
    console.log('2. 更新 .env 文件: ✅');
  } else {
    envContent += `\nNEXTAUTH_SECRET="${newSecret}"`;
    console.log('2. 添加 NEXTAUTH_SECRET 到 .env 文件: ✅');
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('   文件已更新\n');
} catch (error) {
  console.error('2. 更新 .env 文件失败:', error.message);
  console.log('   请手动更新 NEXTAUTH_SECRET\n');
}

// 3. 提供清除浏览器缓存的指导
console.log('3. 清除浏览器缓存:');
console.log('   - 按 F12 打开开发者工具');
console.log('   - 点击 Application 标签页');
console.log('   - 左侧找到 Storage → Clear storage');
console.log('   - 勾选所有选项，点击 Clear site data');
console.log('   - 按 Ctrl + Shift + R 硬刷新页面\n');

// 4. 提供重启服务器的指导
console.log('4. 重启服务器:');
console.log('   npm run dev:admin\n');

// 5. 验证步骤
console.log('5. 验证修复:');
console.log('   - 访问 http://localhost:3001/');
console.log('   - 应该自动跳转到登录页面');
console.log('   - 使用 admin/admin123 登录');
console.log('   - 应该成功进入管理后台\n');

console.log('🎉 修复完成！如果问题仍然存在，请检查：');
console.log('   - 浏览器是否完全清除了缓存');
console.log('   - 服务器是否已重启');
console.log('   - 环境变量是否正确加载');
