"use client";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import {
  BatteryCharging,
  Car,
  Droplets,
  Leaf,
  PackageCheck,
  Recycle,
  ShowerHead,
  Sprout,
  Trees,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useSellerPoints } from "@/store/useAuthStore";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";

// Lightweight placeholder data — real values should come from the impact API.
const IMPACT = {
  totalCo2SavingsKG: 42.6,
  totalWaterSavingsLT: 1280,
  productsReused: 12,
  wasteAvoidedKG: 18.4,
  materialBreakdown: [
    {
      materialType: "Textile",
      percentage: 38,
      weightKG: 5.2,
      co2SavingsKG: 18.1,
      waterSavingsLT: 740,
    },
    {
      materialType: "Wood",
      percentage: 27,
      weightKG: 6.8,
      co2SavingsKG: 11.5,
      waterSavingsLT: 220,
    },
    {
      materialType: "Metal",
      percentage: 21,
      weightKG: 4.4,
      co2SavingsKG: 9.0,
      waterSavingsLT: 180,
    },
    {
      materialType: "Plastic",
      percentage: 14,
      weightKG: 2.0,
      co2SavingsKG: 4.0,
      waterSavingsLT: 140,
    },
  ],
};

const LEVELS = [
  { name: "Sprout", min: 0, icon: Sprout },
  { name: "Sapling", min: 50, icon: Leaf },
  { name: "Tree", min: 250, icon: Trees },
  { name: "Forest", min: 1000, icon: Recycle },
];

