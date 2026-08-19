import clsx from "clsx";
import { useCard } from "./context/Card.context";
import type { CardFlipButtonProps } from "./types/Card.types";
import { RotateCw } from "lucide-react";

export function FlipButton({ label, className }: CardFlipButtonProps) {
  const { flip } = useCard();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => flip()}
      className={clsx(
        "bg-primary text-on-primary hover:bg-primary-active",
        "flex size-8 cursor-pointer items-center justify-center",
        "rounded-full shadow-sm transition-colors",
        className,
      )}
    >
      <RotateCw size={14} strokeWidth={2.5} />
    </button>
  );
}
