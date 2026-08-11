"use client";
import clsx from "clsx";

import { Text } from "@/components/Primitives/Text";
import type { ImpactCategoryBreakdown } from "../types";

interface CategoryBarsProps {
  categories: ImpactCategoryBreakdown[];
  /** Formats a CO2 value for display, already localised. */
  formatCo2: (kg: number) => string;
  unknownLabel: string;
  itemsLabel: (count: number) => string;
}

/**
 * CO2 saved per category, highest first.
 *
 * Horizontal bars because the job is comparing magnitude across a handful of
 * long-named categories. One series, so a **single hue** carries magnitude and
 * there is no legend — the section heading already says what is plotted, and a
 * one-swatch legend would just restate it.
 *
 * Values are direct-labelled at each bar tip, which removes the need for an
 * x-axis and gridlines entirely.
 */
export function CategoryBars({
  categories,
  formatCo2,
  unknownLabel,
  itemsLabel,
}: CategoryBarsProps) {
  if (categories.length === 0) return null;

  // Scale to the largest bar rather than the total: this compares categories to
  // each other, it is not a part-to-whole.
  const max = Math.max(...categories.map((c) => c.co2SavingsKG), 0);

  return (
    <ul className="flex flex-col gap-3">
      {categories.map((category, index) => {
        const pct = max > 0 ? (category.co2SavingsKG / max) * 100 : 0;

        return (
          <li
            key={category.productCategoryId ?? `unknown-${index}`}
            className="flex flex-col gap-1"
          >
            <div className="flex items-baseline justify-between gap-3">
              <Text variant="span" size="sm" weight="semibold">
                {category.categoryName || unknownLabel}
              </Text>
              {/* Text never wears the data colour — the bar carries identity. */}
              <Text
                variant="span"
                size="xs"
                className="shrink-0 text-foreground-secondary"
              >
                {formatCo2(category.co2SavingsKG)}
              </Text>
            </div>

            <div className="flex items-center gap-2">
              {/* Track is one step off the surface, recessive. */}
              <div className="h-3 flex-1 overflow-hidden rounded-sm bg-background-secondary">
                <div
                  className={clsx(
                    "h-full bg-primary",
                    // Square at the baseline, 4px rounded at the data end.
                    "rounded-r-[4px]",
                  )}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>
              <Text
                variant="span"
                size="xs"
                className="w-16 shrink-0 text-right text-foreground-tertiary"
              >
                {itemsLabel(category.itemCount)}
              </Text>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
