import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Text } from "@/components/Primitives/Text";

interface LinkButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export function LinkButton({
  href,
  icon: Icon,
  label,
  variant = "primary",
  size = "md",
  iconPosition = "left",
  fullWidth = false,
}: LinkButtonProps) {
  const STYLES_MAP = {
    primary: "bg-primary border-2 border-primary text-white hover:brightness-110",
    outlined: "border-2 border-primary bg-surface text-primary",
    ghost: "bg-transparent text-foreground hover:bg-background-light",
  };

  const SIZE_MAP = {
    sm: "px-2 py-1",
    md: "px-3 py-1.5",
    lg: "px-4 py-2",
  };

  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-md",
        "px-3 py-1.5 transition-all duration-200 ease-in-out cursor-pointer",
        STYLES_MAP[variant],
        SIZE_MAP[size],
        fullWidth && "w-full",
      )}
    >
      {iconPosition === "left" && (
        <Icon size={14} color="currentColor" strokeWidth={2.5} />
      )}
      <Text
        variant="label"
        align="center"
        color={variant === "outlined" || variant === "ghost" ? "primary" : "white"}
      >
        {label}
      </Text>
      {iconPosition === "right" && (
        <Icon size={14} color="currentColor" strokeWidth={2.5} />
      )}
    </Link>
  );
}
