import clsx from "clsx";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useRef } from "react";

interface ScrollButtonProps {
  handleScroll: (direction: number) => void;
  ariaLabel: string;
  disabled?: boolean;
  icon: LucideIcon;
}

interface CardScrollerProps {
  handleScroll: (direction: number) => void;
  scrollPreviousAriaLabel: string;
  scrollNextAriaLabel: string;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  children: React.ReactNode;
}

const SCROLL_STEP = 336;

function ScrollButton({ handleScroll, ariaLabel, disabled, icon }: ScrollButtonProps) {
  const Icon = icon;
  return (
    <button
      type="button"
      onClick={() => handleScroll(-SCROLL_STEP)}
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        "hidden size-9 shrink-0 items-center justify-center rounded-full border border-border",
        "bg-surface text-foreground shadow-sm transition",
        "hover:border-primary hover:text-primary md:flex",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      <Icon size={18} strokeWidth={2} />
    </button>
  );
}

export function CardScroller({
  handleScroll,
  canScrollLeft,
  canScrollRight,
  children,
  scrollPreviousAriaLabel,
  scrollNextAriaLabel,
}: CardScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-2">
      <ScrollButton
        icon={ChevronLeft}
        handleScroll={() => handleScroll(-SCROLL_STEP)}
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
        handleScroll={() => handleScroll(SCROLL_STEP)}
        ariaLabel={scrollNextAriaLabel}
        disabled={!canScrollRight}
      />
    </div>
  );
}
