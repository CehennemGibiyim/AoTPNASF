/* Server-aware live market surfaces: real gold data, opportunities and history. */
(function () {
  const t = (key, fallback) => {
    try {
      const managed = window.miniappI18n?.t?.(key);
      if (managed && managed !== key) return managed;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (error) {}
    return fallback;
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const royalCities = ['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford'];
  const sellTargets = ['Caerleon', 'Black Market'];
  const itemIds = ['T6_MAIN_SWORD', 'T6_MAIN_BOW', 'T6_ARMOR_LEATHER_SET1', 'T6_HIDE', 'T6_LOGS', 'T6_CAPE', 'T6_METALBAR', 'T6_CLOTH', 'T6_MEAL_STEW', 'T6_POTION_HEAL'];
  let goldHistory = [];
  let goldChart = null;
  let tickerTimer;
  let goldTimer;
  let refreshToken = 0;

  function domain() { return window.getAlbionApiDomain?.() || 'europe.albion-online-data.com'; }
  function serverName() { return ({ europe: 'EU', americas: 'NA', asia: 'ASIA' }[window.AppConfig?.server] || 'EU'); }
  function age(date) { return window.MarketRuntime?.ageLabel?.(date) || t('market-ageUnknown', 'Veri yaşı bilinmiyor'); }
  function fresh(date) { return window.MarketRuntime?.isFresh?.(date) ?? true; }

  function ensureGoldStatus() {
    const price = document.getElementById('staticGoldPrice');
    if (!price || document.getElementById('goldDataStatus')) return;
    const status = document.createElement('span');
    status.id = 'goldDataStatus';
    status.className = 'market-gold-status';
    price.parentElement?.appendChild(status);
  }

  function setGoldStatus(text, error = false) {
    ensureGoldStatus();
    const status = document.getElementById('goldDataStatus');
    if (status) {
      status.textContent = text;
      status.classList.toggle('is-error', error);
    }
  }

  function destroyGoldChart() {
    try { goldChart?.destroy(); } catch (error) {}
    goldChart = null;
    const canvas = document.getElementById('goldStatsChart');
    try { window.Chart?.getChart?.(canvas)?.destroy(); } catch (error) {}
  }

  function renderGoldChart(timeframe) {
    const canvas = document.getElementById('goldStatsChart');
    if (!canvas || typeof window.Chart !== 'function') return;
    const rows = Array.isArray(window.MarketGoldHistory) ? window.MarketGoldHistory : [];
    const sliced = timeframe === 'daily' ? rows.slice(-7) : timeframe === 'weekly' ? rows.slice(-14) : rows;
    const points = sliced.map((row) => Number(row.price)).filter((value) => Number.isFinite(value) && value > 0);
    const labels = sliced.slice(-points.length).map((row) => new Date(row.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }));
    destroyGoldChart();
    if (points.length < 2) return;
    const positive = points[points.length - 1] >= points[0];
    try {
      goldChart = new window.Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: t('market-goldLabel', 'Altın fiyatı'),
            data: points,
            borderColor: positive ? '#4ade80' : '#f87171',
            backgroundColor: positive ? 'rgba(74,222,128,.1)' : 'rgba(248,113,113,.1)',
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
            tension: .35
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
            y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
          }
        }
      });
    } catch (error) {
      goldChart = null;
      setGoldStatus(`${serverName()} · ${t('market-chartUnavailable', 'grafik şu anda kullanılamıyor')}`, true);
    }
  }

  async function loadGold() {
    const requestToken = ++refreshToken;
    const pendingPrice = document.getElementById('staticGoldPrice');
    if (pendingPrice) pendingPrice.innerHTML = '<i class="fa-solid fa-coins mr-1 text-gray-500"></i>--';
    setGoldStatus(`${serverName()} · ${t('market-loadingGold', 'altın verisi yükleniyor…')}`);
    try {
      const url = `https://${domain()}/api/v2/stats/gold?count=30`;
      const rows = await (window.MarketRuntime?.fetch || window.fetchWithProxies)(url);
      if (requestToken !== refreshToken) return;
      goldHistory = Array.isArray(rows) ? rows.filter((row) => Number(row.price) > 0 && row.timestamp) : [];
      window.MarketGoldHistory = goldHistory;
      if (!goldHistory.length) throw new Error('empty gold response');
      const latest = goldHistory[goldHistory.length - 1];
      const previous = goldHistory[goldHistory.length - 2];
      const daily = previous?.price ? ((latest.price - previous.price) / previous.price) * 100 : 0;
      const priceEl = document.getElementById('staticGoldPrice');
      const changeEl = document.getElementById('staticGoldChange');
      if (priceEl) priceEl.innerHTML = `<i class="fa-solid fa-coins mr-1 text-yellow-500"></i>${Number(latest.price).toLocaleString()} 🥈`;
      if (changeEl) {
        const positive = daily >= 0;
        changeEl.className = `text-sm font-bold px-2 py-0.5 rounded ${positive ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'} shadow-inner`;
        changeEl.innerHTML = `<i class="fa-solid fa-arrow-trend-${positive ? 'up text-green-400' : 'down text-red-400'} mr-1"></i><span class="${positive ? 'text-green-400' : 'text-red-400'}">${positive ? '+' : ''}${daily.toFixed(2)}%</span>`;
      }
      setGoldStatus(`${serverName()} · ${age(latest.timestamp)} · ${t('market-realData', 'gerçek veri')}`);
      renderGoldChart('daily');
    } catch (error) {
      if (requestToken !== refreshToken) return;
      goldHistory = [];
      window.MarketGoldHistory = [];
      const priceEl = document.getElementById('staticGoldPrice');
      const changeEl = document.getElementById('staticGoldChange');
      if (priceEl) priceEl.innerHTML = '<i class="fa-solid fa-coins mr-1 text-gray-500"></i>--';
      if (changeEl) changeEl.textContent = '--';
      destroyGoldChart();
      setGoldStatus(`${serverName()} · ${t('market-goldUnavailable', 'altın verisi alınamadı')}`, true);
    }
  }

  function opportunityRows(rows, limit = 8) {
    const byItem = {};
    rows.forEach((row) => {
      if (!byItem[row.item_id]) byItem[row.item_id] = {};
      if (row.city) byItem[row.item_id][row.city] = row;
    });
    const sellTaxRaw = Number(window.MarketProfile?.sellTax);
    const buyTaxRaw = Number(window.MarketProfile?.buyTax);
    const tax = Math.max(0, Number.isFinite(sellTaxRaw) ? sellTaxRaw : 6.5) / 100;
    const buyTax = Math.max(0, Number.isFinite(buyTaxRaw) ? buyTaxRaw : 0) / 100;
    const capital = Math.max(0, Number(window.MarketProfile?.capital) || 0);
    const results = [];
    Object.entries(byItem).forEach(([item, cities]) => {
      royalCities.forEach((from) => {
        const source = cities[from];
        const sourcePrice = Number(source?.sell_price_min);
        if (!source || sourcePrice <= 0 || !fresh(source.sell_price_min_date) || (capital > 0 && sourcePrice > capital)) return;
        sellTargets.forEach((to) => {
          const target = cities[to];
          const targetPrice = Number(target?.buy_price_max);
          if (!target || targetPrice <= 0 || !fresh(target.buy_price_max_date)) return;
          const profit = Math.floor(targetPrice * (1 - tax) - sourcePrice * (1 + buyTax));
          if (profit <= 0) return;
          const sourceAge = window.MarketRuntime?.ageSeconds?.(source.sell_price_min_date) || 0;
          const targetAge = window.MarketRuntime?.ageSeconds?.(target.buy_price_max_date) || 0;
          const confidence = Math.max(1, Math.min(99, Math.round(100 - Math.max(sourceAge, targetAge) / 10800 * 35)));
          results.push({ item, from, to, buyPrice: sourcePrice, sellPrice: targetPrice, profit, confidence, age: age(source.sell_price_min_date), targetAge: age(target.buy_price_max_date) });
        });
      });
    });
    return results.sort((a, b) => b.profit - a.profit).slice(0, limit);
  }

  async function findOpportunities(ids = itemIds, limit = 8) {
    const locations = [...royalCities, ...sellTargets];
    const params = new URLSearchParams({ locations: locations.join(','), qualities: '1' });
    const url = `https://${domain()}/api/v2/stats/prices/${ids.join(',')}.json?${params}`;
    const rows = await (window.MarketRuntime?.fetch || window.fetchWithProxies)(url);
    return opportunityRows(Array.isArray(rows) ? rows : [], limit);
  }

  async function updateTicker() {
    const ticker = document.getElementById('marketTicker');
    if (!ticker) return;
    ticker.textContent = t('ticker-loading', 'Canlı piyasa fırsatları yükleniyor…');
    try {
      const hit = (await findOpportunities(itemIds, 1))[0];
      if (!hit) {
        ticker.textContent = `${serverName()} · ${t('ticker-noOpportunity', 'Taze ve pozitif fırsat bulunamadı.')}`;
        return;
      }
      const name = window.ItemCard?.name?.(hit.item) || hit.item.replace(/^T\d+_/, '').replace(/_/g, ' ');
      const icon = window.ItemCard?.image?.(hit.item, 1, 40) || window.ItemCard?.placeholder?.(hit.item) || '';
      ticker.innerHTML = `<span class="ticker-item"><img src="${escapeHtml(icon)}" alt="${escapeHtml(name)}" loading="lazy" data-image-fallback="item"><span class="text-green-400 font-bold">${escapeHtml(name)}</span></span> → ${escapeHtml(hit.from)}'dan al, ${escapeHtml(hit.to)}'da sat · <span class="text-yellow-400 font-black">+${hit.profit.toLocaleString()} 🥈</span> · <span class="text-gray-500">${t('market-confidence', 'Güven')} %${hit.confidence} · ${escapeHtml(hit.age)}</span>`;
    } catch (error) {
      ticker.textContent = `${serverName()} · ${t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.')}`;
    }
  }

  async function fetchHistory(itemId) {
    const url = `https://${domain()}/api/v2/stats/history/${encodeURIComponent(itemId)}.json?time-scale=1`;
    const rows = await (window.MarketRuntime?.fetch || window.fetchWithProxies)(url);
    return Array.isArray(rows) ? rows.filter((row) => Number(row.avg_price || row.sell_price_min || row.price) > 0) : [];
  }

  function refreshAll() {
    window.MarketRuntime?.clearCache?.();
    loadGold().catch(() => {});
    updateTicker().catch(() => {});
  }

  window.MarketLive = { findOpportunities, fetchHistory, refreshAll, renderGoldChart, get goldHistory() { return goldHistory; } };
  document.addEventListener('DOMContentLoaded', () => {
    loadGold().catch(() => {});
    updateTicker().catch(() => {});
    document.querySelectorAll('#chartTimeframe button').forEach((button) => button.addEventListener('click', () => renderGoldChart(button.dataset.tf)));
    window.addEventListener('app_settings_loaded', refreshAll);
    window.addEventListener('app_settings_updated', refreshAll);
    tickerTimer = setInterval(() => updateTicker().catch(() => {}), 60000);
    goldTimer = setInterval(() => loadGold().catch(() => {}), 60000);
  });
})();
