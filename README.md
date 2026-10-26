# Web-Presentation-site

`Web-Presentation-site` 是 [web-presentation](https://github.com/LLMxPM/web-presentation) 的独立项目主页、案例展示中心与文档站。

- 线上主站：[https://presentation.inputloom.com/](https://presentation.inputloom.com/)
- GitHub Pages 镜像：[https://wp.llmxpm.com/](https://wp.llmxpm.com/)
- 主平台仓库：[web-presentation](https://github.com/LLMxPM/web-presentation)
- 外部 Agent 接入仓库：[web-presentation-cli](https://github.com/LLMxPM/web-presentation-cli)

站点使用 VitePress 构建。Markdown 文档由同步脚本从同级主仓（`../web-presentation`）读取；案例展示数据来自 `site/showcases/<slug>/showcase.json`，在导入阶段一次性解析完成，构建阶段不再扫描模板源码，也不再重新压缩下载包。

## 本地使用

```powershell
pnpm install
pnpm run sync:docs
pnpm run check:links
pnpm run check:assets
pnpm run build
pnpm run preview
```

开发预览：

```powershell
pnpm run dev
```

## 案例数据链路

案例分三层存放，职责互不重叠：

| 位置 | 内容 | 是否提交 |
| :--- | :--- | :--- |
| `site/showcases/<slug>/` | 模板源码、`showcase.json` | 提交 |
| `site/public/showcases/<slug>/` | `cover.<ext>`、`template.wptemplate.zip` | 提交（Git LFS） |
| `site/public/previews/<slug>/` | 构建产物：`index.html` + `assets/` | 提交（Git LFS） |

`showcase.json` 是构建期唯一数据源，包含：

- 人工维护字段：`title`、`summary`、`category`（自由文本）、`tags`、`featured`、`sortOrder`、`hidden`
- 导入期解析字段：`meta`（页数、画布尺寸、画幅、主题、资源类型、底色等）、`styleSpecMarkdown`、`template.sourceProjectCode`
- 资源引用：`cover.file`、`template.file`、`preview.available` / `preview.entry`

`slug` 来自目录名，首次创建后固定；改标题不会改变链接。

## 本地管理页

```powershell
pnpm run manage:showcases
```

打开 `http://127.0.0.1:4173/`。服务只监听回环地址，不挂到公开站点，也不参与线上构建。

页面分三块：

1. **案例列表**：封面、标题、分类、标签、是否可预览、体积；支持搜索和拖动排序。
2. **展示设置**：标题、摘要、分类（自由文本，已有分类作为输入建议）、多选标签、精选、隐藏、主图替换、构建产物导入。
3. **导入区**：上传模板 ZIP，暂存解析后展示文件名、体积和解析结果，确认后才写入正式目录。

导入流程采用「暂存 → 校验 → 整体替换」：解析内容先落在 `site/.manage-staging/`，只有确认提交时才覆盖目标目录。删除操作会把目录移入 `site/.manage-trash/`，可手工恢复。

## 导入顺序与约定

模板包导入：

1. 校验 `manifest.json`、`metadata/template.json`、`metadata/screenshots.json`、`project/project.json`、`project/routes.json`。
2. 解析标题、摘要、页数、尺寸、主题、资源类型，预填表单。
3. 从 `metadata/screenshots.json` 的 `cover`（缺失时取第一张页面截图）生成唯一主图。
4. 模板源码解压到 `site/showcases/<slug>/`，原始 ZIP 保存为 `template.wptemplate.zip`，写入 `showcase.json`。

> 下载包保存的是导入时的原始 ZIP，构建阶段不会再重新压缩。改动 `site/showcases/<slug>/` 里的模板源码后，需要重新导入一次才会更新下载内容；只改标题、分类、标签这类展示字段则不用重新导入。

构建产物导入：

1. 校验 ZIP 根目录（或唯一顶层目录）存在 `index.html`。
2. 拦截绝对资源路径与后端预览地址，这类产物必须用 `base_url: './'` 重新构建。
3. 解压到 `site/public/previews/<slug>/`，整体替换会清掉旧的哈希资源。

主仓构建产物使用 hash 路由 + 相对资源路径，因此可以放在任意子路径；详情页通过 `withBase()` 生成 `/previews/<slug>/index.html`，同时适配 GitHub Pages 子路径和腾讯云根路径。

## 手工维护

不走管理页时，改动这几个文件即可：

```text
site/showcases/<slug>/showcase.json          # 展示字段
site/public/showcases/<slug>/cover.png       # 主图
site/public/showcases/<slug>/template.wptemplate.zip
site/public/previews/<slug>/index.html       # 可选构建产物
```

改完执行 `pnpm run sync:docs` 重新生成 VitePress 数据。缺失资源只在构建期输出提示并把对应入口降级（隐藏预览或下载按钮），不会中断整站发布。

## 大文件管理

仓库使用 Git LFS 管理视频、音频、压缩包、PDF、演示文稿，以及案例主图、模板包和构建产物，具体规则见 `.gitattributes`。开发环境首次拉取前需安装并初始化 Git LFS：

```powershell
git lfs install
git lfs pull
```

`pnpm run check:assets` 会检查已跟踪文件及未忽略的新文件。默认情况下，5 MiB 及以上的文件必须匹配 Git LFS 规则；临时调整阈值可设置 `LARGE_FILE_LIMIT_MB`。新增其他类型的大文件时，应先补充 `.gitattributes`，再执行：

```powershell
git add --renormalize <文件路径>
git lfs ls-files
pnpm run check:assets
```

Git LFS 只优化后续提交，已经进入历史的二进制对象仍会保留。若需要缩小完整克隆体积，可在团队协调停写和强推窗口后另行执行 `git lfs migrate import`；该操作会重写提交历史，不应在日常开发中直接运行。

## 环境变量

| 变量 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `SOURCE_REPO_PATH` | `../Web-Presentation` | 本地或 CI 中的源项目路径 |
| `SOURCE_REPO` | `LLMxPM/Web-Presentation` | GitHub Actions 拉取的源仓库 |
| `SOURCE_REF` | `main` | GitHub Actions 拉取的源分支 |
| `SITE_BASE` | `/web-presentation-site/` | 站点 base；GitHub Pages 用子路径，腾讯云根路径部署时设为 `/` |
| `MANAGE_PORT` | `4173` | 本地案例管理服务端口 |

## 发布

GitHub Pages 通过 `.github/workflows/pages.yml` 发布。workflow 在 `master` push、手动触发和每日定时任务时执行：checkout 站点仓库和源文档仓库，安装依赖，运行 `pnpm run sync:docs` 读取案例数据并同步文档，再运行 `pnpm run build` 生成 `site/.vitepress/dist` 并上传到 Pages。

构建阶段只读取 `showcase.json` 并复制 `site/public/` 下的静态资源，不解析模板包、不重新压缩 ZIP。
