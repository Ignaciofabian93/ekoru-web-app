"use client";

import clsx from "clsx";
import { useState } from "react";

import {
  DEFAULT_SERVICE_LABELS,
  type ServiceCardData,
  type ServiceCardLabels,
} from "./types";
import FrontSide from "./FrontSide";
import BackSide from "./BackSide";

interface Props {
  service: ServiceCardData;
  href?: string;
  labels?: ServiceCardLabels;
  className?: string;
  onContact?: () => void;
}

export default function ServiceCard({
  service,
  href,
  labels,
  className,
  onContact,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);

  const merged: Required<ServiceCardLabels> = { ...DEFAULT_SERVICE_LABELS, ...labels };

  return (
    <div className={clsx("relative aspect-3/4 w-full min-w-0", className)}>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <FrontSide service={service} href={href} labels={merged} onFlip={flip} />
      </div>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <BackSide
          service={service}
          href={href}
          labels={merged}
          onFlip={flip}
          onContact={onContact}
        />
      </div>
    </div>
  );
}
