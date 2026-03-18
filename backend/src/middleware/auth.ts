import { Request, Response, NextFunction } from 'express';
import { adminModel } from '../models/admin.model';

export interface AuthRequest extends Request {
  adminId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未授权访问',
    });
  }
  
  const token = authHeader.substring(7);
  const payload = adminModel.verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({
      code: 401,
      message: 'token无效或已过期',
    });
  }
  
  req.adminId = payload.adminId;
  next();
}
