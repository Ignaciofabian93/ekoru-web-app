"use client";
import Link from "next/link";
import { CardScroller } from "@/components/Cards/CardScroller";
import { Avatar } from "@/components/Primitives/Avatar";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  businessRowAvatarClass,
  businessRowClass,
  businessRowItemClass,
  businessRowSkeletonAvatarClass,
  businessRowSkeletonClass,
  businessRowSkeletonLineClass,
} from "@/design/business-row";
import { useCardScroller } from "@/hooks/useCardScroller";

const SKELETON_COUNT = 8;

export interface BusinessRowItem {
  sellerId: string;
  name: string;
  logo?: string | null;
  /** Short line under the name, e.g. "12 productos". */
  caption: string;
}

export interface BusinessRowProps {
  lang: string;
  title: string;
  items: BusinessRowItem[];
  loading?: boolean;
  scrollPreviousLabel: string;
  scrollNextLabel: string;
}

/**
 * A swipeable row of businesses (logo, name, count) that opens each one's
 * profile, where its catalog lives. Sits under the category row on the stores
 * and services pages. Renders nothing once loaded with no businesses, so an
 * empty category shows only the grid's own empty state.
 */
export function BusinessRow({
  lang,
  title,
  items,
  loading,
  scrollPreviousLabel,
  scrollNextLabel,
}: BusinessRowProps) {
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    items.length,
  );
  const pending = loading && items.length === 0;

  if (!pending && items.length === 0) return null;

  return (
    <section className={businessRowClass} aria-label={title}>
      <Title level="h2" size="h5">
        {title}
      </Title>
      <CardScroller
        handleScroll={handleScroll}
        scrollRef={scrollRef}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        scrollPreviousAriaLabel={scrollPreviousLabel}
        scrollNextAriaLabel={scrollNextLabel}
      >
        {pending
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className={businessRowSkeletonClass}>
                <div className={businessRowSkeletonAvatarClass} />
                <div className={businessRowSkeletonLineClass} />
              </div>
            ))
          : items.map((item) => (
              <Link
                key={item.sellerId}
                href={`/${lang}/seller/${item.sellerId}`}
                className={businessRowItemClass}
              >
                <Avatar
                  image={item.logo}
                  alt=""
                  size="lg"
                  frame="raised"
                  className={businessRowAvatarClass}
                />
                <Text size="sm" weight="semibold" align="center" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text size="xs" color="secondary" align="center">
                  {item.caption}
                </Text>
              </Link>
            ))}
      </CardScroller>
    </section>
  );
}
