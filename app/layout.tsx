import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0510",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: "Jesus Festival",
  title: {
    default: "Jesus Festival App | Hamilton 2026 · Sept 4–5 · Gage Park",
    template: "%s | Jesus Festival",
  },
  description: SITE.description,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jesus Festival",
  },
  formatDetection: { telephone: false },
  alternates: {
    canonical: SITE.url,
    types: { "application/rss+xml": `${SITE.url}/feed.xml` },
  },
  category: "events",
  authors: [{ name: "Jesus Festival" }],
  creator: "Jesus Festival",
  publisher: "Jesus Festival",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  keywords: [
    "Jesus Festival",
    "Jesus Festival app",
    "Jesus Festival Hamilton",
    "Jesus Festival 2026",
    "Gage Park Hamilton",
    "Christian festival Hamilton",
    "worship festival Ontario",
    "free family festival Hamilton",
    "Hamilton worship night",
    "September 2026 Hamilton events",
    "Ant Lee Jr.",
    "Open Heaven worship",
    "baptism Hamilton",
    "church event Hamilton",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE.url,
    siteName: SITE.name,
    title: "Jesus Festival — Hamilton 2026 · Sept 4–5 · Gage Park",
    description: SITE.description,
    images: [{ url: "/brand/banner.png", width: 1200, height: 600, alt: "Jesus Festival — Love God. Love People. Change the World." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesus Festival — Hamilton 2026",
    description: SITE.description,
    images: ["/brand/banner.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const EVENT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Jesus Festival Hamilton 2026",
  startDate: "2026-09-04T18:00:00-04:00",
  endDate: "2026-09-05T18:00:00-04:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  description: SITE.description,
  image: [`${SITE.url}/brand/banner.png`],
  location: {
    "@type": "Place",
    name: "Gage Park",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1000 Main St E",
      addressLocality: "Hamilton",
      addressRegion: "ON",
      postalCode: "L8M 1N2",
      addressCountry: "CA",
    },
  },
  organizer: { "@type": "Organization", name: "Jesus Festival", url: "https://www.jesusfestival.ca" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CAD",
    availability: "https://schema.org/InStock",
    url: SITE.url,
    validFrom: "2026-01-01",
  },
  performer: [
    { "@type": "MusicGroup", name: "Bethel Gospel Tabernacle" },
    { "@type": "MusicGroup", name: "Open Heaven" },
    { "@type": "Person", name: "Ant Lee Jr." },
    { "@type": "MusicGroup", name: "ACTS Kingdom Sound Worship" },
    { "@type": "MusicGroup", name: "Friday Night Prayer" },
  ],
  // Each day as its own sub-event gives search engines the real shape of the
  // weekend — two distinct experiences, each with times and performers.
  subEvent: [
    {
      "@type": "MusicEvent",
      name: "Pure Worship Night — Jesus Festival",
      startDate: "2026-09-04T18:00:00-04:00",
      endDate: "2026-09-04T21:00:00-04:00",
      description: "A focused night of open-air worship at Gage Park led by Bethel Gospel Tabernacle. Gates 6:00 PM, worship 6:30 PM. Free.",
      performer: { "@type": "MusicGroup", name: "Bethel Gospel Tabernacle", url: "https://bethelhamilton.com/" },
      location: { "@type": "Place", name: "Gage Park", address: "1000 Main St E, Hamilton, ON" },
    },
    {
      "@type": "Festival",
      name: "Family Festival Day — Jesus Festival",
      startDate: "2026-09-05T10:00:00-04:00",
      endDate: "2026-09-05T18:00:00-04:00",
      description: "A free full-day family festival — worship sets by Open Heaven, ACTS Kingdom Sound Worship, Ant Lee Jr. and Friday Night Prayer, plus testimonies, food trucks, kids zone and baptisms. Hosted by JJ & Rachel.",
      performer: [
        { "@type": "MusicGroup", name: "Open Heaven" },
        { "@type": "MusicGroup", name: "ACTS Kingdom Sound Worship" },
        { "@type": "Person", name: "Ant Lee Jr." },
        { "@type": "MusicGroup", name: "Friday Night Prayer" },
      ],
      location: { "@type": "Place", name: "Gage Park", address: "1000 Main St E, Hamilton, ON" },
    },
  ],
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When is Jesus Festival Hamilton 2026?",
      acceptedAnswer: { "@type": "Answer", text: "September 4–5, 2026 at Gage Park, Hamilton, Ontario. Friday is Pure Worship Night (come early — gates 6:00 PM, worship 6:30 PM) and Saturday is Family Festival Day from 10 AM to 6 PM." },
    },
    {
      "@type": "Question",
      name: "Is Jesus Festival free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes! Jesus Festival is a completely free family festival — no tickets needed. Food trucks, live music, kids zone, games, baptisms and worship, all in the heart of Hamilton." },
    },
    {
      "@type": "Question",
      name: "Where is Jesus Festival held?",
      acceptedAnswer: { "@type": "Answer", text: "Gage Park, 1000 Main St E, Hamilton, Ontario, Canada." },
    },
    {
      "@type": "Question",
      name: "What is the Jesus Festival app?",
      acceptedAnswer: { "@type": "Answer", text: "The official festival app with the schedule, map, news, and Revive the City — a community game where thousands complete real-world Kingdom missions together. Install it free at jesusfestival.app." },
    },
    {
      "@type": "Question",
      name: "What should I bring to Jesus Festival?",
      acceptedAnswer: { "@type": "Answer", text: "Bring a lawn chair or blanket (the lawn fills up fast), sunscreen and a hat for Saturday, a water bottle, a layer for Friday evening, comfy shoes — and a friend. Food trucks run Saturday; no tickets are needed." },
    },
    {
      "@type": "Question",
      name: "Is there parking at Jesus Festival?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — free festival parking is available on-site at Gage Park but fills quickly, so arrive early. Street parking and HSR transit stops are nearby, and carpooling, rideshare, biking or walking all work well." },
    },
    {
      "@type": "Question",
      name: "Who is performing at Jesus Festival 2026?",
      acceptedAnswer: { "@type": "Answer", text: "Bethel Gospel Tabernacle leads Friday's Pure Worship Night (6:30–9:00 PM). Saturday features Open Heaven, ACTS Kingdom Sound Worship, Ant Lee Jr. and Friday Night Prayer, plus speakers and testimonies from 10:00 AM to 6:00 PM, hosted by JJ & Rachel." },
    },
  ],
};

