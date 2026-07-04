# AGENTS.md instructions

## 项目概述

`Web-Presentation-site` 是 `Web-Presentation` 的独立项目主页与文档站，使用 VitePress 构建。站点本身维护展示页面、案例模板包解析逻辑和发布配置；主要文档内容默认从同级目录 `../Web-Presentation` 同步生成。

协作、说明文档和代码注释优先使用中文。

## 项目结构

* `package.json`：项目脚本、pnpm 版本和前端依赖声明。
* `pnpm-workspace.yaml`：单包 pnpm workspace 配置。
* `site/.vitepress/config.mts`：VitePress 配置，包含站点 base、导航、侧边栏、搜索和主题配置。
* `site/.vitepress/theme/`：自定义 VitePress 主题扩展、Vue 组件和样式。
  * `components/`：首页、案例列表、案例卡片、案例详情等 Vue 组件。
  * `custom.css`、`showcase.css`：站点全局样式与案例展示样式。
* `site/public/`：站点自有静态资源，执行同步脚本后会复制到 `site/.generated/public/`。
* `site/showcases/`：案例模板包目录，提交 `.wptemplate.zip` 文件；可配合同名 `.showcase.json` 补充站点展示字段。
* `scripts/`：Node.js ESM 脚本入口。
  * `sync-docs.mjs`：同步源仓文档、解析案例模板包、生成 VitePress 页面与数据。
  * `check-links.mjs`：检查源仓 README 和 docs 下 Markdown 的本地链接。
  * `shared/`：同步、渲染、ZIP 读取、路径与 Markdown 工具函数。
* `site/.generated/`：由 `pnpm run sync:docs` 生成的 VitePress 源目录，不提交。
* `site/.vitepress/dist/`、`site/.vitepress/cache/`：构建和缓存产物，不提交。
* `.github/workflows/pages.yml`：GitHub Pages 发布流水线。

## 技术栈

* 包管理：pnpm，项目声明版本为 `pnpm@10.30.3`。
* 运行环境：Node.js；CI 使用 Node 22。
* 站点框架：VitePress `1.6.4`。
* 前端组件：Vue SFC，由 VitePress 主题系统注册。
* 脚本模块：Node.js ESM，使用 `.mjs` 和原生 `node:` 模块。
* 类型检查配置：TypeScript 严格模式，目标为 ES2022，模块解析使用 Bundler。
* 发布目标：GitHub Pages，默认 `SITE_BASE=/web-presentation-site/`。

## 常用命令

```powershell
pnpm install
pnpm run sync:docs
pnpm run check:links
pnpm run build
pnpm run preview
pnpm run dev
```

说明：

* `pnpm run dev` 和 `pnpm run build` 都会先执行 `sync:docs`。
* `sync:docs` 默认读取 `../Web-Presentation`，也可以通过 `SOURCE_REPO_PATH` 指定源项目路径。
* 项目通常已经启动，不要反复启动开发服务；需要确认时先检查现有终端或端口状态。
* 修改同步脚本、VitePress 配置、主题组件或案例包后，优先运行 `pnpm run build` 验证。
* 修改源文档链接规则或同步逻辑时，补充运行 `pnpm run check:links`。

## 文档与生成链路约定

* 不直接编辑 `site/.generated/` 下的文件；它们会在下次 `sync:docs` 时被清空并重建。
* 文档页面来自源仓 `README.md` 和 `docs/**/*.md`，站点脚本会重写可承载的内部 Markdown 链接。
* `site/.vitepress/config.mts` 从 `site/.generated/vitepress-data` 导入导航和侧边栏，因此本地开发或构建前必须先完成同步。
* 缺失的源仓文档或资源会由同步脚本生成临时占位，用于避免站点发布后出现 404；根因仍应在源仓补齐。
* 站点自有静态资源放在 `site/public/`，不要直接放入生成目录。

## 案例模板包约定

* 案例模板包直接放在 `site/showcases/<name>.wptemplate.zip`，需要进入 Git。
* 案例 URL slug 由 ZIP 文件名去掉 `.wptemplate.zip` 后生成，命名应稳定，避免无意义改名导致链接变化。
* ZIP 包必须包含脚本校验需要的关键文件：
  * `manifest.json`
  * `metadata/template.json`
  * `metadata/screenshots.json`
  * `project/project.json`
  * `project/routes.json`
* 案例展示主数据来自 `project/project.json`，截图顺序优先按 `project/routes.json` 的页面路由匹配。
* 如需补充展示标题、摘要、分类、排序或精选状态，使用同名 `*.showcase.json`，不要改生成后的数据文件。

## 代码约定

* 每个源代码文件开头应包含文件功能描述，Markdown 文件除外。
* 函数应补充中文注释，优先解释职责、输入输出和关键约束。
* 单个代码文件行数过多或职责复杂时，应拆分到 `scripts/shared/`、主题组件或样式模块中。
* 继续沿用现有代码风格：ESM import/export、单引号、分号、显式错误信息使用中文。
* 路径处理优先使用 `node:path`，面向 URL、VitePress 或 ZIP 内路径时统一转为 POSIX 分隔符。
* 解析 Markdown、ZIP、JSON 等结构化内容时优先复用现有工具函数，不做脆弱的临时字符串拼接。
* Vue 组件应保持展示逻辑清晰，通用卡片和页面级组件分开维护。
* 样式改动优先放在 `custom.css` 或 `showcase.css` 的对应区域，避免无关视觉重构。

## Git 与发布约定

* 提交源码、配置、脚本、样式、静态资源和 `site/showcases/*.wptemplate.zip`。
* 不提交 `node_modules/`、`.source/`、`site/.generated/`、`site/.vitepress/cache/`、`site/.vitepress/dist/`、日志文件等产物。
* GitHub Pages workflow 在 `master` push、手动触发和每日定时任务时构建发布。
* CI 会 checkout 当前站点仓库和 `Web-Presentation` 源仓，安装依赖后依次执行 `sync:docs`、`check:links`、`build`，最后上传 `site/.vitepress/dist`。
* workflow 中 `check:links` 当前允许失败；本地修复链接问题时仍应尽量让它通过。
