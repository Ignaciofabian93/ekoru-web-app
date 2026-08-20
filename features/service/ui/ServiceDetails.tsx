"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { DataList } from "@/components/Patterns";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  es: "es-CL",
  en: "en-US",
  fr: "fr-FR",
};

function formatDate(value: string | undefined, lang: SupportedLanguage) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export function ServiceDetails({
  service,
  lang,
}: {
  service: ServiceDetail;
  lang: SupportedLanguage;
}) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();

  // `priceRange` is free text on the publish form but a numeric pair elsewhere
  // in the schema, so both shapes are narrowed here rather than trusted.
  function priceRangeLabel(): string {
    const range = service.priceRange;
    if (!range) return "";
    if (typeof range === "string") return range;
    const [min, max] = range;
    if (typeof min !== "number") return "";
    return typeof max === "number"
      ? `${formatPrice(min)} – ${formatPrice(max)}`
      : formatPrice(min);
  }

  const rows = [
    {
      label: t("details.category"),
      value:
        service.serviceCategory?.translation?.subCategory ??
        service.serviceCategory?.subCategory,
    },
    {
      label: t("details.pricingType"),
      value: service.pricingType ? t(`pricingTypes.${service.pricingType}`) : "",
    },
    { label: t("details.priceRange"), value: priceRangeLabel() },
    {
      label: t("details.duration"),
      value: service.duration
        ? t("details.durationValue", { minutes: service.duration })
        : "",
    },
    {
      label: t("details.remote"),
      value:
        service.isRemoteService === null
          ? ""
          : service.isRemoteService
            ? t("details.yes")
            : t("details.no"),
    },
    {
      label: t("details.radius"),
      value: service.serviceRadius
        ? t("details.radiusValue", { km: String(service.serviceRadius) })
        : "",
    },
    {
      label: t("details.locations"),
      value: service.serviceLocations?.length ? service.serviceLocations.join(", ") : "",
    },
    {
      label: t("details.advanceBooking"),
      value: service.advanceBookingDays
        ? t("details.advanceBookingValue", { days: String(service.advanceBookingDays) })
        : "",
    },
    {
      label: t("details.publishedOn"),
      value: formatDate(service.createdAt, lang),
    },
  ].filter((r) => r.value);

  if (rows.length === 0) return null;

  return (
    <div className="px-2">
      <Title level="h5" size="h5" weight="semibold" className="mb-3">
        {t("details.title")}
      </Title>
      <DataList rows={rows} />

      {service.tags && service.tags.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <Text variant="span" size="sm" weight="bold">
            {t("tags.title")}
          </Text>
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-foreground-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
