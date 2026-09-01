// Jesus Festival — lightweight offline-first service worker.
const CACHE = "jf-app-v17";
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
  "/offline",
  "/festival-weekend",
  "/blog/jesus-festival-saturday-extended-updated-schedule-2026",
  "/bring-a-group",
  "/find-your-moments",
  "/getting-to-gage-park",
  "/what-to-bring",
  "/jesus-festival-hamilton",
  "/accessibility",
  "/hunt",
  // Every printed Light Hunt station. These are the twelve QR codes taped up
  // around Gage Park, so they are the one set of pages guaranteed to be opened
  // by someone standing in a field on a dead network, having never visited the
  // URL before. Without them here a scan falls through to /offline and the
  // person never gets their light.
  // Keep in step with STATIONS in lib/hunt.ts — scripts/check-sw-hunt.mjs fails
  // the build if these drift.
  "/hunt/xxwd39j",
  "/hunt/pcuhxg4",
  "/hunt/87uxpgz",
  "/hunt/2mnp339",
  "/hunt/hcf5ed8",
  "/hunt/3cr884v",
  "/hunt/3jh44gp",
  "/hunt/zvytwv5",
  "/hunt/zmkgbt7",
  "/hunt/w3uz5ya",
  "/hunt/pvzkfvz",
  "/hunt/d6x4jup",
  "/faq",
  "/jesus-festival-2026.ics",
  "/manifest.webmanifest",
  // The splash WebP, not brand/banner.png — the PNG is the 1200x600 social and
  // e-mail card, four times the weight, and the app itself never renders it.
  "/brand/banner-splash.webp",
  "/brand/logo-mark-white.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Pages whose JavaScript must be there before the phone ever loses signal.
// Everything a Light Hunt scan touches, plus the screens people open first.
const PRIORITY_PAGES = APP_SHELL.filter(
  (u) => u === "/" || u.startsWith("/hunt") || u === "/schedule" || u === "/map" || u === "/offline"
);

const isPage = (u) => !/\.(png|webp|jpg|jpeg|svg|ics|webmanifest)$/.test(u);

/**
 * Cache a page *and the JS/CSS it needs to run*.
 *
 * Caching the HTML alone is not enough. A Next page arrives as a prerendered
 * shell that only becomes the real thing once its chunks execute — so a
 * document cached without its scripts opens offline as a dead spinner. That is
 * exactly what someone scanning a printed QR code in the park would have seen.
 *
 * Chunk filenames are content-hashed and change every build, so the list is
 * read out of the served HTML rather than hard-coded.
 */
async function cachePageWithAssets(cache, pageUrl) {
  try {
    const res = await fetch(pageUrl, { credentials: "same-origin" });
    if (!res.ok) return;
    const html = await res.clone().text();
    await cache.put(pageUrl, res);

    const assets = new Set();
    for (const m of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(m[1]);

    await Promise.all(
      [...assets].map((a) =>
        cache.match(a).then((hit) => (hit ? undefined : cache.add(a).catch(() => {})))
      )
    );
  } catch {
    /* a missing page must never abort the rest of the precache */
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(async (cache) => {
        // Individually, so one missing asset can't abort the whole precache.
        await Promise.all(APP_SHELL.map((u) => cache.add(u).catch(() => {})));
        // Then walk the asset graph for the pages that have to actually work.
        // Sequential on purpose: the chunks are shared, so after the first page
        // almost everything is already a cache hit.
        for (const u of PRIORITY_PAGES) await cachePageWithAssets(cache, u);
      })
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
        .catch(() =>
          caches.match(request).then((r) => {
            if (r) return r;
            // A Light Hunt scan should never dead-end on the generic offline
            // page — the hub still shows their lamps and works from cache.
            const fallback = url.pathname.startsWith("/hunt/") ? "/hunt" : "/offline";
            return caches.match(fallback).then((f) => f || caches.match("/offline")).then((f) => f || caches.match("/"));
          })
        )
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
      .then(async (cache) => {
        await Promise.all(APP_SHELL.map((u) => cache.add(u).catch(() => {})));
        // Unlike install, this runs while someone waits on a good network, so
        // take the time to make every saved page genuinely usable offline.
        for (const u of APP_SHELL.filter(isPage)) await cachePageWithAssets(cache, u);
      })
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
