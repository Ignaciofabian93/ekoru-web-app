"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import { ServiceProviderCard } from "@/components/Cards";
import { useServicesHomeData } from "../hooks/useServices";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { CardScroller } from "@/components/Cards/CardScroller";

export function ServicesHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { sellers } = useServicesHomeData({ language: lang });

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
    <Section ariaLabel={t("services.title")}>
      <SectionHeader
        align="start"
        title={t("services.title")}
        subtitle={t("services.subtitle")}
        action={
          <Link
            href={`/${lang}/services`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("services.seeAll")}
          </Link>
        }
      />
      {sellers && sellers.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          scrollRef={scrollRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("services.scrollPrevious")}
          scrollNextAriaLabel={t("services.scrollNext")}
        >
          {sellers.map((seller) => (
            <ServiceProviderCard key={seller.id} provider={seller} lang={lang} />
          ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("services.noServices")}
        </Text>
      )}
    </Section>
  );
}
