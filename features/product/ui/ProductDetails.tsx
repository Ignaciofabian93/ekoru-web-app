"use client";
import { useTranslation } from "@/i18n/context";
import type { SupportedLanguage } from "@/constants/settings";
import type { Product } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";
import clsx from "clsx";

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
    <div className="px-2">
      <Title level="h5" size="h5" weight="semibold" className="mb-3">
        {t("details.title")}
      </Title>
      <dl
        className={clsx(
          "bg-white flex flex-col divide-y divide-border-light",
          "overflow-hidden rounded-2xl border border-border-light",
        )}
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <dt>
              <Text variant="span" size="sm" weight="bold">
                {row.label}
              </Text>
            </dt>
            <dd className="text-sm font-medium text-foreground">
              <Text variant="span" size="sm" weight="semibold" color="default">
                {row.value}
              </Text>
            </dd>
          </div>
        ))}
      </dl>

      {product.conditionDescription && (
        <div className="mt-3 rounded-xl bg-background-secondary border border-border-light px-4 py-3">
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
