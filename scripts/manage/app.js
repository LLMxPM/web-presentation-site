/**
 * 文件功能：本地案例管理页的交互逻辑。
 *
 * 只消费 /api/state 提供的聚合状态，写操作统一走 /api/*，不直接操作文件系统。
 * 所有用户输入通过 textContent 渲染，避免注入。
 */
const state = {
  showcases: [],
  taxonomy: { categories: [], tagGroups: [] },
  problems: [],
  paths: {},
  selectedSlug: null,
  draft: null,
  original: null,
  dragSlug: null,
};

const dom = {
  list: document.getElementById('case-list'),
  listHint: document.getElementById('list-hint'),
  problems: document.getElementById('problem-list'),
  statCount: document.getElementById('stat-count'),
  search: document.getElementById('search'),
  editorForm: document.getElementById('editor-form'),
  editorTitle: document.getElementById('editor-title'),
  editorEmpty: document.getElementById('editor-empty'),
  categoryInput: document.getElementById('category-input'),
  categoryOptions: document.getElementById('category-options'),
  tagGroups: document.getElementById('tag-groups'),
  tagInput: document.getElementById('tag-input'),
  coverPreview: document.getElementById('cover-preview'),
  coverMeta: document.getElementById('cover-meta'),
  previewStatus: document.getElementById('preview-status'),
  previewOpen: document.getElementById('preview-open'),
  readonlyGrid: document.getElementById('readonly-grid'),
  dirtyFlag: document.getElementById('dirty-flag'),
  saveResult: document.getElementById('save-result'),
  templateStage: document.getElementById('template-stage'),
  pathList: document.getElementById('path-list'),
  toast: document.getElementById('toast'),
};

/**
 * 统一请求封装；非 2xx 直接抛出后端错误文案。
 *
 * 恒定带上自定义请求头：服务端据此拒绝跨源页面发起的写操作。
 */
async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'X-Manage-Request': '1', ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `请求失败：${response.status}`);
  }
  return payload;
}

/** 拉取全量状态并重绘。 */
async function refresh() {
  const next = await api('/api/state');
  state.showcases = next.showcases;
  state.taxonomy = next.taxonomy;
  state.problems = next.problems;
  state.paths = next.paths;
  dom.statCount.textContent = `${next.visibleCount} / ${next.showcases.length} 个展示中`;
  renderList();
  renderPaths();
  renderProblems();
}

/** 渲染案例卡片列表。 */
function renderList() {
  const keyword = dom.search.value.trim().toLowerCase();
  const items = state.showcases.filter((item) => {
    if (!keyword) {
      return true;
    }
    return [item.title, item.slug, item.category, ...item.tags].join(' ').toLowerCase().includes(keyword);
  });

  dom.list.textContent = '';
  for (const item of items) {
    dom.list.append(buildCard(item));
  }

  dom.listHint.textContent = items.length === 0
    ? '没有匹配的案例。也可以直接在右侧导入新的模板包。'
    : '拖动卡片可调整展示顺序。';
}

/** 构建单张案例卡片，含拖拽排序与选中态。 */
function buildCard(item) {
  const card = document.createElement('article');
  card.className = 'case-card';
  card.draggable = true;
  card.dataset.slug = item.slug;
  if (item.slug === state.selectedSlug) {
    card.classList.add('is-active');
  }
  if (item.hidden) {
    card.classList.add('is-hidden');
  }

  const image = document.createElement('img');
  image.className = 'case-thumb';
  image.alt = '';
  if (item.coverFile) {
    image.src = `/public/showcases/${encodeURIComponent(item.slug)}/${encodeURIComponent(item.coverFile)}`;
  }
  card.append(image);

  const body = document.createElement('div');
  body.className = 'case-body';

  const title = document.createElement('div');
  title.className = 'case-title';
  title.textContent = item.title;
  body.append(title);

  const sub = document.createElement('div');
  sub.className = 'case-sub';
  sub.textContent = [item.category, item.pageCount ? `${item.pageCount} 页` : '', item.aspectRatio]
    .filter(Boolean)
    .join(' · ');
  body.append(sub);

  const flags = document.createElement('div');
  flags.className = 'case-flags';
  if (item.featured) {
    flags.append(makeBadge('精选', 'badge-accent'));
  }
  if (item.hasPreview) {
    flags.append(makeBadge('可预览', 'badge-accent'));
  }
  if (item.hidden) {
    flags.append(makeBadge('隐藏', 'badge-warn'));
  }
  for (const tag of item.tags.slice(0, 3)) {
    flags.append(makeBadge(tag));
  }
  if (flags.childElementCount > 0) {
    body.append(flags);
  }
  card.append(body);

  const size = document.createElement('div');
  size.className = 'case-size';
  size.textContent = formatBytes((item.coverBytes || 0) + (item.packageBytes || 0) + (item.previewBytes || 0));
  card.append(size);

  card.addEventListener('click', () => selectShowcase(item.slug));
  card.addEventListener('dragstart', () => {
    state.dragSlug = item.slug;
    card.classList.add('dragging');
  });
  card.addEventListener('dragend', () => {
    state.dragSlug = null;
    card.classList.remove('dragging');
  });
  card.addEventListener('dragover', (event) => event.preventDefault());
  card.addEventListener('drop', async (event) => {
    event.preventDefault();
    if (!state.dragSlug || state.dragSlug === item.slug) {
      return;
    }
    await moveShowcase(state.dragSlug, item.slug);
  });

  return card;
}

