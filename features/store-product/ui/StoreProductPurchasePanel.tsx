"use client";
import clsx from "clsx";
import { Text } from "@/components/Primitives/Text";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import type { StoreProduct } from "@/types/product";
import { StoreProductActions } from "./StoreProductActions";

/**
 * Price and the actions it belongs to, on their own surface — the same panel
 * the marketplace listing uses, so the two product pages transact the same way.
 * Identity stays above in the summary.
 */
export function StoreProductPurchasePanel({
  product,
  lang,
}: {
  product: StoreProduct;
  lang: string;
}) {
  const formatPrice = useFormatPrice();

  const hasDiscount = Boolean(product.hasOffer && product.offerPrice);
  const priceFormatted = hasDiscount
    ? formatPrice(product.offerPrice as number)
    : formatPrice(product.price);

  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        "rounded-2xl p-4 bg-white shadow-md shadow-slate-800/10 border border-slate-200",
      )}
    >
      <div className="flex flex-wrap items-baseline gap-3">
        <Text variant="p" weight="bold" size="4xl" leading="tight" color="primary">
          {priceFormatted}
        </Text>
        {hasDiscount && (
          <Text
            variant="span"
            size="base"
            weight="semibold"
            color="tertiary"
            className="line-through"
          >
            {formatPrice(product.price)}
          </Text>
        )}
      </div>

      <StoreProductActions lang={lang} product={product} />
    </div>
  );
}