export function EnvironmentalImpactPanel() {
  const { t } = useTranslation(NAMESPACE);
  const points = useSellerPoints();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const formatNumber = (n: number) =>
    n.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const currentLevelIdx = LEVELS.reduce(
    (acc, lvl, i) => (points >= lvl.min ? i : acc),
    0,
  );
  const currentLevel = LEVELS[currentLevelIdx];
  const nextLevel = LEVELS[currentLevelIdx + 1];
  const progressPct = nextLevel
    ? Math.min(
        100,
        ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100,
      )
    : 100;
  const pointsToNext = nextLevel ? Math.max(0, nextLevel.min - points) : 0;
  const CurrentIcon = currentLevel.icon;

  // Equivalences
  const carKm = IMPACT.totalCo2SavingsKG * 4.5;
  const showers = IMPACT.totalWaterSavingsLT / 8;
  const treeMonths = IMPACT.totalCo2SavingsKG / 1.7;
  const phoneCharges = IMPACT.totalCo2SavingsKG * 122;

  const stats = [
    {
      key: "co2",
      icon: Leaf,
      tone: "success" as const,
      value: `${formatNumber(IMPACT.totalCo2SavingsKG)} kg`,
      label: t("environmentalImpact.stats.co2"),
    },
    {
      key: "water",
      icon: Droplets,
      tone: "info",
      value: `${IMPACT.totalWaterSavingsLT.toLocaleString(lang)} L`,
      label: t("environmentalImpact.stats.water"),
    },
    {
      key: "products",
      icon: PackageCheck,
      tone: "primary",
      value: String(IMPACT.productsReused),
      label: t("environmentalImpact.stats.products"),
    },
    {
      key: "waste",
      icon: Recycle,
      tone: "warning",
      value: `${formatNumber(IMPACT.wasteAvoidedKG)} kg`,
      label: t("environmentalImpact.stats.waste"),
    },
  ];

  const equivalences = [
    {
      icon: Car,
      value: formatNumber(carKm),
      label: t("environmentalImpact.equivalences.carDistance"),
    },
    {
      icon: ShowerHead,
      value: formatNumber(showers),
      label: t("environmentalImpact.equivalences.showers"),
    },
    {
      icon: Trees,
      value: formatNumber(treeMonths),
      label: t("environmentalImpact.equivalences.treeMonths"),
    },
    {
      icon: BatteryCharging,
      value: phoneCharges.toFixed(0),
      label: t("environmentalImpact.equivalences.phoneCharges"),
    },
  ];

  const STAT_TONE: Record<string, string> = {
    success: "from-success/15 to-success/5 text-success",
    info: "from-info/15 to-info/5 text-info",
    primary: "from-primary/15 to-primary-light/10 text-primary",
    warning: "from-warning/15 to-warning/5 text-warning",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className={`flex flex-col gap-2 rounded-2xl bg-linear-to-br p-4 ${STAT_TONE[stat.tone]}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/70 text-current">
                <Icon size={18} color="currentColor" strokeWidth={2} />
              </div>
              <Title level="h3" size="h4" weight="bold" color="default">
                {stat.value}
              </Title>
              <Text variant="span" size="xs" color="secondary">
                {stat.label}
              </Text>
            </div>
          );
        })}
      </div>

      {/* Level card */}
      <SectionCard
        icon={CurrentIcon}
        tone="success"
        title={t("environmentalImpact.level.title")}
        subtitle={t("environmentalImpact.level.subtitle")}
        headerRight={
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-success">
            <Text variant="span" size="sm" weight="bold">
              {currentLevel.name}
            </Text>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="h-2.5 overflow-hidden rounded-full bg-background-secondary">
            <div
              className="h-full rounded-full bg-linear-to-r from-success to-primary transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Text variant="span" size="sm" color="tertiary">
              {points.toLocaleString(lang)} pts
            </Text>
            {nextLevel ? (
              <Text variant="span" size="sm" weight="semibold">
                {t("environmentalImpact.level.pointsToNext", {
                  points: pointsToNext.toLocaleString(lang),
                  level: nextLevel.name,
                })}
              </Text>
            ) : null}
          </div>
        </div>
      </SectionCard>

      {/* Equivalences */}
      <SectionCard
        icon={Leaf}
        title={t("environmentalImpact.equivalences.title")}
        subtitle={t("environmentalImpact.equivalences.subtitle")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {equivalences.map((eq, i) => {
            const Icon = eq.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border-light bg-background-secondary/50 p-3.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light/20 text-primary">
                  <Icon size={18} color="currentColor" strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <Text variant="span" size="lg" weight="bold">
                    {eq.value}
                  </Text>
                  <Text variant="span" size="xs" color="tertiary">
                    {eq.label}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Material breakdown */}
      <SectionCard
        icon={Recycle}
        tone="warning"
        title={t("environmentalImpact.breakdown.title")}
        subtitle={t("environmentalImpact.breakdown.subtitle")}
      >
        <div className="flex flex-col gap-3">
          {IMPACT.materialBreakdown.map((m) => (
            <div
              key={m.materialType}
              className="flex flex-col gap-2 rounded-xl border border-border-light p-3.5"
            >
              <div className="flex items-center justify-between">
                <Text variant="span" weight="semibold">
                  {m.materialType}
                </Text>
                <Text variant="span" weight="bold" color="primary">
                  {m.percentage.toFixed(1)}%
                </Text>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-background-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${m.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="flex flex-col">
                  <Text variant="span" size="xs" color="tertiary">
                    {t("environmentalImpact.breakdown.weight")}
                  </Text>
                  <Text variant="span" weight="semibold" size="sm">
                    {formatNumber(m.weightKG)} kg
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Text variant="span" size="xs" color="tertiary">
                    {t("environmentalImpact.breakdown.co2")}
                  </Text>
                  <Text variant="span" weight="semibold" size="sm" color="success">
                    {formatNumber(m.co2SavingsKG)} kg
                  </Text>
                </div>
                <div className="flex flex-col">
                  <Text variant="span" size="xs" color="tertiary">
                    {t("environmentalImpact.breakdown.water")}
                  </Text>
                  <Text variant="span" weight="semibold" size="sm">
                    {m.waterSavingsLT} L
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
