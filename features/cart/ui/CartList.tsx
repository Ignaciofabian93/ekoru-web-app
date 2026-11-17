"use client";
import { ArrowRight, ArrowUpRight, Store, User } from "lucide-react";

import { SectionCard } from "@/components/Patterns/SectionCard";
import { ButtonLink } from "@/components/Primitives/Button";
import { LinkButton } from "@/components/Primitives/LinkButton";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { type CartItem, useCartGroups } from "@/store/useCartStore";

import { useCart } from "../hooks/useCart";
import { CartItemRow } from "./CartItemRow";
import { OrderSummary } from "./OrderSummary";

const productHref = (lang: SupportedLanguage, item: CartItem) =>
  item.source === "store"
    ? `/${lang}/store-product/${item.productId}`
    : `/${lang}/product/${item.productId}`;

/**
 * The cart as one block per seller/business, because each one is its own
 * transaction — the backend orders one seller at a time. A block is the
 * seller's items beside that seller's order summary and pay button (linking to
 * `checkout?g=<groupId>`); there is deliberately no checkout for the whole
 * cart. Below `lg` the summary drops under its items.
 */
export function CartList({ lang }: { lang: SupportedLanguage }) {
  const groups = useCartGroups();
  const { updateQuantity, removeItem } = useCart();
  const { t } = useTranslation("cart");

  const itemsLabel = (count: number) =>
    count === 1
      ? t("cart.itemCount", { count: "1" })
      : t("cart.itemCountPlural", { count: String(count) });

  return (
    <section aria-label={t("a11y.cartSection")} className="flex flex-col gap-10">
      {groups.map((group) => {
        const sourceLabel = t(`group.${group.source}`);
        const sellerLabel = group.sellerName ?? sourceLabel;

        return (
          <div
            key={group.id}
            className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-6"
          >
            <SectionCard
              title={sellerLabel}
              subtitle={`${sourceLabel} · ${itemsLabel(group.count)}`}
              icon={group.source === "store" ? Store : User}
              tone="primary"
              headerRight={
                <LinkButton
                  href={`/${lang}/seller/${group.sellerId}`}
                  icon={ArrowUpRight}
                  iconPosition="right"
                  variant="ghost"
                  size="sm"
                  label={
                    group.source === "store"
                      ? t("group.viewStore")
                      : t("group.viewSeller")
                  }
                />
              }
            >
              <ul className="divide-y divide-border-light">
                {group.items.map((item) => (
                  <CartItemRow
                    key={`${item.source}-${item.productId}`}
                    item={item}
                    href={productHref(lang, item)}
                    onQuantityChange={(next) =>
                      updateQuantity(item.productId, item.source, next)
                    }
                    onRemove={() => removeItem(item.productId, item.source)}
                  />
                ))}
              </ul>
            </SectionCard>

            {/* Phone: full width under the items. Tablet: still under them, but
                held to a summary's width at the end of the row, so labels and
                amounts don't drift a whole screen apart. Desktop: the side
                column, sticking beside a long list — only within its own
                seller's block, since the grid row is its scroll boundary. */}
            <div className="md:w-96 md:justify-self-end lg:sticky lg:top-6 lg:w-auto lg:justify-self-stretch">
              <OrderSummary
                itemCount={group.count}
                subtotal={group.subtotal}
                total={group.subtotal}
                currency={group.currency}
                label={t("a11y.sellerSummary", { seller: sellerLabel })}
              >
                <ButtonLink
                  href={`/${lang}/cart/checkout?g=${encodeURIComponent(group.id)}`}
                  text={
                    group.sellerName
                      ? t("group.checkoutSeller", { seller: group.sellerName })
                      : t("group.checkout")
                  }
                  rightIcon={ArrowRight}
                  size="md"
                  fullWidth
                />
              </OrderSummary>
            </div>
          </div>
        );
      })}
    </section>
  );
}
