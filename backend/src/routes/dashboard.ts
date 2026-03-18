import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { dashboardController } from '../controllers/dashboard.controller';
import { API_CODE } from '../models/types';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const stats = await dashboardController.getStats();
    res.json({
      code: API_CODE.SUCCESS,
      data: stats,
      message: 'success',
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

export default router;
