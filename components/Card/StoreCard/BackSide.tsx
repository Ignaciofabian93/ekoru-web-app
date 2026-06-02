"use client";

import { ChevronRight, Clock, MapPin, Phone, RotateCcw } from "lucide-react";
import Link from "next/link";

import type { StoreCardData, StoreCardLabels } from "./types";

interface Props {
  store: StoreCardData;
  href?: string;
  labels: StoreCardLabels;
  onFlip: () => void;
}

export default function BackSide({ store, href, labels, onFlip }: Props) {
  const location = [store.address, store.city].filter(Boolean).join(", ");

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-secondary/30 bg-surface shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-secondary/20 bg-secondary/10 px-3 py-2">
        <p className="truncate text-xs font-semibold text-secondary-dark">{store.name}</p>
        <button
          type="button"
          onClick={onFlip}
          aria-label={labels.flipToFront}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-sm transition-colors hover:bg-secondary-dark"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        <p className="line-clamp-4 text-xs leading-relaxed text-foreground-secondary">
          {store.description || labels.noDescription}
        </p>

        <ul className="flex flex-col gap-1.5">
          {location && (
            <li className="flex items-start gap-1.5 text-xs text-foreground-secondary">
              <MapPin size={12} strokeWidth={2} className="mt-0.5 shrink-0 text-secondary-dark" />
              <span className="line-clamp-2">{location}</span>
            </li>
          )}
          {store.phone && (
            <li className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <Phone size={12} strokeWidth={2} className="shrink-0 text-secondary-dark" />
              <span className="truncate">{store.phone}</span>
            </li>
          )}
          {store.hoursToday && (
            <li className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <Clock size={12} strokeWidth={2} className="shrink-0 text-secondary-dark" />
              <span className="truncate">
                <span className="font-semibold text-foreground">{labels.hoursToday}:</span>{" "}
                {store.hoursToday}
              </span>
            </li>
          )}
        </ul>

        {href && (
          <Link
            href={href}
            className="mt-auto inline-flex items-center justify-center gap-1 rounded-md bg-secondary px-2 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-secondary-dark"
          >
            {labels.visitStore}
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
