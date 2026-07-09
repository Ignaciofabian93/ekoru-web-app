"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useStoresHomeData } from "../hooks/useStores";
import type { SupportedLanguage } from "@/constants/settings";
import StoreCard from "@/components/Card/StoreCard/StoreCard";

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
    <div className="my-10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("stores.title")}</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            {t("stores.subtitle")}
          </p>
        </div>
        <Link
          href={`/${lang}/stores`}
          className="text-sm font-semibold text-primary hover:underline"
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
            className="scrollbar-none flex min-w-0 flex-1 gap-4 overflow-x-auto py-2"
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
        <p className="text-sm text-foreground-secondary">{t("stores.noStores")}</p>
      )}
    </div>
  );
}
