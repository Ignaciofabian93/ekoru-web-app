"use client";
import { useTranslation } from "@/i18n/context";
import type { SupportedLanguage } from "@/constants/settings";
import type { Product } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { NAMESPACE as CARDS_NAMESPACE } from "@/components/Cards/i18n";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";
import { DataList } from "@/components/Patterns";

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
  // Condition wording is owned by the shared `cards` dictionary — the same
  // one the product badge renders from — so the filter, the detail page and
  // the badge can never word the same enum differently again.
  const { t: tCondition } = useTranslation(CARDS_NAMESPACE);

  const rows = [
    { label: t("details.brand"), value: product.brand },
    { label: t("details.color"), value: product.color },
    {
      label: t("details.condition"),
      value: tCondition(`condition.${product.condition}`),
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
    <div className="px-2">
      <Title level="h5" size="h5" weight="semibold" className="mb-3">
        {t("details.title")}
      </Title>
      <DataList rows={rows} />

      {product.conditionDescription && (
        <div className="mt-3 rounded-xl bg-background-secondary border border-slate-200 px-4 py-3">
          <Text
            variant="p"
            size="xs"
            weight="semibold"
            className="tracking-wide uppercase"
          >
            {t("details.conditionDescription")}
          </Text>
          <Text variant="p" size="sm">
            {product.conditionDescription}
          </Text>
        </div>
      )}
    </div>
  );
}
