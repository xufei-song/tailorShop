# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 更换为华为云源 + 更新索引 + 安装依赖
RUN echo "https://mirrors.huaweicloud.com/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://mirrors.huaweicloud.com/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add python3 make g++ sqlite

# 复制 .env 和依赖配置
COPY .env.production ./.env
COPY package*.json ./

# npm 国内源安装依赖
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install

# 复制项目文件
COPY . .

# 生成 Prisma 客户端 + 构建项目
RUN npm run db:generate && \
    npm run build:web && \
    npm run build:admin


# 生产阶段
FROM node:18-alpine
WORKDIR /app

# 安装系统级 sqlite3
RUN echo "https://mirrors.huaweicloud.com/alpine/v3.21/main/" > /etc/apk/repositories && \
    echo "https://mirrors.huaweicloud.com/alpine/v3.21/community/" >> /etc/apk/repositories && \
    apk update && \
    apk add sqlite

# 复制运行时文件
COPY --from=builder /app/.env ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/shop ./shop
COPY --from=builder /app/admin ./admin
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/start.sh ./start.sh

# 赋予启动脚本权限
RUN chmod +x start.sh

# 暴露端口
EXPOSE 3000 3001

# 启动服务
CMD ["./start.sh"]
