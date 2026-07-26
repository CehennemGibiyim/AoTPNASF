/* One organized workspace for Albion operations, grouped into focused desks. */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const surfaces = [
    ['bestiary', 'fa-book-skull', 'operations-bestiary', 'operations-bestiaryDesc'],
    ['combat', 'fa-shield-halved', 'operations-combat', 'operations-combatDesc'],
    ['spawn', 'fa-tower-broadcast', 'operations-spawn', 'operations-spawnDesc'],
    ['intelligence', 'fa-map-location-dot', 'operations-intelligence', 'operations-intelligenceDesc'],
    ['profit', 'fa-coins', 'operations-profit', 'operations-profitDesc'],
    ['risk', 'fa-skull-crossbones', 'operations-risk', 'operations-riskDesc'],
    ['build', 'fa-hammer', 'operations-build', 'operations-buildDesc'],
    ['group', 'fa-people-group', 'operations-group', 'operations-groupDesc'],
    ['route', 'fa-route', 'operations-route', 'operations-routeDesc'],
    ['gathering', 'fa-leaf', 'operations-gathering', 'operations-gatheringDesc'],
    ['encyclopedia', 'fa-book', 'operations-encyclopedia', 'operations-encyclopediaDesc'],
    ['pvp', 'fa-crosshairs', 'operations-pvp', 'operations-pvpDesc'],
    ['records', 'fa-clipboard-data', 'operations-records', 'operations-recordsDesc']
  ];
  function mount() {
    const root = document.getElementById('operationsApp');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';
    root.innerHTML = `<div class="operations-shell"><header class="operations-heading"><div><span class="eyebrow"><i class="fa-solid fa-compass-drafting"></i> ${esc(t('operations-eyebrow', 'ALBION OPERASYON MERKEZİ'))}</span><h1>${esc(t('operations-title', 'Tüm operasyonlar tek çalışma alanında'))}</h1><p>${esc(t('operations-desc', 'Karşılaşma, ekonomi, rota ve savaş araçlarını ayrı çalışma masalarında yönet.'))}</p></div><span class="operations-live-note"><i class="fa-solid fa-satellite-dish"></i>${esc(t('operations-liveNote', 'Canlı fiyat ve sunucu saatine bağlı araçlar'))}</span></header><div class="operations-layout"><aside class="operations-nav" aria-label="${esc(t('operations-title', 'Operasyonlar'))}"><div class="operations-nav-label">${esc(t('operations-select', 'Bir çalışma masası seç'))}</div>${surfaces.map(([id, icon, title]) => `<button type="button" class="operations-nav-btn ${id === 'bestiary' ? 'is-active' : ''}" data-operation-view="${id}"><i class="fa-solid ${icon}"></i><span>${esc(t(title, title))}</span></button>`).join('')}</aside><div class="operations-views">${surfaces.map(([id, icon, title, desc]) => `<section id="operations-view-${id}" class="operations-view ${id === 'bestiary' ? 'is-active' : ''}" data-operation-panel="${id}" aria-label="${esc(t(title, title))}"><div class="operations-view-intro"><div><span class="operations-view-kicker"><i class="fa-solid ${icon}"></i>${esc(t(title, title))}</span><p>${esc(t(desc, 'Araç açıklaması'))}</p></div></div><div id="operations-${id}-root"></div></section>`).join('')}</div></div><footer class="operations-source-note"><i class="fa-solid fa-circle-info"></i>${esc(t('operations-sourceNote', 'Veriler rehber tahminidir; oyun güncellemeleriyle değişebilir.'))}</footer></div>`;
    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-operation-view]');
      if (!button) return;
      const view = button.dataset.operationView;
      root.querySelectorAll('[data-operation-view]').forEach((item) => item.classList.toggle('is-active', item === button));
      root.querySelectorAll('[data-operation-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.operationPanel === view));
      window.dispatchEvent(new CustomEvent('operations_view_changed', { detail: { view } }));
    });
    window.dispatchEvent(new CustomEvent('operations_shell_ready'));
  }
  document.addEventListener('DOMContentLoaded', mount);
})();
