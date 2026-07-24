"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Orientation } from "../types/Card.types";

interface CardContextValue {
  orientation: Orientation;
  isFlipped: boolean;
  flip: () => void;
  hasBackSide: boolean;
  href: string;
  ariaLabel?: string;
}

// `null` sentinel rather than a stand-in default object, so that reading the
// context outside a <Card> throws in `useCard` instead of silently succeeding
// with fake values.
const CardContext = createContext<CardContextValue | null>(null);

// Only `isFlipped` is state the card owns. Everything else is an input from the
// caller of <Card>, so it arrives as a prop and is passed straight through —
// storing those as state (as a first pass did) would freeze them at their
// initial value and ignore prop changes.
export interface CardProviderProps {
  orientation: Orientation;
  hasBackSide: boolean;
  href: string;
  ariaLabel?: string;
  children: ReactNode;
}

export function CardProvider({
  orientation,
  hasBackSide,
  href,
  ariaLabel,
  children,
}: CardProviderProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  // Functional update: never reads a stale `isFlipped` off the closure.
  const flip = useCallback(() => setIsFlipped((prev) => !prev), []);

  // Memoized so consumers re-render only when a value actually changes, not on
  // every render of the tree hosting the provider.
  const value = useMemo<CardContextValue>(
    () => ({ orientation, isFlipped, flip, hasBackSide, href, ariaLabel }),
    [orientation, isFlipped, flip, hasBackSide, href, ariaLabel],
  );

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

// Throws when a Card slot (Card.Header, Card.FlipButton, …) is rendered outside
// a <Card>, turning a silent no-op into an immediate, obvious error.
export function useCard(): CardContextValue {
  const ctx = useContext(CardContext);
  if (!ctx) {
    throw new Error(
      "useCard must be used within <Card>. Card slots only work inside a Card.",
    );
  }
  return ctx;
}
