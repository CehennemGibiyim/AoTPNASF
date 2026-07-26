/* Tema Mağazası: 10+ hazır tema, tema önizleme, favori temalar */
(function () {
  const t = (key, fallback) => window.t?.(key, fallback) || fallback;

  const STORAGE_KEY = 'aot_theme_prefs';

  const THEMES = [
    { id: 'obsidian-gold', name: 'Obsidian Gold', icon: 'fa-crown', desc: 'Klasik siyah-altın', bg: '#0a0a0a', accent: '#d4af37', text: '#f5f5f5', card: '#111827' },
    { id: 'emerald-night', name: 'Emerald Night', icon: 'fa-gem', desc: 'Zümrüt yeşili', bg: '#0a0f0c', accent: '#10b981', text: '#e2e8f0', card: '#0f1a14' },
    { id: 'ruby-dark', name: 'Ruby Dark', icon: 'fa-heart', desc: 'Yakut kırmızısı', bg: '#0f0a0a', accent: '#ef4444', text: '#f1f5f9', card: '#1a1010' },
    { id: 'sapphire-deep', name: 'Sapphire Deep', icon: 'fa-gem', desc: 'Safir mavisi', bg: '#0a0a14', accent: '#3b82f6', text: '#e2e8f0', card: '#0f0f1a' },
    { id: 'amethyst-void', name: 'Amethyst Void', icon: 'fa-moon', desc: 'Mor-siyah', bg: '#0d0a14', accent: '#a855f7', text: '#e2e8f0', card: '#150f1f' },
    { id: 'sunset-flame', name: 'Sunset Flame', icon: 'fa-fire', desc: 'Turuncu alev', bg: '#140f0a', accent: '#f97316', text: '#fef3c7', card: '#1f150a' },
    { id: 'arctic-frost', name: 'Arctic Frost', icon: 'fa-snowflake', desc: 'Buz mavisi', bg: '#0a1418', accent: '#06b6d4', text: '#ecfeff', card: '#0f1a1f' },
    { id: 'forest-moss', name: 'Forest Moss', icon: 'fa-leaf', desc: 'Orman yeşili', bg: '#0c140a', accent: '#84cc16', text: '#ecfccb', card: '#121f0a' },
    { id: 'rose-gold', name: 'Rose Gold', icon: 'fa-heart', desc: 'Pembe-altın', bg: '#140a0f', accent: '#f43f5e', text: '#ffe4e6', card: '#1f0f15' },
    { id: 'midnight-teal', name: 'Midnight Teal', icon: 'fa-water', desc: 'Gece mavisi', bg: '#0a1414', accent: '#14b8a6', text: '#ccfbf1', card: '#0f1a1a' },
    { id: 'cyber-neon', name: 'Cyber Neon', icon: 'fa-bolt', desc: 'Neon siberpunk', bg: '#0a0a0a', accent: '#00ff88', text: '#e0ffe0', card: '#0f1a0f' },
    { id: 'blood-moon', name: 'Blood Moon', icon: 'fa-skull', desc: 'Kızıl karanlık', bg: '#0f0808', accent: '#dc2626', text: '#fecaca', card: '#1a0a0a' },
  ];

  async function loadPrefs() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY, { area: 'persistent' });
      return raw ? JSON.parse(raw) : { active: 'obsidian-gold', favorites: [] };
    } catch (e) { return { active: 'obsidian-gold', favorites: [] }; }
  }

  async function savePrefs(prefs) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY, JSON.stringify(prefs), { area: 'persistent' });
    } catch (e) {}
  }

  function applyTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    root.style.setProperty('--bg-900', theme.bg);
    root.style.setProperty('--bg-800', theme.card);
    root.style.setProperty('--bg-700', theme.card);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', theme.accent + 'cc');
    root.style.setProperty('--text-main', theme.text);
    root.style.setProperty('--text-muted', theme.text + '88');
    
    window.AppConfig.customColors = { bg: theme.bg, accent: theme.accent, text: theme.text };
    
    window.AlbionToast?.show?.({
      title: '🎨 Tema Değişti!',
      message: theme.name + ' teması aktif edildi.',
      type: 'success',
      duration: 2500
    });
  }

  async function render(container) {
    if (!container) return;
    const prefs = await loadPrefs();

    container.innerHTML = `
      <div class="theme-store max-w-5xl mx-auto p-4 space-y-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <i class="fa-solid fa-palette text-white text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-black text-white">${t('theme-title', 'Tema Mağazası')}</h2>
            <p class="text-xs text-gray-400">${t('theme-desc', '12 özel tema arasından seç, favorilere ekle, AI ile özel tema üret')}</p>
          </div>
        </div>

        <!-- AI Tema Üreticisi -->
        <div class="bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-700/30 rounded-xl p-4">
          <h3 class="text-sm font-bold text-purple-400 flex items-center gap-2 mb-3">
            <i class="fa-solid fa-wand-magic-sparkles"></i> AI Tema Üreticisi
          </h3>
          <div class="flex gap-2">
            <input type="text" id="themeAiPrompt" placeholder="Örn: 'Uzay temalı mor ve mavi tonlar'" 
              class="flex-1 bg-albion-900 border border-gray-600 rounded-lg p-2.5 text-white text-sm">
            <button id="themeAiBtn" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shrink-0">
              <i class="fa-solid fa-robot mr-1.5"></i> Üret
            </button>
          </div>
          <div id="themeAiResult" class="hidden mt-3 flex gap-2 items-center">
            <div id="themeAiPreview" class="w-12 h-12 rounded-lg border-2"></div>
            <div class="flex-1">
              <div id="themeAiName" class="text-xs font-bold text-white"></div>
              <div class="flex gap-1.5 mt-1">
                <span id="themeAiBg" class="text-[9px] px-1.5 py-0.5 rounded bg-black/30"></span>
                <span id="themeAiAccent" class="text-[9px] px-1.5 py-0.5 rounded bg-black/30"></span>
              </div>
            </div>
            <button id="themeAiApply" class="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded text-xs font-bold">Uygula</button>
          </div>
        </div>

        <!-- Favori Temalar -->
        <div id="favSection" class="${prefs.favorites.length ? '' : 'hidden'}">
          <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
            <i class="fa-solid fa-star"></i> ${t('theme-favorites', 'Favori Temalar')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" id="favGrid">
            ${THEMES.filter(th => prefs.favorites.includes(th.id)).map(th => themeCard(th, prefs)).join('')}
          </div>
        </div>

        <!-- Tüm Temalar -->
        <h3 class="text-sm font-bold text-albion-accent flex items-center gap-2 mb-3">
          <i class="fa-solid fa-swatchbook"></i> ${t('theme-all', 'Tüm Temalar')}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" id="allThemesGrid">
          ${THEMES.map(th => themeCard(th, prefs)).join('')}
        </div>
      </div>
    `;

    function themeCard(th, prefs) {
      const isActive = prefs.active === th.id;
      const isFav = prefs.favorites.includes(th.id);
      return `
        <div class="theme-card bg-albion-900 rounded-xl border ${isActive ? 'border-' + th.accent.replace('#','') + '/70 ring-1 ring-' + th.accent.replace('#','') + '/30' : 'border-gray-700'} overflow-hidden hover:border-gray-500 transition-all cursor-pointer group" data-theme="${th.id}">
          <div class="h-16 relative" style="background:linear-gradient(135deg, ${th.bg} 40%, ${th.accent}22 100%)">
            <div class="absolute bottom-2 left-2 flex gap-1">
              <span class="w-3 h-3 rounded-full border" style="background:${th.bg};border-color:${th.accent}"></span>
              <span class="w-3 h-3 rounded-full" style="background:${th.accent}"></span>
              <span class="w-3 h-3 rounded-full" style="background:${th.text}"></span>
            </div>
            ${isActive ? '<span class="absolute top-2 right-2 bg-' + th.accent.replace('#','') + ' text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Aktif</span>' : ''}
            <button class="fav-btn absolute top-2 left-2 text-sm ${isFav ? 'text-yellow-400' : 'text-gray-600 group-hover:text-yellow-400'} transition-colors" data-theme="${th.id}">
              <i class="fa-solid fa-star"></i>
            </button>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-1.5 mb-0.5">
              <i class="fa-solid ${th.icon} text-xs" style="color:${th.accent}"></i>
              <span class="text-xs font-bold text-white">${th.name}</span>
            </div>
            <p class="text-[10px] text-gray-500">${th.desc}</p>
          </div>
        </div>
      `;
    }

    // Event listeners
    container.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', async (e) => {
        if (e.target.closest('.fav-btn')) return;
        const themeId = card.dataset.theme;
        const theme = THEMES.find(th => th.id === themeId);
        if (theme) {
          applyTheme(theme);
          prefs.active = themeId;
          await savePrefs(prefs);
          await render(container);
        }
      });
    });

    container.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const themeId = btn.dataset.theme;
        const idx = prefs.favorites.indexOf(themeId);
        if (idx >= 0) prefs.favorites.splice(idx, 1);
        else prefs.favorites.push(themeId);
        await savePrefs(prefs);
        await render(container);
      });
    });

    // AI Theme Generator
    container.querySelector('#themeAiBtn')?.addEventListener('click', async () => {
      const prompt = container.querySelector('#themeAiPrompt')?.value?.trim();
      if (!prompt) return;
      
      const btn = container.querySelector('#themeAiBtn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Üretiliyor...';

      try {
        const result = await window.miniappsAI.callModel({
          modelId: 'dc2db118-7888-466a-a8d1-bf9d96bab4b6',
          messages: [
            { role: 'system', content: 'Return exactly three HEX colors (background, accent, text) and a short theme name. Format: NAME|#bg|#accent|#text' },
            { role: 'user', content: prompt }
          ],
          timeoutMs: 15000
        });
        const text = window.miniappsAI.extractText(result);
        const parts = text.split('|');
        if (parts.length >= 4) {
          const [name, bg, accent, textColor] = parts.map(s => s.trim());
          const aiTheme = { id: 'ai-' + Date.now(), name, icon: 'fa-wand-magic-sparkles', desc: 'AI üretimi', bg, accent, text: textColor, card: bg };
          
          const resultDiv = container.querySelector('#themeAiResult');
          const preview = container.querySelector('#themeAiPreview');
          const nameEl = container.querySelector('#themeAiName');
          const bgEl = container.querySelector('#themeAiBg');
          const accentEl = container.querySelector('#themeAiAccent');
          
          if (resultDiv) resultDiv.classList.remove('hidden');
          if (preview) preview.style.background = `linear-gradient(135deg, ${bg} 40%, ${accent}22 100%)`;
          if (preview) preview.style.borderColor = accent;
          if (nameEl) nameEl.textContent = name;
          if (bgEl) { bgEl.textContent = bg; bgEl.style.color = bg; }
          if (accentEl) { accentEl.textContent = accent; accentEl.style.color = accent; }

          container.querySelector('#themeAiApply')?.addEventListener('click', () => {
            applyTheme(aiTheme);
            prefs.active = aiTheme.id;
            savePrefs(prefs);
          }, { once: true });
        }
      } catch (e) {
        window.AlbionToast?.show?.({ title: 'Hata', message: 'Tema üretilemedi', type: 'error' });
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-robot mr-1.5"></i> Üret';
      }
    });
  }

  window.ThemeStore = { render, THEMES, applyTheme, loadPrefs };
  console.log('ThemeStore loaded');
})();
