"use client";
import clsx from "clsx";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { CardProps } from "./types/Card.types";
import { CardProvider, useCard } from "./context/Card.context";
import { BackBody, BackFooter, BackHeader } from "./BackSide";
import { Body, Footer, Header } from "./FrontSide";

function Face({ back = false, children }: { back?: boolean; children: ReactNode }) {
  const { isFlipped } = useCard();
  const active = back ? isFlipped : !isFlipped;
  return (
    <div
      inert={!active}
      className={clsx(
        "card-face group @container flex flex-col overflow-hidden",
        "rounded-2xl border border-slate-400/40 bg-white",
        "shadow-md shadow-slate-900/20",
        back ? "absolute inset-0 rotate-y-180" : "relative size-full",
        active ? "visible" : "invisible",
      )}
    >
      {children}
    </div>
  );
}

/** The front face is one link: an anchor stretched over it, under the controls. */
function FrontSide({ children }: { children: ReactNode }) {
  const { href, ariaLabel } = useCard();
  return (
    <Face>
      <Link href={href} aria-label={ariaLabel} className="absolute inset-0 z-10" />
      {children}
    </Face>
  );
}

function BackSide({ children }: { children: ReactNode }) {
  return <Face back>{children}</Face>;
}

function CardScene({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  const { isFlipped } = useCard();
  const [hasFlipped, setHasFlipped] = useState(false);
  if (isFlipped && !hasFlipped) setHasFlipped(true);

  return (
    <div className="relative mx-auto size-full max-w-60 min-w-0 transition-transform duration-200">
      <div
        className={clsx(
          "relative size-full transform-3d transition-transform duration-500 ease-out",
          isFlipped && "rotate-y-180",
        )}
      >
        {children}
      </div>
      {actions && (
        <div
          inert={isFlipped}
          className={clsx(
            "pointer-events-none absolute inset-x-2 top-2 z-30 aspect-square transition-opacity",
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

export function Card({ children, href, ariaLabel, actions, onEdit }: CardProps) {
  return (
    <CardProvider
      href={href}
      ariaLabel={ariaLabel}
      isManaged={Boolean(actions || onEdit)}
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
