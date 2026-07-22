"use client";

import clsx from "clsx";
import { useState } from "react";

import EnvironmentalImpactModal from "@/components/EnvironmentalImpactModal/EnvironmentalImpactModal";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import BackSide from "./BackSide";
import FrontSide from "./FrontSide";
import type { StoreProductCardProduct } from "./types";

interface Props {
  product: StoreProductCardProduct;
  lang?: string;
  href?: string;
  className?: string;
}

/**
 * Store product card — mirrors the marketplace card's flip layout and
 * dimensions, but is themed teal (secondary) for the stores domain. The front
 * face is purchase-only; the back shows the environmental impact + seller.
 */
export default function StoreProductCard({ product, lang, href, className }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);
  const isOwnProduct = useIsOwnProduct(product.sellerId);

  const resolvedHref =
    href ?? (lang ? `/${lang}/store-product/${product.id}` : undefined);

  return (
    <div
      className={clsx(
        "relative min-w-46 w-full max-w-50",
        {
          "h-60": isOwnProduct,
          "h-76": !isOwnProduct,
        },
        className,
      )}
    >
      <div
        className={clsx(
          "relative h-full w-full transition-transform duration-500 ease-out transform-3d",
          isFlipped && "rotate-y-180",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 backface-hidden",
            isFlipped && "pointer-events-none",
          )}
        >
          <FrontSide
            product={product}
            href={resolvedHref}
            onFlip={flip}
            isOwnProduct={isOwnProduct}
          />
        </div>
        <div
          className={clsx(
            "absolute inset-0 rotate-y-180 backface-hidden",
            !isFlipped && "pointer-events-none",
          )}
        >
          <BackSide
            product={product}
            onFlip={flip}
            onShowImpact={() => setImpactOpen(true)}
          />
        </div>
      </div>

      {product.environmentalImpact && (
        <EnvironmentalImpactModal
          isOpen={impactOpen}
          onClose={() => setImpactOpen(false)}
          environmentalImpact={product.environmentalImpact}
          productName={product.name}
        />
      )}
    </div>
  );
}
