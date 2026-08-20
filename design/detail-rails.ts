/**
 *
 * Usage:  <div className={RAILS}><div className={RAIL_MAIN}>…
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * The two rails every detail page is built on — marketplace listing, store
 * product, service. Declared once and reused by every row, which is what keeps
 * the columns lined up from the gallery down to the spec table, and what makes
 * the three pages read as one product. Stacked below `md`: at phone width the
 * rails would be too narrow to read.
 */
export const RAILS = "grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start md:gap-10";

/** The wide rail: gallery, description — whatever carries the page. */
export const RAIL_MAIN = "md:col-span-7";

/** The narrow rail: identity, price and actions, seller, trust, specs. */
export const RAIL_SIDE = "md:col-span-5";
