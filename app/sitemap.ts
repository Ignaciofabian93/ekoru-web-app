import type { MetadataRoute } from "next";

import { SUPPORTED_LANGUAGES } from "@/constants/settings";
import { PUBLIC_PATHS, localizedUrl, buildLanguageAlternates } from "@/config/site";

/**
 * sitemap.xml covering every public route in every supported language.
 *
 * Each (language, path) pair is emitted as its own URL with `alternates.languages`
 * pointing at the other locales (plus x-default), so search engines understand the
 * multilingual relationship. Dynamic routes (products, sellers, stores, marketplace
 * departments) are not enumerated here — when those need indexing, fetch their slugs
 * and append them following the same `localizedUrl` / `buildLanguageAlternates` shape.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SUPPORTED_LANGUAGES.flatMap((lang) =>
    PUBLIC_PATHS.map((path) => ({
      url: localizedUrl(lang, path),
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: buildLanguageAlternates(path),
      },
    })),
  );
}
