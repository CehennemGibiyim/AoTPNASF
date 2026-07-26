/* Killboard - PvP öldürme/ölüm istatistikleri, haftalık rapor ve meta analizi */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const WEAPONS = [
    'Battleaxe', 'Great Axe', 'Bear Paws', 'Dagger', 'Deathgivers', 'Bloodletter',
    'Claymore', 'Carving Sword', 'Dual Swords', 'Light Crossbow', 'Weeping Repeater',
    'Warbow', 'Badon', 'Mistpiercer', 'Fire Staff', 'Wildfire Staff', 'Permafrost Prism',
    'Great Frost Staff', 'Cursed Staff', 'Demonic Staff', 'Great Holy Staff', 'Fallen Staff',
    'Nature Staff', 'Wild Staff', 'Quarterstaff', 'Black Monk Staff', 'Double Bladed Staff',
    'Spear', 'Heron Spear', 'Spirithunter', 'Mace', 'Heavy Mace', 'Oathkeepers',
    'Hammer', 'Tombhammer', 'Forge Hammers', 'Arcane Staff', 'Witchwork Staff', 'Enigmatic Staff'
  ];

  function generateMockKills(count = 50) {
    const kills = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const weapon = WEAPONS[Math.floor(Math.random() * WEAPONS.length)];
      const ip = 1000 + Math.floor(Math.random() * 800);
      const enemyIp = 900 + Math.floor(Math.random() * 900);
      const fame = 5000 + Math.floor(Math.random() * 50000);
      const timestamp = now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // son 7 gün
      
      kills.push({
        id: `kill_${i}`,
        weapon,
        ip,
        enemyIp,
        enemyWeapon: WEAPONS[Math.floor(Math.random() * WEAPONS.length)],
        fame,
        timestamp,
        zone: ['Black Zone', 'Red Zone', 'Avalon', 'Mists', 'Corrupted'][Math.floor(Math.random() * 5)],
        result: Math.random() > 0.35 ? 'kill' : 'death',
        enemyName: ['ShadowKnight', 'DarkMage', 'BloodHunter', 'SoulReaper', 'IronFist'][Math.floor(Math.random() * 5)] + Math.floor(Math.random() * 100)
      });
    }
    
    return kills.sort((a, b) => b.timestamp - a.timestamp);
  }

  function analyzeKillboard(kills) {
    const totalKills = kills.filter(k => k.result === 'kill').length;
    const totalDeaths = kills.filter(k => k.result === 'death').length;
    const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills;
    const totalFame = kills.filter(k => k.result === 'kill').reduce((sum, k) => sum + k.fame, 0);

    // Weapon stats
    const weaponStats = {};
    kills.forEach(k => {
      if (!weaponStats[k.weapon]) weaponStats[k.weapon] = { kills: 0, deaths: 0, fame: 0 };
      if (k.result === 'kill') { weaponStats[k.weapon].kills++; weaponStats[k.weapon].fame += k.fame; }
      else weaponStats[k.weapon].deaths++;
    });

    const topWeapons = Object.entries(weaponStats)
      .map(([name, stats]) => ({ name, ...stats, kd: stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills }))
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 8);

    // Zone distribution
    const zoneStats = {};
    kills.forEach(k => {
      if (!zoneStats[k.zone]) zoneStats[k.zone] = { kills: 0, deaths: 0 };
      if (k.result === 'kill') zoneStats[k.zone].kills++;
      else zoneStats[k.zone].deaths++;
    });

    // IP analysis
    const killIps = kills.filter(k => k.result === 'kill').map(k => k.ip);
    const deathIps = kills.filter(k => k.result === 'death').map(k => k.ip);
    const avgKillIp = killIps.length > 0 ? Math.round(killIps.reduce((s, v) => s + v, 0) / killIps.length) : 0;
    const avgDeathIp = deathIps.length > 0 ? Math.round(deathIps.reduce((s, v) => s + v, 0) / deathIps.length) : 0;

    // Last 7 days timeline
    const dailyStats = {};
    for (let i = 6; i >= 0; i--) {
      const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      dailyStats[day] = { kills: 0, deaths: 0 };
    }
    kills.forEach(k => {
      const day = new Date(k.timestamp).toISOString().slice(0, 10);
      if (dailyStats[day]) {
        if (k.result === 'kill') dailyStats[day].kills++;
        else dailyStats[day].deaths++;
      }
    });

    return {
      totalKills, totalDeaths, kdRatio, totalFame,
      topWeapons, zoneStats,
      avgKillIp, avgDeathIp,
      dailyStats,
      recentKills: kills.slice(0, 15)
    };
  }

  function formatNumber(value) {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return Math.round(value).toString();
  }

  function render(container) {
    if (!container) return;

    const kills = generateMockKills(60);
    const analysis = analyzeKillboard(kills);

    container.innerHTML = `
      <div class="killboard max-w-6xl mx-auto w-full h-full flex flex-col">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-1"><i class="fa-solid fa-skull mr-2 text-albion-accent"></i>Killboard</h2>
          <p class="text-gray-400">Son 7 günlük PvP performansın, en iyi silahların ve detaylı istatistikler.</p>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 text-center">
            <div class="text-xs text-gray-400 mb-1">Toplam Kill</div>
            <div class="text-2xl font-black text-green-400">${analysis.totalKills}</div>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 text-center">
            <div class="text-xs text-gray-400 mb-1">Toplam Ölüm</div>
            <div class="text-2xl font-black text-red-400">${analysis.totalDeaths}</div>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 text-center">
            <div class="text-xs text-gray-400 mb-1">K/D Oranı</div>
            <div class="text-2xl font-black ${analysis.kdRatio >= 2 ? 'text-green-400' : analysis.kdRatio >= 1 ? 'text-yellow-400' : 'text-red-400'}">${analysis.kdRatio}</div>
          </div>
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 text-center">
            <div class="text-xs text-gray-400 mb-1">Toplam Kill Fame</div>
            <div class="text-2xl font-black text-albion-accent">${formatNumber(analysis.totalFame)}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- IP Analysis -->
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <h4 class="text-sm font-bold text-gray-300 mb-3">⚔️ IP Analizi</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Ort. Kill IP</span>
                <span class="text-green-400 font-bold">${analysis.avgKillIp}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Ort. Ölüm IP</span>
                <span class="text-red-400 font-bold">${analysis.avgDeathIp}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">IP Farkı</span>
                <span class="${analysis.avgKillIp > analysis.avgDeathIp ? 'text-green-400' : 'text-red-400'} font-bold">
                  ${analysis.avgKillIp > analysis.avgDeathIp ? '+' : ''}${analysis.avgKillIp - analysis.avgDeathIp}
                </span>
              </div>
            </div>
          </div>

          <!-- Zone Distribution -->
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <h4 class="text-sm font-bold text-gray-300 mb-3">🗺️ Bölge Dağılımı</h4>
            <div class="space-y-2">
              ${Object.entries(analysis.zoneStats).map(([zone, stats]) => `
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-gray-400 w-20">${zone}</span>
                  <div class="flex-1 flex h-4 rounded-full overflow-hidden">
                    <div class="bg-green-500/60" style="width:${(stats.kills / (stats.kills + stats.deaths) * 100) || 0}%"></div>
                    <div class="bg-red-500/60" style="width:${(stats.deaths / (stats.kills + stats.deaths) * 100) || 0}%"></div>
                  </div>
                  <span class="text-green-400 text-xs font-bold">${stats.kills}K</span>
                  <span class="text-red-400 text-xs font-bold">${stats.deaths}D</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Top Weapons -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 mb-6">
          <h4 class="text-sm font-bold text-gray-300 mb-3">🔫 En İyi Silahlar</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            ${analysis.topWeapons.map((w, i) => `
              <div class="bg-albion-900 rounded-lg p-3 ${i === 0 ? 'ring-1 ring-yellow-500/50' : ''}">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-bold text-white">${i + 1}. ${w.name}</span>
                  <span class="text-[10px] ${w.kd >= 2 ? 'text-green-400' : w.kd >= 1 ? 'text-yellow-400' : 'text-red-400'}">${w.kd} KD</span>
                </div>
                <div class="flex gap-2 text-[10px]">
                  <span class="text-green-400">${w.kills}K</span>
                  <span class="text-red-400">${w.deaths}D</span>
                  <span class="text-albion-accent ml-auto">${formatNumber(w.fame)} fame</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Kills -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h4 class="text-sm font-bold text-gray-300 mb-3">📜 Son Kayıtlar</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-gray-500 text-xs uppercase">
                  <th class="text-left p-2">Sonuç</th>
                  <th class="text-left p-2">Silah</th>
                  <th class="text-right p-2">IP</th>
                  <th class="text-left p-2">Rakip</th>
                  <th class="text-right p-2">Fame</th>
                  <th class="text-left p-2">Bölge</th>
                </tr>
              </thead>
              <tbody>
                ${analysis.recentKills.map(k => `
                  <tr class="border-t border-gray-800/50">
                    <td class="p-2">
                      ${k.result === 'kill' 
                        ? '<span class="text-green-400 font-bold">KILL</span>' 
                        : '<span class="text-red-400 font-bold">DEATH</span>'}
                    </td>
                    <td class="p-2 text-white">${k.weapon}</td>
                    <td class="p-2 text-right text-white">${k.ip}</td>
                    <td class="p-2 text-gray-400">${k.enemyName} (${k.enemyWeapon})</td>
                    <td class="p-2 text-right text-albion-accent">${formatNumber(k.fame)}</td>
                    <td class="p-2 text-gray-400">${k.zone}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  window.Killboard = { render, generateMockKills, analyzeKillboard, WEAPONS };
})();
