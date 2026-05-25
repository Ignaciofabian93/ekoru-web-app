import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // All images are served from Cloudflare R2 via the ekoru-image-processor's
    // public CDN domains. See docs/R2_IMAGES_SETUP.md.
    remotePatterns: [
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
