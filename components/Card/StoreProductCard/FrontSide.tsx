"use client";
import { ImageOff, RotateCw, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";
import { resolveImageUrl } from "@/utils/resolveImage";
import { AddToCartButton } from "../MarketplaceCard/CTA";
import { Badge } from "@/components/Badge/Badge";
import { cleanText } from "@/utils/formatters";
import { Text } from "@/components/Text/Text";

interface Props {
  product: StoreProduct;
  href?: string;
  onFlip: () => void;
  isOwnProduct?: boolean;
}

export default function FrontSide({
  product,
  href,
  onFlip,
  isOwnProduct = false,
}: Props) {
  const { t } = useTranslation();
  const { addStoreProduct } = useAddToCart();
  const formatPrice = useFormatPrice();
  const [imageError, setImageError] = useState(false);
  const { brand } = product;

  const cover = resolveImageUrl(product.images?.[0]);

  const outOfStock = (product.stock ?? 0) <= 0;
  const hasOffer =
    product.hasOffer && typeof product.offerPrice === "number" && product.offerPrice > 0;
  const unitPrice = hasOffer ? (product.offerPrice as number) : product.price;
  const discountPct = hasOffer
    ? Math.round(100 - ((product.offerPrice as number) / product.price) * 100)
    : 0;
  const showRating = product.reviewsNumber > 0;

  const Container: React.ElementType = href ? Link : "div";
  const containerProps = href ? { href } : {};

  const productBrand = cleanText(brand);

  const handleAddToCart = (e: React.MouseEvent, quantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    addStoreProduct(product, quantity);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  };

  return (
    <Container
      {...containerProps}
      className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-strong bg-surface text-left shadow-md transition-all hover:border-secondary/40 hover:shadow-lg"
    >
      <div className="relative h-1/2 w-full shrink-0 bg-background-secondary">
        {cover && !imageError ? (
          <Image
            src={cover}
            alt={product.name}
            fill
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
              aria-label={t("storeCard.noImage")}
            />
          </div>
        )}

        {hasOffer && discountPct > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <Badge label={`-${discountPct}%`} variant="attention" />
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col-reverse items-center gap-1.5">
          <button
            type="button"
            onClick={handleFlip}
            aria-label={t("impact.flipToDetails")}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-secondary-dark"
          >
            <RotateCw size={14} strokeWidth={2.5} />
          </button>
        </div>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground">
              {t("storeCard.outOfStock")}
            </span>
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
            {productBrand ?? t("storeCard.noBrand")}
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
          {showRating && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground-secondary">
              <Star size={12} className="fill-amber-400 text-amber-400" strokeWidth={0} />
              {product.averageRating.toFixed(1)}
              <span className="text-foreground-tertiary">({product.reviewsNumber})</span>
            </p>
          )}
        </div>

        <div className="flex items-start justify-between w-full h-8">
          <div className="flex flex-col items-start">
            <Text variant="span" size="lg" color="primary" weight="bold">
              {formatPrice(unitPrice)}
            </Text>
            {hasOffer && (
              <Text
                variant="span"
                size="xs"
                color="tertiary"
                weight="bold"
                className="line-through -mt-1 ml-1"
              >
                {formatPrice(product.price)}
              </Text>
            )}
          </div>
        </div>

        {!isOwnProduct &&
          (outOfStock ? (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-md bg-background-secondary px-4 py-2 text-sm font-medium text-foreground-tertiary"
            >
              {t("storeCard.outOfStock")}
            </button>
          ) : (
            <AddToCartButton
              handleAddToCart={handleAddToCart}
              label={t("storeCard.addToCart")}
              stepper
              maxStock={product.stock}
              decreaseLabel={t("storeCard.decreaseQuantity")}
              increaseLabel={t("storeCard.increaseQuantity")}
            />
          ))}
      </div>
    </Container>
  );
}
