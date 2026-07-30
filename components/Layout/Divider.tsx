import clsx from "clsx";
import { spacing, type Gap } from "./tokens";

type Tone = "default" | "subtle" | "inverse";

const TONE_CLASS: Record<Tone, string> = {
  default: "bg-border-strong",
  subtle: "bg-border-light",
  /** For dark or gradient backgrounds, where a border token would disappear. */
  inverse: "bg-white/10",
};

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  tone?: Tone;
  /** Space on both sides of the rule. */
  spacingSize?: Gap;
  className?: string;
}

/**
 * A one-pixel rule. Rendered as a `<div>` rather than `<hr>`: it is decorative
 * here, and `<hr>` carries a `separator` role that adds noise to screen-reader
 * output when it only divides visual bands.
 */
export function Divider({
  orientation = "horizontal",
  tone = "subtle",
  spacingSize = 0,
  className,
}: DividerProps) {
  const isVertical = orientation === "vertical";
  return (
    <div
      aria-hidden
      className={clsx(
        "shrink-0",
        TONE_CLASS[tone],
        isVertical ? "h-full w-px" : "h-px w-full",
        className,
      )}
      style={
        isVertical
          ? { marginInline: spacing[spacingSize] }
          : { marginBlock: spacing[spacingSize] }
      }
    />
  );
}
