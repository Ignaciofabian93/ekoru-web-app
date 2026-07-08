import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

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
}

// Every variant is an eco gradient so banners feel part of the same family:
// green = forest/brand green, teal = ocean teal, amber = harvest,
// emerald = green→teal growth. All are dark enough to carry white content.
const CONTAINER_CLASS: Record<AdBannerVariant, string> = {
  green: "bg-linear-to-r from-primary-dark via-primary to-primary-dark",
  teal: "bg-linear-to-r from-secondary-dark via-secondary to-secondary-dark",
  amber: "bg-linear-to-br from-amber-800 via-amber-600 to-amber-800",
  emerald: "bg-linear-to-br from-green-700 via-emerald-600 to-teal-600",
};

// The CTA is always a white pill; only its accent (text/icon) shifts per variant
// so it stays legible and on-brand against each background.
const CTA_ACCENT_CLASS: Record<AdBannerVariant, string> = {
  green: "text-primary",
  teal: "text-secondary-dark",
  amber: "text-amber-700",
  emerald: "text-emerald-700",
};

const AdBanner = React.forwardRef<HTMLDivElement, AdBannerProps>(
  (
    {
      icon: Icon,
      title,
      description,
      ctaText,
      ctaHref,
      variant = "green",
      animated: _animated,
      style,
      className,
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={clsx(
          "relative mx-auto box-border w-full overflow-hidden rounded-2xl px-5 py-5 shadow-sm ring-1 ring-black/5 md:px-6 md:py-6",
          CONTAINER_CLASS[variant],
          className,
        )}
      >
        {/* Decorative eco circles — mirror the category / hero cards */}
        <div className="pointer-events-none absolute -top-14 -right-10 size-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-8 size-36 rounded-full bg-white/10" />

        <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:gap-5 md:text-left">
          {Icon && (
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 md:size-16">
              <Icon size={30} color="currentColor" strokeWidth={1.75} />
            </div>
          )}

          <div className="flex flex-1 flex-col gap-1">
            {title && (
              <p className="m-0 font-sans text-base font-bold text-white md:text-lg">
                {title}
              </p>
            )}
            {description && (
              <p className="m-0 font-sans text-sm font-normal leading-5 text-white/80">
                {description}
              </p>
            )}
          </div>

          {/* Full-width pill on mobile, auto-width on desktop */}
          <Link
            href={ctaHref}
            className={clsx(
              "group flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-bold shadow-sm transition hover:shadow-md md:w-auto",
              CTA_ACCENT_CLASS[variant],
            )}
          >
            {ctaText}
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    );
  },
);

AdBanner.displayName = "AdBanner";

export default AdBanner;
