"use client";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import { Check, Heart, ImageOff, RotateCw, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, type ReactNode } from "react";

import ProductImpactBack from "@/components/Card/shared/ProductImpactBack";
import ImpactModal from "@/components/Cards/ImpactModal";
import { NAMESPACE } from "../i18n";
import type { StoreListProduct } from "../types";

interface Props {
  product: StoreListProduct;
  lang: string;
  /** Overlay controls (e.g. an owner actions menu) rendered top-right, above the
   *  card faces so a dropdown isn't clipped. When set the card enters management
   *  mode: customer controls (favorite, flip) are hidden. */
  actions?: ReactNode;
}

export function StoreProductCard({ product, lang, actions }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [impactOpen, setImpactOpen] = useState(false);
  const flip = () => setIsFlipped((prev) => !prev);
  const manage = Boolean(actions);

  return (
    <div className="relative aspect-3/4 w-full min-w-0 perspective-distant">
      <div
        className={clsx(
          "relative h-full w-full transition-transform duration-500 ease-out transform-3d",
          isFlipped && "rotate-y-180",
        )}
      >
        <div
          className={clsx(
            "absolute inset-0 backface-hidden",
            isFlipped && "pointer-events-none",
          )}
        >
          <FrontSide product={product} lang={lang} onFlip={flip} manage={manage} />
        </div>
        <div
          className={clsx(
            "absolute inset-0 rotate-y-180 backface-hidden",
            !isFlipped && "pointer-events-none",
          )}
        >
          <ProductImpactBack
            title={product.name}
            environmentalImpact={product.environmentalImpact}
            seller={product.seller}
            accent="secondary"
            onFlip={flip}
            onShowImpact={() => setImpactOpen(true)}
          />
        </div>
      </div>

      {/* Overlay controls sit outside the flip faces so an open dropdown isn't
          clipped by the 3D transform / overflow-hidden. */}
      {actions && <div className="absolute right-2 top-2 z-20">{actions}</div>}

      {product.environmentalImpact && (
        <ImpactModal
          isOpen={impactOpen}
          onClose={() => setImpactOpen(false)}
          environmentalImpact={product.environmentalImpact}
          productName={product.name}
        />
      )}
    </div>
  );
}

function FrontSide({
  product,
  lang,
  onFlip,
  manage = false,
}: {
  product: StoreListProduct;
  lang: string;
  onFlip: () => void;
  manage?: boolean;
}) {
  const { t } = useTranslation(NAMESPACE);
  const { t: tg } = useTranslation();
  const formatPrice = useFormatPrice();
  const { addStoreProduct } = useAddToCart();
  const { toggleFavorite } = useToggleFavorite();
  const isOwnProduct = useIsOwnProduct(product.sellerId);
  const liked = Boolean(product.isLiked);
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
    if (addStoreProduct(product) === "added") {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  function handleFlip(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  }

  return (
    <Link
      href={`/${lang}/store-product/${product.id}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border-light bg-surface text-left shadow-sm transition-all hover:border-secondary/40 hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full shrink-0 bg-background-secondary">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff
              size={36}
              className="text-foreground-muted"
              strokeWidth={1.5}
              aria-label={t("product.noImage")}
            />
          </div>
        )}

        {onOffer && (
          <span className="absolute top-2 left-2 rounded-md bg-danger px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            {t("product.offer")}
          </span>
        )}

        {!manage && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product.id, liked, "store");
              }}
              aria-pressed={liked}
              aria-label={t("product.favorite")}
              className="flex size-8 items-center justify-center rounded-full bg-white/85 shadow-sm transition-colors hover:bg-white"
            >
              <Heart
                size={15}
                strokeWidth={2}
                className={
                  liked ? "fill-red-500 text-red-500" : "text-foreground-secondary"
                }
              />
            </button>
            <button
              type="button"
              onClick={handleFlip}
              aria-label={tg("impact.flipToDetails")}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-white shadow-sm transition-colors hover:bg-secondary-dark"
            >
              <RotateCw size={14} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
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
            className={clsx(
              "mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg px-1.5 py-1.5 text-[11px] font-semibold transition-colors sm:text-xs",
              added && "animate-cart-pop",
              outOfStock
                ? "cursor-not-allowed bg-background-secondary text-foreground-tertiary"
                : added
                  ? "bg-success/10 text-success"
                  : "bg-primary-light-bg text-primary hover:bg-primary hover:text-white",
            )}
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
