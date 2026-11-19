"use client";
import { useEffect, useId } from "react";
import { create } from "zustand";

interface ProductCardState {
  flipped: Record<string, boolean>;
  flip: (cardId: string) => void;
  forget: (cardId: string) => void;
}

const useProductCardStore = create<ProductCardState>((set) => ({
  flipped: {},
  flip: (cardId) =>
    set((state) => ({ flipped: { ...state.flipped, [cardId]: !state.flipped[cardId] } })),
  forget: (cardId) =>
    set((state) => {
      const flipped = { ...state.flipped };
      delete flipped[cardId];
      return { flipped };
    }),
}));

/** One id per mounted card, so flipping a card never flips another one. */
export function useProductCardId() {
  const cardId = useId();
  const forget = useProductCardStore((state) => state.forget);
  useEffect(() => () => forget(cardId), [cardId, forget]);
  return cardId;
}

export const useProductCardFlipState = (cardId: string) =>
  useProductCardStore((state) => state.flipped[cardId] ?? false);

export const useFlipProductCard = (cardId: string) => {
  const flip = useProductCardStore((state) => state.flip);
  return () => flip(cardId);
};

export default useProductCardStore;
