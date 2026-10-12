"use client";
import clsx from "clsx";
import { PackageCheck } from "lucide-react";
import Image from "next/image";

import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import {
  lineImage,
  lineName,
  type BuyerOrder,
  type OrderLine,
  type OrderStage,
} from "../hooks/useMyOrders";

/**
 * Pieces shared by the buyer's order history and the seller's sales area, so an
 * order reads the same from both sides. Copy lives under `orders.*`.
 */

const STAGE_TONE: Record<OrderStage, string> = {
  PENDING_PAYMENT: "bg-warning/10 text-warning",
  PREPARING: "bg-warning/10 text-warning",
  SHIPPED: "bg-info/10 text-info",
  DELIVERED: "bg-success/10 text-success",
  RETURNED: "bg-foreground-tertiary/10 text-foreground-secondary",
  CANCELED: "bg-danger/10 text-danger",
};

export function formatMoney(value: number, currency: string, lang: string) {
  try {
    return new Intl.NumberFormat(lang, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString(lang)}`;
  }
}

export function formatDate(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function OrderStageBadge({ stage }: { stage: OrderStage }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", STAGE_TONE[stage])}>
      {t(`orders.status.${stage}`)}
    </span>
  );
}

export function OrderLines({ items }: { items: OrderLine[] }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <ul className="flex flex-col gap-2 border-y border-border-light py-3">
      {items.map((item) => {
        const image = lineImage(item);
        return (
          <li key={item.id} className="flex items-center gap-3 text-sm text-foreground">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-secondary text-foreground-tertiary">
              {image ? (
                <Image src={image} alt="" fill sizes="36px" className="object-cover" />
              ) : (
                <PackageCheck size={16} color="currentColor" strokeWidth={1.8} />
              )}
            </div>
            <span className="flex-1 truncate">
              {lineName(item) ?? t("orders.card.unavailableItem")}
            </span>
            <Text variant="span" size="sm" color="tertiary">
              ×{item.quantity}
            </Text>
          </li>
        );
      })}
    </ul>
  );
}

/** One label/value row of a details panel. */
export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 text-sm">
      <Text variant="span" size="sm" color="tertiary">
        {label}
      </Text>
      <span className="text-right text-foreground">{value}</span>
    </div>
  );
}

/** Subtotal, shipping, method and tracking: what both sides want to check. */
export function OrderBreakdown({ order, lang }: { order: BuyerOrder; lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  const tracking = order.shippingStatus?.trackingInfo;
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-background-secondary/60 p-3">
      <DetailRow
        label={t("orders.details.method")}
        value={t(`orders.method.${order.shippingMethod}`)}
      />
      {tracking && <DetailRow label={t("orders.details.tracking")} value={tracking} />}
      <DetailRow
        label={t("orders.details.subtotal")}
        value={formatMoney(order.subtotal, order.currency, lang)}
      />
      <DetailRow
        label={t("orders.details.shipping")}
        value={formatMoney(order.shippingCost, order.currency, lang)}
      />
    </div>
  );
}
