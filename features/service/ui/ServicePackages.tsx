"use client";
import { Package, Percent } from "lucide-react";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useParams } from "next/navigation";

import { NAMESPACE } from "../i18n";
import type { ServicePackage } from "../types";

function formatPrice(value: number, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `CLP ${value}`;
  }
}

/**
 * Bundles the provider sells that include this service. Packages belong to the
 * seller, so the same bundle appears on every service inside it — each card
 * lists what is in it so the buyer can tell them apart.
 */
export function ServicePackages({ packages }: { packages?: ServicePackage[] | null }) {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  if (!packages || packages.length === 0) return null;

  return (
    <section className="flex flex-col gap-4" aria-label={t("packages.title")}>
      <Title level="h2" size="h5" weight="semibold">
        {t("packages.title")}
      </Title>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {packages.map((pkg) => (
          <li
            key={pkg.id}
            className="flex flex-col gap-2 rounded-2xl border border-border-light bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Package size={18} className="shrink-0 text-primary" strokeWidth={2} />
                <Title level="h3" size="h6" weight="semibold">
                  {pkg.name}
                </Title>
              </div>
              {pkg.discountPercentage ? (
                <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  <Percent size={12} strokeWidth={2.5} />
                  {pkg.discountPercentage}
                </span>
              ) : null}
            </div>

            <Text variant="p" size="sm" color="tertiary">
              {pkg.description}
            </Text>

            {pkg.items.length > 0 && (
              <ul className="flex flex-col gap-1">
                {pkg.items.map((item) => (
                  <li key={item.id} className="text-sm text-foreground-secondary">
                    · {item.serviceName ?? t("packages.unnamedItem")}
                    {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-1 flex items-baseline justify-between gap-2">
              <Text variant="span" weight="bold" size="lg">
                {formatPrice(pkg.totalPrice, lang)}
              </Text>
              {pkg.validityDays ? (
                <Text variant="span" size="xs" color="tertiary">
                  {t("packages.validity", { count: String(pkg.validityDays) })}
                </Text>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
