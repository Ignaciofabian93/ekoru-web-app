"use client";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import clsx from "clsx";
import { PackageCheck, PackageSearch, Truck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ShippingStage } from "@/types/enums";
import { NAMESPACE } from "../i18n";
import { EmptyState } from "@/components/Feedback/EmptyState";

interface OrderItemPreview {
  name: string;
  image?: string;
  quantity: number;
}

interface MockOrder {
  id: string;
  placedOn: string;
  status: ShippingStage;
  totalAmount: number;
  currency: string;
  items: OrderItemPreview[];
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "EKO-10248",
    placedOn: "2026-05-12",
    status: "DELIVERED",
    totalAmount: 38990,
    currency: "CLP",
    items: [
      { name: "Vintage leather jacket", quantity: 1 },
      { name: "Cotton scarf", quantity: 2 },
    ],
  },
  {
    id: "EKO-10239",
    placedOn: "2026-04-30",
    status: "SHIPPED",
    totalAmount: 15490,
    currency: "CLP",
    items: [{ name: "Refurbished office lamp", quantity: 1 }],
  },
  {
    id: "EKO-10221",
    placedOn: "2026-04-08",
    status: "PREPARING",
    totalAmount: 23990,
    currency: "CLP",
    items: [{ name: "Handmade ceramic bowl set", quantity: 1 }],
  },
];

const STATUS_TONE: Record<ShippingStage, string> = {
  PREPARING: "bg-warning/10 text-warning",
  SHIPPED: "bg-info/10 text-info",
  DELIVERED: "bg-success/10 text-success",
  RETURNED: "bg-foreground-tertiary/10 text-foreground-secondary",
  CANCELED: "bg-danger/10 text-danger",
};

type FilterKey = "all" | "preparing" | "shipped" | "delivered" | "returned" | "canceled";

const FILTERS: { key: FilterKey; match?: ShippingStage }[] = [
  { key: "all" },
  { key: "preparing", match: "PREPARING" },
  { key: "shipped", match: "SHIPPED" },
  { key: "delivered", match: "DELIVERED" },
  { key: "returned", match: "RETURNED" },
  { key: "canceled", match: "CANCELED" },
];

function formatMoney(value: number, currency: string, lang: string) {
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

function formatDate(iso: string, lang: string) {
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

export function OrdersList() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const [filter, setFilter] = useState<FilterKey>("all");

  // TODO(orders): wire to backend GET_USER_ORDERS query when available.
  const orders = MOCK_ORDERS;

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    const target = FILTERS.find((f) => f.key === filter)?.match;
    return orders.filter((o) => o.status === target);
  }, [filter, orders]);

  if (orders.length === 0) {
    return (
      <EmptyState
        variant="prominent"
        icon={PackageSearch}
        title={t("orders.empty.title")}
        description={t("orders.empty.description")}
        actionLabel={t("orders.empty.action")}
        onAction={() => router.push(`/${lang}/marketplace`)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={clsx(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
              )}
            >
              {t(`orders.filter.${f.key}`)}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          variant="prominent"
          icon={PackageSearch}
          title={t("orders.empty.title")}
          description={t("orders.empty.description")}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-border-light bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <header className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <Text variant="span" size="xs" color="tertiary" weight="semibold">
                    {t("orders.card.order")} · {order.id}
                  </Text>
                  <Title level="h3" size="h6" weight="semibold">
                    {t("orders.card.items", { count: String(order.items.length) })}
                  </Title>
                  <Text variant="span" size="xs" color="tertiary">
                    {t("orders.card.placedOn")} {formatDate(order.placedOn, lang)}
                  </Text>
                </div>
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    STATUS_TONE[order.status],
                  )}
                >
                  {t(`orders.status.${order.status}`)}
                </span>
              </header>

              <ul className="flex flex-col gap-2 border-y border-border-light py-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background-secondary text-foreground-tertiary">
                      <PackageCheck size={16} color="currentColor" strokeWidth={1.8} />
                    </div>
                    <span className="flex-1 truncate">{item.name}</span>
                    <Text variant="span" size="sm" color="tertiary">
                      ×{item.quantity}
                    </Text>
                  </li>
                ))}
              </ul>

              <footer className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col">
                  <Text variant="span" size="xs" color="tertiary">
                    {t("orders.card.total")}
                  </Text>
                  <Text variant="span" weight="bold" size="lg">
                    {formatMoney(order.totalAmount, order.currency, lang)}
                  </Text>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.status === "SHIPPED" && (
                    <Button
                      text={t("orders.card.track")}
                      variant="outline"
                      size="sm"
                      leftIcon={Truck}
                    />
                  )}
                  <Button text={t("orders.card.viewDetails")} variant="ghost" size="sm" />
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
