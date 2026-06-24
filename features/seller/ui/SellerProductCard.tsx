"use client";

import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { formatPrice } from "@/data/products";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";

import { NAMESPACE } from "../i18n";
import type { SellerStorefrontProduct } from "../types";

const CONDITION_STYLES: Record<string, string> = {
  NEW: "bg-primary-light-bg text-primary",
  LIKE_NEW: "bg-primary-light-bg text-primary",
  OPEN_BOX: "bg-primary-light-bg text-primary",
  REFURBISHED: "bg-primary-light-bg text-primary",
  FAIR: "bg-amber-50 text-amber-700",
  POOR: "bg-red-50 text-red-600",
  FOR_PARTS: "bg-red-50 text-red-600",
};

interface Props {
  product: SellerStorefrontProduct;
  lang: string;
}

export function SellerProductCard({ product, lang }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { addMarketplaceProduct } = useAddToCart();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const cover = resolveImageUrl(product.images?.[0]);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addMarketplaceProduct(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
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
            aria-label={t("card.noImage")}
          />
        )}

        <span
          className={`absolute bottom-2 left-2 rounded-md px-2 py-0.5 text-xs font-medium ${
            CONDITION_STYLES[product.condition] ?? "bg-border text-foreground"
          }`}
        >
          {t(`conditions.${product.condition}`)}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setLiked((v) => !v);
          }}
          aria-pressed={liked}
          className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white"
        >
          <Heart
            size={15}
            strokeWidth={2}
            className={
              liked ? "fill-red-500 text-red-500" : "text-foreground-secondary"
            }
          />
        </button>
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

        <div className="mt-1.5 sm:mt-2">
          <span className="text-sm font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {!isOwnProduct && (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`mt-2 flex w-full items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition-colors sm:gap-1.5 sm:text-xs ${
              added
                ? "bg-success/10 text-success"
                : "bg-primary-light-bg text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <ShoppingCart size={13} strokeWidth={2} className="shrink-0" />
            <span className="truncate">
              {added ? t("card.added") : t("card.addToCart")}
            </span>
          </button>
        )}
      </div>
    </Link>
  );
}
