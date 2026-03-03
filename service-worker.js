const CACHE_NAME = 'yape_v5';

const urlsToCache = [
  '/',
  '/index.html',
  '/perfil.html',
  '/inicio.html',
  '/login.html',
  '/recargas.html',
  '/saludos.html',
  '/registrovip.html',
  '/servicio.html',
  '/token admin.html',
  '/admin.html',
  '/recargascomprobante.html',
  '/recargas de free.html',
  '/qrsguadar.html',
  '/qrsguarda.html',
  '/planes.html',
  '/QR.html',
  '/canje.html',
  '/clave.html',
  '/comprobanteqr.html',
  '/comprobante.html',
  '/con.html',
  '/nueva-clave.html',
  '/mis-datos.html',
  '/envioqr.html',
  '/envio.html',
  '/direccion.html',
  '/conprobante free.html',
  '/free.html',
  '/guarda.html',
  '/gaming.html',
  '/foto.html',
  '/exito.html',
  '/exitosa.html',
  '/imagen/app_icon_xxxhdpi.png',
  '/imagen/splash_icon_xxxhdpi.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(() => caches.match('/index.html'));
      })
  );
});
