"use client";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import type { Currency } from "@/constants/settings";
import { sectionCardClass } from "@/design/section-card";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";

import type { ShippingQuote } from "../hooks/useShippingQuote";

type Props = {
  itemCount: number;
  subtotal: number;
  /**
   * Left out on the cart, where no method has been chosen yet: the row then
   * says shipping is picked at checkout rather than guessing a price.
   */
  shipping?: ShippingQuote;
  total: number;
  currency: Currency;
  taxAmount?: number;
  /**
   * Accessible name of the panel. The cart shows one summary per seller, and
   * landmarks that share a name can't be told apart, so it names the seller.
   */
  label?: string;
  /** The action the totals lead to — the cart's pay button. */
  children?: ReactNode;
};

/**
 * One seller's order in numbers. Shared by the cart (one per seller, with its
 * pay button) and checkout (beside the steps), so both read the same.
 */
export function OrderSummary({
  itemCount,
  subtotal,
  shipping,
  total,
  currency,
  taxAmount,
  label,
  children,
}: Props) {
  const { t } = useTranslation("cart");
  const formatPrice = useFormatPrice();

  const shippingLabel = (() => {
    if (!shipping) return t("checkout.summary.shippingAtCheckout");
    if (shipping.status === "FREE") return t("checkout.shipping.free");
    if (shipping.status === "KNOWN") return formatPrice(shipping.amount, currency);
    if (shipping.status === "LOADING") return t("checkout.shipping.calculating");
    return t("checkout.shipping.methods.carrierUnavailable");
  })();

  return (
    <section
      aria-label={label ?? t("a11y.summarySection")}
      className={clsx(sectionCardClass, "flex flex-col gap-4")}
    >
      <div className="flex flex-col gap-0.5">
        <Title level="h2" size="h5" weight="semibold">
          {t("checkout.summary.title")}
        </Title>
        <Text variant="small" color="secondary">
          {itemCount === 1
            ? t("checkout.summary.item")
            : t("checkout.summary.items", { count: String(itemCount) })}
        </Text>
      </div>

      <dl className="flex flex-col gap-2 border-t border-border-light pt-4">
        <Row
          label={t("checkout.summary.subtotal")}
          value={formatPrice(subtotal, currency)}
        />
        <Row label={t("checkout.summary.shipping")} value={shippingLabel} />
        {typeof taxAmount === "number" && taxAmount > 0 ? (
          <Row
            label={t("checkout.summary.tax")}
            value={formatPrice(taxAmount, currency)}
          />
        ) : null}
      </dl>

      <div className="flex items-baseline justify-between gap-3 border-t border-border-light pt-4">
        <Text variant="span" weight="semibold">
          {t("checkout.summary.total")}
        </Text>
        <Text
          variant="span"
          weight="bold"
          size="2xl"
          leading="tight"
          color="primary"
          className="tabular-nums"
        >
          {formatPrice(total, currency)}
        </Text>
      </div>

      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="font-sans text-sm text-foreground-secondary">{label}</dt>
      <dd className="text-right font-sans text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}
