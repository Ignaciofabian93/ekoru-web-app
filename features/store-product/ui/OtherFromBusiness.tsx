"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n/context";
import { useSellerProducts } from "../hooks/useSellerProducts";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Title/Title";
import StoreProductCard from "@/components/Card/StoreProductCard/StoreProductCard";
import { CardScroller } from "@/components/Card/CardScroller/CardScroller";

interface Props {
  lang: string;
  sellerId: string;
  excludeProductId: number | string;
}

export function OtherFromBusiness({ lang, sellerId, excludeProductId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { products, loading } = useSellerProducts({
    sellerId,
    excludeProductId,
  });
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

  if (loading) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {t("otherProducts.title")}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary h-60 w-44 shrink-0 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {t("otherProducts.title")}
        </h2>
        <p className="text-sm text-foreground-secondary italic">
          {t("otherProducts.empty")}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-2">
        <Title level="h5" size="h5" weight="semibold">
          {t("otherProducts.title")}
        </Title>
        <Link
          href={`/${lang}/seller/${sellerId}`}
          className="text-sm font-semibold text-primary underline"
        >
          {t("actions.viewAll")}
        </Link>
      </div>
      <CardScroller
        handleScroll={handleScroll}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        scrollNextAriaLabel={t("otherProducts.scrollNext")}
        scrollPreviousAriaLabel={t("otherProducts.scrollPrevious")}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start">
            <StoreProductCard product={product} lang={lang} />
          </div>
        ))}
      </CardScroller>
    </section>
  );
}
