import { PrismaClient } from '@prisma/client'

// 使用 JSDoc 类型注释而不是 TypeScript 类型断言
/** @type {PrismaClient | undefined} */
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
