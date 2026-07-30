"use client";
import { Package2, ScanBarcode, Store, TrendingUp, UsersRound } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";

const STATS = [
  { key: "activeUsers", value: "1,234", Icon: UsersRound },
  { key: "productsListed", value: "567", Icon: Package2 },
  { key: "ecoStores", value: "89", Icon: Store },
  { key: "ecoServices", value: "45", Icon: ScanBarcode },
  { key: "activeInitiatives", value: "12", Icon: TrendingUp },
];

function StatItem({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 px-5 shrink-0">
      <Icon size={14} className="text-primary" strokeWidth={2} />
      <span className="text-base font-bold text-foreground">{value}</span>
      <span className="text-sm text-foreground-secondary">{label}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-60 ml-2" />
    </div>
  );
}

export function StatsSection() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Section ariaLabel={t("stats.title")}>
      <SectionHeader title={t("stats.title")} subtitle={t("stats.subtitle")} />

      <div className="relative overflow-hidden py-1.5">
        <div className="flex animate-marquee">
          {[...STATS, ...STATS].map((stat, i) => (
            <StatItem
              key={i}
              label={t(`stats.items.${stat.key}`)}
              value={stat.value}
              Icon={stat.Icon}
            />
          ))}
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent" />
      </div>

      <Text variant="small" align="center" color="tertiary" weight="bold">
        {t("stats.caption")}
      </Text>
    </Section>
  );
}
