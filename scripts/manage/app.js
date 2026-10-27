/**
 * 文件功能：本地案例管理页的交互逻辑。
 *
 * 只消费 /api/state 提供的聚合状态，写操作统一走 /api/*，不直接操作文件系统。
 * 所有用户输入通过 textContent 渲染，避免注入；拖拽排序、未保存保护与确认弹窗
 * 都在前端完成，服务端接口契约保持不变。
 */
const state = {
  showcases: [],
  taxonomy: { tagGroups: [] },
  problems: [],
  paths: {},
  selectedSlug: null,
  draft: null,
  original: null,
  filter: 'all',
  keyword: '',
  loading: true,
  bannerDismissed: false,
  dragSlug: null,
};

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'featured', label: '精选' },
  { key: 'hidden', label: '隐藏' },
  { key: 'issue', label: '待补全', danger: true },
];

/** 与后端 defaultCategory 保持一致：词表为空时仍然有可选值。 */
const DEFAULT_CATEGORY = '未分类';

const dom = {
  list: getEl('case-list'),
  listHint: getEl('list-hint'),
  filters: getEl('filters'),
  statCount: getEl('stat-count'),
  search: getEl('search'),
  main: getEl('main'),
  emptyState: getEl('empty-state'),
  emptyTitle: getEl('empty-title'),
  emptyDesc: getEl('empty-desc'),
  emptySteps: getEl('empty-steps'),
  emptyCta: getEl('empty-cta'),
  detail: getEl('detail'),
  detailCoverImg: getEl('detail-cover-img'),
  detailCoverFallback: getEl('detail-cover-fallback'),
  detailTitle: getEl('detail-title'),
  detailSlug: getEl('detail-slug'),
  detailUpdated: getEl('detail-updated'),
  detailChips: getEl('detail-chips'),
  dirtyFlag: getEl('dirty-flag'),
  btnSave: getEl('btn-save'),
  btnReset: getEl('btn-reset'),
  editorForm: getEl('editor-form'),
  summaryCounter: getEl('summary-counter'),
  categoryChips: getEl('category-chips'),
  categoryNew: getEl('category-new'),
  tagGroups: getEl('tag-groups'),
  tagInput: getEl('tag-input'),
  coverDrop: getEl('cover-drop'),
  coverPreview: getEl('cover-preview'),
  coverMeta: getEl('cover-meta'),
  coverInput: getEl('cover-input'),
  previewStatus: getEl('preview-status'),
  previewMeta: getEl('preview-meta'),
  previewEntry: getEl('preview-entry'),
  previewOpen: getEl('preview-open'),
  buildDrop: getEl('build-drop'),
  buildInput: getEl('build-input'),
  readonlyGrid: getEl('readonly-grid'),
  problemBanner: getEl('problem-banner'),
  bannerTitle: getEl('banner-title'),
  problemList: getEl('problem-list'),
  pathList: getEl('path-list'),
  btnSync: getEl('btn-sync'),
  importDialog: getEl('import-dialog'),
  templateDrop: getEl('template-drop'),
  templateInput: getEl('template-input'),
  templateStage: getEl('template-stage'),
  confirmDialog: getEl('confirm-dialog'),
  confirmTitle: getEl('confirm-title'),
  confirmText: getEl('confirm-text'),
  confirmOk: getEl('confirm-ok'),
  confirmCancel: getEl('confirm-cancel'),
  logDialog: getEl('log-dialog'),
  logOutput: getEl('log-output'),
  toastStack: getEl('toast-stack'),
};

/** 取元素，缺失时直接抛错，避免后续静默失效。 */
function getEl(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`管理页缺少元素 #${id}`);
  }
  return element;
}

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

/* ---------- 状态与渲染 ---------- */

/** 拉取全量状态并重绘；未保存草稿不会被服务端数据覆盖。 */
async function refresh() {
  const payload = await api('/api/state');
  state.showcases = payload.showcases || [];
  state.taxonomy = payload.taxonomy || { tagGroups: [] };
  state.problems = payload.problems || [];
  state.paths = payload.paths || {};
  state.loading = false;

  renderStats();
  renderPaths();
  renderBanner();
  renderSidebar();

  if (!state.selectedSlug) {
    renderEmptyState();
    return;
  }

  const item = findBySlug(state.selectedSlug);
  if (!item) {
    clearSelection();
    return;
  }
  if (!isDirty()) {
    setDraft(draftFrom(item));
  }
  renderDetail(item);
}

/** 顶部概览：总数、展示中、隐藏、待补全。 */
function renderStats() {
  const total = state.showcases.length;
  if (total === 0) {
    dom.statCount.textContent = '还没有案例';
    return;
  }

  const hidden = state.showcases.filter((item) => item.hidden).length;
  const issues = state.showcases.filter((item) => issuesOf(item).length > 0).length;
  const parts = [`${total} 个案例`, `${total - hidden} 个展示中`];
  if (hidden > 0) {
    parts.push(`${hidden} 个隐藏`);
  }
  if (issues > 0) {
    parts.push(`${issues} 个待补全`);
  }
  dom.statCount.textContent = parts.join(' · ');
}

/** 渲染筛选器：只在初始化时建一次节点，后续仅更新计数与选中态。 */
function initFilters() {
  for (const filter of FILTERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter';
    button.dataset.key = filter.key;
    const label = document.createElement('span');
    label.textContent = filter.label;
    const count = document.createElement('b');
    button.append(label, count);
    button.addEventListener('click', () => {
      state.filter = filter.key;
      renderSidebar();
    });
    dom.filters.append(button);
  }
}

