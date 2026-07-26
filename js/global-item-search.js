/* Global item search: one fast entry point for every Albion market surface. */
(function () {
  const RECENT_KEY = 'aot_pnasf_global_item_searches';
  const t = (key, fallback) => {
    try {
      const value = window.miniappI18n?.t?.(key);
      if (value && value !== key) return value;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (error) {}
    return fallback;
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const fold = (value) => String(value || '').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let dialog;
  let input;
  let resultList;
  let recentList;
  let recent = [];

  function catalog() { return window.MarketItemCatalog; }
  function itemLabel(item) {
    if (!item) return '';
    return catalog()?.label?.(item) || item.name || item.id.replace(/_/g, ' ');
  }
  function labelForId(id) {
    const parsed = catalog()?.parseId?.(id);
    const item = parsed ? catalog()?.find?.(parsed.baseId) : null;
    return item ? itemLabel(item) : id;
  }
  function itemIdFromQuery(query) {
    const normalized = String(query || '').trim().toUpperCase().replace(/\s+/g, '_');
    if (/^T[4-8]_[A-Z0-9_]+(?:@[0-4])?$/.test(normalized)) return normalized;
    const match = normalized.match(/^T([4-8])(?:\.([0-4]))?\s+(.+)$/);
    if (!match) return '';
    const base = catalog()?.items?.find((item) => fold(itemLabel(item)) === fold(match[3]) || item.id === match[3]);
    return base ? catalog().buildId(base.id, match[1], match[2] || 0) : '';
  }
  function currentTier() { return dialog?.querySelector('#globalSearchTier')?.value || '6'; }
  function currentEnchant() { return dialog?.querySelector('#globalSearchEnchant')?.value || '0'; }
  function renderRecent() {
    if (!recentList) return;
    recentList.innerHTML = recent.length ? `<div class="global-search-subtitle">${esc(t('globalSearch-recent', 'Son aramalar'))}</div><div class="global-search-recent-items">${recent.map((id) => `<button type="button" data-global-recent="${esc(id)}">${esc(labelForId(id))} <small>${esc(id)}</small></button>`).join('')}</div>` : '';
  }
  function renderResults(query = '') {
    if (!resultList) return;
    const text = fold(query.trim());
    const items = catalog()?.items || [];
    const filtered = items.filter((item) => !text || fold(itemLabel(item)).includes(text) || fold(item.id).includes(text)).slice(0, 14);
    if (!filtered.length) {
      const direct = itemIdFromQuery(query);
      resultList.innerHTML = direct ? `<button type="button" class="global-search-result" data-global-item="${esc(direct)}"><span class="global-search-result-icon"><i class="fa-solid fa-arrow-right"></i></span><span><strong>${esc(direct)}</strong><small>${esc(t('globalSearch-useId', 'Bu eşya kimliğini markette analiz et'))}</small></span></button>` : `<div class="global-search-empty"><i class="fa-solid fa-magnifying-glass"></i><span>${esc(t('globalSearch-empty', 'Eşya bulunamadı. İsim veya T6_MAIN_SWORD gibi bir ID deneyin.'))}</span></div>`;
      return;
    }
    resultList.innerHTML = filtered.map((item) => {
      const id = catalog().buildId(item.id, currentTier(), currentEnchant());
      return `<button type="button" class="global-search-result" data-global-item="${esc(id)}"><img src="${esc(catalog().iconUrl(id))}" alt="" loading="lazy" data-image-fallback="item"><span><strong>${esc(itemLabel(item))}</strong><small>${esc(id)} · ${esc(catalog().category(item))}</small></span><i class="fa-solid fa-arrow-up-right-from-square"></i></button>`;
    }).join('');
  }
  async function loadRecent() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(RECENT_KEY, { area: 'persistent' });
      recent = raw ? JSON.parse(raw).filter(Boolean).slice(0, 6) : [];
    } catch (error) { recent = []; }
    renderRecent();
  }
  async function saveRecent(id) {
    recent = [id, ...recent.filter((item) => item !== id)].slice(0, 6);
    renderRecent();
    try { await window.miniappsAI?.storage?.setItem(RECENT_KEY, JSON.stringify(recent), { area: 'persistent' }); } catch (error) {}
  }
  function open() {
    dialog?.classList.remove('hidden');
    document.body.classList.add('global-search-open');
    input?.focus();
    renderResults(input?.value || '');
  }
  function close() {
    dialog?.classList.add('hidden');
    document.body.classList.remove('global-search-open');
  }
  function selectItem(id) {
    if (!id) return;
    saveRecent(id);
    close();
    window.dispatchEvent(new CustomEvent('market_select_item', { detail: { id } }));
    document.querySelector('[data-tab="tab-market"]')?.click();
  }
  function mount() {
    if (!window.MarketItemCatalog || document.getElementById('globalItemSearch')) return;
    const trigger = document.getElementById('globalSearchTrigger');
    dialog = document.createElement('div');
    dialog.id = 'globalItemSearch';
    dialog.className = 'global-search-overlay hidden';
    dialog.innerHTML = `<div class="global-search-backdrop" data-global-close></div><div class="global-search-dialog" role="dialog" aria-modal="true" aria-labelledby="globalSearchTitle"><div class="global-search-head"><div><span class="eyebrow"><i class="fa-solid fa-compass"></i> ${esc(t('globalSearch-eyebrow', 'HIZLI ERİŞİM'))}</span><h2 id="globalSearchTitle">${esc(t('globalSearch-title', 'Eşya ara, fırsatı aç'))}</h2></div><button type="button" class="global-search-close" aria-label="${esc(t('globalSearch-close', 'Kapat'))}" data-global-close><i class="fa-solid fa-xmark"></i></button></div><div class="global-search-input-row"><i class="fa-solid fa-magnifying-glass"></i><input id="globalSearchInput" type="search" autocomplete="off" placeholder="${esc(t('globalSearch-placeholder', 'Kılıç, Potion, T6_MAIN_SWORD…'))}" aria-label="${esc(t('globalSearch-placeholder', 'Eşya ara'))}"><kbd>ESC</kbd></div><div class="global-search-filters"><label>${esc(t('globalSearch-tier', 'Seviye'))}<select id="globalSearchTier"><option value="4">T4</option><option value="5">T5</option><option value="6" selected>T6</option><option value="7">T7</option><option value="8">T8</option></select></label><label>${esc(t('globalSearch-enchant', 'Büyü'))}<select id="globalSearchEnchant"><option value="0">.0</option><option value="1">.1</option><option value="2">.2</option><option value="3">.3</option><option value="4">.4</option></select></label></div><div id="globalSearchRecent"></div><div class="global-search-subtitle">${esc(t('globalSearch-results', 'Eşyalar'))}</div><div id="globalSearchResults" class="global-search-results"></div><p class="global-search-hint"><i class="fa-solid fa-lightbulb"></i> ${esc(t('globalSearch-hint', 'Bir sonuç seçtiğinizde Pazar Kokpiti açılır ve analiz hazırlar.'))}</p></div>`;
    document.body.appendChild(dialog);
    input = dialog.querySelector('#globalSearchInput');
    resultList = dialog.querySelector('#globalSearchResults');
    recentList = dialog.querySelector('#globalSearchRecent');
    trigger?.addEventListener('click', open);
    trigger?.setAttribute('aria-haspopup', 'dialog');
    input?.addEventListener('input', () => renderResults(input.value));
    dialog.querySelectorAll('#globalSearchTier, #globalSearchEnchant').forEach((select) => select.addEventListener('change', () => renderResults(input?.value || '')));
    dialog.addEventListener('click', (event) => {
      if (event.target.closest('[data-global-close]')) close();
      const result = event.target.closest('[data-global-item]');
      if (result) selectItem(result.dataset.globalItem);
      const recentButton = event.target.closest('[data-global-recent]');
      if (recentButton) { input.value = recentButton.dataset.globalRecent; selectItem(recentButton.dataset.globalRecent); }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !dialog.classList.contains('hidden')) close();
      if (event.key === '/' && dialog.classList.contains('hidden') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) { event.preventDefault(); open(); }
    });
    loadRecent();
    renderResults();
  }
  document.addEventListener('DOMContentLoaded', () => { const retry = () => { if (!window.MarketItemCatalog) return setTimeout(retry, 100); mount(); }; retry(); });
})();
