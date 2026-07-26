/* Smart price alerts: persistent rules for price floors and net-profit thresholds. */
(function () {
  const STORAGE_KEY = 'aot_pnasf_smart_market_alerts';
  const CITIES = ['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford', 'Caerleon'];
  const t = (key, fallback) => {
    try {
      const value = window.miniappI18n?.t?.(key) || window.t?.(key, fallback);
      return value && value !== key ? value : fallback;
    } catch (error) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const money = (value) => Number(value || 0).toLocaleString('tr-TR');
  let alerts = [];
  let modal;

  async function read() {
    try { const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY, { area: 'persistent' }); alerts = raw ? JSON.parse(raw).filter((row) => row?.itemId).slice(0, 40) : []; } catch (error) { alerts = []; }
  }
  async function write() {
    try { await window.miniappsAI?.storage?.setItem(STORAGE_KEY, JSON.stringify(alerts), { area: 'persistent' }); } catch (error) { toast(t('alerts-saveError', 'Alarm kaydedilemedi.'), true); }
  }
  function label(id) { return window.ItemCard?.name?.(id) || id; }
  function itemIdFromForm() { return modal?.querySelector('#alertItemId')?.value.trim().toUpperCase() || ''; }
  function inject() {
    const dock = document.getElementById('marketDock');
    if (!dock || document.getElementById('marketAlertsButton')) return Boolean(dock);
    const actions = document.createElement('div');
    actions.className = 'market-alert-actions';
    actions.innerHTML = `<button type="button" id="marketAlertsButton" class="market-action"><i class="fa-solid fa-bell mr-1"></i>${esc(t('alerts-open', 'Akıllı alarmlar'))}<span id="marketAlertsCount" class="market-alert-count"></span></button>`;
    dock.querySelector('#marketWatchList')?.before(actions);
    modal = document.createElement('div');
    modal.id = 'marketAlertsModal';
    modal.className = 'market-modal hidden';
    modal.innerHTML = `<div class="market-modal-backdrop" data-alert-close></div><div class="market-modal-card market-alert-card" role="dialog" aria-modal="true" aria-labelledby="marketAlertsTitle"><div class="market-modal-header"><div><h2 id="marketAlertsTitle"><i class="fa-solid fa-bell text-albion-accent mr-2"></i>${esc(t('alerts-title', 'Akıllı fiyat alarmları'))}</h2><p>${esc(t('alerts-desc', 'Fiyat tabanını veya net kâr hedefini kaydet; açıkken tek tuşla kontrol et.'))}</p></div><button type="button" class="market-modal-close" data-alert-close aria-label="${esc(t('alerts-close', 'Kapat'))}"><i class="fa-solid fa-xmark"></i></button></div><form id="marketAlertForm" class="market-alert-form"><label>${esc(t('alerts-item', 'Eşya ID'))}<input id="alertItemId" type="text" placeholder="${esc(t('alerts-placeholder', 'T6_MAIN_SWORD'))}" required></label><label>${esc(t('alerts-rule', 'Alarm türü'))}<select id="alertRule"><option value="below">${esc(t('alerts-below', 'Satış fiyatı bunun altına inince'))}</option><option value="profit">${esc(t('alerts-profit', 'Net kâr bunu geçince'))}</option></select></label><label>${esc(t('alerts-value', 'Hedef değer'))}<input id="alertValue" type="number" min="1" step="100" required></label><label>${esc(t('alerts-city', 'Şehir'))}<select id="alertCity"><option value="ALL">${esc(t('alerts-allCities', 'Herhangi bir şehir'))}</option>${CITIES.map((city) => `<option>${city}</option>`).join('')}</select></label><button type="submit" class="market-primary"><i class="fa-solid fa-plus"></i>${esc(t('alerts-save', 'Alarmı kaydet'))}</button></form><div class="market-alert-toolbar"><span id="marketAlertsStatus">${esc(t('alerts-ready', 'Alarm kontrolü hazır.'))}</span><button type="button" id="marketAlertsCheck" class="market-action"><i class="fa-solid fa-rotate"></i>${esc(t('alerts-check', 'Şimdi kontrol et'))}</button></div><div id="marketAlertsList" class="market-alert-list"></div></div>`;
    document.body.appendChild(modal);
    actions.querySelector('#marketAlertsButton').addEventListener('click', () => open());
    modal.addEventListener('click', (event) => { if (event.target.closest('[data-alert-close]')) close(); const remove = event.target.closest('[data-alert-remove]'); if (remove) removeAlert(remove.dataset.alertRemove); const toggle = event.target.closest('[data-alert-toggle]'); if (toggle) toggleAlert(toggle.dataset.alertToggle); });
    modal.querySelector('#marketAlertForm').addEventListener('submit', saveFromForm);
    modal.querySelector('#marketAlertsCheck').addEventListener('click', checkAll);
    render();
    return true;
  }
  function open(id = '') { modal?.classList.remove('hidden'); document.body.classList.add('market-modal-open'); if (id) modal.querySelector('#alertItemId').value = id; modal.querySelector('#alertItemId')?.focus(); }
  function close() { modal?.classList.add('hidden'); document.body.classList.remove('market-modal-open'); }
  async function saveFromForm(event) { event.preventDefault(); const itemId = itemIdFromForm(); const value = Math.max(1, Number(modal.querySelector('#alertValue').value) || 0); if (!itemId || !value) return; const rule = modal.querySelector('#alertRule').value; const city = modal.querySelector('#alertCity').value; alerts = [{ id: crypto.randomUUID?.() || String(Date.now()), itemId, label: label(itemId), rule, value, city, active: true, status: 'new', createdAt: Date.now() }, ...alerts].slice(0, 40); await write(); render(); toast(t('alerts-saved', 'Akıllı alarm kaydedildi.')); modal.querySelector('#alertValue').value = ''; }
  async function removeAlert(id) { alerts = alerts.filter((row) => row.id !== id); await write(); render(); }
  async function toggleAlert(id) { const row = alerts.find((item) => item.id === id); if (!row) return; row.active = !row.active; await write(); render(); }
  async function fetchBelow(row) { const domain = window.getAlbionApiDomain?.() || 'europe.albion-online-data.com'; const locations = row.city === 'ALL' ? CITIES : [row.city]; const url = `https://${domain}/api/v2/stats/prices/${encodeURIComponent(row.itemId)}.json?locations=${encodeURIComponent(locations.join(','))}`; const rows = await window.MarketRuntime.fetch(url); const prices = (Array.isArray(rows) ? rows : []).map((item) => Number(item.sell_price_min)).filter((price) => price > 0); return prices.length ? Math.min(...prices) : 0; }
  async function check(row) { if (row.rule === 'below') { const current = await fetchBelow(row); return { ...row, current, matched: current > 0 && current <= row.value, checkedAt: Date.now(), status: current > 0 && current <= row.value ? 'matched' : current ? 'watching' : 'empty' }; } const result = await window.MarketFavorites?.analyze?.({ id: row.itemId, label: row.label || label(row.itemId), city: row.city, minProfit: 0 }); const current = Number(result?.profit || 0); return { ...row, current, matched: result?.status === 'hit' && current >= row.value, checkedAt: Date.now(), status: result?.status === 'error' ? 'error' : current >= row.value ? 'matched' : 'watching' }; }
  async function checkAll() { const status = modal?.querySelector('#marketAlertsStatus'); const button = modal?.querySelector('#marketAlertsCheck'); if (!alerts.length) { if (status) status.textContent = t('alerts-empty', 'Önce bir alarm kaydedin.'); return; } button.disabled = true; if (status) status.textContent = t('alerts-loading', 'Alarmlar kontrol ediliyor…'); for (let index = 0; index < alerts.length; index += 1) { if (!alerts[index].active) continue; try { alerts[index] = await check(alerts[index]); } catch (error) { alerts[index] = { ...alerts[index], status: 'error', checkedAt: Date.now() }; } } await write(); render(); if (status) status.textContent = t('alerts-checked', 'Alarm kontrolü tamamlandı.'); button.disabled = false; }
  function render() { const target = modal?.querySelector('#marketAlertsList'); const count = document.getElementById('marketAlertsCount'); if (count) count.textContent = alerts.filter((row) => row.active).length ? ` · ${alerts.filter((row) => row.active).length}` : ''; if (!target) return; target.innerHTML = alerts.length ? alerts.map((row) => { const title = row.rule === 'below' ? `${t('alerts-belowShort', 'Fiyat')} ≤ ${money(row.value)}` : `${t('alerts-profitShort', 'Kâr')} ≥ ${money(row.value)}`; const current = row.current ? money(row.current) : t('alerts-notChecked', 'Kontrol edilmedi'); const state = row.status === 'matched' ? 'is-matched' : row.status === 'error' ? 'is-error' : ''; return `<article class="market-alert-row ${state}"><div><strong>${esc(row.label || label(row.itemId))}</strong><code>${esc(row.itemId)}</code><span>${esc(title)} · ${esc(row.city === 'ALL' ? t('alerts-allCities', 'Herhangi bir şehir') : row.city)}</span></div><b>${esc(current)}</b><button type="button" data-alert-toggle="${esc(row.id)}" aria-label="${esc(t('alerts-toggle', 'Alarmı aç/kapat'))}"><i class="fa-solid ${row.active ? 'fa-toggle-on' : 'fa-toggle-off'}"></i></button><button type="button" data-alert-remove="${esc(row.id)}" aria-label="${esc(t('alerts-remove', 'Alarmı sil'))}"><i class="fa-solid fa-trash"></i></button></article>`; }).join('') : `<p class="market-empty">${esc(t('alerts-empty', 'Henüz akıllı alarm yok.'))}</p>`; }
  function toast(message, error = false) { const node = document.createElement('div'); node.className = `market-toast ${error ? 'is-error' : ''}`; node.textContent = message; document.body.appendChild(node); setTimeout(() => node.remove(), 2600); }
  document.addEventListener('DOMContentLoaded', async () => { await read(); const retry = () => { if (inject()) return true; window.addEventListener('market_favorites_ready', inject, { once: true }); return false; }; retry(); let attempts = 0; const timer = setInterval(() => { attempts += 1; if (retry() || attempts > 30) clearInterval(timer); }, 120); window.addEventListener('market_open_alert_editor', (event) => { if (!modal) retry(); open(event.detail?.id || ''); }); });
})();
