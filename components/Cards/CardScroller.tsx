"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import type React from "react";

interface ScrollButtonProps {
  onPress: () => void;
  ariaLabel: string;
  disabled?: boolean;
  icon: LucideIcon;
}

export interface CardScrollerProps {
  /** Scrolls the rail by `delta` pixels. */
  handleScroll: (delta: number) => void;
  /**
   * Ref for the scrolling rail. The owner reads it to derive
   * `canScrollLeft` / `canScrollRight` and to call `scrollBy`.
   */
  scrollRef?: React.Ref<HTMLDivElement>;
  scrollPreviousAriaLabel: string;
  scrollNextAriaLabel: string;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  children: React.ReactNode;
}

const SCROLL_STEP = 336;

function ScrollButton({ onPress, ariaLabel, disabled, icon: Icon }: ScrollButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        "hidden size-9 shrink-0 items-center justify-center rounded-full border border-border",
        "bg-surface text-foreground shadow-sm transition",
        "hover:border-primary hover:text-primary md:flex",
        disabled && "pointer-events-none opacity-40",
      )}
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
    <div className="flex items-center gap-2">
      <ScrollButton
        icon={ChevronLeft}
        onPress={() => handleScroll(-SCROLL_STEP)}
        ariaLabel={scrollPreviousAriaLabel}
        disabled={!canScrollLeft}
      />
      <div
        ref={scrollRef}
        className="scrollbar-none flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
      >
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
