import { deviceModelModel, DeviceModel } from '../models/device.model';

export class ModelController {

  async getModels(page: number = 1, pageSize: number = 10, status?: number) {
    return deviceModelModel.findAll(page, pageSize, status);
  }

  async getModelById(id: number): Promise<DeviceModel | null> {
    return deviceModelModel.findById(id);
  }

  async createModel(name: string, description?: string): Promise<number> {
    return deviceModelModel.create(name, description);
  }

  async updateModel(id: number, name: string, description?: string, status?: number): Promise<void> {
    return deviceModelModel.update(id, name, description, status);
  }

  async deleteModel(id: number): Promise<boolean> {
    return deviceModelModel.delete(id);
  }
}

export const modelController = new ModelController();
