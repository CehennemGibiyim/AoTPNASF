/* Legacy catalog bridge for older feature modules. Managed i18n remains the primary resolver. */
(function () {
  const applyAttributes = (translations) => {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = translations[element.getAttribute('data-i18n')];
      if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const value = translations[element.getAttribute('data-i18n-placeholder')];
      if (value) element.placeholder = value;
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const value = translations[element.getAttribute('data-i18n-title')];
      if (value) element.title = value;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const value = translations[element.getAttribute('data-i18n-aria-label')];
      if (value) element.setAttribute('aria-label', value);
    });
  };

  async function applyI18nAuto(locale = 'en') {
    const candidates = [locale, locale.split('-')[0], 'en'];
    for (const code of [...new Set(candidates)]) {
      try {
        const response = await fetch(`./locales/${code}.json`);
        if (!response.ok) continue;
        const translations = await response.json();
        window.__translations = translations;
        window.__currentLang = code;
        applyAttributes(translations);
        window.dispatchEvent(new CustomEvent('legacy_i18n_updated', { detail: { locale: code } }));
        return translations;
      } catch (error) {}
    }
    return null;
  }

  window.applyI18n = applyI18nAuto;
  window.applyI18nAuto = applyI18nAuto;
})();
