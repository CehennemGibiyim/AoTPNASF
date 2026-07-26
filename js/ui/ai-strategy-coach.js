/* AI Strateji Koçu: Günlük görev planı, "bugün ne yapmalıyım?", risk profili, otomatik öneri */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const AI_MODEL = 'dc2db118-7888-466a-a8d1-bf9d96bab4b6';
  const STORAGE_KEY = 'aot_strategy_profile';

  const RISK_PROFILES = {
    safe: { name: 'Güvenli', icon: 'fa-shield-halved', color: '#10b981', desc: 'Düşük risk, sabit gelir', activities: ['crafting', 'gathering_t4_t5', 'market_flipping', 'faction_transport'] },
    moderate: { name: 'Dengeli', icon: 'fa-scale-balanced', color: '#f59e0b', desc: 'Orta risk, iyi gelir', activities: ['gathering_t6_t7', 'group_dungeon', 'avalonian_roads_solo', 'hellgate_2v2'] },
    aggressive: { name: 'Agresif', icon: 'fa-skull', color: '#ef4444', desc: 'Yüksek risk, yüksek ödül', activities: ['gathering_t8', 'ganking', 'zvz', 'world_boss', 'hellgate_5v5'] }
  };

  const ACTIVITIES = {
    crafting: { name: 'Crafting', icon: 'fa-hammer', baseProfit: '500K-2M', time: '1-2 saat', risk: 'safe' },
    gathering_t4_t5: { name: 'T4-T5 Toplayıcılık', icon: 'fa-leaf', baseProfit: '300K-800K', time: '1 saat', risk: 'safe' },
    gathering_t6_t7: { name: 'T6-T7 Toplayıcılık', icon: 'fa-tree', baseProfit: '800K-2M', time: '1-2 saat', risk: 'moderate' },
    gathering_t8: { name: 'T8 Toplayıcılık', icon: 'fa-gem', baseProfit: '2M-5M', time: '1-2 saat', risk: 'aggressive' },
    market_flipping: { name: 'Pazar Flipping', icon: 'fa-arrows-rotate', baseProfit: '1M-10M', time: '30dk-2saat', risk: 'safe' },
    faction_transport: { name: 'Faction Transport', icon: 'fa-truck', baseProfit: '500K-1.5M', time: '30dk', risk: 'safe' },
    group_dungeon: { name: 'Grup Zindanı', icon: 'fa-dungeon', baseProfit: '1M-3M', time: '1-2 saat', risk: 'moderate' },
    avalonian_roads_solo: { name: 'Avalon Solo', icon: 'fa-route', baseProfit: '600K-1.2M', time: '1 saat', risk: 'moderate' },
    hellgate_2v2: { name: 'Hellgate 2v2', icon: 'fa-fire', baseProfit: '500K-2M', time: '30dk-1saat', risk: 'moderate' },
    hellgate_5v5: { name: 'Hellgate 5v5', icon: 'fa-fire-flame-curved', baseProfit: '2M-5M', time: '30dk-1saat', risk: 'aggressive' },
    ganking: { name: 'Ganking', icon: 'fa-mask', baseProfit: '0-5M', time: '1-2 saat', risk: 'aggressive' },
    zvz: { name: 'ZvZ', icon: 'fa-people-group', baseProfit: '0-10M', time: '1-3 saat', risk: 'aggressive' },
    world_boss: { name: 'Dünya Bossu', icon: 'fa-dragon', baseProfit: '3M-10M', time: '30dk-1saat', risk: 'aggressive' },
    arena: { name: 'Arena', icon: 'fa-trophy', baseProfit: '100K-300K', time: '15dk', risk: 'safe' },
    corrupted_dungeon: { name: 'Corrupted Dungeon', icon: 'fa-skull-crossbones', baseProfit: '500K-3M', time: '15-30dk', risk: 'moderate' },
  };

  async function loadProfile() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY, { area: 'persistent' });
      return raw ? JSON.parse(raw) : {
        riskProfile: 'moderate',
        playTime: '2hours',
        focusArea: 'profit',
        favoriteActivities: [],
        dailyPlan: null,
        lastGenerated: null
      };
    } catch (e) {
      return { riskProfile: 'moderate', playTime: '2hours', focusArea: 'profit', favoriteActivities: [], dailyPlan: null, lastGenerated: null };
    }
  }

  async function saveProfile(profile) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY, JSON.stringify(profile), { area: 'persistent' });
    } catch (e) {}
  }

  function generateLocalPlan(profile) {
    const risk = RISK_PROFILES[profile.riskProfile];
    const availableActivities = Object.entries(ACTIVITIES)
      .filter(([, act]) => risk.activities.includes(act.risk) || act.risk === 'safe')
      .sort(() => Math.random() - 0.5);

    const plan = [];
    const timeBudget = { '30min': 30, '1hour': 60, '2hours': 120, '4hours': 240 }[profile.playTime] || 120;
    let remaining = timeBudget;

    for (const [id, act] of availableActivities) {
      const actTime = parseInt(act.time.match(/\d+/)?.[0] || '30');
      if (actTime <= remaining && plan.length < 5) {
        plan.push({ id, ...act, suggested: true });
        remaining -= actTime;
      }
    }

    return {
      plan,
      totalTime: timeBudget - remaining,
      riskLevel: risk.name,
      focusArea: profile.focusArea,
      generatedAt: new Date().toISOString()
    };
  }

  async function generateAIPlan(profile, container) {
    const statusEl = container?.querySelector('#aiPlanStatus');
    if (statusEl) {
      statusEl.classList.remove('hidden');
      statusEl.textContent = '🤖 AI günlük planını hazırlıyor...';
    }

    try {
      const risk = RISK_PROFILES[profile.riskProfile];
      const prompt = `Albion Online için bir ${risk.name} risk seviyesinde, ${profile.playTime} oyun süresi olan, ${profile.focusArea} odaklı bir oyuncu için günlük aktivite planı oluştur.

Şu formatta 3-5 aktivite öner:
- Aktivite adı (Türkçe)
- Tahmini süre
- Tahmini gelir aralığı
- Risk seviyesi
- Kısa taktik ipucu

JSON formatında döndür: {"plan":[{"name":"...","duration":"...","profit":"...","risk":"...","tip":"..."}]}`;

      const result = await window.miniappsAI.callModel({
        modelId: AI_MODEL,
        messages: [
          { role: 'system', content: 'Sen Albion Online uzmanı bir strateji koçusun. Türkçe yanıt ver.' },
          { role: 'user', content: prompt }
        ],
        timeoutMs: 30000
      });

      const text = window.miniappsAI.extractText(result);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiPlan = JSON.parse(jsonMatch[0]);
        profile.dailyPlan = aiPlan;
        profile.lastGenerated = new Date().toISOString();
        await saveProfile(profile);
        return aiPlan;
      }
    } catch (e) {
      console.warn('AI plan generation failed, using local fallback', e);
    } finally {
      if (statusEl) statusEl.classList.add('hidden');
    }

    return generateLocalPlan(profile);
  }

  async function render(container) {
    if (!container) return;
    const profile = await loadProfile();
    const risk = RISK_PROFILES[profile.riskProfile];

    container.innerHTML = `
      <div class="strategy-coach max-w-4xl mx-auto p-4 space-y-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fa-solid fa-chess-queen text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-white">${t('strat-title', 'AI Strateji Koçu')}</h2>
            <p class="text-xs text-gray-400">${t('strat-desc', 'Kişisel oyun tarzına göre günlük aktivite planı ve öneriler')}</p>
          </div>
        </div>

        <!-- Profil Ayarları -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4 space-y-3">
            <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2">
              <i class="fa-solid fa-sliders"></i> ${t('strat-profile', 'Strateji Profili')}
            </h3>
            
            <label class="block">
              <span class="text-xs text-gray-400">${t('strat-risk', 'Risk Seviyesi')}</span>
              <select id="stratRisk" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
                ${Object.entries(RISK_PROFILES).map(([k, v]) => 
                  `<option value="${k}" ${profile.riskProfile===k?'selected':''}><i class="fa-solid ${v.icon}"></i> ${v.name} - ${v.desc}</option>`
                ).join('')}
              </select>
            </label>

            <label class="block">
              <span class="text-xs text-gray-400">${t('strat-time', 'Günlük Oyun Süresi')}</span>
              <select id="stratTime" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
                <option value="30min" ${profile.playTime==='30min'?'selected':''}>30 Dakika</option>
                <option value="1hour" ${profile.playTime==='1hour'?'selected':''}>1 Saat</option>
                <option value="2hours" ${profile.playTime==='2hours'?'selected':''}>2 Saat</option>
                <option value="4hours" ${profile.playTime==='4hours'?'selected':''}>4 Saat</option>
              </select>
            </label>

            <label class="block">
              <span class="text-xs text-gray-400">${t('strat-focus', 'Odak Alanı')}</span>
              <select id="stratFocus" class="w-full bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
                <option value="profit" ${profile.focusArea==='profit'?'selected':''}>💰 Maksimum Kar</option>
                <option value="fame" ${profile.focusArea==='fame'?'selected':''}>⭐ Fame Kazanma</option>
                <option value="pvp" ${profile.focusArea==='pvp'?'selected':''}>⚔️ PvP Deneyimi</option>
                <option value="gathering" ${profile.focusArea==='gathering'?'selected':''}>🌿 Toplayıcılık</option>
                <option value="balanced" ${profile.focusArea==='balanced'?'selected':''}>⚖️ Dengeli</option>
              </select>
            </label>

            <button id="stratGenerate" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors">
              <i class="fa-solid fa-robot mr-2"></i> ${t('strat-generate', 'AI Günlük Plan Oluştur')}
            </button>
            <div id="aiPlanStatus" class="hidden text-xs text-blue-400 font-bold text-center"></div>
          </div>

          <!-- Risk Profili Kartı -->
          <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
            <h3 class="text-sm font-bold flex items-center gap-2 mb-3" style="color:${risk.color}">
              <i class="fa-solid ${risk.icon}"></i> ${risk.name} Profil
            </h3>
            <p class="text-xs text-gray-400 mb-4">${risk.desc}</p>
            <div class="space-y-2">
              <div class="text-xs text-gray-500 uppercase mb-1">Önerilen Aktiviteler:</div>
              ${risk.activities.map(a => {
                const act = ACTIVITIES[a];
                return act ? `
                  <div class="flex items-center gap-2 bg-albion-900 rounded-lg p-2 border border-gray-700">
                    <i class="fa-solid ${act.icon} text-sm" style="color:${risk.color}"></i>
                    <span class="text-xs text-white">${act.name}</span>
                    <span class="text-[10px] text-gray-500 ml-auto">${act.baseProfit}</span>
                  </div>` : '';
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Günlük Plan -->
        <div id="dailyPlanContainer" class="bg-albion-800 border border-gray-700 rounded-xl p-4 ${profile.dailyPlan ? '' : 'hidden'}">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-list-check"></i> ${t('strat-dailyPlan', 'Günlük Aktivite Planı')}
          </h3>
          <div id="dailyPlanContent">
            ${profile.dailyPlan ? renderPlanHTML(profile.dailyPlan, risk) : ''}
          </div>
          ${profile.lastGenerated ? `<div class="text-[10px] text-gray-600 mt-3">🕐 ${new Date(profile.lastGenerated).toLocaleString('tr-TR')} tarihinde oluşturuldu</div>` : ''}
        </div>

        <!-- Aktivite Kütüphanesi -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-book-open"></i> ${t('strat-activities', 'Aktivite Kütüphanesi')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            ${Object.entries(ACTIVITIES).map(([id, act]) => {
              const actRisk = RISK_PROFILES[act.risk];
              return `
                <div class="bg-albion-900 rounded-lg p-3 border border-gray-700 hover:border-gray-500 transition-colors">
                  <div class="flex items-center gap-1.5 mb-1">
                    <i class="fa-solid ${act.icon} text-xs" style="color:${actRisk?.color || '#888'}"></i>
                    <span class="text-xs font-bold text-white">${act.name}</span>
                  </div>
                  <div class="text-[10px] text-gray-500 space-y-0.5">
                    <div>💰 ${act.baseProfit}</div>
                    <div>⏱️ ${act.time}</div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    function renderPlanHTML(plan, risk) {
      const items = plan.plan || [];
      return items.map((item, i) => `
        <div class="flex items-start gap-3 bg-albion-900 rounded-lg p-3 border border-gray-700 mb-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style="background:${risk.color}">${i+1}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-white">${item.name || item.id}</div>
            <div class="flex gap-3 mt-1 flex-wrap">
              <span class="text-[10px] text-gray-400">⏱️ ${item.duration || item.time || '?'}</span>
              <span class="text-[10px] text-emerald-400">💰 ${item.profit || item.baseProfit || '?'}</span>
              <span class="text-[10px] text-amber-400">⚠️ ${item.risk || RISK_PROFILES[item.risk]?.name || '?'}</span>
            </div>
            ${item.tip ? `<div class="text-[10px] text-blue-400 mt-1 italic">💡 ${item.tip}</div>` : ''}
          </div>
        </div>
      `).join('');
    }

    // Event: Generate Plan
    container.querySelector('#stratGenerate')?.addEventListener('click', async () => {
      profile.riskProfile = container.querySelector('#stratRisk')?.value || 'moderate';
      profile.playTime = container.querySelector('#stratTime')?.value || '2hours';
      profile.focusArea = container.querySelector('#stratFocus')?.value || 'profit';
      await saveProfile(profile);

      const planContainer = container.querySelector('#dailyPlanContainer');
      const planContent = container.querySelector('#dailyPlanContent');
      if (planContainer) planContainer.classList.remove('hidden');

      const plan = await generateAIPlan(profile, container);
      const risk = RISK_PROFILES[profile.riskProfile];
      if (planContent) planContent.innerHTML = renderPlanHTML(plan, risk);

      window.Achievements?.trackDailyQuest?.('dq_use_ai');
    });
  }

  window.AIStrategyCoach = { render, loadProfile, generateAIPlan, RISK_PROFILES, ACTIVITIES };
  console.log('AIStrategyCoach loaded');
})();
