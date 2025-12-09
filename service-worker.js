// Service Worker for PWA offline support and caching strategies
const CACHE_VERSION = 'v1';
const CACHE_NAME = `form-app-${CACHE_VERSION}`;
const RUNTIME_CACHE = `form-runtime-${CACHE_VERSION}`;
const STATIC_CACHE = `form-static-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy selection based on request type
  if (request.method === 'GET') {
    // Cache first strategy for static assets (CSS, JS, images)
    if (isStaticAsset(url.pathname)) {
      event.respondWith(cacheFirst(request));
    }
    // Network first strategy for API calls and dynamic content
    else if (url.pathname.includes('/api/')) {
      event.respondWith(networkFirst(request));
    }
    // Stale while revalidate for HTML and other documents
    else {
      event.respondWith(staleWhileRevalidate(request));
    }
  }
  // POST requests - network only
  else if (request.method === 'POST') {
    event.respondWith(networkOnly(request));
  }
});

/**
 * Cache First Strategy
 * Returns cached response if available, otherwise fetches from network
 */
function cacheFirst(request) {
  return caches.match(request)
    .then((response) => {
      if (response) {
        console.log('[Service Worker] Cache hit:', request.url);
        return response;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(STATIC_CACHE)
            .then((cache) => cache.put(request, responseClone));

          return response;
        })
        .catch(() => {
          return caches.match('/offline.html');
        });
    });
}

/**
 * Network First Strategy
 * Tries to fetch from network first, falls back to cache
 */
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // Clone and cache the response
      const responseClone = response.clone();
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.put(request, responseClone));

      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then((response) => {
          return response || caches.match('/offline.html');
        });
    });
}

/**
 * Stale While Revalidate Strategy
 * Returns cached response immediately while fetching fresh data
 */
function staleWhileRevalidate(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      // Fetch fresh data in the background
      const fetchPromise = fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then((cache) => cache.put(request, responseClone));

          return response;
        });

      // Return cached response immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
    .catch(() => {
      return caches.match('/offline.html');
    });
}

/**
 * Network Only Strategy
 * Always fetches from network, no caching
 */
function networkOnly(request) {
  return fetch(request)
    .catch(() => {
      return new Response(
        JSON.stringify({ error: 'Offline - Request cannot be completed' }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'application/json' })
        }
      );
    });
}

/**
 * Determine if a URL is a static asset
 */
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
