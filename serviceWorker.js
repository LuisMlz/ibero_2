const CACHE_VERSION = 1.0;
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Intenta buscar el recurso en la red
    fetch(event.request)
      .then((response) => {
        // Si se encuentra en la red, almacénalo en caché para futuros usos
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        // Si no se encuentra en la red, busca en la caché
        return caches.match(event.request)
          .then((response) => {
            // Si se encuentra en la caché, devuélvelo desde allí
            if (response) {
              return response;
            }
            // // Si no se encuentra en la caché, devuelve una página de error o recurso en caché
            // return caches.match('/offline.html');
          });
      })
  );
});