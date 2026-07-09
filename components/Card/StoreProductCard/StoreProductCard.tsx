"use client";

import clsx from "clsx";
import { Check, ImageOff, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useIsInCart } from "@/store/useCartStore";
import type { StoreProduct } from "@/types/product";
import { resolveImageUrl } from "@/utils/resolveImage";

interface Props {
  product: StoreProduct;
  lang?: string;
  href?: string;
  /** Aria-label for the add-to-cart button. */
  addToCartLabel: string;
  /** Overlay text shown when the product has no stock. */
  outOfStockLabel: string;
  className?: string;
}

/**
 * Store product card — mirrors the marketplace card's visual style but is
 * purchase-only (no exchange, no flip). Themed teal to match the stores domain.
 */
export default function StoreProductCard({
  product,
  lang,
  href,
  addToCartLabel,
  outOfStockLabel,
  className,
}: Props) {
  const { addStoreProduct } = useAddToCart();
  const formatPrice = useFormatPrice();
  const [imageError, setImageError] = useState(false);
  const [popped, setPopped] = useState(false);

  const cover = resolveImageUrl(product.images?.[0]);
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  const inCart = useIsInCart("store", product.id);

  const outOfStock = (product.stock ?? 0) <= 0;
  const hasOffer =
    product.hasOffer && typeof product.offerPrice === "number" && product.offerPrice > 0;
  const unitPrice = hasOffer ? (product.offerPrice as number) : product.price;
  const discountPct = hasOffer
    ? Math.round(100 - ((product.offerPrice as number) / product.price) * 100)
    : 0;
  const showRating = product.reviewsNumber > 0;

  const resolvedHref =
    href ?? (lang ? `/${lang}/store-product/${product.id}` : undefined);
  const Container: React.ElementType = resolvedHref ? Link : "div";
  const containerProps = resolvedHref ? { href: resolvedHref } : {};

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = addStoreProduct(product);
    if (result === "added") {
      setPopped(true);
      setTimeout(() => setPopped(false), 400);
    }
  };

  return (
    <Container
      {...containerProps}
      className={clsx(
        "group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-light bg-surface text-left shadow-sm transition-all hover:border-secondary/40 hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-background-secondary">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={36} strokeWidth={1.5} className="text-foreground-muted" />
          </div>
        )}

        {hasOffer && discountPct > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
            -{discountPct}%
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground">
              {outOfStockLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div className="min-w-0">
          {product.brand && (
            <p className="truncate text-[10px] font-medium tracking-wide text-foreground-tertiary uppercase">
              {product.brand}
            </p>
          )}
          <p className="mt-0.5 line-clamp-2 text-sm leading-snug font-semibold text-foreground">
            {product.name}
          </p>
          {showRating && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground-secondary">
              <Star size={12} className="fill-amber-400 text-amber-400" strokeWidth={0} />
              {product.averageRating.toFixed(1)}
              <span className="text-foreground-tertiary">({product.reviewsNumber})</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold text-primary">
              {formatPrice(unitPrice)}
            </span>
            {hasOffer && (
              <span className="truncate text-xs font-medium text-foreground-tertiary line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {!isOwnProduct && (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={inCart || outOfStock}
              aria-label={addToCartLabel}
              className={clsx(
                "flex size-9 shrink-0 items-center justify-center rounded-md shadow-sm transition-colors",
                popped && "animate-cart-pop",
                inCart
                  ? "cursor-not-allowed bg-success/15 text-success"
                  : outOfStock
                    ? "cursor-not-allowed bg-border text-foreground-muted"
                    : "cursor-pointer bg-primary text-white hover:bg-primary-dark",
              )}
            >
              {inCart ? (
                <Check size={15} strokeWidth={2.4} />
              ) : (
                <ShoppingCart size={15} strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}
