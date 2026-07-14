"use client";

import { useTranslation } from "@/i18n/context";
import type { SupportedLanguage } from "@/constants/settings";
import type { Product } from "@/types/product";

import { NAMESPACE } from "../i18n";

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  es: "es-CL",
  en: "en-US",
  fr: "fr-FR",
};

function formatDate(value: string | undefined, lang: SupportedLanguage) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export function ProductDetails({
  product,
  lang,
}: {
  product: Product;
  lang: SupportedLanguage;
}) {
  const { t } = useTranslation(NAMESPACE);

  const rows = [
    { label: t("details.brand"), value: product.brand },
    { label: t("details.color"), value: product.color },
    {
      label: t("details.condition"),
      value: t(`conditions.${product.condition}`),
    },
    {
      label: t("details.category"),
      value: product.productCategory?.translation?.name,
    },
    {
      label: t("details.exchangeable"),
      value: product.isExchangeable ? t("details.yes") : t("details.no"),
    },
    {
      label: t("details.publishedOn"),
      value: formatDate(product.createdAt, lang),
    },
  ].filter((r) => r.value);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("details.title")}
      </h2>
      <dl className="bg-surface flex flex-col divide-y divide-border-light overflow-hidden rounded-2xl border border-border-light">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <dt className="text-sm text-foreground-secondary">{row.label}</dt>
            <dd className="text-sm font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      {product.conditionDescription && (
        <div className="mt-3 rounded-xl bg-background-secondary border border-border-light px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-foreground-tertiary uppercase">
            {t("details.conditionDescription")}
          </p>
          <p className="mt-1 text-sm text-foreground-secondary">
            {product.conditionDescription}
          </p>
        </div>
      )}
    </section>
  );
}
