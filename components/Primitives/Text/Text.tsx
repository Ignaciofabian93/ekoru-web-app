import clsx from "clsx";
import {
  textAlignClass,
  textBaseClass,
  textBlockquoteBarClass,
  textBlockquoteWrapperClass,
  textColorClass,
  textLineClampClass,
  textSizeClass,
  textVariantClass,
  textWeightClass,
} from "@/design/text";
import { lineHeight } from "@/design/tokens";
import type { TextProps, TextSize, TextVariant, TextWeight } from "./Text.types";

const VARIANT_DEFAULTS: Partial<
  Record<TextVariant, { size?: TextSize; weight?: TextWeight }>
> = {
  label: { weight: "medium" },
  small: { size: "xs" },
  code: { size: "sm" },
};

export function Text({
  variant = "p",
  size,
  weight,
  color = "default",
  leading = "relaxed",
  align = "left",
  style,
  children,
  numberOfLines,
  className,
  onClick,
  ref,
}: TextProps) {
  const defaults = VARIANT_DEFAULTS[variant] ?? {};
  const resolvedSize = size ?? defaults.size ?? "base";
  const resolvedWeight = weight ?? defaults.weight ?? "normal";

  const computed = clsx(
    textBaseClass,
    textSizeClass[resolvedSize],
    textWeightClass[resolvedWeight],
    textColorClass[color],
    textAlignClass[align],
    numberOfLines && textLineClampClass[numberOfLines],
    textVariantClass[variant],
  );

  // The rendered tag varies per variant, so the ref cannot be narrowed here.
  const sharedProps = {
    ref: ref as never,
    style: { lineHeight: lineHeight[leading], ...style },
    className: clsx(computed, className),
    onClick,
  };

  if (variant === "blockquote") {
    return (
      <div className={textBlockquoteWrapperClass}>
        <div className={textBlockquoteBarClass} />
        <blockquote {...sharedProps}>{children}</blockquote>
      </div>
    );
  }

  if (variant === "code") return <code {...sharedProps}>{children}</code>;
  if (variant === "span") return <span {...sharedProps}>{children}</span>;
  if (variant === "label") return <label {...sharedProps}>{children}</label>;
  if (variant === "small") return <small {...sharedProps}>{children}</small>;
  return <p {...sharedProps}>{children}</p>;
}
