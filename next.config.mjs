// The volunteer app (codes, team chat, roster, the grounds map, check-in) is a
// separate deployment on Azure. Rather than run it on its own URL, we proxy it
// in under /volunteer so volunteers and the public share one domain and one
// install prompt. It builds with base "/volunteer/", so paths line up 1:1.
const VOLUNTEER_APP_ORIGIN =
  process.env.VOLUNTEER_APP_ORIGIN ?? "https://zealous-desert-0f13fd40f.7.azurestaticapps.net";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Next normally 308s "/volunteer/" -> "/volunteer". The volunteer app is a PWA
  // whose manifest scope and service-worker scope are both "/volunteer/", so that
  // redirect would land every launch outside its own scope: it opens in a browser
  // tab instead of standalone, and the SW doesn't control the start URL (no
  // offline start). Skipping the redirect lets the rewrite below serve the
  // trailing-slash URL directly. Next still serves both forms of every other route.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: "/volunteer", destination: `${VOLUNTEER_APP_ORIGIN}/volunteer/` },
      { source: "/volunteer/:path*", destination: `${VOLUNTEER_APP_ORIGIN}/volunteer/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d2xsxph8kpxj0f.cloudfront.net" },
      { protocol: "https", hostname: "www.jesusfestival.ca" },
      { protocol: "https", hostname: "jesusfestival.ca" },
    ],
  },
};

export default nextConfig;
