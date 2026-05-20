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
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.ekoru.cl",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
