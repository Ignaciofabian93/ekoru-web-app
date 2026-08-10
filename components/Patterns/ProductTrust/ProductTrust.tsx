"use client";

import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { Text } from "@/components/Primitives/Text";

export type ProductTrustTone = "primary" | "secondary" | "accent";

const TONE_STYLES: Record<ProductTrustTone, string> = {
  primary: "bg-primary/60 text-white",
  secondary: "bg-secondary/60 text-white",
  accent: "bg-accent/60 text-white",
};

/** Fallback order, so a list without explicit tones still alternates. */
const TONE_CYCLE: ProductTrustTone[] = ["secondary", "accent", "primary"];

/**
 * One reassurance row. Shared components never read a feature namespace, so the
 * host screen resolves `title`/`hint` from its own dictionary and passes them in.
 */
export interface ProductTrustItem {
  icon: LucideIcon;
  title: string;
  hint: string;
  /** Defaults to the position in the list (secondary → accent → primary). */
  tone?: ProductTrustTone;
}

export interface ProductTrustProps {
  items: ProductTrustItem[];
  className?: string;
}

export function ProductTrust({ items, className }: ProductTrustProps) {
  if (items.length === 0) return null;

  return (
    <ul
      className={clsx(
        "bg-white flex flex-col divide-y",
        "divide-border-light rounded-2xl",
        "border border-border-light",
        className,
      )}
    >
      {items.map(({ icon: Icon, title, hint, tone }, index) => (
        <li key={title} className="flex items-start gap-3 px-4 py-3">
          <span
            className={clsx(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              TONE_STYLES[tone ?? TONE_CYCLE[index % TONE_CYCLE.length]],
            )}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden />
          </span>
          <div className="flex flex-col">
            <Text variant="span" weight="semibold" size="sm">
              {title}
            </Text>
            <Text variant="span" weight="semibold" size="xs">
              {hint}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}
