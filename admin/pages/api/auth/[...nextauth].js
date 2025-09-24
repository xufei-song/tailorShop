import NextAuth from 'next-auth'
import { authOptions } from '../../../lib/auth-loader'


console.log('DATABASE_URL 环境变量:', process.env.DATABASE_URL)
console.log('NEXTAUTH_URL 环境变量:', process.env.NEXTAUTH_URL)
console.log('NEXTAUTH_SECRET 环境变量:', process.env.NEXTAUTH_SECRET)

export default NextAuth(authOptions)