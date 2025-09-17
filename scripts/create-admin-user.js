const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 确保环境变量被设置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
  console.log('设置 DATABASE_URL 环境变量:', process.env.DATABASE_URL);
}

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // 检查是否已存在管理员用户
    const existingAdmin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: 'admin' },
          { email: 'admin@tailorshop.com' }
        ]
      }
    });

    if (existingAdmin) {
      console.log('管理员用户已存在:', existingAdmin.username);
      return;
    }

    // 创建密码哈希
    const passwordHash = await bcrypt.hash('admin123', 12);

    // 创建管理员用户
    const adminUser = await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: 'admin@tailorshop.com',
        passwordHash: passwordHash,
        isActive: true,
        role: 'admin'
      }
    });

    console.log('✅ 管理员用户创建成功!');
    console.log('用户名: admin');
    console.log('密码: admin123');
    console.log('邮箱: admin@tailorshop.com');
    console.log('⚠️  请在生产环境中修改默认密码!');

  } catch (error) {
    console.error('❌ 创建管理员用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
