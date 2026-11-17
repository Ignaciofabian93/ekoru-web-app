"use client";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useTranslation } from "@/i18n/context";
import { CardScroller } from "./CardScroller";
import { NAMESPACE } from "./i18n";

/**
 * The one width a product card has in a rail, at every breakpoint. `lg:w-60`
 * is also the card's own cap (`max-w-60` in `Card`), so on desktop the card
 * fills its slot exactly. Change it here, not at a call site.
 */
const ITEM_CLASS = "w-46 shrink-0 snap-start md:w-50 lg:w-56";

/** Enough placeholders to fill the widest rail. */
const SKELETON_COUNT = 6;

export interface ProductScrollerProps<T extends { id: string | number }> {
  items: readonly T[];
  /**
   * Renders one product card — `MarketplaceCard`, `StoreProductCard` or
   * `ServiceCard`. The scroller sizes the slot; the card fills it.
   */
  renderItem: (item: T, index: number) => ReactNode;
  /** While true and nothing has arrived yet, the rail shows placeholder cards. */
  loading?: boolean;
  /** Rendered in place of the rail once loading ends with nothing to show. */
  empty?: ReactNode;
}

/**
 * A placeholder shaped like a product card: the inset square photo, then room
 * for the details below it. Width-relative, so it matches the real card at
 * every breakpoint instead of guessing a fixed height.
 */
function ProductCardSkeleton() {
  return (
    <div
      aria-hidden
      className={clsx(
        ITEM_CLASS,
        "animate-pulse rounded-2xl bg-background-secondary p-2",
      )}
    >
      <div className="aspect-square rounded-xl bg-background-tertiary" />
      <div className="h-44" />
    </div>
  );
}

/**
 * The horizontal rail every product list on the platform scrolls in — home,
 * "near you", and the "more from this seller" rows on the detail pages. It owns
 * the card width, the arrows, the loading placeholders and the empty
 * fallback, so no two rails can drift apart.
 *
 * Business cards (stores, providers) and blog cards are not products and keep
 * their own widths; they use `CardScroller` directly.
 */
export function ProductScroller<T extends { id: string | number }>({
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
            <ProductCardSkeleton key={i} />
          ))
        : items.map((item, i) => (
            <div key={item.id} className={ITEM_CLASS}>
              {renderItem(item, i)}
            </div>
          ))}
    </CardScroller>
  );
}
