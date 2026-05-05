// Set to false to deactivate: the SW will unregister itself and clear all caches on next deploy.
const SW_ENABLED = true;

// __SW_VERSION__ is replaced with a build timestamp by the injectSwVersion Vite plugin.
const CACHE_NAME = 'greek-vat-calculator-v__SW_VERSION__';

const PRECACHE_URLS = [
  './',
  './manifest.json',
  './404.html',
  './img/favicons/favicon-96x96.png',
  './img/favicons/favicon.svg',
  './img/favicons/favicon.ico',
  './img/favicons/apple-touch-icon.png',
  './img/favicons/web-app-manifest-192x192.png',
  './img/favicons/web-app-manifest-512x512.png'
];

// Precache all app-shell assets. skipWaiting() activates the new SW immediately
// without waiting for existing tabs to close.
globalThis.addEventListener('install', event => {
  if (!SW_ENABLED) {
    globalThis.registration.unregister();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => globalThis.skipWaiting())
  );
});

// Delete stale caches from previous versions, then take control of all open clients.
globalThis.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => globalThis.clients.claim())
  );
});

globalThis.addEventListener('fetch', event => {
  const {request} = event;

  // Only handle same-origin requests.
  if (!request.url.startsWith(globalThis.location.origin)) return;

  if (request.mode === 'navigate') {
    // Network-first for HTML navigation: always try to serve fresh content,
    // fall back to the cached shell when offline.
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('./'))
    );
    return;
  }

  // Cache-first for static assets: favicons, manifest, etc.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});
