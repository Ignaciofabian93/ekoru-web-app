/**
 *
 * Usage:  className={notificationBannerClass[variant]}
 * ─────────────────────────────────────────────────────────────────
 */

import type { NotificationBannerVariant } from "@/components/Patterns/NotificationBanner/NotificationBanner";
import { single } from "@/design/variants";

const notificationBannerBaseClass = "w-full px-2 py-1.5";

const notificationBannerVariantClass: Record<NotificationBannerVariant, string> = {
  neutral: "bg-primary-dark text-on-primary",
  info: "bg-linear-90 from-secondary/90 via-secondary-dark/90 to-secondary/90 text-white",
  warning: "bg-accent text-primary-dark",
};

/** Container for each variant: `notificationBannerClass[variant]`. */
export const notificationBannerClass = single(
  notificationBannerBaseClass,
  notificationBannerVariantClass,
);

/** Pinned to the navbar's own content width so the two rows line up. */
export const notificationBannerContentClass =
  "mx-auto flex w-full max-w-4xl items-center justify-center gap-2 px-2 text-center";

export const notificationBannerTextClass =
  "font-sans text-xs font-medium leading-4 sm:text-sm";
