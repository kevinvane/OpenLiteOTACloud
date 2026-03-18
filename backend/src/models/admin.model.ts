import { Database } from '../db/database';
import { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import appConfig from '../config';

export interface Admin extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export class AdminModel {

  async findByUsername(username: string): Promise<Admin | null> {
    const rows = await Database.query<Admin[]>('SELECT * FROM admin WHERE username = ?', [username]);
    return rows[0] || null;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
  }

  async updatePassword(id: number, password: string): Promise<void> {
    const hash = bcrypt.hashSync(password, 10);
    await Database.execute('UPDATE admin SET password = ? WHERE id = ?', [hash, id]);
  }

  verifyToken(token: string): { adminId: number } | null {
    try {
      return jwt.verify(token, appConfig.jwt.secret) as { adminId: number };
    } catch {
      return null;
    }
  }
}

export const adminModel = new AdminModel();
