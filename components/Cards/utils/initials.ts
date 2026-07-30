/**
 * First letters of the first two words, e.g. "Verde Market" → "VM". Used as the
 * logo fallback on seller cards.
 */
export function getInitials(name?: string | null): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
