import { firmwareModel, Firmware } from '../models/firmware.model';
import { deviceModelModel, DeviceModel } from '../models/device.model';

export class FirmwareController {

  async getLatestFirmware(modelName: string, currentVersion: string): Promise<Firmware | null> {
    return firmwareModel.findByModelAndVersion(modelName, currentVersion);
  }

  async getModelByName(name: string): Promise<DeviceModel | null> {
    return deviceModelModel.findByName(name);
  }

  async incrementDownloadCount(firmwareId: number): Promise<void> {
    await firmwareModel.incrementDownloadCount(firmwareId);
  }

  async getFirmwares(page: number = 1, pageSize: number = 10, modelId?: number) {
    return firmwareModel.findAll(page, pageSize, modelId);
  }

  async getFirmwareById(id: number) {
    return firmwareModel.findById(id);
  }

  async createFirmware(modelId: number, version: string, description: string, filePath: string, fileSize: number, fileMd5: string): Promise<number> {
    return firmwareModel.create(modelId, version, description, filePath, fileSize, fileMd5);
  }

  async deleteFirmware(id: number): Promise<void> {
    await firmwareModel.delete(id);
  }

  async getModelOptions() {
    return deviceModelModel.getOptions();
  }
}

export const firmwareController = new FirmwareController();
