/**
 * Path of a catalog page, built from category slugs: `/es/marketplace/<department>/<category>`.
 * Returns `undefined` when any slug is missing, so a breadcrumb stays plain
 * text instead of linking to `/es/marketplace/null`.
 */
export function catalogPath(
  lang: string,
  section: string,
  ...slugs: (string | null | undefined)[]
): string | undefined {
  if (slugs.some((slug) => !slug)) return undefined;
  return `/${lang}/${section}/${slugs.join("/")}`;
}
