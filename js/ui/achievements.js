/* Başarı & Rozet Sistemi: Günlük görevler, rozetler, ilerleme takibi */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const STORAGE_KEY = 'aot_achievements';

  const ACHIEVEMENTS = [
    { id: 'first_million', icon: 'fa-coins', title: 'İlk Milyon', desc: '1M gümüş kazan', target: 1e6, category: 'wealth', color: '#d4af37' },
    { id: 'ten_million', icon: 'fa-sack-dollar', title: 'Tüccar', desc: '10M gümüş kazan', target: 1e7, category: 'wealth', color: '#d4af37' },
    { id: 'hundred_million', icon: 'fa-vault', title: 'Kral Taciri', desc: '100M gümüş kazan', target: 1e8, category: 'wealth', color: '#ff6b35' },
    { id: 'first_flip', icon: 'fa-arrows-rotate', title: 'İlk Flip', desc: 'İlk arbitraj işlemi', target: 1, category: 'trade', color: '#00d4aa' },
    { id: 'ten_flips', icon: 'fa-chart-line', title: 'Flipper', desc: '10 arbitraj işlemi', target: 10, category: 'trade', color: '#00d4aa' },
    { id: 'fifty_flips', icon: 'fa-rocket', title: 'Pazar Kurdu', desc: '50 arbitraj işlemi', target: 50, category: 'trade', color: '#e040fb' },
    { id: 'first_craft', icon: 'fa-hammer', title: 'Zanaatkar', desc: 'İlk crafting', target: 1, category: 'craft', color: '#448aff' },
    { id: 'master_crafter', icon: 'fa-gem', title: 'Usta Crafter', desc: '100 crafting', target: 100, category: 'craft', color: '#448aff' },
    { id: 'daily_streak_3', icon: 'fa-calendar-check', title: 'Azimli', desc: '3 gün üst üste giriş', target: 3, category: 'streak', color: '#ff9100' },
    { id: 'daily_streak_7', icon: 'fa-fire', title: 'Tutkulu', desc: '7 gün üst üste giriş', target: 7, category: 'streak', color: '#ff5252' },
    { id: 'daily_streak_30', icon: 'fa-dragon', title: 'Efsane', desc: '30 gün üst üste giriş', target: 30, category: 'streak', color: '#e040fb' },
    { id: 'build_shared', icon: 'fa-share-nodes', title: 'Paylaşımcı', desc: 'İlk build paylaşımı', target: 1, category: 'social', color: '#69f0ae' },
    { id: 'voice_used', icon: 'fa-microphone', title: 'Sesli Komut', desc: 'Sesli asistan kullan', target: 1, category: 'feature', color: '#ff4081' },
    { id: 'theme_changed', icon: 'fa-palette', title: 'Tema Tasarımcısı', desc: 'Tema değiştir', target: 1, category: 'feature', color: '#7c4dff' },
  ];

  const DAILY_QUESTS = [
    { id: 'dq_check_prices', icon: 'fa-magnifying-glass', title: 'Fiyat Kontrolü', desc: '3 farklı eşya fiyatı kontrol et', target: 3, reward: '🏆 50 Puan' },
    { id: 'dq_calc_profit', icon: 'fa-calculator', title: 'Kar Hesapla', desc: 'Vergi hesaplayıcıyı kullan', target: 1, reward: '🏆 30 Puan' },
    { id: 'dq_check_arbitrage', icon: 'fa-sack-dollar', title: 'Fırsat Avı', desc: 'Arbitraj fırsatlarını kontrol et', target: 1, reward: '🏆 40 Puan' },
    { id: 'dq_visit_bestiary', icon: 'fa-book-skull', title: 'Canavar Avcısı', desc: 'Bestiary sayfasını ziyaret et', target: 1, reward: '🏆 20 Puan' },
    { id: 'dq_use_ai', icon: 'fa-robot', title: 'AI Kullan', desc: 'AI asistanı kullan', target: 1, reward: '🏆 60 Puan' },
  ];

  async function loadState() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY, { area: 'persistent' });
      return raw ? JSON.parse(raw) : createDefault();
    } catch (e) { return createDefault(); }
  }

  function createDefault() {
    return {
      progress: {},
      completed: [],
      dailyQuests: {},
      dailyReset: new Date().toDateString(),
      points: 0,
      streak: 0,
      lastVisit: new Date().toDateString()
    };
  }

  async function saveState(state) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY, JSON.stringify(state), { area: 'persistent' });
    } catch (e) {}
  }

  async function checkDailyReset(state) {
    const today = new Date().toDateString();
    if (state.dailyReset !== today) {
      state.dailyQuests = {};
      state.dailyReset = today;
      
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.lastVisit === yesterday) {
        state.streak = (state.streak || 0) + 1;
      } else if (state.lastVisit !== today) {
        state.streak = 1;
      }
      state.lastVisit = today;
      await saveState(state);
    }
    return state;
  }

  async function trackProgress(achievementId, amount = 1) {
    const state = await loadState();
    await checkDailyReset(state);
    
    if (!state.progress[achievementId]) state.progress[achievementId] = 0;
    state.progress[achievementId] += amount;
    
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (ach && state.progress[achievementId] >= ach.target && !state.completed.includes(achievementId)) {
      state.completed.push(achievementId);
      state.points += 100;
      window.AlbionToast?.show?.({
        title: '🏆 Rozet Kazanıldı!',
        message: ach.title + ' - ' + ach.desc,
        type: 'success',
        duration: 5000
      });
    }

    // Streak rozetleri
    ['daily_streak_3', 'daily_streak_7', 'daily_streak_30'].forEach(sid => {
      const sAch = ACHIEVEMENTS.find(a => a.id === sid);
      if (sAch && state.streak >= sAch.target && !state.completed.includes(sid)) {
        state.completed.push(sid);
        state.points += 150;
      }
    });

    await saveState(state);
    return state;
  }

  async function trackDailyQuest(questId) {
    const state = await loadState();
    await checkDailyReset(state);
    
    if (!state.dailyQuests[questId]) state.dailyQuests[questId] = 0;
    state.dailyQuests[questId] += 1;
    
    const quest = DAILY_QUESTS.find(q => q.id === questId);
    if (quest && state.dailyQuests[questId] >= quest.target) {
      state.points += parseInt(quest.reward.match(/\d+/)?.[0] || '0');
      window.AlbionToast?.show?.({
        title: '✅ Günlük Görev Tamam!',
        message: quest.title + ' - ' + quest.reward,
        type: 'success',
        duration: 4000
      });
    }
    
    await saveState(state);
    return state;
  }

  function getAchievementProgress(state, achId) {
    const ach = ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach) return { current: 0, target: 1, pct: 0, done: false };
    const current = state.progress[achId] || 0;
    const done = state.completed.includes(achId);
    return { current, target: ach.target, pct: Math.min(100, (current / ach.target) * 100), done };
  }

  async function render(container) {
    if (!container) return;
    const state = await loadState();
    await checkDailyReset(state);

    const completedCount = state.completed.length;
    const totalCount = ACHIEVEMENTS.length;

    container.innerHTML = `
      <div class="achievements-page max-w-4xl mx-auto p-4 space-y-6">
        <!-- Başlık -->
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fa-solid fa-trophy text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-white">${t('ach-title', 'Başarı & Rozetler')}</h2>
              <p class="text-xs text-gray-400">${t('ach-subtitle', 'Görevleri tamamla, rozetleri topla!')}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 bg-albion-800 border border-gray-700 rounded-xl px-4 py-2">
            <span class="text-amber-400 font-black text-lg">⭐ ${state.points}</span>
            <span class="text-gray-500">|</span>
            <span class="text-sm text-gray-400">${completedCount}/${totalCount} Rozet</span>
            <span class="text-gray-500">|</span>
            <span class="text-sm text-orange-400">🔥 ${state.streak} Gün</span>
          </div>
        </div>

        <!-- Günlük Görevler -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-calendar-day"></i> ${t('ach-daily', 'Günlük Görevler')}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" id="dailyQuestsGrid">
            ${DAILY_QUESTS.map(q => {
              const progress = state.dailyQuests[q.id] || 0;
              const done = progress >= q.target;
              return `
                <div class="bg-albion-900 rounded-lg p-3 border ${done ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-gray-700'}">
                  <div class="flex items-center gap-2 mb-1.5">
                    <i class="fa-solid ${q.icon} ${done ? 'text-emerald-400' : 'text-gray-500'} text-sm"></i>
                    <span class="text-xs font-bold text-white">${q.title}</span>
                    ${done ? '<i class="fa-solid fa-circle-check text-emerald-400 text-xs ml-auto"></i>' : ''}
                  </div>
                  <div class="text-[10px] text-gray-500 mb-2">${q.desc}</div>
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] ${done ? 'text-emerald-400' : 'text-amber-400'} font-bold">${q.reward}</span>
                    <span class="text-[10px] text-gray-600">${progress}/${q.target}</span>
                  </div>
                  ${!done ? `<div class="mt-1.5 w-full bg-gray-700 rounded-full h-1"><div class="bg-albion-accent rounded-full h-1" style="width:${Math.min(100,(progress/q.target)*100)}%"></div></div>` : ''}
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Rozetler -->
        <div class="bg-albion-800 border border-gray-700 rounded-xl p-4">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-medal"></i> ${t('ach-badges', 'Rozet Koleksiyonu')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" id="badgesGrid">
            ${ACHIEVEMENTS.map(ach => {
              const { current, target, pct, done } = getAchievementProgress(state, ach.id);
              return `
                <div class="bg-albion-900 rounded-xl p-3 border text-center ${done ? 'border-' + ach.color.replace('#','') + '/50 bg-' + ach.color.replace('#','') + '/5' : 'border-gray-700 opacity-60'}">
                  <div class="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2" style="background:${done ? ach.color + '20' : '#1f2937'}; border:2px solid ${done ? ach.color : '#374151'}">
                    <i class="fa-solid ${ach.icon} text-lg" style="color:${done ? ach.color : '#6b7280'}"></i>
                  </div>
                  <div class="text-xs font-bold text-white mb-0.5">${ach.title}</div>
                  <div class="text-[10px] text-gray-500 mb-1.5">${ach.desc}</div>
                  ${done 
                    ? '<span class="text-[10px] text-emerald-400 font-bold">✅ Tamamlandı</span>'
                    : `<div class="mt-1 w-full bg-gray-700 rounded-full h-1"><div class="rounded-full h-1" style="width:${pct}%;background:${ach.color}"></div></div>
                       <span class="text-[9px] text-gray-600 mt-0.5 block">${current}/${target}</span>`
                  }
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  window.Achievements = { render, trackProgress, trackDailyQuest, loadState, ACHIEVEMENTS, DAILY_QUESTS };
  console.log('Achievements loaded');
})();
