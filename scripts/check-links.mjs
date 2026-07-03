/**
 * 文件功能：检查 web-presentation 源文档中的本地 Markdown 链接和资源引用。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  collectMarkdownLinks,
  isExternalHref,
  listFiles,
  pathExists,
  resolveSourceRoot,
  safeDecodePathname,
  splitHref,
  toPosix,
} from './shared/site-utils.mjs';

/** 判断本地链接目标是否存在；目录链接允许 README.md 或 index.md 作为入口。 */
async function localTargetExists(targetPath) {
  if (await pathExists(targetPath)) {
    const stat = await fs.stat(targetPath);
    if (stat.isDirectory()) {
      return (await pathExists(path.join(targetPath, 'README.md'))) || (await pathExists(path.join(targetPath, 'index.md')));
    }
    return true;
  }

  return false;
}

/** 从单篇 Markdown 文档中检查所有本地链接，输出失败列表。 */
async function checkMarkdownFile(filePath, sourceRoot) {
  const content = await fs.readFile(filePath, 'utf8');
  const failures = [];

  for (const { href, line } of collectMarkdownLinks(content)) {
    if (!href || href.startsWith('#') || isExternalHref(href)) {
      continue;
    }

    const { pathname } = splitHref(href);
    if (!pathname) {
      continue;
    }

    const targetPath = path.resolve(path.dirname(filePath), safeDecodePathname(pathname));
    if (!(await localTargetExists(targetPath))) {
      failures.push({
        file: toPosix(path.relative(sourceRoot, filePath)),
        line,
        href,
        target: toPosix(path.relative(sourceRoot, targetPath)),
      });
    }
  }

  return failures;
}

/** 主流程：扫描 README 与 docs 下的 Markdown，发现断链时返回非 0 退出码。 */
async function main() {
  const sourceRoot = resolveSourceRoot();
  const docsFiles = (await listFiles(path.join(sourceRoot, 'docs')))
    .filter((filePath) => filePath.toLowerCase().endsWith('.md'));
  const markdownFiles = [path.join(sourceRoot, 'README.md'), ...docsFiles];
  const allFailures = [];

  for (const filePath of markdownFiles) {
    allFailures.push(...await checkMarkdownFile(filePath, sourceRoot));
  }

  if (allFailures.length === 0) {
    console.log(`链接检查通过：${markdownFiles.length} 篇 Markdown。`);
    return;
  }

  console.error(`发现 ${allFailures.length} 个本地断链：`);
  for (const failure of allFailures) {
    console.error(`- ${failure.file}:${failure.line} -> ${failure.href}（目标：${failure.target}）`);
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
