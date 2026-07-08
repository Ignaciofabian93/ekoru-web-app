"use client";

import clsx from "clsx";
import { type LucideIcon } from "lucide-react";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";

type BadgeType =
  | "VERIFIED"
  | "TAG"
  | "SELLER_TYPE"
  | "SUBSCRIPTION_TYPE"
  | "PRODUCT_LABEL";

type BadgeVariant = "primary" | "secondary" | "tertiary" | "descriptive" | "ghost";
type BadgeSize = "small" | "medium" | "large";

// Each badge type maps to a section of the `badge` dictionary. VERIFIED is a
// single label; the others resolve `${section}.${value}` — e.g. a SELLER_TYPE
// badge with value "COMPANY" reads `sellerType.COMPANY`.
const DICT_SECTION: Record<Exclude<BadgeType, "VERIFIED">, string> = {
  TAG: "tag",
  SELLER_TYPE: "sellerType",
  SUBSCRIPTION_TYPE: "subscriptionType",
  PRODUCT_LABEL: "productLabel",
};

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-white text-secondary-dark",
  tertiary: "bg-secondary/15 text-secondary",
  descriptive: "bg-primary/10 text-primary",
  ghost: "border border-border-light bg-transparent text-foreground-secondary",
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  small: "gap-1 px-2 py-0.5 text-[11px]",
  medium: "gap-1.5 px-2.5 py-1 text-xs",
  large: "gap-1.5 px-3 py-1.5 text-sm",
};

const ICON_SIZE: Record<BadgeSize, number> = { small: 12, medium: 14, large: 16 };

type BadgeProps = {
  badgeType: BadgeType;
  /** Enum/key within the badge type (e.g. "COMPANY"). Ignored for VERIFIED. */
  value?: string;
  /** Escape hatch: render this text verbatim instead of resolving from i18n. */
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
};

export function Badge({
  badgeType,
  value,
  label,
  variant = "primary",
  size = "medium",
  icon: Icon,
}: BadgeProps) {
  const { t } = useTranslation(NAMESPACE);

  const text =
    label ??
    (badgeType === "VERIFIED"
      ? t("verified")
      : value
        ? t(`${DICT_SECTION[badgeType]}.${value}`)
        : "");

  // Nothing to show (e.g. a value-less TAG badge) — render nothing.
  if (!text) return null;

  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-full font-semibold shadow-sm",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
      )}
    >
      {Icon && <Icon size={ICON_SIZE[size]} strokeWidth={2.5} />}
      {text}
    </span>
  );
}
