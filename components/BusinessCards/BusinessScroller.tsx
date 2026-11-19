"use client";
import type { ReactNode } from "react";
import { CardScroller } from "@/components/Patterns/CardScroller";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useTranslation } from "@/i18n/context";
import CardSkeleton from "./CardSkeleton";
import { NAMESPACE } from "./i18n";
import { scrollerStyles } from "./styles";

const SKELETON_COUNT = 4;

export interface BusinessScrollerProps<T extends { id: string | number }> {
  items: readonly T[];
  /** Renders one business card; business cards set their own width. */
  renderItem: (item: T) => ReactNode;
  /** While true and nothing has arrived yet, the rail shows placeholder cards. */
  loading?: boolean;
  /** Rendered in place of the rail once loading ends with nothing to show. */
  empty?: ReactNode;
}

export default function BusinessScroller<T extends { id: string | number }>({
  items,
  renderItem,
  loading = false,
  empty = null,
}: BusinessScrollerProps<T>) {
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
        : items.map((item) => (
            <div key={item.id} className={scrollerStyles.item}>
              {renderItem(item)}
            </div>
          ))}
    </CardScroller>
  );
}
