"use client";
import { Heart, RotateCw } from "lucide-react";
import { useFlipProductCard } from "./context/ProductCardContext";
import { buttonStyles } from "./styles";

// Same chunk next/dynamic loads on flip; a failed preload is retried by the flip itself.
const preloadBackSide = () => {
  import("./BackSide").catch(() => {});
};

export function FlipButton({ cardId, label }: { cardId: string; label: string }) {
  const flip = useFlipProductCard(cardId);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={flip}
      onPointerEnter={preloadBackSide}
      onFocus={preloadBackSide}
      className={buttonStyles.flip}
    >
      <RotateCw size={15} strokeWidth={2.5} aria-hidden />
    </button>
  );
}

interface LikeButtonProps {
  isLiked: boolean;
  label: string;
  onClick: () => void;
}

export function LikeButton({ isLiked, label, onClick }: LikeButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isLiked}
      onClick={onClick}
      className={buttonStyles.like}
    >
      <Heart
        size={17}
        strokeWidth={2}
        aria-hidden
        className={isLiked ? buttonStyles.likeIconOn : buttonStyles.likeIconOff}
      />
    </button>
  );
}
