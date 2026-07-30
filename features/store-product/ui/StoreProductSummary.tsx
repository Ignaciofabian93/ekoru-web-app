"use client";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { StoreProductBadges } from "./StoreProductBadges";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

export function StoreProductSummary({ product }: { product: StoreProduct }) {
  const formatPrice = useFormatPrice();
  const { t } = useTranslation(NAMESPACE);

  const priceFormatted =
    product.hasOffer && product.offerPrice
      ? formatPrice(product.offerPrice)
      : formatPrice(product.price);

  const hasDiscount = product.hasOffer && product.offerPrice;

  return (
    <div className="flex flex-col gap-3">
      <StoreProductBadges badges={product.badges ?? []} />

      <div className="flex flex-col">
        <Text
          variant="label"
          weight="bold"
          color="tertiary"
          className="tracking-wide uppercase"
          size="sm"
        >
          {product.brand || t("summary.noBrand")}
        </Text>
        <Title level="h1" size="h2" className="leading-tight">
          {product.name}
        </Title>
      </div>

      <div className="flex items-center gap-3">
        <Text variant="p" weight="bold" size="4xl" color="primary">
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
    </div>
  );
}
