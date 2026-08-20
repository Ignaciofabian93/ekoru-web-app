import type { SupportedLanguage } from "@/constants/settings";

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  es: "es-CL",
  en: "en-US",
  fr: "fr-FR",
};

/**
 * The listing date, e.g. "14 ago 2026". Shared by the summary's meta line and
 * the spec table, which show the same date in the same shape.
 */
export function formatDate(value: string | undefined, lang: SupportedLanguage): string {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}
