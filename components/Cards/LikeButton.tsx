import clsx from "clsx";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function LikeButton({ isLiked, ariaLabel, onClick }: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isLiked}
      onClick={onClick}
      className={clsx(
        "flex size-8 cursor-pointer items-center justify-center",
        "rounded-full bg-white shadow-sm shadow-slate-900/10",
        "transition-transform hover:scale-105",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
    >
      <Heart
        size={17}
        strokeWidth={2}
        className={isLiked ? "fill-red-500 text-red-500" : "text-foreground"}
      />
    </button>
  );
}
