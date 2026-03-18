export interface DeviceModel {
  id: number;
  name: string;
  description: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export interface Firmware {
  id: number;
  model_id: number;
  version: string;
  description: string;
  file_path: string;
  file_size: number;
  file_md5: string;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  is_deleted: number;
}

export interface FirmwareWithModel extends Firmware {
  model_name: string;
  model_status: number;
}

export interface Admin {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface OperationLog {
  id: number;
  admin_id: number;
  action: string;
  target_type: string;
  target_id: number;
  detail: string;
  ip: string;
  created_at: Date;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export const API_CODE = {
  SUCCESS: 0,
  PARAM_ERROR: 4001,
  MODEL_NOT_FOUND: 4002,
  ALREADY_LATEST: 4003,
  NOT_FOUND: 4004,
  HAS_RELATED: 4005,
  SERVER_ERROR: 5001,
} as const;
