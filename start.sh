#!/bin/sh
# 后台启动前端（3000端口），前台启动管理端（保持容器存活）
npm run start:web &
npm run start:admin
