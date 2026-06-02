import type { MetadataRoute } from "next";

import { SITE_URL, PRIVATE_PATH_SEGMENTS } from "@/config/site";
import { ENVIRONMENT } from "@/config/environment";

/**
 * robots.txt — generated for every environment.
 *
 * Private areas are disallowed across all languages via a per-language
 * wildcard (e.g. `/es/profile`, `/en/cart`). Non-production deployments
 * (staging/preview) block all crawling so only app.ekoru.cl gets indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = ENVIRONMENT === "production";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const disallow = ["/api/", ...PRIVATE_PATH_SEGMENTS.map((segment) => `/*/${segment}`)];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
