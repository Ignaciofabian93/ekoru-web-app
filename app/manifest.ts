import type { MetadataRoute } from "next";

import { SITE_NAME } from "@/config/site";
import { DEFAULT_LANGUAGE } from "@/constants/settings";

/**
 * PWA web app manifest. A manifest is a single document (not per-locale), so it
 * uses the default language; localized discovery is handled via metadata + hreflang.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ekoru — Plataforma Sostenible",
    short_name: SITE_NAME,
    description:
      "Compra, vende y recicla de forma sostenible. La plataforma circular que conecta personas y comunidades con el medioambiente.",
    lang: DEFAULT_LANGUAGE,
    start_url: `/${DEFAULT_LANGUAGE}`,
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdfffc",
    theme_color: "#65a30d",
    categories: ["shopping", "lifestyle", "sustainability"],
    icons: [
      {
        src: "/brand/icon.webp",
        sizes: "any",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
