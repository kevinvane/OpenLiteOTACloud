import { Database } from '../db/database';

export class DashboardModel {

  async getStats() {
    const totalFirmware = await Database.query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM firmware WHERE is_deleted = 0'
    );
    
    const totalModel = await Database.query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM device_model WHERE status = 1'
    );
    
    const modelDistribution = await Database.query<{ model_id: number; model_name: string; count: number }[]>(`
      SELECT m.id as model_id, m.name as model_name, COUNT(f.id) as count 
      FROM device_model m 
      LEFT JOIN firmware f ON m.id = f.model_id AND f.is_deleted = 0 
      WHERE m.status = 1 
      GROUP BY m.id, m.name 
      ORDER BY count DESC
    `);
    
    const latestVersions = await Database.query<{ model_id: number; model_name: string; version: string }[]>(`
      SELECT m.id as model_id, m.name as model_name, 
        (SELECT version FROM firmware WHERE model_id = m.id AND is_deleted = 0 ORDER BY version DESC LIMIT 1) as version
      FROM device_model m WHERE m.status = 1
    `);
    
    const topDownloads = await Database.query<{ model: string; check_count: number }[]>(`
      SELECT model, COUNT(*) as check_count 
      FROM ota_check_log 
      WHERE upgrade_available = 1
      GROUP BY model 
      ORDER BY check_count DESC 
      LIMIT 10
    `);
    
    return {
      totalFirmware: totalFirmware[0]?.count || 0,
      totalModel: totalModel[0]?.count || 0,
      modelDistribution,
      latestVersions,
      topDownloads,
    };
  }
}

export const dashboardModel = new DashboardModel();