/** 创建徽标元素。 */
function makeBadge(text, className = 'badge') {
  const badge = document.createElement('span');
  badge.className = className;
  badge.textContent = text;
  return badge;
}

/** 拖拽结束后把被拖动的案例移动到目标位置并保存顺序。 */
async function moveShowcase(dragSlug, targetSlug) {
  const order = state.showcases.map((item) => item.slug);
  const from = order.indexOf(dragSlug);
  const to = order.indexOf(targetSlug);
  if (from < 0 || to < 0) {
    return;
  }

  order.splice(from, 1);
  order.splice(to, 0, dragSlug);

  try {
    await api('/api/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: order }),
    });
    await refresh();
    toast('顺序已保存');
  } catch (error) {
    toast(error.message, true);
  }
}

/** 选中案例，初始化编辑草稿。 */
async function selectShowcase(slug) {
  const source = state.showcases.find((item) => item.slug === slug);
  if (!source) {
    return;
  }

  state.selectedSlug = slug;
  state.draft = {
    title: source.title,
    summary: source.summary,
    category: source.category,
    tags: [...source.tags],
    featured: source.featured,
    hidden: source.hidden,
  };
  state.original = JSON.stringify(state.draft);

  renderList();
  renderEditor(source);
}

/** 渲染编辑面板。 */
function renderEditor(item) {
  dom.editorEmpty.hidden = true;
  dom.editorForm.hidden = false;
  dom.editorTitle.textContent = item.title;
  dom.editorForm.elements.title.value = state.draft.title;
  dom.editorForm.elements.summary.value = state.draft.summary;
  dom.editorForm.elements.featured.checked = state.draft.featured;
  dom.editorForm.elements.hidden.checked = state.draft.hidden;

  dom.categoryInput.value = state.draft.category;
  renderCategoryOptions();

  renderTagGroups();
  renderCover(item);
  renderPreview(item);
  renderReadonly(item);
  updateDirtyFlag();
  dom.saveResult.hidden = true;
}

/** 渲染标签选择区，词表按分组展示，选中项高亮。 */
function renderTagGroups() {
  dom.tagGroups.textContent = '';
  const vocabulary = new Set(state.taxonomy.tagGroups.flatMap((group) => group.tags));

  for (const group of state.taxonomy.tagGroups) {
    const row = document.createElement('div');
    row.className = 'tag-group';

    const name = document.createElement('span');
    name.className = 'tag-group-name';
    name.textContent = group.name;
    row.append(name);

    for (const tag of group.tags) {
      row.append(buildTagChip(tag));
    }
    dom.tagGroups.append(row);
  }

  const extras = state.draft?.tags.filter((tag) => !vocabulary.has(tag)) || [];
  if (extras.length > 0) {
    const row = document.createElement('div');
    row.className = 'tag-group';
    const name = document.createElement('span');
    name.className = 'tag-group-name';
    name.textContent = '其他';
    row.append(name);
    for (const tag of extras) {
      row.append(buildTagChip(tag));
    }
    dom.tagGroups.append(row);
  }
}

/** 单个标签按钮，点击切换选中状态。 */
function buildTagChip(tag) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'tag-chip';
  chip.textContent = tag;
  if (state.draft.tags.includes(tag)) {
    chip.classList.add('is-on');
  }
  chip.addEventListener('click', () => {
    const index = state.draft.tags.indexOf(tag);
    if (index >= 0) {
      state.draft.tags.splice(index, 1);
    } else {
      state.draft.tags.push(tag);
    }
    renderTagGroups();
    updateDirtyFlag();
  });
  return chip;
}

