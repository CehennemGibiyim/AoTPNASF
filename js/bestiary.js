/* Albion Bestiary: one organised surface for mobs, bosses, regions, mechanics and itemised drops. */
(function () {
  const KEY = 'aot_pnasf_bestiary_favorites';
  const data = () => window.AlbionBestiaryData || [];
  const t = (key, fallback = key) => window.t?.(key, fallback) || fallback;
  const esc = (value) => String(value ?? '').replace(/[&<>'\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  
  const creatureImage = (entry, className) => {
    const art = window.CreatureArt;
    const imgElement = art?.bestiaryArt?.(entry.id, t(entry.name, entry.id)) || document.createElement('img');
    if (imgElement.outerHTML) return imgElement.outerHTML;
    // Fallback SVG
    const name = t(entry.name, entry.id).substring(0, 12);
    return `<img class="${className}" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2096%2096%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20rx%3D%2212%22%20fill%3D%22%230a0a14%22%2F%3E%3Cpath%20d%3D%22M32%2064%2048%2032l16%2032H32Z%22%20fill%3D%22none%22%20stroke%3D%22%23d4af37%22%20stroke-width%3D%224%22%2F%3E%3Ctext%20x%3D%2248%22%20y%3D%2282%22%20text-anchor%3D%22middle%22%20fill%3D%22%23ffffff%22%20font-size%3D%2210%22%20font-family%3D%22Arial%22%3E${encodeURIComponent(name)}%3C%2Ftext%3E%3C%2Fsvg%3E" alt="${esc(label(entry))}" loading="lazy">`;
  };
  
  let favorites = [];
  let root;
  let activeId = '';
  let query = '';
  let type = 'all';
  let risk = 'all';
  let region = 'all';

  async function read() {
    try { const raw = await window.miniappsAI?.storage?.getItem(KEY, { area: 'persistent' }); favorites = raw ? JSON.parse(raw) : []; } catch (error) { favorites = []; }
  }
  async function save() {
    try { await window.miniappsAI?.storage?.setItem(KEY, JSON.stringify(favorites.slice(0, 60)), { area: 'persistent' }); } catch (error) { /* best effort */ }
  }
  const label = (entry) => t(entry.name, entry.id);
  const matches = (entry) => {
    const haystack = [label(entry), t(entry.summary, ''), t(entry.region, ''), ...entry.areas.map((key) => t(key, '')), ...entry.drops.map((drop) => t(drop.name, drop.itemId))].join(' ').toLocaleLowerCase();
    return (!query || haystack.includes(query.toLocaleLowerCase())) && (type === 'all' || entry.type === type) && (risk === 'all' || entry.risk === risk) && (region === 'all' || entry.region === region);
  };
  const visible = () => data().filter(matches);
  const stat = (labelKey, value) => `<div class="bestiary-stat"><span>${esc(t(labelKey))}</span><strong>${esc(value)}</strong></div>`;
  function card(entry) {
    const favorite = favorites.includes(entry.id);
    return `<button type="button" class="bestiary-card ${activeId === entry.id ? 'is-active' : ''}" data-bestiary-id="${esc(entry.id)}">${creatureImage(entry, 'bestiary-card-art bestiary-creature-art')}<span class="bestiary-card-copy"><strong>${esc(label(entry))}</strong><small>${esc(t(entry.region, entry.region))} · ${esc(t(`bestiary-${entry.type}`, entry.type))}</small><span class="bestiary-card-meta"><i class="fa-solid fa-heart ${favorite ? 'text-red-400' : 'text-gray-500'}"></i> <span>${esc(entry.stats.hp)}</span> · <span>${esc(entry.stats.damage)}</span></span></span></button>`;
  }
  function detail(entry) {
    const favorite = favorites.includes(entry.id);
    return `<article class="bestiary-detail"><div class="bestiary-detail-head">${creatureImage(entry, 'bestiary-hero-art bestiary-creature-art')}<div class="bestiary-detail-title"><span class="eyebrow"><i class="fa-solid fa-crosshairs"></i> ${esc(t('bestiary-encounter'))}</span><h2>${esc(label(entry))}</h2><p>${esc(t(entry.summary, ''))}</p><div class="bestiary-detail-actions"><button type="button" class="bestiary-favorite ${favorite ? 'is-favorite' : ''}" data-bestiary-id="${esc(entry.id)}"><i class="fa-solid fa-heart"></i> ${esc(t('bestiary-favorite'))}</button><button type="button" class="bestiary-market" data-loot-ids="${esc(entry.drops.map((d) => d.itemId).join(','))}"><i class="fa-solid fa-chart-line"></i> ${esc(t('bestiary-market'))}</button></div></div></div><div class="bestiary-detail-stats">${stat('bestiary-hp', entry.stats.hp)}${stat('bestiary-damage', entry.stats.damage)}${stat('bestiary-fame', entry.stats.fame)}${stat('bestiary-silver', entry.stats.silver)}${stat('bestiary-respawn', entry.stats.respawn)}</div><div class="bestiary-detail-section"><h3><i class="fa-solid fa-list-check"></i> ${esc(t('bestiary-traits'))}</h3><ul class="bestiary-traits">${entry.traits.map((trait) => `<li><i class="fa-solid fa-chevron-right"></i> ${esc(t(trait, trait))}</li>`).join('')}</ul></div><div class="bestiary-detail-section"><h3><i class="fa-solid fa-shield"></i> ${esc(t('bestiary-weaknesses'))}</h3><ul class="bestiary-weaknesses">${entry.weaknesses.map((weak) => `<li><i class="fa-solid fa-chevron-right"></i> ${esc(t(weak, weak))}</li>`).join('')}</ul></div><div class="bestiary-detail-section"><h3><i class="fa-solid fa-users"></i> ${esc(t('bestiary-roles'))}</h3><p>${esc(t(entry.roles, entry.roles))}</p></div><div class="bestiary-detail-section"><h3><i class="fa-solid fa-chess-board"></i> ${esc(t('bestiary-strategy'))}</h3><p>${esc(t(entry.strategy, entry.strategy))}</p></div><div class="bestiary-detail-section"><h3><i class="fa-solid fa-map-location"></i> ${esc(t('bestiary-areas'))}</h3><ul class="bestiary-areas">${entry.areas.map((area) => `<li><i class="fa-solid fa-location-dot"></i> ${esc(t(area, area))}</li>`).join('')}</ul></div><div class="bestiary-detail-section"><h3><i class="fa-solid fa-box-open"></i> ${esc(t('bestiary-loot'))}</h3><div class="bestiary-loot">${entry.drops.map((drop) => `<div class="bestiary-drop"><div class="bestiary-drop-art">${window.ItemCard?.card?.(drop.itemId, { compact: true }) || ''}</div><div class="bestiary-drop-copy"><strong>${esc(t(drop.name, drop.itemId))}</strong><small>T${drop.tier} · ${esc(t(`bestiary-${drop.chance}`, drop.chance))}</small></div></div>`).join('')}</div></div></article>`;
  }
  function render() {
    if (!root) return;
    const list = visible();
    root.innerHTML = `<div class="bestiary"><div class="bestiary-controls"><input type="search" placeholder="${esc(t('bestiary-search', 'Mob/Boss ara...'))}" value="${esc(query)}" class="bestiary-search"><div class="bestiary-filters"><select class="bestiary-filter-type"><option value="all">${esc(t('bestiary-allTypes', 'Tüm türler'))}</option><option value="mob">${esc(t('bestiary-mob', 'Mob'))}</option><option value="boss">${esc(t('bestiary-boss', 'Boss'))}</option><option value="event">${esc(t('bestiary-event', 'Etkinlik'))}</option></select><select class="bestiary-filter-risk"><option value="all">${esc(t('bestiary-allRisks', 'Tüm riskler'))}</option><option value="low">${esc(t('bestiary-low', 'Düşük'))}</option><option value="medium">${esc(t('bestiary-medium', 'Orta'))}</option><option value="high">${esc(t('bestiary-high', 'Yüksek'))}</option></select><select class="bestiary-filter-region"><option value="all">${esc(t('bestiary-allRegions', 'Tüm bölgeler'))}</option><option value="bestiary-regionMists">${esc(t('bestiary-regionMists', 'Mists'))}</option><option value="bestiary-regionRoyal">${esc(t('bestiary-regionRoyal', 'Royal Kıtası'))}</option><option value="bestiary-regionRoads">${esc(t('bestiary-regionRoads', 'Roads of Avalon'))}</option><option value="bestiary-regionStatic">${esc(t('bestiary-regionStatic', 'Static Dungeon'))}</option></select></div></div><div class="bestiary-list">${list.map(card).join('')}</div><div class="bestiary-detail-view ${activeId ? 'is-visible' : ''}">${activeId ? detail(list.find((e) => e.id === activeId) || list[0]) : ''}</div></div>`;
    root.querySelector('.bestiary-search').addEventListener('input', (event) => { query = event.target.value; render(); });
    root.querySelector('.bestiary-filter-type').addEventListener('change', (event) => { type = event.target.value; render(); });
    root.querySelector('.bestiary-filter-risk').addEventListener('change', (event) => { risk = event.target.value; render(); });
    root.querySelector('.bestiary-filter-region').addEventListener('change', (event) => { region = event.target.value; render(); });
    root.querySelectorAll('.bestiary-card').forEach((card) => card.addEventListener('click', (event) => { activeId = card.dataset.bestiaryId; render(); event.stopPropagation(); }));
    root.querySelectorAll('.bestiary-favorite').forEach((btn) => btn.addEventListener('click', async (event) => { const id = btn.dataset.bestiaryId; favorites = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]; await save(); render(); }));
    root.querySelectorAll('.bestiary-market').forEach((btn) => btn.addEventListener('click', (event) => { const ids = btn.dataset.lootIds; if (ids) { window.location.hash = '#tab-market'; setTimeout(() => { const market = document.getElementById('marketApp'); if (market && window.MarketCenter?.showItems) window.MarketCenter.showItems(ids.split(',')); }, 100); } }));
  }
  document.addEventListener('DOMContentLoaded', async () => {
    root = document.getElementById('bestiaryApp');
    if (!root) return;
    await read();
    render();
    document.addEventListener('click', () => { if (activeId) { activeId = ''; render(); } });
  });
})();