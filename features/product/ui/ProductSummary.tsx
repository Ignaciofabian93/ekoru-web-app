"use client";
import { Repeat } from "lucide-react";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import type { Product } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { ProductBadges } from "./ProductBadges";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { Badge } from "@/components/Badge/Badge";

export function ProductSummary({ product }: { product: Product }) {
  const { t } = useTranslation(NAMESPACE);
  const formatPrice = useFormatPrice();

  return (
    <div className="flex flex-col gap-3">
      <ProductBadges badges={product.badges ?? []} />

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

      <div className="flex flex-wrap items-center gap-3">
        <Badge
          label={t(`conditions.${product.condition}`)}
          variant="primary"
          size="medium"
        />
        {product.isExchangeable && (
          <Badge
            icon={Repeat}
            label={t("summary.exchangeable")}
            variant="secondary"
            size="medium"
          />
        )}
      </div>

      <div className="flex">
        <Text variant="p" weight="bold" size="4xl" color="primary">
          {formatPrice(product.price)}
        </Text>
      </div>
    </div>
  );
}