/** 把现有案例的分类去重后写入 datalist，作为自由文本输入的建议项。 */
function renderCategoryOptions() {
  const categories = [...new Set(state.showcases.map((item) => item.category).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'zh-CN'));

  dom.categoryOptions.textContent = '';
  for (const name of categories) {
    const option = document.createElement('option');
    option.value = name;
    dom.categoryOptions.append(option);
  }
}

/** 渲染主图预览与体积。 */
function renderCover(item) {
  if (item.coverFile) {
    dom.coverPreview.src = `/public/showcases/${encodeURIComponent(item.slug)}/${encodeURIComponent(item.coverFile)}`;
    dom.coverPreview.hidden = false;
  } else {
    dom.coverPreview.removeAttribute('src');
  }
  dom.coverMeta.textContent = item.coverBytes
    ? `${item.coverFile} · ${formatBytes(item.coverBytes)}`
    : '尚未设置主图';
}

/** 渲染构建产物状态。 */
function renderPreview(item) {
  dom.previewStatus.textContent = item.hasPreview
    ? `已导入 ${formatBytes(item.previewBytes)}，入口 /previews/${item.slug}/index.html`
    : '尚未导入构建产物，详情页会隐藏“在线预览”。';

  if (item.hasPreview) {
    dom.previewOpen.hidden = false;
    dom.previewOpen.href = `/public/previews/${encodeURIComponent(item.slug)}/index.html`;
  } else {
    dom.previewOpen.hidden = true;
    dom.previewOpen.removeAttribute('href');
  }
}

/** 渲染只读的解析结果，说明这些值来自模板而不是手填。 */
function renderReadonly(item) {
  const rows = [
    ['页数', item.pageCount ? `${item.pageCount} 页` : '未标注'],
    ['画幅', item.aspectRatio || '未标注'],
    ['尺寸', item.pageWidth && item.pageHeight ? `${item.pageWidth} x ${item.pageHeight}` : '未标注'],
    ['主题', item.themeNames[0] || '未标注'],
    ['更新', formatDate(item.updatedAt)],
    ['项目编码', item.sourceProjectCode || '未标注'],
  ];

  dom.readonlyGrid.textContent = '';
  for (const [label, value] of rows) {
    const wrapper = document.createElement('dl');
    wrapper.className = 'readonly-item';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    wrapper.append(dt, dd);
    dom.readonlyGrid.append(wrapper);
  }
}

/** 编辑内容与原始值不同时提示未保存。 */
function updateDirtyFlag() {
  const dirty = state.draft && JSON.stringify(state.draft) !== state.original;
  dom.dirtyFlag.hidden = !dirty;
}

/** 保存展示字段。 */
async function saveEditor(event) {
  event.preventDefault();
  if (!state.selectedSlug) {
    return;
  }

  state.draft.title = dom.editorForm.elements.title.value.trim();
  state.draft.summary = dom.editorForm.elements.summary.value.trim();
  state.draft.category = dom.categoryInput.value.trim();
  state.draft.featured = dom.editorForm.elements.featured.checked;
  state.draft.hidden = dom.editorForm.elements.hidden.checked;

  try {
    await api('/api/showcase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: state.selectedSlug, patch: state.draft }),
    });
    state.original = JSON.stringify(state.draft);
    updateDirtyFlag();
    showResult('已保存 showcase.json，运行同步后公开页生效。');
    await refresh();
  } catch (error) {
    showResult(error.message, true);
  }
}

/** 在保存区显示结果文案。 */
function showResult(message, isError = false) {
  dom.saveResult.hidden = false;
  dom.saveResult.textContent = message;
  dom.saveResult.classList.toggle('is-error', isError);
}

/** 上传主图并刷新。 */
async function uploadCover(file) {
  if (!file || !state.selectedSlug) {
    return;
  }

  try {
    await api(`/api/cover?slug=${encodeURIComponent(state.selectedSlug)}&filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
    await refresh();
    const item = state.showcases.find((entry) => entry.slug === state.selectedSlug);
    if (item) {
      renderCover(item);
    }
    toast('主图已更新');
  } catch (error) {
    toast(error.message, true);
  }
}

/** 上传构建产物：先暂存展示清单，确认后再提交。 */
async function stageBuild(file) {
  if (!file || !state.selectedSlug) {
    return;
  }

  dom.previewStatus.textContent = '正在解析构建产物…';
  try {
    const staged = await api(`/api/import/build?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
    const warningText = staged.warnings.length > 0 ? `\n提示：${staged.warnings.join('；')}` : '';
    const confirmed = window.confirm(
      `构建产物解析成功\n文件 ${staged.fileCount} 个，共 ${formatBytes(staged.totalBytes)}\n入口 ${staged.entry}${warningText}\n\n确认替换当前预览产物？`,
    );
    if (!confirmed) {
      dom.previewStatus.textContent = '已取消，未写入任何文件。';
      return;
    }

    await api('/api/import/build/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: staged.token, slug: state.selectedSlug }),
    });
    await refresh();
    const item = state.showcases.find((entry) => entry.slug === state.selectedSlug);
    if (item) {
      renderPreview(item);
    }
    toast('构建产物已导入');
  } catch (error) {
    dom.previewStatus.textContent = '导入失败，原有产物未被修改。';
    toast(error.message, true);
  }
}

