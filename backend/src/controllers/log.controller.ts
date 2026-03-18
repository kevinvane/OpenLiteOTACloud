import { operationLogModel } from '../models/operation-log.model';

export class LogController {

  async addOperationLog(adminId: number, action: string, targetType: string, targetId: number, detail: object, ip: string) {
    await operationLogModel.create(adminId, action, targetType, targetId, detail, ip);
  }
}

export const logController = new LogController();
