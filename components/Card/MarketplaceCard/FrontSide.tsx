"use client";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import { cleanText } from "@/utils/formatters";
import { Heart, ImageOff, Repeat, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NAMESPACE } from "@/features/marketplace/i18n";
import type { MarketplaceCardProduct } from "./types";
import { Text } from "@/components/Text/Text";
import { AddToCartButton, ExchangeButton } from "./CTA";

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
  /** Eager-load + preload the cover image. Set on above-the-fold cards (LCP). */
  priority?: boolean;
  /** Show the flip-to-details control. Hidden in management contexts (e.g. My
   *  Listings) where an actions menu takes the corner instead. */
  showFlip?: boolean;
  isOwnProduct?: boolean;
}

export default function FrontSide({
  product,
  href,
  onFlip,
  onAddToCart,
  priority,
  showFlip = true,
  isOwnProduct = false,
}: Props) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();
  const { addMarketplaceProduct } = useAddToCart();
  const { toggleFavorite } = useToggleFavorite();
  const [imageError, setImageError] = useState(false);
  const cover = resolveImageUrl(product.images?.[0]);
  const liked = Boolean(product.isLiked);
  const { isExchangeable, brand } = product;

  const Container: React.ElementType = href ? Link : "div";
  const containerProps = href ? { href } : {};

  const productBrand = cleanText(brand);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
      return;
    }
    addMarketplaceProduct(product);
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
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-300"
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

        {isExchangeable && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-gray-700 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
            <Repeat size={11} strokeWidth={2.5} />
            {t("product.exchangeable")}
          </span>
        )}

        {(!isOwnProduct || showFlip) && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            {!isOwnProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(product.id, liked);
                }}
                aria-pressed={liked}
                aria-label={t("product.favorite")}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/85 shadow-sm transition-colors hover:bg-white"
              >
                <Heart
                  size={15}
                  strokeWidth={2}
                  className={
                    liked ? "fill-red-500 text-red-500" : "text-foreground-secondary"
                  }
                />
              </button>
            )}
            {showFlip && (
              <button
                type="button"
                onClick={handleFlip}
                aria-label={t("card.flipToDetails")}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-colors hover:bg-primary-active"
              >
                <RotateCw size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-start gap-2 px-3 py-2">
        <div className="">
          <Text
            variant="span"
            size="xs"
            weight="bold"
            color="secondary"
            className="uppercase"
          >
            {productBrand ?? t("product.noBrand")}
          </Text>
          <Text
            variant="span"
            size="sm"
            weight="normal"
            color="default"
            className="line-clamp-1"
          >
            {product.name}
          </Text>
        </div>

        <div className="flex items-center justify-between gap-2 w-full h-8">
          <Text variant="span" size="lg" color="primary" weight="bold">
            {formatPrice(product.price)}
          </Text>
          {isExchangeable && <ExchangeButton />}
        </div>
        {!isOwnProduct && (
          <AddToCartButton
            handleAddToCart={handleAddToCart}
            label={t("product.addToCart")}
          />
        )}
      </div>
    </Container>
  );
}
