"use client";

import { Check, ChevronRight, MapPin, Phone, RotateCcw } from "lucide-react";
import Link from "next/link";

import type { ServiceCardData, ServiceCardLabels } from "./types";

interface Props {
  service: ServiceCardData;
  href?: string;
  labels: Required<ServiceCardLabels>;
  onFlip: () => void;
  onContact?: () => void;
}

export default function BackSide({ service, href, labels, onFlip, onContact }: Props) {
  const location = [service.address, service.city].filter(Boolean).join(", ");
  const includes = service.includes?.slice(0, 3) ?? [];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-accent/30 bg-surface shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-accent/20 bg-accent/10 px-3 py-2">
        <p className="truncate text-xs font-semibold text-accent">{service.name}</p>
        <button
          type="button"
          onClick={onFlip}
          aria-label={labels.flipToFront}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent text-white shadow-sm transition-colors hover:bg-accent-hover"
        >
          <RotateCcw size={13} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        <p className="line-clamp-3 text-xs leading-relaxed text-foreground-secondary">
          {service.description || labels.noDescription}
        </p>

        {includes.length > 0 && (
          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-foreground-tertiary uppercase">
              {labels.includes}
            </p>
            <ul className="flex flex-col gap-0.5">
              {includes.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-foreground-secondary"
                >
                  <Check size={12} strokeWidth={2.5} className="mt-0.5 shrink-0 text-accent" />
                  <span className="line-clamp-2">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="flex flex-col gap-1.5">
          {location && (
            <li className="flex items-start gap-1.5 text-xs text-foreground-secondary">
              <MapPin size={12} strokeWidth={2} className="mt-0.5 shrink-0 text-accent" />
              <span className="line-clamp-2">{location}</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center gap-2">
          {onContact && (
            <button
              type="button"
              onClick={onContact}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md border border-accent bg-surface px-2 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
            >
              <Phone size={12} strokeWidth={2.5} />
              {labels.contactProvider}
            </button>
          )}
          {href && (
            <Link
              href={href}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-accent px-2 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
            >
              {labels.bookNow}
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
