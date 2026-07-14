"use client";

import { Eye, Repeat } from "lucide-react";

import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { Product } from "@/types/product";

import { NAMESPACE } from "../i18n";
import { ProductBadges } from "./ProductBadges";

const CONDITION_STYLES: Record<string, string> = {
  NEW: "bg-primary-light-bg text-primary",
  LIKE_NEW: "bg-primary-light-bg text-primary",
  OPEN_BOX: "bg-primary-light-bg text-primary",
  REFURBISHED: "bg-primary-light-bg text-primary",
  GOOD: "bg-amber-50 text-amber-700",
  FAIR: "bg-amber-50 text-amber-700",
  POOR: "bg-red-50 text-red-600",
  FOR_PARTS: "bg-red-50 text-red-600",
};

export function ProductSummary({ product }: { product: Product }) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();

  const viewLabel =
    product.viewCount === 1
      ? t("summary.views", { count: String(product.viewCount ?? 0) })
      : t("summary.viewsPlural", { count: String(product.viewCount ?? 0) });

  return (
    <div className="flex flex-col gap-3">
      <ProductBadges badges={product.badges ?? []} />

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium tracking-wide text-foreground-tertiary uppercase">
          {product.brand || t("summary.noBrand")}
        </p>
        <h1 className="text-2xl leading-tight font-bold text-foreground md:text-3xl">
          {product.name}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-secondary">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
            CONDITION_STYLES[product.condition] ?? "bg-border text-foreground"
          }`}
        >
          {t(`conditions.${product.condition}`)}
        </span>
        {product.isExchangeable && (
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/15 px-2 py-0.5 text-xs font-semibold text-secondary">
            <Repeat size={12} strokeWidth={2.2} />
            {t("summary.exchangeable")}
          </span>
        )}
        {typeof product.viewCount === "number" && (
          <span className="inline-flex items-center gap-1">
            <Eye size={14} strokeWidth={1.8} />
            {viewLabel}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
}
