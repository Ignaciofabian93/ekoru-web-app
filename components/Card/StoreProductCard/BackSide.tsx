"use client";

import ProductImpactBack from "@/components/Card/shared/ProductImpactBack";
import type { StoreProductCardProduct } from "./types";

interface Props {
  product: StoreProductCardProduct;
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
