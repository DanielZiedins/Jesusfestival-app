// Jesus Festival — lightweight offline-first service worker.
const CACHE = "jf-app-v7";
const IMG_CACHE = "jf-images-v1";
const IMG_MAX_ENTRIES = 80;
const IMG_HOSTS = new Set([
  "d2xsxph8kpxj0f.cloudfront.net",
  "cdn.shopify.com",
]);
// Photo Wall uploads live in Supabase Storage. Public storage objects are plain
// cacheable images; every other Supabase path (REST, RPC, realtime) must stay
// live, so this is matched narrowly and checked before the Supabase bail-out.
const isStorageImage = (url) =>
  url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/storage/v1/object/public/");
const isPhoto = (url) => IMG_HOSTS.has(url.hostname) || isStorageImage(url);
// Precached so the festival weekend works on a congested park network: the app
// shell plus the brand art the first screens actually render.
const APP_SHELL = [
  "/",
  "/schedule",
  "/map",
  "/revive-the-city",
  "/news",
  "/photos",
  "/shop",
  "/prayer",
  "/i-said-yes",
  "/more",
  "/jesus-festival-hamilton",
  "/faq",
  "/jesus-festival-2026.ics",
  "/manifest.webmanifest",
  "/brand/banner.png",
  "/brand/logo-mark-white.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Individually, so one missing asset can't abort the whole precache.
      Promise.all(APP_SHELL.map((u) => cache.add(u).catch(() => {})))
    ).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE && k !== IMG_CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// Drop the oldest image entries once the cap is reached — festival photos are
// worth keeping offline, but not without a ceiling.
async function trimImageCache() {
  try {
    const cache = await caches.open(IMG_CACHE);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - IMG_MAX_ENTRIES; i++) await cache.delete(keys[i]);
  } catch {
    /* ignore */
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Festival photos (CDN + Photo Wall uploads): cache-first so they're instant
  // on repeat visits and still there when the park network dies. Opaque
  // responses are fine here — they're only ever used as <img> sources.
  if (isPhoto(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok || res.type === "opaque") {
              const copy = res.clone();
              caches.open(IMG_CACHE).then((c) => c.put(request, copy)).then(trimImageCache).catch(() => {});
            }
            return res;
          })
      )
    );
    return;
  }

  // Never cache live API calls. The API/server controls its own freshness.
  if (url.hostname.includes("supabase") || (url.origin === self.location.origin && url.pathname.startsWith("/api/"))) return;

  // HTML navigations: network-first so content stays fresh, fall back to cache offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Static assets & images: cache-first for a fast, app-like feel.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached)
    )
  );
});

// ---- Save the festival essentials for offline, on demand ----
// The Install screen posts this before people leave for Gage Park, so the
// schedule, map and next-steps guide are guaranteed to be there with no signal.
self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "jf-cache-essentials") return;
  const reply = (ok) => {
    try {
      if (event.source) event.source.postMessage({ type: "jf-cache-essentials-done", ok });
    } catch {
      /* ignore */
    }
  };
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(APP_SHELL.map((u) => cache.add(u).catch(() => {}))))
      .then(() => reply(true))
      .catch(() => reply(false))
  );
});

// ---- Push notifications ----
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Jesus Festival", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Jesus Festival";
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [80, 40, 80],
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const c of clients) {
        if ("focus" in c) {
          try {
            c.navigate(target);
          } catch {
            /* ignore */
          }
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
