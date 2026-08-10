"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { CardScroller, ServiceCard, type ServiceCardService } from "@/components/Cards";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { getBusinessProfile } from "@/utils/sellerInformation";

import { useSellerServices } from "../hooks/useSellerServices";
import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

function toCardService(service: ServiceDetail): ServiceCardService {
  // Services are published by businesses, but `Seller.profile` is a union —
  // narrow it before reading the business-only name and logo.
  const profile = service.seller ? getBusinessProfile(service.seller) : null;

  return {
    id: service.id,
    name: service.name,
    description: service.description,
    image: service.images?.[0],
    category:
      service.serviceCategory?.translation?.subCategory ??
      service.serviceCategory?.subCategory,
    price: service.basePrice,
    duration: service.duration,
    averageRating: service.averageRating,
    reviewsNumber: service.reviewCount,
    isLiked: service.isLiked ?? undefined,
    providerName: profile?.businessName,
    providerLogo: profile?.logo,
  };
}

interface Props {
  lang: string;
  sellerId: string;
  excludeServiceId: string | number;
}

export function OtherFromProvider({ lang, sellerId, excludeServiceId }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { services, loading } = useSellerServices({ sellerId, excludeServiceId });
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
  }, [updateScrollState, services.length]);

  const handleScroll = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {t("otherServices.title")}
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

  if (services.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {t("otherServices.title")}
        </h2>
        <p className="text-sm text-foreground-secondary italic">
          {t("otherServices.empty")}
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-2">
        <Title level="h5" size="h5" weight="semibold">
          {t("otherServices.title")}
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
        scrollRef={scrollRef}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        scrollNextAriaLabel={t("otherServices.scrollNext")}
        scrollPreviousAriaLabel={t("otherServices.scrollPrevious")}
      >
        {services.map((service) => (
          <div key={service.id} className="snap-start">
            <ServiceCard service={toCardService(service)} lang={lang} />
          </div>
        ))}
      </CardScroller>
    </section>
  );
}
