# Web-Presentation-site

`Web-Presentation-site` 是 `Web-Presentation` 的独立项目主页与文档站。站点使用 VitePress 构建，默认从同级目录 `../Web-Presentation` 自动同步项目文档。

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

## 案例模板目录链路

将模板包解压到 `site/showcases/<name>/`，目录内容需要进入 Git；同步脚本会在 `site/.generated/` 中重新生成供用户下载的 `<name>.wptemplate.zip`。生成目录和 `site/.vitepress/dist/` 都不提交。

本地开发链路：

```powershell
pnpm run sync:docs
pnpm run dev
pnpm run build
```

`pnpm run sync:docs` 会解析 `site/showcases/*/`，生成案例列表、详情页、截图资源和下载文件到 `site/.generated/`。案例 URL 的 slug 来自案例目录名，目录命名应保持稳定。

解析规则：

- `project/project.json` 是案例展示主数据源，读取 `name`、`page_width`、`page_height`、`base_font_size`、`style_spec_markdown`，并辅助读取 `description`、`theme_key`、`menu_mode`。
- `project/routes.json` 提供页面顺序，脚本递归展开 `routes`，只取 `route_type === "page"` 且存在 `source_page_code` 的路由。
- `metadata/screenshots.json` 只提供截图路径、标题和尺寸；截图按路由顺序匹配，路由引用页面缺截图会同步失败，路由外截图放到末尾。
- `manifest.json` 校验包类型、schema、必要路径字段和计数字段，并读取 `themes[].name` 用于案例详情展示。
- `metadata/template.json` 只校验存在且为对象，不作为主要展示数据源。
- 可在案例目录根部添加 `showcase.json` 补充站点展示字段；该文件不会写入下载包。

Git 提交时提交 `site/showcases/<name>/` 下的模板源文件、解析脚本和页面样式改动；不要提交构建生成的 `.wptemplate.zip`、`site/.generated/` 或 `site/.vitepress/dist/`。

## 环境变量

| 变量 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `SOURCE_REPO_PATH` | `../Web-Presentation` | 本地或 CI 中的源项目路径 |
| `SOURCE_REPO` | `LLMxPM/Web-Presentation` | GitHub Actions 拉取的源仓库 |
| `SOURCE_REF` | `main` | GitHub Actions 拉取的源分支 |
| `SITE_BASE` | `/web-presentation-site/` | GitHub Pages 站点 base |

## 发布

GitHub Pages 通过 `.github/workflows/pages.yml` 发布。workflow 在 `master` push、手动触发和每天定时任务时执行：checkout 站点仓库和源文档仓库，安装依赖，运行 `pnpm run sync:docs` 解析案例目录、生成下载包并同步文档，再运行 `pnpm run build` 生成 `site/.vitepress/dist` 并上传到 Pages。
