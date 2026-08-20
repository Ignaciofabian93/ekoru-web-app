"use client";
import { useTranslation } from "@/i18n/context";
import type { SupportedLanguage } from "@/constants/settings";
import type { StoreProduct } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Primitives/Title";
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

export function StoreProductDetails({
  product,
  lang,
}: {
  product: StoreProduct;
  lang: SupportedLanguage;
}) {
  const { t } = useTranslation(NAMESPACE);

  const rows = [
    { label: t("details.brand"), value: product.brand },
    { label: t("details.color"), value: product.color },
    {
      label: t("details.category"),
      value: product.storeSubCategory?.translation.name,
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
    </div>
  );
}
