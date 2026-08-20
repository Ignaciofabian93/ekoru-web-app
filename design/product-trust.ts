/**
 *
 * Usage:  className={productTrustIconClass[tone]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { ProductTrustTone } from "@/components/Patterns/ProductTrust/ProductTrust";
import { single } from "@/design/variants";

/**
 * The list sits in the same rail as `SellerCard` and the purchase panel, so it
 * carries their surface exactly: white, hairline `slate-200`, soft lift. The
 * old `border-light` (#f3f4f6) all but disappeared against the page.
 */
export const productTrustListClass = clsx(
  "bg-white flex flex-col divide-y",
  "divide-slate-200 rounded-2xl",
  "border border-slate-200 shadow-md shadow-slate-800/10",
);

export const productTrustItemClass = "flex items-start gap-3 px-4 py-3";

const productTrustIconBaseClass = clsx(
  "flex size-9 shrink-0 items-center justify-center",
  "rounded-xl border",
);

/**
 * Tinted glass in the recipe the rest of the page uses (`StatTile`, the impact
 * band's leaf chip): a wash of the hue, a hairline of the same hue, and the
 * icon carried in that color — rather than a flat 60%-opacity fill with a white
 * glyph, which read as muddy next to those.
 *
 * `secondary` takes its icon from the `-dark` step; cyan at full brightness is
 * too pale to sit on its own wash.
 */
const productTrustToneClass: Record<ProductTrustTone, string> = {
  primary:
    "border-primary/30 bg-linear-160 from-primary-light/25 to-primary-light/5 text-primary",
  secondary:
    "border-secondary/40 bg-linear-160 from-secondary-light/30 to-secondary-light/10 text-secondary-dark",
  accent: "border-accent/40 bg-linear-160 from-accent/20 to-accent/5 text-accent",
};

/** Icon chip per tone: `productTrustIconClass[tone]`. */
export const productTrustIconClass = single(
  productTrustIconBaseClass,
  productTrustToneClass,
);

/** Fallback order, so a list without explicit tones still alternates. */
export const productTrustToneCycle: ProductTrustTone[] = [
  "secondary",
  "accent",
  "primary",
];

export const productTrustBodyClass = "flex flex-col gap-0.5";

export const productTrustIconSize = 18;

export const productTrustIconStroke = 1.8;
