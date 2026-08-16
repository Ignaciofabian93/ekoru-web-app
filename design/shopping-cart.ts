/**
 *
 * Usage:  className={shoppingCartButtonClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const shoppingCartButtonClass = clsx(
  "relative flex w-10 h-10 shrink-0 cursor-pointer items-center justify-center",
  "rounded-full border border-white/25 bg-white/10 outline-none",
  "transition-all duration-150 hover:border-white/50 hover:bg-white/20",
  "focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/80",
);

export const shoppingCartBadgeClass = clsx(
  "absolute -right-2 -top-1 flex h-5 min-w-5 items-center justify-center",
  "rounded-full border border-white/40 bg-secondary-dark font-bold leading-none",
);

/** Two digits need breathing room the single-digit pill doesn't. */
export const shoppingCartBadgePadClass = {
  wide: "px-1",
  narrow: "px-0",
};

export const shoppingCartIconSize = 18;

export const shoppingCartIconStroke = 1.6;
