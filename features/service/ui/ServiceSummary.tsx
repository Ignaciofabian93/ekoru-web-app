"use client";
import { CalendarClock, CalendarX, Star } from "lucide-react";

import { Badge } from "@/components/Primitives/Badge";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

export function ServiceSummary({ service }: { service: ServiceDetail }) {
  const formatPrice = useFormatPrice();
  const { t } = useTranslation(NAMESPACE);

  const category =
    service.serviceCategory?.translation?.subCategory ||
    service.serviceCategory?.subCategory ||
    t("summary.noCategory");

  // Services quote four different ways, and the headline has to read correctly
  // for all of them: a fixed job shows its price, an hourly one a rate, a
  // package a floor, and a quotation has no number to show at all.
  const price = service.basePrice;
  const pricing = service.pricingType;

  let priceLabel: string;
  let pricePrefix: string | null = null;
  let priceSuffix: string | null = null;

  if (pricing === "QUOTATION" || price === null || price === undefined) {
    priceLabel =
      pricing === "QUOTATION" ? t("summary.onQuotation") : t("summary.noPrice");
    priceSuffix = pricing === "QUOTATION" ? t("summary.onQuotationHint") : null;
  } else {
    priceLabel = formatPrice(price);
    if (pricing === "HOURLY") priceSuffix = t("summary.perHour");
    if (pricing === "PACKAGE") pricePrefix = t("summary.from");
  }

  const rating = service.averageRating;
  const reviews = service.reviewCount ?? 0;

  return (
    <div className="flex flex-col gap-3">
      {service.isCurrentlyAvailable !== null && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            label={
              service.isCurrentlyAvailable
                ? t("summary.available")
                : t("summary.unavailable")
            }
            variant={service.isCurrentlyAvailable ? "descriptive" : "ghost"}
            icon={service.isCurrentlyAvailable ? CalendarClock : CalendarX}
            size="small"
          />
        </div>
      )}

      <div className="flex flex-col">
        <Text
          variant="label"
          weight="bold"
          color="tertiary"
          className="tracking-wide uppercase"
          size="sm"
        >
          {category}
        </Text>
        <Title level="h1" size="h2" className="leading-tight">
          {service.name}
        </Title>
      </div>

      <div className="flex items-center gap-1.5">
        <Star size={16} strokeWidth={2} className="fill-amber-400 text-amber-400" />
        {rating ? (
          <>
            <Text variant="span" size="sm" weight="semibold">
              {rating.toFixed(1)}
            </Text>
            <Text variant="span" size="sm" color="tertiary">
              {t("summary.reviews", { count: String(reviews) })}
            </Text>
          </>
        ) : (
          <Text variant="span" size="sm" color="tertiary">
            {t("summary.noReviews")}
          </Text>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        {pricePrefix && (
          <Text variant="span" size="base" weight="semibold" color="tertiary">
            {pricePrefix}
          </Text>
        )}
        <Text variant="p" weight="bold" size="4xl" color="primary">
          {priceLabel}
        </Text>
        {priceSuffix && (
          <Text variant="span" size="base" weight="semibold" color="tertiary">
            {priceSuffix}
          </Text>
        )}
      </div>
    </div>
  );
}
