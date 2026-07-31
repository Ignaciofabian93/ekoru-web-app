"use client";
import { useState, type ReactNode } from "react";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import type { StoreProductCardProduct } from "./types/Card.types";
import { Card } from "./Card";

interface StoreProductCardProps {
  product: StoreProductCardProduct;
  lang: string;
  priority?: boolean;
  /**
   * Overrides the built-in add-to-cart with the quantity picked on the card.
   * The default already routes through the shared `useAddToCart`, so pass this
   * only for a genuinely different action (a picker, a bulk flow).
   */
  onAddToCart?: (quantity: number) => void;
  /** Owner controls — see `CardProps.actions`. Switches to management mode. */
  actions?: ReactNode;
}

/** How long the CTA holds its "Added" confirmation before reverting. */
const ADDED_FEEDBACK_MS = 1500;

export function StoreProductCard({
  product,
  lang,
  priority = false,
  onAddToCart,
  actions,
}: StoreProductCardProps) {
  const href = `/${lang}/store-product/${product.id}`;
  const stock = product.stock ?? 0;
  const { addStoreProduct } = useAddToCart();
  const isOwnProduct = useIsOwnProduct(product.sellerId);

  // Starts at zero: picking a quantity is a deliberate act, and the CTA stays
  // inert until the shopper chooses one.
  const [quantity, setQuantity] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const onOffer = Boolean(
    product.hasOffer &&
      typeof product.offerPrice === "number" &&
      product.offerPrice < product.price,
  );

  // Whole-number discount for the badge; only meaningful on a real offer.
  const discountPercent = onOffer
    ? ((product.price - (product.offerPrice as number)) / product.price) * 100
    : undefined;

  const isSoldOut = stock <= 0;

  // A seller browses their own listing but never buys it, and in management
  // mode the actions menu replaces the CTA — either way the buy affordances
  // (stepper included) come off the card.
  const canBuy = !isOwnProduct && !actions;

  function handleAddToCart(picked: number) {
    if (onAddToCart) {
      onAddToCart(picked);
      return;
    }
    // `addStoreProduct` owns the auth / ownership / stock rules and its own
    // toasts; the card only reflects the outcome. The projection allows `null`
    // where the cart expects `undefined`, so the line is normalized here.
    const line = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images ?? undefined,
      hasOffer: onOffer,
      offerPrice: product.offerPrice ?? undefined,
      sellerId: product.sellerId ?? undefined,
      stock,
    };
    if (addStoreProduct(line, picked) === "added") {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
      setQuantity(0);
    }
  }

  return (
    <Card
      orientation="vertical"
      hasBackSide
      href={href}
      ariaLabel={product.name}
      actions={actions}
    >
      <Card.FrontSide>
        <Card.Header
          coverImageString={product.images?.[0] ?? ""}
          imageAlt={product.name}
          priority={priority}
          hasOffer={onOffer}
          discountPercent={discountPercent}
          isSoldOut={isSoldOut}
          isLikeEnabled
          isLiked={product.isLiked ?? undefined}
          itemId={product.id}
          favoriteSource="store"
        />
        <Card.Body
          isProduct
          name={product.name}
          brand={product.brand ?? undefined}
          price={product.price}
          hasOffer={product.hasOffer ?? undefined}
          offerPrice={product.offerPrice ?? undefined}
          averageRating={product.averageRating ?? undefined}
          reviewsNumber={product.reviewsNumber ?? undefined}
          stock={product.stock ?? undefined}
          isLowStock={product.isLowStock ?? undefined}
          quantity={canBuy ? quantity : undefined}
          onQuantityChange={canBuy ? setQuantity : undefined}
          maxQuantity={canBuy ? stock : undefined}
        />
        {canBuy && (
          <Card.Footer
            itemType="STORE"
            url={href}
            onAction={() => handleAddToCart(quantity)}
            state={isSoldOut ? "unavailable" : justAdded ? "added" : "default"}
            // Nothing to add until a quantity is picked.
            disabled={quantity === 0}
          />
        )}
      </Card.FrontSide>
      <Card.BackSide>
        <Card.BackHeader itemName={product.name} />
        <Card.BackBody itemType="STORE" impact={product.environmentalImpact} />
        <Card.BackFooter seller={product.seller} />
      </Card.BackSide>
    </Card>
  );
}
