import { Router, Request, Response } from 'express';
import { firmwareController } from '../controllers/firmware.controller';
import { API_CODE } from '../models/types';
import appConfig from '../config';
import { validateVersion } from '../utils/version';
import { Database } from '../db/database';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/check', async (req: Request, res: Response) => {
  try {
    const { model, current_version } = req.query;
    
    if (!model || !current_version) {
      return res.json({
        code: API_CODE.PARAM_ERROR,
        data: null,
        message: '缺少必填参数 model 或 current_version',
      });
    }
    
    if (!validateVersion(current_version as string)) {
      return res.json({
        code: API_CODE.PARAM_ERROR,
        data: null,
        message: 'Version must be in x.x.x format (e.g., 1.0.0)',
      });
    }
    
    const modelInfo = await firmwareController.getModelByName(model as string);
    if (!modelInfo) {
      return res.json({
        code: API_CODE.MODEL_NOT_FOUND,
        data: null,
        message: '型号不存在',
      });
    }
    
    const firmware = await firmwareController.getLatestFirmware(model as string, current_version as string);
    
    const upgradeAvailable = !!firmware;
    
    await Database.execute(
      'INSERT INTO ota_check_log (model, current_version, upgrade_available) VALUES (?, ?, ?)',
      [model, current_version, upgradeAvailable ? 1 : 0]
    );
    
    if (!firmware) {
      return res.json({
        code: API_CODE.SUCCESS,
        data: {
          upgrade_available: false,
          version: current_version,
          latest_version: current_version,
        },
        message: '已是最新版本',
      });
    }
    
    const downloadPath = `/api/ota/download/${firmware.id}`;
    const downloadUrl = appConfig.domain ? `${appConfig.domain}${downloadPath}` : downloadPath;
    
    return res.json({
      code: API_CODE.SUCCESS,
      data: {
        upgrade_available: true,
        version: firmware.version,
        size: firmware.file_size,
        md5: firmware.file_md5,
        download_url: downloadUrl,
        description: firmware.description,
      },
      message: 'success',
    });
  } catch (error) {
    console.error('OTA check error:', error);
    return res.json({
      code: API_CODE.SERVER_ERROR,
      data: null,
      message: '服务器内部错误',
    });
  }
});

router.get('/download/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const firmware = await firmwareController.getFirmwareById(Number(id));
    
    if (!firmware || !firmware.file_path || !fs.existsSync(firmware.file_path)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    await firmwareController.incrementDownloadCount(Number(id));
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${firmware.version}.bin"`);
    res.setHeader('Content-Length', firmware.file_size);
    res.setHeader('Content-MD5', firmware.file_md5);
    
    const fileStream = fs.createReadStream(firmware.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
