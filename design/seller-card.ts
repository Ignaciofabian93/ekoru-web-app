/**
 *
 * Usage:  className={sellerCardClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const sellerCardRootClass = "px-2";

export const sellerCardTitleClass = "mb-3";

export const sellerCardClass = clsx(
  "flex items-start justify-between gap-4 rounded-2xl",
  "backdrop-blur-xl",
  "p-4 bg-white shadow-md shadow-slate-800/10 border border-slate-200",
);

export const sellerCardHeaderClass = "flex items-start gap-3";

export const sellerCardAvatarClass =
  "bg-background-secondary relative size-18 shrink-0 overflow-hidden rounded-full";

export const sellerCardAvatarImageClass = "object-cover";

export const sellerCardAvatarFallbackClass =
  "flex h-full w-full items-center justify-center text-foreground-muted";

export const sellerCardIdentityClass = "flex flex-col items-start justify-start gap-1";

export const sellerCardNameClass = "truncate mb-1";

export const sellerCardBadgeRowClass = "flex items-center justify-start gap-1";

export const sellerCardFooterClass = "flex items-center justify-end";

export const sellerCardAvatarIconSize = 22;
