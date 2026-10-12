"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import { UPDATE_SHIPPING } from "@/graphql/checkout/mutations";
import { GET_MY_SALES, GET_SALES_STATS } from "@/graphql/checkout/queries";
import { useToast } from "@/hooks/useToast";
import type { Seller } from "@/types/user";

import type { BuyerOrder } from "./useMyOrders";

/** The address an order ships to. Location fields are ids; see `useAddressNames`. */
export interface SaleAddress {
  id: string;
  recipientName: string;
  phone: string;
  countryId: number;
  regionId: number;
  cityId: number;
  countyId: number;
  street: string;
  reference?: string | null;
  zipCode?: string | null;
}

/** An order the signed-in seller received: the buyer's view plus who and where. */
export interface SaleOrder extends BuyerOrder {
  shippingAddress?: SaleAddress | null;
  buyer?: Pick<Seller, "id" | "email" | "phone" | "profile"> | null;
}

/**
 * Server-side filters. "toShip" is what a seller acts on: paid and still
 * being prepared. Each key maps to the `status`/`stage` arguments.
 */
export type SalesFilter = "all" | "toShip" | "shipped" | "delivered" | "pending" | "canceled";

export const SALES_FILTERS: Record<SalesFilter, { status?: string; stage?: string }> = {
  all: {},
  toShip: { status: "PAID", stage: "PREPARING" },
  shipped: { status: "PAID", stage: "SHIPPED" },
  delivered: { status: "PAID", stage: "DELIVERED" },
  pending: { status: "PENDING_PAYMENT" },
  canceled: { status: "CANCELED" },
};

interface SalesResponse {
  getOrdersBySeller: {
    nodes: SaleOrder[];
    pageInfo: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface StatsResponse {
  getSellerRevenueStats: {
    totalRevenue: number;
    completedCount: number;
    pendingCount: number;
  };
  toShip: { pageInfo: { totalCount: number } };
}

const PAGE_SIZE = 10;

/** Midnight on the first day of the current month, local time. */
function startOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

/**
 * The seller's sales area (WEB-1, WEB-14): one page of received orders under a
 * filter, this month's totals, and the shipping action.
 */
export function useMySales() {
  const toast = useToast();
  const [filter, setFilterState] = useState<SalesFilter>("toShip");
  const [page, setPage] = useState(1);
  // Fixed for the life of the page so the stats query keeps one cache key.
  const [monthStart] = useState(startOfMonth);

  const sales = useQuery<SalesResponse>(GET_MY_SALES, {
    variables: { page, pageSize: PAGE_SIZE, ...SALES_FILTERS[filter] },
    // A sale lands the moment a buyer pays, so a cached page must not hide it.
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const stats = useQuery<StatsResponse>(GET_SALES_STATS, {
    variables: { dateFrom: monthStart },
    fetchPolicy: "cache-and-network",
  });

  const [updateShipping, { loading: updating }] = useMutation(UPDATE_SHIPPING, {
    // The order may leave the current filter ("to ship" → "shipped"), and the
    // "to ship" count moves with it.
    refetchQueries: ["GetMySales", "GetSalesStats"],
    awaitRefetchQueries: true,
  });

  /** Returns whether the move went through; failures are toasted here. */
  const moveTo = async (
    orderId: string,
    stage: "SHIPPED" | "DELIVERED",
    trackingInfo?: string,
  ): Promise<boolean> => {
    try {
      await updateShipping({
        variables: {
          input: {
            orderId,
            stage,
            ...(stage === "SHIPPED" && trackingInfo?.trim()
              ? { trackingInfo: trackingInfo.trim() }
              : {}),
          },
        },
      });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
      return false;
    }
  };

  const revenue = stats.data?.getSellerRevenueStats;

  return {
    orders: sales.data?.getOrdersBySeller.nodes ?? [],
    pageInfo: sales.data?.getOrdersBySeller.pageInfo,
    page,
    filter,
    setFilter: (next: SalesFilter) => {
      setFilterState(next);
      setPage(1);
    },
    goToPage: (next: number) => setPage(Math.max(1, next)),
    initialLoading: sales.loading && !sales.data,
    loading: sales.loading,
    error: sales.error,
    refetch: sales.refetch,
    stats: revenue
      ? {
          revenue: revenue.totalRevenue,
          paidCount: revenue.completedCount,
          average: revenue.completedCount > 0 ? revenue.totalRevenue / revenue.completedCount : 0,
          toShip: stats.data?.toShip.pageInfo.totalCount ?? 0,
        }
      : null,
    moveTo,
    updating,
  };
}
