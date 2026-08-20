"use client";
import clsx from "clsx";
import Link from "next/link";
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

function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
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

function BackSide({ children }: CardBackSideProps) {
  return <Face back>{children}</Face>;
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
      {actions && !isFlipped && (
        <div
          className={clsx(
            "pointer-events-none absolute z-30",
            orientation === "vertical" ? "inset-x-0 top-0 aspect-4/3" : "inset-0",
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
