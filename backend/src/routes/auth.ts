import { Router, Request, Response } from 'express';
import { authController } from '../controllers/auth.controller';
import { API_CODE } from '../models/types';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '请输入用户名和密码' });
    }
    
    const result = await authController.login(username, password);
    
    if (!result.success) {
      return res.json({ code: API_CODE.PARAM_ERROR, message: result.message });
    }
    
    res.json({
      code: API_CODE.SUCCESS,
      data: result.data,
      message: '登录成功',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

export default router;
