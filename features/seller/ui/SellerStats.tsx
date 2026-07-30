"use client";

import { LayoutGrid, Package, Sparkles } from "lucide-react";

import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import { Text } from "@/components/Primitives/Text";

interface Props {
  productsCount: number;
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

export function SellerStats({ productsCount, categoriesCount, memberSince }: Props) {
  const { t } = useTranslation(NAMESPACE);

  const items = [
    { icon: Package, label: t("stats.products"), value: String(productsCount) },
    { icon: LayoutGrid, label: t("stats.categories"), value: String(categoriesCount) },
    {
      icon: Sparkles,
      label: t("stats.memberFor"),
      value: memberDuration(t, memberSince),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-md border border-border-light px-3 py-3 text-center"
        >
          <Icon size={18} strokeWidth={1.8} className="text-primary" />
          <Text variant="span" size="sm">
            {label}
          </Text>
          <Text variant="span" weight="bold">
            {value}
          </Text>
        </div>
      ))}
    </div>
  );
}
