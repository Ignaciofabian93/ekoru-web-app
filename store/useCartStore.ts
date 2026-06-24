"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Currency } from "@/constants/settings";

/**
 * Where a cart line originated.
 * - "marketplace": individuals selling a single, unique item → quantity is always 1,
 *   no stock counter (the listing IS the one unit). Removed via a trash action.
 * - "store": businesses that manage stock → quantity counter bounded by `maxStock`.
 */
export type CartItemSource = "marketplace" | "store";

export type CartItem = {
  productId: number;
  source: CartItemSource;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  currency: Currency;
  sellerId: string;
  sellerName?: string;
  /** Available stock for store items. Undefined/irrelevant for marketplace (always 1). */
  maxStock?: number;
  /** Free-form note that the buyer can attach to a line (size, color, etc.). */
  note?: string;
};

/**
 * Two products from different sources can share the same numeric id (separate
 * tables), so a line is identified by source + productId, never id alone.
 */
export const cartLineId = (
  source: CartItemSource,
  productId: number,
): string => `${source}-${productId}`;

const sameLine = (i: CartItem, productId: number, source: CartItemSource) =>
  i.productId === productId && i.source === source;

/** Clamp a desired quantity to what the source allows. */
function clampQuantity(
  source: CartItemSource,
  desired: number,
  maxStock?: number,
): number {
  // Marketplace items are unique single units — never more than 1.
  if (source === "marketplace") return Math.min(Math.max(desired, 1), 1);
  // Store items are bounded by available stock (when known).
  const upper = typeof maxStock === "number" ? maxStock : Infinity;
  return Math.min(Math.max(desired, 1), upper);
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number, source: CartItemSource) => void;
  updateQuantity: (
    productId: number,
    source: CartItemSource,
    quantity: number,
  ) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isHydrated: false,

      addItem: ({ quantity = 1, ...rest }) =>
        set((state) => {
          const existing = state.items.find((i) =>
            sameLine(i, rest.productId, rest.source),
          );

          if (existing) {
            // Refresh maxStock from the latest add (stock may have changed),
            // then clamp the combined quantity.
            const maxStock = rest.maxStock ?? existing.maxStock;
            return {
              items: state.items.map((i) =>
                sameLine(i, rest.productId, rest.source)
                  ? {
                      ...i,
                      maxStock,
                      quantity: clampQuantity(
                        i.source,
                        i.quantity + quantity,
                        maxStock,
                      ),
                    }
                  : i,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...rest,
                quantity: clampQuantity(rest.source, quantity, rest.maxStock),
              },
            ],
          };
        }),

      removeItem: (productId, source) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, source)),
        })),

      updateQuantity: (productId, source, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              sameLine(i, productId, source)
                ? { ...i, quantity: clampQuantity(i.source, quantity, i.maxStock) }
                : i,
            )
            // A requested quantity of 0 (or below) removes the line.
            .filter((i) => !(sameLine(i, productId, source) && quantity <= 0)),
        })),

      clear: () => set({ items: [] }),

      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "ekoru_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export const useCartItems = () => useCartStore((s) => s.items);

export const useCartCount = () =>
  useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

export const useCartSubtotal = () =>
  useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
  );

export const useCartIsEmpty = () => useCartStore((s) => s.items.length === 0);

export const useCartCurrency = () =>
  useCartStore((s) => s.items[0]?.currency ?? "CLP");

export default useCartStore;
