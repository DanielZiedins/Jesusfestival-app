// Jesus Festival — lightweight offline-first service worker.
const CACHE = "jf-app-v5";

// Photo caches. Festival imagery is worth keeping offline (Gage Park's network
// buckles once a few thousand phones arrive), but never without a ceiling.
const IMG_CACHE = "jf-img-v2";
const IMG_MAX_ENTRIES = 140;
// The JesusFestival.ca CDN that serves the hero/lineup photography.
const IMG_HOST = "d2xsxph8kpxj0f.cloudfront.net";
// Photo Wall uploads live in Supabase Storage. Storage objects are cacheable
// images; every other Supabase path (REST, RPC, realtime) must stay live.
const isStorageImage = (url) =>
  url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/storage/v1/object/public/");
const isPhoto = (url) => url.hostname === IMG_HOST || isStorageImage(url);

// Precached so the festival weekend works on a congested park network: every
// screen someone might need standing in Gage Park with one bar of signal.
const APP_SHELL = [
  "/",
  "/schedule",
  "/map",
  "/revive-the-city",
  "/news",
  "/prayer",
  "/i-said-yes",
  "/more",
  "/manifest.webmanifest",
  "/brand/banner.png",
  "/brand/logo-mark-white.png",
  "/brand/logo-mark-gold.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        // Individually, so one missing asset can't abort the whole precache.
        Promise.all(APP_SHELL.map((u) => cache.add(u).catch(() => {})))
      )
      .catch(() => {})
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
      .catch(() => {})
  );
  self.clients.claim();
});

// Drop the oldest image entries once the cap is reached.
async function trimImageCache() {
  try {
    const cache = await caches.open(IMG_CACHE);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - IMG_MAX_ENTRIES; i++) await cache.delete(keys[i]);
  } catch (e) {
    /* ignore */
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }

  // Festival photos (CDN + Photo Wall uploads): cache-first so they're instant
  // on repeat visits and still there when the park network dies. Opaque
  // responses are fine — they're only ever used as <img> sources.
  if (isPhoto(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(IMG_CACHE).then((c) => c.put(request, copy)).then(trimImageCache).catch(() => {});
            return res;
          })
      )
    );
    return;
  }

  // Never cache live Supabase data (REST, RPC, realtime, auth).
  if (url.hostname.includes("supabase")) return;

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
      event.source && event.source.postMessage({ type: "jf-cache-essentials-done", ok });
    } catch (e) {
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
  } catch (e) {
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
          } catch (e) {
            /* ignore */
          }
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
