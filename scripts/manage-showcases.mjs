/**
 * 文件功能：启动仅监听 127.0.0.1 的本地案例管理服务。
 *
 * 服务提供管理页面与写入接口，覆盖模板 ZIP 导入、构建产物导入、展示字段编辑、
 * 主图替换、排序与删除。只允许写入 site/showcases、site/public/showcases、
 * site/public/previews 三处目录，不参与线上构建。
 */
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathExists, projectRoot, siteRoot, toPosix } from './shared/site-utils.mjs';
import {
  deleteShowcase,
  commitBuildImport,
  commitTemplateImport,
  stageBuildImport,
  stageTemplateImport,
  updateCover,
} from './shared/showcase-import.mjs';
import { readImageSize } from './shared/showcase-meta.mjs';
import {
  listShowcaseSlugs,
  loadShowcasesForBuild,
  normalizeNumber,
  normalizeShowcaseRecord,
  previewRoot,
  publicShowcaseRoot,
  readShowcaseRecord,
  readTaxonomy,
  showcaseRoot,
  sortShowcases,
  taxonomyPath,
  writeShowcaseRecord,
  writeTaxonomy,
} from './shared/showcase-store.mjs';

const execFileAsync = promisify(execFile);
const manageAssetsRoot = path.join(import.meta.dirname, 'manage');
const publicRoot = path.join(siteRoot, 'public');
const maxBodyBytes = 320 * 1024 * 1024;
const defaultPort = 4173;
const port = Number(process.env.MANAGE_PORT || process.argv[2] || defaultPort);
const host = '127.0.0.1';

/** 允许的 Host 与 Origin；只认回环地址，避免外部域名借 DNS 重绑定拿到同源身份。 */
const allowedHosts = new Set([`${host}:${port}`, `localhost:${port}`]);
const allowedOrigins = new Set([`http://${host}:${port}`, `http://localhost:${port}`]);

/** 写操作要求携带的自定义头：跨源请求带自定义头会触发预检，而本服务不回 CORS 头，浏览器直接拦下。 */
const requestMarkerHeader = 'x-manage-request';

