/* Service Worker - AoT-PNASF Offline & Cache */
const CACHE_NAME = 'aot-pnasf-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/market-runtime.js',
  '/js/i18n-helper.js',
  '/js/i18n-legacy.js',
  '/js/market-live.js',
  '/js/market-live.css',
  '/js/app-surfaces.css',
  '/js/operations-center.css',
  '/js/operations-enhanced.css',
  '/js/operations-timeline.css',
  '/js/creature-art.css',
  '/manifest.json'
];

// Install - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Skip API calls and CDN
  const url = new URL(event.request.url);
  if (url.hostname.includes('albion-online-data.com') ||
      url.hostname.includes('gameinfo.albiononline.com') ||
      url.hostname.includes('cdn.') ||
      url.hostname.includes('unpkg.com') ||
      url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        }
        return caches.match(event.request);
      })
      .catch(() => caches.match(event.request))
  );
});

// Push notification
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'Albion Online fırsatı!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23d4af37"/></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23d4af37"/></svg>',
    vibrate: [200, 100, 200],
    tag: data.tag || 'aot-alert',
    data: data,
    requireInteraction: data.requireInteraction || false
  };
  event.waitUntil(self.registration.showNotification(data.title || 'AoT-PNASF', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
