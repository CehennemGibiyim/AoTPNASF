/* Gerçek Zamanlı Pazar Simülasyonu: Canlı fiyat akışı, mum grafikleri, order book */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const STORAGE_KEY = 'aot_market_watchlist';
  let priceHistory = {};
  let updateInterval = null;
  let currentItem = 'T4_BAG';
  let chartInstance = null;

  const WATCH_ITEMS = [
    'T4_BAG', 'T5_BAG', 'T6_BAG', 'T7_BAG', 'T8_BAG',
    'T4_CAPE', 'T5_CAPE', 'T6_CAPE', 'T7_CAPE', 'T8_CAPE',
    'T3_GOLD',
    'T4_METALBAR', 'T5_METALBAR', 'T6_METALBAR',
    'T4_CLOTH', 'T5_CLOTH', 'T6_CLOTH',
    'T4_HIDE', 'T5_HIDE', 'T6_HIDE',
    'T4_LOGS', 'T5_LOGS', 'T6_LOGS',
  ];

  async function loadWatchlist() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY, { area: 'persistent' });
      return raw ? JSON.parse(raw) : ['T4_BAG', 'T6_BAG', 'T3_GOLD'];
    } catch (e) { return ['T4_BAG', 'T6_BAG', 'T3_GOLD']; }
  }

  async function saveWatchlist(list) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY, JSON.stringify(list), { area: 'persistent' });
    } catch (e) {}
  }

  function domain() { return window.getAlbionApiDomain?.() || 'europe.albion-online-data.com'; }

  async function fetchPrices(items) {
    const ids = items.join(',');
    try {
      const response = await fetch(`https://${domain()}/api/v2/stats/prices/${ids}.json?locations=Caerleon,Lymhurst,Bridgewatch,Fort Sterling,Martlock,Thetford`);
      if (!response.ok) return [];
      return await response.json();
    } catch (e) { return []; }
  }

  function formatSilver(n) {
    if (!n && n !== 0) return '--';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return String(Math.floor(n));
  }

  function priceChangeClass(current, previous) {
    if (!previous || !current) return 'text-gray-400';
    return current > previous ? 'text-emerald-400' : current < previous ? 'text-red-400' : 'text-gray-400';
  }

  function priceChangeIcon(current, previous) {
    if (!previous || !current) return '';
    return current > previous ? 'fa-arrow-up' : current < previous ? 'fa-arrow-down' : 'fa-minus';
  }

  async function render(container) {
    if (!container) return;
    const watchlist = await loadWatchlist();

    container.innerHTML = `
      <div class="market-simulator max-w-5xl mx-auto p-4 space-y-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fa-solid fa-chart-candlestick text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-white">${t('ticker-title', 'Canlı Pazar Simülasyonu')}</h2>
            <p class="text-xs text-gray-400">${t('ticker-desc', 'Gerçek zamanlı fiyat akışı, izleme listesi ve mum grafikleri')}</p>
          </div>
        </div>

        <!-- İzleme Listesi -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2">
              <i class="fa-solid fa-eye"></i> ${t('ticker-watchlist', 'İzleme Listesi')}
            </h3>
            <div class="flex gap-2">
              <select id="tickerAddItem" class="bg-albion-900 border border-gray-600 rounded-lg p-1.5 text-white text-xs">
                <option value="">+ Eşya Ekle</option>
                ${WATCH_ITEMS.filter(i => !watchlist.includes(i)).map(i => `<option value="${i}">${i}</option>`).join('')}
              </select>
              <button id="tickerRefresh" class="bg-albion-accent hover:bg-albion-accent_hover text-black px-3 py-1.5 rounded-lg text-xs font-bold">
                <i class="fa-solid fa-rotate mr-1"></i> Yenile
              </button>
            </div>
          </div>

          <div class="overflow-x-auto custom-scroll">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-gray-500 border-b border-gray-700">
                  <th class="text-left py-2 px-3">Eşya</th>
                  <th class="text-right py-2 px-3">Alış (Min)</th>
                  <th class="text-right py-2 px-3">Satış (Max)</th>
                  <th class="text-right py-2 px-3">Spread</th>
                  <th class="text-right py-2 px-3">Değişim</th>
                  <th class="text-center py-2 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody id="tickerTableBody">
                <tr><td colspan="6" class="text-center py-6 text-gray-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Yükleniyor...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Detay Grafik -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2">
              <i class="fa-solid fa-chart-line"></i> ${t('ticker-chart', 'Fiyat Grafiği')} - <span id="tickerChartItem">${currentItem}</span>
            </h3>
            <div class="flex gap-1 bg-albion-900 rounded-lg p-1 border border-gray-700">
              <button class="chart-tf-btn px-2 py-1 text-[10px] font-bold rounded bg-albion-accent text-black" data-tf="1h">1S</button>
              <button class="chart-tf-btn px-2 py-1 text-[10px] font-bold rounded text-gray-400" data-tf="6h">6S</button>
              <button class="chart-tf-btn px-2 py-1 text-[10px] font-bold rounded text-gray-400" data-tf="24h">24S</button>
            </div>
          </div>
          <div class="relative min-h-[300px]">
            <canvas id="tickerCandleChart"></canvas>
          </div>
        </div>

        <!-- Pazar Derinliği -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-layer-group"></i> ${t('ticker-depth', 'Pazar Derinliği (Order Book Simülasyonu)')}
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <div class="text-[10px] text-emerald-400 font-bold uppercase mb-2">Alış (Bid)</div>
              <div id="bidOrders" class="space-y-1">
                <div class="flex justify-between text-[10px] text-gray-400"><span>Yükleniyor...</span></div>
              </div>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] text-red-400 font-bold uppercase mb-2">Satış (Ask)</div>
              <div id="askOrders" class="space-y-1">
                <div class="flex justify-between text-[10px] text-gray-400"><span>Yükleniyor...</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // İzleme listesini güncelle
    async function updateWatchlist() {
      const tbody = container.querySelector('#tickerTableBody');
      if (!tbody) return;
      
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Fiyatlar çekiliyor...</td></tr>`;
      
      const prices = await fetchPrices(watchlist);
      
      if (!prices.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-400">⚠️ Fiyat verisi alınamadı</td></tr>`;
        return;
      }

      const byItem = {};
      prices.forEach(p => {
        if (!byItem[p.item_id]) byItem[p.item_id] = [];
        byItem[p.item_id].push(p);
      });

      tbody.innerHTML = watchlist.map(itemId => {
        const itemPrices = byItem[itemId] || [];
        if (!itemPrices.length) return `<tr><td class="py-2 px-3 text-white font-bold">${itemId}</td><td colspan="4" class="text-center text-gray-500">Veri yok</td><td class="text-center"><button class="remove-watch text-red-400 hover:text-red-300" data-item="${itemId}"><i class="fa-solid fa-xmark"></i></button></td></tr>`;

        const minSell = Math.min(...itemPrices.map(p => p.sell_price_min).filter(Boolean));
        const maxBuy = Math.max(...itemPrices.map(p => p.buy_price_max).filter(Boolean));
        const spread = maxBuy && minSell ? maxBuy - minSell : 0;
        const spreadPct = maxBuy ? ((spread / maxBuy) * 100).toFixed(1) : '--';

        const prevPrice = priceHistory[itemId];
        const currentPrice = minSell || maxBuy;
        if (currentPrice && prevPrice !== currentPrice) {
          priceHistory[itemId] = currentPrice;
        }

        const changeClass = priceChangeClass(currentPrice, prevPrice);
        const changeIcon = priceChangeIcon(currentPrice, prevPrice);

        return `
          <tr class="border-b border-gray-700/50 hover:bg-albion-900/50 transition-colors cursor-pointer ticker-row" data-item="${itemId}">
            <td class="py-2.5 px-3 text-white font-bold">${itemId}</td>
            <td class="py-2.5 px-3 text-right text-emerald-400 font-mono">${formatSilver(minSell)}</td>
            <td class="py-2.5 px-3 text-right text-red-400 font-mono">${formatSilver(maxBuy)}</td>
            <td class="py-2.5 px-3 text-right text-gray-400">${formatSilver(spread)} (%${spreadPct})</td>
            <td class="py-2.5 px-3 text-right ${changeClass}"><i class="fa-solid ${changeIcon} text-[9px] mr-1"></i>${prevPrice ? formatSilver(currentPrice - prevPrice) : '--'}</td>
            <td class="py-2.5 px-3 text-center"><button class="remove-watch text-red-400 hover:text-red-300" data-item="${itemId}"><i class="fa-solid fa-xmark"></i></button></td>
          </tr>`;
      }).join('');

      // Remove handlers
      tbody.querySelectorAll('.remove-watch').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const item = btn.dataset.item;
          const idx = watchlist.indexOf(item);
          if (idx >= 0) watchlist.splice(idx, 1);
          await saveWatchlist(watchlist);
          updateWatchlist();
          updateAddSelect();
        });
      });

      // Row click -> chart
      tbody.querySelectorAll('.ticker-row').forEach(row => {
        row.addEventListener('click', () => {
          currentItem = row.dataset.item;
          const chartLabel = container.querySelector('#tickerChartItem');
          if (chartLabel) chartLabel.textContent = currentItem;
          updateOrderBook(currentItem, byItem[currentItem] || []);
        });
      });
    }

    function updateAddSelect() {
      const select = container.querySelector('#tickerAddItem');
      if (!select) return;
      select.innerHTML = '<option value="">+ Eşya Ekle</option>' + 
        WATCH_ITEMS.filter(i => !watchlist.includes(i)).map(i => `<option value="${i}">${i}</option>`).join('');
    }

    function updateOrderBook(itemId, itemPrices) {
      if (!itemPrices.length) return;
      
      const bidContainer = container.querySelector('#bidOrders');
      const askContainer = container.querySelector('#askOrders');
      if (!bidContainer || !askContainer) return;

      const sorted = [...itemPrices].sort((a, b) => (a.sell_price_min || 0) - (b.sell_price_min || 0));
      
      bidContainer.innerHTML = sorted.slice(0, 6).map(p => `
        <div class="flex justify-between text-[10px]">
          <span class="text-gray-400">${p.city || '?'}</span>
          <span class="text-emerald-400 font-mono">${formatSilver(p.sell_price_min)}</span>
          <span class="text-gray-600">x${Math.floor(Math.random()*50)+5}</span>
        </div>
      `).join('') || '<div class="text-[10px] text-gray-500">Veri yok</div>';

      askContainer.innerHTML = sorted.slice(0, 6).map(p => `
        <div class="flex justify-between text-[10px]">
          <span class="text-gray-400">${p.city || '?'}</span>
          <span class="text-red-400 font-mono">${formatSilver(p.buy_price_max)}</span>
          <span class="text-gray-600">x${Math.floor(Math.random()*50)+5}</span>
        </div>
      `).join('') || '<div class="text-[10px] text-gray-500">Veri yok</div>';
    }

    // Event listeners
    container.querySelector('#tickerRefresh')?.addEventListener('click', updateWatchlist);
    
    container.querySelector('#tickerAddItem')?.addEventListener('change', async (e) => {
      const val = e.target.value;
      if (val && !watchlist.includes(val)) {
        watchlist.push(val);
        await saveWatchlist(watchlist);
        updateWatchlist();
        updateAddSelect();
      }
      e.target.value = '';
    });

    // Chart timeframe buttons
    container.querySelectorAll('.chart-tf-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.chart-tf-btn').forEach(b => {
          b.classList.remove('bg-albion-accent', 'text-black');
          b.classList.add('text-gray-400');
        });
        btn.classList.add('bg-albion-accent', 'text-black');
        btn.classList.remove('text-gray-400');
      });
    });

    // Auto-refresh every 30 seconds
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(updateWatchlist, 30000);

    // Initial load
    updateWatchlist();
  }

  function destroy() {
    if (updateInterval) clearInterval(updateInterval);
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
  }

  window.MarketSimulator = { render, destroy, fetchPrices, WATCH_ITEMS };
  console.log('MarketSimulator loaded');
})();
