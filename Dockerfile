# 构建阶段 - 使用小版本号确保稳定性
FROM node:18.19-alpine AS builder
WORKDIR /app

# 优化 Alpine 源并安装构建依赖（合并命令减少镜像层）
RUN echo "https://mirrors.huaweicloud.com/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://mirrors.huaweicloud.com/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

# 优先复制依赖配置文件
COPY package*.json ./

# 使用国内源安装依赖并清理缓存
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --no-progress && \
    npm cache clean --force

# 仅复制必要的项目文件（按重要性排序）
COPY prisma ./prisma
COPY tsconfig.json ./
COPY next.config.js ./
COPY .env.production ./.env

# 按应用模块复制文件
COPY admin ./admin
COPY shop ./shop
COPY lib ./lib
COPY scripts ./scripts
COPY start.sh ./start.sh

# 生成 Prisma 客户端、构建项目并清理不需要的开发依赖
RUN npx prisma generate && \
    npm run build:web && \
    npm run build:admin && \
    npm prune --production && \
    # 进一步清理可能的临时文件
    rm -rf /tmp/* \
           /root/.npm \
           /root/.node-gyp

# 生产阶段 - 使用更小的基础镜像
FROM node:18.19-alpine
WORKDIR /app

# 安装系统依赖（仅保留运行时必要的）
RUN echo "https://mirrors.huaweicloud.com/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://mirrors.huaweicloud.com/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache sqlite && \
    rm -rf /var/cache/apk/* \
           /tmp/* \
           /etc/apk

# 仅复制运行时必要的文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# 复制构建后的应用文件
COPY --from=builder /app/shop/.next ./shop/.next
COPY --from=builder /app/shop/public ./shop/public
COPY --from=builder /app/admin/.next ./admin/.next
COPY --from=builder /app/admin/public ./admin/public

# 复制数据库相关文件
COPY --from=builder /app/prisma ./prisma

# 复制环境配置和启动脚本
COPY --from=builder /app/.env ./
COPY --from=builder /app/start.sh ./start.sh

# 复制必要的脚本
COPY --from=builder /app/scripts ./scripts

# 赋予启动脚本权限
RUN chmod +x start.sh

# 暴露端口
EXPOSE 3000 3001

# 设置合理的环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 启动服务
CMD ["./start.sh"]
