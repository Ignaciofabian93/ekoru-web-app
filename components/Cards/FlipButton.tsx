import { RotateCw } from "lucide-react";
import { useCard } from "./context/Card.context";
import type { CardFlipButtonProps } from "./types/Card.types";

/** Turns the card over. The same disc as the favorite above it on the photo. */
export function FlipButton({ label }: CardFlipButtonProps) {
  const { flip } = useCard();
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={flip}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-linear-90 from-secondary-dark to-primary-light text-on-primary shadow-sm transition-colors outline-none hover:bg-primary-active focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <RotateCw size={15} strokeWidth={2.5} aria-hidden />
    </button>
  );
}
