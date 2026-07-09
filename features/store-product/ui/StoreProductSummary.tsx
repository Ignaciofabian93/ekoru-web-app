"use client";

import { Star } from "lucide-react";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";

import { NAMESPACE } from "../i18n";
import { StoreProductBadges } from "./StoreProductBadges";

export function StoreProductSummary({ product }: { product: StoreProduct }) {
  const formatPrice = useFormatPrice();
  const { t } = useTranslation(NAMESPACE);

  const viewLabel =
    product.reviewsNumber === 1
      ? t("summary.views", { count: String(product.reviewsNumber ?? 0) })
      : t("summary.viewsPlural", { count: String(product.reviewsNumber ?? 0) });

  const priceFormatted =
    product.hasOffer && product.offerPrice
      ? formatPrice(product.offerPrice)
      : formatPrice(product.price);

  const hasDiscount = product.hasOffer && product.offerPrice;

  return (
    <div className="flex flex-col gap-3">
      <StoreProductBadges badges={product.badges ?? []} />

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium tracking-wide text-foreground-tertiary uppercase">
          {product.brand || t("summary.noBrand")}
        </p>
        <h1 className="text-2xl leading-tight font-bold text-foreground md:text-3xl">
          {product.name}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-secondary">
        {typeof product.reviewsNumber === "number" && (
          <span className="inline-flex items-center gap-1">
            <Star
              size={14}
              strokeWidth={1.8}
              className="text-yellow-300 fill-amber-300"
            />
            {viewLabel}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">{priceFormatted}</span>
        {hasDiscount && (
          <span className="text-base text-foreground-tertiary line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
    </div>
  );
}
