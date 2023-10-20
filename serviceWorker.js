const CACHE_VERSION = 1.2;
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

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     fetch(event.request)
//       .catch(() => {
//         // Si no se encuentra en la red, busca en la caché
//         return caches.match(event.request)
//           .then((response) => {
//             // Si se encuentra en la caché, devuélvelo desde allí
//             if (response) {
//               console.log("devuelve el cache")
//               return response;
//             }
//           });
//       })
//   );
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red está disponible, devuelve la respuesta de la red
        console.log("DESDE LA RED")
        return response;
      })
      .catch(() => {
        // Si la red falla, busca en la caché
        return caches.match(event.request)
          .then((cachedResponse) => {
            // Si se encuentra en la caché, devuélvelo desde allí
            if (cachedResponse) {
              console.log("DESDE LA CACHE")
              return cachedResponse;
            }
          });
      })
  );
});