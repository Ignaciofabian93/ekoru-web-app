"use client";
import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { useProductCardFlipState } from "./context/ProductCardContext";
import { cardStyles } from "./styles";

interface CardWrapperProps {
  cardId: string;
  front: ReactNode;
  back: ReactNode;
  actions?: ReactNode;
}

export default function CardWrapper({ cardId, front, back, actions }: CardWrapperProps) {
  const isFlipped = useProductCardFlipState(cardId);
  // The back side (a lazy chunk) mounts on the first flip and stays for the flip back.
  const [hasFlipped, setHasFlipped] = useState(isFlipped);
  if (isFlipped && !hasFlipped) setHasFlipped(true);

  return (
    <article className={cardStyles.scene}>
      <div className={clsx(cardStyles.flipper, isFlipped && cardStyles.flipped)}>
        <div
          inert={isFlipped}
          className={clsx(
            cardStyles.face,
            cardStyles.front,
            isFlipped ? cardStyles.inactive : cardStyles.active,
          )}
        >
          {front}
        </div>
        <div
          inert={!isFlipped}
          className={clsx(
            cardStyles.face,
            cardStyles.back,
            isFlipped ? cardStyles.active : cardStyles.inactive,
          )}
        >
          {hasFlipped && back}
        </div>
      </div>

      {actions && (
        <div
          inert={isFlipped}
          className={clsx(
            cardStyles.actions,
            isFlipped
              ? cardStyles.actionsHidden
              : hasFlipped
                ? cardStyles.actionsReturning
                : cardStyles.actionsShown,
          )}
        >
          <div className={cardStyles.actionsSlot}>{actions}</div>
        </div>
      )}
    </article>
  );
}
