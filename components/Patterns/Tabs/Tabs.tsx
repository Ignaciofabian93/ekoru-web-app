"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export interface Tab {
  key: string;
  label: string;
  /** Optional count shown as a muted number beside the label. */
  count?: number;
  /** When set, the tab navigates (rendered as a <Link>) instead of firing
   *  `onSelect`. Used by the browse category/subcategory rows. */
  href?: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeKey: string;
  /** Fired for button tabs (those without an `href`). */
  onSelect?: (key: string) => void;
  ariaLabel?: string;
  /** Bump when something outside `tabs` changes a label's width (e.g. language)
   *  so the sliding indicator remeasures. */
  remeasureKey?: string | number;
  /** Let the row scroll horizontally when the tabs overflow (long category rows). */
  scrollable?: boolean;
}

/**
 * Text tabs with a single primary underline that slides to the active tab.
 * The bar is measured off the active tab so it hugs each label's real width.
 * Tabs are buttons (`onSelect`) by default, or links when a tab carries an
 * `href` — so the same component drives both the profile listings filters and
 * the marketplace / store / services category & subcategory navigation.
 */
export function Tabs({
  tabs,
  activeKey,
  onSelect,
  ariaLabel,
  remeasureKey,
  scrollable = false,
}: TabsProps) {
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Counts change a label's width, so fold them into the effect deps.
  const countsKey = tabs.map((t) => t.count ?? "").join(",");

  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeKey];
      // No match (e.g. a category row with nothing selected) hides the bar.
      setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeKey, countsKey, remeasureKey, tabs.length]);

  const tabClass = (active: boolean) =>
    clsx(
      "flex shrink-0 items-center gap-2 whitespace-nowrap pb-2.5 text-sm font-semibold transition-colors",
      active ? "text-primary" : "text-foreground-tertiary hover:text-foreground-secondary",
    );

  const renderContent = (tab: Tab, active: boolean) => (
    <>
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
    </>
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        "relative flex items-center gap-6 border-b border-border-light",
        scrollable && "scrollbar-none overflow-x-auto",
      )}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeKey;

        if (tab.href) {
          return (
            <Link
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              href={tab.href}
              role="tab"
              aria-selected={active}
              className={tabClass(active)}
            >
              {renderContent(tab, active)}
            </Link>
          );
        }

        return (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[tab.key] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect?.(tab.key)}
            className={tabClass(active)}
          >
            {renderContent(tab, active)}
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
