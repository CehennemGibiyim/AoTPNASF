/* Personal economy profile: one durable source for capital, goals and player context. */
(function () {
  const PROFILE_KEY = 'aot_pnasf_market_profile';
  const defaults = {
    version: 2,
    capital: 1000000,
    focusAmount: 0,
    city: 'Bridgewatch',
    risk: 'balanced',
    playtime: 2,
    buyTax: 0,
    sellTax: 6.5,
    focus: false,
    goal: 1000000,
    crafting: { weapon: 0, armor: 0, tool: 0, consumable: 0 },
    inventory: []
  };
  let profile = { ...defaults, crafting: { ...defaults.crafting }, inventory: [] };
  let modal;
  let editing = false;

  const t = (key, fallback) => {
    try {
      const value = window.miniappI18n?.t?.(key) || window.t?.(key, fallback);
      return value && value !== key ? value : fallback;
    } catch (error) { return fallback; }
  };
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : fallback;
  const merge = (saved) => ({
    ...defaults,
    ...(saved || {}),
    crafting: { ...defaults.crafting, ...(saved?.crafting || {}) },
    inventory: Array.isArray(saved?.inventory) ? saved.inventory.filter((row) => row && row.id).slice(0, 100) : []
  });

  async function load() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(PROFILE_KEY, { area: 'persistent' });
      if (raw) profile = merge(JSON.parse(raw));
    } catch (error) { profile = merge(profile); }
    window.MarketProfile = profile;
    window.EconomyProfile = api;
  }

  async function persist(next = profile) {
    profile = merge(next);
    window.MarketProfile = profile;
    window.EconomyProfile = api;
    try {
      await window.miniappsAI?.storage?.setItem(PROFILE_KEY, JSON.stringify(profile), { area: 'persistent' });
      window.dispatchEvent(new CustomEvent('economy_profile_updated', { detail: { ...profile } }));
      return true;
    } catch (error) {
      showToast(t('profile-saveError', 'Profil kaydedilemedi. Tekrar deneyin.'), true);
      return false;
    }
  }

  function inventoryValue() {
    return profile.inventory.reduce((sum, row) => sum + number(row.quantity) * number(row.unitValue), 0);
  }
  function riskLabel() {
    return t(`profile-risk-${profile.risk}`, profile.risk);
  }
  function summary() {
    return { ...profile, inventoryValue: inventoryValue(), riskLabel: riskLabel() };
  }

  function renderInventory() {
    const target = modal?.querySelector('#profileInventoryList');
    const total = modal?.querySelector('#profileInventoryTotal');
    if (!target) return;
    if (total) total.textContent = `${inventoryValue().toLocaleString('tr-TR')} 🥈`;
    target.innerHTML = profile.inventory.length ? profile.inventory.map((row, index) => `<div class="profile-inventory-row"><span><strong>${esc(row.id)}</strong><small>${number(row.quantity).toLocaleString('tr-TR')} × ${number(row.unitValue).toLocaleString('tr-TR')} 🥈</small></span><b>${(number(row.quantity) * number(row.unitValue)).toLocaleString('tr-TR')} 🥈</b><button type="button" data-profile-remove="${index}" aria-label="${esc(t('profile-removeInventory', 'Envanterden çıkar'))}"><i class="fa-solid fa-xmark"></i></button></div>`).join('') : `<p class="profile-empty">${esc(t('profile-emptyInventory', 'Henüz envanter eklenmedi.'))}</p>`;
  }

  function modalMarkup() {
    return `<div class="economy-profile-backdrop" data-profile-close></div><div class="economy-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="economyProfileTitle"><div class="economy-profile-head"><div><span class="eyebrow"><i class="fa-solid fa-wallet"></i> ${esc(t('profile-eyebrow', 'KİŞİSEL EKONOMİ'))}</span><h2 id="economyProfileTitle">${esc(t('profile-title', 'Ekonomi profilin'))}</h2><p>${esc(t('profile-desc', 'Önerileri sermayene, şehrine ve oyun tarzına göre kişiselleştir.'))}</p></div><button type="button" class="economy-profile-close" data-profile-close aria-label="${esc(t('profile-close', 'Kapat'))}"><i class="fa-solid fa-xmark"></i></button></div><form id="economyProfileForm"><div class="profile-form-grid"><label class="profile-field"><span>${esc(t('profile-capital', 'Silver sermayesi'))}</span><input id="profileCapital" type="number" min="0" step="1000" value="${number(profile.capital)}"></label><label class="profile-field"><span>${esc(t('profile-focusAmount', 'Focus miktarı'))}</span><input id="profileFocusAmount" type="number" min="0" step="100" value="${number(profile.focusAmount)}"></label><label class="profile-field"><span>${esc(t('profile-city', 'Ana şehir'))}</span><select id="profileCity">${['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford', 'Caerleon', 'Brecilien'].map((city) => `<option value="${city}" ${profile.city === city ? 'selected' : ''}>${city}</option>`).join('')}</select></label><label class="profile-field"><span>${esc(t('profile-playtime', 'Günlük oyun süresi'))}</span><select id="profilePlaytime">${[0.5, 1, 2, 3, 4, 6, 8].map((hours) => `<option value="${hours}" ${Number(profile.playtime) === hours ? 'selected' : ''}>${hours} ${esc(t('profile-hours', 'saat'))}</option>`).join('')}</select></label><label class="profile-field"><span>${esc(t('profile-risk', 'Risk tercihi'))}</span><select id="profileRisk"><option value="safe" ${profile.risk === 'safe' ? 'selected' : ''}>${esc(t('profile-risk-safe', 'Güvenli'))}</option><option value="balanced" ${profile.risk === 'balanced' ? 'selected' : ''}>${esc(t('profile-risk-balanced', 'Dengeli'))}</option><option value="black" ${profile.risk === 'black' ? 'selected' : ''}>${esc(t('profile-risk-black', 'Agresif / Black Zone'))}</option></select></label><label class="profile-field"><span>${esc(t('profile-goal', 'Günlük kâr hedefi'))}</span><input id="profileGoal" type="number" min="0" step="1000" value="${number(profile.goal)}"></label></div><div class="profile-section"><div class="profile-section-head"><div><h3>${esc(t('profile-craftingTitle', 'Crafting seviyeleri'))}</h3><p>${esc(t('profile-craftingDesc', 'Yaklaşık seviyelerini gir; gelecekteki planlar bunu kullanacak.'))}</p></div></div><div class="profile-crafting-grid">${[['weapon', 'profile-weapon'], ['armor', 'profile-armor'], ['tool', 'profile-tool'], ['consumable', 'profile-consumable']].map(([key, label]) => `<label class="profile-field"><span>${esc(t(label, key))}</span><input data-profile-craft="${key}" type="number" min="0" max="120" step="1" value="${number(profile.crafting[key])}"></label>`).join('')}</div></div><div class="profile-section"><div class="profile-section-head"><div><h3>${esc(t('profile-inventoryTitle', 'Envanter özeti'))}</h3><p>${esc(t('profile-inventoryDesc', 'Elindeki malzemeleri hızlıca ekle; değer ve planlama hesabına katılsın.'))}</p></div><strong id="profileInventoryTotal" class="profile-total"></strong></div><div class="profile-inventory-add"><input id="profileInventoryId" type="text" placeholder="${esc(t('profile-itemPlaceholder', 'Örn. T6_HIDE'))}" aria-label="${esc(t('profile-itemPlaceholder', 'Eşya ID'))}"><input id="profileInventoryQty" type="number" min="1" step="1" placeholder="${esc(t('profile-quantity', 'Miktar'))}" aria-label="${esc(t('profile-quantity', 'Miktar'))}"><input id="profileInventoryValue" type="number" min="0" step="100" placeholder="${esc(t('profile-unitValue', 'Birim değer'))}" aria-label="${esc(t('profile-unitValue', 'Birim değer'))}"><button type="button" class="profile-secondary" id="profileInventoryAdd"><i class="fa-solid fa-plus"></i> ${esc(t('profile-addItem', 'Ekle'))}</button></div><div id="profileInventoryList" class="profile-inventory-list"></div></div><div class="economy-profile-footer"><button type="button" class="profile-secondary" data-profile-close>${esc(t('profile-cancel', 'Vazgeç'))}</button><button type="submit" class="profile-primary"><i class="fa-solid fa-check"></i> ${esc(t('profile-save', 'Profili kaydet'))}</button></div></form></div>`;
  }

  function mount() {
    if (document.getElementById('economyProfileModal')) return;
    const trigger = document.getElementById('economyProfileTrigger');
    modal = document.createElement('div');
    modal.id = 'economyProfileModal';
    modal.className = 'economy-profile-modal hidden';
    modal.innerHTML = modalMarkup();
    document.body.appendChild(modal);
    trigger?.addEventListener('click', open);
    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-profile-close]')) close();
      const remove = event.target.closest('[data-profile-remove]');
      if (remove) { profile.inventory.splice(Number(remove.dataset.profileRemove), 1); renderInventory(); }
    });
    modal.querySelector('#profileInventoryAdd')?.addEventListener('click', addInventory);
    modal.querySelector('#economyProfileForm')?.addEventListener('submit', saveFromForm);
    renderInventory();
  }

  function addInventory() {
    const id = modal.querySelector('#profileInventoryId')?.value.trim().toUpperCase();
    const quantity = number(modal.querySelector('#profileInventoryQty')?.value);
    const unitValue = number(modal.querySelector('#profileInventoryValue')?.value);
    if (!id || quantity <= 0) return showToast(t('profile-invalidInventory', 'Eşya ve miktar girin.'), true);
    const existing = profile.inventory.find((row) => row.id === id && number(row.unitValue) === unitValue);
    if (existing) existing.quantity = number(existing.quantity) + quantity;
    else profile.inventory.push({ id, quantity, unitValue });
    modal.querySelector('#profileInventoryId').value = '';
    modal.querySelector('#profileInventoryQty').value = '';
    modal.querySelector('#profileInventoryValue').value = '';
    renderInventory();
  }

  async function saveFromForm(event) {
    event.preventDefault();
    const next = { ...profile, capital: number(modal.querySelector('#profileCapital').value), focusAmount: number(modal.querySelector('#profileFocusAmount').value), city: modal.querySelector('#profileCity').value, playtime: number(modal.querySelector('#profilePlaytime').value, 2), risk: modal.querySelector('#profileRisk').value, goal: number(modal.querySelector('#profileGoal').value), crafting: { ...profile.crafting } };
    modal.querySelectorAll('[data-profile-craft]').forEach((input) => { next.crafting[input.dataset.profileCraft] = number(input.value); });
    next.focus = next.focusAmount > 0;
    const button = modal.querySelector('.profile-primary');
    button.disabled = true;
    const saved = await persist(next);
    button.disabled = false;
    if (saved) { close(); showToast(t('profile-saved', 'Ekonomi profilin güncellendi.')); }
  }

  function open() {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.classList.add('economy-profile-open');
    renderInventory();
    modal.querySelector('#profileCapital')?.focus();
  }
  function close() { modal?.classList.add('hidden'); document.body.classList.remove('economy-profile-open'); }
  function showToast(message, error = false) {
    const toast = document.createElement('div');
    toast.className = `market-toast ${error ? 'is-error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  const api = { get: () => ({ ...profile, crafting: { ...profile.crafting }, inventory: [...profile.inventory] }), summary, open, save: persist, inventoryValue };
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal?.classList.contains('hidden')) close(); });
  document.addEventListener('DOMContentLoaded', async () => { await load(); mount(); window.dispatchEvent(new CustomEvent('economy_profile_ready', { detail: summary() })); });
})();
