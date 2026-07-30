"use client";
import { useState } from "react";
import type { StoreProduct } from "@/types/product";
import { Card } from "./Card";

interface StoreProductCardProps {
  product: StoreProduct;
  lang: string;
  priority?: boolean;
  /**
   * Add-to-cart handler, given the quantity picked on the card. Omit and the
   * CTA falls back to opening the product page — the card stays presentational,
   * the caller owns the cart.
   */
  onAddToCart?: (quantity: number) => void;
  /** Flash the confirmation label after a successful add. */
  justAdded?: boolean;
}

export function StoreProductCard({
  product,
  lang,
  priority = false,
  onAddToCart,
  justAdded = false,
}: StoreProductCardProps) {
  const href = `/${lang}/store-product/${product.id}`;
  const stock = product.stock ?? 0;

  // Starts at zero: picking a quantity is a deliberate act, and the CTA stays
  // inert until the shopper chooses one.
  const [quantity, setQuantity] = useState(0);

  const onOffer =
    product.hasOffer &&
    typeof product.offerPrice === "number" &&
    product.offerPrice < product.price;

  // Whole-number discount for the badge; only meaningful on a real offer.
  const discountPercent = onOffer
    ? ((product.price - (product.offerPrice as number)) / product.price) * 100
    : undefined;

  const isSoldOut = stock <= 0;

  return (
    <Card orientation="vertical" hasBackSide href={href} ariaLabel={product.name}>
      <Card.FrontSide>
        <Card.Header
          coverImageString={product.images?.[0] ?? ""}
          imageAlt={product.name}
          priority={priority}
          hasOffer={onOffer}
          discountPercent={discountPercent}
          isSoldOut={isSoldOut}
          isLikeEnabled
          isLiked={product.isLiked}
        />
        <Card.Body
          isProduct
          name={product.name}
          brand={product.brand}
          price={product.price}
          hasOffer={product.hasOffer}
          offerPrice={product.offerPrice}
          averageRating={product.averageRating}
          reviewsNumber={product.reviewsNumber}
          stock={product.stock}
          isLowStock={product.isLowStock}
          quantity={quantity}
          onQuantityChange={setQuantity}
          maxQuantity={stock}
        />
        <Card.Footer
          itemType="STORE"
          url={href}
          onAction={onAddToCart ? () => onAddToCart(quantity) : undefined}
          state={isSoldOut ? "unavailable" : justAdded ? "added" : "default"}
          // Only gate the add action — without one the CTA navigates, and that
          // shouldn't depend on the quantity.
          disabled={Boolean(onAddToCart) && quantity === 0}
        />
      </Card.FrontSide>
      <Card.BackSide>
        <Card.BackHeader itemName={product.name} />
        <Card.BackBody itemType="STORE" impact={product.environmentalImpact} />
        <Card.BackFooter seller={product.seller} />
      </Card.BackSide>
    </Card>
  );
}
