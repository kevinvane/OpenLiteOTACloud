import { Database } from '../db/database';
import { RowDataPacket } from 'mysql2/promise';
import { compareVersions } from '../utils/version';

export interface Firmware extends RowDataPacket {
  id: number;
  model_id: number;
  version: string;
  description: string;
  file_path: string;
  file_size: number;
  file_md5: string;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: number;
}

export interface FirmwareWithModel extends Firmware {
  model_name: string;
  model_status: number;
}

export class FirmwareModel {

  async findLatestByModel(modelName: string): Promise<Firmware | null> {
    const sql = `
      SELECT f.*, m.name as model_name 
      FROM firmware f 
      JOIN device_model m ON f.model_id = m.id 
      WHERE m.name = ? AND m.status = 1 AND f.is_deleted = 0
      ORDER BY f.version DESC 
      LIMIT 1
    `;
    const rows = await Database.query<Firmware[]>(sql, [modelName]);
    return rows[0] || null;
  }

  async findByModelAndVersion(modelName: string, currentVersion: string): Promise<Firmware | null> {
    const latest = await this.findLatestByModel(modelName);
    if (!latest || compareVersions(latest.version, currentVersion) <= 0) return null;
    return latest;
  }

  async findAll(page: number = 1, pageSize: number = 10, modelId?: number): Promise<{ list: FirmwareWithModel[]; total: number }> {
    let sql = `
      SELECT f.*, m.name as model_name, m.status as model_status 
      FROM firmware f 
      JOIN device_model m ON f.model_id = m.id 
      WHERE f.is_deleted = 0
    `;
    const params: any[] = [];
    
    if (modelId) {
      sql += ' AND f.model_id = ?';
      params.push(modelId);
    }
    
    const countResult = await Database.query<{ count: number }[]>(
      sql.replace('SELECT f.*, m.name as model_name, m.status as model_status', 'SELECT COUNT(*) as count'),
      params
    );
    const total = countResult[0]?.count || 0;
    
    sql += ` ORDER BY f.created_at DESC LIMIT ${parseInt(String(pageSize), 10)} OFFSET ${parseInt(String((page - 1) * pageSize), 10)}`;
    const list = await Database.query<FirmwareWithModel[]>(sql, params);
    
    return { list, total };
  }

  async findById(id: number): Promise<FirmwareWithModel | null> {
    const sql = `
      SELECT f.*, m.name as model_name, m.status as model_status 
      FROM firmware f 
      JOIN device_model m ON f.model_id = m.id 
      WHERE f.id = ? AND f.is_deleted = 0
    `;
    const rows = await Database.query<FirmwareWithModel[]>(sql, [id]);
    return rows[0] || null;
  }

  async create(modelId: number, version: string, description: string, filePath: string, fileSize: number, fileMd5: string): Promise<number> {
    const result = await Database.execute(
      'INSERT INTO firmware (model_id, version, description, file_path, file_size, file_md5) VALUES (?, ?, ?, ?, ?, ?)',
      [modelId, version, description, filePath, fileSize, fileMd5]
    );
    return result.insertId;
  }

  async delete(id: number): Promise<void> {
    await Database.execute('UPDATE firmware SET is_deleted = 1 WHERE id = ?', [id]);
  }

  async update(id: number, version: string, description: string): Promise<void> {
    await Database.execute(
      'UPDATE firmware SET version = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [version, description, id]
    );
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await Database.execute('UPDATE firmware SET download_count = download_count + 1 WHERE id = ?', [id]);
  }
}

export const firmwareModel = new FirmwareModel();
