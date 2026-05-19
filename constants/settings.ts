export const SUPPORTED_LANGUAGES = ["es", "en", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "es";
export const LANGUAGE_STORAGE_KEY = "app_language";

export const hasLocale = (locale: string): locale is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(locale);
