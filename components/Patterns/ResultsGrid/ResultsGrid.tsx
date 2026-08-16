"use client";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Grid } from "@/components/Layout";
import { Skeleton } from "@/components/Primitives/Skeleton";
import {
  resultsGridClass,
  resultsGridEmptyClass,
  resultsGridEmptyHintClass,
  resultsGridEmptyIconClass,
  resultsGridEmptyIconSize,
  resultsGridEmptyTitleClass,
  resultsGridSkeletonClass,
} from "@/design/results-grid";

export interface ResultsGridProps<T> {
  items: T[];
  /**
   * Renders one cell. Receives the index so the first rows can opt into
   * `priority` image loading. Must return a keyed element.
   */
  renderItem: (item: T, index: number) => ReactNode;
  loading?: boolean;
  /** Icon shown in the empty state. */
  emptyIcon: LucideIcon;
  /** Already-translated empty-state copy — shared components take text as props. */
  emptyTitle: string;
  emptyHint?: string;
  skeletonCount?: number;
}

/**
 * Catalog results grid with its loading and empty states. One component behind
 * the marketplace, store and search result lists so all three share a column
 * count, gap and empty treatment.
 */
export function ResultsGrid<T>({
  items,
  renderItem,
  loading,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyHint,
  skeletonCount = 8,
}: ResultsGridProps<T>) {
  if (loading && items.length === 0) {
    // aria-busy sits on the wrapper so the pending state is announced once,
    // not per placeholder.
    return (
      <div aria-busy="true">
        <Grid cols={2} sm={3} md={4} lg={5} gap={4} className={resultsGridClass}>
          {Array.from({ length: skeletonCount }, (_, i) => (
            <Skeleton key={i} radius="xl" className={resultsGridSkeletonClass} />
          ))}
        </Grid>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={resultsGridEmptyClass}>
        <EmptyIcon
          size={resultsGridEmptyIconSize}
          aria-hidden
          className={resultsGridEmptyIconClass}
          strokeWidth={1.5}
        />
        <p className={resultsGridEmptyTitleClass}>{emptyTitle}</p>
        {emptyHint && <p className={resultsGridEmptyHintClass}>{emptyHint}</p>}
      </div>
    );
  }

  return (
    <Grid cols={2} sm={3} md={4} lg={5} gap={2} className={resultsGridClass}>
      {items.map(renderItem)}
    </Grid>
  );
}
