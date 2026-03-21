import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import appConfig from './config';
import { initDatabase } from './db';
import { authMiddleware } from './middleware/auth';
import otaRouter from './routes/ota';
import authRouter from './routes/auth';
import modelRouter from './routes/model';
import firmwareRouter from './routes/firmware';
import dashboardRouter from './routes/dashboard';

const app = express();

app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase().then(() => {
  console.log('Database initialized successfully');
}).catch((err) => {
  console.error('Database initialization failed:', err.message);
});

// 重置管理员密码API（临时）
app.post('/api/reset-admin', authMiddleware, async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync(appConfig.defaultPassword, 10);
    const connection = await mysql.createConnection({
      host: appConfig.database.host,
      port: appConfig.database.port,
      user: appConfig.database.user,
      password: appConfig.database.password,
    });
    await connection.execute(`UPDATE ota_cloud.admin SET password = ? WHERE username = 'admin'`, [hash]);
    await connection.end();
    res.json({ code: 0, message: '密码已重置' });
  } catch (err: any) {
    res.json({ code: 5001, message: err.message });
  }
});

// 路由
app.use('/api/ota', otaRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin/models', modelRouter);
app.use('/api/admin/firmwares', firmwareRouter);
app.use('/api/admin/dashboard', dashboardRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = appConfig.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
