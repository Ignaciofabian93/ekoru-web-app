import clsx from "clsx";
import {
  titleAlignClass,
  titleBaseClass,
  titleColorClass,
  titleSizeClass,
  titleTruncateClass,
  titleWeightClass,
} from "@/design/title";
import { letterSpacing, lineHeight } from "@/design/tokens";
import type { TitleProps } from "./Title.types";

export function Title({
  level = "h1",
  size,
  weight = "bold",
  color = "default",
  align = "left",
  style,
  children,
  className,
  numberOfLines,
  onClick,
  ref,
}: TitleProps) {
  const Tag = level;
  return (
    <Tag
      ref={ref}
      style={{ lineHeight: lineHeight.snug, letterSpacing: letterSpacing.snug, ...style }}
      className={clsx(
        titleBaseClass,
        titleSizeClass[size ?? level],
        titleWeightClass[weight],
        titleColorClass[color],
        titleAlignClass[align],
        numberOfLines === 1 && titleTruncateClass,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
