/**
 * 文件功能：读取 .wptemplate.zip 包内条目和 JSON 内容，封装 ZIP 中央目录解析。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';
import { siteRoot, toPosix } from './site-utils.mjs';

/** 读取并索引 ZIP 中央目录；当前模板包只需要支持 store 和 deflate 两类条目。 */
export async function readZipArchive(filePath) {
  const data = await fs.readFile(filePath);
  const eocdOffset = findEndOfCentralDirectory(data, filePath);
  const centralDirectorySize = data.readUInt32LE(eocdOffset + 12);
  const centralDirectoryOffset = data.readUInt32LE(eocdOffset + 16);
  const endOffset = centralDirectoryOffset + centralDirectorySize;
  const entries = new Map();
  let offset = centralDirectoryOffset;

  while (offset < endOffset) {
    if (data.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`${relativeSitePath(filePath)} 的 ZIP 中央目录已损坏。`);
    }

    const method = data.readUInt16LE(offset + 10);
    const compressedSize = data.readUInt32LE(offset + 20);
    const uncompressedSize = data.readUInt32LE(offset + 24);
    const nameLength = data.readUInt16LE(offset + 28);
    const extraLength = data.readUInt16LE(offset + 30);
    const commentLength = data.readUInt16LE(offset + 32);
    const localHeaderOffset = data.readUInt32LE(offset + 42);
    const name = data.toString('utf8', offset + 46, offset + 46 + nameLength);

    entries.set(normalizeZipPath(name), {
      method,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
    });
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return { data, entries };
}

/** 从 ZIP 中读取 JSON 对象条目；数组、空值和基础类型都会被视为格式错误。 */
export function readZipObjectJson(zip, zipPath, packagePath) {
  const value = readZipJson(zip, zipPath, packagePath);
  if (!isPlainObject(value)) {
    throw new Error(`${relativeSitePath(packagePath)} 中的 ${zipPath} 必须是 JSON 对象。`);
  }
  return value;
}

/** 从 ZIP 中读取 JSON 条目；缺失或格式错误时抛出可定位错误。 */
export function readZipJson(zip, zipPath, packagePath) {
  const entry = getZipEntry(zip, zipPath);
  if (!entry) {
    throw new Error(`${relativeSitePath(packagePath)} 缺少 ${zipPath}。`);
  }

  try {
    return JSON.parse(extractZipEntry(zip, entry, packagePath).toString('utf8'));
  } catch (error) {
    throw new Error(`${relativeSitePath(packagePath)} 中的 ${zipPath} 不是有效 JSON：${error.message}`);
  }
}

/** 按路径查找 ZIP 条目，统一处理开头斜杠和 Windows 分隔符。 */
export function getZipEntry(zip, zipPath) {
  return zip.entries.get(normalizeZipPath(zipPath));
}

/** 解压单个 ZIP 条目；输出原始文件内容 Buffer。 */
export function extractZipEntry(zip, entry, packagePath) {
  const { data } = zip;
  const offset = entry.localHeaderOffset;
  if (data.readUInt32LE(offset) !== 0x04034b50) {
    throw new Error(`${relativeSitePath(packagePath)} 的 ZIP 本地文件头已损坏。`);
  }

  const nameLength = data.readUInt16LE(offset + 26);
  const extraLength = data.readUInt16LE(offset + 28);
  const dataStart = offset + 30 + nameLength + extraLength;
  const compressed = data.subarray(dataStart, dataStart + entry.compressedSize);

  if (entry.method === 0) {
    return compressed;
  }

  if (entry.method === 8) {
    const inflated = zlib.inflateRawSync(compressed);
    if (entry.uncompressedSize > 0 && inflated.length !== entry.uncompressedSize) {
      throw new Error(`${relativeSitePath(packagePath)} 的 ZIP 条目解压大小不匹配。`);
    }
    return inflated;
  }

  throw new Error(`${relativeSitePath(packagePath)} 包含不支持的 ZIP 压缩方法：${entry.method}。`);
}

/** 在 ZIP 尾部定位 EOCD 记录。 */
function findEndOfCentralDirectory(data, filePath) {
  const minOffset = Math.max(0, data.length - 65557);
  for (let offset = data.length - 22; offset >= minOffset; offset -= 1) {
    if (data.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }
  throw new Error(`${relativeSitePath(filePath)} 不是有效的 ZIP 文件。`);
}

/** 判断 JSON 解析结果是否为普通对象。 */
function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** 统一 ZIP 路径格式，避免平台分隔符差异。 */
function normalizeZipPath(value) {
  return toPosix(String(value)).replace(/^\/+/, '');
}

/** 将绝对路径压缩为站点相对路径，便于错误信息定位。 */
function relativeSitePath(filePath) {
  return toPosix(path.relative(siteRoot, filePath));
}
