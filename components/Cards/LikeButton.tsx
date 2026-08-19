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
        "rounded-full",
        "bg-white/75",
        "shadow-sm transition-colors",
        "hover:bg-white",
      )}
    >
      <Heart
        size={15}
        strokeWidth={2}
        className={isLiked ? "fill-red-500 text-red-500" : "text-foreground-secondary"}
      />
    </button>
  );
}
