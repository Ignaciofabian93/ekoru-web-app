/**
 *
 * Usage:  className={badgeClass[variant][size]}
 *         className={productConditionBadgeClass[condition][size]}
 *         className={productInfoBadgeClass[type][size]}
 *         className={clsx(promoBadgeBaseClass, promoBadgeToneClass[badge])}
 * ─────────────────────────────────────────────────────────────────
 *
 * Three badge families, one place. They differ by what they claim, which is
 * why they don't share a palette:
 *
 *   `Badge`         — identity. Who this is: verified, seller type, points.
 *   condition/info  — the listing. What state this product is in.
 *   promo           — the seller's own claims. Marketing, from the API enum.
 */

import type { BadgeSize, BadgeVariant } from "@/components/Primitives/Badge/Badge";
import type { ProductInfoType } from "@/components/Primitives/Badge/ProductBadge";
import type { Badge as PromoBadge, ProductCondition } from "@/types/enums";
import { cross } from "@/design/variants";

/**
 * One shell for every badge on the site: the same pill, border, weight and
 * lift. Only the color changes between families — that is the whole point of
 * keeping the three tone maps below and nothing else.
 */
const badgeBaseClass =
  "inline-flex w-fit shrink-0 items-center rounded-full border font-semibold shadow-sm";

/**
 * Height is explicit rather than padding-derived, and `leading-none` takes the
 * text out of the calculation. Otherwise a badge carrying an icon renders a few
 * pixels taller than one that doesn't — which is exactly how the exchange badge
 * ended up bigger than the condition badge sitting next to it.
 */
const badgeSizeClass: Record<BadgeSize, string> = {
  small: "h-5 gap-1 px-2 text-[11px] leading-none",
  medium: "h-6 gap-1.5 px-2.5 text-xs leading-none",
  large: "h-7 gap-1.5 px-3 text-sm leading-none",
};

const badgeVariantClass: Record<BadgeVariant, string> = {
  primary: "border-primary bg-linear-120 from-primary to-primary/60 text-white",
  secondary:
    "border-secondary-dark bg-linear-120 from-secondary-dark to-secondary-dark/60 text-white",
  // Carried `text-secondary` (#22d3ee) on a 15% wash of itself — 1.6:1 against
  // that near-white fill, and the uncoloured `border` in the base class fell
  // back to `currentColor`, so the edge disappeared with it. The dark step of
  // the same hue reads at 4.8:1 and gives the pill a visible outline.
  tertiary: "border-secondary-dark/40 bg-secondary/15 text-secondary-dark",
  descriptive: "bg-primary/10 text-primary",
  attention: "bg-red-500 text-white",
  ghost: "border-border-light bg-transparent text-foreground-secondary",
};

/** Root class for every variant × size pair: `badgeClass[variant][size]`. */
export const badgeClass = cross(badgeBaseClass, badgeVariantClass, badgeSizeClass);

export const badgeIconSize: Record<BadgeSize, number> = {
  small: 12,
  medium: 14,
  large: 16,
};

/* ── Product badges ───────────────────────────────────────────────
 * Same shell as `Badge`, different palette. Every tone below follows the house
 * recipe — `border-x`, a 120° gradient from `x` to `x/60`, white text — so a
 * condition badge and a verified badge are the same object in two colors.
 *
 * Written out longhand on purpose: a helper like `gradient("emerald-700")`
 * would build the class names at runtime, and Tailwind's scanner only sees
 * complete literals. It would compile and render unstyled.
 */

/**
 * A spectrum walk from pristine to scrap, so the scale reads before the label
 * does: greens for as-new, cool blues for honestly used, warm amber and red for
 * wear the buyer needs to weigh. Every shade is a 700 (or the brand equivalent)
 * — lighter ones can't hold white text once the gradient fades to 60%.
 */
