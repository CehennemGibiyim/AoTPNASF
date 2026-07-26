/* Persistent watchlist, recent searches and market alert state. */
(function () {
  const STORAGE_KEY = 'aot_pnasf_market_watchlist';
  const RECENT_KEY = 'aot_pnasf_recent_searches';
  const ROYAL_CITIES = ['Lymhurst', 'Bridgewatch', 'Fort Sterling', 'Martlock', 'Thetford'];
  let favorites = [];
  let recent = [];
  const listeners = new Set();
  const t = (key, fallback) => {
    const managed = window.miniappI18n?.t?.(key);
    if (managed && managed !== key) return managed;
    const legacy = window.__translations?.[key];
    if (legacy) return legacy;
    const value = window.t?.(key, fallback);
    return value && value !== key && !String(value).startsWith('[') ? value : fallback;
  };

  async function read(key, fallback) {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(key, { area: 'persistent' });
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn('Market storage read failed', error);
      return fallback;
    }
  }

  async function write(key, value) {
    try {
      await window.miniappsAI?.storage?.setItem(key, JSON.stringify(value), { area: 'persistent' });
    } catch (error) {
      console.warn('Market storage write failed', error);
    }
  }

  function emit() { listeners.forEach((listener) => listener({ favorites, recent })); }

  function makeFavorite(input) {
    const id = String(input.id || '').trim().toUpperCase();
    if (!id) throw new Error(t('market-invalidItem', 'Geçerli bir eşya seçin.'));
    const rawQuality = input.quality;
    const quality = rawQuality === undefined || rawQuality === null || rawQuality === ''
      ? null
      : Math.min(5, Math.max(1, Number(rawQuality) || 1));
    return {
      id,
      label: input.label || id.replace(/^T\d+_/, '').replace(/@\d+$/, '').replace(/_/g, ' '),
      city: input.city || 'ALL',
      minProfit: Math.max(0, Number(input.minProfit) || 0),
      quality,
      alert: input.alert !== false,
      updatedAt: new Date().toISOString()
    };
  }

  async function addFavorite(input) {
    const favorite = makeFavorite(input);
    favorites = [favorite, ...favorites.filter((item) => item.id !== favorite.id)].slice(0, 25);
    await write(STORAGE_KEY, favorites);
    emit();
    return favorite;
  }

  async function removeFavorite(id) {
    favorites = favorites.filter((item) => item.id !== id);
    await write(STORAGE_KEY, favorites);
    emit();
  }

  async function addRecent(value) {
    const text = String(value || '').trim();
    if (!text) return;
    recent = [text, ...recent.filter((item) => item.toLowerCase() !== text.toLowerCase())].slice(0, 8);
    await write(RECENT_KEY, recent);
    emit();
  }

  async function checkFavorite(favorite) {
    const sourceCities = favorite.city === 'ALL' ? ROYAL_CITIES : [favorite.city];
    const targetCities = ['Caerleon', 'Black Market'];
    const locations = [...new Set([...sourceCities, ...targetCities])];
    const domain = window.getAlbionApiDomain?.() || 'europe.albion-online-data.com';
    const qualityQuery = favorite.quality ? `&qualities=${favorite.quality}` : '';
    const url = `https://${domain}/api/v2/stats/prices/${encodeURIComponent(favorite.id)}.json?locations=${encodeURIComponent(locations.join(','))}${qualityQuery}`;
    const rows = await window.MarketRuntime.fetch(url);
    if (!Array.isArray(rows)) return { ...favorite, status: 'error' };

    const sourceRows = rows.filter((row) => sourceCities.includes(row.city) && Number(row.sell_price_min) > 0);
    const targetRows = rows.filter((row) => targetCities.includes(row.city) && Number(row.buy_price_max) > 0);
    if (!sourceRows.length || !targetRows.length) return { ...favorite, status: 'empty' };
    const source = sourceRows.sort((a, b) => a.sell_price_min - b.sell_price_min)[0];
    const target = targetRows.sort((a, b) => b.buy_price_max - a.buy_price_max)[0];
    const capital = Math.max(0, Number(window.MarketProfile?.capital) || 0);
    if (capital > 0 && source.sell_price_min > capital) return { ...favorite, status: 'capital' };
    const sellTaxRaw = Number(window.MarketProfile?.sellTax);
    const buyTaxRaw = Number(window.MarketProfile?.buyTax);
    const sellTax = Math.max(0, Number.isFinite(sellTaxRaw) ? sellTaxRaw : 6.5) / 100;
    const buyTax = Math.max(0, Number.isFinite(buyTaxRaw) ? buyTaxRaw : 0) / 100;
    const profit = Math.floor(target.buy_price_max * (1 - sellTax) - source.sell_price_min * (1 + buyTax));
    return {
      ...favorite,
      status: profit >= favorite.minProfit ? 'hit' : 'watch',
      source: source.city,
      target: target.city,
      buyPrice: Number(source.sell_price_min),
      sellPrice: Number(target.buy_price_max),
      profit,
      age: window.MarketRuntime.ageLabel(target.buy_price_max_date || source.sell_price_min_date),
      checkedAt: Date.now()
    };
  }

  async function analyze(input) {
    return checkFavorite(makeFavorite(input));
  }

  async function checkAll() {
    const results = [];
    for (const favorite of favorites.filter((item) => item.alert)) {
      try { results.push(await checkFavorite(favorite)); } catch (error) { results.push({ ...favorite, status: 'error' }); }
    }
    return results;
  }

  window.MarketFavorites = {
    get favorites() { return favorites; },
    get recent() { return recent; },
    addFavorite,
    removeFavorite,
    addRecent,
    analyze,
    checkAll,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  };

  document.addEventListener('DOMContentLoaded', async () => {
    favorites = await read(STORAGE_KEY, []);
    recent = await read(RECENT_KEY, []);
    const manualButton = document.getElementById('btnManualSearch');
    const manualInput = document.getElementById('manualSearchInput');
    manualButton?.addEventListener('click', () => addRecent(manualInput?.value));
    manualInput?.addEventListener('keydown', (event) => { if (event.key === 'Enter') addRecent(manualInput.value); });
    emit();
    window.dispatchEvent(new Event('market_favorites_ready'));
  });
})();
