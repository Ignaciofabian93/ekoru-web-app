/**
 * Number formatting for the impact figures.
 *
 * Two surfaces render the same stored savings — the dashboard's
 * `ImpactSnapshot` and the full `ImpactDashboard` — so they format through the
 * same table. Otherwise the two would disagree on separators and decimals for
 * what is literally the same kilogram.
 *
 * Unit strings ("kg", "L") stay with the caller.
 */
const INTL_LOCALE: Record<string, string> = {
  es: "es-CL",
  en: "en-US",
  fr: "fr-FR",
};

export const impactLocale = (lang: string) => INTL_LOCALE[lang] ?? INTL_LOCALE.es;

/** Kilograms of CO₂ — one decimal, because savings are often fractional. */
export const formatCo2KG = (kg: number, lang: string) =>
  new Intl.NumberFormat(impactLocale(lang), { maximumFractionDigits: 1 }).format(kg);

/** Litres of water — always whole; a fraction of a litre is noise here. */
export const formatWaterLT = (lt: number, lang: string) =>
  new Intl.NumberFormat(impactLocale(lang), { maximumFractionDigits: 0 }).format(lt);

/** Item, sale and exchange counts. */
export const formatCount = (n: number, lang: string) =>
  new Intl.NumberFormat(impactLocale(lang), { maximumFractionDigits: 0 }).format(n);
