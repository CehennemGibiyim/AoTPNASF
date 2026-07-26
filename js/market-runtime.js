/* Lightweight market data runtime: freshness, queue, cache and safe request handling. */
(function () {
  const MIN_AGE_SECONDS = 1;
  const MAX_AGE_SECONDS = 3 * 60 * 60;
  const CACHE_TTL_MS = 30 * 1000;
  const MAX_CACHE_ENTRIES = 60;
  const MAX_CONCURRENT = 4;
  const cache = new Map();
  const pending = new Map();
  const queue = [];
  let active = 0;

  function timestampValue(value) {
    if (!value || String(value).startsWith('0001')) return 0;
    const raw = String(value);
    const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(raw) ? raw : `${raw}Z`;
    const time = Date.parse(normalized);
    return Number.isFinite(time) ? time : 0;
  }

  function ageSeconds(value) {
    const time = timestampValue(value);
    return time ? Math.max(0, (Date.now() - time) / 1000) : Infinity;
  }

  function isFresh(value) {
    const age = ageSeconds(value);
    return age >= MIN_AGE_SECONDS && age <= MAX_AGE_SECONDS;
  }

  function sanitizeRows(rows) {
    if (!Array.isArray(rows)) return rows;
    return rows.map((row) => {
      const item = { ...row };
      const prices = [
        ['sell_price_min', 'sell_price_min_date'],
        ['sell_price_max', 'sell_price_max_date'],
        ['buy_price_min', 'buy_price_min_date'],
        ['buy_price_max', 'buy_price_max_date']
      ];
      prices.forEach(([priceKey, dateKey]) => {
        if (Number(item[priceKey]) > 0 && !isFresh(item[dateKey])) item[priceKey] = 0;
      });
      return item;
    });
  }

  function isMarketUrl(url) {
    return /\/stats\/prices\//.test(url) || /\/stats\/gold/.test(url);
  }

  function cacheSet(key, value) {
    cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
    while (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
  }

  function cacheGet(key) {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (entry.expires < Date.now()) {
      cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  function runNext() {
    while (active < MAX_CONCURRENT && queue.length) {
      const job = queue.shift();
      active += 1;
      window.dispatchEvent(new CustomEvent('market_request_start', { detail: { url: job.url, active } }));
      job.run().then(job.resolve, job.reject).finally(() => {
        active -= 1;
        window.dispatchEvent(new CustomEvent('market_request_end', { detail: { url: job.url, active, queued: queue.length } }));
        runNext();
      });
    }
  }

  function enqueue(url, loader) {
    return new Promise((resolve, reject) => {
      queue.push({ url, run: loader, resolve, reject });
      runNext();
    });
  }

  const originalFetch = window.fetchWithProxies;
  async function queuedFetch(targetUrl) {
    const cached = cacheGet(targetUrl);
    if (cached !== undefined) return isMarketUrl(targetUrl) ? sanitizeRows(cached) : cached;
    if (pending.has(targetUrl)) return pending.get(targetUrl);

    const request = enqueue(targetUrl, async () => {
      const data = await originalFetch(targetUrl);
      if (data !== null && data !== undefined) cacheSet(targetUrl, data);
      return isMarketUrl(targetUrl) ? sanitizeRows(data) : data;
    });
    pending.set(targetUrl, request);
    try {
      return await request;
    } finally {
      pending.delete(targetUrl);
    }
  }

  function translate(key, fallback) {
    const managed = window.miniappI18n?.t?.(key);
    if (managed && managed !== key) return managed;
    const legacy = window.__translations?.[key];
    if (legacy) return legacy;
    const value = window.t?.(key, fallback);
    return value && value !== key && !String(value).startsWith('[') ? value : fallback;
  }

  function ageLabel(value) {
    const seconds = ageSeconds(value);
    if (!Number.isFinite(seconds)) return translate('market-ageUnknown', 'Veri yaşı bilinmiyor');
    if (seconds < 60) return `${Math.max(1, Math.floor(seconds))} ${translate('market-ageSeconds', 'sn önce')}`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${translate('market-ageMinutes', 'dk önce')}`;
    return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk ${translate('market-ageHours', 'önce')}`;
  }

  window.fetchWithProxies = queuedFetch;
  window.MarketRuntime = {
    MIN_AGE_SECONDS,
    MAX_AGE_SECONDS,
    MAX_CONCURRENT,
    ageSeconds,
    ageLabel,
    isFresh,
    sanitizeRows,
    fetch: queuedFetch,
    clearCache: () => cache.clear(),
    stats: () => ({ active, queued: queue.length, cached: cache.size })
  };
})();
