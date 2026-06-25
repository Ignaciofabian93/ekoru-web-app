"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

import {
  DEFAULT_LANGUAGE,
  type Currency,
  type SupportedLanguage,
} from "@/constants/settings";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useAuthStore, { useCurrentSellerId } from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";

/**
 * Centralizes how products from each domain become cart lines, so every
 * add-to-cart entry point agrees on auth, source, price, seller, stock and
 * user feedback.
 *
 * Rules enforced here (single source of truth):
 * - Must be logged in. Anonymous users are sent to /login?redirectTo=<here>.
 * - A seller can browse but never buy their own listing.
 * - Marketplace = unique single unit; store = stock-bounded.
 */

export type AddToCartResult =
  | "added"
  | "unauthenticated"
  | "own"
  | "exists"
  | "out_of_stock"
  | "pending"; // auth state not hydrated yet — caller should ignore

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
  const items = useCartStore((s) => s.items);
  const seller = useAuthStore((s) => s.seller);
  const isAuthHydrated = useAuthStore((s) => s.isHydrated);
  const currentSellerId = useCurrentSellerId();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("cart");

  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  const isOwn = (sellerId?: string) =>
    Boolean(currentSellerId && sellerId && currentSellerId === sellerId);

  const isInCart = (source: "marketplace" | "store", productId: number) =>
    items.some((i) => i.productId === productId && i.source === source);

  /**
   * Gate shared by both add paths. Returns null when the caller may proceed,
   * otherwise the terminal result (and performs the side effect: redirect/toast).
   */
  function guard(sellerId?: string): AddToCartResult | null {
    // Auth state unknown yet — don't make a wrong decision. Caller ignores.
    if (!isAuthHydrated) return "pending";

    if (!seller) {
      const redirectTo = encodeURIComponent(pathname || `/${lang}`);
      toast.info(t("toast.loginRequired"));
      router.push(`/${lang}/login?redirectTo=${redirectTo}`);
      return "unauthenticated";
    }

    if (isOwn(sellerId)) return "own";
    return null;
  }

  function addMarketplaceProduct(product: MarketplaceLike): AddToCartResult {
    const blocked = guard(product.sellerId);
    if (blocked) return blocked;

    if (isInCart("marketplace", product.id)) {
      toast.info(t("toast.alreadyInCart"));
      return "exists";
    }

    addItem({
      source: "marketplace",
      productId: product.id,
      name: product.name,
      image: product.images?.[0] ?? undefined,
      unitPrice: unitPriceOf(product),
      currency,
      sellerId: product.sellerId,
      sellerName: resolveSellerName(product),
    });
    toast.success(t("toast.added"));
    return "added";
  }

  function addStoreProduct(product: StoreLike): AddToCartResult {
    const blocked = guard(product.sellerId);
    if (blocked) return blocked;

    const stock = product.stock ?? 0;
    if (stock <= 0 || !product.sellerId) {
      toast.error(t("toast.outOfStock"));
      return "out_of_stock";
    }

    addItem({
      source: "store",
      productId: product.id,
      name: product.name,
      image: product.images?.[0] ?? undefined,
      unitPrice: unitPriceOf(product),
      currency,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      maxStock: stock,
    });
    toast.success(t("toast.added"));
    return "added";
  }

  return { addMarketplaceProduct, addStoreProduct, isInCart, isOwn };
}
