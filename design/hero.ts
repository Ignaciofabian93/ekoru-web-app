/**
 *
 * Usage:  className={clsx(heroFrameClass, heroHeightClass, …)}
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * The frame every page hero shares — the home carousel, `PageHero` and
 * `BreadcrumbHero`: 95% of the viewport up to the 6xl column, centred, with
 * rounded corners that clip the wallpaper and its scrim.
 */
export const heroFrameClass = "mx-auto mt-4 w-[95%] max-w-6xl overflow-hidden rounded-lg";

/** 40% of the viewport, never shorter than 15rem. */
export const heroHeightClass = "h-[40vh] min-h-60";
