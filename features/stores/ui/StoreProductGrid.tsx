"use client";
import { Store } from "lucide-react";
import { ResultsGrid } from "@/components/Patterns/ResultsGrid";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { ProductCard } from "@/components/ProductCards";

interface Props {
  products: StoreProduct[];
  lang: string;
  loading?: boolean;
}

export function StoreProductGrid({ products, lang, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <ResultsGrid
      items={products}
      loading={loading}
      emptyIcon={Store}
      emptyTitle={t("results.empty")}
      emptyHint={t("results.emptyHint")}
      renderItem={(product) => (
        <ProductCard key={product.id} product={product} lang={lang} />
      )}
    />
  );
}
