/* User Authentication & Profile System */
(function () {
  const AuthSystem = {
    // User states
    states: {
      ANONYMOUS: 'anonymous',
      REGISTERING: 'registering',
      REGISTERED: 'registered',
      VERIFIED: 'verified',
      PREMIUM: 'premium',
    },
    
    // Current user
    currentUser: null,
    
    // Preferences
    preferences: {
      theme: 'dark',
      language: 'tr',
      server: 'europe',
      notifications: true,
      autoRefresh: true,
      defaultView: 'dashboard',
    },
    
    // Initialize
    async init() {
      console.log('Auth System initializing...');
      
      // Load user data from storage
      await this.loadUserData();
      
      // Load preferences
      await this.loadPreferences();
      
      console.log('Auth System initialized');
      console.log('Current user:', this.currentUser ? this.currentUser.username : 'Anonymous');
      
      return this;
    },
    
    // Load user data
    async loadUserData() {
      try {
        const userData = await window.miniappsAI?.storage.getItem('userData');
        if (userData) {
          this.currentUser = JSON.parse(userData);
        } else {
          this.currentUser = this.createAnonymousUser();
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        this.currentUser = this.createAnonymousUser();
      }
    },
    
    // Save user data
    async saveUserData() {
      try {
        if (this.currentUser) {
          await window.miniappsAI?.storage.setItem('userData', JSON.stringify(this.currentUser));
        }
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    },
    
    // Load preferences
    async loadPreferences() {
      try {
        const prefs = await window.miniappsAI?.storage.getItem('userPreferences');
        if (prefs) {
          this.preferences = { ...this.preferences, ...JSON.parse(prefs) };
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    },
    
    // Save preferences
    async savePreferences() {
      try {
        await window.miniappsAI?.storage.setItem('userPreferences', JSON.stringify(this.preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    },
    
    // Create anonymous user
    createAnonymousUser() {
      const anonymousId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        id: anonymousId,
        username: 'Guest',
        state: this.states.ANONYMOUS,
        created: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        permissions: {
          basic: true,
          watchlist: true,
          buildSave: false,
          guildAccess: false,
          premium: false,
        },
        stats: {
          sessions: 0,
          totalTime: 0,
          favoriteItems: [],
          watchedPlayers: [],
          watchedGuilds: [],
        },
      };
    },
    
    // Register user
    async register(username, email = null) {
      if (this.currentUser.state !== this.states.ANONYMOUS) {
        throw new Error('User already registered');
      }
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      
      this.currentUser = {
        id: userId,
        username: username.trim(),
        email: email?.trim() || null,
        state: email ? this.states.REGISTERED : this.states.REGISTERING,
        created: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        permissions: {
          basic: true,
          watchlist: true,
          buildSave: true,
          guildAccess: false,
          premium: false,
        },
        stats: {
          sessions: this.currentUser.stats.sessions,
          totalTime: this.currentUser.stats.totalTime,
          favoriteItems: this.currentUser.stats.favoriteItems,
          watchedPlayers: this.currentUser.stats.watchedPlayers,
          watchedGuilds: this.currentUser.stats.watchedGuilds,
        },
      };
      
      await this.saveUserData();
      this.notifyStateChange('registered', this.currentUser);
      
      return this.currentUser;
    },
    
    // Update profile
    async updateProfile(updates) {
      if (!this.currentUser) {
        throw new Error('No user logged in');
      }
      
      const allowedUpdates = ['username', 'email', 'avatar', 'bio'];
      const updatedUser = { ...this.currentUser };
      
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key) && updates[key] !== undefined) {
          updatedUser[key] = updates[key];
        }
      });
      
      updatedUser.lastActive = new Date().toISOString();
      this.currentUser = updatedUser;
      
      await this.saveUserData();
      this.notifyStateChange('profile_updated', this.currentUser);
      
      return this.currentUser;
    },
    
    // Update preferences
    async updatePreferences(newPreferences) {
      this.preferences = { ...this.preferences, ...newPreferences };
      await this.savePreferences();
      this.notifyStateChange('preferences_updated', this.preferences);
      return this.preferences;
    },
    
    // Add to watchlist
    async addToWatchlist(type, id, name) {
      if (!this.currentUser) return false;
      
      const listKey = type === 'player' ? 'watchedPlayers' : 
                     type === 'guild' ? 'watchedGuilds' : 'favoriteItems';
      
      if (!this.currentUser.stats[listKey].some(item => item.id === id)) {
        this.currentUser.stats[listKey].push({
          id,
          name,
          added: new Date().toISOString(),
          lastChecked: new Date().toISOString(),
        });
        
        await this.saveUserData();
        this.notifyStateChange('watchlist_updated', { type, id, action: 'add' });
        return true;
      }
      
      return false;
    },
    
    // Remove from watchlist
    async removeFromWatchlist(type, id) {
      if (!this.currentUser) return false;
      
      const listKey = type === 'player' ? 'watchedPlayers' : 
                     type === 'guild' ? 'watchedGuilds' : 'favoriteItems';
      
      const index = this.currentUser.stats[listKey].findIndex(item => item.id === id);
      if (index > -1) {
        this.currentUser.stats[listKey].splice(index, 1);
        await this.saveUserData();
        this.notifyStateChange('watchlist_updated', { type, id, action: 'remove' });
        return true;
      }
      
      return false;
    },
    
    // Track session
    async trackSession(startTime, endTime) {
      if (!this.currentUser) return;
      
      const duration = Math.floor((endTime - startTime) / 1000); // seconds
      this.currentUser.stats.sessions++;
      this.currentUser.stats.totalTime += duration;
      this.currentUser.lastActive = new Date().toISOString();
      
      await this.saveUserData();
    },
    
    // Session manager
    sessionStartTime: null,
    
    startSession() {
      this.sessionStartTime = Date.now();
      console.log('Session started');
    },
    
    async endSession() {
      if (this.sessionStartTime) {
        await this.trackSession(this.sessionStartTime, Date.now());
        this.sessionStartTime = null;
        console.log('Session ended');
      }
    },
    
    // Premium features
    async upgradeToPremium() {
      if (this.currentUser.state === this.states.ANONYMOUS) {
        throw new Error('Register first to upgrade to premium');
      }
      
      this.currentUser.state = this.states.PREMIUM;
      this.currentUser.permissions = {
        ...this.currentUser.permissions,
        guildAccess: true,
        premium: true,
        advancedAnalytics: true,
        unlimitedWatchlist: true,
        prioritySupport: true,
      };
      
      await this.saveUserData();
      this.notifyStateChange('upgraded_to_premium', this.currentUser);
      
      return this.currentUser;
    },
    
    // Get user stats
    getUserStats() {
      if (!this.currentUser) return null;
      
      const stats = { ...this.currentUser.stats };
      
      // Calculate additional stats
      stats.averageSessionTime = stats.sessions > 0 ? 
        Math.floor(stats.totalTime / stats.sessions) : 0;
      
      stats.watchlistCount = {
        items: stats.favoriteItems.length,
        players: stats.watchedPlayers.length,
        guilds: stats.watchedGuilds.length,
      };
      
      return stats;
    },
    
    // Export user data
    exportUserData() {
      if (!this.currentUser) return null;
      
      return {
        profile: {
          id: this.currentUser.id,
          username: this.currentUser.username,
          email: this.currentUser.email,
          state: this.currentUser.state,
          created: this.currentUser.created,
          lastActive: this.currentUser.lastActive,
        },
        permissions: this.currentUser.permissions,
        stats: this.getUserStats(),
        preferences: this.preferences,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };
    },
    
    // Import user data
    async importUserData(data) {
      if (!data || !data.profile || !data.profile.id) {
        throw new Error('Invalid user data');
      }
      
      this.currentUser = {
        id: data.profile.id,
        username: data.profile.username,
        email: data.profile.email,
        state: data.profile.state || this.states.REGISTERED,
        created: data.profile.created || new Date().toISOString(),
        lastActive: new Date().toISOString(),
        permissions: data.permissions || this.currentUser?.permissions || {
          basic: true,
          watchlist: true,
          buildSave: true,
          guildAccess: false,
          premium: false,
        },
        stats: data.stats || this.currentUser?.stats || {
          sessions: 0,
          totalTime: 0,
          favoriteItems: [],
          watchedPlayers: [],
          watchedGuilds: [],
        },
      };
      
      if (data.preferences) {
        this.preferences = { ...this.preferences, ...data.preferences };
        await this.savePreferences();
      }
      
      await this.saveUserData();
      this.notifyStateChange('data_imported', this.currentUser);
      
      return this.currentUser;
    },
    
    // Event system
    eventListeners: new Map(),
    
    on(event, callback) {
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event).push(callback);
    },
    
    off(event, callback) {
      if (this.eventListeners.has(event)) {
        const listeners = this.eventListeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    },
    
    notifyStateChange(event, data) {
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error('Event listener error:', error);
          }
        });
      }
    },
    
    // Get current user
    getCurrentUser() {
      return this.currentUser;
    },
    
    // Get preferences
    getPreferences() {
      return this.preferences;
    },
    
    // Check permission
    hasPermission(permission) {
      if (!this.currentUser) return false;
      return this.currentUser.permissions[permission] === true;
    },
    
    // Logout (reset to anonymous)
    async logout() {
      await this.endSession();
      
      const oldUser = this.currentUser;
      this.currentUser = this.createAnonymousUser();
      
      await this.saveUserData();
      this.notifyStateChange('logged_out', oldUser);
      
      return this.currentUser;
    },
    
    // Cleanup
    destroy() {
      this.endSession();
      this.eventListeners.clear();
      console.log('Auth System destroyed');
    },
  };
  
  // Initialize on window load
  window.addEventListener('load', async () => {
    window.AuthSystem = await AuthSystem.init();
    
    // Start session tracking
    window.AuthSystem.startSession();
    
    // End session on page unload
    window.addEventListener('beforeunload', () => {
      window.AuthSystem?.endSession();
    });
  });
  
  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
  } else {
    window.AuthSystem = AuthSystem;
  }
})();