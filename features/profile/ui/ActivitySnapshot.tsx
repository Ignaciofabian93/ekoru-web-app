"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { Activity, Coins, Eye, Heart, TrendingUp } from "lucide-react";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";

// TODO(activity): wire to a getMyActivitySummary aggregated query.
const MOCK_ACTIVITY = {
  views: 248,
  favorites: 32,
  sales: 4,
  pointsEarned: 120,
};

export function ActivitySnapshot() {
  const { t } = useTranslation(NAMESPACE);

  const stats = [
    { key: "views", icon: Eye, value: MOCK_ACTIVITY.views },
    { key: "favorites", icon: Heart, value: MOCK_ACTIVITY.favorites },
    { key: "sales", icon: TrendingUp, value: MOCK_ACTIVITY.sales },
    { key: "pointsEarned", icon: Coins, value: MOCK_ACTIVITY.pointsEarned },
  ];

  return (
    <SectionCard
      icon={Activity}
      title={t("dashboard.activity.title")}
      subtitle={t("dashboard.activity.subtitle")}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="flex flex-col gap-1.5 rounded-xl bg-background-secondary/60 p-3.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface text-primary">
                <Icon size={16} color="currentColor" strokeWidth={2} />
              </div>
              <Title level="h3" size="h5" weight="bold">
                {s.value.toLocaleString()}
              </Title>
              <Text variant="span" size="xs" color="tertiary">
                {t(`dashboard.activity.${s.key}`)}
              </Text>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
