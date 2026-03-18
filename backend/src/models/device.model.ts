import { Database } from '../db/database';
import { RowDataPacket } from 'mysql2/promise';

export interface DeviceModel extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export class DeviceModelModel {

  async findAll(page: number = 1, pageSize: number = 10, status?: number): Promise<{ list: DeviceModel[]; total: number }> {
    let sql = 'SELECT * FROM device_model WHERE 1=1';
    const params: any[] = [];
    
    if (status !== undefined) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    const countResult = await Database.query<{ count: number }[]>(sql.replace('SELECT *', 'SELECT COUNT(*) as count'), params);
    const total = countResult[0]?.count || 0;
    
    sql += ` ORDER BY created_at DESC LIMIT ${parseInt(String(pageSize), 10)} OFFSET ${parseInt(String((page - 1) * pageSize), 10)}`;
    const list = await Database.query<DeviceModel[]>(sql, params);
    
    return { list, total };
  }

  async findById(id: number): Promise<DeviceModel | null> {
    const rows = await Database.query<DeviceModel[]>('SELECT * FROM device_model WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async findByName(name: string): Promise<DeviceModel | null> {
    const rows = await Database.query<DeviceModel[]>('SELECT * FROM device_model WHERE name = ?', [name]);
    return rows[0] || null;
  }

  async create(name: string, description?: string): Promise<number> {
    const result = await Database.execute(
      'INSERT INTO device_model (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    return result.insertId;
  }

  async update(id: number, name: string, description?: string, status?: number): Promise<void> {
    let sql = 'UPDATE device_model SET name = ?, description = ?';
    const params: any[] = [name, description || null];
    
    if (status !== undefined) {
      sql += ', status = ?';
      params.push(status);
    }
    
    sql += ' WHERE id = ?';
    await Database.execute(sql, [...params, id]);
  }

  async delete(id: number): Promise<boolean> {
    const firmwares = await Database.query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM firmware WHERE model_id = ? AND is_deleted = 0',
      [id]
    );
    
    if (firmwares[0].count > 0) {
      return false;
    }
    
    await Database.execute('DELETE FROM device_model WHERE id = ?', [id]);
    return true;
  }

  async getOptions(): Promise<{ id: number; name: string }[]> {
    return Database.query('SELECT id, name FROM device_model WHERE status = 1 ORDER BY name');
  }
}

export const deviceModelModel = new DeviceModelModel();
