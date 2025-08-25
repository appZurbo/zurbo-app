const CACHE_NAME = 'zurbo-v66-nocache';

// Install event - FORCE CLEAR ALL CACHES
self.addEventListener('install', (event) => {
  console.log('🚨 Service Worker v66 - CLEARING ALL CACHES');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('🗑️ FORCE DELETING CACHE:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - NO CACHING AT ALL
self.addEventListener('fetch', (event) => {
  console.log('🚫 SW v66: NO CACHE - Direct network request for:', event.request.url);
  // Always fetch from network, never cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Network error', { status: 503 });
    })
  );
});