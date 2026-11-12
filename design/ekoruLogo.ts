/**
 *
 * Usage:  className={ekoruLogoImageClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

export const ekoruLogoLinkClass = clsx(
  "rounded-sm outline-none",
  // "drop-shadow-xl brightness-120",
  "hover:brightness-110 transition duration-300 ease-in-out",
);

/** Default sizing, used when the caller passes no className of its own. */
export const ekoruLogoImageClass = "min-w-18 w-full max-w-24 drop-shadow-sm";
