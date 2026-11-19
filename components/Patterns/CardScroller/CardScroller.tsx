"use client";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode, Ref } from "react";
import { cardScrollerStyles } from "./styles";

const SCROLL_STEP = 336;

export interface CardScrollerProps {
  /** Scrolls the rail by `delta` pixels. */
  handleScroll: (delta: number) => void;
  scrollRef?: Ref<HTMLDivElement>;
  scrollPreviousAriaLabel: string;
  scrollNextAriaLabel: string;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  children: ReactNode;
}

interface ScrollButtonProps {
  onPress: () => void;
  ariaLabel: string;
  disabled?: boolean;
  icon: LucideIcon;
}

function ScrollButton({ onPress, ariaLabel, disabled, icon: Icon }: ScrollButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(cardScrollerStyles.button, disabled && cardScrollerStyles.buttonDisabled)}
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
    </button>
  );
}

export function CardScroller({
  handleScroll,
  scrollRef,
  canScrollLeft,
  canScrollRight,
  children,
  scrollPreviousAriaLabel,
  scrollNextAriaLabel,
}: CardScrollerProps) {
  return (
    <div className={cardScrollerStyles.root}>
      <ScrollButton
        icon={ChevronLeft}
        onPress={() => handleScroll(-SCROLL_STEP)}
        ariaLabel={scrollPreviousAriaLabel}
        disabled={!canScrollLeft}
      />
      <div ref={scrollRef} className={cardScrollerStyles.rail}>
        {children}
      </div>
      <ScrollButton
        icon={ChevronRight}
        onPress={() => handleScroll(SCROLL_STEP)}
        ariaLabel={scrollNextAriaLabel}
        disabled={!canScrollRight}
      />
    </div>
  );
}
