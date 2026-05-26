"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Currency } from "@/constants/settings";

export type CartItem = {
  productId: number;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  currency: Currency;
  sellerId: string;
  sellerName?: string;
  /** Free-form note that the buyer can attach to a line (size, color, etc.). */
  note?: string;
};

interface CartState {
  items: CartItem[];
  isHydrated: boolean;

  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
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
          const existing = state.items.find((i) => i.productId === rest.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === rest.productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...rest, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.productId === productId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
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
  useCartStore((s) => s.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0));

export const useCartIsEmpty = () => useCartStore((s) => s.items.length === 0);

export const useCartCurrency = () =>
  useCartStore((s) => s.items[0]?.currency ?? "CLP");

export default useCartStore;
