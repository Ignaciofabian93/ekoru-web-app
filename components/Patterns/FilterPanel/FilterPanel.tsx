"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { SlidersHorizontal } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import {
  filterPanelBadgeClass,
  filterPanelClass,
  filterPanelClearClass,
  filterPanelHeaderClass,
  filterPanelTitleGroupClass,
} from "@/design/filter-panel";

export interface FilterPanelProps {
  /** Already-translated heading — shared components take text as props. */
  title: string;
  /** How many filters are on. Zero hides the badge and the clear action. */
  activeCount?: number;
  clearLabel: string;
  onClear: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * The facet rail's shell: a heading that says how many filters are on, a way
 * to drop them all, and the groups below it. It carries no surface of its own
 * — the rail is a column beside the results, not a card floating next to them.
 */
export function FilterPanel({
  title,
  activeCount = 0,
  clearLabel,
  onClear,
  children,
  className,
}: FilterPanelProps) {
  const hasFilters = activeCount > 0;

  return (
    <div className={clsx(filterPanelClass, className)}>
      <div className={filterPanelHeaderClass}>
        <div className={filterPanelTitleGroupClass}>
          <SlidersHorizontal
            size={16}
            strokeWidth={2}
            className="text-foreground-secondary"
            aria-hidden
          />
          <Text variant="span" size="base" weight="bold">
            {title}
          </Text>
          {hasFilters && <span className={filterPanelBadgeClass}>{activeCount}</span>}
        </div>
        {hasFilters && (
          <button type="button" onClick={onClear} className={filterPanelClearClass}>
            {clearLabel}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
