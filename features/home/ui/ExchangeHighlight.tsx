"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useExchangeableProducts } from "../hooks/useExchangeableProducts";
import { NAMESPACE } from "../i18n";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { CardScroller } from "@/components/Cards/CardScroller";

export function ExchangeHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { products, loading } = useExchangeableProducts({ pageSize: 8 });

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

  // Hide the section entirely once we know there's nothing to exchange, so the
  // home screen doesn't render an empty heading.
  if (!loading && products.length === 0) return null;

  return (
    <Section ariaLabel={t("exchange.title")}>
      <SectionHeader
        align="start"
        title={t("exchange.title")}
        subtitle={t("exchange.subtitle")}
        action={
          <Link
            href={`/${lang}/marketplace?exchangeable=true`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("exchange.seeAll")}
          </Link>
        }
      />

      <CardScroller
        handleScroll={handleScroll}
        scrollRef={scrollRef}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        scrollPreviousAriaLabel={t("exchange.scrollPrevious")}
        scrollNextAriaLabel={t("exchange.scrollNext")}
      >
        {loading && products.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 w-44 shrink-0 snap-start animate-pulse rounded-lg bg-background-secondary"
              />
            ))
          : products.map((product) => (
              <div key={product.id} className="snap-start">
                <MarketplaceCard product={product} lang={lang} />
              </div>
            ))}
      </CardScroller>
    </Section>
  );
}
