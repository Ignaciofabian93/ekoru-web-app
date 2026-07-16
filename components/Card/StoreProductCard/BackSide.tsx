"use client";

import ProductImpactBack from "@/components/Card/shared/ProductImpactBack";
import type { StoreProduct } from "@/types/product";

interface Props {
  product: StoreProduct;
  onFlip: () => void;
  onShowImpact: () => void;
}

export default function BackSide({ product, onFlip, onShowImpact }: Props) {
  return (
    <ProductImpactBack
      title={product.name}
      environmentalImpact={product.environmentalImpact}
      seller={product.seller}
      accent="secondary"
      onFlip={onFlip}
      onShowImpact={onShowImpact}
    />
  );
}
