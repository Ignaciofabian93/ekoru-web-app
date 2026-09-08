"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  tabsCountClass,
  tabsIndicatorClass,
  tabsItemClass,
  tabsListClass,
  tabsScrollableClass,
  tabsScrollButtonClass,
  tabsScrollerClass,
} from "@/design/tabs";
import { useCardScroller } from "@/hooks/useCardScroller";
import { useTranslation } from "@/i18n/context";

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
  /** Overrides the `common` labels on the desktop scroll arrows. */
  scrollPreviousLabel?: string;
  scrollNextLabel?: string;
}

function ScrollButton({
  onPress,
  ariaLabel,
  disabled,
  icon: Icon,
}: {
  onPress: () => void;
  ariaLabel: string;
  disabled: boolean;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        tabsScrollButtonClass,
        disabled && "pointer-events-none opacity-40",
      )}
    >
      <Icon size={16} strokeWidth={2} aria-hidden />
    </button>
  );
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
  scrollPreviousLabel,
  scrollNextLabel,
}: TabsProps) {
  const { t } = useTranslation("common");
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  // Same rail mechanics as the home card scrollers. A row that fits shows no
  // arrows at all, so the short filter rows keep the layout they have today.
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll } = useCardScroller(
    tabs.length,
  );
  const showArrows = scrollable && (canScrollLeft || canScrollRight);

  /** Just under a full page of tabs, so the row always keeps a landmark. */
  const step = () => (scrollRef.current?.clientWidth ?? 0) * 0.7 || 240;
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(
    null,
  );

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

  const renderContent = (tab: Tab, active: boolean) => (
    <>
      {tab.label}
      {typeof tab.count === "number" && (
        <span className={tabsCountClass[active ? "active" : "idle"]}>{tab.count}</span>
      )}
    </>
  );

  const list = (
    <div
      ref={scrollable ? scrollRef : undefined}
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        tabsListClass,
        // Inside the arrow row the list is the flex child that gives; without
        // `min-w-0` it would size to its content and push the arrows off-screen.
        scrollable && clsx(tabsScrollableClass, "min-w-0 flex-1"),
      )}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        const className = tabsItemClass[active ? "active" : "idle"];

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
              className={className}
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
            className={className}
          >
            {renderContent(tab, active)}
          </button>
        );
      })}
      {indicator && (
        <span
          aria-hidden
          className={tabsIndicatorClass}
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
      )}
    </div>
  );

  if (!scrollable) return list;

  // The wrapper is always here for a scrollable row, arrows or not: moving the
  // list between two parents would remount it, and the scroll listener the
  // measuring hook bound to the old node would go with it.
  return (
    <div className={tabsScrollerClass}>
      {showArrows && (
        <ScrollButton
          icon={ChevronLeft}
          onPress={() => handleScroll(-step())}
          ariaLabel={scrollPreviousLabel ?? t("scrollPrevious")}
          disabled={!canScrollLeft}
        />
      )}
      {list}
      {showArrows && (
        <ScrollButton
          icon={ChevronRight}
          onPress={() => handleScroll(step())}
          ariaLabel={scrollNextLabel ?? t("scrollNext")}
          disabled={!canScrollRight}
        />
      )}
    </div>
  );
}
