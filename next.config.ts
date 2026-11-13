import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

/**
 * Security headers (WEB-26). Kept in this file on purpose: the Dockerfile
 * copies only next.config.ts into the running image, so it can't import.
 *
 * Enforced today: nobody may put the web app in a frame (clickjacking), the
 * browser doesn't guess content types, other sites get only our origin as
 * referrer, and pages get the visitor's location only from this site, never
 * the camera or microphone.
 */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

/**
 * The rest of the policy, in report-only mode: the browser lists in its console
 * what it would have blocked and blocks nothing. Once the console stays quiet
 * on every screen, move these directives into Content-Security-Policy above,
 * next to frame-ancestors, and delete this header (WEB-26 step 3).
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // Next's own inline bootstrap scripts need 'unsafe-inline' without nonces.
  // React's development build also uses eval; production never does.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // R2 images, and the recycling map's OpenStreetMap tiles.
  "img-src 'self' data: blob: https://images.ekoru.cl https://staging-images.ekoru.cl https://*.tile.openstreetmap.org",
  "font-src 'self' data:",
  // The location lookup (Nominatim) and the recycling map's points (Overpass).
  `connect-src 'self' https://nominatim.openstreetmap.org https://overpass-api.de https://overpass.kumi.systems https://overpass.private.coffee${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // No "x-powered-by: Next.js" on every response.
  poweredByHeader: false,
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...SECURITY_HEADERS,
          { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
        ],
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ["192.168.1.9"],
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
