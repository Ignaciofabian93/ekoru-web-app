import clsx from "clsx";
import type React from "react";
import {
  bannerClass,
  bannerDescriptionClass,
  bannerDotBaseClass,
  bannerDotClass,
  bannerHeaderClass,
  bannerTextToneClass,
  bannerTitleClass,
} from "@/design/banner";

export type BannerVariant = "primary" | "secondary" | "outlined" | "ghost";

export interface BannerProps {
  title: string;
  description: string;
  variant?: BannerVariant;
  showDots?: boolean;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function Banner({
  title,
  description,
  variant = "primary",
  showDots = true,
  animated: _animated,
  style,
  className,
  ref,
}: BannerProps) {
  const dot = <div className={clsx(bannerDotBaseClass, bannerDotClass[variant])} />;

  return (
    <div ref={ref} style={style} className={clsx(bannerClass[variant], className)}>
      <div className={bannerHeaderClass}>
        {showDots && dot}
        <span className={clsx(bannerTitleClass, bannerTextToneClass[variant])}>
          {title}
        </span>
        {showDots && dot}
      </div>

      <p className={clsx(bannerDescriptionClass, bannerTextToneClass[variant])}>
        {description}
      </p>
    </div>
  );
}
