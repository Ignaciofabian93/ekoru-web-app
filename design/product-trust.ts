/**
 *
 * Usage:  className={productTrustIconClass[tone]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { ProductTrustTone } from "@/components/Patterns/ProductTrust/ProductTrust";
import { single } from "@/design/variants";

export const productTrustListClass = clsx(
  "bg-white flex flex-col divide-y",
  "divide-border-light rounded-2xl",
  "border border-border-light",
);

export const productTrustItemClass = "flex items-start gap-3 px-4 py-3";

const productTrustIconBaseClass =
  "flex size-9 shrink-0 items-center justify-center rounded-full";

const productTrustToneClass: Record<ProductTrustTone, string> = {
  primary: "bg-primary/60 text-white",
  secondary: "bg-secondary/60 text-white",
  accent: "bg-accent/60 text-white",
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

export const productTrustBodyClass = "flex flex-col";

export const productTrustIconSize = 18;

export const productTrustIconStroke = 1.8;
