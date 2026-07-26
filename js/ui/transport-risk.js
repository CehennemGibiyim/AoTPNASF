/* Transport Risk Analizi - Rota güvenlik puanı, ganker riski, en güvenli taşıma rotası */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const CITIES = [
    { id: 'lymhurst', name: 'Lymhurst', biome: 'Orman', zone: 'blue', x: 35, y: 65 },
    { id: 'bridgewatch', name: 'Bridgewatch', biome: 'Çöl', zone: 'blue', x: 55, y: 35 },
    { id: 'fort_sterling', name: 'Fort Sterling', biome: 'Dağ', zone: 'blue', x: 25, y: 25 },
    { id: 'martlock', name: 'Martlock', biome: 'Bataklık', zone: 'blue', x: 65, y: 55 },
    { id: 'thetford', name: 'Thetford', biome: 'Bozkır', zone: 'blue', x: 45, y: 75 },
    { id: 'caerleon', name: 'Caerleon', biome: 'Merkez', zone: 'red', x: 50, y: 50 }
  ];

  const ROUTES = {
    'lymhurst-bridgewatch': { zones: 6, redZones: 0, blackZones: 0, avgGankers: 2, difficulty: 'Kolay', riskScore: 15 },
    'lymhurst-fort_sterling': { zones: 5, redZones: 0, blackZones: 0, avgGankers: 1, difficulty: 'Çok Kolay', riskScore: 8 },
    'lymhurst-martlock': { zones: 7, redZones: 1, blackZones: 0, avgGankers: 4, difficulty: 'Orta', riskScore: 35 },
    'lymhurst-thetford': { zones: 4, redZones: 0, blackZones: 0, avgGankers: 1, difficulty: 'Çok Kolay', riskScore: 5 },
    'lymhurst-caerleon': { zones: 8, redZones: 3, blackZones: 0, avgGankers: 8, difficulty: 'Zor', riskScore: 65 },
    'bridgewatch-fort_sterling': { zones: 6, redZones: 0, blackZones: 0, avgGankers: 2, difficulty: 'Kolay', riskScore: 12 },
    'bridgewatch-martlock': { zones: 5, redZones: 0, blackZones: 0, avgGankers: 1, difficulty: 'Çok Kolay', riskScore: 7 },
    'bridgewatch-thetford': { zones: 5, redZones: 0, blackZones: 0, avgGankers: 2, difficulty: 'Kolay', riskScore: 10 },
    'bridgewatch-caerleon': { zones: 6, redZones: 2, blackZones: 0, avgGankers: 6, difficulty: 'Orta-Zor', riskScore: 50 },
    'fort_sterling-martlock': { zones: 7, redZones: 1, blackZones: 0, avgGankers: 3, difficulty: 'Orta', riskScore: 30 },
    'fort_sterling-thetford': { zones: 6, redZones: 0, blackZones: 0, avgGankers: 2, difficulty: 'Kolay', riskScore: 14 },
    'fort_sterling-caerleon': { zones: 7, redZones: 3, blackZones: 0, avgGankers: 7, difficulty: 'Zor', riskScore: 60 },
    'martlock-thetford': { zones: 5, redZones: 0, blackZones: 0, avgGankers: 2, difficulty: 'Kolay', riskScore: 11 },
    'martlock-caerleon': { zones: 5, redZones: 2, blackZones: 0, avgGankers: 5, difficulty: 'Orta', riskScore: 45 },
    'thetford-caerleon': { zones: 6, redZones: 2, blackZones: 0, avgGankers: 6, difficulty: 'Orta-Zor', riskScore: 48 }
  };

  const TRANSPORT_TYPES = {
    ox_t4: { name: 'T4 Ox', capacity: 1500, speed: 65, cost: 35000, riskReduction: 0 },
    ox_t6: { name: 'T6 Ox', capacity: 2800, speed: 55, cost: 120000, riskReduction: 5 },
    ox_t8: { name: 'T8 Ox', capacity: 4500, speed: 45, cost: 450000, riskReduction: 10 },
    horse_t6: { name: 'T6 At', capacity: 400, speed: 100, cost: 80000, riskReduction: 15 },
    horse_t8: { name: 'T8 At', capacity: 500, speed: 120, cost: 350000, riskReduction: 25 },
    spectral_boar: { name: 'Spectral Boar', capacity: 800, speed: 95, cost: 220000, riskReduction: 20 },
    grizzly: { name: 'Grizzly Bear', capacity: 3000, speed: 50, cost: 280000, riskReduction: 8 },
    frost_ram: { name: 'Frost Ram', capacity: 600, speed: 110, cost: 180000, riskReduction: 22 }
  };

  const TIME_SLOTS = {
    peak: { name: 'Prime Time (18:00-22:00)', gankerMultiplier: 2.5, riskMultiplier: 2.0 },
    normal: { name: 'Normal (12:00-18:00)', gankerMultiplier: 1.2, riskMultiplier: 1.2 },
    offpeak: { name: 'Off-Peak (22:00-06:00)', gankerMultiplier: 0.6, riskMultiplier: 0.7 },
    dead: { name: 'Ölü Saat (06:00-12:00)', gankerMultiplier: 0.3, riskMultiplier: 0.5 }
  };

  function getRouteKey(from, to) {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    return ROUTES[key1] ? key1 : ROUTES[key2] ? key2 : null;
  }

  function analyzeTransport(fromId, toId, transportType, timeSlot, cargoValue) {
    const routeKey = getRouteKey(fromId, toId);
    if (!routeKey) return null;

    const route = ROUTES[routeKey];
    const transport = TRANSPORT_TYPES[transportType];
    const time = TIME_SLOTS[timeSlot];

    const effectiveRisk = Math.min(100, Math.max(1,
      route.riskScore * time.riskMultiplier * (1 - transport.riskReduction / 100)
    ));

    const expectedGankers = Math.round(route.avgGankers * time.gankerMultiplier);
    const survivalChance = Math.max(5, 100 - effectiveRisk);
    
    // Kaçış bonusu: hızlı mount'lar daha yüksek kaçış şansı
    const escapeBonus = Math.min(25, transport.speed / 5);
    const adjustedSurvival = Math.min(98, survivalChance + escapeBonus);

    const transportTimeMin = Math.round(route.zones * 2.5 * (100 / transport.speed));
    const riskLevel = effectiveRisk < 20 ? 'low' : effectiveRisk < 40 ? 'medium' : effectiveRisk < 60 ? 'high' : 'critical';

    // Beklenen kayıp
    const expectedLoss = cargoValue * (1 - adjustedSurvival / 100);
    const insuranceRecommendation = cargoValue > 500000 ? 'Önerilir' : 'Gerekli Değil';

    return {
      route: `${CITIES.find(c => c.id === fromId)?.name} → ${CITIES.find(c => c.id === toId)?.name}`,
      zones: route.zones,
      redZones: route.redZones,
      blackZones: route.blackZones,
      effectiveRisk: Math.round(effectiveRisk),
      expectedGankers,
      survivalChance: Math.round(adjustedSurvival),
      transportTimeMin,
      riskLevel,
      expectedLoss: Math.round(expectedLoss),
      insuranceRecommendation,
      transportName: transport.name,
      transportCost: transport.cost,
      cargoCapacity: transport.capacity,
      cargoValue
    };
  }

  function getRiskColor(level) {
    return { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' }[level] || '#9ca3af';
  }

  function getRiskLabel(level) {
    return { low: 'Düşük Risk ✅', medium: 'Orta Risk ⚠️', high: 'Yüksek Risk 🔴', critical: 'Kritik Risk 💀' }[level] || 'Bilinmiyor';
  }

  function formatSilver(value) {
    if (Math.abs(value) >= 1000000) return (value / 1000000).toFixed(2) + 'M';
    if (Math.abs(value) >= 1000) return (value / 1000).toFixed(1) + 'K';
    return Math.round(value).toString();
  }

  function render(container) {
    if (!container) return;

    container.innerHTML = `
      <div class="transport-risk max-w-6xl mx-auto w-full h-full flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-truck-fast mr-2 text-albion-accent"></i>Transport Risk Analizi</h2>
          <p class="text-gray-400">Rota güvenlik puanı, ganker riski, en uygun taşıma zamanı ve mount seçimi.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Başlangıç Şehri</label>
            <select id="transportFrom" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${CITIES.map(c => `<option value="${c.id}">${c.name} (${c.biome})</option>`).join('')}
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Hedef Şehir</label>
            <select id="transportTo" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${CITIES.filter(c => c.id !== 'lymhurst').map(c => `<option value="${c.id}">${c.name} (${c.biome})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Mount / Taşıyıcı</label>
            <select id="transportMount" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${Object.entries(TRANSPORT_TYPES).map(([key, val]) => `<option value="${key}">${val.name} (${val.capacity}kg, ${val.speed}% hız)</option>`).join('')}
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Zaman Dilimi</label>
            <select id="transportTime" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
              ${Object.entries(TIME_SLOTS).map(([key, val]) => `<option value="${key}">${val.name}</option>`).join('')}
            </select>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <label class="block text-sm font-bold text-gray-300 mb-2">Taşınan Yük Değeri (Silver)</label>
            <input type="number" id="transportCargo" value="500000" min="10000" step="50000" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-albion-accent outline-none">
          </div>
        </div>

        <button type="button" id="transportAnalyzeBtn" class="w-full bg-albion-accent hover:bg-yellow-500 text-black font-black py-4 px-4 rounded-xl transition-transform hover:scale-[1.01] flex justify-center items-center shadow-lg uppercase tracking-wider text-lg mb-6">
          <i class="fa-solid fa-magnifying-glass-chart mr-2"></i> Risk Analizi Yap
        </button>

        <div id="transportResult" class="flex-1">
          <div class="text-center py-12 text-gray-500">
            <i class="fa-solid fa-route text-6xl mb-4 block opacity-30"></i>
            <p class="text-lg font-bold">Rota seç ve analiz et</p>
            <p class="text-sm">Ganker riski, hayatta kalma şansı ve beklenen kayıp hesaplansın</p>
          </div>
        </div>
      </div>
    `;

    const analyzeBtn = container.querySelector('#transportAnalyzeBtn');
    const resultDiv = container.querySelector('#transportResult');

    analyzeBtn.addEventListener('click', () => {
      const from = container.querySelector('#transportFrom').value;
      const to = container.querySelector('#transportTo').value;
      const mount = container.querySelector('#transportMount').value;
      const timeSlot = container.querySelector('#transportTime').value;
      const cargoValue = parseInt(container.querySelector('#transportCargo').value) || 0;

      if (from === to) {
        resultDiv.innerHTML = '<div class="text-center py-8 text-red-400">Başlangıç ve hedef aynı olamaz!</div>';
        return;
      }

      const result = analyzeTransport(from, to, mount, timeSlot, cargoValue);
      if (!result) {
        resultDiv.innerHTML = '<div class="text-center py-8 text-red-400">Bu rota için veri bulunamadı!</div>';
        return;
      }

      const riskColor = getRiskColor(result.riskLevel);
      const survivalColor = result.survivalChance >= 75 ? '#22c55e' : result.survivalChance >= 50 ? '#f59e0b' : '#ef4444';

      resultDiv.innerHTML = `
        <div class="space-y-4">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-5">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-white">${result.route}</h3>
              <span class="px-3 py-1 rounded-lg text-sm font-bold" style="background:${riskColor}20;color:${riskColor};border:1px solid ${riskColor}40">${getRiskLabel(result.riskLevel)}</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div class="bg-albion-900 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400 mb-1">Bölge Sayısı</div>
                <div class="text-xl font-black text-white">${result.zones}</div>
                <div class="text-[10px] text-gray-500">${result.redZones} kırmızı, ${result.blackZones} siyah</div>
              </div>
              <div class="bg-albion-900 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400 mb-1">Hayatta Kalma</div>
                <div class="text-xl font-black" style="color:${survivalColor}">%${result.survivalChance}</div>
              </div>
              <div class="bg-albion-900 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400 mb-1">Tahmini Süre</div>
                <div class="text-xl font-black text-white">${result.transportTimeMin} dk</div>
              </div>
              <div class="bg-albion-900 rounded-lg p-3 text-center">
                <div class="text-xs text-gray-400 mb-1">Beklenen Kayıp</div>
                <div class="text-xl font-black text-red-400">${formatSilver(result.expectedLoss)}</div>
              </div>
            </div>

            <div class="bg-albion-900 rounded-lg p-4 mb-3">
              <h4 class="text-sm font-bold text-gray-300 mb-2">🎯 Risk Detayları</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-gray-400">Risk Skoru</span><span class="text-white font-bold">${result.effectiveRisk}/100</span></div>
                <div class="flex justify-between"><span class="text-gray-400">Beklenen Ganker</span><span class="text-red-400 font-bold">${result.expectedGankers} kişi</span></div>
                <div class="flex justify-between"><span class="text-gray-400">Taşıyıcı</span><span class="text-white">${result.transportName} (${result.cargoCapacity}kg)</span></div>
                <div class="flex justify-between"><span class="text-gray-400">Mount Maliyeti</span><span class="text-white">${formatSilver(result.transportCost)}</span></div>
                <div class="flex justify-between"><span class="text-gray-400">Yük Değeri</span><span class="text-albion-accent font-bold">${formatSilver(result.cargoValue)}</span></div>
              </div>
            </div>

            <div class="p-3 rounded-lg" style="background:${riskColor}10;border:1px solid ${riskColor}30">
              <p class="text-xs" style="color:${riskColor}">
                <i class="fa-solid fa-shield-halved mr-1"></i>
                <strong>Öneri:</strong> 
                ${result.riskLevel === 'critical' ? 'Bu rotayı off-peak saatte veya daha hızlı bir mount ile dene! Ganker aktivitesi çok yüksek.' :
                  result.riskLevel === 'high' ? 'Yüksek riskli rota. Hızlı bir mount (T8 At/Spectral Boar) ve off-peak saat önerilir.' :
                  result.riskLevel === 'medium' ? 'Orta risk. Normal saatlerde güvenli, ama dikkatli ol.' :
                  'Düşük riskli rota. Rahatça taşıma yapabilirsin.'}
              </p>
            </div>
          </div>
        </div>
      `;
    });
  }

  window.TransportRisk = { render, analyzeTransport, CITIES, ROUTES, TRANSPORT_TYPES, TIME_SLOTS };
})();