/** 更新筛选器计数与选中态；没有任何案例时整行收起，避免一排 0。 */
function renderFilters() {
  const total = state.showcases.length;
  dom.filters.hidden = total === 0;

  const counts = {
    all: total,
    featured: state.showcases.filter((item) => item.featured).length,
    hidden: state.showcases.filter((item) => item.hidden).length,
    issue: state.showcases.filter((item) => issuesOf(item).length > 0).length,
  };

  for (const button of dom.filters.children) {
    const key = button.dataset.key;
    const filter = FILTERS.find((item) => item.key === key);
    button.classList.toggle('is-on', state.filter === key);
    button.classList.toggle('is-danger', Boolean(filter?.danger));
    button.lastElementChild.textContent = counts[key] ?? 0;
  }
}

/** 按筛选器与关键词过滤案例；搜索范围覆盖标题、slug、分类与标签。 */
function filteredShowcases() {
  const keyword = state.keyword.trim().toLowerCase();
  return state.showcases.filter((item) => {
    if (state.filter === 'featured' && !item.featured) {
      return false;
    }
    if (state.filter === 'hidden' && !item.hidden) {
      return false;
    }
    if (state.filter === 'issue' && issuesOf(item).length === 0) {
      return false;
    }
    if (!keyword) {
      return true;
    }
    return [item.title, item.slug, item.category, ...item.tags].join(' ').toLowerCase().includes(keyword);
  });
}

/** 渲染左侧案例列表。 */
function renderSidebar() {
  renderFilters();
  const items = filteredShowcases();

  dom.list.textContent = '';
  if (state.showcases.length === 0) {
    dom.list.append(buildListPlaceholder());
  } else if (items.length === 0) {
    dom.list.append(buildListEmpty());
  } else {
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      fragment.append(buildCard(item));
    }
    dom.list.append(fragment);
  }

  updateListNote(items.length);
}

/** 一个案例都没有时，列表区给一块占位，避免左栏空成一片。 */
function buildListPlaceholder() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-placeholder';

  const title = document.createElement('p');
  title.className = 'list-empty-title';
  title.textContent = '案例列表为空';

  const desc = document.createElement('p');
  desc.textContent = '导入模板包后，案例会出现在这里。';

  wrapper.append(title, desc);
  return wrapper;
}

/** 列表无匹配项时的空态，提供一键清空筛选。 */
function buildListEmpty() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-empty';

  const title = document.createElement('p');
  title.className = 'list-empty-title';
  title.textContent = '没有匹配的案例';

  const desc = document.createElement('p');
  desc.textContent = '换个关键词，或者清空当前的筛选条件。';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-sm';
  button.textContent = '清空搜索与筛选';
  button.addEventListener('click', () => {
    state.keyword = '';
    state.filter = 'all';
    dom.search.value = '';
    renderSidebar();
  });

  wrapper.append(title, desc, button);
  return wrapper;
}

/** 列表底部说明：无数据、无匹配、可拖动三种情况给不同提示。 */
function updateListNote(count) {
  if (state.loading) {
    dom.listHint.textContent = '正在读取案例…';
    return;
  }
  if (state.showcases.length === 0) {
    dom.listHint.textContent = '';
    return;
  }
  if (count === 0) {
    // 无匹配时由列表内的空态块承担说明，这里留空避免重复。
    dom.listHint.textContent = '';
    return;
  }
  dom.listHint.textContent = canReorder() ? '拖动卡片可调整展示顺序' : '清空搜索与筛选后可拖动排序';
}

/** 当前是否允许拖动排序（筛选或搜索时顺序无意义，直接禁用）。 */
function canReorder() {
  return state.filter === 'all' && state.keyword.trim() === '';
}

/** 构建单张案例卡片。 */
function buildCard(item) {
  const card = document.createElement('article');
  card.className = 'case-card';
  card.dataset.slug = item.slug;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-current', item.slug === state.selectedSlug ? 'true' : 'false');
  card.classList.toggle('is-active', item.slug === state.selectedSlug);
  card.classList.toggle('is-hidden', item.hidden);

  const grip = document.createElement('span');
  grip.className = 'card-grip';
  grip.setAttribute('aria-hidden', 'true');
  card.append(grip, buildThumb(item));

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('p');
  title.className = 'card-title';
  title.textContent = item.title;
  title.title = item.title;
  body.append(title);

  const sub = document.createElement('p');
  sub.className = 'card-sub';
  sub.textContent = [
    item.category,
    item.pageCount ? `${item.pageCount} 页` : '',
    formatBytes((item.coverBytes || 0) + (item.packageBytes || 0) + (item.previewBytes || 0)),
  ].filter(Boolean).join(' · ');
  sub.title = sub.textContent;
  body.append(sub);

  const chips = document.createElement('div');
  chips.className = 'chips';
  if (item.featured) {
    chips.append(makeChip('精选', 'chip-featured'));
  }
  if (item.hidden) {
    chips.append(makeChip('隐藏', 'chip-hidden'));
  }
  const issues = issuesOf(item);
  if (issues.length > 0) {
    const chip = makeChip(`待补全 ${issues.length}`, 'chip-danger');
    chip.title = issues.join('、');
    chips.append(chip);
  }
  body.append(chips);
  card.append(body);

  card.addEventListener('click', () => selectShowcase(item.slug));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectShowcase(item.slug);
    }
  });

  if (canReorder()) {
    bindDrag(card, item);
  }

  return card;
}

/** 卡片缩略图；缺图时退化为标题首字。 */
function buildThumb(item) {
  const wrap = document.createElement('div');
  wrap.className = 'card-thumb';

  if (!item.coverFile || !item.coverBytes) {
    wrap.textContent = titleInitial(item.title);
    return wrap;
  }

  const image = document.createElement('img');
  image.alt = '';
  image.loading = 'lazy';
  image.src = coverUrl(item);
  image.addEventListener('error', () => {
    image.remove();
    wrap.textContent = titleInitial(item.title);
  });
  wrap.append(image);
  return wrap;
}

