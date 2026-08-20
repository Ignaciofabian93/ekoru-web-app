"use client";
import clsx from "clsx";

import { Text } from "@/components/Primitives/Text";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";
import { ServiceActions } from "./ServiceActions";

/**
 * What the service costs and how to get it, on their own surface — the panel
 * the marketplace listing and the store product both use. Identity stays above
 * in the summary.
 */
export function ServicePricePanel({
  service,
  lang,
}: {
  service: ServiceDetail;
  lang: string;
}) {
  const formatPrice = useFormatPrice();
  const { t } = useTranslation(NAMESPACE);

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

  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        "rounded-2xl p-4 bg-white shadow-md shadow-slate-800/10 border border-slate-200",
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        {pricePrefix && (
          <Text variant="span" size="base" weight="semibold" color="tertiary">
            {pricePrefix}
          </Text>
        )}
        <Text variant="p" weight="bold" size="4xl" leading="tight" color="primary">
          {priceLabel}
        </Text>
        {priceSuffix && (
          <Text variant="span" size="base" weight="semibold" color="tertiary">
            {priceSuffix}
          </Text>
        )}
      </div>

      <ServiceActions lang={lang} service={service} />
    </div>
  );
}
