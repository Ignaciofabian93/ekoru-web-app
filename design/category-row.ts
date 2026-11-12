/**
 *
 * Usage:  className={categoryRowIconClass}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";

/**
 * The category row is the business row with an icon where the logo goes, so
 * it shares the column, hover and skeleton classes.
 */
export {
  businessRowClass as categoryRowClass,
  businessRowItemClass as categoryRowItemClass,
  businessRowSkeletonAvatarClass as categoryRowSkeletonIconClass,
  businessRowSkeletonClass as categoryRowSkeletonClass,
  businessRowSkeletonLineClass as categoryRowSkeletonLineClass,
} from "./business-row";

/** Same 64px circle and ring as a business logo (`Avatar size="lg"`). */
export const categoryRowIconClass = clsx(
  "mb-1 flex size-16 shrink-0 items-center justify-center rounded-full",
  "bg-primary-light-bg text-primary-dark ring-1 ring-border-light transition",
  "group-hover:ring-primary/40",
);