/** 绑定拖拽排序：以鼠标落在卡片上下半区决定插入位置。 */
function bindDrag(card, item) {
  card.draggable = true;

  card.addEventListener('dragstart', (event) => {
    state.dragSlug = item.slug;
    card.classList.add('is-dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.slug);
  });

  card.addEventListener('dragend', () => {
    state.dragSlug = null;
    card.classList.remove('is-dragging');
    clearDropMarks();
  });

  card.addEventListener('dragover', (event) => {
    if (!state.dragSlug || state.dragSlug === item.slug) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const rect = card.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    clearDropMarks();
    card.classList.add(position === 'before' ? 'is-drop-before' : 'is-drop-after');
    card.dataset.dropPosition = position;
  });

  card.addEventListener('dragleave', () => {
    card.classList.remove('is-drop-before', 'is-drop-after');
  });

  card.addEventListener('drop', async (event) => {
    event.preventDefault();
    const position = card.dataset.dropPosition || 'before';
    const dragSlug = state.dragSlug;
    clearDropMarks();
    if (!dragSlug || dragSlug === item.slug) {
      return;
    }
    await moveShowcase(dragSlug, item.slug, position);
  });
}

/** 移除所有插入位置标记。 */
function clearDropMarks() {
  for (const card of dom.list.children) {
    card.classList.remove('is-drop-before', 'is-drop-after');
  }
}

/** 把被拖动的案例移动到目标位置，先乐观更新再落盘。 */
async function moveShowcase(dragSlug, targetSlug, position) {
  const order = state.showcases.map((item) => item.slug);
  const from = order.indexOf(dragSlug);
  if (from < 0) {
    return;
  }
  order.splice(from, 1);
  let to = order.indexOf(targetSlug);
  if (to < 0) {
    return;
  }
  if (position === 'after') {
    to += 1;
  }
  order.splice(to, 0, dragSlug);

  const bySlug = new Map(state.showcases.map((item) => [item.slug, item]));
  state.showcases = order.map((slug) => bySlug.get(slug)).filter(Boolean);
  renderSidebar();

  try {
    await api('/api/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: order }),
    });
    await refresh();
    toast('展示顺序已保存');
  } catch (error) {
    toast(error.message, 'error');
    await refresh();
  }
}

/* ---------- 详情 ---------- */

/** 选中案例；有未保存修改时先确认。 */
async function selectShowcase(slug) {
  if (slug === state.selectedSlug) {
    return;
  }
  if (isDirty()) {
    const discard = await confirmAction({
      title: '放弃未保存的修改？',
      text: `${currentTitle()} 还有未保存的改动，切换案例后这些修改会丢失。`,
      okText: '放弃修改',
      danger: true,
    });
    if (!discard) {
      return;
    }
  }

  const item = findBySlug(slug);
  if (!item) {
    return;
  }

  state.selectedSlug = slug;
  setDraft(draftFrom(item));
  renderSidebar();
  renderDetail(item);
  dom.main.scrollTop = 0;
  history.replaceState(null, '', `#${encodeURIComponent(slug)}`);
}

/** 渲染右侧详情：头部信息 + 表单字段 + 资源状态 + 只读解析结果。 */
function renderDetail(item) {
  dom.emptyState.hidden = true;
  dom.detail.hidden = false;

  dom.detailTitle.textContent = state.draft.title || '未命名案例';
  dom.detailTitle.title = state.draft.title || '';
  dom.detailSlug.textContent = item.slug;
  dom.detailUpdated.textContent = item.updatedAt ? `更新于 ${formatDate(item.updatedAt)}` : '暂无更新时间';

  renderDetailChips(item);

  const form = dom.editorForm.elements;
  form.title.value = state.draft.title;
  form.summary.value = state.draft.summary;
  form.featured.checked = state.draft.featured;
  form.hidden.checked = state.draft.hidden;

  updateSummaryCounter();
  renderCategoryChips();
  renderTagGroups();
  renderCover(item);
  renderPreview(item);
  renderMeta(item);
  updateDirty();
}

/** 详情头部状态标签。 */
function renderDetailChips(item) {
  dom.detailChips.textContent = '';
  dom.detailChips.append(makeChip(state.draft?.category || item.category, 'chip-muted'));

  if (item.featured) {
    dom.detailChips.append(makeChip('精选', 'chip-featured'));
  }
  if (item.hidden) {
    dom.detailChips.append(makeChip('已隐藏', 'chip-hidden'));
  }
  if (item.hasPreview) {
    dom.detailChips.append(makeChip('可在线预览', 'chip-ok'));
  }

  const issues = issuesOf(item);
  if (issues.length > 0) {
    const chip = makeChip(`待补全 ${issues.length}`, 'chip-danger');
    chip.title = issues.join('、');
    dom.detailChips.append(chip);
  }
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
  chip.setAttribute('aria-pressed', state.draft.tags.includes(tag) ? 'true' : 'false');
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
    updateDirty();
  });
  return chip;
}

/**
 * 分类词表：词表顺序优先，其次补上「案例在用但不在词表」的分类，
 * 最后固定保留兜底分类，保证任何案例都能找到自己当前的值。
 */
function categoryVocabulary() {
  const vocabulary = state.taxonomy.categories || [];
  const used = state.showcases.map((item) => item.category).filter(Boolean);
  const extras = used.filter((name) => name !== DEFAULT_CATEGORY && !vocabulary.includes(name));
  return [...new Set([...vocabulary, ...extras, DEFAULT_CATEGORY])];
}

/** 渲染单选分类词表；selected 决定高亮项，点击回调交给调用方处理。 */
function renderCategoryPicker(container, selected, onSelect) {
  container.textContent = '';

  for (const name of categoryVocabulary()) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'tag-chip';
    chip.textContent = name;
    chip.setAttribute('aria-pressed', name === selected ? 'true' : 'false');
    if (name === selected) {
      chip.classList.add('is-on');
    }
    if (name === DEFAULT_CATEGORY) {
      chip.classList.add('is-default');
    }
    chip.addEventListener('click', () => onSelect(name));
    container.append(chip);
  }
}

