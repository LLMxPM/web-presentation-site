/**
 * 文件功能：零依赖读取 ZIP 归档，供本地案例管理服务解包模板 ZIP 与构建产物 ZIP 使用。
 *
 * 只支持 Web-Presentation 导出的常规归档：存储（method 0）和 deflate（method 8），
 * 不支持分卷、加密与 ZIP64。解析前统一做路径越界校验，避免恶意条目写出目标目录。
 */
import fs from 'node:fs/promises';
import { inflateRawSync } from 'node:zlib';
import path from 'node:path';

const endSignature = 0x06054b50;
const centralSignature = 0x02014b50;
const localSignature = 0x04034b50;
const zip64Marker = 0xffffffff;

/**
 * 解析 ZIP 归档内容。
 *
 * 输入为完整 ZIP 的 Buffer，输出保持归档顺序的条目数组。
 * 目录条目会标记 isDirectory，文件条目直接携带解压后的内容。
 */
export function readZipEntries(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 22) {
    throw new Error('ZIP 内容为空或长度不足，无法解析。');
  }

  const endOffset = findEndOfCentralDirectory(buffer);
  const totalEntries = buffer.readUInt16LE(endOffset + 10);
  const centralSize = buffer.readUInt32LE(endOffset + 12);
  const centralOffset = buffer.readUInt32LE(endOffset + 16);

  if (totalEntries === 0xffff || centralSize === zip64Marker || centralOffset === zip64Marker) {
    throw new Error('暂不支持 ZIP64 归档，请重新导出为标准 ZIP。');
  }

  if (centralOffset + centralSize > buffer.length) {
    throw new Error('ZIP 中央目录越界，文件可能已损坏。');
  }

  const entries = [];
  let cursor = centralOffset;

  for (let index = 0; index < totalEntries; index += 1) {
    if (cursor + 46 > buffer.length || buffer.readUInt32LE(cursor) !== centralSignature) {
      throw new Error(`ZIP 中央目录第 ${index + 1} 项损坏。`);
    }

    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const uncompressedSize = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const rawName = buffer.subarray(cursor + 46, cursor + 46 + nameLength);

    if (compressedSize === zip64Marker || uncompressedSize === zip64Marker || localOffset === zip64Marker) {
      throw new Error('暂不支持 ZIP64 归档条目，请重新导出为标准 ZIP。');
    }
    if ((flags & 0x0001) !== 0) {
      throw new Error('暂不支持加密 ZIP 归档。');
    }

    const name = decodeEntryName(rawName, flags);
    cursor += 46 + nameLength + extraLength + commentLength;

    if (!name) {
      continue;
    }

    if (name.endsWith('/')) {
      entries.push({ name, isDirectory: true, size: 0, content: Buffer.alloc(0) });
      continue;
    }

    if (localOffset + 30 > buffer.length || buffer.readUInt32LE(localOffset) !== localSignature) {
      throw new Error(`ZIP 条目 ${name} 的本地文件头损坏。`);
    }

    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const dataEnd = dataOffset + compressedSize;

    if (dataEnd > buffer.length) {
      throw new Error(`ZIP 条目 ${name} 的内容越界，文件可能已损坏。`);
    }

    const rawData = buffer.subarray(dataOffset, dataEnd);
    entries.push({
      name,
      isDirectory: false,
      size: uncompressedSize,
      content: inflateEntry(rawData, method, name),
    });
  }

  return entries;
}

/**
 * 将 ZIP 条目安全写入目标目录。
 *
 * 拒绝绝对路径、盘符、父目录穿越和空名称，确保解压结果始终落在 targetDirectory 内。
 * 返回实际写出的文件列表，便于调用方展示导入清单。
 */
export async function extractZipEntries(entries, targetDirectory) {
  const resolvedRoot = path.resolve(targetDirectory);
  const writtenFiles = [];

  for (const entry of entries) {
    const segments = normalizeEntrySegments(entry.name);
    const targetPath = path.resolve(resolvedRoot, ...segments);

    if (targetPath !== resolvedRoot && !targetPath.startsWith(`${resolvedRoot}${path.sep}`)) {
      throw new Error(`ZIP 条目越界，已终止导入：${entry.name}`);
    }

    if (entry.isDirectory) {
      await fs.mkdir(targetPath, { recursive: true });
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, entry.content);
    writtenFiles.push({ path: targetPath, name: entry.name, size: entry.content.length });
  }

  return writtenFiles;
}

/** 校验单个 ZIP 条目名，输出可拼接的路径片段。 */
export function normalizeEntrySegments(entryName) {
  const normalized = String(entryName).replaceAll('\\', '/').trim();

  if (!normalized || normalized.includes('\0')) {
    throw new Error('ZIP 中存在空名称或非法字符条目。');
  }
  if (/^[a-zA-Z]:/.test(normalized) || normalized.startsWith('/')) {
    throw new Error(`ZIP 条目不允许绝对路径：${entryName}`);
  }

  const segments = normalized.split('/').filter((segment) => segment && segment !== '.');
  if (segments.some((segment) => segment === '..')) {
    throw new Error(`ZIP 条目不允许包含父目录：${entryName}`);
  }
  return segments;
}

/** 从归档尾部向前查找中央目录结束记录，兼容带注释的 ZIP。 */
function findEndOfCentralDirectory(buffer) {
  const maxCommentLength = 0xffff;
  const start = Math.max(0, buffer.length - maxCommentLength - 22);

  for (let offset = buffer.length - 22; offset >= start; offset -= 1) {
    if (buffer.readUInt32LE(offset) === endSignature) {
      return offset;
    }
  }

  throw new Error('未找到 ZIP 中央目录结束记录，文件不是有效 ZIP。');
}

/** 按压缩方法还原条目内容；未知方法直接报错，交由用户重新导出。 */
function inflateEntry(rawData, method, name) {
  if (method === 0) {
    return Buffer.from(rawData);
  }
  if (method === 8) {
    try {
      return inflateRawSync(rawData);
    } catch (error) {
      throw new Error(`ZIP 条目 ${name} 解压失败：${error.message}`);
    }
  }
  throw new Error(`ZIP 条目 ${name} 使用了不支持的压缩方法 ${method}。`);
}

/** 依据 UTF-8 标志解码条目名，非 UTF-8 条目按 UTF-8 兜底并去除控制字符。 */
function decodeEntryName(rawName, flags) {
  const text = (flags & 0x0800) !== 0
    ? rawName.toString('utf8')
    : rawName.toString('utf8');
  return text.replace(/[\u0000-\u001f]/g, '');
}
