"use client";
import { ShoppingCart } from "lucide-react";
import { MarketplaceCard } from "@/components/Cards/MarketplaceCard";
import { ResultsGrid } from "@/components/Patterns/ResultsGrid";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { MarketplaceProduct } from "../types";

interface Props {
  products: MarketplaceProduct[];
  lang: string;
  loading?: boolean;
}

export function ProductGrid({ products, lang, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <ResultsGrid
      items={products}
      loading={loading}
      emptyIcon={ShoppingCart}
      emptyTitle={t("results.empty")}
      emptyHint={t("results.emptyHint")}
      renderItem={(product, i) => (
        <MarketplaceCard key={product.id} product={product} lang={lang} priority={i < 2} />
      )}
    />
  );
}
