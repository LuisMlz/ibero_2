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

self.addEventListener("fetch", fetchEvent => {
   // Obtenemos la URL de la solicitud
   var requestURL = new URL(fetchEvent.request.url);

   // Excluimos explícitamente las URL de los scripts que no deseamos almacenar en caché
   if (
     fetchEvent.request.url.startsWith("chrome-extension:") ||
     requestURL.href === self.registration.scope || // Verifica si la solicitud es para el propio archivo del Service Worker
     requestURL.href.startsWith("https://cdn.jsdelivr.net/npm/sweetalert2@") ||
     requestURL.href.startsWith("https://cdnjs.cloudflare.com/ajax/libs/dompurify/")
   ) {
     return; // No hacemos nada, permitimos que la solicitud continúe sin caché
   }
 

  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .then(response => {
        // Clonamos la respuesta para poder usarla en la caché y devolverla
        const responseClone = response.clone();

        // Almacenamos la respuesta en el caché
        caches.open(CACHE_NAME).then(cache => {
          cache.put(fetchEvent.request, responseClone);
        });

        return response;
      })
      .catch(() => {
        // Si falla la solicitud en la red, intentamos obtenerla del caché
        return caches.match(fetchEvent.request);
      })
  );
});

// self.addEventListener("fetch", fetchEvent => {
//   fetchEvent.respondWith(
//     caches.match(fetchEvent.request).then(res => {
//       console.log(res,' - ',fetchEvent.request)
//       return res || fetch(fetchEvent.request);
//     })
//   );
// });