/**
 * Ties the festival to the wider network of Kingdom sites. `sameAs` is how
 * search engines learn these properties belong to one organization — every
 * domain listed here gets an authority signal from jesusfestival.app.
 */
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.thykingdom.net/#org",
  name: "Thy Kingdom Network",
  url: "https://www.thykingdom.net",
  logo: `${SITE.url}/icons/icon-512.png`,
  slogan: "Love God. Love People. Change the World.",
  sameAs: [
    "https://www.jesusfestival.ca",
    "https://www.jesusfestival.app",
    "https://www.loveontheworld.com",
    "https://www.loveonmission.world",
    "https://www.loveonhamilton.com",
    "https://www.oikosmap.com",
    "https://www.kd-ziedins.com",
    "https://www.seekfirst.world",
    "https://www.iamreborn.net",
  ],
};

const APP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Jesus Festival App",
  url: SITE.url,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
  description: SITE.description,
  featureList: [
    "Two-day festival schedule",
    "Live run-of-show updates",
    "Personal lineup",
    "Festival map and directions",
    "Prayer Wall",
    "Revive the City community game",
    "Offline access",
    "Push notifications",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://d2xsxph8kpxj0f.cloudfront.net" crossOrigin="" />
        {/* The Home hero is the LCP element on the main entry — start fetching it
            before the client bundle even parses. */}
        <link
          rel="preload"
          as="image"
          href="https://d2xsxph8kpxj0f.cloudfront.net/310519663378107536/KJYp3PsjqZ4zMkWznW5JC5/jfgood1_7ef3ec90.jpg"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://www.jesusfestival.ca" />
        <link rel="dns-prefetch" href="https://vmpkiwfvnlzraabtjkig.supabase.co" />
      </head>
      <body className="min-h-screen bg-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([EVENT_JSONLD, FAQ_JSONLD, APP_JSONLD, ORG_JSONLD]) }}
        />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Skip the service worker on localhost: dev chunk URLs aren't
              // content-hashed, so cache-first would keep serving stale code
              // and make edits look like they never applied.
              var isLocal = ['localhost', '127.0.0.1', '[::1]'].indexOf(location.hostname) !== -1;
              if ('serviceWorker' in navigator && !isLocal) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              } else if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function (rs) {
                  rs.forEach(function (r) { r.unregister(); });
                }).catch(function () {});
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
