import clsx from "clsx";
import { skeletonClass } from "@/design/skeleton";

export const shoppingCartButtonClass = clsx("btn btn-secondary relative px-2 sm:px-4");

export const shoppingCartBadgeClass = clsx(
  "absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center",
  "rounded-full border border-secondary/40 bg-linear-90 from-primary-dark to-primary font-bold leading-none",
);

export const shoppingCartBadgePadClass = {
  wide: "px-1",
  narrow: "px-0",
};

export const shoppingCartIconSize = 18;

export const shoppingCartIconStroke = 1.8;

export const shoppingCartLabelClass = "hidden whitespace-nowrap sm:inline";

export const shoppingCartSkeletonClass = clsx(
  "btn px-2 sm:px-4",
  skeletonClass.md,
  "cursor-default hover:filter-none",
);

export const shoppingCartSkeletonContentClass = "invisible shrink-0";

export const shoppingCartSlotClass = "grid";

export const shoppingCartSlotLayerClass = "col-start-1 row-start-1 flex";

export const shoppingCartFadeInClass = "animate-fade-in";

export const shoppingCartFadeOutClass = "animate-fade-out";
