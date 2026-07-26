const CACHE = "gmp-trainer-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./icons/icon-maskable.svg",
  "./img/ejemplo-correccion-simple.svg",
  "./img/ejemplo-casilla.svg",
  "./img/ejemplo-nachtrag.svg",
  "./img/ejemplo-cadena.svg",
  "./img/ejemplo-anulacion.svg",
  "./img/ejemplo-revocacion.svg",
  "./img/ejemplo-alarma.svg",
  "./img/ejemplo-sustitucion.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Red primero (para tener siempre la última versión); si no hay conexión, usa la copia guardada.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return; // no interceptar LanguageTool ni otros orígenes
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
