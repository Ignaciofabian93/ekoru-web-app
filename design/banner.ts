/**
 *
 * Usage:  className={bannerClass[variant]}
 * ─────────────────────────────────────────────────────────────────
 */

import type { BannerVariant } from "@/components/Patterns/Banner/Banner";
import { single } from "@/design/variants";

const bannerBaseClass =
  "box-border w-full self-center overflow-hidden rounded-lg px-5 py-3.5";

const bannerVariantClass: Record<BannerVariant, string> = {
  primary: "bg-linear-to-r from-primary-dark via-primary to-primary-dark shadow-lg",
  secondary:
    "bg-linear-to-r from-secondary-dark via-secondary to-secondary-dark shadow-lg",
  outlined: "border-2 border-solid border-primary bg-background shadow-lg",
  ghost: "bg-white/50",
};

/** Container for each variant: `bannerClass[variant]`. */
export const bannerClass = single(bannerBaseClass, bannerVariantClass);

export const bannerTextToneClass: Record<BannerVariant, string> = {
  primary: "text-on-primary",
  secondary: "text-on-primary",
  outlined: "text-foreground",
  ghost: "text-foreground",
};

export const bannerDotClass: Record<BannerVariant, string> = {
  primary: "bg-on-primary",
  secondary: "bg-on-primary",
  outlined: "bg-primary",
  ghost: "bg-foreground-secondary",
};

export const bannerHeaderClass = "mb-2 flex flex-row items-center justify-center gap-2";

export const bannerDotBaseClass = "size-2 rounded-sm";

export const bannerTitleClass =
  "shrink text-center font-sans text-base font-bold tracking-[-0.3px]";

export const bannerDescriptionClass =
  "m-0 text-center font-sans text-sm font-normal leading-5";
