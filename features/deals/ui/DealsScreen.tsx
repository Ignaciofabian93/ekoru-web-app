"use client";
import { useState } from "react";
import { PackageSearch, ShieldAlert } from "lucide-react";

import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";
import { useDeals } from "../hooks/useDeals";
import { DealCard } from "./DealCard";
import type { DealPerspective } from "../types";

/**
 * The seller's deal inbox: what they're buying (buyer side) and requests on
 * their items (seller side). Cash, in person — this screen is only the trust /
 * coordination layer (accept, confirm with photo, dispute).
 */
export function DealsScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { buyerDeals, sellerDeals, reputation, loading } = useDeals();
  // Null until the user picks a tab: default to whichever side actually has
  // deals so a buyer doesn't land on an empty "seller" list (and vice-versa).
  const [tab, setTab] = useState<DealPerspective | null>(null);
  const counts: Record<DealPerspective, number> = {
    seller: sellerDeals.length,
    buyer: buyerDeals.length,
  };
  const activeTab: DealPerspective =
    tab ?? (counts.buyer > counts.seller ? "buyer" : "seller");

  const deals = activeTab === "seller" ? sellerDeals : buyerDeals;
  const blocked =
    reputation?.blockedUntil && new Date(reputation.blockedUntil) > new Date();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-8">
      <div>
        <Title level="h1" size="h4" weight="bold">
          {t("title")}
        </Title>
        <Text variant="span" size="sm" color="tertiary">
          {t("subtitle")}
        </Text>
      </div>

      {blocked && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ShieldAlert size={18} />
          {t("blocked", {
            date: new Date(reputation!.blockedUntil!).toLocaleDateString(),
            count: String(reputation!.failedCount),
          })}
        </div>
      )}

      <div className="flex gap-2">
        {(["seller", "buyer"] as DealPerspective[]).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tabKey
                ? "bg-primary text-white"
                : "border border-border text-foreground hover:bg-background-secondary"
            }`}
          >
            {t(`tabs.${tabKey}`)}
            {counts[tabKey] > 0 && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                  activeTab === tabKey ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
                }`}
              >
                {counts[tabKey]}
              </span>
            )}
          </button>
        ))}
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-foreground-tertiary">
          <PackageSearch size={40} strokeWidth={1.5} />
          <Text variant="span" size="sm" color="tertiary">
            {loading ? t("loading") : t("empty")}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} perspective={activeTab} />
          ))}
        </div>
      )}
    </div>
  );
}
