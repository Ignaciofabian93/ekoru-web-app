"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useExchangeableProducts } from "../hooks/useExchangeableProducts";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { Layout } from "@/components/Layout/Layout";
import { SectionTitleWrapper } from "./Wrapper";
import { CardScroller } from "@/components/Card/CardScroller/CardScroller";

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
    <Layout.Section>
      <SectionTitleWrapper direction="row" align="start" justify="between">
        <div>
          <Title level="h3" size="h4" weight="semibold">
            {t("exchange.title")}
          </Title>
          <Text variant="p" size="base">
            {t("exchange.subtitle")}
          </Text>
        </div>
        <Link
          href={`/${lang}/marketplace?exchangeable=true`}
          className="text-sm font-semibold text-primary underline"
        >
          {t("exchange.seeAll")}
        </Link>
      </SectionTitleWrapper>

      <CardScroller
        handleScroll={handleScroll}
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
    </Layout.Section>
  );
}
