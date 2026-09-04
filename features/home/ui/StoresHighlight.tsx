"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useStoresHomeData } from "../hooks/useStores";
import type { SupportedLanguage } from "@/constants/settings";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { CardScroller } from "@/components/Cards/CardScroller";
import { StoresCard } from "@/components/Cards";

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
    <Section ariaLabel={t("stores.title")}>
      <SectionHeader
        align="start"
        title={t("stores.title")}
        subtitle={t("stores.subtitle")}
        action={
          <Link
            href={`/${lang}/stores`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("stores.seeAll")}
          </Link>
        }
      />
      {sellers && sellers.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("stores.scrollPrevious")}
          scrollNextAriaLabel={t("stores.scrollNext")}
        >
          {sellers.map((seller) => (
            <div key={seller.id} className="shrink-0 snap-start">
              <StoresCard store={seller} lang={lang} />
            </div>
          ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("stores.noStores")}
        </Text>
      )}
    </Section>
  );
}
