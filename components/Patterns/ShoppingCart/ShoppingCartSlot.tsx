"use client";
import clsx from "clsx";
import { useState, type AnimationEvent } from "react";
import { ShoppingCartButton, type ShoppingCartButtonProps } from "./ShoppingCart";
import { ShoppingCartSkeleton } from "./ShoppingCartSkeleton";
import {
  shoppingCartFadeInClass,
  shoppingCartSlotClass,
  shoppingCartSlotLayerClass,
} from "./styles";

interface ShoppingCartSlotProps extends ShoppingCartButtonProps {
  /** Auth or the saved cart is still hydrating. */
  loading: boolean;
}

/**
 * The skeleton holds the button's place while loading; the button then fades
 * in over it in the same grid cell, and the skeleton leaves once the fade ends.
 */
export function ShoppingCartSlot({ loading, ...buttonProps }: ShoppingCartSlotProps) {
  const [skeletonMounted, setSkeletonMounted] = useState(loading);
  if (loading && !skeletonMounted) setSkeletonMounted(true);

  const removeSkeleton = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setSkeletonMounted(false);
  };

  return (
    <div className={shoppingCartSlotClass}>
      {skeletonMounted && (
        <div className={shoppingCartSlotLayerClass}>
          <ShoppingCartSkeleton text={buttonProps.text} />
        </div>
      )}
      {!loading && (
        <div
          className={clsx(shoppingCartSlotLayerClass, skeletonMounted && shoppingCartFadeInClass)}
          onAnimationEnd={removeSkeleton}
        >
          <ShoppingCartButton {...buttonProps} />
        </div>
      )}
    </div>
  );
}
