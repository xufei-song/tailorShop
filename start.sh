#!/bin/sh
# 优化启动脚本，支持优雅退出

# 处理终止信号
cleanup() {
  echo "正在停止服务..."
  if [ -f "web.pid" ]; then
    kill $(cat web.pid) 2>/dev/null
    rm -f web.pid
  fi
  if [ -f "admin.pid" ]; then
    kill $(cat admin.pid) 2>/dev/null
    rm -f admin.pid
  fi
  echo "服务已停止"
  exit 0
}

trap cleanup SIGINT SIGTERM

# 确保日志目录存在
mkdir -p logs

# 启动前端服务（日志通过logger.js重定向）
npm run start:web &
echo $! > web.pid

echo "前端服务已启动 (PID: $(cat web.pid))"

# 启动管理端服务（日志通过logger.js重定向）
npm run start:admin &
echo $! > admin.pid

echo "管理端服务已启动 (PID: $(cat admin.pid))"

# 等待服务意外退出
wait -n

# 如果有服务退出，清理所有服务
cleanup
