/**
 *
 * Usage:  className={adBannerClass[variant]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { AdBannerVariant } from "@/components/Patterns/AdBanner/AdBanner";
import { single } from "@/design/variants";

const adBannerBaseClass = clsx(
  "relative mx-auto box-border w-full overflow-hidden rounded-2xl",
  "px-5 py-5 md:px-6 md:py-6",
  "shadow-sm ring-1 ring-black/5",
);

// Every variant is an eco gradient so banners feel part of the same family:
// green = forest/brand green, teal = ocean teal, charcoal = satin graphite,
// emerald = green→teal growth. All are dark enough to carry white content.
const adBannerVariantClass: Record<AdBannerVariant, string> = {
  green: "bg-linear-to-r from-primary-dark via-primary to-primary-dark",
  teal: "bg-linear-to-r from-secondary-dark via-secondary to-secondary-dark",
  charcoal: "bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-900",
  emerald: "bg-linear-to-br from-green-700 via-emerald-600 to-teal-600",
};

/** Container for each variant: `adBannerClass[variant]`. */
export const adBannerClass = single(adBannerBaseClass, adBannerVariantClass);

const adBannerCtaBaseClass = clsx(
  "group flex w-full items-center justify-center gap-1.5 md:w-auto",
  "rounded-full bg-white px-4 py-2.5",
  "text-sm font-bold shadow-sm transition hover:shadow-md",
);

// The CTA is always a white pill; only its accent (text/icon) shifts per variant
// so it stays legible and on-brand against each background.
const adBannerCtaAccentClass: Record<AdBannerVariant, string> = {
  green: "text-primary",
  teal: "text-secondary-dark",
  charcoal: "text-zinc-800",
  emerald: "text-emerald-700",
};

export const adBannerCtaClass = single(adBannerCtaBaseClass, adBannerCtaAccentClass);

/** Decorative eco circles — mirror the category / hero cards. */
export const adBannerDecorTopClass =
  "pointer-events-none absolute -top-14 -right-10 size-40 rounded-full bg-white/10";

export const adBannerDecorBottomClass =
  "pointer-events-none absolute -bottom-16 -left-8 size-36 rounded-full bg-white/10";

export const adBannerContentClass = clsx(
  "relative flex flex-col items-center gap-4 text-center",
  "md:flex-row md:justify-between md:gap-5 md:text-left",
);

export const adBannerIconClass = clsx(
  "flex size-14 shrink-0 items-center justify-center rounded-xl md:size-16",
  "bg-white/15 text-white ring-1 ring-white/25",
);

export const adBannerBodyClass = "flex flex-1 flex-col gap-1";

export const adBannerTitleClass =
  "m-0 font-sans text-base font-bold text-white md:text-lg";

export const adBannerDescriptionClass =
  "m-0 font-sans text-sm font-normal leading-5 text-white/80";

export const adBannerCtaIconClass = "transition-transform group-hover:translate-x-0.5";

export const adBannerIconSize = 30;

export const adBannerCtaIconSize = 16;
