/* Decision dashboard: turns the Home tab into an actionable daily market overview. */
(function () {
  const t = (key, fallback) => {
    const value = window.t?.(key, fallback);
    return value && value !== key && !String(value).startsWith('[') ? value : fallback;
  };
  const esc = (value) => window.ItemCard?.escape?.(value) || String(value ?? '');
  let section;

  function mount() {
    const home = document.getElementById('tab-home');
    const anchor = home?.firstElementChild;
    if (!anchor || document.getElementById('homeDecisionDashboard')) return Boolean(anchor);
    section = document.createElement('section');
    section.id = 'homeDecisionDashboard';
    section.className = 'home-dashboard';
    section.innerHTML = `<div class="home-dashboard-head"><div><span class="eyebrow"><i class="fa-solid fa-compass"></i> ${t('home-dashboardEyebrow', 'GÜNLÜK KARAR PANELİ')}</span><h2>${t('home-dashboardTitle', 'Bugün ne yapmak daha mantıklı?')}</h2><p>${t('home-dashboardDesc', 'Sermayen, seçili sunucu ve taze pazar verisine göre kısa bir özet.')}</p></div><button type="button" class="market-action" id="homeDashboardRefresh"><i class="fa-solid fa-rotate"></i> ${t('home-dashboardRefresh', 'Yenile')}</button></div><div class="home-kpi-grid" id="homeKpis"></div><div id="homeProfileSummary" class="home-profile-summary"></div><div class="home-opportunity-wrap"><div class="home-section-heading"><span><i class="fa-solid fa-bolt"></i> ${t('home-dashboardOppTitle', 'Bugünün öne çıkan fırsatları')}</span><span id="homeOpportunityStatus" class="data-age">${t('market-autoLoading', 'Eşyalar otomatik analiz ediliyor…')}</span></div><div id="homeDashboardOpportunities" class="home-opportunity-grid"></div></div><div class="home-quick-actions"><button type="button" data-home-action="market"><i class="fa-solid fa-layer-group"></i><span>${t('home-quickMarket', 'Pazar Kokpiti')}</span><small>${t('home-quickMarketDesc', 'Fırsatları ve takip listesini aç')}</small></button><button type="button" data-home-action="crafting"><i class="fa-solid fa-hammer"></i><span>${t('home-quickCrafting', 'Üretim Planlayıcı')}</span><small>${t('home-quickCraftingDesc', 'Şehir bonuslarını ve üretimi incele')}</small></button><button type="button" data-home-action="events"><i class="fa-solid fa-clock"></i><span>${t('home-quickEvents', 'Etkinlikler')}</span><small>${t('home-quickEventsDesc', 'Yaklaşan prime saatlerini gör')}</small></button></div>`;
    anchor.insertAdjacentElement('afterend', section);
    section.querySelector('#homeDashboardRefresh')?.addEventListener('click', refresh);
    section.addEventListener('click', (event) => {
      const opportunity = event.target.closest('[data-dashboard-item]');
      if (opportunity) {
        window.dispatchEvent(new CustomEvent('market_select_item', { detail: { id: opportunity.dataset.dashboardItem } }));
        document.querySelector('[data-tab="tab-market"]')?.click();
      }
      const action = event.target.closest('[data-home-action]')?.dataset.homeAction;
      if (action === 'market') { document.querySelector('[data-tab="tab-market"]')?.click(); return; }
      if (action) document.querySelector(`[data-tab="tab-${action}"]`)?.click();
    });
    renderKpis();
    renderProfile();
    refresh();
    return true;
  }

  function renderKpis() {
    const target = section?.querySelector('#homeKpis');
    if (!target) return;
    const favorites = window.MarketFavorites?.favorites?.length || 0;
    const capital = Number(window.EconomyProfile?.get?.().capital ?? window.MarketProfile?.capital ?? 0);
    const stats = window.MarketRuntime?.stats?.() || { active: 0, queued: 0 };
    const cards = [
      ['fa-server', t('home-kpiServer', 'Sunucu'), ({ europe: 'EUROPE', americas: 'AMERICAS', asia: 'ASIA' }[window.AppConfig?.server] || 'EUROPE'), 'accent'],
      ['fa-coins', t('home-kpiCapital', 'Sermaye'), capital ? `${capital.toLocaleString('tr-TR')} 🥈` : '—', 'gold'],
      ['fa-star', t('home-kpiWatch', 'Takip listesi'), `${favorites}/25`, 'purple'],
      ['fa-database', t('home-kpiQueue', 'Veri kuyruğu'), stats.queued ? `${stats.queued} ${t('home-kpiWaiting', 'bekliyor')}` : t('home-kpiReady', 'Hazır'), 'green']
    ];
    target.innerHTML = cards.map(([icon, label, value, tone]) => `<div class="home-kpi home-kpi-${tone}"><i class="fa-solid ${icon}"></i><div><span>${esc(label)}</span><strong>${esc(value)}</strong></div></div>`).join('');
  }

  function renderProfile() {
    const target = section?.querySelector('#homeProfileSummary');
    if (!target) return;
    const profile = window.EconomyProfile?.summary?.() || window.MarketProfile;
    if (!profile) return;
    const capital = Number(profile.capital) || 0;
    const inventory = Number(profile.inventoryValue) || 0;
    const goal = Number(profile.goal) || 0;
    const hours = Number(profile.playtime) || 0;
    const progress = goal ? Math.min(100, Math.round((capital / goal) * 100)) : 0;
    target.innerHTML = `<div><span class="eyebrow"><i class="fa-solid fa-wallet"></i> ${t('home-profileEyebrow', 'EKONOMİ PROFİLİ')}</span><h3>${esc(t('home-profileTitle', 'Planın sana göre hazırlanıyor'))}</h3><p>${esc(t('home-profileDesc', 'Sermaye, envanter ve oyun sürene göre öneriler kişiselleştirilir.'))}</p></div><div class="home-profile-stats"><span><small>${esc(t('home-profileCity', 'Şehir'))}</small><b>${esc(profile.city || '—')}</b></span><span><small>${esc(t('home-profileInventory', 'Envanter'))}</small><b>${inventory.toLocaleString('tr-TR')} 🥈</b></span><span><small>${esc(t('home-profileTime', 'Günlük süre'))}</small><b>${hours || '—'} ${esc(t('profile-hours', 'saat'))}</b></span><span><small>${esc(t('home-profileRisk', 'Risk'))}</small><b>${esc(profile.riskLabel || profile.risk || '—')}</b></span></div><div class="home-profile-goal"><div><span>${esc(t('home-profileGoal', 'Sermaye hedefi'))}</span><strong>${capital.toLocaleString('tr-TR')} / ${goal.toLocaleString('tr-TR')} 🥈</strong></div><div class="home-profile-progress"><i style="width:${progress}%"></i></div><small>${progress}% · ${esc(t('home-profileGoalHint', 'Kişisel ekonomi hedefin'))}</small></div><button type="button" class="market-action" id="homeProfileEdit"><i class="fa-solid fa-pen"></i> ${esc(t('profile-edit', 'Profili düzenle'))}</button>`;
    target.querySelector('#homeProfileEdit')?.addEventListener('click', () => window.EconomyProfile?.open?.());
  }

  async function refresh() {
    renderKpis();
    renderProfile();
    const target = section?.querySelector('#homeDashboardOpportunities');
    const status = section?.querySelector('#homeOpportunityStatus');
    if (!target || !window.MarketLive?.findOpportunities) return;
    target.innerHTML = `<div class="home-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('market-autoLoading', 'Eşyalar otomatik analiz ediliyor…')}</div>`;
    try {
      const rows = await window.MarketLive.findOpportunities(undefined, 4);
      if (status) status.textContent = rows.length ? `${rows.length} ${t('home-dashboardFresh', 'fırsat bulundu')}` : t('market-autoNone', 'Şu anda sermayenize uygun taze fırsat bulunamadı.');
      target.innerHTML = rows.length ? rows.map((row) => `<button type="button" class="home-opportunity" data-dashboard-item="${esc(row.item)}"><img src="${esc(window.ItemCard?.image?.(row.item, 1, 64) || '')}" alt="${esc(window.ItemCard?.name?.(row.item) || row.item)}" loading="lazy" data-image-fallback="item"><span><strong>${esc(window.ItemCard?.name?.(row.item) || row.item)}</strong><small>${esc(row.from)} → ${esc(row.to)} · ${esc(row.age)}</small></span><b>+${Number(row.profit).toLocaleString('tr-TR')} 🥈</b></button>`).join('') : `<div class="home-empty">${t('market-autoNone', 'Şu anda sermayenize uygun taze fırsat bulunamadı.')}</div>`;
    } catch (error) {
      if (status) status.textContent = t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.');
      target.innerHTML = `<div class="home-empty is-error">${t('market-liveError', 'Canlı fırsatlar şu anda alınamıyor.')}</div>`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const tryMount = () => mount() || setTimeout(tryMount, 120);
    tryMount();
    window.addEventListener('market_favorites_ready', renderKpis);
    window.addEventListener('market_request_end', renderKpis);
    window.addEventListener('economy_profile_ready', () => { renderKpis(); renderProfile(); refresh(); });
    window.addEventListener('economy_profile_updated', () => { renderKpis(); renderProfile(); refresh(); });
    window.addEventListener('app_settings_updated', refresh);
  });
})();
