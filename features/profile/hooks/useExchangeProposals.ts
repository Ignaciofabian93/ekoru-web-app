"use client";
import { useCallback, useState } from "react";

import type { ExchangeStatus } from "@/types/enums";

export interface ExchangeProductSummary {
  id: string;
  name: string;
  image?: string;
  price: number;
}

export interface ExchangeProposalView {
  id: string;
  status: ExchangeStatus;
  createdAt: string;
  counterpartName: string;
  /** The proposer's item (what's put on the table). */
  offered: ExchangeProductSummary;
  /** The listing being requested. */
  requested: ExchangeProductSummary;
  notes?: string;
}

export type ExchangeDirection = "received" | "sent";

// STUB — there is no backend for exchange proposals yet (see the exchange
// backend gap): no query to list them, no accept/decline mutations. This serves
// mock data and mutates status locally so the inbox is fully interactive.
// Replace with GET_EXCHANGE_PROPOSALS + ACCEPT/DECLINE_EXCHANGE mutations when
// they exist; the view-model already mirrors the `Exchange` type's fields.
const MOCK_RECEIVED: ExchangeProposalView[] = [
  {
    id: "r1",
    status: "PENDING",
    createdAt: "2026-07-22T10:00:00Z",
    counterpartName: "María López",
    offered: { id: "p101", name: "Vintage denim jacket", price: 18000 },
    requested: { id: "p1", name: "Leather satchel bag", price: 22000 },
    notes: "Would love to swap — the jacket is barely worn!",
  },
  {
    id: "r2",
    status: "PENDING",
    createdAt: "2026-07-21T14:30:00Z",
    counterpartName: "Diego Rojas",
    offered: { id: "p102", name: "Mechanical keyboard", price: 25000 },
    requested: { id: "p2", name: "Wireless headphones", price: 20000 },
  },
];

const MOCK_SENT: ExchangeProposalView[] = [
  {
    id: "s1",
    status: "PENDING",
    createdAt: "2026-07-20T09:15:00Z",
    counterpartName: "Camila Torres",
    offered: { id: "p3", name: "Road bike helmet", price: 15000 },
    requested: { id: "p201", name: "Cycling gloves set", price: 12000 },
  },
  {
    id: "s2",
    status: "ACCEPTED",
    createdAt: "2026-07-18T16:45:00Z",
    counterpartName: "Felipe Castro",
    offered: { id: "p4", name: "Camping tent (2p)", price: 40000 },
    requested: { id: "p202", name: "Sleeping bag", price: 38000 },
  },
];

export function useExchangeProposals() {
  const [received, setReceived] = useState<ExchangeProposalView[]>(MOCK_RECEIVED);
  const [sent] = useState<ExchangeProposalView[]>(MOCK_SENT);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const respond = useCallback((id: string, status: Extract<ExchangeStatus, "ACCEPTED" | "DECLINED">) => {
    setPendingId(id);
    // Simulate the round-trip; a real mutation would refetch or update the cache.
    setTimeout(() => {
      setReceived((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      setPendingId(null);
    }, 500);
  }, []);

  const accept = useCallback((id: string) => respond(id, "ACCEPTED"), [respond]);
  const decline = useCallback((id: string) => respond(id, "DECLINED"), [respond]);

  return { received, sent, accept, decline, pendingId };
}
