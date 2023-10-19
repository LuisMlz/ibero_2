
//CAMBIO DE VERSIÓN
const CACHE_VERSION = 1.6;
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
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Una vez que se han limpiado las cachés antiguas y la activación se ha completado
      // Forzar la recarga de la página
      console.log("entro al forzado dentro SW")
      return self.clients.claim().then(() => {
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'cache-updated' });
          });
        });
      });
    })
  );
  console.log('Nueva versión instalada');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});