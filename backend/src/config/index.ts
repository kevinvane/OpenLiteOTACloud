import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

interface ServerConfig {
  port: number;
  host: string;
}

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

interface StorageConfig {
  type: string;
  path: string;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  storage: StorageConfig;
  jwt: JwtConfig;
  domain: string;
}

const defaultConfig = require('./default.json');

const appConfig: AppConfig = {
  server: {
    port: parseInt(process.env.SERVER_PORT || String(defaultConfig.server.port), 10),
    host: process.env.SERVER_HOST || defaultConfig.server.host,
  },
  database: {
    host: process.env.DB_HOST || defaultConfig.database.host,
    port: parseInt(process.env.DB_PORT || String(defaultConfig.database.port), 10),
    user: process.env.DB_USER || defaultConfig.database.user,
    password: process.env.DB_PASSWORD || defaultConfig.database.password,
    database: process.env.DB_NAME || defaultConfig.database.database,
  },
  storage: {
    type: process.env.STORAGE_TYPE || defaultConfig.storage.type,
    path: process.env.STORAGE_PATH || defaultConfig.storage.path,
  },
  jwt: {
    secret: process.env.JWT_SECRET || defaultConfig.jwt.secret,
    expiresIn: process.env.JWT_EXPIRES_IN || defaultConfig.jwt.expiresIn,
  },
  domain: process.env.DOMAIN || defaultConfig.domain || '',
};

export default appConfig;
