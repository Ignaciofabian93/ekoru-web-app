"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Droplets, Leaf, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";

// Lightweight preview — the full Environmental Impact screen owns the
// detailed numbers. Wire to an aggregated impact endpoint when ready.
const MOCK_IMPACT = {
  totalCo2SavingsKG: 42.6,
  totalWaterSavingsLT: 1280,
  productsReused: 12,
};

function formatKg(n: number) {
  return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function ImpactSnapshot() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const stats = [
    {
      key: "co2",
      icon: Leaf,
      value: `${formatKg(MOCK_IMPACT.totalCo2SavingsKG)} kg`,
      tone: "from-success/15 to-success/5 text-success",
    },
    {
      key: "water",
      icon: Droplets,
      value: `${MOCK_IMPACT.totalWaterSavingsLT.toLocaleString()} L`,
      tone: "from-info/15 to-info/5 text-info",
    },
    {
      key: "products",
      icon: PackageCheck,
      value: String(MOCK_IMPACT.productsReused),
      tone: "from-primary/15 to-primary-light/10 text-primary",
    },
  ];

  return (
    <SectionCard
      icon={Leaf}
      tone="success"
      title={t("dashboard.impact.title")}
      subtitle={t("dashboard.impact.subtitle")}
      headerRight={
        <Link
          href={`/${lang}/profile/environmental-impact`}
          className="hidden sm:inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-primary/5"
        >
          {t("dashboard.impact.viewFull")}
          <ArrowRight size={14} color="currentColor" strokeWidth={2} />
        </Link>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className={`flex flex-col gap-1 rounded-xl bg-gradient-to-br p-3.5 ${s.tone}`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/70 text-current">
                <Icon size={14} color="currentColor" strokeWidth={2} />
              </div>
              <Title level="h3" size="h6" weight="bold" color="default">
                {s.value}
              </Title>
              <Text variant="span" size="xs" color="secondary">
                {t(`dashboard.impact.${s.key}`)}
              </Text>
            </div>
          );
        })}
      </div>
      <Link
        href={`/${lang}/profile/environmental-impact`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary sm:hidden"
      >
        {t("dashboard.impact.viewFull")}
        <ArrowRight size={14} color="currentColor" strokeWidth={2} />
      </Link>
    </SectionCard>
  );
}
