# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 更换为华为云源 + 更新索引 + 安装依赖
RUN echo "https://mirrors.huaweicloud.com/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://mirrors.huaweicloud.com/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

# npm 国内源安装依赖
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com && \
    npm install && \
    npm cache clean --force

# 复制项目文件
COPY .env.production ./.env
COPY prisma ./prisma
COPY tsconfig.json ./
COPY next.config.js ./
COPY admin ./admin
COPY shop ./shop
COPY scripts ./scripts
COPY lib ./lib
COPY start.sh ./start.sh

# 生成 Prisma 客户端 + 构建项目
RUN npx prisma generate && \
    npm run build:web && \
    npm run build:admin && \
    npm prune --production

# 生产阶段
FROM node:18-alpine
WORKDIR /app

# 安装系统级 sqlite3
RUN echo "https://mirrors.huaweicloud.com/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://mirrors.huaweicloud.com/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache sqlite && \
    rm -rf /var/cache/apk/*

# 复制运行时文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shop/.next ./shop/.next
COPY --from=builder /app/shop/public ./shop/public
COPY --from=builder /app/admin/.next ./admin/.next
COPY --from=builder /app/admin/public ./admin/public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./
COPY --from=builder /app/start.sh ./start.sh
COPY --from=builder /app/scripts ./scripts

# 赋予启动脚本权限
RUN chmod +x start.sh

# 暴露端口
EXPOSE 3000 3001

# 启动服务
CMD ["./start.sh"]
