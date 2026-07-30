"use client";
import { StatTile } from "@/components/Patterns/StatTile";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Droplets, Leaf, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";
import { LinkButton } from "@/components/Primitives/LinkButton";

// Lightweight preview — the full Environmental Impact screen owns the
// detailed numbers. Wire to an aggregated impact endpoint when ready.
const MOCK_IMPACT = {
  totalCo2SavingsKG: 42.6,
  totalWaterSavingsLT: 1280,
  productsReused: 12,
};

function formatKg(n: number, locale: string) {
  return n.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function ImpactSnapshot() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const stats = [
    {
      key: "co2",
      icon: Leaf,
      value: `${formatKg(MOCK_IMPACT.totalCo2SavingsKG, lang)} kg`,
      tone: "success",
    },
    {
      key: "water",
      icon: Droplets,
      value: `${MOCK_IMPACT.totalWaterSavingsLT.toLocaleString(lang)} L`,
      tone: "info",
    },
    {
      key: "products",
      icon: PackageCheck,
      value: String(MOCK_IMPACT.productsReused),
      tone: "primary",
    },
  ] as const;

  return (
    <SectionCard
      icon={Leaf}
      tone="success"
      title={t("dashboard.impact.title")}
      subtitle={t("dashboard.impact.subtitle")}
      headerRight={
        <div className="hidden sm:inline-flex">
          <LinkButton
            href={`/${lang}/profile/environmental-impact`}
            icon={ArrowRight}
            variant="ghost"
            label={t("dashboard.impact.viewFull")}
            iconPosition="right"
            size="sm"
          />
        </div>
        // <Link
        //   href={`/${lang}/profile/environmental-impact`}
        //   className="hidden sm:inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-primary/5"
        // >
        //   {t("dashboard.impact.viewFull")}
        //   <ArrowRight size={14} color="currentColor" strokeWidth={2} />
        // </Link>
      }
    >
      <div className="flex flex-col items-center justify-evenly gap-3">
        {stats.map((s) => (
          <StatTile
            key={s.key}
            icon={s.icon}
            value={s.value}
            label={t(`dashboard.impact.${s.key}`)}
            orientation="horizontal"
            tone={s.tone}
          />
        ))}
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
