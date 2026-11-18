import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import {
  shoppingCartIconSize,
  shoppingCartIconStroke,
  shoppingCartLabelClass,
  shoppingCartSkeletonClass,
  shoppingCartSkeletonContentClass,
} from "./styles";

interface ShoppingCartSkeletonProps {
  text?: string;
}

export function ShoppingCartSkeleton({ text = "My cart" }: ShoppingCartSkeletonProps) {
  return (
    <div aria-hidden className={shoppingCartSkeletonClass}>
      <ShoppingCart
        size={shoppingCartIconSize}
        strokeWidth={shoppingCartIconStroke}
        className={shoppingCartSkeletonContentClass}
      />
      <span className={clsx(shoppingCartLabelClass, shoppingCartSkeletonContentClass)}>
        {text}
      </span>
    </div>
  );
}
