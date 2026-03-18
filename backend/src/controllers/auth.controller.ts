import jwt from 'jsonwebtoken';
import appConfig from '../config';
import { adminModel } from '../models/admin.model';

export class AuthController {

  async login(username: string, password: string) {
    const admin = await adminModel.findByUsername(username);
    
    if (!admin) {
      return { success: false, message: '用户名或密码错误' };
    }
    
    const valid = await adminModel.verifyPassword(password, admin.password);
    if (!valid) {
      return { success: false, message: '用户名或密码错误' };
    }
    
    const token = jwt.sign({ adminId: admin.id }, appConfig.jwt.secret, {
      expiresIn: appConfig.jwt.expiresIn as jwt.SignOptions['expiresIn'],
    });
    
    return { success: true, data: { token, username: admin.username } };
  }
}

export const authController = new AuthController();
