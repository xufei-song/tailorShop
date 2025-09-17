// 动态加载认证配置
import { authOptions as devAuthOptions } from './auth.js'
import { authOptions as prodAuthOptions } from './auth-production.js'

// 环境变量控制
const isProduction = process.env.NODE_ENV === 'production'
const forceProduction = process.env.USE_PRODUCTION_AUTH === 'true'
const forceDevelopment = process.env.USE_DEV_AUTH === 'true'

// 选择配置
let selectedConfig
let configName

if (forceDevelopment) {
  selectedConfig = devAuthOptions
  configName = '开发环境配置 (强制)'
} else if (isProduction || forceProduction) {
  selectedConfig = prodAuthOptions
  configName = '生产环境配置'
} else {
  selectedConfig = devAuthOptions
  configName = '开发环境配置 (默认)'
}

console.log(`🔐 认证配置加载: ${configName}`)
console.log(`   环境变量: NODE_ENV=${process.env.NODE_ENV}, USE_PRODUCTION_AUTH=${process.env.USE_PRODUCTION_AUTH}, USE_DEV_AUTH=${process.env.USE_DEV_AUTH}`)
console.log(`   Cookie 安全设置: ${selectedConfig.useSecureCookies ? '启用' : '禁用'}`)

export const authOptions = selectedConfig
export default selectedConfig
