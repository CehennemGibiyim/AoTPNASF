/* Market cockpit: item picker, automatic opportunities and profit alerts. */
(function () {
  const PROFILE_KEY = 'aot_pnasf_market_profile';
  const t = (key, fallback) => {
    try {
      const managed = window.miniappI18n?.t?.(key);
      if (managed && managed !== key) return managed;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
      const value = typeof window.t === 'function' ? window.t(key, fallback) : fallback;
      return value && value !== key && !String(value).startsWith('[') ? value : fallback;
    } catch (error) { return fallback; }
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const catalog = () => window.MarketItemCatalog;
  const image = (id) => catalog()?.iconUrl?.(id) || '';
  let profile = { capital: 1000000, buyTax: 0, sellTax: 6.5, risk: 'safe', focus: false };
  let lastResults = [];
  let favoritesConnected = false;
  let analysisToken = 0;

  async function loadProfile() {
    try {
      const storage = window.miniappsAI?.storage;
      const raw = storage?.getItem ? await storage.getItem(PROFILE_KEY) : null;
      if (raw) profile = { ...profile, ...JSON.parse(raw) };
    } catch (error) { console.warn('Profile load failed', error); }
    window.MarketProfile = profile;
  }

  async function saveProfile() {
    window.MarketProfile = profile;
    try {
      const storage = window.miniappsAI?.storage;
      if (storage?.setItem) await storage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (error) { console.warn('Profile save failed', error); }
  }

  function itemByBase(baseId) { return catalog()?.find?.(baseId); }
  function displayLabel(id, fallback) {
    const parsed = catalog()?.parseId?.(id);
    const item = parsed && itemByBase(parsed.baseId);
    return item ? catalog().label(item) : (fallback || id);
  }
  function selectedItem() {
    const baseId = document.getElementById('marketItemBase')?.value;
    const item = itemByBase(baseId) || catalog()?.items?.[0];
    const tier = Number(document.getElementById('marketItemTier')?.value || 6);
    const enchant = Number(document.getElementById('marketItemEnchant')?.value || 0);
    return item ? { item, id: catalog().buildId(item.id, tier, enchant), label: catalog().label(item) } : null;
  }

  function populateItemSelect(query = '') {
    const select = document.getElementById('marketItemBase');
    if (!select || !catalog()) return;
    const current = select.value;
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    const items = catalog().items.filter((item) => {
      const text = `${catalog().label(item)} ${item.id} ${catalog().category(item)}`.toLocaleLowerCase('tr-TR');
      return !normalized || text.includes(normalized);
    });
    select.innerHTML = items.length
      ? items.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(catalog().label(item))} · ${escapeHtml(catalog().category(item))}</option>`).join('')
      : `<option value="">${escapeHtml(t('market-pickerEmpty', 'Eşya bulunamadı'))}</option>`;
    if (items.some((item) => item.id === current)) select.value = current;
    updatePreview();
  }

  function updatePreview() {
    const selection = selectedItem();
    const preview = document.getElementById('marketItemPreview');
    const previewName = document.getElementById('marketItemPreviewName');
    const previewId = document.getElementById('marketItemPreviewId');
    const previewImage = document.getElementById('marketItemPreviewImage');
    if (!selection || !preview) return;
    previewName.textContent = `${selection.label} · T${selection.id.match(/^T(\d+)/)?.[1] || ''}.${document.getElementById('marketItemEnchant')?.value || 0}`;
    previewId.textContent = selection.id;
    previewImage.src = image(selection.id);
    previewImage.alt = selection.label;
    previewImage.addEventListener('error', () => { previewImage.classList.add('image-unavailable'); }, { once: true });
    preview.classList.remove('is-empty');
  }

  function setSelection(id) {
    const parsed = catalog()?.parseId?.(id);
    const item = parsed && itemByBase(parsed.baseId);
    if (!item) return;
    const search = document.getElementById('marketItemSearch');
    if (search) search.value = '';
    populateItemSelect('');
    const base = document.getElementById('marketItemBase');
    if (base) base.value = item.id;
    const tier = document.getElementById('marketItemTier');
    if (tier) tier.value = String(parsed.tier);
    const enchant = document.getElementById('marketItemEnchant');
    if (enchant) enchant.value = String(parsed.enchant);
    updatePreview();
  }

  function selectionInput() {
    const selection = selectedItem();
    return selection ? {
      ...selection,
      city: document.getElementById('marketWatchCity')?.value || 'ALL',
      minProfit: document.getElementById('marketMinProfit')?.value || 0
    } : null;
  }

  function inject() {
    const anchor = document.getElementById('marketApp');
    if (!anchor || document.getElementById('marketDock')) return Boolean(anchor);
    const dock = document.createElement('section');
    dock.id = 'marketDock';
    dock.className = 'market-dock bg-albion-800 border border-gray-700 rounded-2xl p-4 md:p-5 shadow-lg shrink-0';
    dock.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div><div class="flex flex-wrap items-center gap-2"><i class="fa-solid fa-gauge-high text-albion-accent"></i><h2 class="text-base md:text-lg font-black text-white">${t('market-dockTitle', 'Pazar Kokpiti')}</h2><span class="market-pill"><i class="fa-solid fa-bolt mr-1"></i>${t('market-freshWindow', '1 sn – 3 saat taze veri')}</span></div><p class="text-xs text-gray-400 mt-1">${t('market-dockDesc', 'Daha az istek, daha temiz sonuç ve kişisel kâr takibi.')}</p></div>
        <div class="flex items-center gap-2"><span id="marketRuntimeStatus" class="text-xs text-gray-400">${t('market-queueReady', 'Pazar kuyruğu hazır')}</span><button id="marketCheckAll" type="button" class="market-action"><i class="fa-solid fa-rotate mr-1"></i>${t('market-checkAlerts', 'Takibi kontrol et')}</button></div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4"><label class="market-field"><span>${t('market-capital', 'Sermaye')}</span><input id="marketCapital" type="number" min="0" step="1000" value="${Number(profile.capital) || 0}"></label><label class="market-field"><span>${t('market-buyTax', 'Alış vergisi %')}</span><input id="marketBuyTax" type="number" min="0" max="30" step="0.1" value="${Number(profile.buyTax) || 0}"></label><label class="market-field"><span>${t('market-sellTax', 'Satış vergisi %')}</span><input id="marketSellTax" type="number" min="0" max="30" step="0.1" value="${Number(profile.sellTax) || 0}"></label><label class="market-field"><span>${t('market-risk', 'Risk tercihi')}</span><select id="marketRisk"><option value="safe">${t('market-riskSafe', 'Güvenli bölge')}</option><option value="balanced">${t('market-riskBalanced', 'Dengeli')}</option><option value="black">${t('market-riskBlack', 'Black Zone')}</option></select></label></div>
      <label class="market-check"><input id="marketFocus" type="checkbox" ${profile.focus ? 'checked' : ''}><span>${t('market-focus', 'Focus kullanıyorum; Focus kârını ayrıca göster')}</span></label>
      <div class="market-auto mt-5 pt-4 border-t border-white/10"><div class="market-section-title"><span><i class="fa-solid fa-wand-magic-sparkles mr-1 text-albion-accent"></i>${t('market-autoTitle', 'Otomatik fırsat taraması')}</span><span class="market-pill">${t('market-autoServer', 'Seçili sunucuya göre')}</span></div><p class="text-xs text-gray-500 mb-3">${t('market-autoDesc', 'Popüler eşyaları sermayenize ve güncel fiyatlara göre otomatik analiz ediyoruz.')}</p><div id="marketAutoOpportunities" class="market-auto-grid"><p class="market-empty">${t('market-autoLoading', 'Eşyalar otomatik analiz ediliyor…')}</p></div></div>
      <div class="mt-5 pt-4 border-t border-white/10"><div class="market-section-title"><span><i class="fa-solid fa-star mr-1 text-yellow-400"></i>${t('market-pickerTitle', 'Eşya seç ve analiz et')}</span><span class="market-pill">${t('market-pickerHint', 'ID yazmak zorunda değilsiniz')}</span></div><p class="text-xs text-gray-500">${t('market-pickerDesc', 'Türkçe eşya adıyla arayın, seviyeyi seçin; fiyat ve kâr verisini hemen görün.')}</p>
        <div class="market-picker mt-3"><div id="marketItemPreview" class="market-item-preview"><img id="marketItemPreviewImage" class="market-item-icon" alt=""><div><strong id="marketItemPreviewName"></strong><code id="marketItemPreviewId"></code></div></div><div class="market-picker-controls"><label class="market-field"><span>${t('market-itemSearch', 'Eşya ara')}</span><input id="marketItemSearch" type="search" placeholder="${t('market-itemSearchPlaceholder', 'Kılıç, yay, deri…')}" autocomplete="off"></label><label class="market-field"><span>${t('market-itemName', 'Eşya')}</span><select id="marketItemBase"></select></label><div class="grid grid-cols-2 gap-2"><label class="market-field"><span>${t('market-tier', 'Seviye')}</span><select id="marketItemTier"><option value="4">T4</option><option value="5">T5</option><option value="6" selected>T6</option><option value="7">T7</option><option value="8">T8</option></select></label><label class="market-field"><span>${t('market-enchant', 'Büyü')}</span><select id="marketItemEnchant"><option value="0">.0</option><option value="1">.1</option><option value="2">.2</option><option value="3">.3</option><option value="4">.4</option></select></label></div></div></div>
        <div class="market-watch-form mt-3"><label class="market-field"><span>${t('market-watchCity', 'Alış şehri')}</span><select id="marketWatchCity"><option value="ALL">${t('market-cityAll', 'En ucuz şehir')}</option><option>Lymhurst</option><option>Bridgewatch</option><option>Fort Sterling</option><option>Martlock</option><option>Thetford</option></select></label><label class="market-field"><span>${t('market-minProfit', 'Min. kâr')}</span><input id="marketMinProfit" type="number" min="0" step="1000" value="0"></label><button id="marketAnalyzeItem" type="button" class="market-action"><i class="fa-solid fa-chart-line mr-1"></i>${t('market-analyzeItem', 'Şimdi analiz et')}</button><button id="marketAddWatch" type="button" class="market-primary"><i class="fa-solid fa-star mr-1"></i>${t('market-addWatch', 'Takibe ekle')}</button></div><div id="marketSelectedAnalysis" class="mt-3"></div>
      </div><div id="marketWatchList" class="mt-4"></div><div id="marketRecentList" class="mt-3"></div><div id="marketAlertList" class="mt-3"></div>`;
    anchor.appendChild(dock);
    document.getElementById('marketRisk').value = profile.risk;
    bind(dock);
    populateItemSelect();
    return true;
  }

  function connectFavorites() {
    if (favoritesConnected || !window.MarketFavorites) return Boolean(window.MarketFavorites);
    favoritesConnected = true;
    window.MarketFavorites.subscribe(render);
    render();
    return true;
  }

  async function analyzeSelected() {
    const input = selectionInput();
    const target = document.getElementById('marketSelectedAnalysis');
    if (!input || !target || !window.MarketFavorites?.analyze) return;
    const token = ++analysisToken;
    target.innerHTML = `<p class="market-empty"><i class="fa-solid fa-spinner fa-spin mr-1"></i>${t('market-analysisLoading', 'Seçilen eşya analiz ediliyor…')}</p>`;
    try {
      const result = await window.MarketFavorites.analyze(input);
      if (token !== analysisToken) return;
      renderAnalysis(result);
    } catch (error) {
      target.innerHTML = `<p class="market-empty is-error">${escapeHtml(t('market-status-error', 'Pazar verisi alınamadı.'))}</p>`;
    }
  }

  function renderAnalysis(result) {
    const target = document.getElementById('marketSelectedAnalysis');
    if (!target) return;
    const label = escapeHtml(result.label || result.id);
    if (result.status !== 'hit' && !result.profit) {
      target.innerHTML = `<div class="market-result"><b>${label}</b><span>${escapeHtml(t(`market-status-${result.status}`, 'Taze fırsat bulunamadı'))}</span></div>`;
      return;
    }
    target.innerHTML = `<div class="market-result ${result.status === 'hit' ? 'is-hit' : ''}"><img class="market-result-icon" src="${escapeHtml(image(result.id))}" alt=""><b>${label}</b><span>${escapeHtml(result.source)} → ${escapeHtml(result.target)}</span><strong>${Number(result.profit).toLocaleString()} 🥈</strong><small>${escapeHtml(result.age || '')}</small><button type="button" class="market-inline-action" data-market-detail="${escapeHtml(result.id)}"><i class="fa-solid fa-arrow-up-right-from-square"></i>${t('itemInspector-open', 'Detay')}</button></div>`;
  }

  async function loadAutoOpportunities() {
    const target = document.getElementById('marketAutoOpportunities');
    if (!target || !window.MarketLive?.findOpportunities || !catalog()) return;
    target.innerHTML = `<p class="market-empty"><i class="fa-solid fa-spinner fa-spin mr-1"></i>${t('market-autoLoading', 'Eşyalar otomatik analiz ediliyor…')}</p>`;
    try {
      const ids = catalog().featured.map((baseId) => catalog().buildId(baseId, 6, 0));
      const results = await window.MarketLive.findOpportunities(ids, 6);
      if (!results.length) { target.innerHTML = `<p class="market-empty">${t('market-autoNone', 'Şu anda sermayenize uygun taze fırsat bulunamadı.')}</p>`; return; }
      target.innerHTML = results.map((result) => {
        const parsed = catalog().parseId(result.item);
        const item = parsed && catalog().find(parsed.baseId);
        const label = item ? catalog().label(item) : result.item;
        return `<button type="button" class="market-auto-card" data-market-select-id="${escapeHtml(result.item)}"><img class="market-item-icon small" src="${escapeHtml(image(result.item))}" alt=""><span><b>${escapeHtml(label)}</b><small>${escapeHtml(result.from)} → ${escapeHtml(result.to)}</small></span><strong>+${Number(result.profit).toLocaleString()} 🥈</strong></button>`;
      }).join('');
    } catch (error) {
      target.innerHTML = `<p class="market-empty is-error">${t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.')}</p>`;
    }
  }

  function bind(dock) {
    ['marketCapital', 'marketBuyTax', 'marketSellTax', 'marketRisk', 'marketFocus'].forEach((id) => document.getElementById(id)?.addEventListener('change', async (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      const key = id.replace('market', '').replace(/^./, (letter) => letter.toLowerCase());
      profile[key] = event.target.type === 'number' ? Number(value) : value;
      await saveProfile();
      loadAutoOpportunities();
    }));
    document.getElementById('marketItemSearch')?.addEventListener('input', (event) => populateItemSelect(event.target.value));
    ['marketItemBase', 'marketItemTier', 'marketItemEnchant'].forEach((id) => document.getElementById(id)?.addEventListener('change', updatePreview));
    document.getElementById('marketAnalyzeItem')?.addEventListener('click', analyzeSelected);
    document.getElementById('marketAddWatch')?.addEventListener('click', async () => {
      try {
        const input = selectionInput();
        if (!input || !window.MarketFavorites) throw new Error(t('market-notReady', 'Takip sistemi henüz hazır değil.'));
        await window.MarketFavorites.addFavorite(input);
        showToast(`${input.label} · ${t('market-added', 'Eşya takibe alındı.')}`);
      } catch (error) { showToast(error?.message || t('market-error', 'İşlem tamamlanamadı.'), true); }
    });
    document.getElementById('marketCheckAll')?.addEventListener('click', async () => {
      const button = document.getElementById('marketCheckAll');
      if (!window.MarketFavorites) return;
      button.disabled = true;
      try { lastResults = await window.MarketFavorites.checkAll(); renderResults(); }
      catch (error) { showToast(t('market-status-error', 'Pazar verisi alınamadı.'), true); }
      finally { button.disabled = false; }
    });
    dock.addEventListener('click', (event) => {
      const remove = event.target.closest('[data-remove-watch]');
      if (remove) window.MarketFavorites?.removeFavorite(remove.dataset.removeWatch);
      const auto = event.target.closest('[data-market-select-id]');
      if (auto) { setSelection(auto.dataset.marketSelectId); analyzeSelected(); }
    });
    document.addEventListener('click', (event) => {
      const recent = event.target.closest('[data-recent-search]');
      if (recent) { const input = document.getElementById('manualSearchInput'); if (input) { input.value = recent.dataset.recentSearch; input.dispatchEvent(new Event('input')); } }
    });
    window.addEventListener('market_select_item', (event) => {
      const id = event.detail?.id;
      if (!id) return;
      setSelection(id);
      analyzeSelected();
    });
  }

  function render() {
    const list = document.getElementById('marketWatchList');
    const recent = document.getElementById('marketRecentList');
    if (!list || !window.MarketFavorites) return;
    const items = window.MarketFavorites.favorites;
    list.innerHTML = `<div class="market-section-title"><span><i class="fa-solid fa-star mr-1 text-yellow-400"></i>${t('market-watchTitle', 'Takip listesi')}</span><span class="text-gray-500">${items.length}/25</span></div>${items.length ? `<div class="flex flex-wrap gap-2">${items.map((item) => `<span class="market-chip"><img class="market-chip-icon" src="${escapeHtml(image(item.id))}" alt=""><b>${escapeHtml(displayLabel(item.id, item.label))}</b><small>${escapeHtml(item.id)}</small>${item.minProfit ? ` · ≥ ${Number(item.minProfit).toLocaleString()}` : ''}<button type="button" aria-label="${t('market-remove', 'Takipten çıkar')}" data-remove-watch="${escapeHtml(item.id)}"><i class="fa-solid fa-xmark"></i></button></span>`).join('')}</div>` : `<p class="market-empty">${t('market-emptyWatch', 'Henüz eşya takibi yok. Yukarıdan bir eşya seçin.')}</p>`}`;
    recent.innerHTML = window.MarketFavorites.recent.length ? `<div class="market-section-title"><span><i class="fa-solid fa-clock-rotate-left mr-1"></i>${t('market-recent', 'Son aramalar')}</span></div><div class="flex flex-wrap gap-2">${window.MarketFavorites.recent.map((item) => `<button type="button" class="market-chip" data-recent-search="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div>` : '';
    renderResults();
  }

  function renderResults() {
    const target = document.getElementById('marketAlertList');
    if (!target || !lastResults.length) { if (target) target.innerHTML = ''; return; }
    target.innerHTML = `<div class="market-section-title"><span><i class="fa-solid fa-bell mr-1 text-albion-accent"></i>${t('market-alertTitle', 'Takip sonucu')}</span></div><div class="grid md:grid-cols-2 gap-2">${lastResults.map((item) => `<div class="market-result ${item.status === 'hit' ? 'is-hit' : ''}"><img class="market-result-icon" src="${escapeHtml(image(item.id))}" alt=""><b>${escapeHtml(displayLabel(item.id, item.label))}</b><span>${item.status === 'hit' ? `+${Number(item.profit).toLocaleString()} 🥈 · ${escapeHtml(item.source)} → ${escapeHtml(item.target)}` : t(`market-status-${item.status}`, 'Taze fırsat bulunamadı')}</span><small>${escapeHtml(item.age || t('market-noFresh', '3 saat içinde veri yok'))}</small></div>`).join('')}</div>`;
  }

  function showToast(message, error = false) {
    const toast = document.createElement('div');
    toast.className = `market-toast ${error ? 'is-error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  async function initialize() {
    try {
      await loadProfile();
      if (!inject()) return;
      if (!connectFavorites()) window.addEventListener('market_favorites_ready', connectFavorites, { once: true });
      loadAutoOpportunities();
      window.addEventListener('app_settings_updated', loadAutoOpportunities);
      window.addEventListener('economy_profile_updated', (event) => {
        profile = { ...profile, ...(event.detail || {}) };
        const values = { marketCapital: profile.capital, marketBuyTax: profile.buyTax, marketSellTax: profile.sellTax, marketRisk: profile.risk };
        Object.entries(values).forEach(([id, value]) => { const field = document.getElementById(id); if (field && document.activeElement !== field) field.value = value; });
        const focus = document.getElementById('marketFocus');
        if (focus && document.activeElement !== focus) focus.checked = Boolean(profile.focus);
        loadAutoOpportunities();
      });
    } catch (error) { console.error('Market cockpit initialization failed', error); }
  }

  document.addEventListener('DOMContentLoaded', initialize);
})();
