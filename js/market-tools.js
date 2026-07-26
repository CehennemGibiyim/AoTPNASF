/* Small market-center controls: client-side filtering and sorting for fetched opportunities. */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;
  let applying = false;
  let lastStructure = '';

  function structure(list) {
    return Array.from(list.children).map((row) => row.textContent).join('|');
  }

  function textValue(row) {
    return row.textContent.toLocaleLowerCase('tr-TR');
  }

  function numberFrom(row, selector) {
    const value = row.querySelector(selector)?.textContent || '';
    return Number(value.replace(/[^0-9-]/g, '')) || 0;
  }

  function ageValue(row) {
    const value = row.querySelector('span')?.textContent || '';
    const match = value.match(/(\d+(?:\.\d+)?)\s*(sn|s|dk|m|sa|h|g|d)/i);
    if (!match) return Number.MAX_SAFE_INTEGER;
    const amount = Number(match[1]);
    const unit = match[2].toLocaleLowerCase('tr-TR');
    if (unit === 'sn' || unit === 's') return amount / 60;
    if (unit === 'sa' || unit === 'h') return amount * 60;
    if (unit === 'g' || unit === 'd') return amount * 1440;
    return amount;
  }

  function apply(list, input, sort) {
    const query = input.value.trim().toLocaleLowerCase('tr-TR');
    const rows = Array.from(list.querySelectorAll('.market-opportunity'));
    rows.forEach((row) => {
      row.hidden = Boolean(query) && !textValue(row).includes(query);
    });
    const visible = rows.filter((row) => !row.hidden);
    visible.sort((a, b) => {
      if (sort.value === 'confidence') return numberFrom(b, 'em') - numberFrom(a, 'em');
      if (sort.value === 'freshness') return ageValue(a) - ageValue(b);
      return numberFrom(b, 'b') - numberFrom(a, 'b');
    });
    applying = true;
    visible.forEach((row) => list.appendChild(row));
    lastStructure = structure(list);
    applying = false;
  }

  function mount() {
    const modal = document.getElementById('marketCenterModal');
    const toolbar = modal?.querySelector('[data-center-panel="opportunities"] .market-center-toolbar');
    const list = modal?.querySelector('#marketOpportunityList');
    if (!toolbar || !list || toolbar.querySelector('.market-filter-row')) return Boolean(toolbar);

    const row = document.createElement('div');
    row.className = 'market-filter-row';
    row.innerHTML = '<input type="search" class="market-filter-input"><label class="market-sort-control"><span></span><select><option value="profit"></option><option value="confidence"></option><option value="freshness"></option></select></label>';
    const input = row.querySelector('input');
    const label = row.querySelector('span');
    const sort = row.querySelector('select');
    input.placeholder = t('market-filterPlaceholder', 'Eşya veya şehir ara');
    input.setAttribute('aria-label', t('market-filterPlaceholder', 'Eşya veya şehir ara'));
    label.textContent = t('market-sortLabel', 'Sıralama');
    sort.setAttribute('aria-label', t('market-sortLabel', 'Sıralama'));
    sort.options[0].textContent = t('market-sortProfit', 'En yüksek kâr');
    sort.options[1].textContent = t('market-sortConfidence', 'En yüksek güven');
    sort.options[2].textContent = t('market-sortFreshness', 'En yeni veri');
    toolbar.appendChild(row);

    const update = () => apply(list, input, sort);
    input.addEventListener('input', update);
    sort.addEventListener('change', update);
    const observer = new MutationObserver(() => {
      if (applying) return;
      const query = input.value.trim().toLocaleLowerCase('tr-TR');
      const needsFilter = Array.from(list.querySelectorAll('.market-opportunity')).some((item) => item.hidden !== (Boolean(query) && !textValue(item).includes(query)));
      if (structure(list) !== lastStructure || needsFilter) update();
    });
    observer.observe(list, { childList: true });
    return true;
  }

  function init() {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (mount() || attempts > 30) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('market_favorites_ready', mount);
})();
