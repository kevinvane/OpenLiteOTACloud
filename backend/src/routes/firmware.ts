import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import appConfig from '../config';
import { firmwareController } from '../controllers/firmware.controller';
import { modelController } from '../controllers/model.controller';
import { logController } from '../controllers/log.controller';
import { ensureDir, calculateMD5, generateFileName, getFileSize } from '../utils/file';
import { API_CODE } from '../models/types';

const router = Router();
const upload = multer({ dest: path.join(__dirname, '../../uploads') });

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, modelId } = req.query;
    const result = await firmwareController.getFirmwares(Number(page), Number(pageSize), modelId ? Number(modelId) : undefined);
    res.json({ code: API_CODE.SUCCESS, data: result, message: 'success' });
  } catch (error) {
    console.error('Get firmwares error:', error);
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.get('/options', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const options = await firmwareController.getModelOptions();
    res.json({ code: API_CODE.SUCCESS, data: options, message: 'success' });
  } catch (error) {
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.post('/', authMiddleware, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const { modelId, version, description } = req.body;
    const file = req.file;
    
    if (!modelId || !version || !file) {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '请填写完整信息并选择文件' });
    }
    
    const model = await modelController.getModelById(Number(modelId));
    if (!model || model.status === 0) {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '型号不存在或已禁用' });
    }
    
    const storagePath = appConfig.storage.path;
    ensureDir(storagePath);
    
    const fileName = generateFileName(file.originalname);
    const modelDir = path.join(storagePath, model.name);
    ensureDir(modelDir);
    
    const destPath = path.join(modelDir, `${version}.bin`);
    fs.renameSync(file.path, destPath);
    
    const fileSize = getFileSize(destPath);
    const fileMd5 = calculateMD5(destPath);
    
    const id = await firmwareController.createFirmware(Number(modelId), version, description || '', destPath, fileSize, fileMd5);
    await logController.addOperationLog(req.adminId!, 'create', 'firmware', id, { modelId, version, fileSize }, req.ip || '0.0.0.0');
    
    res.json({ code: API_CODE.SUCCESS, data: { id }, message: '上传成功' });
  } catch (error: any) {
    console.error('Upload firmware error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '该型号下已存在此版本固件' });
    }
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { version, description } = req.body;
    
    if (!version) {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '版本号不能为空' });
    }
    
    const firmware = await firmwareController.getFirmwareById(Number(id));
    if (!firmware) {
      return res.json({ code: API_CODE.NOT_FOUND, message: '固件不存在' });
    }
    
    await firmwareController.updateFirmware(Number(id), version, description || '');
    await logController.addOperationLog(req.adminId!, 'update', 'firmware', Number(id), { version, description }, req.ip || '0.0.0.0');
    
    res.json({ code: API_CODE.SUCCESS, message: '更新成功' });
  } catch (error) {
    console.error('Update firmware error:', error);
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const firmware = await firmwareController.getFirmwareById(Number(id));
    if (!firmware) {
      return res.json({ code: API_CODE.NOT_FOUND, message: '固件不存在' });
    }
    
    await firmwareController.deleteFirmware(Number(id));
    await logController.addOperationLog(req.adminId!, 'delete', 'firmware', Number(id), { version: firmware.version }, req.ip || '0.0.0.0');
    
    res.json({ code: API_CODE.SUCCESS, message: '删除成功' });
  } catch (error) {
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

export default router;
