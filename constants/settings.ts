export const SUPPORTED_LANGUAGES = ["es", "en", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "es";
export const LANGUAGE_STORAGE_KEY = "app_language";

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
