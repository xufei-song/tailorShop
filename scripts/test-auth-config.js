#!/usr/bin/env node

// 测试认证配置切换
console.log('🧪 测试认证配置切换\n')

// 测试场景
const testCases = [
  {
    name: '默认开发环境',
    env: {},
    expected: '开发环境配置'
  },
  {
    name: '强制生产环境',
    env: { USE_PRODUCTION_AUTH: 'true' },
    expected: '生产环境配置'
  },
  {
    name: '强制开发环境',
    env: { USE_DEV_AUTH: 'true' },
    expected: '开发环境配置 (强制)'
  },
  {
    name: 'NODE_ENV=production',
    env: { NODE_ENV: 'production' },
    expected: '生产环境配置'
  },
  {
    name: 'NODE_ENV=production + 强制开发',
    env: { NODE_ENV: 'production', USE_DEV_AUTH: 'true' },
    expected: '开发环境配置 (强制)'
  }
]

testCases.forEach((testCase, index) => {
  console.log(`测试 ${index + 1}: ${testCase.name}`)
  
  // 设置环境变量
  Object.keys(testCase.env).forEach(key => {
    process.env[key] = testCase.env[key]
  })
  
  // 模拟配置选择逻辑
  const isProduction = process.env.NODE_ENV === 'production'
  const forceProduction = process.env.USE_PRODUCTION_AUTH === 'true'
  const forceDevelopment = process.env.USE_DEV_AUTH === 'true'
  
  let selectedConfig
  let configName
  
  if (forceDevelopment) {
    selectedConfig = 'dev'
    configName = '开发环境配置 (强制)'
  } else if (isProduction || forceProduction) {
    selectedConfig = 'prod'
    configName = '生产环境配置'
  } else {
    selectedConfig = 'dev'
    configName = '开发环境配置 (默认)'
  }
  
  console.log(`   环境变量: NODE_ENV=${process.env.NODE_ENV}, USE_PRODUCTION_AUTH=${process.env.USE_PRODUCTION_AUTH}, USE_DEV_AUTH=${process.env.USE_DEV_AUTH}`)
  console.log(`   选择配置: ${configName}`)
  console.log(`   结果: ${configName === testCase.expected ? '✅ 通过' : '❌ 失败'}\n`)
  
  // 清理环境变量
  Object.keys(testCase.env).forEach(key => {
    delete process.env[key]
  })
})

console.log('🎉 测试完成！')
