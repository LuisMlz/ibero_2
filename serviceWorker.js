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
    // 1. Reclamar control de las páginas abiertas por el Service Worker.
    self.clients.claim(),

    // 2. Eliminar cachés antiguos que ya no son necesarios.
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

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Intentar obtener la respuesta desde la red primero
    fetch(event.request)
      .then(function(response) {
        // Si la respuesta de la red es exitosa, clonarla para almacenarla en caché y devolverla
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });
          return response;
        }
      })
      .catch(function() {
        // Si falla la solicitud a la red, intentar recuperar la respuesta desde la caché
        return caches.match(event.request)
          .then(function(cachedResponse) {
            if (cachedResponse) {
              return cachedResponse;
            }
          });
      })
  );
});


// self.addEventListener("fetch", fetchEvent => {
//   fetchEvent.respondWith(
//     caches.match(fetchEvent.request).then(res => {
//       return res || fetch(fetchEvent.request);
//     })
//   );
// });