"use client";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useStoresHomeData } from "../hooks/useStores";
import type { SupportedLanguage } from "@/constants/settings";
import StoreCard from "@/components/Card/StoreCard/StoreCard";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";

const SCROLL_STEP = 336;

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
    <Fragment>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
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
        </div>
        {sellers && sellers.length > 0 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll(-SCROLL_STEP)}
              aria-label={t("stores.scrollPrevious")}
              disabled={!canScrollLeft}
              className={clsx(
                "hidden size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:border-primary hover:text-primary md:flex",
                !canScrollLeft && "pointer-events-none opacity-40",
              )}
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>

            <div
              ref={scrollRef}
              className="scrollbar-none flex min-w-0 flex-1 gap-2 overflow-x-auto py-2"
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
            </div>

            <button
              type="button"
              onClick={() => handleScroll(SCROLL_STEP)}
              aria-label={t("stores.scrollNext")}
              disabled={!canScrollRight}
              className={clsx(
                "hidden size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:border-primary hover:text-primary md:flex",
                !canScrollRight && "pointer-events-none opacity-40",
              )}
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <Text variant="p" size="sm">
            {t("stores.noStores")}
          </Text>
        )}
      </div>
    </Fragment>
  );
}
