/**
 * 文件功能：安全读取案例模板目录中的 JSON 与二进制资源。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { toPosix } from './site-utils.mjs';

/** 读取模板目录中的 JSON 对象；路径越界、缺失或格式错误时抛出可定位错误。 */
export async function readDirectoryObjectJson(directoryPath, relativePath) {
  const filePath = resolveTemplatePath(directoryPath, relativePath);
  let value;
  try {
    value = JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${toPosix(path.relative(directoryPath, filePath))} 不是有效 JSON：${error.message}`);
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${toPosix(path.relative(directoryPath, filePath))} 必须是 JSON 对象。`);
  }
  return value;
}

/** 读取模板目录中的二进制文件，并阻止绝对路径或父目录穿越。 */
export async function readDirectoryFile(directoryPath, relativePath) {
  return fs.readFile(resolveTemplatePath(directoryPath, relativePath));
}

/** 将模板内 POSIX 相对路径解析到案例目录中，确保结果不会越界。 */
function resolveTemplatePath(directoryPath, relativePath) {
  const normalizedPath = String(relativePath).replaceAll('\\', '/').replace(/^\/+/, '');
  const resolvedRoot = path.resolve(directoryPath);
  const resolvedPath = path.resolve(resolvedRoot, ...normalizedPath.split('/'));
  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`模板路径不允许越过案例目录：${relativePath}`);
  }
  return resolvedPath;
}
