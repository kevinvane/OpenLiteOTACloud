#!/bin/bash

# OTA Cloud 更新部署脚本

set -e

echo "========== 开始更新部署 =========="

# 拉取最新代码
echo "[1/6] 拉取最新代码..."
git pull

# 安装后端依赖并编译
echo "[2/6] 安装后端依赖..."
cd backend
npm install

echo "[3/6] 编译后端..."
npm run build
cd ..

# 安装前端依赖并编译
echo "[4/6] 安装前端依赖..."
cd frontend
npm install

echo "[5/6] 编译前端..."
npm run build
cd ..

# 重启 PM2 服务
echo "[6/6] 重启 PM2 服务..."
pm2 restart backend/ecosystem.config.js || pm2 start backend/ecosystem.config.js

echo "========== 更新完成 =========="
echo "后端 API: http://localhost:3000"
