"use client";
import clsx from "clsx";
import { Inbox, Send } from "lucide-react";
import { useState } from "react";

import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { DealCard } from "@/features/deals/ui/DealCard";
import { useDeals } from "@/features/deals/hooks/useDeals";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

/** Which side of an exchange the viewer is on. */
export type ExchangeDirection = "received" | "sent";

const TABS: { key: ExchangeDirection; icon: typeof Inbox }[] = [
  { key: "received", icon: Inbox },
  { key: "sent", icon: Send },
];

/**
 * The exchange half of the P2P deal inbox, scoped to `/profile/exchanges`.
 * "Received" are proposals on the viewer's own listings (they are the seller
 * side of the deal); "sent" are the ones they opened. Cash sales live on
 * `/deals` — same data, same cards, both sides.
 */
export function ExchangeInbox() {
  const { t } = useTranslation(NAMESPACE);
  const { buyerDeals, sellerDeals, loading } = useDeals();
  const [tab, setTab] = useState<ExchangeDirection>("received");

  const received = sellerDeals.filter((d) => d.type === "EXCHANGE");
  const sent = buyerDeals.filter((d) => d.type === "EXCHANGE");
  const items = tab === "received" ? received : sent;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Title level="h1" size="h3" weight="semibold">
          {t("exchanges.title")}
        </Title>
        <Text size="sm" color="secondary">
          {t("exchanges.subtitle")}
        </Text>
      </div>

      <div className="flex gap-2">
        {TABS.map(({ key, icon: Icon }) => {
          const active = tab === key;
          const count = (key === "received" ? received : sent).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={active}
              className={clsx(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-on-primary"
                  : "border-border-light bg-surface text-foreground-secondary hover:border-primary/40 border",
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {t(`exchanges.tabs.${key}`)}
              <span
                className={clsx(
                  "rounded-full px-1.5 text-xs font-bold",
                  active ? "bg-on-primary/20" : "bg-background-secondary",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="border-border-light bg-surface rounded-2xl border border-dashed px-4 py-16 text-center">
          <Text weight="semibold" color="secondary">
            {loading ? t("exchanges.loading") : t(`exchanges.empty.${tab}`)}
          </Text>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              perspective={tab === "received" ? "seller" : "buyer"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
