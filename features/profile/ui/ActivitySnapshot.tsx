"use client";
import { StatTile } from "@/components/Patterns/StatTile";
import { useTranslation } from "@/i18n/context";
import { useParams } from "next/navigation";
import { Activity, Coins, Heart, TrendingUp } from "lucide-react";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "@/components/Patterns/SectionCard";

// TODO(activity): wire to a getMyActivitySummary aggregated query.
const MOCK_ACTIVITY = {
  favorites: 32,
  sales: 4,
  pointsEarned: 120,
};

export function ActivitySnapshot() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const stats = [
    { key: "favorites", icon: Heart, value: MOCK_ACTIVITY.favorites },
    { key: "sales", icon: TrendingUp, value: MOCK_ACTIVITY.sales },
    { key: "pointsEarned", icon: Coins, value: MOCK_ACTIVITY.pointsEarned },
  ];

  return (
    <SectionCard
      icon={Activity}
      tone="primary"
      title={t("dashboard.activity.title")}
      subtitle={t("dashboard.activity.subtitle")}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <StatTile
            key={s.key}
            icon={s.icon}
            value={s.value.toLocaleString(lang)}
            label={t(`dashboard.activity.${s.key}`)}
          />
        ))}
      </div>
    </SectionCard>
  );
}
