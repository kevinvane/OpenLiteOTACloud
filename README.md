# OTA Cloud 部署指南

## 开发环境

### 后端

```bash
cd backend
npm install
npm run dev    # 开发模式运行
```

### 前端

```bash
cd frontend
npm install
npm run dev    # 开发模式运行
```

## 生产部署

### 1. 编译后端

```bash
cd backend
npm run build
```

编译产物输出到 `backend/dist/` 目录。

### 2. 启动后端服务

```bash
cd backend
npm start
```

或使用 PM2 守护进程：

```bash
pm2 start backend/ecosystem.config.js
```

### 3. 编译前端

```bash
cd frontend
npm run build
```

编译产物输出到 `frontend/dist/` 目录，可使用 `npm run preview` 预览。

### 4. 配置 Nginx (可选)

将前端静态文件部署到 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

## 数据库更新

当 `init.sql` 有新增表或字段时，需要手动在生产数据库执行：

```bash
mysql -u root -p ota_cloud < backend/src/db/init.sql
```

或仅执行新增的 SQL 语句。

## 常用命令

| 操作 | 命令 |
|------|------|
| 后端开发 | `cd backend && npm run dev` |
| 后端构建 | `cd backend && npm run build` |
| 后端启动 | `cd backend && npm start` |
| 前端开发 | `cd frontend && npm run dev` |
| 前端构建 | `cd frontend && npm run build` |
| 前端预览 | `cd frontend && npm run preview` |
