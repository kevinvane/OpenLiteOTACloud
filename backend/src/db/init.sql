-- 创数据库
CREATE DATABASE IF NOT EXISTS ota_cloud DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
USE ota_cloud;

-- 设备型号表
CREATE TABLE IF NOT EXISTS `device_model` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL COMMENT '型号名称',
  `description` VARCHAR(500) COMMENT '型号描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 固件版本表
CREATE TABLE IF NOT EXISTS `firmware` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `model_id` INT UNSIGNED NOT NULL COMMENT '设备型号ID',
  `version` VARCHAR(20) NOT NULL COMMENT '固件版本',
  `description` TEXT COMMENT '版本描述',
  `file_path` VARCHAR(255) NOT NULL COMMENT '本地存储路径或OSS路径',
  `file_size` BIGINT UNSIGNED NOT NULL,
  `file_md5` CHAR(32) NOT NULL,
  `download_count` INT UNSIGNED DEFAULT 0 COMMENT '下载次数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0,
  UNIQUE KEY `uk_model_version` (`model_id`, `version`),
  KEY `idx_model_id` (`model_id`),
  FOREIGN KEY (`model_id`) REFERENCES `device_model`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员表
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码hash',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 操作日志表
CREATE TABLE IF NOT EXISTS `operation_log` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_id` INT UNSIGNED NOT NULL COMMENT '管理员ID',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型：create/delete/update',
  `target_type` VARCHAR(20) NOT NULL COMMENT '操作对象：firmware/model',
  `target_id` INT UNSIGNED NOT NULL COMMENT '操作对象ID',
  `detail` TEXT COMMENT '操作详情',
  `ip` VARCHAR(45) NOT NULL COMMENT '操作IP',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 接口访问日志表
CREATE TABLE IF NOT EXISTS `access_log` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `method` VARCHAR(10) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `query` JSON,
  `ip` VARCHAR(45),
  `user_agent` VARCHAR(500),
  `response_time` INT UNSIGNED COMMENT '响应时间(ms)',
  `status_code` SMALLINT UNSIGNED,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_created_at` (`created_at`),
  KEY `idx_path_ip` (`path`, `ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- OTA检查统计表(用于统计ota/check接口调用次数)
CREATE TABLE IF NOT EXISTS `ota_check_log` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `model` VARCHAR(50) NOT NULL COMMENT '设备型号',
  `current_version` VARCHAR(20) NOT NULL COMMENT '当前版本',
  `upgrade_available` TINYINT DEFAULT 0 COMMENT '是否有新版本',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_model_created` (`model`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入默认管理员 admin/ota2024 (password hash for 'ota2024')
INSERT INTO admin (username, password) VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.rsW4WzOFbMB3dHI.');
