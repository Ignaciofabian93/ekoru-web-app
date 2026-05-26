"use client";
import { useTranslation } from "@/i18n/context";
import { useCart } from "../hooks/useCart";
import { CartItemRow } from "./CartItemRow";

export function CartList() {
  const { items, updateQuantity, removeItem } = useCart();
  const { t } = useTranslation("cart");

  return (
    <ul
      aria-label={t("a11y.cartSection")}
      className="flex flex-col gap-3"
    >
      {items.map((item) => (
        <CartItemRow
          key={item.productId}
          item={item}
          onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
          onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
          onRemove={() => removeItem(item.productId)}
        />
      ))}
    </ul>
  );
}