/** 编辑面板里的分类选择区：点击即改草稿，保存时统一提交。 */
function renderCategoryChips() {
  renderCategoryPicker(dom.categoryChips, state.draft?.category, (name) => {
    state.draft.category = name;
    renderCategoryChips();
    updateCategoryChipText();
    updateDirty();
  });
}

/** 同步详情头部第一个分类标签的文字。 */
function updateCategoryChipText() {
  const categoryChip = dom.detailChips.firstElementChild;
  if (categoryChip) {
    categoryChip.textContent = state.draft?.category || DEFAULT_CATEGORY;
  }
}

/** 主图预览与体积：详情头部与资源区共用同一次赋值。 */
function renderCover(item) {
  const hasFile = Boolean(item.coverFile);
  const available = hasFile && item.coverBytes > 0;
  const url = hasFile ? coverUrl(item) : '';

  dom.coverDrop.classList.toggle('has-cover', available);
  if (url) {
    dom.coverPreview.src = url;
    dom.detailCoverImg.src = url;
    dom.detailCoverImg.hidden = false;
    dom.detailCoverFallback.hidden = true;
  } else {
    dom.coverPreview.removeAttribute('src');
    dom.detailCoverImg.removeAttribute('src');
    dom.detailCoverImg.hidden = true;
    dom.detailCoverFallback.hidden = false;
  }

  dom.coverPreview.onerror = () => dom.coverDrop.classList.remove('has-cover');
  dom.coverPreview.onload = () => dom.coverDrop.classList.add('has-cover');
  dom.detailCoverImg.onerror = () => {
    dom.detailCoverImg.hidden = true;
    dom.detailCoverFallback.hidden = false;
  };

  if (available) {
    dom.coverMeta.textContent = `${item.coverFile} · ${formatBytes(item.coverBytes)}`;
  } else if (hasFile) {
    dom.coverMeta.textContent = `${item.coverFile} · 文件缺失`;
  } else {
    dom.coverMeta.textContent = '尚未设置';
  }
}

/** 构建产物状态。 */
function renderPreview(item) {
  dom.previewStatus.textContent = item.hasPreview
    ? '已导入，详情页可在线预览'
    : '尚未导入，详情页会隐藏在线预览入口';
  dom.previewStatus.classList.toggle('is-ok', item.hasPreview);
  dom.previewStatus.classList.remove('is-error');

  dom.previewMeta.textContent = item.hasPreview ? formatBytes(item.previewBytes) : '未导入';
  dom.previewEntry.hidden = !item.hasPreview;
  dom.previewEntry.textContent = item.hasPreview ? `/public/previews/${item.slug}/index.html` : '';

  if (item.hasPreview) {
    dom.previewOpen.hidden = false;
    dom.previewOpen.href = `/public/previews/${encodeURIComponent(item.slug)}/index.html`;
  } else {
    dom.previewOpen.hidden = true;
    dom.previewOpen.removeAttribute('href');
  }
}

/** 只读解析结果，说明这些值来自模板而不是手填。 */
function renderMeta(item) {
  const rows = [
    ['页数', item.pageCount ? `${item.pageCount} 页` : '未标注'],
    ['画幅', item.aspectRatio || '未标注'],
    ['画布尺寸', item.pageWidth && item.pageHeight ? `${item.pageWidth} × ${item.pageHeight}` : '未标注'],
    ['主题', item.themeNames[0] || '未标注'],
    ['基准字号', item.baseFontSize || '未标注'],
    ['菜单模式', item.menuMode || '未标注'],
    ['项目编码', item.sourceProjectCode || '未标注'],
    ['创建时间', item.createdAt ? formatDate(item.createdAt) : '未标注'],
  ];

  dom.readonlyGrid.textContent = '';
  for (const [label, value] of rows) {
    const wrapper = document.createElement('dl');
    wrapper.className = 'meta-item';
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    dd.title = value;
    wrapper.append(dt, dd);
    dom.readonlyGrid.append(wrapper);
  }
}

/** 空态：分「还没有案例」与「未选择案例」两种文案。 */
function renderEmptyState() {
  dom.detail.hidden = true;
  dom.emptyState.hidden = false;

  const hasCases = state.showcases.length > 0;
  dom.emptyTitle.textContent = hasCases ? '选择一个案例开始编辑' : '还没有案例';
  dom.emptyDesc.textContent = hasCases
    ? '从左侧列表挑选案例，可以编辑展示文案、标签、主图与构建产物。'
    : '从主仓库导出模板包上传，解析结果核对无误后再写入目录。';
  dom.emptySteps.hidden = hasCases;
  dom.emptyCta.hidden = hasCases;
}

/** 清空选中态。 */
function clearSelection() {
  state.selectedSlug = null;
  state.draft = null;
  state.original = null;
  history.replaceState(null, '', location.pathname);
  renderEmptyState();
  renderSidebar();
}

/* ---------- 草稿与保存 ---------- */

/** 从服务端记录构造可编辑草稿。 */
function draftFrom(item) {
  return {
    title: item.title,
    summary: item.summary,
    category: item.category,
    tags: [...item.tags],
    featured: item.featured,
    hidden: item.hidden,
  };
}

/** 写入草稿并记录基准值，用于未保存判断。 */
function setDraft(draft) {
  state.draft = draft;
  state.original = JSON.stringify(draft);
}

/** 编辑内容与原始值不同即视为未保存。 */
function isDirty() {
  return Boolean(state.draft) && JSON.stringify(state.draft) !== state.original;
}

