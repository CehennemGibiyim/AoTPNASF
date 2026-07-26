/* Shared item intelligence drawer: one place for live price, route, margin and next actions. */
(function () {
  const t = (key, fallback) => {
    try {
      const value = window.miniappI18n?.t?.(key) || window.t?.(key, fallback);
      return value && value !== key ? value : fallback;
    } catch (error) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const money = (value) => Number(value || 0).toLocaleString('tr-TR');
  let drawer;
  let activeId = '';
  let requestToken = 0;

  function info(id) {
    const clean = String(id || '').trim().toUpperCase();
    const parsed = window.MarketItemCatalog?.parseId?.(clean);
    const base = parsed && window.MarketItemCatalog?.find?.(parsed.baseId);
    return {
      id: clean,
      label: window.ItemCard?.name?.(clean) || (base ? window.MarketItemCatalog.label(base) : clean.replace(/^T\d+_/, '').replace(/@\d+$/, '').replace(/_/g, ' ')),
      icon: window.ItemCard?.image?.(clean, 1, 96) || window.MarketItemCatalog?.iconUrl?.(clean) || ''
    };
  }

  function mount() {
    if (drawer) return;
    drawer = document.createElement('aside');
    drawer.id = 'itemInspector';
    drawer.className = 'item-inspector hidden';
    drawer.innerHTML = `<div class="item-inspector-backdrop" data-inspector-close></div><div class="item-inspector-panel" role="dialog" aria-modal="true" aria-labelledby="itemInspectorTitle"><div class="item-inspector-head"><div><span class="eyebrow"><i class="fa-solid fa-crosshairs"></i> ${esc(t('itemInspector-eyebrow', 'EŞYA İSTİHBARATI'))}</span><h2 id="itemInspectorTitle">${esc(t('itemInspector-title', 'Eşya detayları'))}</h2></div><button type="button" class="item-inspector-close" data-inspector-close aria-label="${esc(t('itemInspector-close', 'Kapat'))}"><i class="fa-solid fa-xmark"></i></button></div><div id="itemInspectorBody" class="item-inspector-body"></div></div>`;
    document.body.appendChild(drawer);
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('[data-inspector-close]')) close();
      const action = event.target.closest('[data-inspector-action]');
      if (!action) return;
      if (action.dataset.inspectorAction === 'watch') addWatch();
      if (action.dataset.inspectorAction === 'alert') { close(); window.dispatchEvent(new CustomEvent('market_open_alert_editor', { detail: { id: activeId } })); }
      if (action.dataset.inspectorAction === 'market') openInMarket();
    });
  }

  function openInMarket() {
    const id = activeId;
    close();
    document.querySelector('[data-tab="tab-market"]')?.click();
    window.dispatchEvent(new CustomEvent('market_select_item', { detail: { id } }));
  }

  async function addWatch() {
    const current = info(activeId);
    try {
      await window.MarketFavorites?.addFavorite({ id: current.id, label: current.label, city: 'ALL', minProfit: 0 });
      toast(t('itemInspector-watchSaved', 'Eşya takip listesine eklendi.'));
    } catch (error) { toast(t('itemInspector-watchError', 'Takibe eklenemedi.'), true); }
  }

  function toast(message, error = false) {
    const node = document.createElement('div');
    node.className = `market-toast ${error ? 'is-error' : ''}`;
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  }

  function renderLoading(current) {
    drawer.querySelector('#itemInspectorBody').innerHTML = `<div class="item-inspector-identity"><img src="${esc(current.icon)}" alt="${esc(current.label)}"><div><h3>${esc(current.label)}</h3><code>${esc(current.id)}</code></div></div><div class="item-inspector-loading"><i class="fa-solid fa-spinner fa-spin"></i><span>${esc(t('itemInspector-loading', 'Canlı pazar verisi analiz ediliyor…'))}</span></div>`;
  }

  function render(current, result) {
    const hasPrice = Number(result?.buyPrice) > 0 || Number(result?.sellPrice) > 0;
    const profit = Number(result?.profit || 0);
    const capital = Number(window.EconomyProfile?.get?.().capital || window.MarketProfile?.capital || 0);
    const affordable = hasPrice && (capital <= 0 || !result?.buyPrice || capital >= result.buyPrice);
    const age = result?.age || t('itemInspector-unknownAge', 'Veri yaşı bilinmiyor');
    const trust = !hasPrice ? t('itemInspector-trustNone', 'Veri yok') : String(age).includes('sn') || String(age).includes('dk') ? t('itemInspector-trustHigh', 'Yüksek') : t('itemInspector-trustMedium', 'Orta');
    const status = result?.status === 'hit' ? t('itemInspector-opportunity', 'Fırsat bulundu') : t('itemInspector-noOpportunity', 'Şu an net fırsat yok');
    drawer.querySelector('#itemInspectorBody').innerHTML = `<div class="item-inspector-identity"><img src="${esc(current.icon)}" alt="${esc(current.label)}"><div><h3>${esc(current.label)}</h3><code>${esc(current.id)}</code><span>${esc(status)}</span></div></div><div class="item-inspector-grid"><div><span>${esc(t('itemInspector-buy', 'En ucuz alış'))}</span><strong>${hasPrice && result.buyPrice ? `${money(result.buyPrice)} 🥈` : '—'}</strong><small>${esc(result?.source || t('itemInspector-noData', 'Veri yok'))}</small></div><div><span>${esc(t('itemInspector-sell', 'En iyi satış'))}</span><strong>${hasPrice && result.sellPrice ? `${money(result.sellPrice)} 🥈` : '—'}</strong><small>${esc(result?.target || t('itemInspector-noData', 'Veri yok'))}</small></div><div><span>${esc(t('itemInspector-net', 'Tahmini net kâr'))}</span><strong class="${profit >= 0 ? 'positive' : 'negative'}">${hasPrice ? `${profit >= 0 ? '+' : ''}${money(profit)} 🥈` : '—'}</strong><small>${esc(t('itemInspector-afterTax', 'Vergi sonrası rota hesabı'))}</small></div><div><span>${esc(t('itemInspector-confidence', 'Veri güveni'))}</span><strong>${esc(trust)}</strong><small>${esc(age)}</small></div></div><div class="item-inspector-note ${affordable ? '' : 'is-warning'}"><i class="fa-solid ${affordable ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i><span>${esc(!hasPrice ? t('itemInspector-noMarketData', 'Bu eşya için güncel şehir verisi bulunamadı.') : affordable ? t('itemInspector-affordable', 'Profil sermayen bu alış için yeterli görünüyor.') : t('itemInspector-expensive', 'Bu eşya profil sermayeni aşıyor; fırsat kilitlenebilir.'))}</span></div><div class="item-inspector-actions"><button type="button" class="market-primary" data-inspector-action="watch"><i class="fa-solid fa-star"></i>${esc(t('itemInspector-watch', 'Takibe ekle'))}</button><button type="button" class="market-action" data-inspector-action="alert"><i class="fa-solid fa-bell"></i>${esc(t('itemInspector-alert', 'Fiyat alarmı kur'))}</button><button type="button" class="market-action" data-inspector-action="market"><i class="fa-solid fa-gauge-high"></i>${esc(t('itemInspector-market', 'Pazarda aç'))}</button></div><p class="item-inspector-disclaimer"><i class="fa-solid fa-circle-info"></i>${esc(t('itemInspector-disclaimer', 'Bu rakamlar canlı fiyat verisine dayalı tahminlerdir; satış süresi ve piyasa değişimi sonucu etkileyebilir.'))}</p>`;
  }

  async function open(id) {
    mount();
    activeId = String(id || '').trim().toUpperCase();
    if (!activeId) return;
    const current = info(activeId);
    drawer.classList.remove('hidden');
    document.body.classList.add('item-inspector-open');
    renderLoading(current);
    const token = ++requestToken;
    try {
      const result = await window.MarketFavorites?.analyze?.({ id: current.id, label: current.label, city: 'ALL', minProfit: 0 });
      if (token === requestToken) render(current, result || { status: 'empty' });
    } catch (error) { if (token === requestToken) render(current, { status: 'error' }); }
  }
  function close() { drawer?.classList.add('hidden'); document.body.classList.remove('item-inspector-open'); }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-market-detail]');
    if (button) open(button.dataset.marketDetail);
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !drawer?.classList.contains('hidden')) close(); });
  document.addEventListener('DOMContentLoaded', mount);
})();
