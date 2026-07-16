"use client";

import clsx from "clsx";
import { useState, type ReactNode } from "react";

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
  /** Overlay controls (e.g. an owner actions menu) rendered top-right. When set
   *  the card enters management mode: customer controls (favorite, flip, book)
   *  are hidden. */
  actions?: ReactNode;
}

export default function ServiceCard({
  service,
  href,
  labels,
  className,
  onContact,
  actions,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);
  const manage = Boolean(actions);

  const merged: Required<ServiceCardLabels> = { ...DEFAULT_SERVICE_LABELS, ...labels };

  return (
    <div className={clsx("relative aspect-3/4 w-full min-w-0", className)}>
      <div
        className={clsx(
          "absolute inset-0 transition-opacity duration-200",
          isFlipped ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <FrontSide
          service={service}
          href={href}
          labels={merged}
          onFlip={flip}
          manage={manage}
        />
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

      {actions && <div className="absolute right-2 top-2 z-20">{actions}</div>}
    </div>
  );
}
