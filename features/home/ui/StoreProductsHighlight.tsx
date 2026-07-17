"use client";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import { useStoreProductsHomeData } from "../hooks/useStoreProducts";
import StoreProductCard from "@/components/Card/StoreProductCard/StoreProductCard";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";

const SCROLL_STEP = 336;

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
    <Fragment>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
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
        </div>
        {storeProducts && storeProducts.length > 0 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll(-SCROLL_STEP)}
              aria-label={t("storeProducts.scrollPrevious")}
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
              className="scrollbar-none -mx-1 flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2"
            >
              {storeProducts.map((sp) => (
                <div key={sp.id} className="w-44 shrink-0 snap-start">
                  <StoreProductCard product={sp} lang={lang} />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleScroll(SCROLL_STEP)}
              aria-label={t("storeProducts.scrollNext")}
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
            {t("storeProducts.noProducts")}
          </Text>
        )}
      </div>
    </Fragment>
  );
}
