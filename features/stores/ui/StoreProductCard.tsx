"use client";
import { formatPrice } from "@/data/products";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import { Check, ImageOff, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { NAMESPACE } from "../i18n";
import type { StoreListProduct } from "../types";

interface Props {
  product: StoreListProduct;
  lang: string;
}

export function StoreProductCard({ product, lang }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { addStoreProduct } = useAddToCart();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  const [added, setAdded] = useState(false);

  const cover = resolveImageUrl(product.images?.[0]);
  const onOffer =
    product.hasOffer &&
    typeof product.offerPrice === "number" &&
    product.offerPrice < product.price;
  const outOfStock = (product.stock ?? 0) <= 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (addStoreProduct(product)) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <Link
      href={`/${lang}/product/${product.id}`}
      className="group bg-surface relative overflow-hidden rounded-xl border border-border-light transition-all hover:shadow-md"
    >
      <div className="bg-background-secondary relative flex aspect-square items-center justify-center">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <ImageOff
            size={36}
            className="text-foreground-muted"
            strokeWidth={1.5}
            aria-label={t("product.noImage")}
          />
        )}

        {onOffer && (
          <span className="absolute top-2 left-2 rounded-md bg-danger px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            {t("product.offer")}
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-3">
        {product.brand && (
          <p className="truncate text-[10px] tracking-wide text-foreground-tertiary uppercase sm:text-xs">
            {product.brand}
          </p>
        )}
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug font-semibold text-foreground sm:text-sm">
          {product.name}
        </p>

        <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2">
          {onOffer ? (
            <>
              <span className="text-sm font-bold text-danger">
                {formatPrice(product.offerPrice as number)}
              </span>
              <span className="text-xs text-foreground-tertiary line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {typeof product.averageRating === "number" && product.averageRating > 0 && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-foreground-secondary">
            <Star size={12} className="fill-amber-400 text-amber-400" strokeWidth={1.5} />
            <span className="font-semibold text-foreground">
              {product.averageRating.toFixed(1)}
            </span>
            {typeof product.reviewsNumber === "number" && product.reviewsNumber > 0 && (
              <span className="text-foreground-tertiary">({product.reviewsNumber})</span>
            )}
          </div>
        )}

        {!isOwnProduct && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition-colors sm:text-xs ${
              outOfStock
                ? "cursor-not-allowed bg-background-secondary text-foreground-tertiary"
                : added
                  ? "bg-success/10 text-success"
                  : "bg-primary-light-bg text-primary hover:bg-primary hover:text-white"
            }`}
          >
            {added ? (
              <Check size={13} strokeWidth={2.2} className="shrink-0" />
            ) : (
              <ShoppingCart size={13} strokeWidth={2} className="shrink-0" />
            )}
            <span className="truncate">
              {outOfStock
                ? t("product.outOfStock")
                : added
                  ? t("product.added")
                  : t("product.addToCart")}
            </span>
          </button>
        )}
      </div>
    </Link>
  );
}
