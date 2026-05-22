"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";

const INDICATOR_WIDTH = 54;
const INDICATOR_HEIGHT = 50;

export interface TabItem {
  key: string;
  label: string;
  icon: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
  href: string;
}

interface CustomTabBarProps {
  tabs: TabItem[];
  activeIndex: number;
  onTabPress: (index: number, href: string) => void;
}

export default function CustomTabBar({ tabs, activeIndex, onTabPress }: CustomTabBarProps) {
  const [indicatorX, setIndicatorX] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = tabRefs.current[activeIndex];
    const container = containerRef.current;
    if (!activeEl || !container) return;
    const tabWidth = container.offsetWidth / tabs.length;
    const x = activeIndex * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2;
    setIndicatorX(x);
  }, [activeIndex, tabs.length]);

  return (
    <div className="relative flex flex-row bg-linear-to-r from-primary-dark via-primary to-primary-dark px-2 pt-3 pb-3">
      {/* Sliding indicator — `left` is computed at runtime, so it stays inline. */}
      <div
        style={{ left: 8 + indicatorX, width: INDICATOR_WIDTH, height: INDICATOR_HEIGHT }}
        className="pointer-events-none absolute top-2.5 rounded-md bg-surface transition-[left] duration-250 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      />

      <div ref={containerRef} className="flex flex-1 flex-row">
        {tabs.map((tab, index) => {
          const isFocused = activeIndex === index;
          const color = isFocused ? "var(--color-primary)" : "var(--color-on-primary)";

          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              onClick={() => onTabPress(index, tab.href)}
              aria-label={tab.label}
              aria-pressed={isFocused}
              className="relative z-1 flex flex-1 cursor-pointer flex-col items-center justify-center px-0.5 py-0.5"
            >
              {tab.icon({ focused: isFocused, color, size: 28 })}
              <span
                className={clsx(
                  "mt-px text-xs font-bold transition-colors duration-200",
                  isFocused ? "text-primary" : "text-on-primary",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
