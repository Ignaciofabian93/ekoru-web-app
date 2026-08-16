/**
 *
 * Usage:  className={breadcrumbNavClass}
 * ─────────────────────────────────────────────────────────────────
 */

export const breadcrumbNavClass = "flex flex-row flex-wrap items-center ml-2 mb-6 -mt-2";

export const breadcrumbItemClass = "flex flex-row items-center gap-1";

export const breadcrumbButtonClass = "cursor-pointer px-0 py-0.5";

export const breadcrumbLinkClass = "underline";

/**
 * The chevron takes a `color` prop rather than a class, so these are raw values
 * — `inverted` for crumbs over a photographic hero, `default` on content.
 */
export const breadcrumbChevronColor = {
  inverted: "white",
  default: "#94a3b8",
};

export const breadcrumbChevronSize = 12;
