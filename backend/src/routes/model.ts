import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { modelController } from '../controllers/model.controller';
import { logController } from '../controllers/log.controller';
import { API_CODE } from '../models/types';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    const result = await modelController.getModels(Number(page), Number(pageSize), status ? Number(status) : undefined);
    res.json({ code: API_CODE.SUCCESS, data: result, message: 'success' });
  } catch (error) {
    console.error('Get models error:', error);
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const model = await modelController.getModelById(Number(id));
    
    if (!model) {
      return res.json({ code: API_CODE.NOT_FOUND, message: '型号不存在' });
    }
    
    res.json({ code: API_CODE.SUCCESS, data: model, message: 'success' });
  } catch (error) {
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '请输入型号名称' });
    }
    
    const id = await modelController.createModel(name, description);
    await logController.addOperationLog(req.adminId!, 'create', 'model', id, { name, description }, req.ip || '0.0.0.0');
    
    res.json({ code: API_CODE.SUCCESS, data: { id }, message: '创建成功' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '型号名称已存在' });
    }
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const model = await modelController.getModelById(Number(id));
    if (!model) {
      return res.json({ code: API_CODE.NOT_FOUND, message: '型号不存在' });
    }
    
    await modelController.updateModel(Number(id), name, description, status);
    await logController.addOperationLog(req.adminId!, 'update', 'model', Number(id), { name, description, status }, req.ip || '0.0.0.0');
    
    res.json({ code: API_CODE.SUCCESS, message: '更新成功' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ code: API_CODE.PARAM_ERROR, message: '型号名称已存在' });
    }
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const success = await modelController.deleteModel(Number(id));
    
    if (!success) {
      return res.json({ code: API_CODE.HAS_RELATED, message: '该型号下存在固件，无法删除' });
    }
    
    await logController.addOperationLog(req.adminId!, 'delete', 'model', Number(id), {}, req.ip || '0.0.0.0');
    
    res.json({ code: API_CODE.SUCCESS, message: '删除成功' });
  } catch (error) {
    res.json({ code: API_CODE.SERVER_ERROR, message: '服务器内部错误' });
  }
});

export default router;
