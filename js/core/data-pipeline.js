/* Data Pipeline - Real-time data collection and processing */
(function () {
  const DataPipeline = {
    // Data collectors
    collectors: {
      market: null,
      gold: null,
      events: null,
      server: null,
    },
    
    // Data storage
    storage: {
      market: new Map(),
      gold: [],
      events: [],
      server: { status: 'unknown', players: 0 },
      players: new Map(),
      guilds: new Map(),
    },
    
    // Subscribers
    subscribers: new Map(),
    
    // Initialize
    async init() {
      console.log('Data Pipeline initializing...');
      
      // Load initial data
      await this.loadInitialData();
      
      // Start collectors
      this.startCollectors();
      
      console.log('Data Pipeline initialized');
      return this;
    },
    
    // Load initial data
    async loadInitialData() {
      try {
        // Load server status
        this.storage.server = await window.AlbionCore?.getServerStatus() || { status: 'unknown', players: 0 };
        
        // Load gold prices
        const goldData = await window.AlbionCore?.getGoldPrices(12);
        if (goldData && Array.isArray(goldData)) {
          this.storage.gold = goldData;
        }
        
        // Load recent events (last 24h)
        await this.loadRecentEvents();
        
        // Load player cache from storage
        await this.loadPlayerCache();
        
        // Load guild cache from storage
        await this.loadGuildCache();
        
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    },
    
    // Start data collectors
    startCollectors() {
      // Market data collector (every 2 minutes)
      this.collectors.market = setInterval(async () => {
        await this.collectMarketData();
      }, 2 * 60 * 1000);
      
      // Gold price collector (every 5 minutes)
      this.collectors.gold = setInterval(async () => {
        await this.collectGoldPrices();
      }, 5 * 60 * 1000);
      
      // Server status collector (every minute)
      this.collectors.server = setInterval(async () => {
        await this.collectServerStatus();
      }, 60 * 1000);
      
      // Event collector (every 10 minutes)
      this.collectors.events = setInterval(async () => {
        await this.collectEvents();
      }, 10 * 60 * 1000);
    },
    
    // Collect market data for watched items
    async collectMarketData() {
      try {
        const watchedItems = this.getWatchedItems();
        if (watchedItems.length === 0) return;
        
        const chunkSize = 10; // API limit
        for (let i = 0; i < watchedItems.length; i += chunkSize) {
          const chunk = watchedItems.slice(i, i + chunkSize);
          const marketData = await window.AlbionCore?.getMarketData(chunk);
          
          if (marketData && Array.isArray(marketData)) {
            marketData.forEach(item => {
              this.storage.market.set(item.item_id, item);
            });
            
            // Notify subscribers
            this.notifySubscribers('market', { items: chunk, data: marketData });
          }
          
          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Market data collection failed:', error);
      }
    },
    
    // Collect gold prices
    async collectGoldPrices() {
      try {
        const goldData = await window.AlbionCore?.getGoldPrices(24);
        if (goldData && Array.isArray(goldData)) {
          this.storage.gold = goldData;
          this.notifySubscribers('gold', { data: goldData });
        }
      } catch (error) {
        console.error('Gold price collection failed:', error);
      }
    },
    
    // Collect server status
    async collectServerStatus() {
      try {
        const serverStatus = await window.AlbionCore?.getServerStatus();
        if (serverStatus) {
          this.storage.server = serverStatus;
          this.notifySubscribers('server', { data: serverStatus });
        }
      } catch (error) {
        console.error('Server status collection failed:', error);
      }
    },
    
    // Collect events
    async collectEvents() {
      try {
        // This would typically come from killboard API
        // For now, we'll simulate
        const newEvents = [];
        const eventTypes = ['kill', 'death', 'guild_join', 'territory_change'];
        
        for (let i = 0; i < 5; i++) {
          newEvents.push({
            id: Date.now() + i,
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            player: `Player${Math.floor(Math.random() * 1000)}`,
            guild: `Guild${Math.floor(Math.random() * 100)}`,
            timestamp: new Date().toISOString(),
            value: Math.floor(Math.random() * 1000000),
          });
        }
        
        this.storage.events = [...newEvents, ...this.storage.events.slice(0, 50)];
        this.notifySubscribers('events', { data: newEvents });
        
      } catch (error) {
        console.error('Event collection failed:', error);
      }
    },
    
    // Load recent events
    async loadRecentEvents() {
      // Placeholder - would load from killboard API
      this.storage.events = [];
    },
    
    // Load player cache
    async loadPlayerCache() {
      try {
        const cache = await window.miniappsAI?.storage.getItem('playerCache');
        if (cache) {
          const data = JSON.parse(cache);
          data.forEach(player => {
            this.storage.players.set(player.id, player);
          });
        }
      } catch (error) {
        console.error('Failed to load player cache:', error);
      }
    },
    
    // Save player cache
    async savePlayerCache() {
      try {
        const players = Array.from(this.storage.players.values());
        await window.miniappsAI?.storage.setItem('playerCache', JSON.stringify(players));
      } catch (error) {
        console.error('Failed to save player cache:', error);
      }
    },
    
    // Load guild cache
    async loadGuildCache() {
      try {
        const cache = await window.miniappsAI?.storage.getItem('guildCache');
        if (cache) {
          const data = JSON.parse(cache);
          data.forEach(guild => {
            this.storage.guilds.set(guild.id, guild);
          });
        }
      } catch (error) {
        console.error('Failed to load guild cache:', error);
      }
    },
    
    // Save guild cache
    async saveGuildCache() {
      try {
        const guilds = Array.from(this.storage.guilds.values());
        await window.miniappsAI?.storage.setItem('guildCache', JSON.stringify(guilds));
      } catch (error) {
        console.error('Failed to save guild cache:', error);
      }
    },
    
    // Get watched items from storage
    getWatchedItems() {
      // This would come from user preferences
      // For now, return some default items
      return [
        'T4_BAG',
        'T5_BAG',
        'T6_BAG',
        'T7_BAG',
        'T8_BAG',
        'T4_ORE',
        'T5_ORE',
        'T6_ORE',
        'T7_ORE',
        'T8_ORE',
        'T4_WOOD',
        'T5_WOOD',
        'T6_WOOD',
        'T7_WOOD',
        'T8_WOOD',
      ];
    },
    
    // Subscribe to data updates
    subscribe(type, callback, id = null) {
      const subId = id || Date.now().toString();
      if (!this.subscribers.has(type)) {
        this.subscribers.set(type, new Map());
      }
      this.subscribers.get(type).set(subId, callback);
      return subId;
    },
    
    // Unsubscribe
    unsubscribe(type, id) {
      if (this.subscribers.has(type)) {
        this.subscribers.get(type).delete(id);
      }
    },
    
    // Notify subscribers
    notifySubscribers(type, data) {
      if (this.subscribers.has(type)) {
        this.subscribers.get(type).forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error('Subscriber callback error:', error);
          }
        });
      }
    },
    
    // Get market data for item
    getMarketData(itemId) {
      return this.storage.market.get(itemId);
    },
    
    // Get gold price history
    getGoldHistory() {
      return this.storage.gold;
    },
    
    // Get server status
    getServerStatus() {
      return this.storage.server;
    },
    
    // Get recent events
    getRecentEvents(limit = 10) {
      return this.storage.events.slice(0, limit);
    },
    
    // Get player data
    async getPlayerData(playerId, forceRefresh = false) {
      // Check cache
      if (!forceRefresh && this.storage.players.has(playerId)) {
        return this.storage.players.get(playerId);
      }
      
      // Fetch from API
      try {
        const playerData = await window.AlbionCore?.getPlayerDetails(playerId);
        if (playerData) {
          this.storage.players.set(playerId, playerData);
          this.savePlayerCache();
          return playerData;
        }
      } catch (error) {
        console.error('Failed to get player data:', error);
      }
      
      return null;
    },
    
    // Get guild data
    async getGuildData(guildId, forceRefresh = false) {
      // Check cache
      if (!forceRefresh && this.storage.guilds.has(guildId)) {
        return this.storage.guilds.get(guildId);
      }
      
      // Fetch from API
      try {
        const guildData = await window.AlbionCore?.getGuildDetails(guildId);
        if (guildData) {
          this.storage.guilds.set(guildId, guildData);
          this.saveGuildCache();
          return guildData;
        }
      } catch (error) {
        console.error('Failed to get guild data:', error);
      }
      
      return null;
    },
    
    // Search players
    async searchPlayers(query) {
      try {
        return await window.AlbionCore?.searchPlayers(query);
      } catch (error) {
        console.error('Player search failed:', error);
        return [];
      }
    },
    
    // Search guilds
    async searchGuilds(query) {
      try {
        return await window.AlbionCore?.searchGuilds(query);
      } catch (error) {
        console.error('Guild search failed:', error);
        return [];
      }
    },
    
    // Add item to watchlist
    addToWatchlist(itemId) {
      const watched = this.getWatchedItems();
      if (!watched.includes(itemId)) {
        watched.push(itemId);
        // Save to storage
        // This would save to user preferences
      }
    },
    
    // Remove item from watchlist
    removeFromWatchlist(itemId) {
      const watched = this.getWatchedItems();
      const index = watched.indexOf(itemId);
      if (index > -1) {
        watched.splice(index, 1);
        // Save to storage
      }
    },
    
    // Cleanup
    destroy() {
      // Clear all intervals
      Object.values(this.collectors).forEach(interval => {
        if (interval) clearInterval(interval);
      });
      
      // Clear storage
      this.storage.market.clear();
      this.storage.players.clear();
      this.storage.guilds.clear();
      this.storage.gold = [];
      this.storage.events = [];
      
      // Clear subscribers
      this.subscribers.clear();
      
      console.log('Data Pipeline destroyed');
    },
  };
  
  // Initialize on window load
  window.addEventListener('load', async () => {
    window.DataPipeline = await DataPipeline.init();
  });
  
  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataPipeline;
  } else {
    window.DataPipeline = DataPipeline;
  }
})();