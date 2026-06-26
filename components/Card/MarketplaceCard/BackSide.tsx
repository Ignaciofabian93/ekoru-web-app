"use client";

import ProductImpactBack from "@/components/Card/shared/ProductImpactBack";
import type { MarketplaceCardProduct } from "./types";

interface Props {
  product: MarketplaceCardProduct;
  onFlip: () => void;
  onShowImpact: () => void;
}

export default function BackSide({ product, onFlip, onShowImpact }: Props) {
  return (
    <ProductImpactBack
      title={product.name}
      environmentalImpact={product.environmentalImpact}
      seller={product.seller}
      accent="primary"
      onFlip={onFlip}
      onShowImpact={onShowImpact}
    />
  );
}
