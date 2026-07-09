export const SUPPORTED_LANGUAGES = ["es", "en", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "es";
export const LANGUAGE_STORAGE_KEY = "app_language";
/** Cookie that persists the user's locale choice so middleware can read it server-side. */
export const LANGUAGE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (locale: string): locale is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(locale);

const ALL_LANGUAGE_NAMES: Record<string, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
};

export const LANGUAGES_AVAILABLE = SUPPORTED_LANGUAGES.map((code) => ({
  code,
  name: ALL_LANGUAGE_NAMES[code],
}));

export const CURRENCIES_SUPPORTED = [
  "ARS",
  "BOB",
  "BRL",
  "CAD",
  "CLP",
  "COP",
  "EUR",
  "GBP",
  "MXN",
  "PEN",
  "PYG",
  "USD",
  "UYU",
  "VES",
] as const;

export type Currency = (typeof CURRENCIES_SUPPORTED)[number];

export const DEFAULT_CURRENCY: Currency = "USD";
/** Cookie that persists the user's currency choice. */
export const CURRENCY_COOKIE = "ekoru_currency";

export const hasCurrency = (value: string): value is Currency =>
  (CURRENCIES_SUPPORTED as readonly string[]).includes(value);

/**
 * Market currency for each supported country. Product prices are stored in the
 * seller's market currency, so display formatting derives the currency from the
 * visitor's country unless the amount carries its own (e.g. cart lines).
 */
export const CURRENCY_BY_COUNTRY: Record<SupportedCountry, Currency> = {
  CL: "CLP",
  CA: "CAD",
};

/** Countries the marketplace serves (ISO 3166-1 alpha-2). Extend as markets open. */
export const SUPPORTED_COUNTRIES = ["CL", "CA"] as const;
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

export const DEFAULT_COUNTRY: SupportedCountry = "CL";

/**
 * Cookie persisting the user's country choice. Read client-side and sent as the
 * required `country` arg on the `search` query so results are scoped to that
 * market (for guests and authenticated users alike).
 */
export const COUNTRY_COOKIE = "ekoru_country";

const ALL_COUNTRY_NAMES: Record<string, string> = {
  CL: "Chile",
  CA: "Canada",
  AR: "Argentina",
  FR: "France",
  US: "United States",
};

export const COUNTRIES_AVAILABLE = SUPPORTED_COUNTRIES.map((code) => ({
  code,
  name: ALL_COUNTRY_NAMES[code] ?? code,
}));

export const hasCountry = (value: string): value is SupportedCountry =>
  (SUPPORTED_COUNTRIES as readonly string[]).includes(value);
