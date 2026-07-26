/* Loot Simülatörü - Solo/Group dungeon kazanç tahmini ve RNG hesaplama */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const DUNGEON_TYPES = {
    solo_t4: { name: 'T4 Solo Dungeon', avgSilver: 45000, avgFame: 12000, timeMin: 8, risk: 'low', lootTable: [
      { item: 'Rune', chance: 0.35, value: 2500 },
      { item: 'T4 Runes', chance: 0.25, value: 5000 },
      { item: 'T4 Gear Piece', chance: 0.20, value: 15000 },
      { item: 'Tome of Insight', chance: 0.12, value: 8000 },
      { item: 'Siphoned Energy', chance: 0.05, value: 35000 },
      { item: 'Random T4.1', chance: 0.03, value: 45000 }
    ]},
    solo_t5: { name: 'T5 Solo Dungeon', avgSilver: 85000, avgFame: 22000, timeMin: 10, risk: 'low', lootTable: [
      { item: 'Rune', chance: 0.30, value: 2500 },
      { item: 'T5 Runes', chance: 0.22, value: 8000 },
      { item: 'T5 Gear Piece', chance: 0.20, value: 25000 },
      { item: 'Tome of Insight', chance: 0.15, value: 12000 },
      { item: 'Siphoned Energy', chance: 0.08, value: 35000 },
      { item: 'Random T5.1', chance: 0.05, value: 75000 }
    ]},
    solo_t6: { name: 'T6 Solo Dungeon', avgSilver: 150000, avgFame: 38000, timeMin: 12, risk: 'medium', lootTable: [
      { item: 'Soul', chance: 0.25, value: 5000 },
      { item: 'T6 Runes', chance: 0.20, value: 12000 },
      { item: 'T6 Gear Piece', chance: 0.22, value: 40000 },
      { item: 'Tome of Insight', chance: 0.15, value: 18000 },
      { item: 'Siphoned Energy', chance: 0.10, value: 35000 },
      { item: 'Random T6.1', chance: 0.05, value: 120000 },
      { item: 'T6.2 Item', chance: 0.03, value: 250000 }
    ]},
    solo_t7: { name: 'T7 Solo Dungeon', avgSilver: 280000, avgFame: 60000, timeMin: 15, risk: 'medium', lootTable: [
      { item: 'Soul', chance: 0.22, value: 5000 },
      { item: 'T7 Runes', chance: 0.18, value: 18000 },
      { item: 'T7 Gear Piece', chance: 0.22, value: 65000 },
      { item: 'Tome of Insight', chance: 0.15, value: 25000 },
      { item: 'Siphoned Energy', chance: 0.12, value: 35000 },
      { item: 'Random T7.1', chance: 0.06, value: 200000 },
      { item: 'T7.2 Item', chance: 0.04, value: 450000 },
      { item: 'T7.3 Item', chance: 0.01, value: 1200000 }
    ]},
    solo_t8: { name: 'T8 Solo Dungeon', avgSilver: 520000, avgFame: 95000, timeMin: 18, risk: 'high', lootTable: [
      { item: 'Relic', chance: 0.20, value: 8000 },
      { item: 'T8 Runes', chance: 0.18, value: 25000 },
      { item: 'T8 Gear Piece', chance: 0.22, value: 100000 },
      { item: 'Tome of Insight', chance: 0.15, value: 35000 },
      { item: 'Siphoned Energy', chance: 0.12, value: 35000 },
      { item: 'Random T8.1', chance: 0.07, value: 350000 },
      { item: 'T8.2 Item', chance: 0.04, value: 800000 },
      { item: 'T8.3 Item', chance: 0.02, value: 2500000 }
    ]},
    group_t6: { name: 'T6 Grup Dungeon (5 kişi)', avgSilver: 120000, avgFame: 45000, timeMin: 20, risk: 'medium', lootTable: [
      { item: 'Soul', chance: 0.30, value: 5000 },
      { item: 'T6 Gear Piece', chance: 0.25, value: 40000 },
      { item: 'Tome of Insight', chance: 0.18, value: 18000 },
      { item: 'Siphoned Energy', chance: 0.12, value: 35000 },
      { item: 'T6.1 Item', chance: 0.08, value: 120000 },
      { item: 'T6.2 Item', chance: 0.05, value: 250000 },
      { item: 'T6.3 Item', chance: 0.02, value: 600000 }
    ]},
    group_t8: { name: 'T8 Grup Dungeon (5 kişi)', avgSilver: 350000, avgFame: 85000, timeMin: 25, risk: 'high', lootTable: [
      { item: 'Relic', chance: 0.25, value: 8000 },
      { item: 'T8 Gear Piece', chance: 0.22, value: 100000 },
      { item: 'Tome of Insight', chance: 0.18, value: 35000 },
      { item: 'Siphoned Energy', chance: 0.15, value: 35000 },
      { item: 'T8.1 Item', chance: 0.10, value: 350000 },
      { item: 'T8.2 Item', chance: 0.06, value: 800000 },
      { item: 'T8.3 Item', chance: 0.04, value: 2500000 }
    ]},
    avalon_chest: { name: 'Avalon Altın Sandık (7 kişi)', avgSilver: 850000, avgFame: 120000, timeMin: 35, risk: 'very_high', lootTable: [
      { item: 'Relic', chance: 0.30, value: 8000 },
      { item: 'Avalonian Shard', chance: 0.20, value: 15000 },
      { item: 'T8 Gear Piece', chance: 0.18, value: 100000 },
      { item: 'Siphoned Energy', chance: 0.12, value: 35000 },
      { item: 'T8.1 Item', chance: 0.08, value: 350000 },
      { item: 'T8.2 Item', chance: 0.06, value: 800000 },
      { item: 'T8.3 Item', chance: 0.04, value: 2500000 },
      { item: 'Avalonian Item', chance: 0.02, value: 5000000 }
    ]}
  };

  function simulateRun(dungeonType, runs = 100) {
    const dungeon = DUNGEON_TYPES[dungeonType];
    if (!dungeon) return null;

    const results = [];
    let totalSilver = 0;
    let totalFame = 0;
    let bestRun = 0;
    let worstRun = Infinity;
    let jackpotCount = 0;

    for (let i = 0; i < runs; i++) {
      let runSilver = 0;
      dungeon.lootTable.forEach((loot) => {
        if (Math.random() < loot.chance) {
          runSilver += loot.value * (0.8 + Math.random() * 0.4); // ±20% variance
        }
      });
      runSilver += dungeon.avgSilver * 0.1 * (Math.random() - 0.5); // base variance
      runSilver = Math.round(Math.max(5000, runSilver));
      
      results.push(runSilver);
      totalSilver += runSilver;
      totalFame += dungeon.avgFame * (0.9 + Math.random() * 0.2);
      if (runSilver > bestRun) bestRun = runSilver;
      if (runSilver < worstRun) worstRun = runSilver;
      if (runSilver > dungeon.avgSilver * 3) jackpotCount++;
    }

    const avg = Math.round(totalSilver / runs);
    const sorted = [...results].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const p25 = sorted[Math.floor(sorted.length * 0.25)];
    const p75 = sorted[Math.floor(sorted.length * 0.75)];

    return {
      dungeon: dungeon.name,
      runs,
      avgSilver: avg,
      medianSilver: median,
      p25Silver: p25,
      p75Silver: p75,
      bestRun,
      worstRun,
      jackpotCount,
      avgFame: Math.round(totalFame / runs),
      totalTimeMin: dungeon.timeMin * runs,
      silverPerHour: Math.round(avg / dungeon.timeMin * 60),
      famePerHour: Math.round(totalFame / runs / dungeon.timeMin * 60),
      risk: dungeon.risk
    };
  }

  function formatSilver(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  }

  function getRiskBadge(risk) {
    const badges = {
      low: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">Düşük Risk</span>',
      medium: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Orta Risk</span>',
      high: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">Yüksek Risk</span>',
      very_high: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">Çok Yüksek Risk</span>'
    };
    return badges[risk] || '';
  }

  function render(container) {
    if (!container) return;
    
    container.innerHTML = `
      <div class="loot-simulator max-w-6xl mx-auto w-full h-full flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-dice-d20 mr-2 text-albion-accent"></i>Loot Simülatörü</h2>
          <p class="text-gray-400">100 dungeon simülasyonu ile ortalama kazancını hesapla. RNG faktörü dahil!</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Dungeon Tipi</label>
            <select id="lootDungeonType" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              <optgroup label="Solo Dungeon">
                <option value="solo_t4">T4 Solo Dungeon</option>
                <option value="solo_t5">T5 Solo Dungeon</option>
                <option value="solo_t6" selected>T6 Solo Dungeon</option>
                <option value="solo_t7">T7 Solo Dungeon</option>
                <option value="solo_t8">T8 Solo Dungeon</option>
              </optgroup>
              <optgroup label="Grup Dungeon">
                <option value="group_t6">T6 Grup Dungeon (5 kişi)</option>
                <option value="group_t8">T8 Grup Dungeon (5 kişi)</option>
              </optgroup>
              <optgroup label="Avalon">
                <option value="avalon_chest">Avalon Altın Sandık (7 kişi)</option>
              </optgroup>
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Simülasyon Sayısı</label>
            <select id="lootRunCount" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              <option value="50">50 Run (Hızlı)</option>
              <option value="100" selected>100 Run (Standart)</option>
              <option value="250">250 Run (Detaylı)</option>
              <option value="500">500 Run (Ultra Detaylı)</option>
              <option value="1000">1000 Run (Maksimum)</option>
            </select>
          </div>
        </div>
        
        <button type="button" id="lootSimBtn" class="w-full bg-albion-accent hover:bg-yellow-500 text-black font-black py-4 px-4 rounded-xl transition-transform hover:scale-[1.01] flex justify-center items-center shadow-lg uppercase tracking-wider text-lg mb-6">
          <i class="fa-solid fa-dice mr-2"></i> Simülasyonu Başlat
        </button>
        
        <div id="lootSimResult" class="flex-1">
          <div class="text-center py-12 text-gray-500">
            <i class="fa-solid fa-dice-d20 text-6xl mb-4 block opacity-30"></i>
            <p class="text-lg font-bold">Başlamak için simülasyonu başlat</p>
            <p class="text-sm">100 dungeon run'ı simüle edilip ortalama kazanç hesaplanacak</p>
          </div>
        </div>
      </div>
    `;

    const resultDiv = container.querySelector('#lootSimResult');
    const simBtn = container.querySelector('#lootSimBtn');
    const typeSelect = container.querySelector('#lootDungeonType');
    const runSelect = container.querySelector('#lootRunCount');

    simBtn.addEventListener('click', () => {
      simBtn.disabled = true;
      simBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Simülasyon çalışıyor...';
      
      setTimeout(() => {
        const result = simulateRun(typeSelect.value, parseInt(runSelect.value));
        if (!result) {
          resultDiv.innerHTML = '<div class="text-center py-8 text-red-400">Simülasyon hatası! Tekrar dene.</div>';
          simBtn.disabled = false;
          simBtn.innerHTML = '<i class="fa-solid fa-dice mr-2"></i> Simülasyonu Başlat';
          return;
        }

        const barWidth = Math.min(100, (result.silverPerHour / 3000000) * 100);
        
        resultDiv.innerHTML = `
          <div class="space-y-4">
            <div class="bg-albion-800 border border-gray-700 rounded-xl p-5">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-white">${result.dungeon} × ${result.runs} Run</h3>
                ${getRiskBadge(result.risk)}
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Ort. Gümüş/Run</div>
                  <div class="text-xl font-black text-albion-accent">${formatSilver(result.avgSilver)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Ort. Fame/Run</div>
                  <div class="text-xl font-black text-blue-400">${formatSilver(result.avgFame)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Gümüş/Saat</div>
                  <div class="text-xl font-black text-green-400">${formatSilver(result.silverPerHour)}</div>
                </div>
                <div class="bg-albion-900 rounded-lg p-3 text-center">
                  <div class="text-xs text-gray-400 mb-1">Toplam Süre</div>
                  <div class="text-xl font-black text-white">${Math.floor(result.totalTimeMin / 60)}s ${result.totalTimeMin % 60}dk</div>
                </div>
              </div>
              
              <div class="bg-albion-900 rounded-lg p-4">
                <div class="text-xs text-gray-400 mb-2">Saatlik Kazanç Karşılaştırması</div>
                <div class="relative h-6 bg-gray-800 rounded-full overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-500" style="width:${barWidth}%"></div>
                  <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-black drop-shadow">${formatSilver(result.silverPerHour)}/saat</span>
                </div>
                <div class="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>0</span><span>750K</span><span>1.5M</span><span>2.25M</span><span>3M+</span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="bg-albion-800 border border-gray-700 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400">En İyi Run</div>
                <div class="text-lg font-black text-green-400">${formatSilver(result.bestRun)}</div>
              </div>
              <div class="bg-albion-800 border border-gray-700 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400">En Kötü Run</div>
                <div class="text-lg font-black text-red-400">${formatSilver(result.worstRun)}</div>
              </div>
              <div class="bg-albion-800 border border-gray-700 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400">Medyan</div>
                <div class="text-lg font-black text-white">${formatSilver(result.medianSilver)}</div>
              </div>
              <div class="bg-albion-800 border border-gray-700 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400">Jackpot! (3x+)</div>
                <div class="text-lg font-black text-yellow-400">${result.jackpotCount} kez</div>
              </div>
            </div>
            
            <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
              <h4 class="text-sm font-bold text-gray-300 mb-2">📊 Dağılım Analizi</h4>
              <div class="flex items-center gap-2 text-xs">
                <span class="text-red-400">P25: ${formatSilver(result.p25Silver)}</span>
                <span class="text-gray-500">→</span>
                <span class="text-yellow-400 font-bold">Medyan: ${formatSilver(result.medianSilver)}</span>
                <span class="text-gray-500">→</span>
                <span class="text-green-400">P75: ${formatSilver(result.p75Silver)}</span>
              </div>
              <p class="text-[10px] text-gray-500 mt-2">%50 ihtimalle ${formatSilver(result.p25Silver)} - ${formatSilver(result.p75Silver)} arası kazanırsın. %25 ihtimalle ${formatSilver(result.p75Silver)}+ kazanırsın.</p>
            </div>
          </div>
        `;
        
        simBtn.disabled = false;
        simBtn.innerHTML = '<i class="fa-solid fa-dice mr-2"></i> Simülasyonu Başlat';
      }, 300);
    });
  }

  window.LootSimulator = { render, simulateRun, DUNGEON_TYPES };
})();
