/* ZIP Export Utility: Package all 99 project files and trigger direct browser ZIP download */
(function () {
  const ALL_FILES = [
    ".github/workflows/deploy.yml",
    ".gitignore",
    "index.html",
    "js/ai-builds.js",
    "js/ai/search.js",
    "js/ai/weapon-db.js",
    "js/app-surfaces.css",
    "js/arbitrage-filters.js",
    "js/arbitrage.js",
    "js/avalon.js",
    "js/bestiary-data.js",
    "js/bestiary.js",
    "js/core/api.js",
    "js/core/auth.js",
    "js/core/combat-mechanics.js",
    "js/core/dashboard.css",
    "js/core/dashboard.js",
    "js/core/data-pipeline.js",
    "js/core/storage.js",
    "js/crafting-planner.js",
    "js/crafting.js",
    "js/creature-art.css",
    "js/creature-art.js",
    "js/economy-planner.js",
    "js/economy-profile.js",
    "js/event-market-bridge.js",
    "js/event.js",
    "js/favorite-actions.js",
    "js/favorites.js",
    "js/gathering.js",
    "js/global-item-search.js",
    "js/home-dashboard.js",
    "js/i18n-helper.js",
    "js/i18n-legacy.js",
    "js/item-card.js",
    "js/item-inspector.js",
    "js/loot.js",
    "js/main.js",
    "js/market-alerts.js",
    "js/market-center.js",
    "js/market-dock.js",
    "js/market-items.js",
    "js/market-live.css",
    "js/market-live.js",
    "js/market-runtime.js",
    "js/operations-bestiary.js",
    "js/operations-build.js",
    "js/operations-center.css",
    "js/operations-center.js",
    "js/operations-combat.js",
    "js/operations-data.js",
    "js/operations-enhanced.css",
    "js/operations-gathering.js",
    "js/operations-intelligence-data.js",
    "js/operations-intelligence.js",
    "js/operations-market.js",
    "js/operations-planning.js",
    "js/operations-profit.js",
    "js/operations-pvp.js",
    "js/operations-records.js",
    "js/operations-reference.js",
    "js/operations-risk.js",
    "js/operations-spawn.js",
    "js/operations-timeline.css",
    "js/performance-ux.js",
    "js/pvp.js",
    "js/ui/achievements.js",
    "js/ui/ai-assistant.js",
    "js/ui/ai-strategy-coach.js",
    "js/ui/build-simulator.css",
    "js/ui/build-simulator.js",
    "js/ui/crafting-rng.js",
    "js/ui/data-viz.js",
    "js/ui/discord-bridge.js",
    "js/ui/fame-calculator.js",
    "js/ui/guild-operations.js",
    "js/ui/interactive-map.css",
    "js/ui/interactive-map.js",
    "js/ui/killboard.js",
    "js/ui/loot-simulator.js",
    "js/ui/market-simulator.js",
    "js/ui/mini-games.js",
    "js/ui/social-features.js",
    "js/ui/tax-calculator.js",
    "js/ui/theme-store.js",
    "js/ui/toast-notifications.js",
    "js/ui/transport-risk.js",
    "js/ui/voice-assistant.js",
    "js/zip-exporter.js",
    "locales/de.json",
    "locales/en.json",
    "locales/es.json",
    "locales/ru.json",
    "locales/tr.json",
    "manifest.json",
    "miniapp.i18n.json",
    "README.md",
    "styles.css",
    "sw.js"
  ];

  const STATIC_FALLBACKS = {
    ".github/workflows/deploy.yml": `name: Deploy to GitHub Pages

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`,
    ".gitignore": `# İşletim sistemi
.DS_Store
Thumbs.db

# Editör
.vscode/
.idea/
*.swp
*.swo

# Node (ileride eklersek)
node_modules/
package-lock.json

# Ortam değişkenleri
.env
.env.local

# Loglar
*.log
`,
    "miniapp.i18n.json": JSON.stringify({ version: 1, sourceLocale: "en" }, null, 2),
    "manifest.json": JSON.stringify({
      name: "AoT-PNASF | Albion Online Platformu",
      short_name: "AoT-PNASF",
      description: "Türkiye'nin 1 Numaralı AI Destekli Albion Online Platformu",
      start_url: "/",
      display: "standalone",
      background_color: "#0a0a0a",
      theme_color: "#d4af37"
    }, null, 2)
  };

  function getCandidateUrls(filePath) {
    const currentPath = window.location.pathname;
    const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const baseOrigin = window.location.origin;

    const urls = [];

    if (filePath === 'index.html') {
      urls.push(window.location.href);
      urls.push(baseOrigin + currentPath);
    }

    urls.push(
      filePath,                                    // Clean relative: "js/ui/achievements.js"
      './' + filePath,                            // Relative: "./js/ui/achievements.js"
      baseOrigin + dirPath + filePath,            // Full absolute: "https://.../js/ui/achievements.js"
      baseOrigin + '/' + filePath,                 // Origin root relative
      '/' + filePath                              // Root relative
    );

    return [...new Set(urls)];
  }

  async function exportProjectAsZip(btnElement) {
    if (typeof JSZip === 'undefined') {
      alert('JSZip kütüphanesi yükleniyor, lütfen 2 saniye sonra tekrar deneyin.');
      return;
    }

    const origHtml = btnElement ? btnElement.innerHTML : '';
    if (btnElement) {
      btnElement.disabled = true;
      btnElement.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> ZIP...';
    }

    const statusToast = document.createElement('div');
    statusToast.className = 'fixed bottom-5 right-5 z-[200] bg-albion-800 border-2 border-albion-accent text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in';
    statusToast.innerHTML = `
      <div class="w-10 h-10 rounded-full bg-albion-accent/20 border border-albion-accent flex items-center justify-center shrink-0">
        <i class="fa-solid fa-file-zipper text-albion-accent text-xl animate-pulse"></i>
      </div>
      <div>
        <div class="font-black text-sm text-albion-accent">ZIP Paketleme Başlatıldı</div>
        <div id="zipStatusText" class="text-xs text-gray-300">Tüm 99 dosya işleniyor (0/99)...</div>
      </div>
    `;
    document.body.appendChild(statusToast);

    try {
      const zip = new JSZip();
      let fetchedCount = 0;
      let packedCount = 0;
      const failedFiles = [];

      for (const filePath of ALL_FILES) {
        let content = null;
        const candidateUrls = getCandidateUrls(filePath);

        for (const url of candidateUrls) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              const text = await res.text();
              if (text && text.length > 0) {
                content = text;
                break;
              }
            }
          } catch (e) {
            // try next URL candidate
          }
        }

        // Dedicated DOM fallback for index.html if fetch returned null/empty
        if (!content && filePath === 'index.html') {
          content = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
        }

        if (!content && STATIC_FALLBACKS[filePath]) {
          content = STATIC_FALLBACKS[filePath];
        }

        if (content !== null && content !== undefined && content.length > 0) {
          zip.file(filePath, content);
          packedCount++;
        } else {
          failedFiles.push(filePath);
          console.warn('ZIP export failed to pack file:', filePath);
        }

        fetchedCount++;
        const statusEl = document.getElementById('zipStatusText');
        if (statusEl) {
          statusEl.textContent = `Tüm 99 dosya taranıyor (${fetchedCount}/99 - ${packedCount} eklendi)...`;
        }
      }

      const statusEl = document.getElementById('zipStatusText');
      if (statusEl) statusEl.textContent = 'ZIP oluşturuluyor ve indiriliyor...';

      const blob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'AoT-PNASF-Albion-Online-Platform.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      if (statusEl) {
        if (failedFiles.length === 0) {
          statusEl.innerHTML = `<span class="text-green-400 font-bold">✅ 99/99 dosyanın tamamı eksiksiz indirildi!</span>`;
        } else {
          statusEl.innerHTML = `<span class="text-amber-400 font-bold">⚠️ ${packedCount}/99 dosya indirildi (${failedFiles.join(', ')} aktarılamadı)</span>`;
        }
      }
      setTimeout(() => statusToast.remove(), 5000);

    } catch (err) {
      console.error('ZIP Export Error:', err);
      alert('ZIP indirilirken bir hata oluştu: ' + err.message);
      statusToast.remove();
    } finally {
      if (btnElement) {
        btnElement.disabled = false;
        btnElement.innerHTML = origHtml;
      }
    }
  }

  function initZipTriggers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-download-project-zip');
      if (btn) {
        exportProjectAsZip(btn);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZipTriggers);
  } else {
    initZipTriggers();
  }

  window.ProjectZipExporter = {
    export: exportProjectAsZip
  };
})();
