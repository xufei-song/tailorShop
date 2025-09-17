import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const admin = await prisma.adminUser.findUnique({
            where: { username: credentials.username }
          })

          if (!admin || !admin.isActive) {
            return null
          }

          // 检查账户锁定
          if (admin.lockedUntil && admin.lockedUntil > new Date()) {
            return null
          }

          const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash)
          
          if (!isValidPassword) {
            // 记录登录失败
            await prisma.adminUser.update({
              where: { id: admin.id },
              data: {
                loginAttempts: admin.loginAttempts + 1,
                lockedUntil: admin.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null
              }
            })
            return null
          }

          // 登录成功
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date()
            }
          })

          return {
            id: admin.id.toString(),
            username: admin.username,
            email: admin.email,
            role: admin.role
          }
        } catch (error) {
          console.error('认证错误:', error)
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
      if (url === baseUrl || url === `${baseUrl}/`) return `${baseUrl}/`
      if (url.startsWith("/")) return `${baseUrl}${url}`
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
  debug: false, // 生产环境关闭调试
  useSecureCookies: process.env.NODE_ENV === 'production', // 只在真正的生产环境使用安全 Cookie
  trustHost: true,
  basePath: '/api/auth',
  logger: {
    error(code, metadata) {
      // 生产环境日志记录
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code, metadata) {
      // 生产环境不输出调试信息
    }
  }
}

export default NextAuth(authOptions)
