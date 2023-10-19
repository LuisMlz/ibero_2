const CACHE_VERSION = 1.3
const CACHE_NAME = `vcard-cache-v${CACHE_VERSION}`;

const assets = [
  "/",  
  "/js/login.js",
  "/index.html",
  "/css/loginStyle.css",
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
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) {
            console.log("elimina el anterior")
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Si se encuentra en caché, retorna la respuesta en caché
      console.log(response)
      if (response) {
        console.log(response)
        return response;
      }
        // Si no está en caché, realiza la solicitud a la red
      return fetch(event.request);
  
    })
  );
});
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request).then(function(response) {
//       console.log("Entro al fetch")
//       return response;
//     }).catch(function(error) {
//       console.error('Error al recuperar la solicitud:', error);
//       return new Response('Error al cargar la página.');
//     })
//   );
// });