"use client";
import { useTranslation } from "@/i18n/context";
import { ShoppingCart } from "lucide-react";

import { NAMESPACE } from "../i18n";
import type { MarketplaceProduct } from "../types";
import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";

interface Props {
  products: MarketplaceProduct[];
  lang: string;
  loading?: boolean;
}

export function ProductGrid({ products, lang, loading }: Props) {
  const { t } = useTranslation(NAMESPACE);

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-background-secondary aspect-3/4 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-foreground-secondary py-16 text-center">
        <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" strokeWidth={1.5} />
        <p className="font-semibold">{t("results.empty")}</p>
        <p className="mt-1 text-sm">{t("results.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <MarketplaceCard key={product.id} product={product} lang={lang} />
      ))}
    </div>
  );
}
