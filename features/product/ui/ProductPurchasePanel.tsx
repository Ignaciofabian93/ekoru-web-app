"use client";
import clsx from "clsx";
import { Text } from "@/components/Primitives/Text";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import type { Product } from "@/types/product";
import { ProductActions } from "./ProductActions";

export function ProductPurchasePanel({
  product,
  lang,
  onProposeExchange,
}: {
  product: Product;
  lang: string;
  onProposeExchange?: () => void;
}) {
  const formatPrice = useFormatPrice();

  return (
    <div
      className={clsx(
        "flex flex-col gap-4",
        "rounded-2xl p-4 bg-white shadow-md shadow-slate-800/10 border border-slate-200",
      )}
    >
      <Text variant="p" weight="bold" size="4xl" leading="tight" color="primary">
        {formatPrice(product.price)}
      </Text>

      <ProductActions
        lang={lang}
        product={product}
        onProposeExchange={onProposeExchange}
      />
    </div>
  );
}