/** 上传模板包：暂存后展示解析结果，确认才写入正式目录。 */
async function stageTemplate(file) {
  if (!file) {
    return;
  }

  dom.templateStage.hidden = false;
  dom.templateStage.textContent = '正在解析模板包…';

  try {
    const staged = await api(`/api/import/template?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
    renderTemplateStage(staged);
  } catch (error) {
    dom.templateStage.textContent = '';
    const message = document.createElement('div');
    message.className = 'problem is-error';
    message.textContent = error.message;
    dom.templateStage.append(message);
  }
}

/** 渲染模板导入确认表单。 */
function renderTemplateStage(staged) {
  dom.templateStage.textContent = '';

  const summary = document.createElement('div');
  summary.textContent = `解析成功：${staged.fileCount} 个文件，共 ${formatBytes(staged.totalBytes)}`;
  dom.templateStage.append(summary);

  const list = document.createElement('div');
  list.className = 'stage-list';
  for (const item of staged.files) {
    const row = document.createElement('div');
    row.textContent = `${formatBytes(item.size)}  ${item.name}`;
    list.append(row);
  }
  dom.templateStage.append(list);

  const form = document.createElement('div');
  form.className = 'stage';

  const slugInput = document.createElement('input');
  slugInput.type = 'text';
  slugInput.value = suggestSlug(staged.parsed.title);
  slugInput.placeholder = '目录名（固定后不要改）';
  form.append(labeled('目录名 slug', slugInput));

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = staged.parsed.title;
  form.append(labeled('标题', titleInput));

  const summaryInput = document.createElement('textarea');
  summaryInput.rows = 2;
  summaryInput.value = staged.parsed.summary;
  form.append(labeled('摘要', summaryInput));

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.setAttribute('list', 'category-options');
  categoryInput.placeholder = '输入分类，或从已有分类中选择';
  categoryInput.value = '';
  form.append(labeled('分类', categoryInput));

  const actions = document.createElement('div');
  actions.className = 'stage-actions';

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className = 'btn btn-primary btn-mini';
  confirmButton.textContent = '确认导入';
  confirmButton.addEventListener('click', async () => {
    const slug = slugInput.value.trim();
    if (!slug) {
      toast('请填写目录名', true);
      return;
    }
    if (state.showcases.some((item) => item.slug === slug)) {
      if (!window.confirm(`案例 ${slug} 已存在，继续会覆盖模板源码、下载包和主图。确定覆盖？`)) {
        return;
      }
    }

    confirmButton.disabled = true;
    try {
      const result = await api('/api/import/template/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: staged.token,
          slug,
          fields: {
            title: titleInput.value,
            summary: summaryInput.value,
            category: categoryInput.value.trim(),
          },
        }),
      });
      dom.templateStage.hidden = true;
      document.getElementById('template-input').value = '';
      await refresh();
      await selectShowcase(result.slug);
      toast('模板已导入，可以继续上传构建产物');
    } catch (error) {
      toast(error.message, true);
      confirmButton.disabled = false;
    }
  });

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'btn btn-mini';
  cancelButton.textContent = '取消';
  cancelButton.addEventListener('click', () => {
    dom.templateStage.hidden = true;
    document.getElementById('template-input').value = '';
  });

  actions.append(confirmButton, cancelButton);
  form.append(actions);
  dom.templateStage.append(form);
}

/** 生成表单行：标签 + 控件。 */
function labeled(text, control) {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';
  const span = document.createElement('span');
  span.textContent = text;
  wrapper.append(span, control);
  return wrapper;
}

/** 从标题粗略推导 slug；中文标题保留中文，仅去掉标点空格。 */
function suggestSlug(title) {
  return String(title || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 40);
}

/** 渲染目录说明。 */
function renderPaths() {
  const labels = {
    showcases: '模板源码',
    publicShowcases: '主图与下载包',
    previews: '构建产物',
    taxonomy: '标签词表',
  };

  dom.pathList.textContent = '';
  for (const [key, label] of Object.entries(labels)) {
    if (!state.paths[key]) {
      continue;
    }
    const item = document.createElement('dl');
    item.className = 'path-item';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = state.paths[key];
    item.append(dt, dd);
    dom.pathList.append(item);
  }
}

/** 渲染构建期发现的问题，资源缺失只会降级，不会中断发布。 */
function renderProblems() {
  dom.problems.textContent = '';
  for (const problem of state.problems) {
    const item = document.createElement('div');
    item.className = `problem${problem.level === 'error' ? ' is-error' : ''}`;
    item.textContent = `${problem.slug}：${problem.message}`;
    dom.problems.append(item);
  }
}

/** 触发一次站点同步。 */
async function runSync() {
  const button = document.getElementById('btn-sync');
  button.disabled = true;
  try {
    const result = await api('/api/sync', { method: 'POST' });
    toast(result.ok ? '站点数据已重新生成' : '同步失败，请查看控制台', !result.ok);
    if (!result.ok) {
      console.error(result.output);
    }
  } catch (error) {
    toast(error.message, true);
  } finally {
    button.disabled = false;
  }
}

/** 删除案例（移入回收站）。 */
async function deleteSelected() {
  if (!state.selectedSlug) {
    return;
  }
  if (!window.confirm(`将案例 ${state.selectedSlug} 移入 site/.manage-trash？`)) {
    return;
  }

  try {
    await api('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: state.selectedSlug }),
    });
    state.selectedSlug = null;
    state.draft = null;
    dom.editorForm.hidden = true;
    dom.editorEmpty.hidden = false;
    dom.editorTitle.textContent = '选择左侧案例';
    await refresh();
    toast('已移入回收站');
  } catch (error) {
    toast(error.message, true);
  }
}

/** 把新标签加入词表并选中。 */
async function addTagToVocabulary() {
  const tag = dom.tagInput.value.trim();
  if (!tag || !state.draft) {
    return;
  }

  const groups = state.taxonomy.tagGroups;
  if (!groups.some((group) => group.tags.includes(tag))) {
    if (groups.length === 0) {
      groups.push({ name: '标签', tags: [] });
    }
    groups[groups.length - 1].tags.push(tag);
    await api('/api/taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.taxonomy),
    });
  }

  if (!state.draft.tags.includes(tag)) {
    state.draft.tags.push(tag);
  }
  dom.tagInput.value = '';
  renderTagGroups();
  updateDirtyFlag();
}

/** 顶部提示条。 */
function toast(message, isError = false) {
  dom.toast.hidden = false;
  dom.toast.textContent = message;
  dom.toast.style.background = isError ? '#b42318' : '#1f2328';
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    dom.toast.hidden = true;
  }, 2600);
}

/** 字节数格式化。 */
function formatBytes(bytes) {
  if (!bytes) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

/** 日期格式化。 */
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未标注';
  }
  return date.toLocaleString('zh-CN', { hour12: false });
}

/** 绑定事件并初始化。 */
function bindEvents() {
  dom.search.addEventListener('input', renderList);
  dom.editorForm.addEventListener('submit', saveEditor);
  dom.editorForm.elements.title.addEventListener('input', updateDirtyFlag);
  dom.editorForm.elements.summary.addEventListener('input', updateDirtyFlag);
  dom.editorForm.elements.featured.addEventListener('change', updateDirtyFlag);
  dom.editorForm.elements.hidden.addEventListener('change', updateDirtyFlag);
  dom.categoryInput.addEventListener('input', updateDirtyFlag);

  document.getElementById('cover-input').addEventListener('change', (event) => {
    uploadCover(event.target.files?.[0]);
  });
  document.getElementById('build-input').addEventListener('change', (event) => {
    stageBuild(event.target.files?.[0]);
  });
  document.getElementById('template-input').addEventListener('change', (event) => {
    stageTemplate(event.target.files?.[0]);
  });
  document.getElementById('btn-sync').addEventListener('click', runSync);
  document.getElementById('btn-delete').addEventListener('click', deleteSelected);
  document.getElementById('btn-add-tag').addEventListener('click', addTagToVocabulary);
  dom.tagInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTagToVocabulary();
    }
  });
}

bindEvents();
refresh().catch((error) => toast(error.message, true));
