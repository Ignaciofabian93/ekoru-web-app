/**
 *
 * Usage:  className={paginationPageClass[state]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import { single } from "@/design/variants";

export const paginationRootClass = clsx(
  "mt-6 flex flex-col-reverse items-center gap-4 pt-4",
  "border-t border-border-light",
  "sm:flex-row sm:justify-between",
);

export const paginationRowsGroupClass = "flex items-center gap-2";

export const paginationRowsLabelClass =
  "whitespace-nowrap font-sans text-sm font-medium text-foreground-secondary";

export const paginationSelectWrapperClass = "w-30";

export const paginationSpacerClass = "hidden sm:block";

export const paginationControlsClass = "flex flex-row items-center gap-1";

export const paginationPagesClass =
  "scrollbar-none flex flex-row items-center gap-1 overflow-x-auto";

export const paginationChevronClass = clsx(
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md",
  "border border-border bg-surface text-foreground-secondary transition-colors",
  "hover:border-primary hover:text-primary",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "disabled:hover:border-border disabled:hover:text-foreground-secondary",
);

const paginationPageBaseClass = clsx(
  "flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center rounded-md px-3",
  "font-sans text-sm font-semibold transition-colors",
);

/** Page button per state: `paginationPageClass[isCurrent ? "current" : "idle"]`. */
export const paginationPageClass = single(paginationPageBaseClass, {
  current: "bg-primary text-on-primary shadow-sm",
  idle: "text-foreground-secondary hover:bg-background-secondary hover:text-foreground",
});

export const paginationEllipsisClass =
  "flex h-9 min-w-9 items-center justify-center text-sm text-foreground-tertiary";

export const paginationChevronSize = 18;
