// 根据环境变量选择认证配置
const isProduction = process.env.NODE_ENV === 'production'
const useProductionConfig = process.env.USE_PRODUCTION_AUTH === 'true'

// 选择配置文件
const configFile = (isProduction || useProductionConfig) ? 'auth-production' : 'auth'

console.log(`🔐 使用认证配置: ${configFile} (NODE_ENV: ${process.env.NODE_ENV}, USE_PRODUCTION_AUTH: ${process.env.USE_PRODUCTION_AUTH})`)

// 动态导入配置
let authOptions
try {
  if (isProduction || useProductionConfig) {
    // 生产环境配置
    authOptions = {
      providers: [
        {
          id: 'credentials',
          name: 'credentials',
          type: 'credentials',
          credentials: {
            username: { label: '用户名', type: 'text' },
            password: { label: '密码', type: 'password' }
          },
          async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) {
              return null
            }

            try {
              const { PrismaClient } = await import('@prisma/client')
              const bcrypt = await import('bcryptjs')
              const prisma = new PrismaClient()

              const admin = await prisma.adminUser.findUnique({
                where: { username: credentials.username }
              })

              if (!admin || !admin.isActive) {
                return null
              }

              if (admin.lockedUntil && admin.lockedUntil > new Date()) {
                return null
              }

              const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash)
              
              if (!isValidPassword) {
                await prisma.adminUser.update({
                  where: { id: admin.id },
                  data: {
                    loginAttempts: admin.loginAttempts + 1,
                    lockedUntil: admin.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null
                  }
                })
                return null
              }

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
        }
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
        maxAge: 24 * 60 * 60,
      },
      jwt: {
        maxAge: 24 * 60 * 60,
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: false,
      useSecureCookies: true,
      trustHost: true,
      basePath: '/api/auth',
      logger: {
        error(code, metadata) {
          console.error('NextAuth Error:', code, metadata)
        },
        warn(code) {
          console.warn('NextAuth Warning:', code)
        },
        debug() {
          // 生产环境不输出调试信息
        }
      }
    }
  } else {
    // 开发环境配置
    authOptions = {
      providers: [
        {
          id: 'credentials',
          name: 'credentials',
          type: 'credentials',
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
              const { PrismaClient } = await import('@prisma/client')
              const bcrypt = await import('bcryptjs')
              const prisma = new PrismaClient()

              const admin = await prisma.adminUser.findUnique({
                where: { username: credentials.username }
              })

              if (!admin || !admin.isActive) {
                console.log('登录失败: 用户不存在或账户未激活')
                return null
              }

              if (admin.lockedUntil && admin.lockedUntil > new Date()) {
                const lockTime = Math.ceil((admin.lockedUntil - new Date()) / (1000 * 60))
                console.log(`登录失败: 账户已被锁定，请 ${lockTime} 分钟后重试`)
                return null
              }

              const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash)
              
              if (!isValidPassword) {
                await prisma.adminUser.update({
                  where: { id: admin.id },
                  data: {
                    loginAttempts: admin.loginAttempts + 1,
                    lockedUntil: admin.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null
                  }
                })
                console.log('登录失败: 密码错误')
                return null
              }

              await prisma.adminUser.update({
                where: { id: admin.id },
                data: {
                  loginAttempts: 0,
                  lockedUntil: null,
                  lastLoginAt: new Date()
                }
              })

              console.log('登录成功:', admin.username)
              
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
        }
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
        maxAge: 24 * 60 * 60,
      },
      jwt: {
        maxAge: 24 * 60 * 60,
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: true,
      useSecureCookies: false,
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
    }
  }
} catch (error) {
  console.error('加载认证配置失败:', error)
  throw error
}

export { authOptions }
export default authOptions
