"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import { useStoreProductsHomeData } from "../hooks/useStoreProducts";
import { StoreProductCard } from "@/components/Cards";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { CardScroller } from "@/components/Cards/CardScroller";

export function StoreProductsHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { storeProducts } = useStoreProductsHomeData();

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
  }, [updateScrollState, storeProducts.length]);

  const handleScroll = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <Section ariaLabel={t("storeProducts.title")}>
      <SectionHeader
        align="start"
        title={t("storeProducts.title")}
        subtitle={t("storeProducts.subtitle")}
        action={
          <Link
            href={`/${lang}/stores`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("storeProducts.seeAll")}
          </Link>
        }
      />
      {storeProducts && storeProducts.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("storeProducts.scrollPrevious")}
          scrollNextAriaLabel={t("storeProducts.scrollNext")}
        >
          {/* The rail is a flex row, so each item needs an explicit width —
              otherwise the content-height card shrinks to fit. */}
          {storeProducts.map((sp, i) => (
            <div key={sp.id} className="w-44 shrink-0 snap-start">
              <StoreProductCard product={sp} lang={lang} priority={i < 2} />
            </div>
          ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("storeProducts.noProducts")}
        </Text>
      )}
    </Section>
  );
}
