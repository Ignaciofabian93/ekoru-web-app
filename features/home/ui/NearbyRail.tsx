"use client";
import type { ReactNode } from "react";
import { CardScroller } from "@/components/Cards/CardScroller";
import { Title } from "@/components/Primitives/Title";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

const SKELETON_COUNT = 6;

/**
 * One kind of thing near the visitor (marketplace items, stores…): a level-3
 * heading under the section's own, over its rail — a `ProductScroller` for
 * products, a `NearbyBusinessScroller` for stores and providers. With nothing
 * nearby the rail says so under its heading, so the rails keep their places as
 * the radius changes.
 */
export function NearbyRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Title level="h3" size="h5" weight="semibold">
        {title}
      </Title>
      {children}
    </div>
  );
}

/**
 * The business-card rail (stores, providers). Business cards set their own
 * width, so unlike `ProductScroller` this only sizes the placeholders to them.
 */
export function NearbyBusinessScroller<T extends { id: string | number }>({
  items,
  loading,
  empty,
  renderItem,
}: {
  items: readonly T[];
  loading: boolean;
  empty: ReactNode;
  renderItem: (item: T) => ReactNode;
}) {
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
      scrollPreviousAriaLabel={t("nearby.scrollPrevious")}
      scrollNextAriaLabel={t("nearby.scrollNext")}
    >
      {pending
        ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div
              key={i}
              aria-hidden
              className="h-92 w-72 shrink-0 snap-start animate-pulse rounded-2xl bg-background-secondary sm:w-80"
            />
          ))
        : items.map((item) => (
            <div key={item.id} className="shrink-0 snap-start">
              {renderItem(item)}
            </div>
          ))}
    </CardScroller>
  );
}
