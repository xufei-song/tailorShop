/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 关闭生产环境 Source Map（大幅减少 .next 体积）
  productionBrowserSourceMaps: false,
  // 支持混合 JS/TS 项目
  experimental: {
    typedRoutes: false,
  },
}

module.exports = nextConfig


