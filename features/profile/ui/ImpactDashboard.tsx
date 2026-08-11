"use client";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Droplets, Leaf, Sprout } from "lucide-react";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useImpactYear } from "../hooks/useImpactYear";
import {
  formatCo2KG,
  formatCount,
  formatWaterLT,
  impactLocale,
} from "../constants/impactFormat";
import { CategoryBars } from "./CategoryBars";

export function ImpactDashboard() {
  const [language] = useLanguage();
  const { t } = useTranslation(NAMESPACE);
  const [year, setYear] = useState<number | undefined>(undefined);

  const { availableYears, impact, loading } = useImpactYear(year);

  const format = useMemo(() => {
    const locale = impactLocale(language);
    return {
      co2: (kg: number) => `${formatCo2KG(kg, language)} ${t("impact.hero.co2Unit")}`,
      water: (lt: number) => `${formatWaterLT(lt, language)} ${t("impact.hero.waterUnit")}`,
      count: (n: number) => formatCount(n, language),
      date: (iso: string) => {
        const parsed = new Date(iso);
        return Number.isNaN(parsed.getTime())
          ? ""
          : new Intl.DateTimeFormat(locale, {
              day: "numeric",
              month: "short",
            }).format(parsed);
      },
    };
  }, [language, t]);

  const shownYear = impact?.year ?? year ?? new Date().getFullYear();
  const hasData = Boolean(impact && impact.totalItems > 0);

  return (
    <section>
      <header className="mb-5">
        <Title level="h1" size="h3">
          {t("impact.title")}
        </Title>
        <Text variant="p" size="sm" className="mt-1 text-foreground-secondary">
          {t("impact.subtitle")}
        </Text>
      </header>

      {availableYears.length > 1 && (
        <div
          role="tablist"
          aria-label={t("impact.yearPicker.label")}
          className="mb-5 flex gap-1 overflow-x-auto rounded-lg bg-background-secondary p-1"
        >
          {availableYears.map((option) => (
            <button
              key={option}
              role="tab"
              type="button"
              aria-selected={option === shownYear}
              onClick={() => setYear(option)}
              className={clsx(
                "cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold",
                "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                option === shownYear
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <p className="py-10 text-center text-sm text-foreground-tertiary">
          {t("impact.loading")}
        </p>
      )}

      {!loading && !hasData && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border-light bg-surface px-6 py-14 text-center">
          <Sprout
            size={28}
            aria-hidden
            strokeWidth={1.6}
            className="text-foreground-tertiary"
          />
          <Text variant="p" size="base" weight="bold">
            {t("impact.empty.title")}
          </Text>
          <Text
            variant="p"
            size="sm"
            className="max-w-sm text-foreground-secondary"
          >
            {t("impact.empty.description")}
          </Text>
        </div>
      )}

      {!loading && hasData && impact && (
        <div className="flex flex-col gap-5">
          {/* Two hero figures, not a chart: these are the headline numbers. */}
          <div className="grid gap-3 sm:grid-cols-2">
            <HeroFigure
              icon={<Leaf size={18} aria-hidden strokeWidth={2} />}
              label={t("impact.hero.co2")}
              value={format.co2(impact.totalCo2SavingsKG)}
              tone="primary"
            />
            <HeroFigure
              icon={<Droplets size={18} aria-hidden strokeWidth={2} />}
              label={t("impact.hero.water")}
              value={format.water(impact.totalWaterSavingsLT)}
              tone="secondary"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatTile label={t("impact.stats.items")} value={format.count(impact.totalItems)} />
            <StatTile label={t("impact.stats.sales")} value={format.count(impact.salesCount)} />
            <StatTile
              label={t("impact.stats.exchanges")}
              value={format.count(impact.exchangesCount)}
            />
          </div>

          {impact.byCategory.length > 0 && (
            <Card>
              <CardHeading
                title={t("impact.categories.title")}
                subtitle={t("impact.categories.subtitle")}
              />
              <CategoryBars
                categories={impact.byCategory}
                formatCo2={format.co2}
                unknownLabel={t("impact.categories.unknown")}
                itemsLabel={(count) =>
                  count === 1
                    ? t("impact.categories.itemsOne")
                    : t("impact.categories.itemsMany", { count: String(count) })
                }
              />
            </Card>
          )}

          {impact.topItems.length > 0 && (
            <Card>
              <CardHeading title={t("impact.topItems.title")} />
              <ul className="divide-y divide-border-light">
                {impact.topItems.map((item, index) => (
                  <li
                    key={item.productId ?? `top-${index}`}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <Text
                        variant="span"
                        size="sm"
                        weight="semibold"
                        className="block line-clamp-1"
                      >
                        {item.productName || t("impact.topItems.unknownProduct")}
                      </Text>
                      <Text
                        variant="span"
                        size="xs"
                        className="block text-foreground-tertiary"
                      >
                        {item.role === "BUYER"
                          ? t("impact.topItems.roleBuyer")
                          : t("impact.topItems.roleSeller")}
                        {" · "}
                        {item.kind === "EXCHANGE"
                          ? t("impact.topItems.kindExchange")
                          : t("impact.topItems.kindSale")}
                        {item.occurredAt ? ` · ${format.date(item.occurredAt)}` : ""}
                      </Text>
                    </span>
                    <Text
                      variant="span"
                      size="sm"
                      weight="bold"
                      className="shrink-0"
                    >
                      {format.co2(item.co2SavingsKG)}
                    </Text>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Text
            variant="p"
            size="xs"
            className="text-center text-foreground-tertiary"
          >
            {t("impact.footnote")}
          </Text>
        </div>
      )}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border-light bg-surface p-4">
      {children}
    </div>
  );
}

function CardHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <Title level="h2" size="h6">
        {title}
      </Title>
      {subtitle && (
        <Text variant="p" size="xs" className="text-foreground-tertiary">
          {subtitle}
        </Text>
      )}
    </div>
  );
}

/**
 * The headline number. Large and sans, on its own.
 *
 * This used to carry an admin-curated "equivalent to…" line underneath, but
 * `SellerImpactYear` exposes no such field — the copy lives in the
 * `rawCo2ImpactMessages` / `rawWaterImpactMessages` tables, keyed by a
 * min/max band the client would have to match against. Restore it here once
 * the seller-facing query resolves the band itself.
 */
function HeroFigure({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "secondary";
}) {
  return (
    <div className="flex flex-col rounded-xl border border-border-light bg-surface p-4">
      <span
        className={clsx(
          "mb-2 flex items-center gap-1.5",
          tone === "primary" ? "text-primary" : "text-secondary-dark",
        )}
      >
        {icon}
        <Text variant="span" size="xs" weight="semibold" className="uppercase">
          {label}
        </Text>
      </span>

      <span className="font-sans text-4xl font-bold leading-none text-foreground">
        {value}
      </span>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-light bg-surface p-3 text-center">
      <span className="block font-sans text-2xl font-bold leading-none text-foreground">
        {value}
      </span>
      <Text
        variant="span"
        size="xs"
        className="mt-1 block text-foreground-secondary"
      >
        {label}
      </Text>
    </div>
  );
}
