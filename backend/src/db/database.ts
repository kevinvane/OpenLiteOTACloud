import mysql, { Pool, PoolConnection, ResultSetHeader } from 'mysql2/promise';
import appConfig from '../config';

export class Database {
  private static pool: Pool | null = null;

  private static getPool(): Pool {
    if (!Database.pool) {
      Database.pool = mysql.createPool({
        host: appConfig.database.host,
        port: appConfig.database.port,
        user: appConfig.database.user,
        password: appConfig.database.password,
        database: appConfig.database.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return Database.pool;
  }

  static async query<T = any>(sql: string, params?: any[]): Promise<T> {
    const pool = Database.getPool();
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  }

  static async execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
    const pool = Database.getPool();
    const [result] = await pool.execute(sql, params);
    return result as ResultSetHeader;
  }

  static async getConnection(): Promise<PoolConnection> {
    return Database.getPool().getConnection();
  }

  static async transaction<T>(callback: (connection: PoolConnection) => Promise<T>): Promise<T> {
    const connection = await Database.getConnection();
    await connection.beginTransaction();
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
