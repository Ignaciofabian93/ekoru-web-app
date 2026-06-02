"use client";

import { Package2, ScanBarcode, Store, TrendingUp, UsersRound } from "lucide-react";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

const STATS = [
  { key: "activeUsers", value: "1,234", Icon: UsersRound },
  { key: "productsListed", value: "567", Icon: Package2 },
  { key: "ecoStores", value: "89", Icon: Store },
  { key: "ecoServices", value: "45", Icon: ScanBarcode },
  { key: "activeInitiatives", value: "12", Icon: TrendingUp },
];

function StatItem({ label, value, Icon }: { label: string; value: string; Icon: React.ElementType }) {
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
    <div className="my-8">
      <h2 className="text-xl font-bold text-foreground text-center">{t("stats.title")}</h2>
      <p className="text-sm text-foreground-secondary text-center mt-1.5">
        {t("stats.subtitle")}
      </p>

      <div className="relative mt-5 mb-3 overflow-hidden py-3.5">
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

      <p className="text-xs text-foreground-tertiary text-center">
        {t("stats.caption")}
      </p>
    </div>
  );
}
