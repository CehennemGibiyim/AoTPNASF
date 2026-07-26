/* Social Features - Build sharing, leaderboard, guild dashboard widgets */
(function () {
  const t = (key, fallback) => {
    try {
      const managed = window.miniappI18n?.t?.(key);
      if (managed && managed !== key) return managed;
      const legacy = window.__translations?.[key];
      if (legacy) return legacy;
    } catch (e) {}
    return fallback || key;
  };

  const STORAGE_KEY_BUILDS = 'aot_pnasf_shared_builds';
  const STORAGE_KEY_LEADERBOARD = 'aot_pnasf_leaderboard';
  const STORAGE_KEY_GUILD = 'aot_pnasf_guild_data';

  // --- Build Sharing ---
  async function getSharedBuilds() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY_BUILDS, { area: 'persistent' });
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  async function saveSharedBuilds(builds) {
    try {
      await window.miniappsAI?.storage?.setItem(STORAGE_KEY_BUILDS, JSON.stringify(builds).slice(0, 900000), { area: 'persistent' });
    } catch (e) {}
  }

  async function shareBuild(build) {
    const builds = await getSharedBuilds();
    const newBuild = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...build,
      sharedAt: Date.now(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    builds.unshift(newBuild);
    await saveSharedBuilds(builds);
    window.AoTToast?.success(t('social-buildShared', 'Build paylaşıldı!'));
    return newBuild;
  }

  async function likeBuild(buildId) {
    const builds = await getSharedBuilds();
    const build = builds.find(b => b.id === buildId);
    if (!build) return;
    
    const userId = 'user_' + Date.now().toString(36);
    if (build.likedBy?.includes(userId)) {
      build.likes = Math.max(0, (build.likes || 1) - 1);
      build.likedBy = build.likedBy.filter(id => id !== userId);
    } else {
      build.likes = (build.likes || 0) + 1;
      build.likedBy = [...(build.likedBy || []), userId];
    }
    await saveSharedBuilds(builds);
    return build;
  }

  async function addComment(buildId, text) {
    const builds = await getSharedBuilds();
    const build = builds.find(b => b.id === buildId);
    if (!build || !text.trim()) return;
    
    build.comments = [...(build.comments || []), {
      id: Date.now().toString(36),
      text: text.trim(),
      author: t('social-anon', 'Anonim'),
      time: Date.now()
    }];
    await saveSharedBuilds(builds);
    return build;
  }

  function renderBuildCard(build, container) {
    const timeAgo = getTimeAgo(build.sharedAt);
    const tierColor = build.tier >= 8 ? '#d4af37' : build.tier >= 6 ? '#a78bfa' : '#60a5fa';
    
    return `
      <div class="social-build-card" data-build-id="${build.id}">
        <div class="social-build-header">
          <div class="social-build-title">
            <span class="social-build-tier" style="color:${tierColor}">T${build.tier || '?'}</span>
            <span>${escapeHtml(build.name || t('social-untitled', 'İsimsiz Build'))}</span>
          </div>
          <span class="social-build-time">${timeAgo}</span>
        </div>
        <div class="social-build-weapon">
          <i class="fa-solid fa-khanda"></i> ${escapeHtml(build.weapon || '?')}
        </div>
        <div class="social-build-gear">
          ${['head', 'chest', 'shoes', 'cape', 'food', 'potion'].map(slot => `
            <span class="social-gear-slot" title="${slot}">
              <span class="social-gear-label">${slot.substring(0,2).toUpperCase()}</span>
              <span class="social-gear-value">${escapeHtml(build[slot] || '-')}</span>
            </span>
          `).join('')}
        </div>
        ${build.description ? `<p class="social-build-desc">${escapeHtml(build.description)}</p>` : ''}
        <div class="social-build-tags">
          ${(build.tags || []).map(tag => `<span class="social-tag">${escapeHtml(tag)}</span>`).join('')}
          <span class="social-tag social-tag-type">${escapeHtml(build.type || 'PvP')}</span>
        </div>
        <div class="social-build-actions">
          <button class="social-action-btn social-like-btn" data-action="like" data-build-id="${build.id}">
            <i class="fa-solid fa-heart"></i> <span>${build.likes || 0}</span>
          </button>
          <button class="social-action-btn social-comment-btn" data-action="comment" data-build-id="${build.id}">
            <i class="fa-solid fa-comment"></i> <span>${(build.comments || []).length}</span>
          </button>
          <button class="social-action-btn social-copy-btn" data-action="copy" data-build-id="${build.id}">
            <i class="fa-solid fa-copy"></i> ${t('social-copy', 'Kopyala')}
          </button>
        </div>
        <div class="social-comments-section hidden" id="comments-${build.id}">
          ${(build.comments || []).slice(-5).map(c => `
            <div class="social-comment">
              <span class="social-comment-author">${escapeHtml(c.author)}</span>
              <span class="social-comment-text">${escapeHtml(c.text)}</span>
            </div>
          `).join('')}
          <div class="social-comment-input">
            <input type="text" placeholder="${t('social-commentPlaceholder', 'Yorum yaz...')}" data-comment-input="${build.id}">
            <button data-comment-submit="${build.id}"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Leaderboard ---
  async function getLeaderboard() {
    try {
      const raw = await window.miniappsAI?.storage?.getItem(STORAGE_KEY_LEADERBOARD, { area: 'persistent' });
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  async function updateLeaderboard(entry) {
    const board = await getLeaderboard();
    const existing = board.findIndex(e => e.player === entry.player && e.category === entry.category);
    if (existing >= 0) {
      board[existing] = { ...board[existing], ...entry, updatedAt: Date.now() };
    } else {
      board.push({ ...entry, createdAt: Date.now(), updatedAt: Date.now() });
    }
    board.sort((a, b) => (b.score || b.profit || 0) - (a.score || a.profit || 0));
    const trimmed = board.slice(0, 100);
    await window.miniappsAI?.storage?.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(trimmed).slice(0, 900000), { area: 'persistent' });
    return trimmed;
  }

  function renderLeaderboard(container, entries, category = 'profit') {
    if (!container) return;
    
    const medals = ['🥇', '🥈', '🥉'];
    const filtered = entries.filter(e => e.category === category).slice(0, 20);
    
    container.innerHTML = `
      <div class="social-leaderboard">
        <div class="social-lb-header">
          <h3><i class="fa-solid fa-trophy"></i> ${t('social-leaderboard', 'Liderlik Tablosu')}</h3>
          <div class="social-lb-tabs">
            <button class="social-lb-tab ${category === 'profit' ? 'active' : ''}" data-cat="profit">💰 ${t('social-lb-profit', 'Kar')}</button>
            <button class="social-lb-tab ${category === 'pvp' ? 'active' : ''}" data-cat="pvp">⚔️ PvP</button>
            <button class="social-lb-tab ${category === 'crafting' ? 'active' : ''}" data-cat="crafting">🔨 Craft</button>
          </div>
        </div>
        <div class="social-lb-list">
          ${filtered.length === 0 ? `<div class="social-lb-empty">${t('social-lb-empty', 'Henüz veri yok')}</div>` : ''}
          ${filtered.map((entry, i) => `
            <div class="social-lb-row ${i < 3 ? 'social-lb-top' : ''}">
              <span class="social-lb-rank">${medals[i] || `#${i + 1}`}</span>
              <span class="social-lb-player">${escapeHtml(entry.player || t('social-anon', 'Anonim'))}</span>
              <span class="social-lb-score">${(entry.score || entry.profit || 0).toLocaleString()} ${entry.unit || '🥈'}</span>
              <span class="social-lb-detail">${escapeHtml(entry.detail || '')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Guild Dashboard Widget ---
  function renderGuildWidget(container, guildData) {
    if (!container) return;
    
    const data = guildData || {};
    
    container.innerHTML = `
      <div class="social-guild-widget">
        <div class="social-guild-header">
          <div class="social-guild-icon">
            <i class="fa-solid fa-chess-rook"></i>
          </div>
          <div class="social-guild-info">
            <h4>${escapeHtml(data.name || t('social-guildDefault', 'Lonca'))}</h4>
            <span>${(data.members || 0)} ${t('social-guildMembers', 'üye')} · ${escapeHtml(data.server || 'EU')}</span>
          </div>
        </div>
        <div class="social-guild-stats">
          <div class="social-guild-stat">
            <span class="social-gstat-value">${(data.totalProfit || 0).toLocaleString()} 🥈</span>
            <span class="social-gstat-label">${t('social-gstat-profit', 'Toplam Kar')}</span>
          </div>
          <div class="social-guild-stat">
            <span class="social-gstat-value">${data.kills || 0}</span>
            <span class="social-gstat-label">${t('social-gstat-kills', 'Kill')}</span>
          </div>
          <div class="social-guild-stat">
            <span class="social-gstat-value">${data.operations || 0}</span>
            <span class="social-gstat-label">${t('social-gstat-ops', 'Operasyon')}</span>
          </div>
          <div class="social-guild-stat">
            <span class="social-gstat-value">${data.territories || 0}</span>
            <span class="social-gstat-label">${t('social-gstat-territory', 'Bölge')}</span>
          </div>
        </div>
        <div class="social-guild-roster">
          <h5>${t('social-guildOnline', 'Çevrimiçi')}</h5>
          <div class="social-guild-members">
            ${(data.onlineMembers || []).slice(0, 8).map(m => `
              <span class="social-guild-member ${m.role || ''}" title="${escapeHtml(m.name || '')}">
                <span class="social-member-dot"></span>
                ${escapeHtml((m.name || '?').substring(0, 12))}
              </span>
            `).join('')}
            ${(data.onlineMembers || []).length > 8 ? `<span class="social-guild-more">+${data.onlineMembers.length - 8}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // --- Share Build Form ---
  function renderShareForm(container, onShare) {
    if (!container) return;
    
    container.innerHTML = `
      <div class="social-share-form">
        <h3><i class="fa-solid fa-share-nodes"></i> ${t('social-shareBuild', 'Build Paylaş')}</h3>
        <div class="social-form-grid">
          <input type="text" id="shareBuildName" placeholder="${t('social-buildName', 'Build adı')}" class="social-input">
          <input type="text" id="shareBuildWeapon" placeholder="${t('social-weapon', 'Silah (örn: Deathgivers)')}" class="social-input">
          <select id="shareBuildTier" class="social-input">
            <option value="4">T4</option><option value="5">T5</option>
            <option value="6" selected>T6</option><option value="7">T7</option><option value="8">T8</option>
          </select>
          <select id="shareBuildType" class="social-input">
            <option value="PvP">PvP</option><option value="PvE">PvE</option>
            <option value="Ganking">Ganking</option><option value="ZVZ">ZVZ</option>
            <option value="Solo">Solo</option><option value="Group">Group</option>
          </select>
        </div>
        <div class="social-form-gear">
          ${['head', 'chest', 'shoes', 'cape', 'food', 'potion'].map(s => `
            <input type="text" id="shareBuild${s.charAt(0).toUpperCase() + s.slice(1)}" placeholder="${s}" class="social-input social-input-sm">
          `).join('')}
        </div>
        <textarea id="shareBuildDesc" placeholder="${t('social-buildDesc', 'Kısa açıklama...')}" class="social-input social-textarea" rows="2"></textarea>
        <div class="social-form-tags">
          <input type="text" id="shareBuildTags" placeholder="${t('social-tags', 'Etiketler (virgülle ayır)')}" class="social-input">
        </div>
        <button id="shareBuildSubmit" class="social-submit-btn">
          <i class="fa-solid fa-paper-plane"></i> ${t('social-share', 'Paylaş')}
        </button>
      </div>
    `;

    container.querySelector('#shareBuildSubmit').addEventListener('click', async () => {
      const build = {
        name: container.querySelector('#shareBuildName').value.trim(),
        weapon: container.querySelector('#shareBuildWeapon').value.trim(),
        tier: parseInt(container.querySelector('#shareBuildTier').value),
        type: container.querySelector('#shareBuildType').value,
        head: container.querySelector('#shareBuildHead')?.value.trim() || '',
        chest: container.querySelector('#shareBuildChest')?.value.trim() || '',
        shoes: container.querySelector('#shareBuildShoes')?.value.trim() || '',
        cape: container.querySelector('#shareBuildCape')?.value.trim() || '',
        food: container.querySelector('#shareBuildFood')?.value.trim() || '',
        potion: container.querySelector('#shareBuildPotion')?.value.trim() || '',
        description: container.querySelector('#shareBuildDesc').value.trim(),
        tags: container.querySelector('#shareBuildTags').value.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      if (!build.name || !build.weapon) {
        window.AoTToast?.warning(t('social-fillRequired', 'Build adı ve silah zorunlu!'));
        return;
      }

      const result = await shareBuild(build);
      if (onShare) onShare(result);
      
      // Clear form
      container.querySelectorAll('input, textarea').forEach(el => el.value = '');
      container.querySelector('#shareBuildTier').value = '6';
      container.querySelector('#shareBuildType').value = 'PvP';
    });
  }

  // --- Full Social Page Renderer ---
  async function renderSocialPage(container) {
    if (!container) return;
    
    const [builds, leaderboard] = await Promise.all([
      getSharedBuilds(),
      getLeaderboard()
    ]);

    container.innerHTML = `
      <div class="social-page">
        <div class="social-page-header">
          <h2><i class="fa-solid fa-users"></i> ${t('social-title', 'Topluluk Merkezi')}</h2>
          <p>${t('social-subtitle', 'Build paylaş, liderlik tablosunda yüksel, loncanı yönet')}</p>
        </div>
        <div class="social-page-grid">
          <div class="social-main-col">
            <div id="socialShareForm"></div>
            <div class="social-builds-header">
              <h3>${t('social-sharedBuilds', 'Paylaşılan Buildler')}</h3>
              <span class="social-builds-count">${builds.length} build</span>
            </div>
            <div id="socialBuildsList" class="social-builds-list">
              ${builds.length === 0 ? `<div class="social-empty">${t('social-noBuilds', 'Henüz build paylaşılmadı. İlk sen paylaş!')}</div>` : ''}
              ${builds.slice(0, 20).map(b => renderBuildCard(b)).join('')}
            </div>
          </div>
          <div class="social-side-col">
            <div id="socialLeaderboard"></div>
            <div id="socialGuildWidget" class="social-guild-container"></div>
          </div>
        </div>
      </div>
    `;

    renderShareForm(container.querySelector('#socialShareForm'), async (newBuild) => {
      const buildsList = container.querySelector('#socialBuildsList');
      const card = renderBuildCard(newBuild);
      buildsList.insertAdjacentHTML('afterbegin', card);
      const empty = buildsList.querySelector('.social-empty');
      if (empty) empty.remove();
    });

    renderLeaderboard(container.querySelector('#socialLeaderboard'), leaderboard, 'profit');
    renderGuildWidget(container.querySelector('#socialGuildWidget'), {
      name: 'AoT Community',
      members: 42,
      server: 'EU',
      totalProfit: 125000000,
      kills: 156,
      operations: 23,
      territories: 3,
      onlineMembers: [
        { name: 'CommanderX', role: 'leader' },
        { name: 'SilverKing', role: 'officer' },
        { name: 'DarkKnight', role: 'member' },
        { name: 'GoldHunter', role: 'member' },
        { name: 'MistWalker', role: 'member' }
      ]
    });

    // Event delegation for build actions
    container.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      
      const buildId = btn.dataset.buildId;
      const action = btn.dataset.action;
      
      if (action === 'like') {
        const updated = await likeBuild(buildId);
        if (updated) {
          btn.querySelector('span').textContent = updated.likes || 0;
          btn.classList.toggle('liked');
        }
      } else if (action === 'comment') {
        const section = container.querySelector(`#comments-${buildId}`);
        if (section) section.classList.toggle('hidden');
      } else if (action === 'copy') {
        const card = btn.closest('.social-build-card');
        const text = card?.querySelector('.social-build-weapon')?.textContent?.trim() || '';
        try {
          await navigator.clipboard.writeText(text);
          window.AoTToast?.success(t('social-copied', 'Kopyalandı!'));
        } catch (e) {}
      }
    });

    // Comment submit
    container.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-comment-submit]');
      if (!btn) return;
      
      const buildId = btn.dataset.commentSubmit;
      const input = container.querySelector(`[data-comment-input="${buildId}"]`);
      if (!input?.value.trim()) return;
      
      const updated = await addComment(buildId, input.value);
      if (updated) {
        const section = container.querySelector(`#comments-${buildId}`);
        if (section) {
          const commentHtml = `
            <div class="social-comment">
              <span class="social-comment-author">${t('social-anon', 'Anonim')}</span>
              <span class="social-comment-text">${escapeHtml(input.value.trim())}</span>
            </div>
          `;
          const inputArea = section.querySelector('.social-comment-input');
          inputArea.insertAdjacentHTML('beforebegin', commentHtml);
          input.value = '';
        }
      }
    });

    // Leaderboard tab switch
    container.querySelector('#socialLeaderboard')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.social-lb-tab');
      if (!tab) return;
      renderLeaderboard(container.querySelector('#socialLeaderboard'), leaderboard, tab.dataset.cat);
    });
  }

  // Helpers
  function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('social-justNow', 'Az önce');
    if (mins < 60) return `${mins} ${t('social-minAgo', 'dk önce')}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${t('social-hourAgo', 'sa önce')}`;
    const days = Math.floor(hours / 24);
    return `${days} ${t('social-dayAgo', 'gün önce')}`;
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // Inject styles
  function injectStyles() {
    if (document.getElementById('social-styles')) return;
    const style = document.createElement('style');
    style.id = 'social-styles';
    style.textContent = `
      .social-page { padding: 16px; }
      .social-page-header { margin-bottom: 20px; }
      .social-page-header h2 { font-size: 22px; color: #f1f5f9; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
      .social-page-header p { font-size: 13px; color: #64748b; }
      .social-page-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
      .social-main-col { display: flex; flex-direction: column; gap: 16px; }
      .social-side-col { display: flex; flex-direction: column; gap: 16px; }
      
      .social-share-form {
        background: #1a1d2e; border: 1px solid #2a2d3e; border-radius: 12px; padding: 16px;
      }
      .social-share-form h3 { font-size: 15px; color: #d4af37; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
      .social-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
      .social-form-gear { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 8px; }
      .social-input {
        width: 100%; background: #0f1119; border: 1px solid #2a2d3e; border-radius: 8px;
        padding: 9px 12px; color: #e2e8f0; font-size: 12px; outline: none; box-sizing: border-box;
      }
      .social-input:focus { border-color: #d4af37; }
      .social-input-sm { font-size: 11px; padding: 7px 10px; }
      .social-textarea { resize: vertical; margin-bottom: 8px; }
      .social-form-tags { margin-bottom: 12px; }
      .social-submit-btn {
        width: 100%; background: #d4af37; color: #0a0a0a; border: none; border-radius: 10px;
        padding: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: background 0.2s;
      }
      .social-submit-btn:hover { background: #e8c547; }
      
      .social-builds-header { display: flex; justify-content: space-between; align-items: center; }
      .social-builds-header h3 { font-size: 15px; color: #f1f5f9; }
      .social-builds-count { font-size: 11px; color: #64748b; background: #141726; padding: 3px 10px; border-radius: 12px; }
      .social-builds-list { display: flex; flex-direction: column; gap: 12px; }
      
      .social-build-card {
        background: #1a1d2e; border: 1px solid #2a2d3e; border-radius: 12px; padding: 14px;
        transition: border-color 0.2s;
      }
      .social-build-card:hover { border-color: #d4af37; }
      .social-build-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .social-build-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #f1f5f9; font-size: 14px; }
      .social-build-tier { font-size: 11px; padding: 2px 8px; border-radius: 4px; background: #141726; }
      .social-build-time { font-size: 11px; color: #64748b; }
      .social-build-weapon { color: #d4af37; font-size: 13px; margin-bottom: 8px; }
      .social-build-gear { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
      .social-gear-slot {
        background: #141726; border-radius: 6px; padding: 4px 8px; font-size: 10px;
        display: flex; gap: 4px; align-items: center;
      }
      .social-gear-label { color: #64748b; font-weight: 700; }
      .social-gear-value { color: #94a3b8; }
      .social-build-desc { font-size: 12px; color: #94a3b8; margin-bottom: 8px; }
      .social-build-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }
      .social-tag { font-size: 10px; padding: 2px 8px; border-radius: 12px; background: rgba(212,175,55,0.1); color: #d4af37; }
      .social-tag-type { background: rgba(96,165,250,0.1); color: #60a5fa; }
      .social-build-actions { display: flex; gap: 8px; }
      .social-action-btn {
        background: #141726; border: 1px solid #2a2d3e; color: #94a3b8; padding: 6px 12px;
        border-radius: 8px; font-size: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;
      }
      .social-action-btn:hover { border-color: #d4af37; color: #d4af37; }
      .social-action-btn.liked { color: #ef4444; border-color: #ef4444; }
      
      .social-comments-section { margin-top: 10px; padding-top: 10px; border-top: 1px solid #2a2d3e; }
      .social-comments-section.hidden { display: none; }
      .social-comment { display: flex; gap: 8px; padding: 6px 0; font-size: 12px; }
      .social-comment-author { color: #d4af37; font-weight: 600; flex-shrink: 0; }
      .social-comment-text { color: #94a3b8; }
      .social-comment-input { display: flex; gap: 6px; margin-top: 8px; }
      .social-comment-input input {
        flex: 1; background: #0f1119; border: 1px solid #2a2d3e; border-radius: 8px;
        padding: 8px 10px; color: #e2e8f0; font-size: 11px; outline: none;
      }
      .social-comment-input button {
        background: #d4af37; border: none; color: #0a0a0a; border-radius: 8px; padding: 8px 12px; cursor: pointer;
      }
      
      .social-leaderboard {
        background: #1a1d2e; border: 1px solid #2a2d3e; border-radius: 12px; overflow: hidden;
      }
      .social-lb-header { padding: 14px; border-bottom: 1px solid #2a2d3e; }
      .social-lb-header h3 { font-size: 14px; color: #f1f5f9; margin-bottom: 10px; }
      .social-lb-tabs { display: flex; gap: 4px; }
      .social-lb-tab {
        flex: 1; background: #141726; border: 1px solid #2a2d3e; color: #64748b;
        padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; text-align: center; font-weight: 600;
      }
      .social-lb-tab.active { background: rgba(212,175,55,0.1); border-color: #d4af37; color: #d4af37; }
      .social-lb-list { padding: 8px; }
      .social-lb-row {
        display: flex; align-items: center; gap: 8px; padding: 8px 10px;
        border-radius: 8px; font-size: 12px; margin-bottom: 2px;
      }
      .social-lb-row:hover { background: #141726; }
      .social-lb-top { background: rgba(212,175,55,0.05); }
      .social-lb-rank { font-size: 16px; width: 28px; text-align: center; }
      .social-lb-player { flex: 1; color: #e2e8f0; font-weight: 600; }
      .social-lb-score { color: #d4af37; font-weight: 700; }
      .social-lb-detail { color: #64748b; font-size: 10px; }
      .social-lb-empty { text-align: center; color: #64748b; padding: 20px; font-size: 13px; }
      
      .social-guild-container { margin-top: 0; }
      .social-guild-widget {
        background: #1a1d2e; border: 1px solid #2a2d3e; border-radius: 12px; padding: 14px;
      }
      .social-guild-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
      .social-guild-icon {
        width: 44px; height: 44px; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.3);
        border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #d4af37;
      }
      .social-guild-info h4 { font-size: 14px; color: #f1f5f9; }
      .social-guild-info span { font-size: 11px; color: #64748b; }
      .social-guild-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 14px; }
      .social-guild-stat { text-align: center; padding: 8px 4px; background: #141726; border-radius: 8px; }
      .social-gstat-value { display: block; font-size: 13px; font-weight: 700; color: #f1f5f9; }
      .social-gstat-label { display: block; font-size: 9px; color: #64748b; text-transform: uppercase; }
      .social-guild-roster h5 { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
      .social-guild-members { display: flex; flex-wrap: wrap; gap: 4px; }
      .social-guild-member {
        display: flex; align-items: center; gap: 4px; font-size: 11px; color: #94a3b8;
        background: #141726; padding: 4px 8px; border-radius: 6px;
      }
      .social-guild-member.leader { color: #d4af37; }
      .social-guild-member.officer { color: #60a5fa; }
      .social-member-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; }
      .social-guild-more { font-size: 11px; color: #64748b; padding: 4px 8px; }
      .social-empty { text-align: center; color: #64748b; padding: 24px; font-size: 13px; }
      
      @media (max-width: 768px) {
        .social-page-grid { grid-template-columns: 1fr; }
        .social-form-grid { grid-template-columns: 1fr; }
        .social-form-gear { grid-template-columns: repeat(2, 1fr); }
        .social-guild-stats { grid-template-columns: repeat(2, 1fr); }
      }
    `;
    document.head.appendChild(style);
  }

  // Init
  document.addEventListener('DOMContentLoaded', injectStyles);

  // Expose
  window.AlbionSocial = {
    getSharedBuilds,
    shareBuild,
    likeBuild,
    addComment,
    getLeaderboard,
    updateLeaderboard,
    renderSocialPage,
    renderBuildCard,
    renderLeaderboard,
    renderGuildWidget,
    renderShareForm
  };
})();
