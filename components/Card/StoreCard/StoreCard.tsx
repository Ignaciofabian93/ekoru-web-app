"use client";

import clsx from "clsx";
import { useState } from "react";

import { DEFAULT_STORE_LABELS, type StoreCardData, type StoreCardLabels } from "./types";
import FrontSide from "./FrontSide";
import BackSide from "./BackSide";

interface Props {
  store: StoreCardData;
  href?: string;
  labels?: StoreCardLabels;
  className?: string;
}

export default function StoreCard({ store, href, labels, className }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);

  const merged: StoreCardLabels = {
    ...DEFAULT_STORE_LABELS,
    ...labels,
    businessType: { ...DEFAULT_STORE_LABELS.businessType, ...labels?.businessType },
  };

  return (
    <div className={clsx("relative aspect-3/4 w-full min-w-0", className)}>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <FrontSide store={store} href={href} labels={merged} onFlip={flip} />
      </div>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <BackSide store={store} href={href} labels={merged} onFlip={flip} />
      </div>
    </div>
  );
}
