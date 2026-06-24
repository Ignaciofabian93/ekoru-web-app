"use client";

import { useCurrentSellerId } from "@/store/useAuthStore";

/**
 * True when the authenticated seller owns the given listing. Used to gate
 * cart actions — a user can browse their own products but never buy them.
 * Returns false for anonymous visitors and when either id is missing.
 */
export function useIsOwnProduct(sellerId?: string | null): boolean {
  const currentSellerId = useCurrentSellerId();
  return Boolean(currentSellerId && sellerId && currentSellerId === sellerId);
}
