/* Advanced Storage System with IndexedDB & LocalStorage fallback */
(function () {
  const StorageSystem = {
    // Storage types
    TYPES: {
      LOCAL: 'local',
      SESSION: 'session',
      INDEXED_DB: 'indexeddb',
      MEMORY: 'memory',
    },
    
    // Current storage
    currentStorage: null,
    
    // Storage configurations
    config: {
      name: 'albion_platform',
      version: 1,
      maxSize: 50 * 1024 * 1024, // 50MB
      autoCleanup: true,
      cleanupThreshold: 0.8, // Cleanup when 80% full
    },
    
    // Initialize storage system
    async init(config = {}) {
      console.log('Storage System initializing...');
      
      // Merge config
      this.config = { ...this.config, ...config };
      
      // Try to initialize IndexedDB
      try {
        this.currentStorage = await this.initIndexedDB();
        console.log('Using IndexedDB storage');
      } catch (error) {
        console.warn('IndexedDB failed, falling back to localStorage:', error);
        this.currentStorage = this.initLocalStorage();
        console.log('Using localStorage storage');
      }
      
      // Start auto-cleanup if enabled
      if (this.config.autoCleanup) {
        this.startAutoCleanup();
      }
      
      console.log('Storage System initialized');
      return this;
    },
    
    // Initialize IndexedDB
    async initIndexedDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.config.name, this.config.version);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          resolve({
            type: this.TYPES.INDEXED_DB,
            db,
            get: async (key) => await this.idbGet(db, key),
            set: async (key, value) => await this.idbSet(db, key, value),
            remove: async (key) => await this.idbRemove(db, key),
            clear: async () => await this.idbClear(db),
            keys: async () => await this.idbKeys(db),
            size: async () => await this.idbSize(db),
          });
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create object store if it doesn't exist
          if (!db.objectStoreNames.contains('data')) {
            const store = db.createObjectStore('data', { keyPath: 'key' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('category', 'category', { unique: false });
          }
        };
      });
    },
    
    // Initialize LocalStorage
    initLocalStorage() {
      return {
        type: this.TYPES.LOCAL,
        get: (key) => this.localGet(key),
        set: (key, value) => this.localSet(key, value),
        remove: (key) => this.localRemove(key),
        clear: () => this.localClear(),
        keys: () => this.localKeys(),
        size: () => this.localSize(),
      };
    },
    
    // IndexedDB methods
    async idbGet(db, key) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['data'], 'readonly');
        const store = transaction.objectStore('data');
        const request = store.get(key);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          if (request.result) {
            // Check if expired
            if (request.result.expires && request.result.expires < Date.now()) {
              this.idbRemove(db, key);
              resolve(null);
            } else {
              resolve(request.result.value);
            }
          } else {
            resolve(null);
          }
        };
      });
    },
    
    async idbSet(db, key, value, options = {}) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['data'], 'readwrite');
        const store = transaction.objectStore('data');
        
        const item = {
          key,
          value,
          timestamp: Date.now(),
          expires: options.expires,
          category: options.category || 'default',
          size: JSON.stringify(value)?.length || 0,
        };
        
        const request = store.put(item);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    },
    
    async idbRemove(db, key) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['data'], 'readwrite');
        const store = transaction.objectStore('data');
        const request = store.delete(key);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    },
    
    async idbClear(db) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['data'], 'readwrite');
        const store = transaction.objectStore('data');
        const request = store.clear();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(true);
      });
    },
    
    async idbKeys(db) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['data'], 'readonly');
        const store = transaction.objectStore('data');
        const request = store.getAllKeys();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    },
    
    async idbSize(db) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['data'], 'readonly');
        const store = transaction.objectStore('data');
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const totalSize = request.result.reduce((sum, item) => sum + (item.size || 0), 0);
          resolve({
            items: request.result.length,
            size: totalSize,
            maxSize: this.config.maxSize,
            percentage: (totalSize / this.config.maxSize) * 100,
          });
        };
      });
    },
    
    // LocalStorage methods
    localGet(key) {
      try {
        const item = localStorage.getItem(`albion_${key}`);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        
        // Check if expired
        if (parsed.expires && parsed.expires < Date.now()) {
          this.localRemove(key);
          return null;
        }
        
        return parsed.value;
      } catch (error) {
        console.error('LocalStorage get error:', error);
        return null;
      }
    },
    
    localSet(key, value, options = {}) {
      try {
        const item = {
          value,
          timestamp: Date.now(),
          expires: options.expires,
          category: options.category || 'default',
        };
        
        localStorage.setItem(`albion_${key}`, JSON.stringify(item));
        return true;
      } catch (error) {
        console.error('LocalStorage set error:', error);
        return false;
      }
    },
    
    localRemove(key) {
      try {
        localStorage.removeItem(`albion_${key}`);
        return true;
      } catch (error) {
        console.error('LocalStorage remove error:', error);
        return false;
      }
    },
    
    localClear() {
      try {
        // Only clear our app's keys
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('albion_')) {
            localStorage.removeItem(key);
          }
        });
        return true;
      } catch (error) {
        console.error('LocalStorage clear error:', error);
        return false;
      }
    },
    
    localKeys() {
      try {
        const keys = Object.keys(localStorage);
        return keys.filter(key => key.startsWith('albion_')).map(key => key.replace('albion_', ''));
      } catch (error) {
        console.error('LocalStorage keys error:', error);
        return [];
      }
    },
    
    localSize() {
      try {
        const keys = this.localKeys();
        let totalSize = 0;
        
        keys.forEach(key => {
          const item = localStorage.getItem(`albion_${key}`);
          if (item) {
            totalSize += item.length;
          }
        });
        
        return {
          items: keys.length,
          size: totalSize,
          maxSize: this.config.maxSize,
          percentage: (totalSize / this.config.maxSize) * 100,
        };
      } catch (error) {
        console.error('LocalStorage size error:', error);
        return { items: 0, size: 0, maxSize: this.config.maxSize, percentage: 0 };
      }
    },
    
    // Public API methods
    async getItem(key) {
      if (!this.currentStorage) {
        throw new Error('Storage not initialized');
      }
      
      return await this.currentStorage.get(key);
    },
    
    async setItem(key, value, options = {}) {
      if (!this.currentStorage) {
        throw new Error('Storage not initialized');
      }
      
      const result = await this.currentStorage.set(key, value, options);
      
      // Check if we need cleanup
      if (this.config.autoCleanup) {
        const size = await this.currentStorage.size();
        if (size.percentage > this.config.cleanupThreshold * 100) {
          await this.cleanup();
        }
      }
      
      return result;
    },
    
    async removeItem(key) {
      if (!this.currentStorage) {
        throw new Error('Storage not initialized');
      }
      
      return await this.currentStorage.remove(key);
    },
    
    async clear() {
      if (!this.currentStorage) {
        throw new Error('Storage not initialized');
      }
      
      return await this.currentStorage.clear();
    },
    
    async keys() {
      if (!this.currentStorage) {
        throw new Error('Storage not initialized');
      }
      
      return await this.currentStorage.keys();
    },
    
    async size() {
      if (!this.currentStorage) {
        throw new Error('Storage not initialized');
      }
      
      return await this.currentStorage.size();
    },
    
    // Advanced storage operations
    async getWithExpiry(key) {
      const value = await this.getItem(key);
      if (!value) return null;
      
      // Check if we have expiry info
      try {
        const item = await this.currentStorage.db?.get?.(key) || {};
        return {
          value,
          timestamp: item.timestamp,
          expires: item.expires,
          category: item.category,
        };
      } catch (error) {
        return { value, timestamp: Date.now() };
      }
    },
    
    async setWithExpiry(key, value, ttl = 0, category = 'default') {
      const expires = ttl > 0 ? Date.now() + ttl : null;
      return await this.setItem(key, value, { expires, category });
    },
    
    async getByCategory(category) {
      try {
        if (this.currentStorage.type === this.TYPES.INDEXED_DB) {
          const db = this.currentStorage.db;
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readonly');
            const store = transaction.objectStore('data');
            const index = store.index('category');
            const request = index.getAll(category);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
              const items = request.result.map(item => ({
                key: item.key,
                value: item.value,
                timestamp: item.timestamp,
              }));
              resolve(items);
            };
          });
        } else {
          // For localStorage, we need to filter
          const keys = await this.keys();
          const items = [];
          
          for (const key of keys) {
            const item = await this.getWithExpiry(key);
            if (item && item.category === category) {
              items.push({ key, value: item.value, timestamp: item.timestamp });
            }
          }
          
          return items;
        }
      } catch (error) {
        console.error('Get by category error:', error);
        return [];
      }
    },
    
    // Cleanup oldest items
    async cleanup(threshold = this.config.cleanupThreshold) {
      console.log('Starting storage cleanup...');
      
      try {
        if (this.currentStorage.type === this.TYPES.INDEXED_DB) {
          const db = this.currentStorage.db;
          const size = await this.size();
          
          if (size.percentage <= threshold * 100) {
            console.log('Storage not at threshold, skipping cleanup');
            return;
          }
          
          // Get all items sorted by timestamp (oldest first)
          const items = await new Promise((resolve, reject) => {
            const transaction = db.transaction(['data'], 'readonly');
            const store = transaction.objectStore('data');
            const index = store.index('timestamp');
            const request = index.getAll();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
          });
          
          // Remove items until we're below threshold
          let removed = 0;
          let currentSize = size.size;
          const targetSize = this.config.maxSize * threshold;
          
          for (const item of items) {
            if (currentSize <= targetSize) break;
            
            await this.idbRemove(db, item.key);
            currentSize -= (item.size || 0);
            removed++;
          }
          
          console.log(`Cleanup completed: removed ${removed} items`);
        }
        // localStorage cleanup would be similar but simpler
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    },
    
    // Backup and restore
    async backup() {
      try {
        const keys = await this.keys();
        const backup = {
          timestamp: Date.now(),
          version: this.config.version,
          items: [],
        };
        
        for (const key of keys) {
          const value = await this.getItem(key);
          if (value !== null) {
            backup.items.push({ key, value });
          }
        }
        
        return backup;
      } catch (error) {
        console.error('Backup error:', error);
        return null;
      }
    },
    
    async restore(backup) {
      if (!backup || !backup.items || !Array.isArray(backup.items)) {
        throw new Error('Invalid backup data');
      }
      
      console.log(`Restoring ${backup.items.length} items from backup...`);
      
      let restored = 0;
      let failed = 0;
      
      for (const item of backup.items) {
        try {
          await this.setItem(item.key, item.value);
          restored++;
        } catch (error) {
          console.error(`Failed to restore item ${item.key}:`, error);
          failed++;
        }
      }
      
      console.log(`Restore completed: ${restored} restored, ${failed} failed`);
      return { restored, failed };
    },
    
    // Export to JSON
    async exportToJSON() {
      const backup = await this.backup();
      return JSON.stringify(backup, null, 2);
    },
    
    // Import from JSON
    async importFromJSON(json) {
      try {
        const backup = JSON.parse(json);
        return await this.restore(backup);
      } catch (error) {
        console.error('Import from JSON error:', error);
        throw new Error('Invalid JSON format');
      }
    },
    
    // Start auto-cleanup interval
    startAutoCleanup(interval = 30 * 60 * 1000) { // 30 minutes
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
      }
      
      this.cleanupInterval = setInterval(async () => {
        await this.cleanup();
      }, interval);
    },
    
    // Stop auto-cleanup
    stopAutoCleanup() {
      if (this.cleanupInterval) {
        clearInterval(this.cleanupInterval);
        this.cleanupInterval = null;
      }
    },
    
    // Get storage type
    getStorageType() {
      return this.currentStorage?.type || 'unknown';
    },
    
    // Check if storage is available
    isAvailable() {
      return this.currentStorage !== null;
    },
    
    // Destroy
    async destroy() {
      this.stopAutoCleanup();
      console.log('Storage System destroyed');
    },
  };
  
  // Initialize on window load
  window.addEventListener('load', async () => {
    window.StorageSystem = await StorageSystem.init();
    
    // Make it available globally
    window.AlbionStorage = StorageSystem;
    
    // Override miniappsAI.storage for better functionality
    if (window.miniappsAI && window.miniappsAI.storage) {
      const originalStorage = window.miniappsAI.storage;
      
      window.miniappsAI.storage = {
        ...originalStorage,
        advanced: StorageSystem,
        
        // Enhanced methods
        getItem: async (key) => {
          try {
            return await StorageSystem.getItem(key);
          } catch (error) {
            // Fallback to original
            return await originalStorage.getItem(key);
          }
        },
        
        setItem: async (key, value, options) => {
          try {
            return await StorageSystem.setItem(key, value, options);
          } catch (error) {
            // Fallback to original
            return await originalStorage.setItem(key, value);
          }
        },
        
        removeItem: async (key) => {
          try {
            return await StorageSystem.removeItem(key);
          } catch (error) {
            // Fallback to original
            return await originalStorage.removeItem(key);
          }
        },
      };
    }
  });
  
  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageSystem;
  } else {
    window.StorageSystem = StorageSystem;
  }
})();