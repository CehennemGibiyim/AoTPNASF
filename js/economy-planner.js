/* Capital simulator: turns the saved profile into three practical play plans. */
(function () {
  let section;
  const t = (key, fallback) => {
    try {
      const value = window.miniappI18n?.t?.(key) || window.t?.(key, fallback);
      return value && value !== key ? value : fallback;
    } catch (error) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const money = (value) => `${Math.round(Math.max(0, value)).toLocaleString('tr-TR')} 🥈`;

  function getProfile() {
    return window.EconomyProfile?.summary?.() || window.MarketProfile || { capital: 0, playtime: 2, risk: 'balanced', focusAmount: 0, city: '—' };
  }
  function planData(profile) {
    const capital = Math.max(0, Number(profile.capital) || 0);
    const hours = Math.max(.5, Number(profile.playtime) || 2);
    const focusBoost = Number(profile.focusAmount) > 0 ? 1.12 : 1;
    const plans = [
      { key: 'safe', icon: 'fa-shield-halved', allocation: .35, low: .018, high: .04, liquidity: 'profile-plan-fast', fallback: 'Hızlı', note: 'profile-plan-safeNote', noteFallback: 'Likiditesi yüksek ürünler, küçük marjlar ve düşük taşıma riski.' },
      { key: 'balanced', icon: 'fa-scale-balanced', allocation: .65, low: .035, high: .075, liquidity: 'profile-plan-medium', fallback: 'Orta', note: 'profile-plan-balancedNote', noteFallback: 'Craft + şehirler arası satış ile dengeli büyüme.' },
      { key: 'black', icon: 'fa-fire', allocation: .9, low: .06, high: .14, liquidity: 'profile-plan-slow', fallback: 'Değişken', note: 'profile-plan-blackNote', noteFallback: 'Yüksek marjlı fırsatlar; sermayenin bir kısmı daha uzun kilitlenebilir.' }
    ];
    return plans.map((plan) => {
      const invested = capital * plan.allocation;
      const low = invested * plan.low * hours * focusBoost;
      const high = invested * plan.high * hours * focusBoost;
      return { ...plan, invested, low, high, selected: plan.key === profile.risk };
    });
  }

  function mount() {
    const home = document.getElementById('homeDecisionDashboard');
    if (!home || document.getElementById('homeCapitalPlanner')) return Boolean(home);
    section = document.createElement('section');
    section.id = 'homeCapitalPlanner';
    section.className = 'economy-plan-panel';
    home.appendChild(section);
    render();
    return true;
  }

  function render() {
    if (!section) return;
    const profile = getProfile();
    const plans = planData(profile);
    const active = plans.find((plan) => plan.selected) || plans[1];
    section.innerHTML = `<div class="economy-plan-head"><div><span class="eyebrow"><i class="fa-solid fa-chart-pie"></i> ${esc(t('economy-planEyebrow', 'SERMAYE SİMÜLATÖRÜ'))}</span><h3>${esc(t('economy-planTitle', 'Sermayeni nasıl kullanmalısın?'))}</h3><p>${esc(t('economy-planDesc', 'Bu aralıklar profilindeki sermaye, süre ve risk tercihine göre hesaplanır; garanti değildir.'))}</p></div><button type="button" class="market-action" id="economyPlanEdit"><i class="fa-solid fa-sliders"></i> ${esc(t('profile-edit', 'Profili düzenle'))}</button></div><div class="economy-plan-highlight"><i class="fa-solid ${active.icon}"></i><div><span>${esc(t('economy-planRecommended', 'Önerilen başlangıç planı'))}</span><strong>${esc(t(`economy-plan-${active.key}`, active.key))}</strong><small>${esc(t(active.note, active.noteFallback))}</small></div><b>${money(active.low)} – ${money(active.high)} / ${esc(t('economy-planDay', 'gün'))}</b></div><div class="economy-plan-grid">${plans.map((plan) => `<article class="economy-plan-card ${plan.selected ? 'is-selected' : ''}"><div class="economy-plan-card-head"><i class="fa-solid ${plan.icon}"></i><strong>${esc(t(`economy-plan-${plan.key}`, plan.key))}</strong>${plan.selected ? `<span>${esc(t('economy-planSelected', 'Seçili'))}</span>` : ''}</div><small>${esc(t('economy-planAllocation', 'Ayrılacak sermaye'))}: ${money(plan.invested)}</small><b>${money(plan.low)} – ${money(plan.high)}</b><small>${esc(t(plan.liquidity, plan.fallback))} · ${esc(t('economy-planEstimated', 'tahmini'))}</small></article>`).join('')}</div>`;
    section.querySelector('#economyPlanEdit')?.addEventListener('click', () => window.EconomyProfile?.open?.());
  }

  document.addEventListener('DOMContentLoaded', () => {
    const retry = () => mount() || setTimeout(retry, 120);
    retry();
    window.addEventListener('economy_profile_ready', render);
    window.addEventListener('economy_profile_updated', render);
  });
})();
