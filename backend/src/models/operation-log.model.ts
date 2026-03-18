import { Database } from '../db/database';

export class OperationLogModel {

  async create(adminId: number, action: string, targetType: string, targetId: number, detail: object, ip: string): Promise<void> {
    await Database.execute(
      'INSERT INTO operation_log (admin_id, action, target_type, target_id, detail, ip) VALUES (?, ?, ?, ?, ?, ?)',
      [adminId, action, targetType, targetId, JSON.stringify(detail), ip]
    );
  }
}

export const operationLogModel = new OperationLogModel();
