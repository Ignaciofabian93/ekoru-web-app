"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import ServiceProviderCard from "@/components/Card/ServiceProviderCard/ServiceProviderCard";
import { useServicesHomeData } from "../hooks/useServices";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { Layout } from "@/components/Layout/Layout";
import { SectionTitleWrapper } from "./Wrapper";
import { CardScroller } from "@/components/Card/CardScroller/CardScroller";

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
    <Layout.Section>
      <SectionTitleWrapper direction="row" align="start" justify="between">
        <div>
          <Title level="h3" size="h4" weight="semibold">
            {t("services.title")}
          </Title>
          <Text variant="p" size="base">
            {t("services.subtitle")}
          </Text>
        </div>
        <Link
          href={`/${lang}/services`}
          className="text-sm font-semibold text-primary underline"
        >
          {t("services.seeAll")}
        </Link>
      </SectionTitleWrapper>
      {sellers && sellers.length > 0 ? (
        <CardScroller
          handleScroll={handleScroll}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollPreviousAriaLabel={t("services.scrollPrevious")}
          scrollNextAriaLabel={t("services.scrollNext")}
        >
          {sellers.map((seller) => (
            <ServiceProviderCard key={seller.id} {...seller} />
          ))}
        </CardScroller>
      ) : (
        <Text variant="p" size="sm">
          {t("services.noServices")}
        </Text>
      )}
    </Layout.Section>
  );
}
