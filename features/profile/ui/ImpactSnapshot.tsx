"use client";
import { StatTile } from "@/components/Patterns/StatTile";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Droplets, Leaf, PackageCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";
import { LinkButton } from "@/components/Primitives/LinkButton";

// Lightweight preview — the full Environmental Impact screen owns the
// detailed numbers. Wire to an aggregated impact endpoint when ready.
const MOCK_IMPACT = {
  totalCo2SavingsKG: 0,
  totalWaterSavingsLT: 0,
  productsReused: 0,
};

/**
 * No aggregated impact endpoint exists yet, so every figure below is a
 * placeholder zero. The whole section is presented as disabled rather than
 * live: three real-looking zeros read as "you have saved nothing", which is a
 * worse lie than showing the feature isn't ready. Flip this off — and drop
 * MOCK_IMPACT — when the endpoint lands.
 */
const IMPACT_READY = false;

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
            disabled={!IMPACT_READY}
            message={IMPACT_READY ? undefined : t("dashboard.impact.comingSoon")}
          />
        </div>
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
            disabled={!IMPACT_READY}
          />
        ))}
      </div>
      {/* Same control as the header's, shown only where that one is hidden. */}
      <div className="mt-3 inline-flex sm:hidden">
        <LinkButton
          href={`/${lang}/profile/environmental-impact`}
          icon={ArrowRight}
          variant="ghost"
          label={t("dashboard.impact.viewFull")}
          iconPosition="right"
          size="sm"
          disabled={!IMPACT_READY}
          message={IMPACT_READY ? undefined : t("dashboard.impact.comingSoon")}
        />
      </div>
    </SectionCard>
  );
}
