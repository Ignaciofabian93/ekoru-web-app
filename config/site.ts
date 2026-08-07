import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/constants/settings";

/** Canonical production origin. Override per-environment with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://app.ekoru.cl"
).replace(/\/$/, "");

export const SITE_NAME = "Ekoru";

/** BCP-47 locale tags used for hreflang / OpenGraph, keyed by app language code. */
export const HREFLANG: Record<string, string> = {
  es: "es-CL",
  en: "en-US",
  fr: "fr-FR",
};

export const OG_LOCALE: Record<string, string> = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
};

/**
 * Public, indexable routes (relative to `/{lang}`). The empty string is the
 * locale home page. Private areas (auth, profile, cart) are intentionally
 * excluded from the sitemap and disallowed in robots.txt.
 */
export const PUBLIC_PATHS = [
  "",
  "marketplace",
  "stores",
  "services",
  "publish",
  "community",
  "blog",
  "recycle",
  "contact",
  "about-ekoru",
  "terms-and-conditions",
] as const;

/** Path segments that must never be indexed (matched per-language in robots). */
export const PRIVATE_PATH_SEGMENTS = ["profile", "cart", "login", "register"] as const;

/** Builds an absolute URL for a given language + relative path. */
export const localizedUrl = (lang: string, path = ""): string => {
  const suffix = path ? `/${path}` : "";
  return `${SITE_URL}/${lang}${suffix}`;
};

/** hreflang alternates map (incl. x-default) for a relative path. */
export const buildLanguageAlternates = (path = ""): Record<string, string> => {
  const languages: Record<string, string> = {};
  for (const lang of SUPPORTED_LANGUAGES) {
    languages[HREFLANG[lang] ?? lang] = localizedUrl(lang, path);
  }
  languages["x-default"] = localizedUrl(DEFAULT_LANGUAGE, path);
  return languages;
};
