"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { NAMESPACE } from "../i18n";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { CardScroller } from "@/components/Cards/CardScroller";
import { MarketplaceCard } from "@/components/Cards";
import { ArrowUpRight, PackageSearch } from "lucide-react";
import { LinkButton } from "@/components/Primitives";

interface Props {
  lang: string;
  sellerId: string;
  excludeProductId: number | string;
}

export function OtherFromSeller({ lang, sellerId, excludeProductId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { products, loading } = useSellerProducts({
    sellerId,
    excludeProductId,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, products.length]);

  const handleScroll = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const isEmpty = !loading && products.length === 0;

  return (
    <Section ariaLabel={t("otherProducts.title")}>
      <SectionHeader
        align="start"
        title={t("otherProducts.title")}
        action={
          isEmpty ? undefined : (
            <LinkButton
              href={`/${lang}/seller/${sellerId}`}
              label={t("actions.viewAll")}
              icon={ArrowUpRight}
              iconPosition="right"
              variant="ghost"
            />
          )
        }
      />

      {isEmpty ? (
        <EmptyState
          variant="compact"
          icon={PackageSearch}
          title={t("otherProducts.empty")}
        />
      ) : (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("otherProducts.scrollPrevious")}
          scrollNextAriaLabel={t("otherProducts.scrollNext")}
        >
          {loading && products.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 w-44 shrink-0 snap-start animate-pulse rounded-lg bg-background-secondary"
                />
              ))
            : products.map((product, i) => (
                <div key={product.id} className="w-44 shrink-0 snap-start">
                  <MarketplaceCard priority={i < 4} product={product} lang={lang} />
                </div>
              ))}
        </CardScroller>
      )}
    </Section>
  );
}
