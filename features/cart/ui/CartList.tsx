"use client";
import { Store, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useTranslation } from "@/i18n/context";
import { useCartGroups } from "@/store/useCartStore";

import { useCart } from "../hooks/useCart";
import { CartItemRow } from "./CartItemRow";

/**
 * Renders the cart as one card per seller/business. Each group is a self-
 * contained transaction: its own subtotal and Checkout button (linking to
 * `checkout?g=<groupId>`), because the backend orders one seller at a time.
 */
export function CartList() {
  const groups = useCartGroups();
  const { updateQuantity, removeItem } = useCart();
  const formatPrice = useFormatPrice();
  const { t } = useTranslation("cart");
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  return (
    <div className="flex flex-col gap-5" aria-label={t("a11y.cartSection")}>
      {groups.map((group) => {
        const SourceIcon = group.source === "store" ? Store : User;
        const sellerLabel = group.sellerName ?? t(`group.${group.source}`);
        return (
          <section
            key={group.id}
            aria-label={sellerLabel}
            className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-4"
          >
            <header className="flex items-center gap-2 border-b border-border-light pb-3">
              <SourceIcon size={16} strokeWidth={2} className="shrink-0 text-primary" />
              <span className="truncate font-sans text-sm font-semibold text-foreground">
                {sellerLabel}
              </span>
              <span className="ml-auto shrink-0 rounded-full bg-background-secondary px-2 py-0.5 font-sans text-[11px] font-medium text-foreground-secondary">
                {t(`group.${group.source}`)}
              </span>
            </header>

            <ul className="flex flex-col gap-3">
              {group.items.map((item) => (
                <CartItemRow
                  key={`${item.source}-${item.productId}`}
                  item={item}
                  onIncrease={() =>
                    updateQuantity(item.productId, item.source, item.quantity + 1)
                  }
                  onDecrease={() =>
                    updateQuantity(item.productId, item.source, item.quantity - 1)
                  }
                  onRemove={() => removeItem(item.productId, item.source)}
                />
              ))}
            </ul>

            <div className="flex items-baseline justify-between border-t border-border-light pt-3">
              <span className="font-sans text-sm text-foreground-secondary">
                {t("checkout.summary.subtotal")}
              </span>
              <span className="font-sans text-base font-bold text-foreground">
                {formatPrice(group.subtotal, group.currency)}
              </span>
            </div>

            <Link
              href={`/${lang}/cart/checkout?g=${encodeURIComponent(group.id)}`}
              className="block w-full rounded-xl bg-primary py-3 text-center font-sans font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {group.sellerName
                ? t("group.checkoutSeller", { seller: group.sellerName })
                : t("group.checkout")}
            </Link>
          </section>
        );
      })}
    </div>
  );
}
