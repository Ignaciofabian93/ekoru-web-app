import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { buttonClass, buttonContentClass, buttonIconSize } from "@/design/button";
import type { ButtonSize, ButtonVariant } from "./Button.types";

export interface ButtonLinkProps {
  href: string;
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
}

/**
 * A link drawn as a `Button`: same gradient, frame and type, from the same
 * `design/button` maps, so the two can't drift. Use it wherever a press
 * navigates — "Pagar", "Ir al marketplace" — instead of a `<Button>` that
 * pushes a route: an anchor keeps prefetch, open-in-new-tab and the link role.
 *
 * `Button` drops the outline; a link that can't show focus is unreachable by
 * keyboard, so this one carries its own ring.
 */
export function ButtonLink({
  href,
  text,
  variant = "primary",
  size = "md",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className,
}: ButtonLinkProps) {
  const icon = buttonIconSize[size];

  return (
    <Link
      href={href}
      className={clsx(
        buttonClass[variant][size],
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        fullWidth ? "w-full" : "w-fit",
        className,
      )}
    >
      <span className={buttonContentClass[size]}>
        {LeftIcon && (
          <LeftIcon size={icon} color="currentColor" strokeWidth={2} aria-hidden />
        )}
        <span>{text}</span>
        {RightIcon && (
          <RightIcon size={icon} color="currentColor" strokeWidth={2} aria-hidden />
        )}
      </span>
    </Link>
  );
}
