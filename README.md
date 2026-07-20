# Jesus Festival — App Experience

The official **Jesus Festival** mobile app experience. A fun, immersive, installable
(PWA) web app for **Hamilton 2026 · September 4–5 · Gage Park**.

> Celebration. Worship. Unity. — More than a festival, a movement.

Live at **[JesusFestival.App](https://jesusfestival.app)**.

## Features

- 📱 **Installable PWA** — add to home screen on phone or desktop, works offline
- ✨ **Native app feel** — bottom tab nav, splash screen, smooth screen transitions
- 🎢 **Parallax & motion** — scroll-driven parallax, animated hero, live countdown
- 🗓️ **Schedule** — two-day preview with set times (full schedule coming soon)
- 🗺️ **Map** — Gage Park zones, directions & getting-here info (interactive map coming soon)
- 🔥 **Movement** — the vision from Hamilton → Niagara → the Nations, impact stats
- 🔔 **Connect** — email sign-up (wired to Supabase), get involved, share & socials

## Stack

- [Next.js 14](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.com) — email sign-ups (`jesus_festival_subscribers`)
- PWA via `manifest.webmanifest` + a lightweight offline-first service worker

## Local development

```bash
npm install
cp .env.example .env.local   # add your Supabase URL + anon/publishable key
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable / anon key |

## Content

All festival content lives in [`lib/content.ts`](lib/content.ts) and imagery is
sourced from the live [JesusFestival.ca](https://jesusfestival.ca) CDN.

---

All for Jesus. All for His glory. All because He loved us first.
