/**
 * 文件功能：检查仓库中的大文件是否已按约定交由 Git LFS 管理。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(import.meta.dirname, '..');
const limitMb = Number.parseFloat(process.env.LARGE_FILE_LIMIT_MB ?? '5');
const limitBytes = limitMb * 1024 * 1024;

/** 执行只读 Git 命令并返回标准输出。 */
async function runGit(args, options = {}) {
  const { stdout } = await execFileAsync('git', args, {
    cwd: repoRoot,
    encoding: options.encoding ?? 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  return stdout;
}

/** 获取已跟踪和未忽略的未跟踪文件，确保提交前的新资产也会被检查。 */
async function listCandidateFiles() {
  const output = await runGit([
    'ls-files',
    '-z',
    '--cached',
    '--others',
    '--exclude-standard',
  ], { encoding: 'buffer' });

  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean);
}

/** 查询文件最终生效的 filter 属性；只有 lfs 才符合大文件管理要求。 */
async function usesLfs(filePath) {
  const output = await runGit(['check-attr', 'filter', '--', filePath]);
  return output.trim().endsWith(': lfs');
}

/** 判断已跟踪文件在 Git 索引中是否已经转换为 LFS 指针。 */
async function indexUsesLfsPointer(filePath) {
  try {
    const size = Number.parseInt(await runGit(['cat-file', '-s', `:${filePath}`]), 10);
    if (!Number.isFinite(size) || size > 1024) return false;

    const content = await runGit(['cat-file', '-p', `:${filePath}`]);
    return content.startsWith('version https://git-lfs.github.com/spec/v1\n');
  } catch (error) {
    if (error.code === 128) return null;
    throw error;
  }
}

/** 主流程：大于阈值的文件必须匹配 Git LFS 规则。 */
async function main() {
  if (!Number.isFinite(limitMb) || limitMb <= 0) {
    throw new Error('LARGE_FILE_LIMIT_MB 必须是大于 0 的数字。');
  }

  const oversizedFiles = [];
  for (const filePath of await listCandidateFiles()) {
    const absolutePath = path.join(repoRoot, filePath);
    let stat;
    try {
      stat = await fs.stat(absolutePath);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }

    if (stat.isFile() && stat.size >= limitBytes) {
      const managed = await usesLfs(filePath);
      oversizedFiles.push({
        filePath,
        sizeMb: stat.size / 1024 / 1024,
        managed,
        normalized: managed ? await indexUsesLfsPointer(filePath) : false,
      });
    }
  }

  const failures = oversizedFiles.filter(({ managed, normalized }) => !managed || normalized === false);
  if (failures.length > 0) {
    console.error(`发现 ${failures.length} 个 Git LFS 配置不完整的大文件（阈值 ${limitMb} MiB）：`);
    for (const { filePath, sizeMb, managed } of failures) {
      const reason = managed ? '索引中仍是原始二进制内容' : '未匹配 LFS 规则';
      console.error(`- ${filePath}（${sizeMb.toFixed(2)} MiB，${reason}）`);
    }
    console.error('请补充 .gitattributes 规则，并执行 git add --renormalize <文件>。');
    process.exitCode = 1;
    return;
  }

  console.log(`大文件检查通过：${oversizedFiles.length} 个文件由 Git LFS 管理（阈值 ${limitMb} MiB）。`);
}

main().catch((error) => {
  console.error(`大文件检查失败：${error.message}`);
  process.exitCode = 1;
});
