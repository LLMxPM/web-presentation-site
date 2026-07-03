# web-presentation-site

`web-presentation-site` 是 `web-presentation` 的独立项目主页与文档站。站点使用 VitePress 构建，默认从同级目录 `../web-presentation` 自动同步项目文档。

## 本地使用

```powershell
pnpm install
pnpm run sync:docs
pnpm run check:links
pnpm run build
pnpm run preview
```

开发预览：

```powershell
pnpm run dev
```

## 环境变量

| 变量 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `SOURCE_REPO_PATH` | `../web-presentation` | 本地或 CI 中的源项目路径 |
| `SOURCE_REPO` | `LLMxPM/web-presentation` | GitHub Actions 拉取的源仓库 |
| `SOURCE_REF` | `main` | GitHub Actions 拉取的源分支 |
| `SITE_BASE` | `/web-presentation-site/` | GitHub Pages 站点 base |

## 发布

GitHub Pages 通过 `.github/workflows/pages.yml` 发布。workflow 支持手动触发，也会每天定时拉取 `LLMxPM/web-presentation@main` 的最新文档重新构建。
