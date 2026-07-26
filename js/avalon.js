/* Avalon Road planner: a useful local route brief with item-backed loadout suggestions. */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  const esc = (value) => window.ItemCard?.escape?.(value) || String(value ?? '');
  const modes = {
    solo: { label: 'avalon-modeSolo', fallback: 'Solo PvE', risk: 'avalon-riskLow', riskFallback: 'Düşük-Orta', income: '600K – 1.2M', loadout: ['T6_MAIN_SWORD', 'T6_CAPE'] },
    gather: { label: 'avalon-modeGather', fallback: 'Toplayıcılık', risk: 'avalon-riskMediumHigh', riskFallback: 'Orta-Yüksek', income: '1.2M – 2.4M', loadout: ['T6_MAIN_SPEAR', 'T6_BAG'] },
    group: { label: 'avalon-modeGroup', fallback: 'Grup PvE', risk: 'avalon-riskMedium', riskFallback: 'Orta', income: '900K – 2.0M', loadout: ['T6_MAIN_NATURESTAFF', 'T6_CAPE'] },
    dive: { label: 'avalon-modeDive', fallback: 'PvPvE / Dive', risk: 'avalon-riskHigh', riskFallback: 'Yüksek', income: '1.5M – 3.5M', loadout: ['T6_MAIN_DAGGER', 'T6_CAPE'] }
  };
  const cities = ['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford', 'Caerleon', 'Brecilien'];
  function render(container) {
    container.innerHTML = `<div class="avalon-planner"><div class="planner-heading"><div><span class="eyebrow"><i class="fa-solid fa-route"></i> ${t('avalon-eyebrow', 'AVALON YOL PLANLAYICI')}</span><h2>${t('avalon-plannerTitle', 'Avalon yolunu içeriğine göre planla')}</h2><p>${t('avalon-plannerDesc', 'Başlangıç şehri, portal seviyesi ve risk tercihini seç; önerilen kısa rotayı ve hazırlık eşyalarını gör.')}</p></div><span class="market-pill"><i class="fa-solid fa-shield-halved"></i> ${t('avalon-estimate', 'tahmini plan')}</span></div><div class="planner-form"><label class="market-field"><span>${t('avalon-start', 'Başlangıç şehri')}</span><select id="avalonStart">${cities.map((city) => `<option>${city}</option>`).join('')}</select></label><label class="market-field"><span>${t('avalon-tier', 'Portal seviyesi')}</span><select id="avalonTier"><option value="4">T4</option><option value="5">T5</option><option value="6" selected>T6</option><option value="7">T7</option><option value="8">T8</option></select></label><label class="market-field"><span>${t('avalon-mode', 'İçerik')}</span><select id="avalonMode"><option value="solo">${t('avalon-modeSolo', 'Solo PvE')}</option><option value="gather">${t('avalon-modeGather', 'Toplayıcılık')}</option><option value="group">${t('avalon-modeGroup', 'Grup PvE')}</option><option value="dive">${t('avalon-modeDive', 'PvPvE / Dive')}</option></select></label></div><div id="avalonPlanResult" class="avalon-plan-result"></div></div>`;
    const update = () => {
      const mode = modes[container.querySelector('#avalonMode').value];
      const tier = container.querySelector('#avalonTier').value;
      const start = container.querySelector('#avalonStart').value;
      const loadout = mode.loadout.map((id) => window.ItemCard?.card?.(id.replace(/^T6_/, `T${tier}_`), { compact: true }) || '').join('');
      container.querySelector('#avalonPlanResult').innerHTML = `<div class="avalon-route"><div><span>${t('avalon-route', 'Önerilen rota')}</span><strong>${esc(start)} → ${esc(t(mode.label, mode.fallback))} → ${t('avalon-return', 'En yakın güvenli çıkış')}</strong><small>${t('avalon-routeNote', 'Portala girmeden önce taşıma yükünü hafiflet ve çıkış rotasını işaretle.')}</small></div><div class="avalon-stat"><span>${t('avalon-risk', 'Risk')}</span><strong>${esc(t(mode.risk, mode.riskFallback))}</strong></div><div class="avalon-stat"><span>${t('avalon-income', 'Tahmini saatlik gelir')}</span><strong>${esc(mode.income)} 🥈</strong></div></div><div class="avalon-loadout"><h3>${t('avalon-loadout', 'Hazırlık eşyaları')}</h3><div>${loadout}</div></div>`;
    };
    container.querySelectorAll('select').forEach((select) => select.addEventListener('change', update));
    update();
  }
  document.addEventListener('DOMContentLoaded', () => { const container = document.getElementById('avalonApp'); if (container) render(container); });
})();
