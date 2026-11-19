"use client";
import { useTranslation } from "@/i18n/context";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { NAMESPACE } from "../i18n";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { MarketplaceCard, ProductScroller } from "@/components/ProductCards";
import { ArrowUpRight, PackageSearch } from "lucide-react";
import { LinkButton } from "@/components/Primitives";

interface Props {
  lang: string;
  sellerId: string;
  excludeProductId: number | string;
}

export function OtherFromSeller({ lang, sellerId, excludeProductId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { products, loading } = useSellerProducts({
    sellerId,
    excludeProductId,
  });
  const isEmpty = !loading && products.length === 0;

  return (
    <Section ariaLabel={t("otherProducts.title")}>
      <SectionHeader
        align="start"
        title={t("otherProducts.title")}
        action={
          isEmpty ? undefined : (
            <LinkButton
              href={`/${lang}/seller/${sellerId}`}
              label={t("actions.viewAll")}
              icon={ArrowUpRight}
              iconPosition="right"
              variant="ghost"
            />
          )
        }
      />

      <ProductScroller
        items={products}
        loading={loading}
        empty={
          <EmptyState
            variant="compact"
            icon={PackageSearch}
            title={t("otherProducts.empty")}
          />
        }
        renderItem={(product) => <MarketplaceCard product={product} lang={lang} />}
      />
    </Section>
  );
}