const server = http.createServer(async (request, response) => {
  try {
    if (!isTrustedHost(request)) {
      sendJson(response, 403, { error: 'Host 不受信任，管理服务只接受本机回环地址访问。' });
      return;
    }

    const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

    if (url.pathname.startsWith('/api/')) {
      if (!isTrustedApiRequest(request)) {
        sendJson(response, 403, { error: '请求来源不受信任，请从管理页发起操作。' });
        return;
      }
      await handleApi(url, request, response);
      return;
    }

    if (url.pathname.startsWith('/public/')) {
      const relativePath = decodeURIComponent(url.pathname.slice('/public/'.length));
      await serveFile(path.join(publicRoot, ...relativePath.split('/')), publicRoot, response);
      return;
    }

    const assetPath = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
    await serveFile(path.join(manageAssetsRoot, ...assetPath.split('/')), manageAssetsRoot, response);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

/** 校验 Host 头，挡掉把外部域名解析到 127.0.0.1 的 DNS 重绑定访问。 */
function isTrustedHost(request) {
  return allowedHosts.has(String(request.headers.host || '').toLowerCase());
}

/**
 * 校验接口请求来源。
 *
 * GET 只读，放行；写操作必须来自本机同源页面，并带上管理页专用的自定义请求头。
 * 自定义头会让跨源请求进入预检，而本服务不返回 CORS 响应头，浏览器会直接拦截。
 */
function isTrustedApiRequest(request) {
  const origin = request.headers.origin;
  if (origin !== undefined && !allowedOrigins.has(String(origin).toLowerCase())) {
    return false;
  }
  if (request.method === 'GET' || request.method === 'HEAD') {
    return true;
  }
  return request.headers[requestMarkerHeader] === '1';
}

/** 路由分发：所有接口都要求 POST 或 GET，未知路径返回 404。 */
async function handleApi(url, request, response) {
  const route = `${request.method} ${url.pathname}`;

  if (route === 'GET /api/state') {
    sendJson(response, 200, await buildState());
    return;
  }

  if (request.method !== 'POST') {
    sendJson(response, 405, { error: '仅支持 GET 或 POST。' });
    return;
  }

  if (route === 'POST /api/showcase') {
    const payload = await readJsonBody(request);
    sendJson(response, 200, await saveShowcaseFields(payload));
    return;
  }

  if (route === 'POST /api/reorder') {
    const payload = await readJsonBody(request);
    sendJson(response, 200, await saveOrder(payload));
    return;
  }

  if (route === 'POST /api/taxonomy') {
    const payload = await readJsonBody(request);
    await writeTaxonomy({
      tagGroups: Array.isArray(payload.tagGroups) ? payload.tagGroups : [],
    });
    sendJson(response, 200, { taxonomy: await readTaxonomy() });
    return;
  }

  if (route === 'POST /api/import/template') {
    const buffer = await readBinaryBody(request);
    const fileName = normalizeFileName(url.searchParams.get('filename'));
    sendJson(response, 200, await stageTemplateImport({ zipBuffer: buffer, fileName }));
    return;
  }

  if (route === 'POST /api/import/template/commit') {
    const payload = await readJsonBody(request);
    sendJson(response, 200, await commitTemplateImport(payload));
    return;
  }

  if (route === 'POST /api/import/build') {
    const buffer = await readBinaryBody(request);
    sendJson(response, 200, await stageBuildImport({ zipBuffer: buffer }));
    return;
  }

  if (route === 'POST /api/import/build/commit') {
    const payload = await readJsonBody(request);
    sendJson(response, 200, await commitBuildImport(payload));
    return;
  }

  if (route === 'POST /api/cover') {
    const buffer = await readBinaryBody(request);
    const slug = url.searchParams.get('slug') || '';
    const fileName = normalizeFileName(url.searchParams.get('filename'));
    const size = readImageSize(buffer);
    if (!size) {
      sendJson(response, 400, { error: '无法识别图片格式，请上传 PNG、JPEG 或 WebP。' });
      return;
    }
    sendJson(response, 200, await updateCover({ slug, buffer, fileName }));
    return;
  }

  if (route === 'POST /api/delete') {
    const payload = await readJsonBody(request);
    sendJson(response, 200, await deleteShowcase(String(payload.slug || '')));
    return;
  }

  if (route === 'POST /api/sync') {
    const result = await runSync();
    sendJson(response, 200, result);
    return;
  }

  sendJson(response, 404, { error: `未知接口：${route}` });
}

/** 汇总管理页需要的全部状态：案例列表、词表、目录说明。 */
async function buildState() {
  const taxonomy = await readTaxonomy();
  const { showcases, problems } = await loadShowcasesForBuild();
  const slugs = await listShowcaseSlugs();
  const allRecords = [];

  for (const slug of slugs) {
    const record = await readShowcaseRecord(slug);
    if (!record) {
      continue;
    }
    allRecords.push({
      ...normalizeShowcaseRecord(slug, record),
      hidden: record.hidden === true,
      coverBytes: await fileSize(path.join(publicShowcaseRoot, slug, record?.cover?.file || '')),
      packageBytes: await fileSize(path.join(publicShowcaseRoot, slug, record?.template?.file || '')),
      previewBytes: await directorySize(path.join(previewRoot, slug)),
      hasPreview: record?.preview?.available === true && await pathExists(path.join(previewRoot, slug, 'index.html')),
    });
  }

  return {
    showcases: sortShowcases(allRecords),
    problems,
    taxonomy,
    paths: {
      showcases: toPosix(path.relative(projectRoot, showcaseRoot)),
      publicShowcases: toPosix(path.relative(projectRoot, publicShowcaseRoot)),
      previews: toPosix(path.relative(projectRoot, previewRoot)),
      taxonomy: toPosix(path.relative(projectRoot, taxonomyPath)),
    },
    visibleCount: showcases.length,
  };
}

/** 保存展示字段：只接受白名单字段，避免管理页写坏其它配置。 */
async function saveShowcaseFields(payload) {
  const slug = String(payload.slug || '').trim();
  const record = await readShowcaseRecord(slug);
  if (!record) {
    throw new Error(`案例 ${slug} 不存在。`);
  }

  const patch = payload.patch || {};
  const next = { ...record };

  if (typeof patch.title === 'string') {
    next.title = patch.title.trim();
  }
  if (typeof patch.summary === 'string') {
    next.summary = patch.summary.trim();
  }
  if (typeof patch.category === 'string' && patch.category.trim()) {
    next.category = patch.category.trim();
  }
  if (Array.isArray(patch.tags)) {
    next.tags = [...new Set(patch.tags.map((tag) => String(tag).trim()).filter(Boolean))];
  }
  if (typeof patch.featured === 'boolean') {
    next.featured = patch.featured;
  }
  if (typeof patch.hidden === 'boolean') {
    next.hidden = patch.hidden;
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'sortOrder')) {
    // 与 showcase.json 的读写口径一致：空串、null、非法值统一视为「未指定」。
    next.sortOrder = normalizeNumber(patch.sortOrder);
  }

  next.updatedAt = new Date().toISOString();
  await writeShowcaseRecord(slug, next);
  return { slug, record: next };
}

/** 批量保存排序；按数组顺序写入递增 sortOrder。 */
async function saveOrder(payload) {
  const slugs = Array.isArray(payload.slugs) ? payload.slugs.map(String) : [];
  const results = [];

  for (const [index, slug] of slugs.entries()) {
    const record = await readShowcaseRecord(slug);
    if (!record) {
      continue;
    }
    const next = { ...record, sortOrder: (index + 1) * 10, updatedAt: new Date().toISOString() };
    await writeShowcaseRecord(slug, next);
    results.push({ slug, sortOrder: next.sortOrder });
  }

  return { results };
}

/** 运行一次文档与案例同步，返回标准输出供管理页展示。 */
async function runSync() {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [path.join(import.meta.dirname, 'sync-docs.mjs')], {
      cwd: projectRoot,
      maxBuffer: 8 * 1024 * 1024,
    });
    return { ok: true, output: [stdout.trim(), stderr.trim()].filter(Boolean).join('\n') };
  } catch (error) {
    return { ok: false, output: [error.stdout, error.stderr, error.message].filter(Boolean).join('\n') };
  }
}

