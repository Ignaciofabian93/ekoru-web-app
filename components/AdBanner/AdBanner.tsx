import clsx from "clsx";
import React from "react";

export type AdBannerVariant = "primary" | "secondary" | "outlined" | "ghost";

export interface AdBannerProps {
  icon?: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title?: string;
  description?: string;
  cta: React.ReactNode;
  variant?: AdBannerVariant;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const CONTAINER_CLASS: Record<AdBannerVariant, string> = {
  primary: "bg-linear-to-r from-primary-dark via-primary to-primary-dark",
  secondary: "bg-linear-to-r from-secondary-dark via-secondary to-secondary-dark",
  outlined: "rounded-lg border border-solid border-primary bg-background",
  ghost: "border-y border-border-light bg-white/50",
};

const ICON_BG_CLASS: Record<AdBannerVariant, string> = {
  primary: "bg-white/15",
  secondary: "bg-white/15",
  outlined: "bg-background",
  ghost: "bg-background",
};

const ICON_TEXT_CLASS: Record<AdBannerVariant, string> = {
  primary: "text-on-primary",
  secondary: "text-on-primary",
  outlined: "text-primary",
  ghost: "text-primary",
};

const TEXT_CLASS: Record<AdBannerVariant, string> = {
  primary: "text-on-primary",
  secondary: "text-on-primary",
  outlined: "text-foreground",
  ghost: "text-foreground",
};

const MUTED_CLASS: Record<AdBannerVariant, string> = {
  primary: "text-white/75",
  secondary: "text-white/75",
  outlined: "text-foreground-secondary",
  ghost: "text-foreground-secondary",
};

const AdBanner = React.forwardRef<HTMLDivElement, AdBannerProps>(
  (
    {
      icon: Icon,
      title,
      description,
      cta,
      variant = "primary",
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
          "box-border w-full overflow-hidden px-4 py-3.5 rounded-lg mx-auto",
          CONTAINER_CLASS[variant],
          className,
        )}
      >
        <div className="flex flex-row items-center justify-between gap-3 px-1 py-1.5">
          <div className="flex flex-1 flex-col gap-1">
            {Icon && (
              <div
                className={clsx(
                  "mb-1 flex size-16 items-center justify-center rounded-lg",
                  ICON_BG_CLASS[variant],
                  ICON_TEXT_CLASS[variant],
                )}
              >
                <Icon size={36} color="currentColor" strokeWidth={1.75} />
              </div>
            )}
            {title && (
              <p
                className={clsx("m-0 font-sans text-base font-bold", TEXT_CLASS[variant])}
              >
                {title}
              </p>
            )}
            {description && (
              <p
                className={clsx(
                  "m-0 font-sans text-sm font-normal leading-4.5",
                  MUTED_CLASS[variant],
                )}
              >
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-center">{cta}</div>
        </div>
      </div>
    );
  },
);

AdBanner.displayName = "AdBanner";

export default AdBanner;
