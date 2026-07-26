/* Connects upcoming prime events to live item opportunities without duplicating the market engine. */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  const esc = (value) => window.ItemCard?.escape?.(value) || String(value ?? '');
  function mount() {
    const app = document.getElementById('eventsApp');
    const grid = app?.querySelector('#scheduleGrid');
    if (!app || !grid || document.getElementById('eventMarketBridge')) return Boolean(grid);
    const panel = document.createElement('section');
    panel.id = 'eventMarketBridge';
    panel.className = 'event-market-bridge';
    panel.innerHTML = `<div class="home-section-heading"><span><i class="fa-solid fa-chart-line"></i> ${t('events-marketTitle', 'Prime öncesi pazar hazırlığı')}</span><span id="eventMarketStatus" class="data-age">${t('market-autoLoading', 'Eşyalar otomatik analiz ediliyor…')}</span></div><p>${t('events-marketDesc', 'Yaklaşan savaş saatinden önce gerçek veride öne çıkan savaş ve tüketim eşyalarını inceleyin.')}</p><div id="eventMarketList" class="event-market-list"></div><button type="button" id="eventMarketOpen" class="market-action"><i class="fa-solid fa-layer-group"></i> ${t('home-quickMarket', 'Pazar Merkezi')}</button>`;
    // The events view can refresh its contents while this bridge is mounting.
    // Insert relative to the live schedule node instead of relying on a cached
    // parent reference; this avoids NotFoundError during a fast rerender.
    if (!grid.isConnected || !grid.parentNode) return false;
    grid.insertAdjacentElement('beforebegin', panel);
    panel.querySelector('#eventMarketOpen')?.addEventListener('click', () => document.querySelector('[data-tab="tab-market"]')?.click());
    load(panel);
    return true;
  }
  async function load(panel) {
    const list = panel.querySelector('#eventMarketList');
    const status = panel.querySelector('#eventMarketStatus');
    try {
      const rows = await window.MarketLive?.findOpportunities?.(undefined, 3) || [];
      if (status) status.textContent = rows.length ? `${rows.length} ${t('home-dashboardFresh', 'fırsat bulundu')}` : t('market-autoNone', 'Şu anda sermayenize uygun taze fırsat bulunamadı.');
      list.innerHTML = rows.length ? rows.map((row) => `<button type="button" class="event-market-item" data-market-select-id="${esc(row.item)}"><img src="${esc(window.ItemCard?.image?.(row.item, 1, 48) || '')}" alt="${esc(window.ItemCard?.name?.(row.item) || row.item)}" loading="lazy" data-image-fallback="item"><span><strong>${esc(window.ItemCard?.name?.(row.item) || row.item)}</strong><small>${esc(row.from)} → ${esc(row.to)}</small></span><b>+${Number(row.profit).toLocaleString('tr-TR')} 🥈</b></button>`).join('') : `<div class="home-empty">${t('market-autoNone', 'Şu anda sermayenize uygun taze fırsat bulunamadı.')}</div>`;
      list.querySelectorAll('[data-market-select-id]').forEach((button) => button.addEventListener('click', () => { window.dispatchEvent(new CustomEvent('market_select_item', { detail: { id: button.dataset.marketSelectId } })); document.querySelector('[data-tab="tab-market"]')?.click(); }));
    } catch (error) { if (status) status.textContent = t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.'); list.innerHTML = `<div class="home-empty is-error">${t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.')}</div>`; }
  }
  document.addEventListener('DOMContentLoaded', () => { const tryMount = () => mount() || setTimeout(tryMount, 120); tryMount(); });
})();
