const CACHE_NAME = 'mi-cache-v1.0.1';

// Archivos a cachear
const urlsToCache = [
  './',
  './index.html',
  './css/loginStyle.css',
  './js/login.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      }).then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);

      }).catch(function(error) {
        console.error('Error en el Service Worker:', error);
        return new Response('Ocurrió un error en el Service Worker', { status: 500, statusText: 'Error interno del servidor' });
      })
  );
});