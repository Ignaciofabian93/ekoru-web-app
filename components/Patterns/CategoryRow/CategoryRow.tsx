"use client";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { CardScroller } from "@/components/Cards/CardScroller";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  categoryRowClass,
  categoryRowIconClass,
  categoryRowItemClass,
  categoryRowSkeletonClass,
  categoryRowSkeletonIconClass,
  categoryRowSkeletonLineClass,
} from "@/design/category-row";
import { useCardScroller } from "@/hooks/useCardScroller";

const SKELETON_COUNT = 8;

export interface CategoryRowItem {
  /** Stable id; the slug changes with the language. */
  id: number;
  name: string;
  href: string;
  Icon: LucideIcon;
  /** Short line under the name, e.g. "2 artículos". Omitted while unknown. */
  caption?: string;
}

export interface CategoryRowProps {
  title: string;
  items: CategoryRowItem[];
  loading?: boolean;
  scrollPreviousLabel: string;
  scrollNextLabel: string;
}

/**
 * A swipeable row of categories (icon, name, count) that opens each one's
 * page. The blog and community landing pages' counterpart to
 * `Patterns/BusinessRow`, which it matches tile for tile. Renders nothing once
 * loaded with no categories.
 */
export function CategoryRow({
  title,
  items,
  loading,
  scrollPreviousLabel,
  scrollNextLabel,
}: CategoryRowProps) {
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    items.length,
  );
  const pending = loading && items.length === 0;

  if (!pending && items.length === 0) return null;

  return (
    <section className={categoryRowClass} aria-label={title}>
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
              <div key={i} className={categoryRowSkeletonClass}>
                <div className={categoryRowSkeletonIconClass} />
                <div className={categoryRowSkeletonLineClass} />
              </div>
            ))
          : items.map(({ id, name, href, Icon, caption }) => (
              <Link key={id} href={href} className={categoryRowItemClass}>
                <span aria-hidden className={categoryRowIconClass}>
                  <Icon size={26} strokeWidth={1.8} />
                </span>
                <Text size="sm" weight="semibold" align="center" numberOfLines={2}>
                  {name}
                </Text>
                {caption && (
                  <Text size="xs" color="secondary" align="center">
                    {caption}
                  </Text>
                )}
              </Link>
            ))}
      </CardScroller>
    </section>
  );
}
