const VERSION_REGEX = /^\d+\.\d+\.\d+$/;

/**
 * 校验版本号(格式: x.x.x)
 * @param version 版本号 (格式: x.x.x)
 * @returns true: 合法, false: 不合法
 */
export function validateVersion(version: string): boolean {
  return VERSION_REGEX.test(version);
}

/**
 * 比较两个版本号的大小
 * @param v1 版本号1 (格式: x.x.x)
 * @param v2 版本号2 (格式: x.x.x)
 * @returns 1: v1 > v2, -1: v1 < v2, 0: v1 = v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}