/** 同步未保存标记、保存与撤销按钮状态。 */
function updateDirty() {
  const dirty = isDirty();
  dom.dirtyFlag.hidden = !dirty;
  dom.btnSave.disabled = !dirty;
  dom.btnReset.disabled = !dirty;
}

/** 摘要字数提示。 */
function updateSummaryCounter() {
  const length = dom.editorForm.elements.summary.value.length;
  dom.summaryCounter.textContent = `${length} / 300`;
}

/** 保存展示字段。 */
async function saveEditor(event) {
  event?.preventDefault();
  if (!state.selectedSlug || !state.draft) {
    return;
  }

  const form = dom.editorForm.elements;
  const title = form.title.value.trim();

  if (!title) {
    toast('标题不能为空', 'error');
    form.title.focus();
    return;
  }

  state.draft.title = title;
  state.draft.summary = form.summary.value.trim();
  state.draft.category = state.draft.category || DEFAULT_CATEGORY;
  state.draft.featured = form.featured.checked;
  state.draft.hidden = form.hidden.checked;

  dom.btnSave.classList.add('is-busy');
  try {
    await api('/api/showcase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: state.selectedSlug, patch: state.draft }),
    });
    // 保存成功后先把基准值对齐，refresh 才会用服务端记录重建草稿并清掉未保存标记。
    setDraft(state.draft);
    await refresh();
    toast('已保存，重新同步后公开页生效');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    dom.btnSave.classList.remove('is-busy');
    updateDirty();
  }
}

/** 撤销未保存的修改，回到服务端记录。 */
function resetDraft() {
  const item = findBySlug(state.selectedSlug);
  if (!item) {
    return;
  }
  setDraft(draftFrom(item));
  renderDetail(item);
  toast('已撤销未保存的修改');
}

/* ---------- 资源上传 ---------- */

/** 上传主图并刷新列表与详情。 */
async function uploadCover(file) {
  if (!file || !state.selectedSlug) {
    return;
  }
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    toast('主图仅支持 PNG、JPEG、WebP 格式', 'error');
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    toast('主图请控制在 20MB 以内', 'error');
    return;
  }

  dom.coverDrop.classList.add('is-busy');
  try {
    await api(`/api/cover?slug=${encodeURIComponent(state.selectedSlug)}&filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
    await refresh();
    toast('主图已更新');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    dom.coverDrop.classList.remove('is-busy');
    dom.coverInput.value = '';
  }
}

/** 上传构建产物：暂存解析 → 弹窗确认 → 提交替换。 */
async function stageBuild(file) {
  if (!file || !state.selectedSlug) {
    return;
  }
  if (!file.name.toLowerCase().endsWith('.zip')) {
    toast('请选择 .zip 构建产物', 'error');
    return;
  }

  setBuildStatus('正在解析构建产物…');
  try {
    const staged = await api(`/api/import/build?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });

    const warnText = staged.warnings.length > 0 ? `\n\n需要注意：${staged.warnings.join('；')}` : '';
    const confirmed = await confirmAction({
      title: '替换当前构建产物？',
      text: `解析成功：${staged.fileCount} 个文件，共 ${formatBytes(staged.totalBytes)}\n入口文件：${staged.entry}\n\n确认后 ${state.selectedSlug} 的预览目录会被整体替换。${warnText}`,
      okText: '替换产物',
    });
    if (!confirmed) {
      setBuildStatus('已取消，原有产物未修改');
      return;
    }

    setBuildStatus('正在写入…');
    await api('/api/import/build/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: staged.token, slug: state.selectedSlug }),
    });
    await refresh();
    toast('构建产物已导入');
  } catch (error) {
    setBuildStatus('导入失败，原有产物未修改', true);
    toast(error.message, 'error');
  } finally {
    dom.buildInput.value = '';
  }
}

/** 更新构建产物状态文案。 */
function setBuildStatus(text, isError = false) {
  dom.previewStatus.textContent = text;
  dom.previewStatus.classList.toggle('is-error', isError);
  dom.previewStatus.classList.remove('is-ok');
}

/* ---------- 模板导入 ---------- */

/** 打开导入弹窗并重置到初始状态。 */
function openImportDialog() {
  dom.templateStage.hidden = true;
  dom.templateStage.textContent = '';
  dom.templateDrop.hidden = false;
  dom.templateInput.value = '';
  dom.importDialog.showModal();
}

