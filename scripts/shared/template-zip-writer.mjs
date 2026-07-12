/**
 * 文件功能：将案例源码目录打包为可下载的 .wptemplate.zip，不引入额外运行时依赖。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';

const localFileSignature = 0x04034b50;
const centralFileSignature = 0x02014b50;
const endSignature = 0x06054b50;
const utf8Flag = 0x0800;
const deflateMethod = 8;

/** 递归收集目录内容并生成标准 ZIP；excludeNames 仅匹配案例根目录下的站点专用文件。 */
export async function writeTemplateZip(directoryPath, outputPath, { excludeNames = [] } = {}) {
  const files = await collectFiles(directoryPath, '', new Set(excludeNames));
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const content = await fs.readFile(file.absolutePath);
    const compressed = deflateRawSync(content, { level: 9 });
    const name = Buffer.from(file.relativePath, 'utf8');
    const checksum = crc32(content);
    const localHeader = createLocalHeader(name, checksum, compressed.length, content.length);
    localParts.push(localHeader, name, compressed);
    centralParts.push(createCentralHeader(name, checksum, compressed.length, content.length, offset), name);
    offset += localHeader.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const endRecord = createEndRecord(files.length, centralDirectory.length, offset);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, Buffer.concat([...localParts, centralDirectory, endRecord]));
}

/** 按稳定的 POSIX 路径顺序递归收集普通文件，忽略符号链接。 */
async function collectFiles(rootPath, relativeDirectory, excludedRootNames) {
  const directoryPath = path.join(rootPath, relativeDirectory);
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, 'zh-CN'))) {
    if (!relativeDirectory && excludedRootNames.has(entry.name)) continue;
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(rootPath, relativePath, excludedRootNames));
    else if (entry.isFile()) files.push({ absolutePath: path.join(rootPath, relativePath), relativePath: relativePath.replaceAll('\\', '/') });
  }
  return files;
}

/** 创建 ZIP 本地文件头。 */
function createLocalHeader(name, checksum, compressedSize, originalSize) {
  const header = Buffer.alloc(30);
  header.writeUInt32LE(localFileSignature, 0); header.writeUInt16LE(20, 4);
  header.writeUInt16LE(utf8Flag, 6); header.writeUInt16LE(deflateMethod, 8);
  header.writeUInt32LE(checksum, 14); header.writeUInt32LE(compressedSize, 18);
  header.writeUInt32LE(originalSize, 22); header.writeUInt16LE(name.length, 26);
  return header;
}

/** 创建 ZIP 中央目录文件头。 */
function createCentralHeader(name, checksum, compressedSize, originalSize, offset) {
  const header = Buffer.alloc(46);
  header.writeUInt32LE(centralFileSignature, 0); header.writeUInt16LE(20, 4); header.writeUInt16LE(20, 6);
  header.writeUInt16LE(utf8Flag, 8); header.writeUInt16LE(deflateMethod, 10);
  header.writeUInt32LE(checksum, 16); header.writeUInt32LE(compressedSize, 20);
  header.writeUInt32LE(originalSize, 24); header.writeUInt16LE(name.length, 28);
  header.writeUInt32LE(offset, 42);
  return header;
}

/** 创建 ZIP 中央目录结束记录；模板规模受经典 ZIP 32 位限制。 */
function createEndRecord(fileCount, centralSize, centralOffset) {
  if (fileCount > 0xffff || centralSize > 0xffffffff || centralOffset > 0xffffffff) throw new Error('模板目录过大，无法使用标准 ZIP 打包。');
  const record = Buffer.alloc(22);
  record.writeUInt32LE(endSignature, 0); record.writeUInt16LE(fileCount, 8);
  record.writeUInt16LE(fileCount, 10); record.writeUInt32LE(centralSize, 12);
  record.writeUInt32LE(centralOffset, 16);
  return record;
}

/** 计算 ZIP 文件头要求的 CRC-32 校验值。 */
function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return (value ^ 0xffffffff) >>> 0;
}
