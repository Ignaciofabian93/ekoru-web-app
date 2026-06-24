"use client";

import { formatPrice } from "@/data/products";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import { ImageOff, Repeat, RotateCw, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import { NAMESPACE } from "@/features/marketplace/i18n";
import type { MarketplaceCardProduct } from "./types";

const CONDITION_STYLES: Record<string, string> = {
  NEW: "bg-primary-light-bg text-primary",
  LIKE_NEW: "bg-primary-light-bg text-primary",
  OPEN_BOX: "bg-primary-light-bg text-primary",
  REFURBISHED: "bg-primary-light-bg text-primary",
  GOOD: "bg-primary-light-bg text-primary",
  FAIR: "bg-amber-50 text-amber-700",
  POOR: "bg-red-50 text-red-600",
  FOR_PARTS: "bg-red-50 text-red-600",
};

interface Props {
  product: MarketplaceCardProduct;
  href?: string;
  onFlip: () => void;
  onAddToCart?: () => void;
}

export default function FrontSide({ product, href, onFlip, onAddToCart }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(product.images?.[0]);
  const isOwnProduct = useIsOwnProduct(product.sellerId);

  const Container: React.ElementType = href ? Link : "div";
  const containerProps = href ? { href } : {};

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.();
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  };

  return (
    <Container
      {...containerProps}
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-light bg-surface text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
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
            <ImageOff
              size={36}
              strokeWidth={1.5}
              className="text-foreground-muted"
              aria-label={t("product.noImage")}
            />
          </div>
        )}

        <span
          className={`absolute bottom-2 left-2 rounded-md px-2 py-0.5 text-xs font-medium ${
            CONDITION_STYLES[product.condition] ?? "bg-white/90 text-foreground"
          }`}
        >
          {t(`conditions.${product.condition}`)}
        </span>

        {product.isExchangeable && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-secondary/90 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
            <Repeat size={11} strokeWidth={2.5} />
            {t("product.exchangeable")}
          </span>
        )}

        <button
          type="button"
          onClick={handleFlip}
          aria-label={t("card.flipToDetails")}
          className="absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-colors hover:bg-primary-active"
        >
          <RotateCw size={14} strokeWidth={2.5} />
        </button>
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
          {product.color && (
            <p className="mt-0.5 truncate text-xs text-foreground-secondary">
              {product.color}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-base font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {!isOwnProduct && (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={t("product.addToCart")}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary text-on-primary shadow-sm transition-colors hover:bg-primary-active"
            >
              <ShoppingCart size={15} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}
