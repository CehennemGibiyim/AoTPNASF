/* Market Center: watchlist management, best opportunities, history and realized profit ledger. */
(function () {
  const LEDGER_KEY = 'aot_pnasf_market_ledger';
  const t = (key, fallback) => {
    try {
      const translated = window.miniappI18n?.t?.(key);
      if (translated && translated !== key) return translated;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (error) {}
    return fallback;
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  let ledger = [];
  let modal;

  function itemInfo(itemId) {
    const id = String(itemId || '').trim().toUpperCase();
    const parsed = window.MarketItemCatalog?.parseId?.(id);
    const base = parsed ? window.MarketItemCatalog?.find?.(parsed.baseId) : null;
    const label = window.ItemCard?.name?.(id) || (base ? window.MarketItemCatalog.label(base) : id.replace(/^T\d+_/, '').replace(/@\d+$/, '').replace(/_/g, ' '));
    return { id, label, icon: window.ItemCard?.image?.(id, 1, 64) || window.ItemCard?.placeholder?.(id) || '' };
  }

  function setupLedgerPicker() {
    const input = modal?.querySelector('#ledgerItem');
    const catalog = window.MarketItemCatalog;
    if (!input || !catalog?.items?.length) return;
    const select = document.createElement('select');
    select.id = 'ledgerItem';
    select.className = input.className;
    select.innerHTML = catalog.items.map((item) => {
      const id = catalog.buildId(item.id, 6, 0);
      return `<option value="${esc(id)}">${esc(catalog.label(item))} · T6.0</option>`;
    }).join('');
    input.replaceWith(select);
    const label = select.closest('label');
    if (!label) return;
    const preview = document.createElement('div');
    preview.className = 'ledger-item-preview';
    const update = () => {
      const info = itemInfo(select.value);
      preview.innerHTML = `<img src="${esc(info.icon)}" alt="${esc(info.label)}" loading="lazy" data-image-fallback="item"><span>${esc(info.label)}</span>`;
    };
    select.addEventListener('change', update);
    label.appendChild(preview);
    update();
  }

  async function readLedger() {
    try { const raw = await window.miniappsAI?.storage?.getItem(LEDGER_KEY, { area: 'persistent' }); ledger = raw ? JSON.parse(raw) : []; } catch (error) { ledger = []; }
  }
  async function saveLedger() {
    try { await window.miniappsAI?.storage?.setItem(LEDGER_KEY, JSON.stringify(ledger.slice(0, 100)), { area: 'persistent' }); } catch (error) {}
  }
  function inject() {
    const dock = document.getElementById('marketDock');
    if (!dock || document.getElementById('marketCenterBtn')) return Boolean(dock);
    const actions = document.createElement('div');
    actions.className = 'market-center-actions';
    actions.innerHTML = `<button id="marketCenterBtn" type="button" class="market-action"><i class="fa-solid fa-layer-group mr-1"></i>${t('market-centerOpen', 'Pazar Merkezi')}</button><button id="marketBestBtn" type="button" class="market-primary"><i class="fa-solid fa-wand-magic-sparkles mr-1"></i>${t('market-bestNow', 'Sermayeme göre fırsatlar')}</button>`;
    dock.querySelector('#marketWatchList')?.before(actions);
    modal = document.createElement('div');
    modal.id = 'marketCenterModal';
    modal.className = 'market-modal hidden';
    modal.innerHTML = `<div class="market-modal-backdrop" data-close-market></div><div class="market-modal-card" role="dialog" aria-modal="true" aria-labelledby="marketCenterTitle"><div class="market-modal-header"><div><h2 id="marketCenterTitle"><i class="fa-solid fa-layer-group text-albion-accent mr-2"></i>${t('market-centerTitle', 'Pazar Merkezi')}</h2><p>${t('market-centerDesc', 'Favoriler, canlı fırsatlar, fiyat geçmişi ve gerçekleşen kâr tek yerde.')}</p></div><button type="button" class="market-modal-close" aria-label="${t('market-close', 'Kapat')}" data-close-market><i class="fa-solid fa-xmark"></i></button></div><div class="market-center-tabs"><button class="is-active" data-center-tab="opportunities">${t('market-centerOpp', 'Fırsatlar')}</button><button data-center-tab="watchlist">${t('market-centerWatch', 'Favoriler')}</button><button data-center-tab="ledger">${t('market-centerLedger', 'Kâr defteri')}</button></div><div class="market-modal-body"><section data-center-panel="opportunities"><div class="market-center-toolbar"><span id="marketOpportunityStatus">${t('market-centerReady', 'Sermayenize uygun taze fırsatları bulun.')}</span><button id="marketLoadBest" type="button" class="market-primary">${t('market-findBest', 'Fırsatları getir')}</button></div><div id="marketOpportunityList" class="market-center-list"></div><div class="market-history-wrap"><h3>${t('market-historyTitle', 'Fiyat geçmişi')}</h3><p id="marketHistoryEmpty">${t('market-historyEmpty', 'Bir fırsatta “Geçmiş” seçin.')}</p><canvas id="marketHistoryChart"></canvas></div></section><section class="hidden" data-center-panel="watchlist"><div class="market-center-toolbar"><span>${t('market-centerWatchDesc', 'Takip ettiğiniz eşyaları yönetin ve hedefleri görün.')}</span><span id="marketCenterWatchCount"></span></div><div id="marketCenterWatchList" class="market-center-list"></div></section><section class="hidden" data-center-panel="ledger"><div class="market-ledger-form"><label>${t('ledger-item', 'Eşya ID')}<input id="ledgerItem" placeholder="T6_MAIN_SWORD@4"></label><label>${t('ledger-qty', 'Miktar')}<input id="ledgerQty" type="number" min="1" value="1"></label><label>${t('ledger-buy', 'Toplam alış')}<input id="ledgerBuy" type="number" min="0" value="0"></label><label>${t('ledger-sell', 'Toplam satış')}<input id="ledgerSell" type="number" min="0" value="0"></label><button id="ledgerAdd" type="button" class="market-primary">${t('ledger-add', 'İşlemi kaydet')}</button></div><div id="ledgerSummary" class="market-ledger-summary"></div><div id="ledgerList" class="market-center-list"></div></section></div></div>`;
    document.body.appendChild(modal);
    setupLedgerPicker();
    actions.querySelector('#marketCenterBtn').addEventListener('click', () => open('opportunities'));
    actions.querySelector('#marketBestBtn').addEventListener('click', () => { open('opportunities'); loadBest(); });
    modal.addEventListener('click', (event) => { if (event.target.closest('[data-close-market]')) close(); });
    modal.querySelectorAll('[data-center-tab]').forEach((button) => button.addEventListener('click', () => open(button.dataset.centerTab)));
    modal.querySelector('#marketLoadBest').addEventListener('click', loadBest);
    modal.querySelector('#ledgerAdd').addEventListener('click', addLedgerEntry);
    renderWatchlist();
    renderLedger();
    return true;
  }
  function open(tab) { modal?.classList.remove('hidden'); document.body.classList.add('market-modal-open'); switchTab(tab); }
  function close() { modal?.classList.add('hidden'); document.body.classList.remove('market-modal-open'); }
  function switchTab(tab) { modal?.querySelectorAll('[data-center-tab]').forEach((button) => button.classList.toggle('is-active', button.dataset.centerTab === tab)); modal?.querySelectorAll('[data-center-panel]').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.centerPanel !== tab)); if (tab === 'watchlist') renderWatchlist(); if (tab === 'ledger') renderLedger(); }
  async function loadBest() {
    const list = document.getElementById('marketOpportunityList');
    const status = document.getElementById('marketOpportunityStatus');
    if (!list || !window.MarketLive?.findOpportunities) return;
    list.innerHTML = `<div class="market-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('market-centerLoading', 'Sunucuya göre fırsatlar analiz ediliyor…')}</div>`;
    try {
      const rows = await window.MarketLive.findOpportunities(undefined, 12);
      status.textContent = rows.length ? `${rows.length} ${t('market-centerFound', 'taze fırsat bulundu')} · ${window.AppConfig?.server?.toUpperCase() || 'EU'}` : t('market-centerNone', 'Sermayenize uygun taze fırsat yok.');
      list.innerHTML = rows.length ? rows.map((row) => `<article class="market-opportunity"><img class="market-item-icon" src="${esc(itemInfo(row.item).icon)}" alt="${esc(itemInfo(row.item).label)}" loading="lazy" data-image-fallback="item"><div><strong>${esc(itemInfo(row.item).label)}</strong><span>${esc(row.from)} → ${esc(row.to)} · ${esc(row.age)}</span></div><b>+${row.profit.toLocaleString()} 🥈</b><em>${t('market-confidence', 'Güven')} %${row.confidence}</em><button type="button" data-history-item="${esc(row.item)}">${t('market-history', 'Geçmiş')}</button></article>`).join('') : `<p class="market-empty">${t('market-centerNone', 'Sermayenize uygun taze fırsat yok.')}</p>`;
      list.querySelectorAll('[data-history-item]').forEach((button) => button.addEventListener('click', () => loadHistory(button.dataset.historyItem)));
    } catch (error) { status.textContent = t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.'); list.innerHTML = ''; }
  }
  async function loadHistory(item) {
    const empty = document.getElementById('marketHistoryEmpty');
    const canvas = document.getElementById('marketHistoryChart');
    if (!empty || !canvas || !window.MarketLive?.fetchHistory) return;
    empty.textContent = t('market-historyLoading', 'Fiyat geçmişi yükleniyor…');
    try {
      const rows = await window.MarketLive.fetchHistory(item);
      const points = rows.map((row) => Number(row.avg_price || row.sell_price_min || row.price)).filter(Boolean).slice(-30);
      if (!points.length || typeof Chart === 'undefined') throw new Error('empty');
      Chart.getChart?.(canvas)?.destroy();
      new Chart(canvas, { type: 'line', data: { labels: points.map((_, index) => `${index + 1}`), datasets: [{ label: itemInfo(item).label, data: points, borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,.12)', fill: true, tension: .3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } } });
      empty.textContent = `${itemInfo(item).label} · ${points.length} ${t('market-historyPoints', 'veri noktası')}`;
    } catch (error) { empty.textContent = t('market-historyUnavailable', 'Bu eşya için fiyat geçmişi bulunamadı.'); }
  }
  function renderWatchlist() {
    const target = document.getElementById('marketCenterWatchList');
    const count = document.getElementById('marketCenterWatchCount');
    const items = window.MarketFavorites?.favorites || [];
    if (!target) return;
    if (count) count.textContent = `${items.length}/25`;
    target.innerHTML = items.length ? items.map((item) => `<article class="market-watch-row"><img class="market-item-icon small" src="${esc(itemInfo(item.id).icon)}" alt="${esc(itemInfo(item.id).label)}" loading="lazy" data-image-fallback="item"><div><strong>${esc(itemInfo(item.id).label)}</strong><small class="market-item-code">${esc(item.id)}</small><span>${esc(item.city === 'ALL' ? t('market-cityAll', 'En ucuz şehir') : item.city)} · ≥ ${Number(item.minProfit || 0).toLocaleString()} 🥈</span></div><button type="button" data-remove-watch="${esc(item.id)}">${t('market-remove', 'Takipten çıkar')}</button></article>`).join('') : `<p class="market-empty">${t('market-emptyWatch', 'Henüz eşya takibi yok.')}</p>`;
    target.querySelectorAll('[data-remove-watch]').forEach((button) => button.addEventListener('click', async () => { await window.MarketFavorites?.removeFavorite(button.dataset.removeWatch); renderWatchlist(); }));
  }
  async function addLedgerEntry() {
    const item = document.getElementById('ledgerItem')?.value.trim().toUpperCase();
    const qty = Math.max(1, Number(document.getElementById('ledgerQty')?.value) || 1);
    const buy = Math.max(0, Number(document.getElementById('ledgerBuy')?.value) || 0);
    const sell = Math.max(0, Number(document.getElementById('ledgerSell')?.value) || 0);
    if (!item || !buy || !sell) return;
    ledger = [{ id: crypto.randomUUID?.() || String(Date.now()), item, qty, buy, sell, profit: sell - buy, date: new Date().toISOString() }, ...ledger].slice(0, 100);
    await saveLedger();
    const ledgerPicker = document.getElementById('ledgerItem');
    if (ledgerPicker?.tagName === 'SELECT') {
      ledgerPicker.selectedIndex = 0;
      ledgerPicker.dispatchEvent(new Event('change'));
    } else if (ledgerPicker) ledgerPicker.value = '';
    document.getElementById('ledgerBuy').value = '0'; document.getElementById('ledgerSell').value = '0'; renderLedger();
  }
  function renderLedger() {
    const target = document.getElementById('ledgerList');
    const summary = document.getElementById('ledgerSummary');
    if (!target || !summary) return;
    const total = ledger.reduce((sum, entry) => sum + Number(entry.profit || 0), 0);
    summary.innerHTML = `<strong>${t('ledger-total', 'Toplam gerçekleşen kâr')}</strong><b class="${total >= 0 ? 'positive' : 'negative'}">${total >= 0 ? '+' : ''}${total.toLocaleString()} 🥈</b>`;
    target.innerHTML = ledger.length ? ledger.map((entry) => `<article class="market-ledger-row"><img class="market-item-icon small" src="${esc(itemInfo(entry.item).icon)}" alt="${esc(itemInfo(entry.item).label)}" loading="lazy" data-image-fallback="item"><div><strong>${esc(itemInfo(entry.item).label)}</strong><small class="market-item-code">${esc(entry.item)}</small><span>${entry.qty} ${t('ledger-units', 'adet')} · ${new Date(entry.date).toLocaleDateString()}</span></div><b class="${entry.profit >= 0 ? 'positive' : 'negative'}">${entry.profit >= 0 ? '+' : ''}${Number(entry.profit).toLocaleString()} 🥈</b></article>`).join('') : `<p class="market-empty">${t('ledger-empty', 'Henüz gerçekleşmiş işlem eklenmedi.')}</p>`;
  }
  document.addEventListener('DOMContentLoaded', async () => { await readLedger(); if (!inject()) window.addEventListener('market_favorites_ready', inject, { once: true }); window.MarketFavorites?.subscribe(renderWatchlist); });
})();
