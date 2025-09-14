import { PrismaClient } from '@prisma/client'

/**
 * FIXME: 临时处理，需要优化
 */
// 确保环境变量被设置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
  console.log('设置 DATABASE_URL 环境变量:', process.env.DATABASE_URL)
}

// 使用 JSDoc 类型注释而不是 TypeScript 类型断言
/** @type {PrismaClient | undefined} */
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
