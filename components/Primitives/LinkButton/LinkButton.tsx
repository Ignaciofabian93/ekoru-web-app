import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ComingSoonChip } from "@/components/Primitives/Chip";
import { Text } from "@/components/Primitives/Text";
import {
  linkButtonClass,
  linkButtonContentClass,
  linkButtonGhostLabelClass,
  linkButtonIconSize,
  linkButtonLabelClass,
  linkButtonLayoutClass,
  linkButtonStateClass,
} from "@/design/linkButton";

export type LinkButtonVariant = "primary" | "outlined" | "ghost";
export type LinkButtonSize = "sm" | "md" | "lg";

export interface LinkButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: LinkButtonVariant;
  size?: LinkButtonSize;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  /**
   * Renders the control inert: no navigation, dimmed, and out of the tab order.
   * Use for a destination that exists but isn't ready yet — pair it with
   * `message` so the reason is visible rather than left to be guessed.
   */
  disabled?: boolean;
  /**
   * Trailing note beside the label, rendered as a chip — "Próximamente" on a
   * feature that hasn't shipped. Pass a translated string.
   */
  message?: string;
}

export function LinkButton({
  href,
  icon: Icon,
  label,
  variant = "primary",
  size = "md",
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  message,
}: LinkButtonProps) {
  const className = clsx(
    linkButtonClass[variant][size],
    message ? linkButtonLayoutClass.withMessage : linkButtonLayoutClass.default,
    fullWidth && "w-full",
    disabled ? linkButtonStateClass.disabled : linkButtonStateClass.default,
  );

  const content = (
    <>
      <span className={linkButtonContentClass}>
        {iconPosition === "left" && (
          <Icon
            size={linkButtonIconSize}
            color="currentColor"
            strokeWidth={2.5}
            aria-hidden
          />
        )}
        <Text
          variant="label"
          align="center"
          color={variant === "outlined" || variant === "ghost" ? "primary" : "white"}
          size="sm"
          className={clsx(
            linkButtonLabelClass,
            variant === "ghost" && linkButtonGhostLabelClass,
          )}
        >
          {label}
        </Text>
        {iconPosition === "right" && (
          <Icon
            size={linkButtonIconSize}
            color="currentColor"
            strokeWidth={2.5}
            aria-hidden
          />
        )}
      </span>
      {message && <ComingSoonChip label={message} />}
    </>
  );

  // A disabled link is a <span>, not an <a>: anchors have no disabled attribute,
  // so keeping the <Link> would leave it clickable and focusable no matter how
  // it is styled.
  if (disabled) {
    return (
      <span role="link" aria-disabled className={className}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
