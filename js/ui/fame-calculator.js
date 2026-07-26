/* Fame Calculator - Seviye atlama süresi, fame/saat optimizasyonu, en verimli aktivite bulma */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  // Albion Online fame requirements per level (simplified, approximate)
  const FAME_PER_LEVEL = {
    1: 0, 2: 1000, 3: 3000, 4: 7000, 5: 15000, 6: 30000,
    7: 55000, 8: 90000, 9: 140000, 10: 200000, 11: 280000,
    12: 380000, 13: 500000, 14: 650000, 15: 820000, 16: 1020000,
    17: 1250000, 18: 1520000, 19: 1820000, 20: 2160000,
    // Mastery levels (spec)
    21: 500000, 22: 800000, 23: 1200000, 24: 1700000,
    25: 2300000, 26: 3000000, 27: 3800000, 28: 4700000,
    29: 5700000, 30: 6800000, 31: 8000000, 32: 9300000,
    33: 10700000, 34: 12200000, 35: 13800000, 36: 15500000,
    37: 17300000, 38: 19200000, 39: 21200000, 40: 23300000,
    // Higher spec
    41: 5000000, 42: 6000000, 43: 7200000, 44: 8600000, 45: 10200000,
    46: 12000000, 47: 14000000, 48: 16200000, 49: 18600000, 50: 21200000,
    51: 5000000, 52: 6000000, 53: 7200000, 54: 8600000, 55: 10200000,
    56: 12000000, 57: 14000000, 58: 16200000, 59: 18600000, 60: 21200000,
    61: 5000000, 62: 6000000, 63: 7200000, 64: 8600000, 65: 10200000,
    66: 12000000, 67: 14000000, 68: 16200000, 69: 18600000, 70: 21200000,
    71: 5000000, 72: 6000000, 73: 7200000, 74: 8600000, 75: 10200000,
    76: 12000000, 77: 14000000, 78: 16200000, 79: 18600000, 80: 21200000,
    81: 5000000, 82: 6000000, 83: 7200000, 84: 8600000, 85: 10200000,
    86: 12000000, 87: 14000000, 88: 16200000, 89: 18600000, 90: 21200000,
    91: 5000000, 92: 6000000, 93: 7200000, 94: 8600000, 95: 10200000,
    96: 12000000, 97: 14000000, 98: 16200000, 99: 18600000, 100: 21200000,
    101: 8000000, 102: 10000000, 103: 12500000, 104: 15500000, 105: 19000000,
    106: 23000000, 107: 27500000, 108: 32500000, 109: 38000000, 110: 44000000,
    111: 12000000, 112: 15000000, 113: 18500000, 114: 22500000, 115: 27000000,
    116: 32000000, 117: 37500000, 118: 43500000, 119: 50000000, 120: 57000000
  };

  const ACTIVITIES = {
    solo_dungeon_t6: { name: 'T6 Solo Dungeon', famePerHour: 180000, risk: 'low', silverPerHour: 750000 },
    solo_dungeon_t7: { name: 'T7 Solo Dungeon', famePerHour: 280000, risk: 'medium', silverPerHour: 1200000 },
    solo_dungeon_t8: { name: 'T8 Solo Dungeon', famePerHour: 420000, risk: 'high', silverPerHour: 1800000 },
    group_dungeon_t6: { name: 'T6 Grup Dungeon', famePerHour: 350000, risk: 'low', silverPerHour: 600000 },
    group_dungeon_t8: { name: 'T8 Grup Dungeon', famePerHour: 650000, risk: 'high', silverPerHour: 1400000 },
    avalon_t6: { name: 'T6 Avalon Roads', famePerHour: 500000, risk: 'medium', silverPerHour: 2000000 },
    avalon_t8: { name: 'T8 Avalon Roads', famePerHour: 900000, risk: 'very_high', silverPerHour: 3500000 },
    open_world_t6: { name: 'T6 Açık Dünya Farm', famePerHour: 220000, risk: 'medium', silverPerHour: 400000 },
    open_world_t8: { name: 'T8 Açık Dünya Farm', famePerHour: 550000, risk: 'high', silverPerHour: 900000 },
    corrupted_t6: { name: 'T6 Corrupted Dungeon', famePerHour: 250000, risk: 'medium', silverPerHour: 500000 },
    corrupted_t8: { name: 'T8 Corrupted Dungeon', famePerHour: 480000, risk: 'high', silverPerHour: 1100000 },
    hce_10: { name: 'HCE Level 10', famePerHour: 400000, risk: 'low', silverPerHour: 300000 },
    hce_15: { name: 'HCE Level 15', famePerHour: 700000, risk: 'medium', silverPerHour: 500000 },
    hce_18: { name: 'HCE Level 18', famePerHour: 1200000, risk: 'high', silverPerHour: 800000 },
    static_dungeon_t7: { name: 'T7 Static Dungeon', famePerHour: 380000, risk: 'medium', silverPerHour: 600000 },
    static_dungeon_t8: { name: 'T8 Static Dungeon', famePerHour: 600000, risk: 'high', silverPerHour: 1000000 },
    world_boss: { name: 'World Boss Grubu', famePerHour: 800000, risk: 'very_high', silverPerHour: 2500000 }
  };

  function calculateFamePath(currentLevel, targetLevel, activityFamePerHour, premiumActive = true) {
    const multiplier = premiumActive ? 1.5 : 1.0; // Premium = +50% fame
    const effectiveFamePerHour = activityFamePerHour * multiplier;

    let totalFameNeeded = 0;
    for (let lvl = currentLevel + 1; lvl <= targetLevel; lvl++) {
      totalFameNeeded += FAME_PER_LEVEL[lvl] || 0;
    }

    const hoursNeeded = totalFameNeeded / effectiveFamePerHour;
    const daysNeeded = hoursNeeded / 8; // 8 saat/gün
    const sessionsNeeded = hoursNeeded / 3; // 3 saat/session

    return {
      currentLevel,
      targetLevel,
      totalFameNeeded,
      effectiveFamePerHour,
      hoursNeeded,
      daysNeeded,
      sessionsNeeded,
      premiumActive
    };
  }

  function compareActivities(currentLevel, targetLevel, premiumActive = true) {
    return Object.entries(ACTIVITIES).map(([key, activity]) => {
      const calc = calculateFamePath(currentLevel, targetLevel, activity.famePerHour, premiumActive);
      return {
        key,
        name: activity.name,
        famePerHour: activity.famePerHour,
        risk: activity.risk,
        silverPerHour: activity.silverPerHour,
        hoursNeeded: calc.hoursNeeded,
        daysNeeded: calc.daysNeeded,
        totalSilverEarned: calc.hoursNeeded * activity.silverPerHour
      };
    }).sort((a, b) => a.hoursNeeded - b.hoursNeeded);
  }

  function formatNumber(value) {
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return Math.round(value).toString();
  }

  function formatTime(hours) {
    if (hours < 1) return Math.round(hours * 60) + ' dakika';
    if (hours < 24) return hours.toFixed(1) + ' saat';
    return (hours / 24).toFixed(1) + ' gün';
  }

  function getRiskBadge(risk) {
    const badges = {
      low: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">Düşük</span>',
      medium: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Orta</span>',
      high: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">Yüksek</span>',
      very_high: '<span class="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">Çok Yüksek</span>'
    };
    return badges[risk] || '';
  }

  function render(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="fame-calculator max-w-6xl mx-auto w-full h-full flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-star-half-stroke mr-2 text-albion-accent"></i>Fame Calculator</h2>
          <p class="text-gray-400">Hedef seviyeye kaç saatte ulaşacağını hesapla, en verimli aktiviteyi bul.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Mevcut Level</label>
            <select id="fameCurrentLevel" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${Array.from({length: 100}, (_, i) => i + 1).map(lvl => `<option value="${lvl}">Level ${lvl}</option>`).join('')}
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Hedef Level</label>
            <select id="fameTargetLevel" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${Array.from({length: 100}, (_, i) => i + 1).map(lvl => `<option value="${lvl}" ${lvl === 100 ? 'selected' : ''}>Level ${lvl}</option>`).join('')}
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Premium</label>
            <select id="famePremium" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              <option value="true" selected>Premium Aktif (+%50 Fame)</option>
              <option value="false">Premium Yok</option>
            </select>
          </div>
        </div>

        <button type="button" id="fameCalcBtn" class="w-full bg-albion-accent hover:bg-yellow-500 text-black font-black py-4 px-4 rounded-xl transition-transform hover:scale-[1.01] flex justify-center items-center shadow-lg uppercase tracking-wider text-lg mb-6">
          <i class="fa-solid fa-calculator mr-2"></i> Hesapla ve Karşılaştır
        </button>

        <div id="fameResult" class="flex-1">
          <div class="text-center py-12 text-gray-500">
            <i class="fa-solid fa-trophy-star text-6xl mb-4 block opacity-30"></i>
            <p class="text-lg font-bold">Level ve hedef seç, hesapla</p>
            <p class="text-sm">Tüm aktiviteler karşılaştırılıp en hızlı yol gösterilecek</p>
          </div>
        </div>
      </div>
    `;

    const calcBtn = container.querySelector('#fameCalcBtn');
    const resultDiv = container.querySelector('#fameResult');

    calcBtn.addEventListener('click', () => {
      const currentLevel = parseInt(container.querySelector('#fameCurrentLevel').value);
      const targetLevel = parseInt(container.querySelector('#fameTargetLevel').value);
      const premiumActive = container.querySelector('#famePremium').value === 'true';

      if (currentLevel >= targetLevel) {
        resultDiv.innerHTML = '<div class="text-center py-8 text-red-400">Hedef level mevcut level\'dan yüksek olmalı!</div>';
        return;
      }

      const comparisons = compareActivities(currentLevel, targetLevel, premiumActive);
      const best = comparisons[0];
      const worst = comparisons[comparisons.length - 1];

      resultDiv.innerHTML = `
        <div class="space-y-4">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-5">
            <h3 class="text-lg font-bold text-white mb-1">Level ${currentLevel} → Level ${targetLevel}</h3>
            <p class="text-sm text-gray-400 mb-4">Toplam Fame Gerekli: <span class="text-albion-accent font-black text-lg">${formatNumber(comparisons[0].hoursNeeded * comparisons[0].famePerHour * (premiumActive ? 1.5 : 1))}</span></p>

            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div class="text-xs text-green-400 mb-1">🏆 En Hızlı</div>
                <div class="text-lg font-black text-green-400">${best.name}</div>
                <div class="text-xs text-gray-400">${formatTime(best.hoursNeeded)}</div>
              </div>
              <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div class="text-xs text-red-400 mb-1">🐌 En Yavaş</div>
                <div class="text-lg font-black text-red-400">${worst.name}</div>
                <div class="text-xs text-gray-400">${formatTime(worst.hoursNeeded)}</div>
              </div>
            </div>

            <div class="bg-albion-900 rounded-lg p-4">
              <h4 class="text-sm font-bold text-gray-300 mb-3">📊 Tüm Aktiviteler (En Hızlıdan Yavaşa)</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-gray-500 text-xs uppercase">
                      <th class="text-left p-2">Aktivite</th>
                      <th class="text-right p-2">Risk</th>
                      <th class="text-right p-2">Fame/Saat</th>
                      <th class="text-right p-2">Süre</th>
                      <th class="text-right p-2">Kazanç</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${comparisons.map((c, i) => `
                      <tr class="border-t border-gray-800 ${i === 0 ? 'bg-yellow-500/5' : ''}">
                        <td class="p-2 text-white font-bold">
                          ${i === 0 ? '👑 ' : ''}${c.name}
                        </td>
                        <td class="p-2 text-right">${getRiskBadge(c.risk)}</td>
                        <td class="p-2 text-right text-blue-400">${formatNumber(c.famePerHour)}/sa</td>
                        <td class="p-2 text-right ${i === 0 ? 'text-green-400 font-bold' : 'text-white'}">${formatTime(c.hoursNeeded)}</td>
                        <td class="p-2 text-right text-albion-accent">+${formatNumber(c.totalSilverEarned)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p class="text-xs text-blue-400">
                <i class="fa-solid fa-lightbulb mr-1"></i>
                <strong>İpucu:</strong> En hızlı yol ${best.name}. 
                ${best.risk === 'high' || best.risk === 'very_high' ? 'Ama yüksek riskli! Daha güvenli alternatif: ' + comparisons.find(c => c.risk === 'low' || c.risk === 'medium')?.name + ' (' + formatTime(comparisons.find(c => c.risk === 'low' || c.risk === 'medium')?.hoursNeeded || 0) + ').' : 'Aynı zamanda düşük riskli, ideal seçim!'}
              </p>
            </div>
          </div>
        </div>
      `;
    });
  }

  window.FameCalculator = { render, calculateFamePath, compareActivities, ACTIVITIES, FAME_PER_LEVEL };
})();
