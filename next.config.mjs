/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "d2xsxph8kpxj0f.cloudfront.net" },
      { protocol: "https", hostname: "www.jesusfestival.ca" },
      { protocol: "https", hostname: "jesusfestival.ca" },
    ],
  },
};

export default nextConfig;
