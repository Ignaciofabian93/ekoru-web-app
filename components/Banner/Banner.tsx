import clsx from "clsx";
import React from "react";

type Variant = "primary" | "secondary" | "outlined" | "ghost";

export interface BannerProps {
  title: string;
  description: string;
  variant?: Variant;
  showDots?: boolean;
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const CONTAINER_CLASS: Record<Variant, string> = {
  primary: "bg-linear-to-r from-primary-dark via-primary to-primary-dark shadow-lg",
  secondary: "bg-linear-to-r from-secondary-dark via-secondary to-secondary-dark shadow-lg",
  outlined: "border-2 border-solid border-primary bg-background shadow-lg",
  ghost: "bg-white/50",
};

const TEXT_CLASS: Record<Variant, string> = {
  primary: "text-on-primary",
  secondary: "text-on-primary",
  outlined: "text-foreground",
  ghost: "text-foreground",
};

const DOT_CLASS: Record<Variant, string> = {
  primary: "bg-on-primary",
  secondary: "bg-on-primary",
  outlined: "bg-primary",
  ghost: "bg-foreground-secondary",
};

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    { title, description, variant = "primary", showDots = true, animated: _animated, style, className },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={clsx(
          "box-border w-full self-center overflow-hidden rounded-lg px-5 py-3.5",
          CONTAINER_CLASS[variant],
          className,
        )}
      >
        <div className="mb-2 flex flex-row items-center justify-center gap-2">
          {showDots && <div className={clsx("size-2 rounded-sm", DOT_CLASS[variant])} />}
          <span
            className={clsx(
              "shrink text-center font-sans text-base font-bold tracking-[-0.3px]",
              TEXT_CLASS[variant],
            )}
          >
            {title}
          </span>
          {showDots && <div className={clsx("size-2 rounded-sm", DOT_CLASS[variant])} />}
        </div>

        <p
          className={clsx(
            "m-0 text-center font-sans text-sm font-normal leading-5",
            TEXT_CLASS[variant],
          )}
        >
          {description}
        </p>
      </div>
    );
  },
);

Banner.displayName = "Banner";

export default Banner;
export { Banner };
