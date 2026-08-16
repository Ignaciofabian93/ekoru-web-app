/**
 *
 * Usage:  className={tabsItemClass[state]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export type TabsState = "active" | "idle";

export const tabsListClass =
  "relative flex items-center gap-6 border-b border-border-light";

export const tabsScrollableClass = "scrollbar-none overflow-x-auto";

const tabsItemBaseClass = clsx(
  "flex shrink-0 items-center gap-2 whitespace-nowrap pb-2.5",
  "text-sm font-semibold transition-colors",
);

/** Tab label for each state: `tabsItemClass[active ? "active" : "idle"]`. */
export const tabsItemClass = single(tabsItemBaseClass, {
  active: "text-primary",
  idle: "text-foreground-tertiary hover:text-foreground-secondary",
} satisfies Record<TabsState, string>);

const tabsCountBaseClass = "text-xs font-medium tabular-nums transition-colors";

export const tabsCountClass = single(tabsCountBaseClass, {
  active: "text-primary/70",
  idle: "text-foreground-muted",
} satisfies Record<TabsState, string>);

/** Width and offset are measured at runtime, so only the paint lives here. */
export const tabsIndicatorClass = clsx(
  "absolute -bottom-px h-0.5 rounded-full bg-primary",
  "transition-[transform,width] duration-300 ease-out",
);
