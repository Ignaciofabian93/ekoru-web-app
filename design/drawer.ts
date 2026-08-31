/**
 *
 * Usage:  className={drawerRowClass}
 * ─────────────────────────────────────────────────────────────────
 *
 * The shared skin of a top-level drawer row — a plain link (`MenuRow`) or an
 * accordion's header. They sit in the same list, so their icon, label and
 * trailing treatment have to be defined once or they drift apart.
 *
 * Mirrors the profile screen's rows (`features/profile/ui/Account.tsx`,
 * `SettingRow.tsx`): bare icons and a trailing chevron as the affordance. The
 * counts beside them are the shared `Badge` primitive, so there is no pill
 * class here to drift from it.
 */

import clsx from "clsx";

export const drawerRowClass = clsx(
  "flex w-full flex-row items-center gap-3 px-3.5 py-3.25 text-left",
  "transition-colors",
);

/**
 * Icons sit bare rather than in a tinted tile. The drawer is a long list, and a
 * column of lime squares reads as a column of badges all asking for attention —
 * the profile screen dropped them for the same reason.
 */
export const drawerRowIconClass =
  "flex shrink-0 items-center justify-center text-foreground-secondary";

export const drawerRowIconSize = 20;

/** Trailing group: the coming-soon chip or a count, then the chevron. */
export const drawerRowTrailingClass = "flex shrink-0 items-center gap-2";

export const drawerRowChevronClass = "shrink-0 text-primary";

export const drawerRowChevronSize = 16;
