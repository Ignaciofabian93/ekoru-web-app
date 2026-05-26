"use client";
import useCartStore, {
  useCartCount,
  useCartCurrency,
  useCartIsEmpty,
  useCartItems,
  useCartSubtotal,
} from "@/store/useCartStore";

export function useCart() {
  const items = useCartItems();
  const count = useCartCount();
  const subtotal = useCartSubtotal();
  const isEmpty = useCartIsEmpty();
  const currency = useCartCurrency();

  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);
  const isHydrated = useCartStore((s) => s.isHydrated);

  return {
    items,
    count,
    subtotal,
    isEmpty,
    currency,
    isHydrated,
    removeItem,
    updateQuantity,
    clear,
  };
}
