/* Vergi & Kar Hesaplayıcı: Premium/Free karşılaştırma, şehir vergisi, taşıma maliyeti */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const ROYAL_CITIES = ['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford', 'Caerleon', 'Brecilien'];
  
  const TAX_RATES = {
    setup: { free: 0.05, premium: 0.03 },
    sell: { free: 0.04, premium: 0.02 },
    buy: { free: 0.03, premium: 0.015 }
  };

  const TRANSPORT_COSTS = {
    'Lymhurst-Caerleon': 3500, 'Bridgewatch-Caerleon': 4200, 'Fort Sterling-Caerleon': 4800,
    'Martlock-Caerleon': 5100, 'Thetford-Caerleon': 3900, 'Caerleon-Black Market': 0
  };

  function transportKey(from, to) {
    const key = `${from}-${to}`;
    if (TRANSPORT_COSTS[key]) return TRANSPORT_COSTS[key];
    const reverse = `${to}-${from}`;
    if (TRANSPORT_COSTS[reverse]) return TRANSPORT_COSTS[reverse];
    return 2500 + Math.abs((from.length - to.length) * 400);
  }

  function calculateProfit(params) {
    const { buyPrice, sellPrice, quantity, fromCity, toCity, premium, useFocus } = params;
    const buyTaxRate = TAX_RATES.buy[premium ? 'premium' : 'free'];
    const sellTaxRate = TAX_RATES.sell[premium ? 'premium' : 'free'];
    const setupRate = useFocus ? 0.47 : TAX_RATES.setup[premium ? 'premium' : 'free'];
    
    const buyTax = Math.ceil(buyPrice * buyTaxRate);
    const sellTax = Math.ceil(sellPrice * sellTaxRate);
    const setupFee = Math.ceil(buyPrice * setupRate);
    const transportFee = transportKey(fromCity, toCity);
    
    const totalBuyCost = (buyPrice + buyTax + setupFee) * quantity;
    const totalSellRevenue = (sellPrice - sellTax) * quantity;
    const totalTransport = transportFee * Math.ceil(quantity / 50);
    const grossProfit = totalSellRevenue - totalBuyCost - totalTransport;
    const roi = totalBuyCost > 0 ? (grossProfit / totalBuyCost * 100) : 0;

    return {
      grossProfit, roi, buyTax, sellTax, setupFee, transportFee: totalTransport,
      perItem: Math.floor(grossProfit / quantity),
      totalBuyCost, totalSellRevenue,
      isProfitable: grossProfit > 0
    };
  }

  function formatSilver(amount) {
    if (Math.abs(amount) >= 1e6) return (amount / 1e6).toFixed(2) + 'M';
    if (Math.abs(amount) >= 1e3) return (amount / 1e3).toFixed(1) + 'K';
    return String(Math.floor(amount));
  }

  function render(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="tax-calculator max-w-3xl mx-auto p-4 space-y-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center justify-center">
            <i class="fa-solid fa-calculator text-emerald-400 text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-white">${t('tax-title', 'Vergi & Kar Hesaplayıcı')}</h2>
            <p class="text-xs text-gray-400">${t('tax-desc', 'Premium/Free karşılaştırması, şehir vergisi ve taşıma maliyeti')}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Alış Bilgileri -->
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2">
              <i class="fa-solid fa-cart-shopping"></i> ${t('tax-buyInfo', 'Alış Bilgileri')}
            </h3>
            <label class="block">
              <span class="text-xs text-gray-400">${t('tax-buyPrice', 'Alış Fiyatı (birim)')}</span>
              <input type="number" id="taxBuyPrice" value="50000" min="1" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
            </label>
            <label class="block">
              <span class="text-xs text-gray-400">${t('tax-quantity', 'Adet')}</span>
              <input type="number" id="taxQuantity" value="100" min="1" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
            </label>
            <label class="block">
              <span class="text-xs text-gray-400">${t('tax-fromCity', 'Alış Şehri')}</span>
              <select id="taxFromCity" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
                ${ROYAL_CITIES.map(c => `<option value="${c}" ${c==='Lymhurst'?'selected':''}>${c}</option>`).join('')}
              </select>
            </label>
          </div>

          <!-- Satış Bilgileri -->
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2">
              <i class="fa-solid fa-tag"></i> ${t('tax-sellInfo', 'Satış Bilgileri')}
            </h3>
            <label class="block">
              <span class="text-xs text-gray-400">${t('tax-sellPrice', 'Satış Fiyatı (birim)')}</span>
              <input type="number" id="taxSellPrice" value="75000" min="1" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
            </label>
            <label class="block">
              <span class="text-xs text-gray-400">${t('tax-toCity', 'Satış Şehri')}</span>
              <select id="taxToCity" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
                ${ROYAL_CITIES.map(c => `<option value="${c}" ${c==='Caerleon'?'selected':''}>${c}</option>`).join('')}
              </select>
            </label>
            <div class="flex gap-3 pt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="taxPremium" class="rounded accent-albion-accent">
                <span class="text-xs text-gray-300">Premium</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="taxFocus" class="rounded accent-albion-accent">
                <span class="text-xs text-amber-400">Focus Kullan</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Sonuç Tablosu -->
        <div id="taxResult" class="bg-albion-800 border border-gray-700 rounded-xl p-4 space-y-3">
          <h3 class="text-sm font-bold text-white">${t('tax-result', 'Kar/Zarar Analizi')}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3" id="taxResultGrid">
            <!-- JS doldurur -->
          </div>
        </div>

        <!-- Premium vs Free Karşılaştırma -->
        <div class="bg-gradient-to-r from-amber-900/30 to-albion-800 border border-amber-700/40 rounded-xl p-4">
          <h3 class="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
            <i class="fa-solid fa-crown"></i> ${t('tax-premiumCompare', 'Premium vs Free Karşılaştırması')}
          </h3>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1.5">
              <div class="flex justify-between"><span class="text-gray-400">Setup Vergisi</span><span class="text-red-400">%5</span><span class="text-emerald-400">%3</span></div>
              <div class="flex justify-between"><span class="text-gray-400">Satış Vergisi</span><span class="text-red-400">%4</span><span class="text-emerald-400">%2</span></div>
              <div class="flex justify-between"><span class="text-gray-400">Alış Vergisi</span><span class="text-red-400">%3</span><span class="text-emerald-400">%1.5</span></div>
            </div>
            <div class="space-y-1.5">
              <div class="flex justify-between"><span class="text-gray-400">Focus Verimliliği</span><span class="text-red-400">10K</span><span class="text-emerald-400">30K</span></div>
              <div class="flex justify-between"><span class="text-gray-400">Günlük Focus</span><span class="text-red-400">10K</span><span class="text-emerald-400">30K</span></div>
              <div class="flex justify-between"><span class="text-gray-400">Tahmini Aylık Kar</span><span id="taxMonthlyDiff" class="text-amber-400 font-bold">--</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const update = () => {
      const params = {
        buyPrice: Number(container.querySelector('#taxBuyPrice')?.value) || 0,
        sellPrice: Number(container.querySelector('#taxSellPrice')?.value) || 0,
        quantity: Number(container.querySelector('#taxQuantity')?.value) || 1,
        fromCity: container.querySelector('#taxFromCity')?.value || 'Lymhurst',
        toCity: container.querySelector('#taxToCity')?.value || 'Caerleon',
        premium: container.querySelector('#taxPremium')?.checked || false,
        useFocus: container.querySelector('#taxFocus')?.checked || false
      };

      const result = calculateProfit(params);
      const grid = container.querySelector('#taxResultGrid');
      if (!grid) return;

      const profitClass = result.isProfitable ? 'text-emerald-400' : 'text-red-400';
      const profitIcon = result.isProfitable ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';

      grid.innerHTML = `
        <div class="bg-albion-900 rounded-lg p-3 text-center">
          <div class="text-[10px] text-gray-500 uppercase">${t('tax-grossProfit', 'Brüt Kar')}</div>
          <div class="text-lg font-black ${profitClass}"><i class="fa-solid ${profitIcon} mr-1"></i>${formatSilver(result.grossProfit)}</div>
        </div>
        <div class="bg-albion-900 rounded-lg p-3 text-center">
          <div class="text-[10px] text-gray-500 uppercase">ROI</div>
          <div class="text-lg font-black ${result.roi >= 10 ? 'text-emerald-400' : result.roi >= 0 ? 'text-amber-400' : 'text-red-400'}">%${result.roi.toFixed(1)}</div>
        </div>
        <div class="bg-albion-900 rounded-lg p-3 text-center">
          <div class="text-[10px] text-gray-500 uppercase">${t('tax-perItem', 'Birim Başı')}</div>
          <div class="text-lg font-black text-white">${formatSilver(result.perItem)}</div>
        </div>
        <div class="bg-albion-900 rounded-lg p-3 text-center">
          <div class="text-[10px] text-gray-500 uppercase">${t('tax-transport', 'Taşıma')}</div>
          <div class="text-lg font-black text-blue-400">${formatSilver(result.transportFee)}</div>
        </div>
        <div class="bg-albion-900 rounded-lg p-3 text-center col-span-2 md:col-span-1">
          <div class="text-[10px] text-gray-500 uppercase">${t('tax-totalCost', 'Toplam Maliyet')}</div>
          <div class="text-sm font-bold text-gray-300">${formatSilver(result.totalBuyCost)}</div>
        </div>
        <div class="bg-albion-900 rounded-lg p-3 text-center col-span-2 md:col-span-1">
          <div class="text-[10px] text-gray-500 uppercase">${t('tax-totalRevenue', 'Toplam Gelir')}</div>
          <div class="text-sm font-bold text-gray-300">${formatSilver(result.totalSellRevenue)}</div>
        </div>
      `;

      // Aylık kar farkı
      const freeParams = { ...params, premium: false };
      const premParams = { ...params, premium: true };
      const freeProfit = calculateProfit(freeParams).grossProfit;
      const premProfit = calculateProfit(premParams).grossProfit;
      const monthlyDiff = (premProfit - freeProfit) * 30;
      const diffEl = container.querySelector('#taxMonthlyDiff');
      if (diffEl) diffEl.textContent = formatSilver(Math.max(0, monthlyDiff));
    };

    container.querySelectorAll('input, select').forEach(el => el.addEventListener('input', update));
    update();
  }

  window.TaxCalculator = { render, calculateProfit, formatSilver };
  console.log('TaxCalculator loaded');
})();
