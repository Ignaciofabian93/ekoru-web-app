"use client";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import { useStoreProductsHomeData } from "../hooks/useStoreProducts";
import { ProductCard, ProductScroller } from "@/components/ProductCards";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";

export function StoreProductsHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { storeProducts, loading } = useStoreProductsHomeData();

  return (
    <Section ariaLabel={t("storeProducts.title")}>
      <SectionHeader
        align="start"
        title={t("storeProducts.title")}
        subtitle={t("storeProducts.subtitle")}
        action={
          <Link
            href={`/${lang}/stores`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("storeProducts.seeAll")}
          </Link>
        }
      />
      <ProductScroller
        items={storeProducts}
        loading={loading}
        empty={
          <Text variant="p" size="sm">
            {t("storeProducts.noProducts")}
          </Text>
        }
        renderItem={(product, i) => (
          <ProductCard product={product} lang={lang} priority={i < 2} />
        )}
      />
    </Section>
  );
}
