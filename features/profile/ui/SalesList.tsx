"use client";
import clsx from "clsx";
import { ChevronDown, ChevronUp, PackageCheck, Receipt, Truck } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { EmptyState } from "@/components/Feedback/EmptyState";
import { ConfirmDialog, Modal } from "@/components/Overlays";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useDisplayName } from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import type { Seller } from "@/types/user";

import { NAMESPACE } from "../i18n";
import { useAddressNames } from "../hooks/useAddressNames";
import { orderStage } from "../hooks/useMyOrders";
import {
  SALES_FILTERS,
  useMySales,
  type SaleOrder,
  type SalesFilter,
} from "../hooks/useMySales";
import {
  DetailRow,
  formatDate,
  formatMoney,
  OrderBreakdown,
  OrderLines,
  OrderStageBadge,
} from "./OrderParts";

const FILTER_KEYS = Object.keys(SALES_FILTERS) as SalesFilter[];

/** Store purchases settle in CLP; the header totals are shown in it. */
const STATS_CURRENCY = "CLP";

const TRACKING_MAX = 200;

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border-light bg-surface p-4">
      <Text variant="span" size="xs" color="tertiary" weight="semibold">
        {label}
      </Text>
      <Text variant="span" size="lg" weight="bold">
        {value}
      </Text>
    </div>
  );
}

/** Who bought and where it goes. Loads location names only once opened. */
function SaleDetails({ order, lang }: { order: SaleOrder; lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  const buyerName = useDisplayName(order.buyer as Seller | null | undefined);
  const address = order.shippingAddress;
  const names = useAddressNames(address, true);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5 rounded-xl bg-background-secondary/60 p-3">
        <DetailRow label={t("sales.details.buyer")} value={buyerName || "—"} />
        {order.buyer?.email && (
          <DetailRow label={t("sales.details.email")} value={order.buyer.email} />
        )}
        {order.buyer?.phone && (
          <DetailRow label={t("sales.details.phone")} value={order.buyer.phone} />
        )}
      </div>

      {address && (
        <div className="flex flex-col gap-1.5 rounded-xl bg-background-secondary/60 p-3">
          <DetailRow label={t("sales.details.recipient")} value={address.recipientName} />
          <DetailRow label={t("sales.details.phone")} value={address.phone} />
          <DetailRow
            label={t("sales.details.address")}
            value={[address.street, names?.county, names?.city, names?.region]
              .filter(Boolean)
              .join(", ")}
          />
          {address.reference && (
            <DetailRow label={t("sales.details.reference")} value={address.reference} />
          )}
          {address.zipCode && (
            <DetailRow label={t("sales.details.zipCode")} value={address.zipCode} />
          )}
        </div>
      )}

      <OrderBreakdown order={order} lang={lang} />
    </div>
  );
}

