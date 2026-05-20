import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.staging.ekoru.cl",
      },
      {
        protocol: "https",
        hostname: "api.ekoru.cl",
      },
    ],
  },
};

export default nextConfig;
