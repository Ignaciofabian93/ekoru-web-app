"use client";
import { Repeat } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import type { SupportedLanguage } from "@/constants/settings";
import type { Product } from "@/types/product";
import { NAMESPACE } from "../i18n";
import { NAMESPACE as CARDS_NAMESPACE } from "@/components/Cards/i18n";
import { formatDate } from "../utils/formatDate";
import { ProductBadges } from "./ProductBadges";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { ProductConditionBadge, ProductInfoBadge } from "@/components/Primitives/Badge";

/**
 * Identity only: what the listing is, not what it costs. The price moved into
 * the purchase panel below, where it sits with the actions it belongs to.
 */
export function ProductSummary({
  product,
  lang,
}: {
  product: Product;
  lang: SupportedLanguage;
}) {
  const { t } = useTranslation(NAMESPACE);
  // Condition wording is owned by the shared `cards` dictionary — the same
  // one the product badge renders from — so the filter, the detail page and
  // the badge can never word the same enum differently again.
  const { t: tCondition } = useTranslation(CARDS_NAMESPACE);

  const views = product.viewCount ?? 0;
  const publishedOn = formatDate(product.createdAt, lang);

  // Both halves are optional — a fresh listing has no views, and a malformed
  // date formats to "". Joined so the separator never leads or trails.
  const meta = [
    views > 0
      ? t(views === 1 ? "summary.views" : "summary.viewsPlural", {
          count: String(views),
        })
      : null,
    publishedOn ? `${t("details.publishedOn")} ${publishedOn}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

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

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {/* The same two badges the card shows, in the same colors — the
            listing shouldn't change appearance between the grid and here. */}
        <ProductConditionBadge
          condition={product.condition}
          label={tCondition(`condition.${product.condition}`)}
          size="medium"
        />
        {product.isExchangeable && (
          <ProductInfoBadge
            type="EXCHANGEABLE"
            icon={Repeat}
            label={t("summary.exchangeable")}
            size="medium"
          />
        )}
      </div>
      {meta && (
        <Text variant="span" size="sm" color="tertiary">
          {meta}
        </Text>
      )}
    </div>
  );
}
