/**
 *
 * Usage:  className={linkButtonClass[variant][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import clsx from "clsx";
import type {
  LinkButtonSize,
  LinkButtonVariant,
} from "@/components/Primitives/LinkButton/LinkButton";
import { cross } from "@/design/variants";

const linkButtonBaseClass = clsx(
  "inline-flex items-center justify-center rounded-md",
  "transition-all duration-200 ease-in-out",
);

const linkButtonSizeClass: Record<LinkButtonSize, string> = {
  sm: "px-2 py-1",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
};

const linkButtonVariantClass: Record<LinkButtonVariant, string> = {
  primary:
    "border border-primary bg-linear-180 from-primary to-primary-light/80 text-on-primary",
  outlined: "border-2 border-primary bg-surface text-primary",
  ghost: "bg-transparent text-primary",
};

/** Root class for every variant × size pair: `linkButtonClass[variant][size]`. */
export const linkButtonClass = cross(
  linkButtonBaseClass,
  linkButtonVariantClass,
  linkButtonSizeClass,
);

/**
 * The message sits on its own line under the label, so the control becomes a
 * column once there is one.
 */
export const linkButtonLayoutClass = {
  withMessage: "flex-col gap-1",
  default: "gap-1.5",
};

export const linkButtonStateClass = {
  disabled: "cursor-not-allowed opacity-60",
  default: "cursor-pointer",
};

export const linkButtonContentClass = "inline-flex items-center justify-center gap-1.5";

export const linkButtonLabelClass = "cursor-pointer";

export const linkButtonGhostLabelClass =
  "transition-all duration-200 ease-in-out hover:brightness-110";

export const linkButtonIconSize = 14;
