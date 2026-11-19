"use client";
import type { ReactNode } from "react";
import { CardScroller } from "@/components/Patterns/CardScroller";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useTranslation } from "@/i18n/context";
import CardSkeleton from "./CardSkeleton";
import { NAMESPACE } from "./i18n";
import { scrollerStyles } from "./styles";

const SKELETON_COUNT = 6;

export interface ProductScrollerProps<T extends { id: string | number }> {
  items: readonly T[];
  /** Renders one product card; the scroller sizes the slot and the card fills it. */
  renderItem: (item: T, index: number) => ReactNode;
  /** While true and nothing has arrived yet, the rail shows placeholder cards. */
  loading?: boolean;
  /** Rendered in place of the rail once loading ends with nothing to show. */
  empty?: ReactNode;
}

export default function ProductScroller<T extends { id: string | number }>({
  items,
  renderItem,
  loading = false,
  empty = null,
}: ProductScrollerProps<T>) {
  const { t } = useTranslation(NAMESPACE);
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    items.length,
  );
  const pending = loading && items.length === 0;

  if (!pending && items.length === 0) return empty;

  return (
    <CardScroller
      handleScroll={handleScroll}
      scrollRef={scrollRef}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
      scrollPreviousAriaLabel={t("scroller.previous")}
      scrollNextAriaLabel={t("scroller.next")}
    >
      {pending
        ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={i} className={scrollerStyles.item}>
              <CardSkeleton />
            </div>
          ))
        : items.map((item, i) => (
            <div key={item.id} className={scrollerStyles.item}>
              {renderItem(item, i)}
            </div>
          ))}
    </CardScroller>
  );
}
