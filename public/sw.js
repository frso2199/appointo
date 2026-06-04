const STATIC_CACHE_NAME = 'appointo-static-v2';
const DYNAMIC_CACHE_NAME = 'appointo-dynamic-v2';

// Essential App Shell resources to precache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install Event: Build initial static cache sandbox
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[AppointO ServiceWorker] Pre-caching Core App Shell...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Sweep and purge obsolete legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('[AppointO ServiceWorker] Evicting outdated cache store:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor: Dynamic cache-routing with Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 1. Bypass ServiceWorker for dynamic server-side Razorpay or subscription API routes
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          // If offline and request is subscription analytics or status, attempt to fall back to cached copy
          const cache = await caches.open(DYNAMIC_CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a structured offline JSON error indicator
          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              error: 'Platform is running in secure local offline sandbox. Please verify connection to sync Razorpay gateways.'
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // 2. Client-side static resources: Stale-While-Revalidate Strategy (High-Speed & Offline fallback)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Guard response before adding to dynamic cache
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.warn('[AppointO ServiceWorker] Dev network offline or disconnected. Falling back to cached asset shell:', err);
          // If resource request fails entirely and is a navigation route, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });

      // Render instantly from cache, triggering background refresh; otherwise await fetching network
      return cachedResponse || fetchPromise;
    })
  );
});
