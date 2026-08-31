"use client";
import type { ReactNode } from "react";
import { FEATURES } from "@/constants/features";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useCartQuantity } from "@/features/cart/hooks/useCartQuantity";
import { useIsOwnProduct } from "@/hooks/useIsOwnProduct";
import type { StoreProductCardProduct } from "./types/Card.types";
import { Card } from "./Card";

interface StoreProductCardProps {
  product: StoreProductCardProduct;
  lang: string;
  priority?: boolean;
  /**
   * Replaces the built-in add-to-cart, called with the single unit the CTA
   * stands for. A card that overrides it owns the flow from there on — nothing
   * reaches the cart, so the CTA stays a CTA rather than becoming a stepper.
   * Pass it only for a genuinely different action (a picker, a bulk flow); the
   * default already routes through the shared `useAddToCart`.
   */
  onAddToCart?: (quantity: number) => void;
  /** Owner controls — see `CardProps.actions`. Switches to management mode. */
  actions?: ReactNode;
  /** Owner's primary action — see `CardProps.onEdit`. */
  onEdit?: () => void;
}

export function StoreProductCard({
  product,
  lang,
  priority = false,
  onAddToCart,
  actions,
  onEdit,
}: StoreProductCardProps) {
  const href = `/${lang}/store-product/${product.id}`;
  const stock = product.stock ?? 0;
  const { addStoreProduct } = useAddToCart();
  const isOwnProduct = useIsOwnProduct(product.sellerId);

  // The card shows what the cart holds, rather than a count of its own: the
  // CTA adds the first unit, and from then on the stepper edits that line.
  const { quantity, setQuantity } = useCartQuantity("store", product.id);

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
  // mode the owner's controls replace the CTA — either way the buy affordances
  // (stepper included) come off the card.
  const isManaged = Boolean(actions || onEdit);
  const isShopper = !isOwnProduct && !isManaged;
  // Beta: the store is browsable but not transactable, so a shopper's card
  // keeps its footer and turns it into "view details". Own and managed cards
  // are unaffected — they never had a buy CTA. See `constants/features.ts`.
  const canBuy = isShopper && FEATURES.storePurchase.available;
  const browseOnly = isShopper && !canBuy;

  // A sold-out card keeps its "Out of stock" CTA even when units are already in
  // the cart: there is nothing left to add, and the line stays editable from
  // the cart itself.
  const canStep = canBuy && !isSoldOut;

  // The CTA commits a single unit; the stepper it turns into covers the rest.
  // `addStoreProduct` owns the auth / ownership / stock rules and its own
  // toasts, and the resulting cart line is what the card reads back — so
  // nothing here has to track the outcome.
  function handleAddToCart() {
    if (onAddToCart) {
      onAddToCart(1);
      return;
    }
    // The projection allows `null` where the cart expects `undefined`, so the
    // line is normalized here.
    addStoreProduct(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images ?? undefined,
        hasOffer: onOffer,
        offerPrice: product.offerPrice ?? undefined,
        sellerId: product.sellerId ?? undefined,
        stock,
      },
      1,
    );
  }

  return (
    <Card
      orientation="vertical"
      hasBackSide
      href={href}
      ariaLabel={product.name}
      actions={actions}
      onEdit={onEdit}
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
        />
        {/* Managed cards still render the footer — it resolves to the owner's
            Edit CTA rather than the add-to-cart button. */}
        {(canBuy || browseOnly || isManaged) && (
          <Card.Footer
            itemType="STORE"
            url={href}
            browseOnly={browseOnly}
            onAction={canBuy ? handleAddToCart : undefined}
            state={isSoldOut ? "unavailable" : "default"}
            quantity={canStep ? quantity : undefined}
            onQuantityChange={canStep ? setQuantity : undefined}
            maxQuantity={canStep ? stock : undefined}
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
