"use client";

import clsx from "clsx";
import { useState } from "react";
import CardBackSide from "./BackSide";
import CardFrontSide from "./FrontSide";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  onPress?: () => void;
  onShowImpact?: () => void;
  style?: React.CSSProperties;
}

export default function MarketplaceCard({
  product,
  onPress = () => {},
  onShowImpact = () => {},
  style,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => setIsFlipped((prev) => !prev);

  return (
    <div style={style} className="relative h-75 w-43.5">
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-150",
          isFlipped ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <CardFrontSide product={product} onFlip={flip} onPress={onPress} />
      </div>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-150",
          isFlipped ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <CardBackSide product={product} onFlip={flip} onShowImpact={onShowImpact} />
      </div>
    </div>
  );
}
