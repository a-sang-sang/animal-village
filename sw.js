// 숨바꼭질 동물마을 — 오프라인에서도 게임이 열리도록 파일을 저장해 둡니다.
// 게임을 고친 뒤 다시 올릴 때는 VERSION 숫자를 올려 주세요.
const VERSION = "v1";
const CACHE = "animal-village-" + VERSION;
const FILES = [
  "./",
  "index.html",
  "privacy.html",
  "manifest.webmanifest",
  "icons/icon-48.png",
  "icons/icon-96.png",
  "icons/icon-144.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "fonts/Jua-Regular.ttf",
  "fonts/GothicA1-Regular.ttf",
  "fonts/GothicA1-SemiBold.ttf",
  "fonts/GothicA1-ExtraBold.ttf"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 먼저 네트워크에서 새 버전을 받고, 안 되면 저장해 둔 파일을 씁니다.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match("index.html")))
  );
});
