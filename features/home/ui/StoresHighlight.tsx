"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useStoresHomeData } from "../hooks/useStores";
import type { SupportedLanguage } from "@/constants/settings";
import StoreCard from "@/components/Card/StoreCard/StoreCard";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { Layout } from "@/components/Layout/Layout";
import { SectionTitleWrapper } from "./Wrapper";
import { CardScroller } from "@/components/Card/CardScroller/CardScroller";

export function StoresHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { sellers } = useStoresHomeData({ language: lang });

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
  }, [updateScrollState, sellers.length]);

  const handleScroll = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <Layout.Section gap={3}>
      <SectionTitleWrapper direction="row" align="start" justify="between">
        <div>
          <Title level="h3" size="h4" weight="semibold">
            {t("stores.title")}
          </Title>
          <Text variant="p" size="base">
            {t("stores.subtitle")}
          </Text>
        </div>
        <Link
          href={`/${lang}/stores`}
          className="text-sm font-semibold text-primary underline"
        >
          {t("stores.seeAll")}
        </Link>
      </SectionTitleWrapper>
      {sellers && sellers.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("stores.scrollPrevious")}
          scrollNextAriaLabel={t("stores.scrollNext")}
        >
          {sellers.map((seller) => (
            <StoreCard
              key={seller.id}
              seller={seller}
              ctaText={t("stores.seeStore")}
              verifiedLabel={t("stores.verified")}
              lang={lang}
            />
          ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("stores.noStores")}
        </Text>
      )}
    </Layout.Section>
  );
}
