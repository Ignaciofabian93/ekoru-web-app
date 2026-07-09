"use client";

import {
  Check,
  //  Heart,
  PackageCheck,
  Share2,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
// import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { cartGroupId, useIsInCart } from "@/store/useCartStore";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";

import { NAMESPACE } from "../i18n";
import { useShareProduct } from "@/hooks/useShareProduct";

interface Props {
  lang: string;
  product: StoreProduct;
}

export function StoreProductActions({ lang, product }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const router = useRouter();
  const { addStoreProduct } = useAddToCart();
  // const { toggleFavorite } = useToggleFavorite();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  // Store items are stock-bounded; once a line exists the button reflects that
  // it's in the cart and quantity is managed from the cart itself.
  const inCart = useIsInCart("store", product.id);
  // const liked = Boolean(product.isLiked);
  const [popped, setPopped] = useState(false);
  const { share, copied } = useShareProduct({
    title: product.name,
    text: product.description,
  });

  function handleAddToCart(): boolean {
    const result = addStoreProduct(product);
    if (result === "added") {
      setPopped(true);
      setTimeout(() => setPopped(false), 400);
    }
    return result === "added" || result === "exists";
  }

  function handleBuyNow() {
    // Only proceed to checkout when the item is actually in the cart. If the
    // user is anonymous, the helper already redirected to login.
    if (handleAddToCart() || inCart) {
      const g = encodeURIComponent(cartGroupId("store", product.sellerId));
      router.push(`/${lang}/cart/checkout?g=${g}`);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {isOwnProduct ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-4 py-3.5 text-sm font-medium text-foreground-secondary">
          <PackageCheck size={18} strokeWidth={2} className="shrink-0 text-primary" />
          {t("actions.ownListing")}
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={inCart}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold transition-colors ${
                popped ? "animate-cart-pop" : ""
              } ${
                inCart
                  ? "cursor-not-allowed bg-success/15 text-success"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              {inCart ? (
                <Check size={20} strokeWidth={2.2} />
              ) : (
                <ShoppingCart size={20} strokeWidth={2} />
              )}
              {inCart ? t("actions.added") : t("actions.addToCart")}
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-base font-semibold text-foreground transition-colors hover:bg-background-secondary"
          >
            <Zap size={18} strokeWidth={2} />
            {t("actions.buyNow")}
          </button>
        </>
      )}

      <div className="flex gap-2">
        {/* <button
          type="button"
          onClick={() => toggleFavorite(product.id, liked)}
          aria-pressed={liked}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
            liked
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-border bg-surface text-foreground-secondary hover:bg-background-secondary"
          }`}
        >
          <Heart
            size={16}
            strokeWidth={2}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
          {liked ? t("actions.saved") : t("actions.save")}
        </button> */}
        <button
          type="button"
          onClick={share}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface py-2.5 text-sm font-medium text-foreground-secondary transition-colors hover:bg-background-secondary"
        >
          {copied ? (
            <Check size={16} strokeWidth={2.2} />
          ) : (
            <Share2 size={16} strokeWidth={2} />
          )}
          {t("actions.share")}
        </button>
      </div>
    </div>
  );
}
