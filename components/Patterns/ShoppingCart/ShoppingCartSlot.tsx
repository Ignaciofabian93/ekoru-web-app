"use client";
import clsx from "clsx";
import { useState, type AnimationEvent } from "react";
import { ShoppingCartButton, type ShoppingCartButtonProps } from "./ShoppingCart";
import { ShoppingCartSkeleton } from "./ShoppingCartSkeleton";
import {
  shoppingCartFadeInClass,
  shoppingCartFadeOutClass,
  shoppingCartSlotClass,
  shoppingCartSlotLayerClass,
} from "./styles";

interface ShoppingCartSlotProps extends ShoppingCartButtonProps {
  loading: boolean;
  visible: boolean;
}

export function ShoppingCartSlot({
  loading,
  visible,
  ...buttonProps
}: ShoppingCartSlotProps) {
  const showSkeleton = loading && !visible;

  const [skeletonMounted, setSkeletonMounted] = useState(showSkeleton);
  if (showSkeleton && !skeletonMounted) setSkeletonMounted(true);

  const removeSkeleton = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setSkeletonMounted(false);
  };

  if (!skeletonMounted && !visible) return null;

  return (
    <div className={shoppingCartSlotClass}>
      {skeletonMounted && (
        <div
          className={clsx(
            shoppingCartSlotLayerClass,
            !showSkeleton && !visible && shoppingCartFadeOutClass,
          )}
          onAnimationEnd={removeSkeleton}
        >
          <ShoppingCartSkeleton text={buttonProps.text} />
        </div>
      )}
      {visible && (
        <div
          className={clsx(shoppingCartSlotLayerClass, shoppingCartFadeInClass)}
          onAnimationEnd={removeSkeleton}
        >
          <ShoppingCartButton {...buttonProps} />
        </div>
      )}
    </div>
  );
}
