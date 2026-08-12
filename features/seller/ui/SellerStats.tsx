"use client";

import { LayoutGrid, Package, Sparkles } from "lucide-react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import { Grid } from "@/components/Layout";
import { StatTile, type StatTileTone } from "@/components/Patterns/StatTile";

interface Props {
  productsCount: number;
  /**
   * What the first figure counts. A service provider publishes services, not
   * products, and the tile should say so.
   */
  productsLabel?: string;
  categoriesCount: number;
  memberSince?: string;
}

function memberDuration(t: ReturnType<typeof useTranslation>["t"], since?: string) {
  if (!since) return "—";
  const start = new Date(since).getTime();
  if (Number.isNaN(start)) return "—";
  const diffDays = Math.max(1, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  if (diffDays < 30) {
    return diffDays === 1
      ? t("memberFor.days", { count: "1" })
      : t("memberFor.daysPlural", { count: String(diffDays) });
  }
  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return months === 1
      ? t("memberFor.months", { count: "1" })
      : t("memberFor.monthsPlural", { count: String(months) });
  }
  const years = Math.floor(months / 12);
  return years === 1
    ? t("memberFor.years", { count: "1" })
    : t("memberFor.yearsPlural", { count: String(years) });
}

export function SellerStats({
  productsCount,
  productsLabel,
  categoriesCount,
  memberSince,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  const items: Array<{
    icon: typeof Package;
    label: string;
    value: string;
    tone: StatTileTone;
  }> = [
    {
      icon: Package,
      label: productsLabel ?? t("stats.products"),
      value: String(productsCount),
      tone: "primary",
    },
    {
      icon: LayoutGrid,
      label: t("stats.categories"),
      value: String(categoriesCount),
      tone: "info",
    },
    {
      icon: Sparkles,
      label: t("stats.memberFor"),
      value: memberDuration(t, memberSince),
      tone: "success",
    },
  ];

  return (
    <Grid cols={1} sm={3} gap={3}>
      {items.map(({ icon, label, value, tone }) => (
        <StatTile
          key={label}
          icon={icon}
          label={label}
          value={value}
          tone={tone}
          orientation="horizontal"
        />
      ))}
    </Grid>
  );
}