export function SalesList() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const {
    orders,
    pageInfo,
    page,
    filter,
    setFilter,
    goToPage,
    initialLoading,
    loading,
    error,
    refetch,
    stats,
    moveTo,
    updating,
  } = useMySales();

  const [openId, setOpenId] = useState<string | null>(null);
  const [shipping, setShipping] = useState<SaleOrder | null>(null);
  const [tracking, setTracking] = useState("");
  const [delivering, setDelivering] = useState<SaleOrder | null>(null);

  const startShipping = (order: SaleOrder) => {
    setTracking("");
    setShipping(order);
  };

  const confirmShipped = async () => {
    if (!shipping) return;
    if (await moveTo(shipping.id, "SHIPPED", tracking)) setShipping(null);
  };

  const confirmDelivered = async () => {
    if (!delivering) return;
    if (await moveTo(delivering.id, "DELIVERED")) setDelivering(null);
  };

  const money = (value: number) => formatMoney(value, STATS_CURRENCY, lang);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Title level="h2" size="h4" weight="semibold">
          {t("sales.title")}
        </Title>
        <Text variant="p" size="sm" color="tertiary">
          {t("sales.subtitle")}
        </Text>
      </div>

      {/* WEB-14: this month's totals. Hidden until loaded rather than showing zeros. */}
      {stats && (
        <section
          aria-label={t("sales.stats.label")}
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          <StatTile label={t("sales.stats.revenue")} value={money(stats.revenue)} />
          <StatTile label={t("sales.stats.paidOrders")} value={String(stats.paidCount)} />
          <StatTile label={t("sales.stats.average")} value={money(stats.average)} />
          <StatTile label={t("sales.stats.toShip")} value={String(stats.toShip)} />
        </section>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t("sales.filter.label")}>
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={clsx(
              "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === key
                ? "bg-primary text-on-primary"
                : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
            )}
          >
            {t(`sales.filter.${key}`)}
          </button>
        ))}
      </div>

      {initialLoading ? (
        <div className="flex flex-col gap-4" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border-light bg-background-secondary"
            />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          variant="prominent"
          icon={Receipt}
          title={t("sales.error.title")}
          description={t("sales.error.description")}
          actionLabel={t("orders.error.action")}
          onAction={() => void refetch()}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          variant="prominent"
          icon={Receipt}
          title={t(filter === "all" ? "sales.empty.title" : "sales.empty.filteredTitle")}
          description={t("sales.empty.description")}
        />
      ) : (
        <div className={clsx("flex flex-col gap-4", loading && "opacity-60")}>
          {orders.map((order) => {
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
                      {t("sales.card.receivedOn")} {formatDate(order.createdAt, lang)} ·{" "}
                      {t(`orders.method.${order.shippingMethod}`)}
                    </Text>
                  </div>
                  <OrderStageBadge stage={stage} />
                </header>

                <OrderLines items={items} />

                {open && <SaleDetails order={order} lang={lang} />}

                <footer className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <Text variant="span" size="xs" color="tertiary">
                      {t("orders.card.total")}
                    </Text>
                    <Text variant="span" weight="bold" size="lg">
                      {formatMoney(order.total, order.currency, lang)}
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* The moves the backend allows a paid order (shipping-rules.ts). */}
                    {stage === "PREPARING" && (
                      <Button
                        text={t("sales.actions.ship")}
                        size="sm"
                        leftIcon={Truck}
                        onClick={() => startShipping(order)}
                      />
                    )}
                    {(stage === "PREPARING" || stage === "SHIPPED") && (
                      <Button
                        text={t("sales.actions.deliver")}
                        variant="outline"
                        size="sm"
                        leftIcon={PackageCheck}
                        onClick={() => setDelivering(order)}
                      />
                    )}
                    <Button
                      text={t(open ? "orders.card.hideDetails" : "orders.card.viewDetails")}
                      variant="ghost"
                      size="sm"
                      rightIcon={open ? ChevronUp : ChevronDown}
                      ariaPressed={open}
                      onClick={() => setOpenId(open ? null : order.id)}
                    />
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}

      {pageInfo && pageInfo.totalPages > 1 && (
        <nav className="flex items-center justify-between gap-3" aria-label={t("sales.pagination")}>
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

      <Modal
        isOpen={shipping !== null}
        onClose={() => setShipping(null)}
        title={t("sales.ship.title")}
        closeLabel={t("sales.ship.cancel")}
        size="sm"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void confirmShipped();
          }}
        >
          <Text variant="p" size="sm" color="tertiary">
            {t("sales.ship.description")}
          </Text>
          <Input
            label={t("sales.ship.trackingLabel")}
            placeholder={t("sales.ship.trackingPlaceholder")}
            value={tracking}
            maxLength={TRACKING_MAX}
            onChangeText={setTracking}
          />
          <div className="flex justify-end gap-2">
            <Button
              text={t("sales.ship.cancel")}
              variant="ghost"
              onClick={() => setShipping(null)}
            />
            <Button
              type="submit"
              text={t("sales.ship.confirm")}
              leftIcon={Truck}
              loading={updating}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={delivering !== null}
        onClose={() => setDelivering(null)}
        onConfirm={() => void confirmDelivered()}
        title={t("sales.deliver.title")}
        description={t("sales.deliver.description")}
        confirmLabel={t("sales.deliver.confirm")}
        cancelLabel={t("sales.ship.cancel")}
        loading={updating}
        tone="primary"
        icon={PackageCheck}
      />
    </div>
  );
}
