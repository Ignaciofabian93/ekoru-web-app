"use client";

import clsx from "clsx";
import { useState } from "react";

import type { MarketplaceCardProduct } from "./types";
import CardBackSide from "./BackSide";
import CardFrontSide from "./FrontSide";

interface Props {
  product: MarketplaceCardProduct;
  lang?: string;
  href?: string;
  onShowImpact?: () => void;
  onAddToCart?: () => void;
  className?: string;
}

export default function MarketplaceCard({
  product,
  lang,
  href,
  onShowImpact,
  onAddToCart,
  className,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);

  const resolvedHref = href ?? (lang ? `/${lang}/product/${product.id}` : undefined);

  return (
    <div
      className={clsx(
        "relative aspect-3/4 w-full min-w-0 perspective-distant",
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
            onShowImpact={onShowImpact}
          />
        </div>
      </div>
    </div>
  );
}
