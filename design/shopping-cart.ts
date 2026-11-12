/**
 *
 * Usage:  className={shoppingCartButtonClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

/**
 * Same button as the header's "Cuenta"; `relative` anchors the count badge.
 * Icon-only below `sm`, where it is a square like "Publicar" and the menu.
 */
export const shoppingCartButtonClass = clsx("btn btn-secondary relative px-2 sm:px-4");

export const shoppingCartBadgeClass = clsx(
  "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center",
  "rounded-full border border-secondary/40 bg-linear-90 from-primary-dark to-primary font-bold leading-none",
);

export const shoppingCartBadgePadClass = {
  wide: "px-1",
  narrow: "px-0",
};

/**
 * Same as "Publicar"'s icon. On mobile the label is hidden, so the icon alone
 * sets the button's height: 18 keeps it level with "Publicar" and the menu
 * button. From `sm` up the label's line sets the height anyway.
 */
export const shoppingCartIconSize = 18;

export const shoppingCartIconStroke = 1.8;
