import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type React from "react";
import {
  adBannerBodyClass,
  adBannerClass,
  adBannerContentClass,
  adBannerCtaClass,
  adBannerCtaIconClass,
  adBannerCtaIconSize,
  adBannerDecorBottomClass,
  adBannerDecorTopClass,
  adBannerDescriptionClass,
  adBannerIconClass,
  adBannerIconSize,
  adBannerTitleClass,
} from "@/design/ad-banner";

export type AdBannerVariant = "green" | "teal" | "amber" | "emerald";

export interface AdBannerProps {
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title?: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  variant?: AdBannerVariant;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export function AdBanner({
  icon: Icon,
  title,
  description,
  ctaText,
  ctaHref,
  variant = "green",
  animated: _animated,
  style,
  className,
  ref,
}: AdBannerProps) {
  return (
    <div ref={ref} style={style} className={clsx(adBannerClass[variant], className)}>
      <div className={adBannerDecorTopClass} />
      <div className={adBannerDecorBottomClass} />

      <div className={adBannerContentClass}>
        {Icon && (
          <div className={adBannerIconClass}>
            <Icon size={adBannerIconSize} color="currentColor" strokeWidth={1.75} />
          </div>
        )}

        <div className={adBannerBodyClass}>
          {title && <p className={adBannerTitleClass}>{title}</p>}
          {description && <p className={adBannerDescriptionClass}>{description}</p>}
        </div>

        {/* Full-width pill on mobile, auto-width on desktop */}
        <Link href={ctaHref} className={adBannerCtaClass[variant]}>
          {ctaText}
          <ArrowRight
            size={adBannerCtaIconSize}
            strokeWidth={2.5}
            className={adBannerCtaIconClass}
          />
        </Link>
      </div>
    </div>
  );
}
