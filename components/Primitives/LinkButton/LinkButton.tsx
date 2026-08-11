import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Text } from "@/components/Primitives/Text";
import { ComingSoonChip } from "@/components/Primitives/Chip";

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

const VARIANT_CLASS: Record<LinkButtonVariant, string> = {
  primary: "bg-primary border-2 border-primary text-white hover:brightness-110",
  outlined: "border-2 border-primary bg-surface text-primary",
  ghost: "bg-transparent text-foreground hover:bg-background-light",
};

const SIZE_CLASS: Record<LinkButtonSize, string> = {
  sm: "px-2 py-1",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
};

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
    "inline-flex items-center justify-center rounded-md",
    "transition-all duration-200 ease-in-out",
    // The message sits on its own line under the label, so the control becomes
    // a column once there is one.
    message ? "flex-col gap-1" : "gap-1.5",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth && "w-full",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
  );

  const content = (
    <>
      <span className="inline-flex items-center justify-center gap-1.5">
        {iconPosition === "left" && (
          <Icon size={14} color="currentColor" strokeWidth={2.5} aria-hidden />
        )}
        <Text
          variant="label"
          align="center"
          color={variant === "outlined" || variant === "ghost" ? "primary" : "white"}
          size="sm"
          className="cursor-pointer"
        >
          {label}
        </Text>
        {iconPosition === "right" && (
          <Icon size={14} color="currentColor" strokeWidth={2.5} aria-hidden />
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
