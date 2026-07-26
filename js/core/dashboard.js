/* Unified Dashboard - Main Control Panel for Albion Online Ultimate Platform */
(function () {
  const UnifiedDashboard = {
    // Dashboard state
    state: {
      activeModule: 'dashboard',
      modules: {},
      widgets: {},
      layout: 'grid',
      theme: 'dark',
      collapsed: false,
    },
    
    // Available modules
    modulesList: [
      // Core Modules
      { id: 'dashboard', name: 'Ana Kontrol Paneli', icon: 'fa-gauge-high', category: 'core' },
      { id: 'maps', name: 'Harita & Konum', icon: 'fa-map', category: 'maps' },
      { id: 'combat', name: 'Savaş & Build', icon: 'fa-khanda', category: 'combat' },
      { id: 'economy', name: 'Ekonomi & Market', icon: 'fa-sack-dollar', category: 'economy' },
      { id: 'guild', name: 'Guild Yönetimi', icon: 'fa-users', category: 'guild' },
      { id: 'analytics', name: 'Analitikler', icon: 'fa-chart-line', category: 'analytics' },
      { id: 'community', name: 'Topluluk', icon: 'fa-users-line', category: 'community' },
      
      // Sub-modules
      { id: 'market_dashboard', name: 'Market Dashboard', icon: 'fa-chart-simple', category: 'economy', parent: 'economy' },
      { id: 'build_simulator', name: 'Build Simulator', icon: 'fa-flask-vial', category: 'combat', parent: 'combat' },
      { id: 'player_analytics', name: 'Oyuncu Analitikleri', icon: 'fa-user-chart', category: 'analytics', parent: 'analytics' },
      { id: 'guild_operations', name: 'Guild Operasyonları', icon: 'fa-tower-broadcast', category: 'guild', parent: 'guild' },
    ],
    
    // Available widgets
    widgetsList: [
      // Server Status
      { id: 'server_status', name: 'Sunucu Durumu', module: 'dashboard', size: 'small' },
      { id: 'gold_prices', name: 'Altın Fiyatları', module: 'dashboard', size: 'medium' },
      { id: 'market_ticker', name: 'Market Ticker', module: 'dashboard', size: 'large' },
      
      // Player Stats
      { id: 'player_stats', name: 'Oyuncu İstatistikleri', module: 'dashboard', size: 'medium' },
      { id: 'watchlist', name: 'İzleme Listesi', module: 'dashboard', size: 'small' },
      { id: 'recent_events', name: 'Son Etkinlikler', module: 'dashboard', size: 'medium' },
      
      // Quick Actions
      { id: 'quick_actions', name: 'Hızlı İşlemler', module: 'dashboard', size: 'small' },
      { id: 'build_favorites', name: 'Favori Build\'ler', module: 'dashboard', size: 'medium' },
      { id: 'guild_updates', name: 'Guild Güncellemeleri', module: 'dashboard', size: 'medium' },
    ],
    
    // Initialize dashboard
    async init() {
      console.log('Unified Dashboard initializing...');
      
      // Load saved state
      await this.loadState();
      
      // Initialize core systems
      await this.initCoreSystems();
      
      // Render dashboard
      await this.render();
      
      // Start auto-updates
      this.startAutoUpdates();
      
      console.log('Unified Dashboard initialized');
      return this;
    },
    
    // Load saved state
    async loadState() {
      try {
        const savedState = await window.StorageSystem?.getItem('dashboard_state');
        if (savedState) {
          this.state = { ...this.state, ...savedState };
        }
      } catch (error) {
        console.error('Failed to load dashboard state:', error);
      }
    },
    
    // Save state
    async saveState() {
      try {
        await window.StorageSystem?.setItem('dashboard_state', this.state);
      } catch (error) {
        console.error('Failed to save dashboard state:', error);
      }
    },
    
    // Initialize core systems
    async initCoreSystems() {
      // Wait for core systems to be available
      const maxAttempts = 10;
      let attempts = 0;
      
      const waitForSystem = (systemName) => {
        return new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            attempts++;
            if (window[systemName] || attempts >= maxAttempts) {
              clearInterval(checkInterval);
              resolve(!!window[systemName]);
            }
          }, 100);
        });
      };
      
      // Wait for all core systems
      await Promise.all([
        waitForSystem('AlbionCore'),
        waitForSystem('DataPipeline'),
        waitForSystem('AuthSystem'),
        waitForSystem('StorageSystem'),
      ]);
      
      console.log('Core systems initialized for dashboard');
    },
    
    // Render dashboard
    async render() {
      // Create main container if it doesn't exist
      let container = document.getElementById('unifiedDashboard');
      if (!container) {
        container = document.createElement('div');
        container.id = 'unifiedDashboard';
        container.className = 'unified-dashboard';
        document.querySelector('main').prepend(container);
      }
      
      // Clear container
      container.innerHTML = '';
      
      // Render based on active module
      switch (this.state.activeModule) {
        case 'dashboard':
          await this.renderMainDashboard(container);
          break;
        default:
          await this.renderModuleView(container, this.state.activeModule);
      }
      
      // Render sidebar
      this.renderSidebar();
      
      // Add event listeners
      this.addEventListeners();
    },
    
    // Render main dashboard
    async renderMainDashboard(container) {
      container.innerHTML = `
        <div class="dashboard-header">
          <div class="header-left">
            <h1><i class="fa-solid fa-gauge-high"></i> Albion Kontrol Paneli</h1>
            <p class="subtitle">Tüm Albion Online araçları tek bir yerde</p>
          </div>
          <div class="header-right">
            <button class="btn-refresh" title="Yenile">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="btn-layout" title="Düzeni Değiştir">
              <i class="fa-solid fa-table-cells"></i>
            </button>
            <button class="btn-settings" title="Ayarlar">
              <i class="fa-solid fa-sliders"></i>
            </button>
          </div>
        </div>
        
        <div class="dashboard-widgets ${this.state.layout}">
          <!-- Widgets will be dynamically added -->
        </div>
        
        <div class="dashboard-modules">
          <h2><i class="fa-solid fa-puzzle-piece"></i> Hızlı Modüller</h2>
          <div class="modules-grid">
            <!-- Modules will be dynamically added -->
          </div>
        </div>
      `;
      
      // Render widgets
      await this.renderWidgets();
      
      // Render quick modules
      this.renderQuickModules();
    },
    
    // Render widgets
    async renderWidgets() {
      const widgetsContainer = document.querySelector('.dashboard-widgets');
      if (!widgetsContainer) return;
      
      // Get enabled widgets from state
      const enabledWidgets = this.state.widgets || {};
      
      // Render each widget
      for (const widget of this.widgetsList) {
        if (!enabledWidgets[widget.id] && widget.id !== 'server_status') {
          continue; // Skip disabled widgets (except server status)
        }
        
        const widgetElement = await this.renderWidget(widget);
        if (widgetElement) {
          widgetsContainer.appendChild(widgetElement);
        }
      }
    },
    
    // Render individual widget
    async renderWidget(widget) {
      const div = document.createElement('div');
      div.className = `widget widget-${widget.id} ${widget.size}`;
      div.dataset.widget = widget.id;
      
      // Add loading state
      div.innerHTML = `
        <div class="widget-header">
          <h3><i class="fa-solid fa-spinner fa-spin"></i> ${widget.name}</h3>
          <div class="widget-actions">
            <button class="btn-refresh-widget" title="Yenile">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="btn-remove-widget" title="Kaldır">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <div class="widget-content">
          <div class="loading">Yükleniyor...</div>
        </div>
      `;
      
      // Load widget content
      setTimeout(() => this.loadWidgetContent(widget.id, div), 100);
      
      return div;
    },
    
    // Load widget content
    async loadWidgetContent(widgetId, container) {
      const contentDiv = container.querySelector('.widget-content');
      if (!contentDiv) return;
      
      try {
        switch (widgetId) {
          case 'server_status':
            await this.renderServerStatus(contentDiv);
            break;
          case 'gold_prices':
            await this.renderGoldPrices(contentDiv);
            break;
          case 'market_ticker':
            await this.renderMarketTicker(contentDiv);
            break;
          case 'player_stats':
            await this.renderPlayerStats(contentDiv);
            break;
          case 'watchlist':
            await this.renderWatchlist(contentDiv);
            break;
          case 'recent_events':
            await this.renderRecentEvents(contentDiv);
            break;
          case 'quick_actions':
            await this.renderQuickActions(contentDiv);
            break;
          case 'build_favorites':
            await this.renderBuildFavorites(contentDiv);
            break;
          case 'guild_updates':
            await this.renderGuildUpdates(contentDiv);
            break;
          default:
            contentDiv.innerHTML = '<div class="empty">Widget içeriği bulunamadı.</div>';
        }
      } catch (error) {
        console.error(`Failed to load widget ${widgetId}:`, error);
        contentDiv.innerHTML = '<div class="error">Yüklenirken hata oluştu.</div>';
      }
    },
    
    // Render server status widget
    async renderServerStatus(container) {
      const status = window.DataPipeline?.getServerStatus() || { status: 'unknown', players: 0 };
      
      let statusClass = 'unknown';
      let statusText = 'Bilinmiyor';
      
      switch (status.status.toLowerCase()) {
        case 'online':
          statusClass = 'online';
          statusText = 'Çevrimiçi';
          break;
        case 'offline':
          statusClass = 'offline';
          statusText = 'Çevrimdışı';
          break;
        case 'maintenance':
          statusClass = 'maintenance';
          statusText = 'Bakımda';
          break;
      }
      
      container.innerHTML = `
        <div class="server-status ${statusClass}">
          <div class="status-indicator">
            <div class="indicator ${statusClass}"></div>
            <span class="status-text">${statusText}</span>
          </div>
          <div class="status-details">
            <div class="detail">
              <span class="label">Oyuncu Sayısı:</span>
              <span class="value">${status.players.toLocaleString()}</span>
            </div>
            <div class="detail">
              <span class="label">Kuyruk:</span>
              <span class="value">${status.queue || 0}</span>
            </div>
            <div class="detail">
              <span class="label">Son Güncelleme:</span>
              <span class="value">${new Date(status.lastUpdate).toLocaleTimeString('tr-TR')}</span>
            </div>
          </div>
        </div>
      `;
    },
    
    // Render gold prices widget
    async renderGoldPrices(container) {
      const goldData = window.DataPipeline?.getGoldHistory() || [];
      const latest = goldData[0] || { price: 0, timestamp: new Date().toISOString() };
      const previous = goldData[1] || latest;
      
      const change = latest.price - previous.price;
      const changePercent = previous.price > 0 ? (change / previous.price) * 100 : 0;
      
      container.innerHTML = `
        <div class="gold-prices">
          <div class="current-price">
            <span class="label">Güncel Fiyat:</span>
            <span class="value">${latest.price.toLocaleString('tr-TR')} Silver</span>
          </div>
          <div class="price-change ${change >= 0 ? 'positive' : 'negative'}">
            <i class="fa-solid ${change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
            <span>${Math.abs(change).toLocaleString('tr-TR')} (${Math.abs(changePercent).toFixed(2)}%)</span>
          </div>
          <div class="price-history">
            <span class="label">24 Saatlik Değişim:</span>
            <div class="sparkline"></div>
          </div>
          <div class="last-update">
            Son güncelleme: ${new Date(latest.timestamp).toLocaleTimeString('tr-TR')}
          </div>
        </div>
      `;
      
      // Add simple sparkline
      if (goldData.length > 1) {
        setTimeout(() => this.renderSparkline(container.querySelector('.sparkline'), goldData), 50);
      }
    },
    
    // Render sparkline
    renderSparkline(container, data) {
      if (!container || data.length < 2) return;
      
      const prices = data.map(d => d.price).reverse();
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);
      const range = maxPrice - minPrice || 1;
      
      const width = container.clientWidth || 100;
      const height = 40;
      
      // Create SVG
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      
      // Create path
      const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width;
        const y = height - ((price - minPrice) / range) * height;
        return `${x},${y}`;
      }).join(' ');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      path.setAttribute('points', points);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#d4af37');
      path.setAttribute('stroke-width', '2');
      
      svg.appendChild(path);
      container.innerHTML = '';
      container.appendChild(svg);
    },
    
    // Render market ticker
    async renderMarketTicker(container) {
      // This would show real market data
      // For now, show placeholder
      container.innerHTML = `
        <div class="market-ticker">
          <div class="ticker-header">
            <h4>Canlı Market Hareketleri</h4>
            <button class="btn-view-all">Tümünü Gör</button>
          </div>
          <div class="ticker-items">
            <div class="ticker-item positive">
              <span class="item-name">T8 Ore</span>
              <span class="item-change">+3.2%</span>
              <span class="item-price">4.250</span>
            </div>
            <div class="ticker-item negative">
              <span class="item-name">T7 Leather</span>
              <span class="item-change">-1.8%</span>
              <span class="item-price">3.120</span>
            </div>
            <div class="ticker-item positive">
              <span class="item-name">T6 Cloth</span>
              <span class="item-change">+2.5%</span>
              <span class="item-price">2.850</span>
            </div>
            <div class="ticker-item positive">
              <span class="item-name">T5 Wood</span>
              <span class="item-change">+4.1%</span>
              <span class="item-price">1.920</span>
            </div>
            <div class="ticker-item negative">
              <span class="item-name">T8 Bag</span>
              <span class="item-change">-0.9%</span>
              <span class="item-price">12.500</span>
            </div>
          </div>
        </div>
      `;
    },
    
    // Render player stats
    async renderPlayerStats(container) {
      const user = window.AuthSystem?.getCurrentUser();
      const stats = window.AuthSystem?.getUserStats();
      
      if (!user || !stats) {
        container.innerHTML = '<div class="empty">Giriş yapmış kullanıcı bulunamadı.</div>';
        return;
      }
      
      container.innerHTML = `
        <div class="player-stats">
          <div class="player-header">
            <div class="player-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="player-info">
              <h4>${user.username}</h4>
              <span class="player-status">${user.state === 'premium' ? 'Premium Üye' : 'Standart Üye'}</span>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-label">Oturum</span>
              <span class="stat-value">${stats.sessions}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Toplam Süre</span>
              <span class="stat-value">${Math.floor(stats.totalTime / 3600)}s</span>
            </div>
            <div class="stat">
              <span class="stat-label">Favoriler</span>
              <span class="stat-value">${stats.watchlistCount?.items || 0}</span>
            </div>
            <div class="stat">
              <span class="stat-label">İzlenenler</span>
              <span class="stat-value">${(stats.watchlistCount?.players || 0) + (stats.watchlistCount?.guilds || 0)}</span>
            </div>
          </div>
          <div class="player-actions">
            <button class="btn-view-profile">Profili Gör</button>
            <button class="btn-upgrade" ${user.state === 'premium' ? 'disabled' : ''}>
              ${user.state === 'premium' ? 'Premium' : 'Yükselt'}
            </button>
          </div>
        </div>
      `;
    },
    
    // Render watchlist
    async renderWatchlist(container) {
      const user = window.AuthSystem?.getCurrentUser();
      
      if (!user) {
        container.innerHTML = '<div class="empty">Giriş yapmış kullanıcı bulunamadı.</div>';
        return;
      }
      
      const items = user.stats.favoriteItems || [];
      const players = user.stats.watchedPlayers || [];
      const guilds = user.stats.watchedGuilds || [];
      
      if (items.length === 0 && players.length === 0 && guilds.length === 0) {
        container.innerHTML = `
          <div class="empty-watchlist">
            <i class="fa-solid fa-binoculars"></i>
            <p>Henüz izleme listeniz yok</p>
            <button class="btn-add-watchlist">Eşya/oyuncu ekle</button>
          </div>
        `;
        return;
      }
      
      container.innerHTML = `
        <div class="watchlist">
          <div class="watchlist-tabs">
            <button class="tab active" data-tab="items">Eşyalar (${items.length})</button>
            <button class="tab" data-tab="players">Oyuncular (${players.length})</button>
            <button class="tab" data-tab="guilds">Guild'lar (${guilds.length})</button>
          </div>
          <div class="watchlist-content">
            <div class="tab-content active" id="items">
              ${items.length > 0 ? items.slice(0, 5).map(item => `
                <div class="watchlist-item">
                  <i class="fa-solid fa-box"></i>
                  <span class="item-name">${item.name}</span>
                  <button class="btn-remove" data-id="${item.id}" data-type="item">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              `).join('') : '<div class="empty">Henüz eşya eklenmemiş</div>'}
            </div>
            <div class="tab-content" id="players">
              ${players.length > 0 ? players.slice(0, 5).map(player => `
                <div class="watchlist-item">
                  <i class="fa-solid fa-user"></i>
                  <span class="item-name">${player.name}</span>
                  <button class="btn-remove" data-id="${player.id}" data-type="player">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              `).join('') : '<div class="empty">Henüz oyuncu eklenmemiş</div>'}
            </div>
            <div class="tab-content" id="guilds">
              ${guilds.length > 0 ? guilds.slice(0, 5).map(guild => `
                <div class="watchlist-item">
                  <i class="fa-solid fa-users"></i>
                  <span class="item-name">${guild.name}</span>
                  <button class="btn-remove" data-id="${guild.id}" data-type="guild">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              `).join('') : '<div class="empty">Henüz guild eklenmemiş</div>'}
            </div>
          </div>
        </div>
      `;
    },
    
    // Render other widgets (placeholder implementations)
    async renderRecentEvents(container) {
      const events = window.DataPipeline?.getRecentEvents(5) || [];
      
      if (events.length === 0) {
        container.innerHTML = '<div class="empty">Henüz etkinlik yok</div>';
        return;
      }
      
      container.innerHTML = `
        <div class="recent-events">
          ${events.map(event => `
            <div class="event-item ${event.type}">
              <div class="event-icon">
                <i class="fa-solid fa-${this.getEventIcon(event.type)}"></i>
              </div>
              <div class="event-details">
                <div class="event-title">${this.getEventTitle(event)}</div>
                <div class="event-time">${new Date(event.timestamp).toLocaleTimeString('tr-TR')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },
    
    async renderQuickActions(container) {
      container.innerHTML = `
        <div class="quick-actions">
          <button class="action-btn" data-action="market_search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Market Ara</span>
          </button>
          <button class="action-btn" data-action="build_create">
            <i class="fa-solid fa-hammer"></i>
            <span>Build Oluştur</span>
          </button>
          <button class="action-btn" data-action="guild_plan">
            <i class="fa-solid fa-calendar-days"></i>
            <span>Operasyon Planla</span>
          </button>
          <button class="action-btn" data-action="player_track">
            <i class="fa-solid fa-user-plus"></i>
            <span>Oyuncu İzle</span>
          </button>
          <button class="action-btn" data-action="resource_calc">
            <i class="fa-solid fa-calculator"></i>
            <span>Kaynak Hesapla</span>
          </button>
          <button class="action-btn" data-action="route_plan">
            <i class="fa-solid fa-route"></i>
            <span>Rota Planla</span>
          </button>
        </div>
      `;
    },
    
    async renderBuildFavorites(container) {
      container.innerHTML = `
        <div class="build-favorites">
          <div class="empty">
            <i class="fa-solid fa-flask-vial"></i>
            <p>Henüz favori build'iniz yok</p>
            <button class="btn-create-build">Build oluştur</button>
          </div>
        </div>
      `;
    },
    
    async renderGuildUpdates(container) {
      container.innerHTML = `
        <div class="guild-updates">
          <div class="empty">
            <i class="fa-solid fa-users"></i>
            <p>Henüz guild güncellemesi yok</p>
            <button class="btn-join-guild">Guild ara</button>
          </div>
        </div>
      `;
    },
    
    // Helper methods for events
    getEventIcon(type) {
      switch (type) {
        case 'kill': return 'skull';
        case 'death': return 'ghost';
        case 'guild_join': return 'user-plus';
        case 'territory_change': return 'flag';
        default: return 'bell';
      }
    },
    
    getEventTitle(event) {
      switch (event.type) {
        case 'kill': return `${event.player} bir oyuncuyu öldürdü`;
        case 'death': return `${event.player} öldürüldü`;
        case 'guild_join': return `${event.player} ${event.guild} guild'ına katıldı`;
        case 'territory_change': return `${event.guild} bölge kontrolü kazandı`;
        default: return 'Bilinmeyen etkinlik';
      }
    },
    
    // Render quick modules
    renderQuickModules() {
      const modulesContainer = document.querySelector('.modules-grid');
      if (!modulesContainer) return;
      
      modulesContainer.innerHTML = '';
      
      this.modulesList.filter(module => !module.parent).forEach(module => {
        const moduleElement = document.createElement('div');
        moduleElement.className = 'module-card';
        moduleElement.dataset.module = module.id;
        
        moduleElement.innerHTML = `
          <div class="module-icon">
            <i class="fa-solid ${module.icon}"></i>
          </div>
          <div class="module-info">
            <h4>${module.name}</h4>
            <p class="module-desc">${this.getModuleDescription(module.id)}</p>
          </div>
          <button class="btn-open-module" data-module="${module.id}">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        `;
        
        modulesContainer.appendChild(moduleElement);
      });
    },
    
    getModuleDescription(moduleId) {
      const descriptions = {
        dashboard: 'Tüm araçları kontrol et',
        maps: 'Harita ve konum araçları',
        combat: 'Build ve savaş analizi',
        economy: 'Market ve ekonomi araçları',
        guild: 'Guild yönetim araçları',
        analytics: 'Detaylı istatistikler',
        community: 'Topluluk araçları',
      };
      
      return descriptions[moduleId] || 'Modül açıklaması';
    },
    
    // Render sidebar
    renderSidebar() {
      let sidebar = document.getElementById('dashboardSidebar');
      if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.id = 'dashboardSidebar';
        sidebar.className = `dashboard-sidebar ${this.state.collapsed ? 'collapsed' : ''}`;
        document.body.appendChild(sidebar);
      }
      
      sidebar.innerHTML = `
        <div class="sidebar-header">
          <button class="btn-collapse" title="${this.state.collapsed ? 'Genişlet' : 'Daralt'}">
            <i class="fa-solid fa-${this.state.collapsed ? 'chevron-right' : 'chevron-left'}"></i>
          </button>
          ${!this.state.collapsed ? '<h3>Albion Araçları</h3>' : ''}
        </div>
        <div class="sidebar-modules">
          ${this.modulesList.filter(module => !module.parent).map(module => `
            <button class="sidebar-module ${this.state.activeModule === module.id ? 'active' : ''}" 
                    data-module="${module.id}"
                    title="${module.name}">
              <i class="fa-solid ${module.icon}"></i>
              ${!this.state.collapsed ? `<span>${module.name}</span>` : ''}
            </button>
          `).join('')}
        </div>
        <div class="sidebar-footer">
          ${!this.state.collapsed ? `
            <div class="user-info">
              <i class="fa-solid fa-user"></i>
              <span>${window.AuthSystem?.getCurrentUser()?.username || 'Guest'}</span>
            </div>
          ` : ''}
          <button class="btn-settings" title="Ayarlar">
            <i class="fa-solid fa-gear"></i>
            ${!this.state.collapsed ? '<span>Ayarlar</span>' : ''}
          </button>
        </div>
      `;
    },
    
    // Render module view
    async renderModuleView(container, moduleId) {
      const module = this.modulesList.find(m => m.id === moduleId);
      
      container.innerHTML = `
        <div class="module-header">
          <button class="btn-back-to-dashboard">
            <i class="fa-solid fa-arrow-left"></i> Kontrol Paneli
          </button>
          <h1><i class="fa-solid ${module?.icon || 'fa-puzzle-piece'}"></i> ${module?.name || moduleId}</h1>
          <div class="module-actions">
            <!-- Module specific actions will be added here -->
          </div>
        </div>
        <div class="module-content" id="${moduleId}-content">
          <div class="loading-module">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>${module?.name || moduleId} yükleniyor...</p>
          </div>
        </div>
      `;
      
      // Load module content
      setTimeout(() => this.loadModuleContent(moduleId), 100);
    },
    
    // Load module content
    async loadModuleContent(moduleId) {
      const contentDiv = document.getElementById(`${moduleId}-content`);
      if (!contentDiv) return;
      
      try {
        // This would load the actual module
        // For now, show placeholder
        contentDiv.innerHTML = `
          <div class="module-placeholder">
            <i class="fa-solid ${this.modulesList.find(m => m.id === moduleId)?.icon || 'fa-puzzle-piece'} fa-4x"></i>
            <h2>${this.modulesList.find(m => m.id === moduleId)?.name || moduleId}</h2>
            <p>Bu modül yakında eklenecek. Geliştirme devam ediyor.</p>
            <button class="btn-back-to-dashboard">Kontrol Paneline Dön</button>
          </div>
        `;
      } catch (error) {
        console.error(`Failed to load module ${moduleId}:`, error);
        contentDiv.innerHTML = '<div class="error">Modül yüklenirken hata oluştu.</div>';
      }
    },
    
    // Add event listeners
    addEventListeners() {
      // Module switching
      document.addEventListener('click', (e) => {
        // Module buttons in sidebar
        if (e.target.closest('.sidebar-module')) {
          const button = e.target.closest('.sidebar-module');
          const moduleId = button.dataset.module;
          this.switchModule(moduleId);
        }
        
        // Module cards in dashboard
        if (e.target.closest('.btn-open-module')) {
          const button = e.target.closest('.btn-open-module');
          const moduleId = button.dataset.module;
          this.switchModule(moduleId);
        }
        
        // Back to dashboard
        if (e.target.closest('.btn-back-to-dashboard')) {
          this.switchModule('dashboard');
        }
        
        // Widget refresh
        if (e.target.closest('.btn-refresh-widget')) {
          const widgetDiv = e.target.closest('.widget');
          const widgetId = widgetDiv.dataset.widget;
          this.refreshWidget(widgetId, widgetDiv);
        }
        
        // Widget remove
        if (e.target.closest('.btn-remove-widget')) {
          const widgetDiv = e.target.closest('.widget');
          const widgetId = widgetDiv.dataset.widget;
          this.removeWidget(widgetId, widgetDiv);
        }
        
        // Quick actions
        if (e.target.closest('.action-btn')) {
          const button = e.target.closest('.action-btn');
          const action = button.dataset.action;
          this.handleQuickAction(action);
        }
        
        // Sidebar collapse
        if (e.target.closest('.btn-collapse')) {
          this.toggleSidebar();
        }
        
        // Dashboard refresh
        if (e.target.closest('.btn-refresh')) {
          this.refreshDashboard();
        }
        
        // Layout change
        if (e.target.closest('.btn-layout')) {
          this.toggleLayout();
        }
        
        // Settings
        if (e.target.closest('.btn-settings')) {
          this.openSettings();
        }
      });
      
      // Watchlist tabs
      document.addEventListener('click', (e) => {
        if (e.target.closest('.watchlist-tabs .tab')) {
          const tab = e.target.closest('.tab');
          const tabId = tab.dataset.tab;
          
          // Update active tab
          tab.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Show corresponding content
          tab.closest('.watchlist').querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          document.getElementById(tabId)?.classList.add('active');
        }
        
        // Remove from watchlist
        if (e.target.closest('.btn-remove')) {
          const button = e.target.closest('.btn-remove');
          const id = button.dataset.id;
          const type = button.dataset.type;
          
          window.AuthSystem?.removeFromWatchlist(type, id);
          this.refreshWidget('watchlist');
        }
      });
    },
    
    // Switch active module
    switchModule(moduleId) {
      this.state.activeModule = moduleId;
      this.saveState();
      this.render();
    },
    
    // Refresh widget
    refreshWidget(widgetId, widgetElement = null) {
      if (!widgetElement) {
        widgetElement = document.querySelector(`.widget-${widgetId}`);
      }
      
      if (widgetElement) {
        const contentDiv = widgetElement.querySelector('.widget-content');
        if (contentDiv) {
          contentDiv.innerHTML = '<div class="loading">Yenileniyor...</div>';
          setTimeout(() => this.loadWidgetContent(widgetId, widgetElement), 500);
        }
      }
    },
    
    // Remove widget
    removeWidget(widgetId, widgetElement) {
      if (!this.state.widgets) {
        this.state.widgets = {};
      }
      
      this.state.widgets[widgetId] = false;
      this.saveState();
      
      if (widgetElement) {
        widgetElement.remove();
      }
    },
    
    // Handle quick action
    handleQuickAction(action) {
      console.log('Quick action:', action);
      // Implement quick actions
      switch (action) {
        case 'market_search':
          this.switchModule('market_dashboard');
          break;
        case 'build_create':
          this.switchModule('build_simulator');
          break;
        case 'guild_plan':
          this.switchModule('guild_operations');
          break;
        case 'player_track':
          // Open player search modal
          break;
        case 'resource_calc':
          // Open resource calculator
          break;
        case 'route_plan':
          this.switchModule('maps');
          break;
      }
    },
    
    // Toggle sidebar
    toggleSidebar() {
      this.state.collapsed = !this.state.collapsed;
      this.saveState();
      this.renderSidebar();
    },
    
    // Refresh dashboard
    refreshDashboard() {
      this.render();
    },
    
    // Toggle layout
    toggleLayout() {
      this.state.layout = this.state.layout === 'grid' ? 'list' : 'grid';
      this.saveState();
      this.render();
    },
    
    // Open settings
    openSettings() {
      console.log('Opening settings...');
      // Implement settings modal
    },
    
    // Start auto-updates
    startAutoUpdates() {
      // Update server status every minute
      setInterval(() => {
        const serverWidget = document.querySelector('.widget-server_status');
        if (serverWidget && serverWidget.querySelector('.widget-content')) {
          this.refreshWidget('server_status', serverWidget);
        }
      }, 60 * 1000);
      
      // Update gold prices every 5 minutes
      setInterval(() => {
        const goldWidget = document.querySelector('.widget-gold_prices');
        if (goldWidget && goldWidget.querySelector('.widget-content')) {
          this.refreshWidget('gold_prices', goldWidget);
        }
      }, 5 * 60 * 1000);
      
      // Update market ticker every 2 minutes
      setInterval(() => {
        const marketWidget = document.querySelector('.widget-market_ticker');
        if (marketWidget && marketWidget.querySelector('.widget-content')) {
          this.refreshWidget('market_ticker', marketWidget);
        }
      }, 2 * 60 * 1000);
    },
    
    // Destroy
    destroy() {
      console.log('Unified Dashboard destroyed');
    },
  };
  
  // Initialize on window load
  window.addEventListener('load', async () => {
    // Wait a bit for other systems to initialize
    setTimeout(async () => {
      window.UnifiedDashboard = await UnifiedDashboard.init();
    }, 1000);
  });
  
  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedDashboard;
  } else {
    window.UnifiedDashboard = UnifiedDashboard;
  }
})();