import mysql from 'mysql2/promise';
import appConfig from '../config';
import fs from 'fs';
import path from 'path';
import { Database } from './database';

export { Database };

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
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
  return pool;
}

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  return Database.query<T>(sql, params);
}

export async function initDatabase(): Promise<void> {
  try {
    const connection = await mysql.createConnection({
      host: appConfig.database.host,
      port: appConfig.database.port,
      user: appConfig.database.user,
      password: appConfig.database.password,
      multipleStatements: true,
    });
    
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
    await connection.query(sql);
    await connection.end();
    console.log('Database initialized');
  } catch (error: any) {
    if (error.code === 'ER_DB_CREATE_EXISTS' || error.code === 'ER_TABLE_EXISTS_ERROR') {
      console.log('Database already exists');
    } else if (error.code === 'ER_DUP_ENTRY') {
      console.log('Database already initialized');
    } else {
      throw error;
    }
  }
}

export { getPool };
