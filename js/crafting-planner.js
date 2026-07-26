/* Live production planner: craftable catalog + visual item picker + independent tier/enchant/quality. */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  const esc = (value) => window.ItemCard?.escape?.(value) || String(value ?? '');
  const QUALITY_OPTIONS = [
    { value: 1, key: 'crafting-qualityNormal', fallback: 'Normal' },
    { value: 2, key: 'crafting-qualityGood', fallback: 'İyi' },
    { value: 3, key: 'crafting-qualityOutstanding', fallback: 'Üstün' },
    { value: 4, key: 'crafting-qualityExcellent', fallback: 'Mükemmel' },
    { value: 5, key: 'crafting-qualityMasterpiece', fallback: 'Başyapıt' }
  ];
  let root;
  let pickerOpen = false;

  function qualityLabel(value) {
    const option = QUALITY_OPTIONS.find((entry) => entry.value === Number(value));
    return option ? t(option.key, option.fallback) : t('crafting-qualityNormal', 'Normal');
  }

  function sortedItems() {
    return (window.MarketItemCatalog?.items || []).slice().sort((a, b) => window.MarketItemCatalog.label(a).localeCompare(window.MarketItemCatalog.label(b), 'tr', { sensitivity: 'base' }));
  }

  function mount() {
    const container = document.getElementById('craftingApp');
    const catalog = window.MarketItemCatalog;
    if (!container || document.getElementById('craftingProfitPlanner')) return Boolean(container);
    if (!catalog?.items?.length) return false;
    const items = sortedItems();
    const first = items[0];
    root = document.createElement('section');
    root.id = 'craftingProfitPlanner';
    root.className = 'crafting-profit-planner';
    root.innerHTML = `
      <div class="planner-heading"><div><span class="eyebrow"><i class="fa-solid fa-coins"></i> ${t('crafting-plannerEyebrow', 'CANLI ÜRETİM KÂR PLANI')}</span><h3>${t('crafting-plannerLiveTitle', 'Üretmek mi, satın almak mı?')}</h3><p>${t('crafting-plannerLiveDesc', 'Üretilecek eşyayı görsel kataloğundan seçin; kademe, büyü seviyesi, kalite ve maliyetinizi ayrı ayrı belirleyin.')}</p></div><span class="market-pill"><i class="fa-solid fa-satellite-dish"></i> ${t('market-realData', 'gerçek veri')}</span></div>
      <div class="planner-form">
        <label class="market-field planner-item-field"><span>${t('crafting-plannerItem', 'Üretilecek eşya')}</span>
          <select id="craftPlannerItem" class="planner-item-native" aria-hidden="true" tabindex="-1">${items.map((item) => `<option value="${esc(item.id)}">${esc(catalog.label(item))}</option>`).join('')}</select>
          <div class="planner-picker" id="craftPlannerPicker">
            <button type="button" class="planner-picker-button" id="craftPlannerPickerButton" aria-haspopup="listbox" aria-expanded="false"><img id="craftPlannerPickerIcon" alt=""><span id="craftPlannerPickerLabel">${esc(catalog.label(first))}</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
            <div class="planner-picker-panel" id="craftPlannerPickerPanel" hidden>
              <div class="planner-picker-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input id="craftPlannerSearch" type="search" placeholder="${esc(t('crafting-plannerSearch', 'Eşya adı veya ID ara…'))}" aria-label="${esc(t('crafting-plannerSearch', 'Eşya ara'))}"></div>
              <div class="planner-picker-count" id="craftPlannerCount"></div>
              <div class="planner-picker-grid" id="craftPlannerGrid" role="listbox" aria-label="${esc(t('crafting-plannerItemList', 'Üretilecek eşyalar'))}"></div>
            </div>
          </div>
        </label>
        <label class="market-field"><span>${t('crafting-plannerTier', 'Kademe')}</span><select id="craftPlannerTier"><option value="4">T4</option><option value="5">T5</option><option value="6" selected>T6</option><option value="7">T7</option><option value="8">T8</option></select></label>
        <label class="market-field"><span>${t('crafting-plannerEnchant', 'Seviye / Büyü')}</span><select id="craftPlannerEnchant"><option value="0">.0</option><option value="1">.1</option><option value="2">.2</option><option value="3">.3</option><option value="4">.4</option></select></label>
        <label class="market-field"><span>${t('crafting-plannerQuality', 'Kalite')}</span><select id="craftPlannerQuality">${QUALITY_OPTIONS.map((option) => `<option value="${option.value}">${t(option.key, option.fallback)}</option>`).join('')}</select></label>
        <label class="market-field"><span>${t('crafting-plannerCost', 'Malzeme + üretim maliyeti')}</span><input id="craftPlannerCost" type="number" min="0" step="100" value="0"></label>
        <label class="market-field"><span>${t('crafting-plannerQty', 'Adet')}</span><input id="craftPlannerQty" type="number" min="1" step="1" value="1"></label>
        <button type="button" id="craftPlannerAnalyze" class="market-primary"><i class="fa-solid fa-chart-line"></i> ${t('crafting-plannerAnalyze', 'Kârı analiz et')}</button>
      </div>
      <div id="craftPlannerPreview" class="planner-preview" aria-live="polite"></div>
      <div id="craftPlannerResult" class="planner-result" aria-live="polite"></div>`;
    container.insertBefore(root, container.firstElementChild);
    bind();
    renderPicker();
    renderPreview();
    return true;
  }

  function selected() {
    const itemId = root?.querySelector('#craftPlannerItem')?.value || '';
    const item = window.MarketItemCatalog?.find?.(itemId);
    if (!item) return null;
    const tier = Number(root.querySelector('#craftPlannerTier')?.value || 6);
    const enchant = Number(root.querySelector('#craftPlannerEnchant')?.value || 0);
    const quality = Number(root.querySelector('#craftPlannerQuality')?.value || 1);
    return { item, tier, enchant, quality, id: window.MarketItemCatalog.buildId(item.id, tier, enchant), label: window.MarketItemCatalog.label(item) };
  }

  function selectionLabel(selection) {
    return `${selection.label} · T${selection.tier}.${selection.enchant} · ${qualityLabel(selection.quality)}`;
  }

  function setPickerOpen(open) {
    pickerOpen = Boolean(open);
    const panel = root?.querySelector('#craftPlannerPickerPanel');
    const button = root?.querySelector('#craftPlannerPickerButton');
    if (!panel || !button) return;
    panel.hidden = !pickerOpen;
    button.setAttribute('aria-expanded', String(pickerOpen));
    if (pickerOpen) root.querySelector('#craftPlannerSearch')?.focus();
  }

  function renderPicker() {
    const catalog = window.MarketItemCatalog;
    const grid = root?.querySelector('#craftPlannerGrid');
    const count = root?.querySelector('#craftPlannerCount');
    const search = root?.querySelector('#craftPlannerSearch');
    if (!grid || !catalog) return;
    const term = String(search?.value || '').trim().toLocaleLowerCase('tr-TR');
    const current = root.querySelector('#craftPlannerItem')?.value;
    const matches = sortedItems().filter((item) => `${catalog.label(item)} ${item.id} ${catalog.category(item)}`.toLocaleLowerCase('tr-TR').includes(term));
    grid.innerHTML = matches.map((item) => {
      const label = catalog.label(item);
      const selectedClass = item.id === current ? ' is-selected' : '';
      const src = window.ItemCard?.image?.(catalog.buildId(item.id, 6, 0), 1) || catalog.iconUrl(catalog.buildId(item.id, 6, 0));
      return `<button type="button" class="planner-picker-item${selectedClass}" data-item-id="${esc(item.id)}" role="option" aria-selected="${item.id === current}"><img src="${esc(src)}" data-item-id="${esc(catalog.buildId(item.id, 6, 0))}" alt="${esc(label)}" loading="lazy" data-image-fallback="item"><span><strong>${esc(label)}</strong><small>${esc(item.id)}</small></span></button>`;
    }).join('') || `<div class="planner-picker-empty">${esc(t('crafting-plannerNoItems', 'Aramanızla eşleşen eşya yok.'))}</div>`;
    if (count) count.textContent = `${matches.length} / ${catalog.items.length} ${t('crafting-plannerItems', 'eşya')}`;
    grid.querySelectorAll('[data-item-id]').forEach((button) => button.addEventListener('click', () => {
      root.querySelector('#craftPlannerItem').value = button.dataset.itemId;
      setPickerOpen(false);
      renderPicker();
      renderPickerButton();
      renderPreview();
    }));
  }

  function renderPickerButton() {
    const selection = selected();
    if (!selection) return;
    const icon = root.querySelector('#craftPlannerPickerIcon');
    const label = root.querySelector('#craftPlannerPickerLabel');
    icon.src = window.ItemCard.image(selection.id, 1);
    icon.alt = selection.label;
    icon.dataset.itemId = selection.id;
    icon.addEventListener('error', () => window.ItemCard.handleError(icon), { once: true });
    label.textContent = selection.label;
  }

  function renderPreview() {
    const selection = selected();
    const target = root?.querySelector('#craftPlannerPreview');
    if (!target || !selection) return;
    target.innerHTML = window.ItemCard?.card?.(selection.id, { compact: true, quality: selection.quality, meta: `${t('crafting-plannerOutput', 'Canlı çıkış eşyası')} · T${selection.tier}.${selection.enchant} · ${qualityLabel(selection.quality)}` }) || '';
  }

  function bind() {
    root.querySelector('#craftPlannerPickerButton')?.addEventListener('click', () => setPickerOpen(!pickerOpen));
    root.querySelector('#craftPlannerSearch')?.addEventListener('input', renderPicker);
    root.querySelector('#craftPlannerItem')?.addEventListener('change', () => { renderPickerButton(); renderPicker(); renderPreview(); });
    ['craftPlannerTier', 'craftPlannerEnchant', 'craftPlannerQuality'].forEach((id) => root.querySelector(`#${id}`)?.addEventListener('change', () => { renderPickerButton(); renderPreview(); }));
    root.querySelector('#craftPlannerAnalyze')?.addEventListener('click', analyze);
    document.addEventListener('click', (event) => { if (pickerOpen && root && !root.querySelector('#craftPlannerPicker')?.contains(event.target)) setPickerOpen(false); });
  }

  async function analyze() {
    const result = root?.querySelector('#craftPlannerResult');
    const selection = selected();
    const cost = Math.max(0, Number(root.querySelector('#craftPlannerCost')?.value) || 0);
    const qty = Math.max(1, Number(root.querySelector('#craftPlannerQty')?.value) || 1);
    if (!result || !selection || !window.MarketFavorites?.analyze) return;
    result.innerHTML = `<span class="planner-loading"><i class="fa-solid fa-spinner fa-spin"></i> ${t('crafting-plannerLoading', 'Gerçek satış fiyatı çekiliyor…')}</span>`;
    try {
      const row = await window.MarketFavorites.analyze({ id: selection.id, label: selectionLabel(selection), quality: selection.quality, city: 'ALL', minProfit: 0 });
      if (!row.sellPrice) throw new Error('no-price');
      const tax = Math.max(0, Number(window.MarketProfile?.sellTax ?? 6.5)) / 100;
      const netUnit = Math.floor(row.sellPrice * (1 - tax) - cost);
      const total = netUnit * qty;
      result.innerHTML = `<div class="planner-metric"><span>${t('crafting-plannerSale', 'En iyi satış')}</span><strong>${Number(row.sellPrice).toLocaleString('tr-TR')} 🥈</strong><small>${esc(row.target)} · ${esc(row.age || '')}</small></div><div class="planner-metric"><span>${t('crafting-plannerNetUnit', 'Birim net sonuç')}</span><strong class="${netUnit >= 0 ? 'positive' : 'negative'}">${netUnit >= 0 ? '+' : ''}${netUnit.toLocaleString('tr-TR')} 🥈</strong><small>${t('crafting-plannerAfterTax', 'Satış vergisi sonrası')}</small></div><div class="planner-metric"><span>${t('crafting-plannerTotal', 'Toplam sonuç')}</span><strong class="${total >= 0 ? 'positive' : 'negative'}">${total >= 0 ? '+' : ''}${total.toLocaleString('tr-TR')} 🥈</strong><small>${qty} ${t('ledger-units', 'adet')}</small></div>`;
    } catch (error) {
      result.innerHTML = `<span class="planner-error">${t('crafting-plannerNoPrice', 'Bu eşya ve kalite için taze satış fiyatı bulunamadı.')}</span>`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const tryMount = () => mount() || setTimeout(tryMount, 120);
    tryMount();
  });
})();
