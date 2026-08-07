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
  /**
   * The viewer owns this listing and is managing it (owner actions were passed
   * to <Card>), so the shopper controls — favorite and the buy/book CTA — give
   * way to the owner's. The back face stays available: an owner still wants to
   * see their listing's impact.
   */
  isManaged: boolean;
  /**
   * Management mode's primary action, rendered as the footer CTA in place of
   * the shopper's buy/book button. Without it the footer is omitted.
   */
  onEdit?: () => void;
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
  isManaged: boolean;
  onEdit?: () => void;
  children: ReactNode;
}

export function CardProvider({
  orientation,
  hasBackSide,
  href,
  ariaLabel,
  isManaged,
  onEdit,
  children,
}: CardProviderProps) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  // Functional update: never reads a stale `isFlipped` off the closure.
  const flip = useCallback(() => setIsFlipped((prev) => !prev), []);

  // Memoized so consumers re-render only when a value actually changes, not on
  // every render of the tree hosting the provider.
  const value = useMemo<CardContextValue>(
    () => ({
      orientation,
      isFlipped,
      flip,
      hasBackSide,
      href,
      ariaLabel,
      isManaged,
      onEdit,
    }),
    [orientation, isFlipped, flip, hasBackSide, href, ariaLabel, isManaged, onEdit],
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
