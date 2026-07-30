"use client";

import clsx from "clsx";
import { useState, type ReactNode } from "react";

import ImpactModal from "@/components/Cards/ImpactModal";
import type { MarketplaceCardProduct } from "./types";
import CardBackSide from "./BackSide";
import CardFrontSide from "./FrontSide";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";

interface Props {
  product: MarketplaceCardProduct;
  lang?: string;
  href?: string;
  onAddToCart?: () => void;
  className?: string;
  /** Eager-load + preload the cover image. Set on above-the-fold cards (LCP). */
  priority?: boolean;
  /** Overlay controls (e.g. an owner actions menu) rendered top-right, above the
   *  card faces and outside the clipped body so a dropdown isn't cut off. When
   *  set, the flip-to-details control is hidden — the card switches from browse
   *  mode to management mode. */
  actions?: ReactNode;
}

export default function MarketplaceCard({
  product,
  lang,
  href,
  onAddToCart,
  className,
  priority,
  actions,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);
  const isOwnProduct = useIsOwnProduct(product.sellerId);

  const resolvedHref = href ?? (lang ? `/${lang}/product/${product.id}` : undefined);

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
          <CardFrontSide
            product={product}
            href={resolvedHref}
            onFlip={flip}
            onAddToCart={onAddToCart}
            priority={priority}
            showFlip={!actions}
            isOwnProduct={isOwnProduct}
          />
        </div>
        <div
          className={clsx(
            "absolute inset-0 rotate-y-180 backface-hidden",
            !isFlipped && "pointer-events-none",
          )}
        >
          <CardBackSide
            product={product}
            onFlip={flip}
            onShowImpact={() => setImpactOpen(true)}
          />
        </div>
      </div>

      {/* Overlay controls live outside the flip faces so the 3D transform and
          the faces' overflow-hidden don't clip an open dropdown. */}
      {actions && <div className="absolute right-2 top-2 z-20">{actions}</div>}

      {product.environmentalImpact && (
        <ImpactModal
          isOpen={impactOpen}
          onClose={() => setImpactOpen(false)}
          environmentalImpact={product.environmentalImpact}
          productName={product.name}
        />
      )}
    </div>
  );
}
