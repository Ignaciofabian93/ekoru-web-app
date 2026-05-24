import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/images/**",
      },
      // Legacy gateway-served images (kept until existing rows are backfilled
      // off the /home/ekoru/images volume).
      {
        protocol: "https",
        hostname: "staging-api.ekoru.cl",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.ekoru.cl",
        pathname: "/images/**",
      },
      // Cloudflare R2 custom domains, fronted by the ekoru-image-processor.
      {
        protocol: "https",
        hostname: "images.ekoru.cl",
      },
      {
        protocol: "https",
        hostname: "staging-images.ekoru.cl",
      },
    ],
  },
};

export default nextConfig;
