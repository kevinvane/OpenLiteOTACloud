# IoT设备OTA升级 API 文档

## 概述

本文档描述了IoT设备如何对接OTA升级云端系统。设备端通过HTTP接口查询最新固件版本并下载升级包。

**接口基础地址HOST**: `http://your-domain.com`

---

## 固件版本查询

### 请求

```
GET /api/ota/check
```

**Query 参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 是 | 设备型号 |
| current_version | string | 是 | 当前固件版本 |

**示例**:

```bash
curl "${HOST}/api/ota/check?model=ios100&current_version=1.0.0"
```

### 响应

**已是最新版本**:

```json
{
  "code": 0,
  "data": {
    "upgrade_available": false,
    "version": "1.0.0",
    "latest_version": "1.0.0"
  },
  "message": "已是最新版本"
}
```

**有新版本可升级**:

```json
{
  "code": 0,
  "data": {
    "upgrade_available": true,
    "version": "1.0.1",
    "size": 1048576,
    "md5": "d41d8cd98f00b204e9800998ecf8427e",
    "download_url": "${HOST}/firmwares/ios100/1.0.1.bin",
    "description": "修复已知问题，提升稳定性"
  },
  "message": "success"
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 错误码，0表示成功 |
| data.upgrade_available | bool | 是否有新版本可升级 |
| data.version | string | 最新固件版本号 |
| data.size | int | 固件文件大小（字节） |
| data.md5 | string | 固件文件MD5值 |
| data.download_url | string | 固件下载链接 |
| data.description | string | 版本更新描述 |
| message | string | 提示信息 |

### 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 4001 | 参数错误 |
| 4002 | 型号不存在 |
| 4003 | 已是最新版本 |
| 5001 | 服务器内部错误 |

---


## 常见问题

**Q: 返回 "型号不存在" 怎么办？**
> A: 请确认设备型号与后台管理的型号一致，或联系管理员添加设备型号。

**Q: 下载链接有效期多久？**
> A: 默认情况下下载链接长期有效。

**Q: 如何判断升级成功？**
> A: 升级完成后，设备可重新调用 `/api/ota/check` 接口确认版本号已更新。


