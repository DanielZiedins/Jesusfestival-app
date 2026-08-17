import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE } from "@/lib/content";
import { serializeJsonLd, SITE_GRAPH_JSONLD } from "@/lib/seo";
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
    types: {
      "application/rss+xml": `${SITE.url}/feed.xml`,
      "text/calendar": `${SITE.url}/jesus-festival-2026.ics`,
    },
  },
  category: "events",
  authors: [{ name: "Jesus Festival" }],
  creator: "Jesus Festival",
  publisher: "Jesus Festival",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://vmpkiwfvnlzraabtjkig.supabase.co" />
      </head>
      <body className="min-h-screen bg-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(SITE_GRAPH_JSONLD) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
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