const conditionToneClass: Record<ProductCondition, string> = {
  // Untouched — the most saturated green on the scale.
  NEW: "border-emerald-700 bg-linear-120 from-emerald-700 to-emerald-700/60 text-white",
  // As good as new: the brand lime, one step down from emerald.
  LIKE_NEW:
    "border-primary-active bg-linear-120 from-primary-active to-primary-active/60 text-white",
  // Opened but unused — leaving green for the cool half of the scale.
  OPEN_BOX: "border-teal-700 bg-linear-120 from-teal-700 to-teal-700/60 text-white",
  // Restored: the brand cyan, the color Ekoru uses for things given a second life.
  REFURBISHED:
    "border-secondary-dark bg-linear-120 from-secondary-dark to-secondary-dark/60 text-white",
  // Honestly used and fine — a settled blue, neither praise nor warning.
  GOOD: "border-blue-700 bg-linear-120 from-blue-700 to-blue-700/60 text-white",
  // Wear worth factoring in — the first warm tone.
  FAIR: "border-amber-700 bg-linear-120 from-amber-700 to-amber-700/60 text-white",
  POOR: "border-orange-700 bg-linear-120 from-orange-700 to-orange-700/60 text-white",
  // Not expected to work — the end of the scale.
  FOR_PARTS: "border-red-700 bg-linear-120 from-red-700 to-red-700/60 text-white",
};

/** `productConditionBadgeClass[condition][size]`. */
export const productConditionBadgeClass = cross(
  badgeBaseClass,
  conditionToneClass,
  badgeSizeClass,
);

/**
 * Status rather than quality: what is happening to this listing right now.
 * Deliberately outside the condition spectrum, so the two never read as points
 * on the same scale.
 */
const infoToneClass: Record<ProductInfoType, string> = {
  // Near-black: a swap is a property of the listing, not an alarm.
  EXCHANGEABLE: "border-gray-800 bg-linear-120 from-gray-800 to-gray-800/60 text-white",
  // Bright red shouts, which is a promotion's whole job.
  OFFER: "border-danger bg-linear-120 from-danger to-danger/60 text-white",
  // Deep red — gone, rather than the offer's look-at-me red.
  SOLD_OUT: "border-red-900 bg-linear-120 from-red-900 to-red-900/60 text-white",
};

/** `productInfoBadgeClass[type][size]`. */
export const productInfoBadgeClass = cross(badgeBaseClass, infoToneClass, badgeSizeClass);

/* ── Promotional badges ───────────────────────────────────────────
 * The seller's own claims, keyed by the API's `Badge` enum. Grouped by what
 * the claim is about, so a row of them reads as two or three ideas rather than
 * a dozen unrelated colours: lime for the sustainability story, amber for
 * social proof, red for anything price-driven.
 */

export const promoBadgeBaseClass =
  "inline-flex w-fit items-center rounded-md px-2 py-0.5 text-xs font-semibold";

export const promoBadgeToneClass: Partial<Record<PromoBadge, string>> = {
  // Sustainability
  SUSTAINABLE: "bg-primary-light-bg text-primary-active",
  REFURBISHED: "bg-primary-light-bg text-primary-active",
  OPEN_BOX: "bg-primary-light-bg text-primary-active",
  CRUELTY_FREE: "bg-primary-light-bg text-primary-active",
  FOR_REPAIR: "bg-primary-light-bg text-primary-active",
  // Terms of the deal
  EXCHANGEABLE: "bg-secondary/15 text-secondary-dark",
  OPEN_TO_OFFERS: "bg-secondary/15 text-secondary-dark",
  FREE_SHIPPING: "bg-secondary/15 text-secondary-dark",
  DELIVERED_TO_HOME: "bg-secondary/15 text-secondary-dark",
  // Social proof
  BEST_SELLER: "bg-amber-50 text-amber-700",
  TOP_RATED: "bg-amber-50 text-amber-700",
  POPULAR: "bg-amber-50 text-amber-700",
  COMMUNITY_FAVORITE: "bg-amber-50 text-amber-700",
  HANDMADE: "bg-amber-50 text-amber-700",
  // Price and urgency
  DISCOUNTED: "bg-red-50 text-red-700",
  LIMITED_TIME_OFFER: "bg-red-50 text-red-700",
  FLASH_SALE: "bg-red-50 text-red-700",
  LAST_PRICE: "bg-red-50 text-red-700",
  BEST_VALUE: "bg-red-50 text-red-700",
  LIMITED_STOCK: "bg-red-50 text-red-700",
};

/** Anything the map above doesn't name — a new enum member ships readable. */
export const promoBadgeDefaultToneClass =
  "bg-background-tertiary text-foreground-secondary";
