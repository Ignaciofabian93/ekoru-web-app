"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface UnderlineTab {
  key: string;
  label: string;
  /** Optional count shown as a muted number beside the label. */
  count?: number;
}

interface Props {
  tabs: UnderlineTab[];
  activeKey: string;
  onSelect: (key: string) => void;
  ariaLabel?: string;
  /** Bump when something outside `tabs` changes a label's width (e.g. language)
   *  so the sliding indicator remeasures. */
  remeasureKey?: string | number;
}

/**
 * Text tabs with a single primary underline that slides to the active tab.
 * The bar is measured off the active tab so it hugs each label's real width.
 * Used for both the status filter and the product/service kind switch.
 */
export function UnderlineTabs({ tabs, activeKey, onSelect, ariaLabel, remeasureKey }: Props) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Counts change a label's width, so fold them into the effect deps.
  const countsKey = tabs.map((t) => t.count ?? "").join(",");

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeKey];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeKey, countsKey, remeasureKey, tabs.length]);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="relative flex items-center gap-6 border-b border-border-light"
    >
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(tab.key)}
            className={clsx(
              "flex items-center gap-2 whitespace-nowrap pb-2.5 text-sm font-semibold transition-colors",
              active
                ? "text-primary"
                : "text-foreground-tertiary hover:text-foreground-secondary",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={clsx(
                  "text-xs font-medium tabular-nums transition-colors",
                  active ? "text-primary/70" : "text-foreground-muted",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
      {indicator && (
        <span
          aria-hidden
          className="absolute -bottom-px h-0.5 rounded-full bg-primary transition-[transform,width] duration-300 ease-out"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
      )}
    </div>
  );
}