/** 读取并输出单个文件；路径必须落在允许的根目录内。 */
async function serveFile(targetPath, allowedRoot, response) {
  const resolvedRoot = path.resolve(allowedRoot);
  const resolvedPath = path.resolve(targetPath);

  if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) {
    sendJson(response, 403, { error: '路径不允许越过静态目录。' });
    return;
  }
  if (!(await pathExists(resolvedPath))) {
    sendJson(response, 404, { error: `文件不存在：${toPosix(path.relative(resolvedRoot, resolvedPath))}` });
    return;
  }

  const content = await fs.readFile(resolvedPath);
  response.writeHead(200, {
    'Content-Type': resolveContentType(resolvedPath),
    'Content-Length': content.length,
    'Cache-Control': 'no-store',
  });
  response.end(content);
}

/** 读取 JSON 请求体，限制大小避免误传大文件。 */
async function readJsonBody(request) {
  const buffer = await readBinaryBody(request);
  if (buffer.length === 0) {
    return {};
  }
  return JSON.parse(buffer.toString('utf8'));
}

/** 读取二进制请求体，超过上限直接中断。 */
async function readBinaryBody(request) {
  const chunks = [];
  let total = 0;

  for await (const chunk of request) {
    total += chunk.length;
    if (total > maxBodyBytes) {
      throw new Error('上传内容超过 320MB 上限。');
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** 输出 JSON 响应。 */
function sendJson(response, statusCode, payload) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8');
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  });
  response.end(body);
}

/** 依据扩展名返回 Content-Type。 */
function resolveContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
  };
  return types[extension] || 'application/octet-stream';
}

/** 提取上传文件名，避免路径片段混入。 */
function normalizeFileName(value) {
  const name = String(value || '').trim();
  return name ? path.basename(name) : 'upload.zip';
}

/** 读取单文件体积，缺失时返回 0。 */
async function fileSize(filePath) {
  try {
    return (await fs.stat(filePath)).size;
  } catch {
    return 0;
  }
}

/** 统计目录总字节数，用于展示预览产物体积。 */
async function directorySize(directory) {
  if (!(await pathExists(directory))) {
    return 0;
  }

  let total = 0;
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      total += await directorySize(entryPath);
    } else if (entry.isFile()) {
      total += await fileSize(entryPath);
    }
  }
  return total;
}

/** 解析端口参数并启动服务，只监听回环地址。 */
server.listen(port, host, () => {
  console.log(`案例管理服务已启动：http://${host}:${port}/`);
  console.log('仅监听本机回环地址，不对外网开放。按 Ctrl+C 停止。');
});
