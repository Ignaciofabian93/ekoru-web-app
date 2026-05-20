"use client";

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
    <div style={{ width: 174, height: 300, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isFlipped ? 0 : 1,
          pointerEvents: isFlipped ? "none" : "auto",
          transition: "opacity 0.15s ease",
        }}
      >
        <CardFrontSide product={product} onFlip={flip} onPress={onPress} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: isFlipped ? 1 : 0,
          pointerEvents: isFlipped ? "auto" : "none",
          transition: "opacity 0.15s ease",
        }}
      >
        <CardBackSide product={product} onFlip={flip} onShowImpact={onShowImpact} />
      </div>
    </div>
  );
}
