import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

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

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log('登录失败: 用户名和密码不能为空')
          return null
        }

        try {
          // 查找管理员用户
          const admin = await prisma.adminUser.findUnique({
            where: {
              username: credentials.username
            }
          })

          if (!admin) {
            console.log('登录失败: 用户不存在')
            return null
          }

          // 检查账户是否被锁定
          if (admin.lockedUntil && admin.lockedUntil > new Date()) {
            const lockTime = Math.ceil((admin.lockedUntil - new Date()) / (1000 * 60))
            console.log(`登录失败: 账户已被锁定，请 ${lockTime} 分钟后重试`)
            return null
          }

          // 检查账户是否激活
          if (!admin.isActive) {
            console.log('登录失败: 账户已被禁用')
            return null
          }

          // 验证密码
          const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash)
          
          if (!isValidPassword) {
            // 增加登录尝试次数
            const newAttempts = admin.loginAttempts + 1
            const lockUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null // 15分钟锁定
            
            await prisma.adminUser.update({
              where: { id: admin.id },
              data: {
                loginAttempts: newAttempts,
                lockedUntil: lockUntil
              }
            })

            console.log('登录失败: 密码错误')
            return null
          }

          // 登录成功，重置登录尝试次数
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date()
            }
          })

          console.log('登录成功:', admin.username)
          // 返回用户信息
          return {
            id: admin.id.toString(),
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        } catch (error) {
          console.error('登录错误:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.username = token.username
        session.user.role = token.role
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // 登录成功后默认跳转到根路径（管理后台首页）
      if (url === baseUrl || url === `${baseUrl}/`) return `${baseUrl}/`
      // 允许相对回调 URL
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // 允许同域名的回调 URL
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/`
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24小时
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24小时
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  trustHost: true,
  basePath: '/api/auth',
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata)
    }
  }
})