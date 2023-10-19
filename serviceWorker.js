const CACHE_VERSION = 1.1;
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
    })
  );
  console.log('Nueva versión instalada');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Intenta cargar la solicitud desde la red
    fetch(event.request)
      .then(function(response) {
        // Si se carga correctamente desde la red, respondemos con la respuesta de la red
        console.log("CARGO CON RED")
        return response;
      })
      .catch(function() {
        // Si falla la carga desde la red, intentamos cargar desde la caché
        return caches.match(event.request);
        console.log("CARGO CON CACHE")
      })
  );
});