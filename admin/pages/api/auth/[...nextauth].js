import NextAuth from 'next-auth'
import { authOptions } from '../../../lib/auth-loader'

// 确保环境变量被设置
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db"
  console.log('设置 DATABASE_URL 环境变量:', process.env.DATABASE_URL)
}

// 确保 NextAuth URL 被设置
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "http://localhost:3001"
  console.log('设置 NEXTAUTH_URL 环境变量:', process.env.NEXTAUTH_URL)
}

// 确保 NextAuth Secret 被设置
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "your-secret-key-change-this-in-production"
  console.log('设置 NEXTAUTH_SECRET 环境变量')
}

export default NextAuth(authOptions)