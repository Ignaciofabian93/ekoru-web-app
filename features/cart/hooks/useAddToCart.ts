"use client";

import type { Currency } from "@/constants/settings";
import { useCurrentSellerId } from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

/**
 * Centralizes how products from each domain become cart lines, so every
 * add-to-cart entry point agrees on source, price (offer-aware), seller and
 * stock/availability. Marketplace = unique single unit; store = stock-bounded.
 */

type SellerProfile = {
  __typename?: "PersonProfile" | "BusinessProfile";
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  businessName?: string | null;
} | null;

interface MarketplaceLike {
  id: number;
  name: string;
  images?: string[] | null;
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
  sellerId: string;
  sellerName?: string;
  seller?: { profile?: SellerProfile } | null;
}

interface StoreLike {
  id: number;
  name: string;
  images?: string[] | null;
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
  sellerId?: string;
  sellerName?: string;
  /** Available units. <= 0 (or undefined treated as 0) means out of stock. */
  stock?: number | null;
}

function unitPriceOf(p: {
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
}): number {
  return p.hasOffer && typeof p.offerPrice === "number" && p.offerPrice > 0
    ? p.offerPrice
    : p.price;
}

function resolveSellerName(p: MarketplaceLike): string | undefined {
  if (p.sellerName) return p.sellerName;
  const profile = p.seller?.profile;
  if (!profile) return undefined;
  if (profile.businessName) return profile.businessName;
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  return profile.displayName || fullName || undefined;
}

export function useAddToCart(currency: Currency = "CLP") {
  const addItem = useCartStore((s) => s.addItem);
  const currentSellerId = useCurrentSellerId();

  const isOwn = (sellerId?: string) =>
    Boolean(currentSellerId && sellerId && currentSellerId === sellerId);

  /**
   * Add a marketplace (single-unit) product. Returns false when the product
   * belongs to the current user — sellers can browse but not buy their own.
   */
  function addMarketplaceProduct(product: MarketplaceLike): boolean {
    if (isOwn(product.sellerId)) return false;
    addItem({
      source: "marketplace",
      productId: product.id,
      name: product.name,
      image: product.images?.[0],
      unitPrice: unitPriceOf(product),
      currency,
      sellerId: product.sellerId,
      sellerName: resolveSellerName(product),
    });
    return true;
  }

  /**
   * Add a store (stock-managed) product. Returns false when out of stock so the
   * caller can surface a message instead of silently doing nothing.
   */
  function addStoreProduct(product: StoreLike): boolean {
    const stock = product.stock ?? 0;
    if (stock <= 0 || !product.sellerId || isOwn(product.sellerId)) return false;
    addItem({
      source: "store",
      productId: product.id,
      name: product.name,
      image: product.images?.[0],
      unitPrice: unitPriceOf(product),
      currency,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      maxStock: stock,
    });
    return true;
  }

  return { addMarketplaceProduct, addStoreProduct };
}
