"use client";
import { CalendarClock, CalendarX, Star } from "lucide-react";

import { Badge } from "@/components/Primitives/Badge";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

/**
 * Identity only: what the service is, not what it costs. The price moved into
 * the panel below, where it sits with the actions it belongs to.
 */
export function ServiceSummary({ service }: { service: ServiceDetail }) {
  const { t } = useTranslation(NAMESPACE);

  const category =
    service.serviceCategory?.translation?.subCategory ||
    service.serviceCategory?.subCategory ||
    t("summary.noCategory");

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
    </div>
  );
}
