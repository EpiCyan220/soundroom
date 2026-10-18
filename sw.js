const CACHE = "juice-wrld-vault-mobile-v132";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./juice-wrld-icon.png", "./driveby-car.png", "./driveby-cop.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && (request.mode === "navigate" || SHELL.some(path => url.pathname.endsWith(path.replace("./", ""))))) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  })));
});
























