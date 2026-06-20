const CACHE_NAME = 'tirtasewa-v1';
const ASSETS_TO_CACHE = [
  '/TirtaSewa.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: simpan file-file penting ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: bersihin cache versi lama kalau ada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: coba ambil dari network dulu, kalau gagal (offline) pakai cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // simpan hasil fetch terbaru ke cache juga
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
