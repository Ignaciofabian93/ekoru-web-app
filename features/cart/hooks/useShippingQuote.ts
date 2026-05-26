"use client";
import { useMemo } from "react";
import type { ShippingMethod } from "@/types/checkout";
import { shippingMethodById } from "../constants/shippingMethods";

export type ShippingQuote =
  | { status: "FREE"; amount: 0 }
  | { status: "KNOWN"; amount: number }
  | { status: "UNAVAILABLE"; amount: null }
  | { status: "LOADING"; amount: null };

/**
 * Returns a quote for the currently selected shipping method.
 *
 * Today this only supports the trivial cases (free pickup, mid-point) and
 * marks CARRIER as unavailable so the UI can show a "carrier quotes coming
 * soon" message. When the gateway exposes a real shipping-quote query we'll
 * swap the CARRIER branch for a `useQuery(GET_SHIPPING_QUOTE, ...)` call.
 */
export function useShippingQuote(method: ShippingMethod | null): ShippingQuote {
  return useMemo<ShippingQuote>(() => {
    if (!method) return { status: "FREE", amount: 0 };
    const meta = shippingMethodById(method);

    if (!meta.payable) return { status: "FREE", amount: 0 };

    if (meta.isQuoted) {
      // TODO: replace with useQuery(GET_SHIPPING_QUOTE, { variables: { method, address }})
      // once the gateway wires Chilexpress/Starken quote endpoints.
      return { status: "UNAVAILABLE", amount: null };
    }

    if (method === "IN_HOUSE_PICKUP") return { status: "FREE", amount: 0 };

    // DELIVERED_TO_HOME placeholder flat rate (CLP). Replace with backend quote
    // once the seller's shipping policy is exposed.
    return { status: "KNOWN", amount: 3990 };
  }, [method]);
}
