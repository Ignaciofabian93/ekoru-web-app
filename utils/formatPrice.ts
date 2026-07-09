const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Formats a price in `currency` (ISO 4217) using `locale` conventions, e.g.
 * (1234.5, "CLP", "es-CL") → "$1.235" and (1234.5, "CAD", "fr-CA") → "1 234,50 $".
 * Fraction digits follow the currency's own definition (CLP 0, CAD 2).
 * Prefer `useFormatPrice` in components; this is the underlying primitive.
 */
export function formatPrice(price: number, currency: string, locale: string): string {
  const key = `${locale}:${currency}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
    } catch {
      // Unknown currency code from upstream data — degrade instead of crashing the render.
      return `${currency} ${price}`;
    }
    formatters.set(key, formatter);
  }
  return formatter.format(price);
}
