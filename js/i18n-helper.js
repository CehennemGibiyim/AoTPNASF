// Shared i18n helper for legacy modules and managed Miniapp i18n.
(function () {
  function translate(key, fallback) {
    try {
      const managed = window.miniappI18n?.t?.(key);
      if (managed && managed !== key) return managed;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (error) {}
    return fallback || key;
  }

  window._ = translate;
  window.t = translate;
  window.i18nHTML = function (htmlString) {
    const temp = document.createElement('div');
    temp.innerHTML = htmlString;
    temp.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const value = translate(key, '');
      if (value) element.textContent = value;
    });
    return temp.innerHTML;
  };

  // main.js historically replaced window.t at the end of its bootstrap handler.
  // Restore the real resolver before feature modules render their first view.
  document.addEventListener('DOMContentLoaded', () => {
    window._ = translate;
    window.t = translate;
  });

  console.log('✅ i18n Helper yüklendi');
})();
