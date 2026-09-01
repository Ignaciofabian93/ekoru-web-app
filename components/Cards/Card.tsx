"use client";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import type {
  CardBackSideProps,
  CardFrontSideProps,
  CardProps,
  Orientation,
} from "./types/Card.types";
import { CardProvider, useCard } from "./context/Card.context";
import { BackBody, BackFooter, BackHeader } from "./BackSide";
import { Body, Footer, Header } from "./FrontSide";

const FACE_CLASS: Record<Orientation, string> = {
  vertical: "w-full h-full flex-col",
  horizontal: "h-full flex-row",
};

function Face({
  children,
  back = false,
  className,
}: {
  children: React.ReactNode;
  back?: boolean;
  className?: string;
}) {
  const { orientation, isFlipped } = useCard();
  const active = back ? isFlipped : !isFlipped;
  return (
    <div
      inert={!active}
      className={clsx(
        "flex overflow-hidden justify-between rounded-lg bg-white border border-slate-200 backface-hidden",
        "shadow-sm shadow-slate-800/20 hover:shadow-md",
        FACE_CLASS[orientation],
        back ? "absolute inset-0 rotate-y-180" : "relative",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FrontSide({ children }: CardFrontSideProps) {
  const { href, ariaLabel } = useCard();
  return (
    <Face>
      <Link href={href} aria-label={ariaLabel} className="absolute inset-0 z-10" />
      {children}
    </Face>
  );
}

/**
 * The back face is a query container: a card is 240px wide on a desktop grid
 * and barely 140px in the two-column mobile one, and neither width follows the
 * viewport (the same card appears in a 2-col grid, a 4-col grid and a scroller
 * at once). So the back's slots size themselves against the card, not the
 * screen — see the `@min-[13rem]` variants in `BackSide`.
 */
function BackSide({ children }: CardBackSideProps) {
  return (
    <Face back className="@container">
      {children}
    </Face>
  );
}

const ORIENTATION_SIZE: Record<Orientation, string> = {
  vertical: "min-w-0 w-full max-w-60 h-full",
  horizontal: "min-w-80 min-h-[170px]",
};

const WRAPPER_SIZE: Record<Orientation, string> = {
  vertical: "w-full h-full",
  horizontal: "w-full h-full",
};

function CardScene({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const { orientation, isFlipped } = useCard();

  // Whether this card has ever been turned over. The owner controls fade back
  // in on the *return* trip only — on first paint they are simply there, with
  // no transition to sit through. Latched during render, the way the drawer
  // latches its first open.
  const [hasFlipped, setHasFlipped] = useState(false);
  if (isFlipped && !hasFlipped) setHasFlipped(true);

  return (
    <div
      className={clsx(
        "relative mx-auto",
        ORIENTATION_SIZE[orientation],
        "rounded-lg",
        "cursor-pointer transition-transform duration-200 ease-in-out hover:scale-[1.01]",
        "perspective-distant",
      )}
    >
      <div
        className={clsx(
          "relative transition-transform duration-500 ease-out transform-3d",
          WRAPPER_SIZE[orientation],
          isFlipped && "rotate-y-180",
        )}
      >
        {children}
      </div>
      {/* The owner controls sit outside the rotating wrapper — they are chrome
          over the card, not part of either face — so nothing hides them while
          it turns. Coming back to the front they used to snap in over a card
          still mid-rotation, reading as a button floating loose above it; the
          delay holds them until the 500ms flip has landed. Going the other way
          there is nothing to wait for, so they just fade.

          Kept mounted and faded rather than unmounted: a delayed mount would
          need a timer, and this way an interrupted flip reverses instead of
          firing late. `inert` is what actually takes them out of reach while
          they are invisible — the inner box re-enables pointer events. */}
      {actions && (
        <div
          inert={isFlipped}
          className={clsx(
            "pointer-events-none absolute z-30 transition-opacity",
            orientation === "vertical" ? "inset-x-0 top-0 aspect-4/3" : "inset-0",
            isFlipped
              ? "opacity-0 duration-150"
              : hasFlipped
                ? "opacity-100 delay-300 duration-200"
                : "opacity-100 duration-100",
          )}
        >
          <div className="pointer-events-auto absolute right-2 bottom-2">{actions}</div>
        </div>
      )}
    </div>
  );
}

export function Card({
  children,
  orientation = "vertical",
  hasBackSide = true,
  href,
  ariaLabel,
  actions,
  onEdit,
}: CardProps) {
  const isManaged = Boolean(actions || onEdit);
  return (
    <CardProvider
      orientation={orientation}
      hasBackSide={hasBackSide}
      href={href}
      ariaLabel={ariaLabel}
      isManaged={isManaged}
      onEdit={onEdit}
    >
      <CardScene actions={actions}>{children}</CardScene>
    </CardProvider>
  );
}

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;
Card.FrontSide = FrontSide;
Card.BackSide = BackSide;
Card.BackHeader = BackHeader;
Card.BackBody = BackBody;
Card.BackFooter = BackFooter;
