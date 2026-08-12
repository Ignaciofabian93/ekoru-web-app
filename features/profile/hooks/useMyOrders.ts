"use client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import { GET_MY_ORDERS } from "@/graphql/checkout/queries";
import type { ShippingStage } from "@/types/enums";

/** Shipping stages plus the one order state that has no stage yet. */
export type OrderStage = ShippingStage | "PENDING_PAYMENT";

export interface OrderLine {
  id: string;
  quantity: number;
  price: number;
  product?: { id: number; name: string; images: string[] } | null;
  storeProduct?: { id: number; name: string; images: string[] } | null;
}

export interface BuyerOrder {
  id: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED" | "REFUNDED";
  total: number;
  currency: string;
  createdAt: string;
  shippingMethod: string;
  shippingStatus?: { id: string; status: ShippingStage } | null;
  orderItems?: OrderLine[] | null;
}

interface OrdersResponse {
  getOrdersByBuyer: {
    nodes: BuyerOrder[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

const PAGE_SIZE = 10;

/**
 * An order carries two states: the payment state (`status`) and the shipping
 * stage. The buyer only ever sees one badge, so they are collapsed here —
 * cancelled/refunded wins over any stale stage, an unpaid order is shown as
 * such rather than as "preparing", and everything else follows the shipment.
 */
export function orderStage(order: BuyerOrder): OrderStage {
  if (order.status === "CANCELED" || order.status === "REFUNDED") return "CANCELED";
  if (order.status === "PENDING_PAYMENT") return "PENDING_PAYMENT";
  return order.shippingStatus?.status ?? "PREPARING";
}

/** Name to show for a line: whichever catalogue the item came from. */
export function lineName(line: OrderLine): string | null {
  return line.product?.name ?? line.storeProduct?.name ?? null;
}

export function lineImage(line: OrderLine): string | null {
  return line.product?.images?.[0] ?? line.storeProduct?.images?.[0] ?? null;
}

export function useMyOrders() {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useQuery<OrdersResponse>(GET_MY_ORDERS, {
    variables: { page, pageSize: PAGE_SIZE },
    // The list is reachable straight after checkout, so a cached page must not
    // hide an order that was created seconds ago.
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const orders = data?.getOrdersByBuyer.nodes ?? [];
  const pageInfo = data?.getOrdersByBuyer.pageInfo;

  return {
    orders,
    pageInfo,
    page,
    // `loading` stays true on refetch with notifyOnNetworkStatusChange, so the
    // skeleton is only for the first load — later pages keep the list visible.
    initialLoading: loading && !data,
    loading,
    error,
    refetch,
    goToPage: (next: number) => setPage(Math.max(1, next)),
  };
}
