const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/db.js",
  "/index.js",
  "/styles.css",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// install event handler
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  console.log("Install");
  self.skipWaiting();
});

// retrieve assets from cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
