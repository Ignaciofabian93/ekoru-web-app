"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import {
  productTrustBodyClass,
  productTrustIconClass,
  productTrustIconSize,
  productTrustIconStroke,
  productTrustItemClass,
  productTrustListClass,
  productTrustToneCycle,
} from "@/design/product-trust";

export type ProductTrustTone = "primary" | "secondary" | "accent";

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
    <ul className={clsx(productTrustListClass, className)}>
      {items.map(({ icon: Icon, title, hint, tone }, index) => (
        <li key={title} className={productTrustItemClass}>
          <span
            className={
              productTrustIconClass[
                tone ?? productTrustToneCycle[index % productTrustToneCycle.length]
              ]
            }
          >
            <Icon
              size={productTrustIconSize}
              strokeWidth={productTrustIconStroke}
              aria-hidden
            />
          </span>
          <div className={productTrustBodyClass}>
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
