"use client";
import { Check, Heart, PackageCheck, Share2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useIsInCart } from "@/store/useCartStore";
import { useTranslation } from "@/i18n/context";
import type { Product } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { useShareProduct } from "../../../hooks/useShareProduct";

interface Props {
  lang: string;
  product: Product;
}

export function ProductActions({ lang, product }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { addMarketplaceProduct } = useAddToCart();
  const { toggleFavorite } = useToggleFavorite();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  // Marketplace items are unique: once in the cart the add button stays
  // disabled until the user removes the line.
  const inCart = useIsInCart("marketplace", product.id);
  const liked = Boolean(product.isLiked);
  const [popped, setPopped] = useState(false);
  const { share, copied } = useShareProduct({
    title: product.name,
    text: product.description,
  });

  function handleAddToCart(): boolean {
    const result = addMarketplaceProduct(product);
    if (result === "added") {
      setPopped(true);
      setTimeout(() => setPopped(false), 400);
    }
    return result === "added" || result === "exists";
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
            <Link
              href={`/${lang}/cart`}
              aria-label={t("actions.viewCart")}
              className="flex w-14 items-center justify-center rounded-xl border-2 border-primary text-primary transition-colors hover:bg-primary-light-bg"
            >
              <ShoppingCart size={20} strokeWidth={2} />
            </Link>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button
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
        </button>
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
