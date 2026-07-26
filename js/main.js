/* Application bootstrap: settings, theme, navigation and shared API helpers. */
(function () {
  const managedTranslate = (key) => {
    try {
      const value = window.miniappI18n?.t?.(key);
      return value && value !== key ? value : '';
    } catch (error) {
      return '';
    }
  };

  window.t = function translate(key, fallback = key) {
    return managedTranslate(key) || window.__translations?.[key] || fallback;
  };

  window.AppConfig = {
    server: 'europe',
    theme: 'custom',
    scale: '10px',
    customColors: { bg: '#0a0a0a', accent: '#d4af37', text: '#f5f5f5' }
  };

  // Tüm proje dosyalarının manifest listesi
  window.manifestFiles = [
    '.github/workflows/deploy.yml',
    '.gitignore',
    'README.md',
    'index.html',
    'styles.css',
    'manifest.json',
    'sw.js',
    'js/main.js',
    'js/market-runtime.js',
    'js/i18n-helper.js',
    'js/i18n-legacy.js',
    'js/event.js',
    'js/event-market-bridge.js',
    'js/bestiary-data.js',
    'js/creature-art.js',
    'js/bestiary.js',
    'js/crafting.js',
    'js/crafting-planner.js',
    'js/pvp.js',
    'js/avalon.js',
    'js/gathering.js',
    'js/loot.js',
    'js/arbitrage-filters.js',
    'js/arbitrage.js',
    'js/ai-builds.js',
    'js/market-items.js',
    'js/item-card.js',
    'js/favorites.js',
    'js/market-dock.js',
    'js/item-inspector.js',
    'js/market-alerts.js',
    'js/favorite-actions.js',
    'js/performance-ux.js',
    'js/market-live.js',
    'js/market-center.js',
    'js/market-tools.js',
    'js/home-dashboard.js',
    'js/global-item-search.js',
    'js/economy-profile.js',
    'js/economy-planner.js',
    'js/operations-data.js',
    'js/operations-intelligence-data.js',
    'js/operations-market.js',
    'js/operations-center.js',
    'js/operations-spawn.js',
    'js/operations-bestiary.js',
    'js/operations-combat.js',
    'js/operations-profit.js',
    'js/operations-risk.js',
    'js/operations-build.js',
    'js/operations-planning.js',
    'js/operations-gathering.js',
    'js/operations-reference.js',
    'js/operations-pvp.js',
    'js/operations-intelligence.js',
    'js/operations-records.js',
    'js/ui/toast-notifications.js',
    'js/ui/voice-assistant.js',
    'js/ui/navigation-polish.js',
    'js/ui/data-viz.js',
    'js/ui/social-features.js',
    'js/ui/tax-calculator.js',
    'js/ui/achievements.js',
    'js/ui/discord-bridge.js',
    'js/ui/theme-store.js',
    'js/ui/ai-strategy-coach.js',
    'js/ui/market-simulator.js',
    'js/ui/loot-simulator.js',
    'js/ui/crafting-rng.js',
    'js/ui/transport-risk.js',
    'js/ui/fame-calculator.js',
    'js/ui/killboard.js',
    'js/ui/mini-games.js',
    'js/ui/build-simulator.js',
    'js/ui/interactive-map.js',
    'js/ui/guild-operations.js',
    'js/core/api.js',
    'js/core/auth.js',
    'js/core/combat-mechanics.js',
    'js/core/dashboard.js',
    'js/core/data-pipeline.js',
    'js/core/storage.js',
    'js/ai/search.js',
    'js/ai/weapon-db.js',
    'js/market-live.css',
    'js/market-tools.css',
    'js/app-surfaces.css',
    'js/operations-center.css',
    'js/operations-enhanced.css',
    'js/operations-timeline.css',
    'js/creature-art.css',
    'js/core/dashboard.css',
    'js/ui/build-simulator.css',
    'js/ui/interactive-map.css',
    'locales/tr.json',
    'locales/en.json',
    'locales/de.json',
    'locales/es.json',
    'locales/ru.json',
    'miniapp.i18n.json'
  ];

  function adjustColorHex(color, amount) {
    const source = String(color || '').replace('#', '');
    const number = Number.parseInt(source, 16);
    if (!Number.isFinite(number)) return '#000000';
    const channel = (shift) => Math.max(0, Math.min(255, (number >> shift & 255) + amount));
    return `#${((channel(16) << 16) | (channel(8) << 8) | channel(0)).toString(16).padStart(6, '0')}`;
  }

  window.applyGlobalTheme = function applyGlobalTheme(themeName, colors) {
    if (themeName !== 'custom' || !colors) return;
    const root = document.documentElement;
    root.dataset.theme = 'custom';
    root.style.setProperty('--bg-900', colors.bg);
    root.style.setProperty('--bg-800', adjustColorHex(colors.bg, 15));
    root.style.setProperty('--bg-700', adjustColorHex(colors.bg, 30));
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-hover', adjustColorHex(colors.accent, -20));
    root.style.setProperty('--text-main', colors.text);
    root.style.setProperty('--text-muted', adjustColorHex(colors.text, -50));
  };

  window.getAlbionApiDomain = function getAlbionApiDomain() {
    return ({
      europe: 'europe.albion-online-data.com',
      asia: 'east.albion-online-data.com',
      americas: 'www.albion-online-data.com'
    }[window.AppConfig.server] || 'europe.albion-online-data.com');
  };

  async function fetchWithProxies(targetUrl) {
    const urls = [
      targetUrl,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    ];
    for (const url of urls) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
        if (!response.ok) continue;
        const data = await response.json();
        if (data !== null && data !== undefined && (!Array.isArray(data) || data.length)) return data;
      } catch (error) {
        // Try the next gateway without exposing gateway details to users.
      } finally {
        clearTimeout(timer);
      }
    }
    return null;
  }
  window.fetchWithProxies = fetchWithProxies;

  function initUpdateCountdown() {
    const element = document.getElementById('updateCountdown');
    if (!element || element.dataset.bound) return;
    element.dataset.bound = 'true';
    const update = () => {
      const now = new Date();
      const target = new Date(now);
      target.setUTCHours(24, 0, 0, 0);
      const distance = Math.max(0, target - now);
      const hours = String(Math.floor(distance / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor(distance % 3600000 / 60000)).padStart(2, '0');
      const seconds = String(Math.floor(distance % 60000 / 1000)).padStart(2, '0');
      element.textContent = `${hours}:${minutes}:${seconds}`;
    };
    update();
    setInterval(update, 1000);
  }

  async function readSettings() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem('aot_pnasf_settings', { area: 'persistent' });
      if (!raw) return;
      const saved = JSON.parse(raw);
      window.AppConfig.server = saved.server || window.AppConfig.server;
      window.AppConfig.scale = saved.scale || window.AppConfig.scale;
      window.AppConfig.customColors = { ...window.AppConfig.customColors, ...(saved.customColors || {}) };
    } catch (error) {
      console.warn('Settings could not be restored.', error);
    }
  }

  async function saveSettings() {
    try {
      await window.miniappsAI?.storage?.setItem('aot_pnasf_settings', JSON.stringify(window.AppConfig), { area: 'persistent' });
    } catch (error) {
      console.warn('Settings could not be saved.', error);
    }
  }

  function closeModal(modal) {
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
  }

  function openModal(modal) {
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  async function initBootstrap() {
    await readSettings();
    const root = document.documentElement;
    const serverBadge = document.getElementById('globalServerBadge');
    const modal = document.getElementById('settingsModal');
    const saveButton = document.getElementById('settingsSave');
    const closeButtons = document.querySelectorAll('#settingsClose');
    const serverInput = document.getElementById('settingsServer');
    const serverButtons = document.querySelectorAll('.server-btn');
    const languageSelect = document.getElementById('settingsLang');
    const languageBadge = document.getElementById('currentLangDisplay');
    const scaleSelect = document.getElementById('settingsScale');
    const colorInputs = {
      bg: document.getElementById('pickerBg'),
      accent: document.getElementById('pickerAccent'),
      text: document.getElementById('pickerText')
    };
    const preview = {
      box: document.getElementById('miniPreview'),
      title: document.getElementById('miniPreviewTitle'),
      text: document.getElementById('miniPreviewText'),
      button: document.getElementById('miniPreviewBtn')
    };
    const themeButton = document.getElementById('aiThemeBtn');
    const themePrompt = document.getElementById('aiThemePrompt');
    const themeLoading = document.getElementById('aiThemeLoading');
    let currentLocale = window.miniappI18n?.getContext?.()?.resolvedLocale || 'en';

    applyGlobalTheme(window.AppConfig.theme, window.AppConfig.customColors);
    root.style.fontSize = window.AppConfig.scale;
    if (serverBadge) serverBadge.textContent = window.AppConfig.server.toUpperCase();
    if (window.applyI18nAuto) await window.applyI18nAuto(currentLocale);
    window.dispatchEvent(new CustomEvent('app_settings_loaded', { detail: { server: window.AppConfig.server } }));
    initUpdateCountdown();

    const requestedLanguages = [
      ['en', 'English'], ['tr', 'Türkçe'], ['de', 'Deutsch'], ['fr', 'Français'],
      ['es', 'Español'], ['pt', 'Português'], ['ru', 'Русский'], ['pl', 'Polski'],
      ['zh', '中文'], ['it', 'Italiano']
    ];
    if (languageSelect) {
      const available = window.miniappI18n?.getContext?.()?.availableLocales;
      const languages = (Array.isArray(available) && available.length > 1)
        ? requestedLanguages.filter(([code]) => available.includes(code))
        : requestedLanguages;
      languageSelect.innerHTML = languages.map(([code, name]) => `<option value="${code}">${code.toUpperCase()} - ${name}</option>`).join('');
      languageSelect.value = languages.some(([code]) => code === currentLocale) ? currentLocale : 'en';
    }

    function updateServerButtons(value) {
      const server = value || 'europe';
      if (serverInput) serverInput.value = server;
      serverButtons.forEach((button) => {
        const active = button.dataset.val === server;
        button.classList.toggle('bg-albion-accent', active);
        button.classList.toggle('text-white', active);
        button.classList.toggle('border-albion-accent', active);
        button.classList.toggle('bg-albion-900', !active);
        button.classList.toggle('text-gray-300', !active);
        button.classList.toggle('border-gray-700', !active);
      });
    }

    function updatePreview() {
      if (!preview.box || !colorInputs.bg || !colorInputs.accent || !colorInputs.text) return;
      const { bg, accent, text } = { bg: colorInputs.bg.value, accent: colorInputs.accent.value, text: colorInputs.text.value };
      preview.box.style.backgroundColor = bg;
      preview.box.style.borderColor = accent;
      if (preview.title) preview.title.style.color = accent;
      if (preview.text) preview.text.style.color = text;
      if (preview.button) {
        preview.button.style.backgroundColor = accent;
        preview.button.style.color = bg;
      }
    }

    function syncSettingsForm() {
      updateServerButtons(window.AppConfig.server);
      if (languageSelect) languageSelect.value = currentLocale;
      if (scaleSelect) scaleSelect.value = window.AppConfig.scale;
      Object.entries(colorInputs).forEach(([key, input]) => {
        if (input) input.value = window.AppConfig.customColors[key];
      });
      updatePreview();
    }

    serverButtons.forEach((button) => button.addEventListener('click', () => updateServerButtons(button.dataset.val)));
    Object.values(colorInputs).forEach((input) => input?.addEventListener('input', updatePreview));
    document.getElementById('settingsBtn')?.addEventListener('click', () => { syncSettingsForm(); openModal(modal); });
    closeButtons.forEach((button) => button.addEventListener('click', () => closeModal(modal)));
    modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(modal); });

    themeButton?.addEventListener('click', async () => {
      const prompt = themePrompt?.value.trim() || 'Albion Online için şık, koyu bir renk paleti üret.';
      if (themeLoading) {
        themeLoading.classList.remove('hidden');
        themeLoading.textContent = 'Yapay zeka renkleri analiz ediyor…';
      }
      themeButton.disabled = true;
      try {
        const result = await window.miniappsAI.callModel({
          modelId: 'ba695aee-f2ec-497f-9335-1c796cb0c30d',
          messages: [
            { role: 'system', content: 'Return exactly three distinct HEX colors: background, accent, text. No explanation.' },
            { role: 'user', content: prompt }
          ],
          timeoutMs: 30000
        });
        const matches = (window.miniappsAI.extractText(result).match(/#[0-9a-f]{3,6}/gi) || []);
        if (matches.length < 3) throw new Error('invalid palette');
        ['bg', 'accent', 'text'].forEach((key, index) => { if (colorInputs[key]) colorInputs[key].value = matches[index]; });
        updatePreview();
      } catch (error) {
        if (themeLoading) themeLoading.textContent = 'Renk paleti oluşturulamadı. Tekrar deneyin.';
      } finally {
        themeButton.disabled = false;
        if (themeLoading) setTimeout(() => themeLoading.classList.add('hidden'), 1800);
      }
    });

    async function applySelectedLocale() {
      const selected = languageSelect?.value || currentLocale;
      if (selected === currentLocale) return;
      currentLocale = selected;
      try {
        if (window.miniappI18n?.setLocale) await window.miniappI18n.setLocale(selected);
      } catch (error) {}
      if (window.applyI18nAuto) await window.applyI18nAuto(selected);
      syncSidebarLabels();
      if (languageBadge) languageBadge.textContent = selected.split('-')[0].toUpperCase();
    }
    languageSelect?.addEventListener('change', applySelectedLocale);

    saveButton?.addEventListener('click', async () => {
      saveButton.disabled = true;
      try {
        await applySelectedLocale();
        window.AppConfig.server = serverInput?.value || 'europe';
        window.AppConfig.scale = scaleSelect?.value || '12px';
        window.AppConfig.customColors = {
          bg: colorInputs.bg?.value || '#0a0a0a',
          accent: colorInputs.accent?.value || '#d4af37',
          text: colorInputs.text?.value || '#f5f5f5'
        };
        applyGlobalTheme(window.AppConfig.theme, window.AppConfig.customColors);
        root.style.fontSize = window.AppConfig.scale;
        if (serverBadge) serverBadge.textContent = window.AppConfig.server.toUpperCase();
        await saveSettings();
        window.MarketRuntime?.clearCache?.();
        window.dispatchEvent(new CustomEvent('app_settings_updated', { detail: { server: window.AppConfig.server } }));
        closeModal(modal);
      } finally {
        saveButton.disabled = false;
      }
    });

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    function syncSidebarLabels() {
      tabButtons.forEach((button) => {
        const label = button.querySelector('span')?.textContent?.trim() || 'Bölüm';
        button.dataset.tooltip = label;
        button.title = label;
        button.setAttribute('aria-label', label);
      });
    }
    syncSidebarLabels();
    tabButtons.forEach((button) => button.addEventListener('click', () => {
      tabButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('border-albion-accent', active);
        item.classList.toggle('text-albion-accent', active);
        item.classList.toggle('border-transparent', !active);
        item.classList.toggle('text-gray-400', !active);
      });
      tabContents.forEach((content) => {
        const active = content.id === button.dataset.tab;
        content.classList.toggle('hidden', !active);
        content.classList.toggle('flex', active);
        if (active) content.classList.add('animate-fade-in');
      });
      // Lazy-load social page on first visit
      if (button.dataset.tab === 'tab-social' && window.AlbionSocial && !window._socialLoaded) {
        window._socialLoaded = true;
        window.AlbionSocial.renderSocialPage(document.getElementById('socialApp'));
      }
      // Lazy-load strategy coach
      if (button.dataset.tab === 'tab-strategy' && window.AIStrategyCoach && !window._strategyLoaded) {
        window._strategyLoaded = true;
        window.AIStrategyCoach.render(document.getElementById('strategyApp'));
      }
      // Lazy-load achievements
      if (button.dataset.tab === 'tab-achievements' && window.Achievements && !window._achLoaded) {
        window._achLoaded = true;
        window.Achievements.render(document.getElementById('achievementsApp'));
      }
      // Lazy-load theme store
      if (button.dataset.tab === 'tab-themes' && window.ThemeStore && !window._themesLoaded) {
        window._themesLoaded = true;
        window.ThemeStore.render(document.getElementById('themesApp'));
      }
      // Lazy-load discord bridge
      if (button.dataset.tab === 'tab-discord' && window.DiscordBridge && !window._discordLoaded) {
        window._discordLoaded = true;
        window.DiscordBridge.render(document.getElementById('discordApp'));
      }
      // Lazy-load tax calculator
      if (button.dataset.tab === 'tab-tax' && window.TaxCalculator && !window._taxLoaded) {
        window._taxLoaded = true;
        window.TaxCalculator.render(document.getElementById('taxApp'));
      }
      // Lazy-load market ticker
      if (button.dataset.tab === 'tab-ticker' && window.MarketSimulator && !window._tickerLoaded) {
        window._tickerLoaded = true;
        window.MarketSimulator.render(document.getElementById('tickerApp'));
      }
      // Lazy-load build simulator
      if (button.dataset.tab === 'tab-build-lab' && window.BuildSimulator && !window._buildLabLoaded) {
        window._buildLabLoaded = true;
        window.BuildSimulator.render(document.getElementById('buildLabApp'));
      }
      // Lazy-load interactive map
      if (button.dataset.tab === 'tab-interactive-map' && window.InteractiveMap && !window._mapLoaded) {
        window._mapLoaded = true;
        window.InteractiveMap.render(document.getElementById('interactiveMapApp'));
      }
      // Lazy-load guild operations
      if (button.dataset.tab === 'tab-guild-operations' && window.GuildOperations && !window._guildLoaded) {
        window._guildLoaded = true;
        window.GuildOperations.render(document.getElementById('guildOperationsApp'));
      }
      // Lazy-load loot simulator
      if (button.dataset.tab === 'tab-loot-sim' && window.LootSimulator && !window._lootSimLoaded) {
        window._lootSimLoaded = true;
        window.LootSimulator.render(document.getElementById('lootSimApp'));
      }
      // Lazy-load crafting RNG
      if (button.dataset.tab === 'tab-craft-rng' && window.CraftingRNG && !window._craftRngLoaded) {
        window._craftRngLoaded = true;
        window.CraftingRNG.render(document.getElementById('craftRngApp'));
      }
      // Lazy-load transport risk
      if (button.dataset.tab === 'tab-transport-risk' && window.TransportRisk && !window._transportLoaded) {
        window._transportLoaded = true;
        window.TransportRisk.render(document.getElementById('transportRiskApp'));
      }
      // Lazy-load fame calculator
      if (button.dataset.tab === 'tab-fame-calc' && window.FameCalculator && !window._fameCalcLoaded) {
        window._fameCalcLoaded = true;
        window.FameCalculator.render(document.getElementById('fameCalcApp'));
      }
      // Lazy-load killboard
      if (button.dataset.tab === 'tab-killboard' && window.Killboard && !window._killboardLoaded) {
        window._killboardLoaded = true;
        window.Killboard.render(document.getElementById('killboardApp'));
      }
      // Lazy-load mini games
      if (button.dataset.tab === 'tab-mini-games' && window.MiniGames && !window._miniGamesLoaded) {
        window._miniGamesLoaded = true;
        window.MiniGames.render(document.getElementById('miniGamesApp'));
      }
      if (window.matchMedia('(max-width: 768px)').matches) {
        document.body.classList.remove('sidebar-expanded');
        document.getElementById('mobileMenuBtn')?.setAttribute('aria-expanded', 'false');
      }
    }));

    const mobileMenu = document.getElementById('mobileMenuBtn');
    mobileMenu?.setAttribute('aria-expanded', 'false');
    mobileMenu?.addEventListener('click', () => {
      const expanded = document.body.classList.toggle('sidebar-expanded');
      mobileMenu.setAttribute('aria-expanded', String(expanded));
    });
    // Collapse sidebar when clicking outside the navigation on mobile.
    document.addEventListener('click', (event) => {
      if (!document.body.classList.contains('sidebar-expanded')) return;
      if (event.target.closest('#navMenu, #mobileMenuBtn')) return;
      if (window.matchMedia('(max-width: 768px)').matches) {
        document.body.classList.remove('sidebar-expanded');
        mobileMenu?.setAttribute('aria-expanded', 'false');
      }
    });
    document.getElementById('brandLogo')?.addEventListener('click', () => document.querySelector('[data-tab="tab-home"]')?.click());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootstrap);
  } else {
    initBootstrap();
  }
})();