/**
 *
 * Usage:  className={coverBannerClass}
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Fixed height and rounded: the band is pinned to the content column rather
 * than bleeding to the viewport edges, so it reads as this profile's header
 * instead of a full-page hero.
 */
export const coverBannerClass = "relative h-50 w-full overflow-hidden rounded-2xl";

/**
 * A user cover is any aspect ratio, so it is shown whole over a blurred, blown-up
 * copy of itself — the letterbox space fills with the photo's own colors instead
 * of dead space. `scale-110` zooms past the edges so the blur never reveals a
 * bare border.
 */
export const coverBannerBackdropClass = "scale-110 object-cover blur-2xl";

export const coverBannerScrimClass = "absolute inset-0 bg-black/10";

/** The foreground copy: the whole image, uncropped and undistorted. */
export const coverBannerImageClass = "object-contain";

/** The default wallpaper is authored for this band, so it crops cleanly. */
export const coverBannerFallbackClass = "object-cover";

/**
 * Bottom fade grounds the avatar and adds depth. Shallow on purpose — a deeper
 * one would wash out most of a 200px band.
 */
export const coverBannerFadeClass =
  "pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/25 to-transparent";
