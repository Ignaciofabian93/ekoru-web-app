"use client";
import { useTranslation } from "@/i18n/context";
import type { StoreProduct } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { StoreProductBadges } from "./StoreProductBadges";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

/**
 * Identity only: what the product is, not what it costs. The price moved into
 * the purchase panel below, where it sits with the actions it belongs to.
 */
export function StoreProductSummary({ product }: { product: StoreProduct }) {
  const { t } = useTranslation(NAMESPACE);

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
    </div>
  );
}