/** 上传模板包：暂存后展示解析结果，确认才写入正式目录。 */
async function stageTemplate(file) {
  if (!file) {
    return;
  }

  dom.templateDrop.hidden = true;
  dom.templateStage.hidden = false;
  dom.templateStage.textContent = '';

  const loading = document.createElement('p');
  loading.className = 'stage-loading';
  loading.textContent = `正在解析 ${file.name}…`;
  dom.templateStage.append(loading);

  try {
    const staged = await api(`/api/import/template?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
    renderTemplateStage(staged, file.name);
  } catch (error) {
    renderStageError(error.message);
  }
}

/** 展示解析失败原因，并允许重新选择文件。 */
function renderStageError(message) {
  dom.templateStage.textContent = '';

  const callout = document.createElement('div');
  callout.className = 'callout callout-error';
  callout.textContent = message;
  dom.templateStage.append(callout);

  const actions = document.createElement('div');
  actions.className = 'stage-actions';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'btn btn-sm';
  retry.textContent = '重新选择文件';
  retry.addEventListener('click', () => openImportDialog());
  actions.append(retry);
  dom.templateStage.append(actions);
}

/** 渲染模板导入确认表单。 */
function renderTemplateStage(staged, fileName) {
  dom.templateStage.textContent = '';

  const summary = document.createElement('div');
  summary.className = 'stage-summary';
  const stats = [
    ['文件', `${staged.fileCount} 个`],
    ['体积', formatBytes(staged.totalBytes)],
    ['页数', staged.parsed.meta?.pageCount ? `${staged.parsed.meta.pageCount} 页` : '未标注'],
    ['画幅', staged.parsed.meta?.aspectRatio || '未标注'],
  ];
  for (const [label, value] of stats) {
    const cell = document.createElement('div');
    cell.className = 'stage-stat';
    const span = document.createElement('span');
    span.textContent = label;
    const strong = document.createElement('strong');
    strong.textContent = value;
    cell.append(span, strong);
    summary.append(cell);
  }
  dom.templateStage.append(summary);

  const files = document.createElement('details');
  files.className = 'stage-files';
  const filesSummary = document.createElement('summary');
  filesSummary.textContent = `${fileName} · 查看文件清单`;
  const fileList = document.createElement('div');
  fileList.className = 'stage-file-list';
  for (const item of staged.files) {
    const row = document.createElement('div');
    row.className = 'stage-file';
    const name = document.createElement('span');
    name.textContent = item.name;
    const size = document.createElement('span');
    size.textContent = formatBytes(item.size);
    row.append(name, size);
    fileList.append(row);
  }
  files.append(filesSummary, fileList);
  dom.templateStage.append(files);

  const form = document.createElement('div');
  form.className = 'stage-form';

  const slugInput = createInput('text', staged.parsed.suggestedSlug || suggestSlug(staged.parsed.title));
  slugInput.placeholder = '目录名，首次确定后不要再改';
  form.append(labeled('目录名 slug', slugInput, 'field-full'));

  const titleInput = createInput('text', staged.parsed.title);
  form.append(labeled('标题', titleInput, 'field-full'));

  const summaryInput = document.createElement('textarea');
  summaryInput.rows = 2;
  summaryInput.value = staged.parsed.summary;
  form.append(labeled('摘要', summaryInput, 'field-full'));

  let categoryValue = mostUsedCategory();
  const categoryPicker = document.createElement('div');
  categoryPicker.className = 'category-picker';
  categoryPicker.setAttribute('role', 'group');
  categoryPicker.setAttribute('aria-label', '分类');

  const selectCategory = (name) => {
    categoryValue = name;
    renderCategoryPicker(categoryPicker, categoryValue, selectCategory);
  };
  renderCategoryPicker(categoryPicker, categoryValue, selectCategory);

  const categoryRow = document.createElement('div');
  categoryRow.className = 'tag-new';
  const newCategoryInput = createInput('text', '');
  newCategoryInput.placeholder = '新增分类，回车加入词表';
  newCategoryInput.maxLength = 20;

  const addCategoryButton = document.createElement('button');
  addCategoryButton.type = 'button';
  addCategoryButton.className = 'btn btn-sm';
  addCategoryButton.textContent = '加入词表';

  async function submitCategory() {
    const name = newCategoryInput.value.trim();
    if (!name) {
      return;
    }
    const status = await addCategory(name);
    if (status === 'failed') {
      return;
    }
    newCategoryInput.value = '';
    selectCategory(name);
  }

  addCategoryButton.addEventListener('click', submitCategory);

  newCategoryInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitCategory();
    }
  });
  categoryRow.append(newCategoryInput, addCategoryButton);

  const hint = document.createElement('span');
  hint.className = 'field-hint';
  hint.textContent = '分类来自词表；标签可以在导入后再勾选。';

  const categoryField = labeled('分类', categoryPicker, 'field-full');
  categoryField.append(categoryRow, hint);
  form.append(categoryField);

  dom.templateStage.append(form);

  const warning = document.createElement('div');
  warning.className = 'callout callout-warn';
  warning.hidden = true;
  dom.templateStage.append(warning);

  const updateWarning = () => {
    const slug = slugInput.value.trim();
    const exists = Boolean(slug) && state.showcases.some((item) => item.slug === slug);
    warning.hidden = !exists;
    warning.textContent = exists
      ? `案例 ${slug} 已存在，继续导入会覆盖案例记录、下载包与主图；展示文案按下面填写的内容写入。`
      : '';
    confirmButton.textContent = exists ? '覆盖导入' : '确认导入';
  };
  slugInput.addEventListener('input', updateWarning);

  const actions = document.createElement('div');
  actions.className = 'stage-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'btn btn-sm';
  cancelButton.textContent = '取消';
  cancelButton.addEventListener('click', () => dom.importDialog.close());

  const confirmButton = document.createElement('button');
  confirmButton.type = 'button';
  confirmButton.className = 'btn btn-primary btn-sm';
  confirmButton.textContent = '确认导入';
  confirmButton.addEventListener('click', async () => {
    const slug = slugInput.value.trim();
    if (!slug) {
      toast('请填写目录名', 'error');
      slugInput.focus();
      return;
    }
    if (!categoryValue) {
      toast('请选择分类', 'error');
      return;
    }

    confirmButton.classList.add('is-busy');
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
            category: categoryValue,
          },
        }),
      });
      dom.importDialog.close();
      await refresh();
      await selectShowcase(result.slug);
      toast('模板已导入，接着补充主图与构建产物');
    } catch (error) {
      toast(error.message, 'error');
      confirmButton.classList.remove('is-busy');
    }
  });

  actions.append(cancelButton, confirmButton);
  dom.templateStage.append(actions);

  // 建议 slug 可能已经存在，首次渲染就要提示覆盖风险。
  updateWarning();
}

/* ---------- 页面级操作 ---------- */

/** 触发一次站点同步。 */
async function runSync() {
  dom.btnSync.classList.add('is-busy');
  try {
    const result = await api('/api/sync', { method: 'POST' });
    if (result.ok) {
      toast('站点数据已重新生成');
    } else {
      toast('同步失败，查看输出定位原因', 'error');
      showLog(result.output || '无输出');
    }
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    dom.btnSync.classList.remove('is-busy');
  }
}

/** 展示脚本输出。 */
function showLog(text) {
  dom.logOutput.textContent = text;
  dom.logDialog.showModal();
}

/** 删除案例（移入回收站）。 */
async function deleteSelected() {
  const slug = state.selectedSlug;
  if (!slug) {
    return;
  }

  const confirmed = await confirmAction({
    title: '移入回收站？',
    text: `案例 ${slug} 的案例记录、主图、下载包与构建产物都会移动到 site/.manage-trash，公开站点将不再展示它。`,
    okText: '移入回收站',
    danger: true,
  });
  if (!confirmed) {
    return;
  }

  try {
    await api('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    clearSelection();
    await refresh();
    toast('已移入回收站');
  } catch (error) {
    toast(error.message, 'error');
  }
}

/** 把词表整体写回服务端，并以服务端规范化后的结果作为本地词表。 */
async function saveTaxonomy() {
  const result = await api('/api/taxonomy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      categories: state.taxonomy.categories || [],
      tagGroups: state.taxonomy.tagGroups || [],
    }),
  });
  state.taxonomy = result.taxonomy;
  return result.taxonomy;
}

/**
 * 把分类加入词表。
 *
 * 返回 'exists' 表示词表里已有、'added' 表示写入成功、'failed' 表示写入失败，
 * 调用方据此决定提示文案与是否切换当前选中项。
 */
async function addCategory(name) {
  const target = String(name || '').trim();
  if (!target) {
    return 'failed';
  }
  if (categoryVocabulary().includes(target)) {
    return 'exists';
  }

  state.taxonomy.categories = [...(state.taxonomy.categories || []), target];
  try {
    await saveTaxonomy();
    return 'added';
  } catch (error) {
    state.taxonomy.categories = (state.taxonomy.categories || []).filter((item) => item !== target);
    toast(error.message, 'error');
    return 'failed';
  }
}

/** 编辑面板：新增分类并直接选中。 */
async function addCategoryToVocabulary() {
  const name = dom.categoryNew.value.trim();
  if (!name || !state.draft) {
    return;
  }

  const status = await addCategory(name);
  if (status === 'failed') {
    return;
  }

  state.draft.category = name;
  dom.categoryNew.value = '';
  renderCategoryChips();
  updateCategoryChipText();
  updateDirty();
  toast(status === 'exists' ? `分类「${name}」已在词表中，已选中` : `分类「${name}」已加入词表`);
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
    try {
      await saveTaxonomy();
    } catch (error) {
      toast(error.message, 'error');
      return;
    }
  }

  if (!state.draft.tags.includes(tag)) {
    state.draft.tags.push(tag);
  }
  dom.tagInput.value = '';
  renderTagGroups();
  updateDirty();
  toast(`标签「${tag}」已加入词表`);
}

/* ---------- 确认弹窗与提示 ---------- */

/**
 * 通用确认弹窗，返回 Promise<boolean>。
 *
 * 关闭方式（按钮、Esc、遮罩外点击）统一归到 finish，避免重复 resolve。
 */
function confirmAction({ title, text, okText = '确定', danger = false }) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) {
        return;
      }
      settled = true;
      dom.confirmDialog.close();
      resolve(value);
    };

    dom.confirmTitle.textContent = title;
    dom.confirmText.textContent = text;
    dom.confirmOk.textContent = okText;
    dom.confirmOk.className = `btn btn-sm ${danger ? 'btn-danger-solid' : 'btn-primary'}`;
    dom.confirmOk.onclick = () => finish(true);
    dom.confirmCancel.onclick = () => finish(false);
    dom.confirmDialog.oncancel = (event) => {
      event.preventDefault();
      finish(false);
    };
    dom.confirmDialog.onclose = () => finish(false);

    dom.confirmDialog.showModal();
    dom.confirmOk.focus();
  });
}

/** 右下角提示，3.2 秒后自动消失。 */
function toast(message, type = 'success') {
  const element = document.createElement('div');
  element.className = `toast${type === 'error' ? ' is-error' : ''}`;
  element.textContent = message;
  dom.toastStack.append(element);

  window.setTimeout(() => {
    element.classList.add('is-leaving');
    window.setTimeout(() => element.remove(), 220);
  }, 3200);
}

/* ---------- 工具函数 ---------- */

/** 某案例的资源问题清单：字段缺失 + 解析告警。 */
function issuesOf(item) {
  const issues = [];
  if (!item.coverFile || !item.coverBytes) {
    issues.push('主图未设置');
  }
  if (!item.packageFile || !item.packageBytes) {
    issues.push('模板包缺失');
  }
  if (!item.hasPreview) {
    issues.push('构建产物未导入');
  }

  for (const problem of state.problems) {
    if (problem.slug === item.slug && !problem.message.startsWith('缺少')) {
      issues.push(problem.message);
    }
  }
  return issues;
}

/** 按 slug 取案例。 */
function findBySlug(slug) {
  return state.showcases.find((item) => item.slug === slug);
}

/** 当前草稿标题，用于确认文案。 */
function currentTitle() {
  return state.draft?.title || state.selectedSlug || '当前案例';
}

/** 现有案例里出现最多的分类，作为导入时的默认选中项。 */
function mostUsedCategory() {
  const counts = new Map();
  for (const item of state.showcases) {
    if (item.category) {
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    }
  }
  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1]);
  return ranked[0]?.[0] || DEFAULT_CATEGORY;
}

/** 主图访问路径（走管理服务的 /public 静态目录）。 */
function coverUrl(item) {
  return `/public/showcases/${encodeURIComponent(item.slug)}/${encodeURIComponent(item.coverFile)}`;
}

/** 标题首字，作为缺图占位。 */
function titleInitial(title) {
  return String(title || '?').trim().slice(0, 1) || '?';
}

/** 创建徽标元素。 */
function makeChip(text, className = 'chip') {
  const chip = document.createElement('span');
  chip.className = className;
  chip.textContent = text;
  return chip;
}

/** 创建输入框。 */
function createInput(type, value) {
  const input = document.createElement('input');
  input.type = type;
  input.value = value || '';
  return input;
}

/** 生成表单行：标签 + 控件。 */
function labeled(text, control, className = '') {
  const wrapper = document.createElement('label');
  wrapper.className = `field ${className}`.trim();
  const span = document.createElement('span');
  span.className = 'field-label';
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
    showcases: '案例数据',
    publicShowcases: '主图与下载包',
    previews: '构建产物',
    taxonomy: '词表',
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

/** 构建期发现的问题汇总；点击可定位到对应案例。 */
function renderBanner() {
  if (state.problems.length === 0 || state.bannerDismissed) {
    dom.problemBanner.hidden = true;
    return;
  }

  dom.problemBanner.hidden = false;
  dom.bannerTitle.textContent = `发现 ${state.problems.length} 处资源问题，补全后会恢复对应入口`;

  dom.problemList.textContent = '';
  for (const problem of state.problems.slice(0, 8)) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'banner-item';
    item.textContent = `${problem.slug} · ${problem.message}`;
    item.addEventListener('click', () => selectShowcase(problem.slug));
    dom.problemList.append(item);
  }

  if (state.problems.length > 8) {
    const more = document.createElement('p');
    more.className = 'banner-item';
    more.textContent = `另有 ${state.problems.length - 8} 处未列出`;
    dom.problemList.append(more);
  }
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
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/* ---------- 事件绑定 ---------- */

/** 绑定全部事件。 */
function bindEvents() {
  dom.search.addEventListener('input', () => {
    state.keyword = dom.search.value;
    renderSidebar();
  });

  dom.editorForm.addEventListener('submit', saveEditor);

  const form = dom.editorForm.elements;
  form.title.addEventListener('input', () => {
    state.draft.title = form.title.value;
    dom.detailTitle.textContent = form.title.value || '未命名案例';
    dom.detailTitle.title = form.title.value;
    updateDirty();
  });
  form.summary.addEventListener('input', () => {
    state.draft.summary = form.summary.value;
    updateSummaryCounter();
    updateDirty();
  });
  dom.categoryNew.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCategoryToVocabulary();
    }
  });
  form.featured.addEventListener('change', () => {
    state.draft.featured = form.featured.checked;
    updateDirty();
  });
  form.hidden.addEventListener('change', () => {
    state.draft.hidden = form.hidden.checked;
    updateDirty();
  });

  dom.btnReset.addEventListener('click', resetDraft);
  getEl('btn-delete').addEventListener('click', deleteSelected);
  getEl('btn-copy-slug').addEventListener('click', copySlug);

  dom.coverInput.addEventListener('change', (event) => uploadCover(event.target.files?.[0]));
  dom.buildInput.addEventListener('change', (event) => stageBuild(event.target.files?.[0]));

  bindDropZone(dom.coverDrop, dom.coverInput, uploadCover);
  bindDropZone(dom.buildDrop, dom.buildInput, stageBuild);

  dom.btnSync.addEventListener('click', runSync);
  getEl('btn-import').addEventListener('click', openImportDialog);
  dom.emptyCta.addEventListener('click', openImportDialog);
  getEl('import-close').addEventListener('click', () => dom.importDialog.close());
  getEl('log-close').addEventListener('click', () => dom.logDialog.close());
  getEl('banner-close').addEventListener('click', () => {
    state.bannerDismissed = true;
    dom.problemBanner.hidden = true;
  });

  dom.templateDrop.addEventListener('click', () => dom.templateInput.click());
  dom.templateDrop.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      dom.templateInput.click();
    }
  });
  dom.templateInput.addEventListener('change', (event) => stageTemplate(event.target.files?.[0]));

  bindDropZone(dom.templateDrop, dom.templateInput, stageTemplate);

  getEl('btn-add-tag').addEventListener('click', addTagToVocabulary);
  getEl('btn-add-category').addEventListener('click', addCategoryToVocabulary);
  dom.tagInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTagToVocabulary();
    }
  });

  document.addEventListener('keydown', handleShortcut);
  window.addEventListener('beforeunload', (event) => {
    if (isDirty()) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
}

/** 绑定拖拽投放：拖入文件等同于选择文件。 */
function bindDropZone(element, input, handler) {
  element.addEventListener('dragover', (event) => {
    event.preventDefault();
    element.classList.add('is-over');
  });
  element.addEventListener('dragleave', () => element.classList.remove('is-over'));
  element.addEventListener('drop', (event) => {
    event.preventDefault();
    element.classList.remove('is-over');
    handler(event.dataTransfer?.files?.[0]);
  });
}

/** 快捷键：Ctrl/Cmd+S 保存，/ 聚焦搜索。 */
function handleShortcut(event) {
  const target = event.target;
  const typing = target instanceof HTMLElement
    && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    if (isDirty()) {
      event.preventDefault();
      saveEditor();
    }
    return;
  }

  if (event.key === '/' && !typing) {
    event.preventDefault();
    dom.search.focus();
  }
}

/** 复制 slug 到剪贴板。 */
async function copySlug() {
  const slug = state.selectedSlug;
  if (!slug) {
    return;
  }
  try {
    await navigator.clipboard.writeText(slug);
    toast('目录名已复制');
  } catch {
    toast('复制失败，请手动选择', 'error');
  }
}

initFilters();
bindEvents();
refresh()
  .then(() => {
    // 支持 #slug 深链：刷新或从别处跳回时直接定位到某个案例。
    const slug = decodeURIComponent(location.hash.slice(1));
    if (slug && findBySlug(slug)) {
      return selectShowcase(slug);
    }
    return undefined;
  })
  .catch((error) => toast(error.message, 'error'));
