"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import type { Currency } from "@/constants/settings";
import { formatPrice } from "@/data/products";
import { useTranslation } from "@/i18n/context";

import type { ShippingQuote } from "../hooks/useShippingQuote";

type Props = {
  itemCount: number;
  subtotal: number;
  shipping: ShippingQuote;
  total: number;
  currency: Currency;
  taxAmount?: number;
};

export function OrderSummary({
  itemCount,
  subtotal,
  shipping,
  total,
  currency,
  taxAmount,
}: Props) {
  const { t } = useTranslation("cart");

  const shippingLabel = (() => {
    if (shipping.status === "FREE") return t("checkout.shipping.free");
    if (shipping.status === "KNOWN") return formatPrice(shipping.amount, currency);
    if (shipping.status === "LOADING") return t("checkout.shipping.calculating");
    return t("checkout.shipping.methods.carrierUnavailable");
  })();

  return (
    <section
      aria-label={t("a11y.summarySection")}
      className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-4"
    >
      <Title level="h2" size="h5" weight="semibold">
        {t("checkout.summary.title")}
      </Title>

      <Text variant="small" color="secondary">
        {t("checkout.summary.items", { count: String(itemCount) })}
      </Text>

      <dl className="flex flex-col gap-2 border-t border-border-light pt-3">
        <Row label={t("checkout.summary.subtotal")} value={formatPrice(subtotal, currency)} />
        <Row label={t("checkout.summary.shipping")} value={shippingLabel} />
        {typeof taxAmount === "number" && taxAmount > 0 ? (
          <Row label={t("checkout.summary.tax")} value={formatPrice(taxAmount, currency)} />
        ) : null}
      </dl>

      <div className="flex items-baseline justify-between border-t border-border-light pt-3">
        <Text variant="span" weight="semibold">
          {t("checkout.summary.total")}
        </Text>
        <Text variant="span" weight="bold" size="lg" color="primary">
          {formatPrice(total, currency)}
        </Text>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="font-sans text-sm text-foreground-secondary">{label}</dt>
      <dd className="font-sans text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
