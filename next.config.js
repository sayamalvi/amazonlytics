/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["m.media-amazon.com", "images-na.ssl-images-amazon.com"],
  },
  headers: {
    "/api/scrapeCron": {
      "Cache-Control": "no-store, max-age=0",
    },
  },
};

module.exports = nextConfig;
