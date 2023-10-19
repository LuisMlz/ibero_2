const CACHE_VERSION = 1.0
const CACHE_NAME = `vcard-cache-v${CACHE_VERSION}`;

const assets = [
  "./",
  "./js/login.js",
  "./index.html",
  "./css/loginStyle.css",
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    self.clients.claim(),
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejo del evento 'fetch'
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el recurso se encuentra en caché, lo servimos desde la caché
        if (response) {
          return response;
        }
        // Si el recurso no se encuentra en caché, lo buscamos en la red y lo almacenamos en caché
        return fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
            return response;
          });
      })
  );
});