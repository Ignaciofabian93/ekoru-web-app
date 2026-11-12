"use client";
import type { ReactNode } from "react";
import { CardScroller } from "@/components/Cards/CardScroller";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

const SKELETON_COUNT = 6;

/**
 * One kind of thing near the visitor (marketplace items, stores…): a level-3
 * heading under the section's own, and a card rail. While its first page loads
 * it shows placeholder cards; with nothing nearby it keeps its heading and says
 * so, so the four rails keep their places as the radius changes.
 *
 * @param skeletonClassName Size of a placeholder card, matching the real ones.
 */
export function NearbyRail<T extends { id: string | number }>({
  title,
  items,
  loading,
  emptyText,
  renderItem,
  skeletonClassName,
}: {
  title: string;
  items: readonly T[];
  loading: boolean;
  emptyText: string;
  renderItem: (item: T, index: number) => ReactNode;
  skeletonClassName: string;
}) {
  const { t } = useTranslation(NAMESPACE);
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    items.length,
  );
  const pending = loading && items.length === 0;

  return (
    <div className="flex flex-col gap-3">
      <Title level="h3" size="h5" weight="semibold">
        {title}
      </Title>
      {pending || items.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("nearby.scrollPrevious")}
          scrollNextAriaLabel={t("nearby.scrollNext")}
        >
          {pending
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className={`shrink-0 snap-start animate-pulse rounded-lg bg-background-secondary ${skeletonClassName}`}
                />
              ))
            : items.map((item, i) => (
                <div key={item.id} className="shrink-0 snap-start">
                  {renderItem(item, i)}
                </div>
              ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm" color="secondary">
          {emptyText}
        </Text>
      )}
    </div>
  );
}
