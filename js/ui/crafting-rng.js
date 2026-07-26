/* Crafting RNG Simülatörü - Kalite şansı, malzeme optimizasyonu ve kâr hesaplama */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const QUALITY_BASE_CHANCES = {
    normal: { base: 0.70, label: 'Normal', color: '#9ca3af', multiplier: 1.0 },
    good: { base: 0.18, label: 'Good', color: '#22c55e', multiplier: 1.1 },
    outstanding: { base: 0.08, label: 'Outstanding', color: '#3b82f6', multiplier: 1.2 },
    excellent: { base: 0.03, label: 'Excellent', color: '#a855f7', multiplier: 1.35 },
    masterpiece: { base: 0.01, label: 'Masterpiece', color: '#f59e0b', multiplier: 1.5 }
  };

  const CRAFTING_ITEMS = [
    { name: 'T4.0 Adept\'s Staff', baseCost: 25000, marketValue: 45000, category: 'silah' },
    { name: 'T5.0 Expert\'s Staff', baseCost: 55000, marketValue: 95000, category: 'silah' },
    { name: 'T6.0 Elder\'s Staff', baseCost: 120000, marketValue: 200000, category: 'silah' },
    { name: 'T7.0 Grandmaster\'s Staff', baseCost: 280000, marketValue: 480000, category: 'silah' },
    { name: 'T8.0 Elder\'s Greatstaff', baseCost: 650000, marketValue: 1100000, category: 'silah' },
    { name: 'T4.0 Adept\'s Chest', baseCost: 18000, marketValue: 32000, category: 'zırh' },
    { name: 'T5.0 Expert\'s Chest', baseCost: 42000, marketValue: 72000, category: 'zırh' },
    { name: 'T6.0 Elder\'s Chest', baseCost: 95000, marketValue: 160000, category: 'zırh' },
    { name: 'T7.0 Grandmaster\'s Chest', baseCost: 220000, marketValue: 380000, category: 'zırh' },
    { name: 'T8.0 Elder\'s Robe', baseCost: 520000, marketValue: 900000, category: 'zırh' },
    { name: 'T4.0 Adept\'s Helm', baseCost: 12000, marketValue: 22000, category: 'kask' },
    { name: 'T5.0 Expert\'s Helm', baseCost: 28000, marketValue: 50000, category: 'kask' },
    { name: 'T6.0 Elder\'s Helm', baseCost: 65000, marketValue: 110000, category: 'kask' },
    { name: 'T4.0 Adept\'s Boots', baseCost: 10000, marketValue: 18000, category: 'bot' },
    { name: 'T5.0 Expert\'s Boots', baseCost: 22000, marketValue: 40000, category: 'bot' },
    { name: 'T6.0 Elder\'s Boots', baseCost: 50000, marketValue: 90000, category: 'bot' }
  ];

  const FOCUS_COST_PER_ITEM = 45; // ortalama focus maliyeti

  function simulateCraft(item, runs = 1000, focusUsed = false, specLevel = 0) {
    const results = { normal: 0, good: 0, outstanding: 0, excellent: 0, masterpiece: 0 };
    let totalValue = 0;
    let totalFocus = 0;

    // Spec bonus: her 100 spec level, masterpiece şansı %0.5 artar
    const specBonus = Math.floor(specLevel / 100) * 0.005;
    
    // Focus kullanımı: masterpiece şansı 2x
    const focusMultiplier = focusUsed ? 2.0 : 1.0;
    
    const adjustedChances = {};
    Object.entries(QUALITY_BASE_CHANCES).forEach(([key, data]) => {
      let chance = data.base;
      if (key === 'masterpiece') {
        chance = (data.base + specBonus) * focusMultiplier;
      } else if (key === 'excellent') {
        chance = data.base * (focusUsed ? 1.5 : 1.0);
      }
      adjustedChances[key] = Math.min(0.95, chance);
    });

    // Normalize
    const total = Object.values(adjustedChances).reduce((s, v) => s + v, 0);
    Object.keys(adjustedChances).forEach(k => adjustedChances[k] /= total);

    for (let i = 0; i < runs; i++) {
      let roll = Math.random();
      let quality = 'normal';
      let cumulative = 0;
      
      for (const [key, chance] of Object.entries(adjustedChances)) {
        cumulative += chance;
        if (roll <= cumulative) { quality = key; break; }
      }
      
      results[quality]++;
      totalValue += item.marketValue * QUALITY_BASE_CHANCES[quality].multiplier;
      if (focusUsed) totalFocus += FOCUS_COST_PER_ITEM;
    }

    const avgValue = totalValue / runs;
    const totalCost = (item.baseCost * runs) + (focusUsed ? 0 : 0); // focus = ücretsiz resource
    const totalRevenue = totalValue;
    const profit = totalRevenue - totalCost;
    const profitPerItem = profit / runs;
    const roi = totalCost > 0 ? (profit / totalCost * 100) : 0;
    const focusEfficiency = focusUsed && totalFocus > 0 ? profit / totalFocus : 0;

    return {
      item: item.name,
      runs,
      focusUsed,
      specLevel,
      totalFocus,
      qualityResults: results,
      totalCost,
      totalRevenue,
      profit,
      profitPerItem,
      roi,
      focusEfficiency,
      avgValue,
      masterpieceChance: adjustedChances.masterpiece * 100
    };
  }

  function formatSilver(value) {
    if (Math.abs(value) >= 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (Math.abs(value) >= 1000) return (value / 1000).toFixed(1) + 'K';
    return Math.round(value).toString();
  }

  function render(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="crafting-rng max-w-6xl mx-auto w-full h-full flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-hammer-crash mr-2 text-albion-accent"></i>Crafting RNG Simülatörü</h2>
          <p class="text-gray-400">Kalite şansı hesapla, focus verimliliğini ölç, en kârlı craft'ları bul.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Üretilecek Eşya</label>
            <select id="craftItem" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${CRAFTING_ITEMS.map(item => `<option value="${item.name}" data-cost="${item.baseCost}" data-value="${item.marketValue}">${item.name} (Maliyet: ${formatSilver(item.baseCost)}, Piyasa: ${formatSilver(item.marketValue)})</option>`).join('')}
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Simülasyon Sayısı</label>
            <select id="craftRuns" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              <option value="100">100 Craft (Hızlı)</option>
              <option value="500" selected>500 Craft (Standart)</option>
              <option value="1000">1000 Craft (Detaylı)</option>
              <option value="5000">5000 Craft (Ultra)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" id="craftFocus" class="w-5 h-5 rounded accent-yellow-500">
              <span class="text-sm font-bold text-gray-300">Focus Kullan (Masterpiece şansı 2x)</span>
            </label>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Spec Level (0-1200)</label>
            <input type="range" id="craftSpec" min="0" max="1200" value="0" step="100" class="w-full accent-yellow-500">
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span><span>300</span><span>600</span><span>900</span><span>1200</span>
            </div>
            <div class="text-center text-sm font-bold text-albion-accent mt-1" id="specValue">0 Spec</div>
          </div>
        </div>

        <button type="button" id="craftSimBtn" class="w-full bg-albion-accent hover:bg-yellow-500 text-black font-black py-4 px-4 rounded-xl transition-transform hover:scale-[1.01] flex justify-center items-center shadow-lg uppercase tracking-wider text-lg mb-6">
          <i class="fa-solid fa-hammer mr-2"></i> Craft Simülasyonunu Başlat
        </button>

        <div id="craftResult" class="flex-1">
          <div class="text-center py-12 text-gray-500">
            <i class="fa-solid fa-anvil text-6xl mb-4 block opacity-30"></i>
            <p class="text-lg font-bold">Başlamak için simülasyonu başlat</p>
            <p class="text-sm">Focus kullanımı ve spec level'ın kâra etkisini gör</p>
          </div>
        </div>
      </div>
    `;

    const specSlider = container.querySelector('#craftSpec');
    const specValue = container.querySelector('#specValue');
    specSlider.addEventListener('input', () => {
      specValue.textContent = specSlider.value + ' Spec';
    });

    const simBtn = container.querySelector('#craftSimBtn');
    const resultDiv = container.querySelector('#craftResult');

    simBtn.addEventListener('click', () => {
      simBtn.disabled = true;
      simBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Craft simülasyonu çalışıyor...';

      const itemSelect = container.querySelector('#craftItem');
      const selectedOption = itemSelect.selectedOptions[0];
      const item = {
        name: selectedOption.value,
        baseCost: parseInt(selectedOption.dataset.cost),
        marketValue: parseInt(selectedOption.dataset.value)
      };
      const runs = parseInt(container.querySelector('#craftRuns').value);
      const focusUsed = container.querySelector('#craftFocus').checked;
      const specLevel = parseInt(specSlider.value);

      setTimeout(() => {
        const result = simulateCraft(item, runs, focusUsed, specLevel);
        
        const profitColor = result.profit >= 0 ? 'text-green-400' : 'text-red-400';
        const roiColor = result.roi >= 0 ? 'text-green-400' : 'text-red-400';

        resultDiv.innerHTML = `
          <div class="space-y-4">
            <div class="bg-albion-800 border border-gray-700 rounded-xl p-5">
              <h3 class="text-lg font-bold text-white mb-4">${result.item} × ${result.runs} Craft ${result.focusUsed ? '(Focuslu)' : '(Focussuz)'} | Spec: ${result.specLevel}</h3>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Toplam Maliyet</div>
                  <div class="text-xl font-black text-red-400">${formatSilver(result.totalCost)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Toplam Gelir</div>
                  <div class="text-xl font-black text-green-400">${formatSilver(result.totalRevenue)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Net Kâr</div>
                  <div class="text-xl font-black ${profitColor}">${result.profit >= 0 ? '+' : ''}${formatSilver(result.profit)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">ROI</div>
                  <div class="text-xl font-black ${roiColor}">${result.roi.toFixed(1)}%</div>
                </div>
              </div>

              ${result.focusUsed ? `
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Toplam Focus</div>
                  <div class="text-lg font-black text-blue-400">${formatSilver(result.totalFocus)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Focus Verimliliği</div>
                  <div class="text-lg font-black text-cyan-400">${formatSilver(result.focusEfficiency)}/focus</div>
                </div>
              </div>
              ` : ''}

              <div class="bg-albion-900 rounded-lg p-4">
                <h4 class="text-sm font-bold text-gray-300 mb-3">📊 Kalite Dağılımı</h4>
                <div class="space-y-2">
                  ${Object.entries(result.qualityResults).map(([quality, count]) => {
                    const pct = (count / result.runs * 100).toFixed(1);
                    const data = QUALITY_BASE_CHANCES[quality];
                    return `
                      <div class="flex items-center gap-3">
                        <span class="text-xs font-bold w-20" style="color:${data.color}">${data.label}</span>
                        <div class="flex-1 h-5 bg-gray-800 rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all duration-500" style="width:${pct}%;background:${data.color}"></div>
                        </div>
                        <span class="text-xs font-bold text-white w-16 text-right">${count} (${pct}%)</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p class="text-xs text-yellow-400">
                  <i class="fa-solid fa-star mr-1"></i> 
                  Masterpiece şansı: <strong>${result.masterpieceChance.toFixed(2)}%</strong> | 
                  Beklenen Masterpiece: <strong>${(result.masterpieceChance / 100 * result.runs).toFixed(1)} adet</strong>
                </p>
              </div>
            </div>
          </div>
        `;

        simBtn.disabled = false;
        simBtn.innerHTML = '<i class="fa-solid fa-hammer mr-2"></i> Craft Simülasyonunu Başlat';
      }, 300);
    });
  }

  window.CraftingRNG = { render, simulateCraft, CRAFTING_ITEMS, QUALITY_BASE_CHANCES };
})();
