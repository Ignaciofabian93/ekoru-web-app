"use client";
import { StatTile } from "@/components/Patterns/StatTile";
import { useTranslation } from "@/i18n/context";
import { ArrowRight, Droplets, Leaf, PackageCheck, TrendingUp } from "lucide-react";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { NAMESPACE } from "../i18n";
import { useImpactYear } from "../hooks/useImpactYear";
import { formatCo2KG, formatCount, formatWaterLT } from "../constants/impactFormat";
import { SectionCard } from "@/components/Patterns/SectionCard";
import { LinkButton } from "@/components/Primitives/LinkButton";

/** Stands in for each figure until the query resolves. */
const PENDING = "—";

/**
 * The dashboard preview of the seller's savings. Reads the same
 * `myImpactYear` record as the full Environmental Impact screen — through the
 * same hook, so Apollo serves the second surface from cache — and shows the
 * three headline totals for the current year.
 */
export function ImpactSnapshot() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  // No year argument: the backend answers with the current one.
  const { impact, loading } = useImpactYear();

  const stats = [
    {
      key: "co2",
      icon: Leaf,
      value: impact ? `${formatCo2KG(impact.totalCo2SavingsKG, lang)} kg` : PENDING,
      tone: "success",
    },
    {
      key: "water",
      icon: Droplets,
      value: impact ? `${formatWaterLT(impact.totalWaterSavingsLT, lang)} L` : PENDING,
      tone: "info",
    },
    {
      key: "products",
      icon: PackageCheck,
      value: impact ? formatCount(impact.totalItems, lang) : PENDING,
      tone: "primary",
    },
  ] as const;

  // `myImpactYear` is non-nullable, so a seller with nothing recorded still
  // gets a record back — zeroed. Those zeros are a real measurement and render
  // live. `impact` is only absent before the query resolves, which is the one
  // case that greys the tiles out behind an em dash.
  const resolved = Boolean(impact);

  return (
    <SectionCard
      icon={TrendingUp}
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
      }
    >
      <div className="flex flex-col sm:flex-wrap items-center justify-evenly gap-3">
        {stats.map((s) => (
          <StatTile
            key={s.key}
            icon={s.icon}
            value={s.value}
            label={t(`dashboard.impact.${s.key}`)}
            orientation="horizontal"
            tone={s.tone}
            disabled={loading || !resolved}
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
        />
      </div>
    </SectionCard>
  );
}
