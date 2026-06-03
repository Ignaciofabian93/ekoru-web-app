"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAMESPACE } from "../i18n";
import type { ServiceCatalogItem } from "../types";

interface Props {
  lang: string;
  categories: ServiceCatalogItem[];
  activeSlug?: string;
  /** Adds an "All" pill that points back to the services root. */
  showAll?: boolean;
  loading?: boolean;
}

const SCROLL_STEP = 240;

export function ServiceCategoryScroll({
  lang,
  categories,
  activeSlug,
  showAll = true,
  loading,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
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
  }, [updateScrollState, categories.length, showAll]);

  const handleScroll = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (loading && categories.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <Title level="h2" size="h5">
          {t("sections.categories")}
        </Title>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-background-secondary"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <Title level="h2" size="h5">
        {t("sections.categories")}
      </Title>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleScroll(-SCROLL_STEP)}
          aria-label={t("scroll.previous")}
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
          className="scrollbar-none flex min-w-0 flex-1 items-center gap-2 overflow-x-auto"
        >
          {showAll && (
            <Link
              href={`/${lang}/services`}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !activeSlug
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {t("sections.allCategories")}
            </Link>
          )}
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug;
            return (
              <Link
                key={cat.id}
                href={`/${lang}/services/${cat.slug}`}
                className={clsx(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary",
                )}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => handleScroll(SCROLL_STEP)}
          aria-label={t("scroll.next")}
          disabled={!canScrollRight}
          className={clsx(
            "hidden size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:border-primary hover:text-primary md:flex",
            !canScrollRight && "pointer-events-none opacity-40",
          )}
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
