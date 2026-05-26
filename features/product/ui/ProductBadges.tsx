"use client";

import { useTranslation } from "@/i18n/context";
import type { Badge } from "@/types/enums";

import { NAMESPACE } from "../i18n";

const BADGE_STYLES: Partial<Record<Badge, string>> = {
  SUSTAINABLE: "bg-primary-light-bg text-primary",
  EXCHANGEABLE: "bg-secondary/15 text-secondary",
  REFURBISHED: "bg-primary-light-bg text-primary",
  OPEN_BOX: "bg-primary-light-bg text-primary",
  HANDMADE: "bg-amber-50 text-amber-700",
  DISCOUNTED: "bg-red-50 text-red-600",
  LIMITED_TIME_OFFER: "bg-red-50 text-red-600",
  FLASH_SALE: "bg-red-50 text-red-600",
  LAST_PRICE: "bg-red-50 text-red-600",
  BEST_SELLER: "bg-amber-50 text-amber-700",
  TOP_RATED: "bg-amber-50 text-amber-700",
  POPULAR: "bg-amber-50 text-amber-700",
  FREE_SHIPPING: "bg-primary-light-bg text-primary",
};

const DEFAULT_STYLE = "bg-border text-foreground";

export function ProductBadges({ badges }: { badges: Badge[] }) {
  const { t } = useTranslation(NAMESPACE);

  if (!badges?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
            BADGE_STYLES[badge] ?? DEFAULT_STYLE
          }`}
        >
          {t(`badges.${badge}`)}
        </span>
      ))}
    </div>
  );
}
