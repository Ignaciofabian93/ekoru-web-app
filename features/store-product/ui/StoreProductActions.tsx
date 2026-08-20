"use client";
import clsx from "clsx";
import { Check, Heart, PackageCheck, Share2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/Primitives/Button";
import { buttonIconSize } from "@/design/button";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useIsInCart } from "@/store/useCartStore";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { useShareProduct } from "@/hooks/useShareProduct";

interface Props {
  lang: string;
  product: StoreProduct;
}

export function StoreProductActions({ product }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { addStoreProduct } = useAddToCart();
  const { toggleFavorite } = useToggleFavorite();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  // Store items are stock-bounded; once a line exists the button reflects that
  // it's in the cart and quantity is managed from the cart itself.
  const inCart = useIsInCart("store", product.id);
  const liked = Boolean(product.isLiked);
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

  return (
    <div className="flex flex-col gap-2.5">
      {isOwnProduct ? (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background-secondary px-4 py-3.5 text-sm font-medium text-foreground-secondary">
          <PackageCheck size={18} strokeWidth={2} className="shrink-0 text-primary" />
          {t("actions.ownListing")}
        </div>
      ) : (
        <Button
          variant="primary"
          size="md"
          fullWidth
          className={clsx(popped && "animate-cart-pop")}
          disabled={inCart}
          leftIcon={inCart ? Check : ShoppingCart}
          text={inCart ? t("actions.added") : t("actions.addToCart")}
          onPress={handleAddToCart}
        />
      )}

      {/* Secondary to the CTA above, so both stay `outline` in either state —
          the filled heart and the label carry "saved", not a second color of
          button. `flex-1` rather than `fullWidth`: they share one row. */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          ariaPressed={liked}
          leftIcon={
            <Heart
              size={buttonIconSize.sm}
              strokeWidth={2}
              className={liked ? "fill-red-500 text-red-500" : ""}
            />
          }
          text={liked ? t("actions.saved") : t("actions.save")}
          onPress={() => toggleFavorite(product.id, liked)}
        />
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          leftIcon={copied ? Check : Share2}
          text={t("actions.share")}
          onPress={share}
        />
      </div>
    </div>
  );
}
