"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import { useStoreProductsHomeData } from "../hooks/useStoreProducts";
import StoreProductCard from "@/components/Card/StoreProductCard/StoreProductCard";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { Layout } from "@/components/Layout/Layout";
import { SectionTitleWrapper } from "./Wrapper";
import { CardScroller } from "@/components/Card/CardScroller/CardScroller";

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
    <Layout.Section>
      <SectionTitleWrapper direction="row" align="start" justify="between">
        <div>
          <Title level="h3" size="h4" weight="semibold">
            {t("storeProducts.title")}
          </Title>
          <Text variant="p" size="base">
            {t("storeProducts.subtitle")}
          </Text>
        </div>
        <Link
          href={`/${lang}/stores`}
          className="text-sm font-semibold text-primary underline"
        >
          {t("storeProducts.seeAll")}
        </Link>
      </SectionTitleWrapper>
      {storeProducts && storeProducts.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("storeProducts.scrollPrevious")}
          scrollNextAriaLabel={t("storeProducts.scrollNext")}
        >
          {storeProducts.map((sp) => (
            <div key={sp.id} className="snap-start">
              <StoreProductCard product={sp} lang={lang} />
            </div>
          ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("storeProducts.noProducts")}
        </Text>
      )}
    </Layout.Section>
  );
}
