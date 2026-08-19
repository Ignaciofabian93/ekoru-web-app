"use client";

import useCartStore, { type CartItemSource } from "@/store/useCartStore";

/**
 * How many units of one product the cart currently holds, with a setter that
 * covers the whole range: the store clamps to the line's stock and drops the
 * line entirely at zero.
 *
 * Reading straight from the cart is what keeps an in-place stepper honest —
 * emptying the cart from the drawer reverts every card showing that product,
 * with no local copy left to drift.
 *
 * Adding the *first* unit is not here: that path belongs to `useAddToCart`,
 * which owns the auth, ownership and stock rules a bare update has no business
 * re-implementing.
 */
export function useCartQuantity(source: CartItemSource, productId: number) {
  const stored = useCartStore(
    (s) =>
      s.items.find((i) => i.productId === productId && i.source === source)?.quantity ??
      0,
  );
  const isHydrated = useCartStore((s) => s.isHydrated);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  // Only trust the persisted cart after hydration, so the first client render
  // matches the server's — same guard as the cart badge.
  const quantity = isHydrated ? stored : 0;

  const setQuantity = (next: number) => updateQuantity(productId, source, next);

  return { quantity, setQuantity };
}
