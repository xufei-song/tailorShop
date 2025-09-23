#!/bin/sh
# 优化启动脚本，支持优雅退出

# 处理终止信号
cleanup() {
  echo "收到终止信号，正在优雅关闭服务..."
  kill -TERM $WEB_PID $ADMIN_PID 2>/dev/null
  wait $WEB_PID $ADMIN_PID 2>/dev/null
  echo "所有服务已关闭"
  exit 0
}

trap 'cleanup' SIGTERM SIGINT

# 启动前端服务
npm run start:web &
WEB_PID=$!

# 启动管理端服务（前台运行）
npm run start:admin &
ADMIN_PID=$!

# 等待任一进程退出
wait -n $WEB_PID $ADMIN_PID

# 如果任一进程意外退出，清理所有进程
exit_code=$?
echo "服务意外退出，退出码: $exit_code"
cleanup
