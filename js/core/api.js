/* Core API Layer - Albion Online Ultimate Platform */
(function () {
  const AlbionCore = {
    version: '1.0.0',
    
    // API Endpoints
    endpoints: {
      market: 'https://europe.albion-online-data.com/api/v2/stats/prices',
      gold: 'https://europe.albion-online-data.com/api/v2/stats/gold',
      killboard: 'https://gameinfo.albiononline.com/api/gameinfo/players',
      guild: 'https://gameinfo.albiononline.com/api/gameinfo/guilds',
      search: 'https://gameinfo.albiononline.com/api/gameinfo/search',
      map: 'https://map.albiononline.com/api/v1/map',
    },
    
    // Cache System
    cache: new Map(),
    cacheDuration: 5 * 60 * 1000, // 5 minutes
    
    // Rate Limiting
    rateLimit: {
      requests: 0,
      lastReset: Date.now(),
      maxRequests: 30,
      resetInterval: 60000, // 1 minute
    },
    
    // API Call with caching and rate limiting
    async apiCall(endpoint, params = {}, options = {}) {
      // Check rate limit
      const now = Date.now();
      if (now - this.rateLimit.lastReset > this.rateLimit.resetInterval) {
        this.rateLimit.requests = 0;
        this.rateLimit.lastReset = now;
      }
      
      if (this.rateLimit.requests >= this.rateLimit.maxRequests) {
        throw new Error('Rate limit exceeded. Please wait.');
      }
      
      // Build cache key
      const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
      
      // Check cache
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (now - cached.timestamp < this.cacheDuration) {
          return cached.data;
        }
        this.cache.delete(cacheKey);
      }
      
      // Build URL
      let url = endpoint;
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams(params);
        url += `?${queryParams}`;
      }
      
      try {
        // Try multiple proxies for CORS
        const proxies = [
          url,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
          `https://corsproxy.io/?${encodeURIComponent(url)}`,
        ];
        
        let response;
        for (const proxyUrl of proxies) {
          try {
            response = await fetch(proxyUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              ...options,
            });
            
            if (response.ok) break;
          } catch (err) {
            continue;
          }
        }
        
        if (!response || !response.ok) {
          throw new Error(`API request failed: ${response?.status || 'No response'}`);
        }
        
        const data = await response.json();
        
        // Cache the response
        this.cache.set(cacheKey, {
          data,
          timestamp: now,
        });
        
        this.rateLimit.requests++;
        return data;
      } catch (error) {
        console.error('API call failed:', error);
        throw error;
      }
    },
    
    // Market Data
    async getMarketData(itemIds, locations = ['Thetford', 'Martlock', 'Lymhurst', 'Bridgewatch', 'Fort Sterling'], qualities = [1]) {
      const params = {
        items: itemIds.join(','),
        locations: locations.join(','),
        qualities: qualities.join(','),
      };
      
      return await this.apiCall(this.endpoints.market, params);
    },
    
    // Gold Prices
    async getGoldPrices(count = 24) {
      return await this.apiCall(this.endpoints.gold, { count });
    },
    
    // Player Search
    async searchPlayers(query, limit = 10) {
      return await this.apiCall(`${this.endpoints.killboard}/search`, { q: query, limit });
    },
    
    // Player Details
    async getPlayerDetails(playerId) {
      return await this.apiCall(`${this.endpoints.killboard}/${playerId}`);
    },
    
    // Guild Search
    async searchGuilds(query, limit = 10) {
      return await this.apiCall(`${this.endpoints.guild}/search`, { q: query, limit });
    },
    
    // Guild Details
    async getGuildDetails(guildId) {
      return await this.apiCall(`${this.endpoints.guild}/${guildId}`);
    },
    
    // Item Search
    async searchItems(query, limit = 20) {
      return await this.apiCall(this.endpoints.search, { q: query });
    },
    
    // Map Data
    async getMapData(cluster = 'EU', map = 'default') {
      return await this.apiCall(`${this.endpoints.map}/${cluster}/${map}`);
    },
    
    // Clear Cache
    clearCache(pattern = null) {
      if (!pattern) {
        this.cache.clear();
      } else {
        for (const [key] of this.cache) {
          if (key.includes(pattern)) {
            this.cache.delete(key);
          }
        }
      }
    },
    
    // Get Server Status
    async getServerStatus() {
      try {
        const response = await fetch('https://serverstatus.albiononline.com/index.txt');
        if (!response.ok) return { status: 'unknown', players: 0 };
        
        const text = await response.text();
        const lines = text.split('\n');
        const status = {};
        
        lines.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            status[key.trim()] = value.trim();
          }
        });
        
        return {
          status: status.ServerStatus || 'unknown',
          players: parseInt(status.TotalOnlinePlayers) || 0,
          queue: parseInt(status.QueuePlayers) || 0,
          lastUpdate: status.Timestamp || new Date().toISOString(),
        };
      } catch (error) {
        console.error('Failed to get server status:', error);
        return { status: 'error', players: 0, queue: 0, lastUpdate: new Date().toISOString() };
      }
    },
    
    // Get Patch Notes
    async getPatchNotes(limit = 5) {
      try {
        const response = await fetch('https://forum.albiononline.com/index.php/forums/update-notes.30/index.rss');
        if (!response.ok) return [];
        
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        
        const items = xml.querySelectorAll('item');
        const patches = [];
        
        items.forEach((item, index) => {
          if (index >= limit) return;
          
          const title = item.querySelector('title')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          
          patches.push({
            title: title.replace(/^Update Notes:\s*/i, ''),
            link,
            date: new Date(pubDate),
            description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
          });
        });
        
        return patches;
      } catch (error) {
        console.error('Failed to get patch notes:', error);
        return [];
      }
    },
  };
  
  // Initialize on window load
  window.addEventListener('load', () => {
    window.AlbionCore = AlbionCore;
    console.log('AlbionCore API Layer initialized');
  });
  
  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlbionCore;
  } else {
    window.AlbionCore = AlbionCore;
  }
})();