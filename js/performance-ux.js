/* Small cross-surface UX improvements that keep the app calm and cheap to run. */
(function () {
  const t = (key, fallback) => {
    const managed = window.miniappI18n?.t?.(key);
    if (managed && managed !== key) return managed;
    const legacy = window.__translations?.[key];
    if (legacy) return legacy;
    const value = window.t?.(key, fallback);
    return value && value !== key && !String(value).startsWith('[') ? value : fallback;
  };
  function updateRuntimeStatus() {
    const el = document.getElementById('marketRuntimeStatus');
    const stats = window.MarketRuntime?.stats();
    if (el && stats) el.textContent = `${t('market-queue', 'Kuyruk')} ${stats.active}/${window.MarketRuntime.MAX_CONCURRENT} · ${t('market-cache', 'önbellek')} ${stats.cached}`;
  }
  function markLazyImages(root = document) {
    root.querySelectorAll('img').forEach((img) => {
      if (!img.loading) img.loading = 'lazy';
      if (!img.decoding) img.decoding = 'async';
      if (!img.dataset.safeFallback) {
        img.dataset.safeFallback = '1';
        img.addEventListener('error', () => { img.classList.add('image-unavailable'); }, { once: true });
      }
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    markLazyImages();
    const observer = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => { if (node.nodeType === 1) markLazyImages(node); })));
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('market_request_start', updateRuntimeStatus);
    window.addEventListener('market_request_end', updateRuntimeStatus);
    window.addEventListener('app_settings_updated', updateRuntimeStatus);
    document.querySelectorAll('.tab-btn').forEach((button) => button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.tab);
      if (target) { target.dataset.visited = 'true'; target.setAttribute('aria-busy', 'false'); }
    }));
    updateRuntimeStatus();
  });
})();
