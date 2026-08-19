/**
 *
 * Usage:  className={quantityStepperClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type { ButtonSize } from "@/components/Primitives/Button/Button.types";
import { buttonPaddingClass, buttonSizeClass, buttonVariantClass } from "@/design/button";
import { cross } from "@/design/variants";

/**
 * The shell is a button: same gradient, border, height and radius, taken from
 * the button's own maps so the two can't drift. What it drops is what belongs
 * to a press — the pointer cursor and the press-scale live on the ± controls
 * inside, not on the group that holds them.
 */
const quantityStepperBaseClass = clsx(
  "relative box-border inline-flex flex-row items-center justify-between",
  "mx-auto min-w-35 overflow-hidden",
  "font-sans font-bold leading-[1.45]",
  "select-none",
  "border border-solid outline-none",
  "transition duration-200 ease-in-out",
  buttonPaddingClass,
);

/** Root class for every variant × size pair: `quantityStepperClass[variant][size]`. */
export const quantityStepperClass = cross(
  quantityStepperBaseClass,
  buttonVariantClass,
  buttonSizeClass,
);

/**
 * The ± controls. They stretch to the shell's full height, so the hit target is
 * the whole end of the control rather than a glyph in the middle of it.
 *
 * Feedback tints with `bg-current`, which is whatever text color the variant
 * set — that reads on a white-on-primary shell and a dark-on-outline one alike,
 * so no variant needs its own hover rule.
 */
const quantityStepperStepBaseClass = clsx(
  "flex shrink-0 cursor-pointer items-center justify-center self-stretch",
  "text-current transition-[background-color,transform] duration-150 ease-in-out",
  "hover:bg-current/15 active:scale-[0.88]",
  "focus-visible:bg-current/15 focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-40",
  "disabled:hover:bg-transparent disabled:active:scale-100",
);

/** Widths mirror the button's horizontal padding at each size. */
export const quantityStepperStepClass: Record<ButtonSize, string> = {
  sm: clsx(quantityStepperStepBaseClass, "w-9"),
  md: clsx(quantityStepperStepBaseClass, "w-11"),
  lg: clsx(quantityStepperStepBaseClass, "w-12"),
};

/**
 * The count sits between the two controls and takes the leftover width, so it
 * stays optically centered. `tabular-nums` keeps the ± from shifting sideways
 * as the number gains a digit.
 */
export const quantityStepperValueClass = "flex-1 px-1 text-center tabular-nums";
