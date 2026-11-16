"use client";
import { ArrowUpRight, PackageSearch } from "lucide-react";
import { StoreProductCard } from "@/components/Cards";
import { ProductScroller } from "@/components/Cards/ProductScroller";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { LinkButton } from "@/components/Primitives";
import { useTranslation } from "@/i18n/context";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { NAMESPACE } from "../i18n";

interface Props {
  lang: string;
  sellerId: string;
  excludeProductId: number | string;
}

/** More from the same store, laid out like the product page's seller rail. */
export function OtherFromBusiness({ lang, sellerId, excludeProductId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { products, loading } = useSellerProducts({ sellerId, excludeProductId });
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
        renderItem={(product) => <StoreProductCard product={product} lang={lang} />}
      />
    </Section>
  );
}
