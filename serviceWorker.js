const CACHE_NAME = 'mi-cache-v1.0.0';

// Archivos a cachear
const urlsToCache = [
  '/',
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
      })
  );
});

// Agregar un evento para eliminar el caché
self.addEventListener('message', event => {
  if (event.data.action === 'borrar_cache') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => {
          event.source.postMessage('Caché eliminado');
        })
    );
  }
});