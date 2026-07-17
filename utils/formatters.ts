/**
 * Normalizes an optional text field for display: trims it and returns `null`
 * when it's absent or blank, so callers can fall back to a placeholder with a
 * plain `?? t("...")`. Use for product fields that the API may return empty
 * (brand, color, …).
 */
export const cleanText = (value?: string | null): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const formatInitials = (displayName: string): string => {
  const formatted: string = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return formatted;
};

export function humanizeSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => (word === "y" ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}
