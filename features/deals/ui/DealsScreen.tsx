"use client";
import { useState } from "react";
import { PackageSearch, ShieldAlert } from "lucide-react";

import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";

import { useDeals } from "../hooks/useDeals";
import { DealCard } from "./DealCard";
import type { DealPerspective } from "../types";

/**
 * The seller's deal inbox: what they're buying (buyer side) and requests on
 * their items (seller side). Cash, in person — this screen is only the trust /
 * coordination layer (accept, confirm with photo, dispute).
 */
export function DealsScreen() {
  const { buyerDeals, sellerDeals, reputation, loading } = useDeals();
  const [tab, setTab] = useState<DealPerspective>("seller");

  const deals = tab === "seller" ? sellerDeals : buyerDeals;
  const blocked =
    reputation?.blockedUntil && new Date(reputation.blockedUntil) > new Date();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-8">
      <div>
        <Title level="h1" size="h4" weight="bold">
          Mis tratos
        </Title>
        <Text variant="span" size="sm" color="tertiary">
          Compras y ventas en efectivo, en persona. Confirma la entrega con una foto.
        </Text>
      </div>

      {blocked && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <ShieldAlert size={18} />
          Tu cuenta está temporalmente bloqueada para nuevos tratos hasta{" "}
          {new Date(reputation!.blockedUntil!).toLocaleDateString()} por
          incumplimientos ({reputation!.failedCount}).
        </div>
      )}

      <div className="flex gap-2">
        {(["seller", "buyer"] as DealPerspective[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "border border-border text-foreground hover:bg-background-secondary"
            }`}
          >
            {t === "seller" ? "Solicitudes a mis productos" : "Mis compras"}
          </button>
        ))}
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-foreground-tertiary">
          <PackageSearch size={40} strokeWidth={1.5} />
          <Text variant="span" size="sm" color="tertiary">
            {loading ? "Cargando…" : "Aún no tienes tratos aquí."}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} perspective={tab} />
          ))}
        </div>
      )}
    </div>
  );
}
