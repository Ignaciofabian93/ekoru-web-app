"use client";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import clsx from "clsx";
import { ChevronDown, ChevronUp, PackageSearch } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { NAMESPACE } from "../i18n";
import { EmptyState } from "@/components/Feedback/EmptyState";
import { orderStage, useMyOrders, type OrderStage } from "../hooks/useMyOrders";
import {
  formatDate,
  formatMoney,
  OrderBreakdown,
  OrderLines,
  OrderStageBadge,
} from "./OrderParts";

type FilterKey =
  | "all"
  | "pending"
  | "preparing"
  | "shipped"
  | "delivered"
  | "returned"
  | "canceled";

const FILTERS: { key: FilterKey; match?: OrderStage }[] = [
  { key: "all" },
  { key: "pending", match: "PENDING_PAYMENT" },
  { key: "preparing", match: "PREPARING" },
  { key: "shipped", match: "SHIPPED" },
  { key: "delivered", match: "DELIVERED" },
  { key: "returned", match: "RETURNED" },
  { key: "canceled", match: "CANCELED" },
];

export function OrdersList() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const { orders, pageInfo, page, initialLoading, loading, error, refetch, goToPage } =
    useMyOrders();

  // Filtering is client-side over the current page: the backend paginates but
  // does not filter by stage, so a filter narrows what this page shows rather
  // than querying the whole history.
  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    const target = FILTERS.find((f) => f.key === filter)?.match;
    return orders.filter((o) => orderStage(o) === target);
  }, [filter, orders]);

  if (initialLoading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-border-light bg-background-secondary"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="prominent"
        icon={PackageSearch}
        title={t("orders.error.title")}
        description={t("orders.error.description")}
        actionLabel={t("orders.error.action")}
        onAction={() => void refetch()}
      />
    );
  }

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
        <div className={clsx("flex flex-col gap-4", loading && "opacity-60")}>
          {filtered.map((order) => {
            const stage = orderStage(order);
            const items = order.orderItems ?? [];
            const open = openId === order.id;
            return (
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
                      {t("orders.card.items", { count: String(items.length) })}
                    </Title>
                    <Text variant="span" size="xs" color="tertiary">
                      {t("orders.card.placedOn")} {formatDate(order.createdAt, lang)}
                    </Text>
                  </div>
                  <OrderStageBadge stage={stage} />
                </header>

                <OrderLines items={items} />

                {/* The shipped stage is where the buyer looks for the tracking
                    note, so it shows without opening the details. */}
                {stage === "SHIPPED" && order.shippingStatus?.trackingInfo && (
                  <Text variant="p" size="sm">
                    {t("orders.details.tracking")}: {order.shippingStatus.trackingInfo}
                  </Text>
                )}

                {open && <OrderBreakdown order={order} lang={lang} />}

                <footer className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <Text variant="span" size="xs" color="tertiary">
                      {t("orders.card.total")}
                    </Text>
                    <Text variant="span" weight="bold" size="lg">
                      {formatMoney(order.total, order.currency, lang)}
                    </Text>
                  </div>
                  <Button
                    text={t(open ? "orders.card.hideDetails" : "orders.card.viewDetails")}
                    variant="ghost"
                    size="sm"
                    rightIcon={open ? ChevronUp : ChevronDown}
                    ariaPressed={open}
                    onClick={() => setOpenId(open ? null : order.id)}
                  />
                </footer>
              </article>
            );
          })}
        </div>
      )}

      {pageInfo && pageInfo.totalPages > 1 && (
        <nav className="flex items-center justify-between gap-3" aria-label={t("orders.pagination.label")}>
          <Button
            text={t("orders.pagination.previous")}
            variant="outline"
            size="sm"
            disabled={!pageInfo.hasPreviousPage || loading}
            onClick={() => goToPage(page - 1)}
          />
          <Text variant="span" size="sm" color="tertiary">
            {t("orders.pagination.position", {
              current: String(pageInfo.currentPage),
              total: String(pageInfo.totalPages),
            })}
          </Text>
          <Button
            text={t("orders.pagination.next")}
            variant="outline"
            size="sm"
            disabled={!pageInfo.hasNextPage || loading}
            onClick={() => goToPage(page + 1)}
          />
        </nav>
      )}
    </div>
  );
}
