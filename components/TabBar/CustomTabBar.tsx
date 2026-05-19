"use client";

import { borderRadius, colors, fontSize } from "@/design/tokens";
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
    <div
      style={{
        background: `linear-gradient(to right, ${colors.primaryDark}, ${colors.primary}, ${colors.primaryDark})`,
        paddingTop: 12,
        paddingInline: 8,
        paddingBottom: 12,
        position: "relative",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Sliding indicator */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 8 + indicatorX,
          width: INDICATOR_WIDTH,
          height: INDICATOR_HEIGHT,
          borderRadius: borderRadius.md,
          backgroundColor: colors.surface,
          transition: "left 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)",
          pointerEvents: "none",
        }}
      />

      <div ref={containerRef} style={{ display: "flex", flexDirection: "row", flex: 1 }}>
        {tabs.map((tab, index) => {
          const isFocused = activeIndex === index;
          const color = isFocused ? colors.primary : colors.onPrimary;

          return (
            <button
              key={tab.key}
              ref={(el) => { tabRefs.current[index] = el; }}
              type="button"
              onClick={() => onTabPress(index, tab.href)}
              aria-label={tab.label}
              aria-pressed={isFocused}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingBlock: 2,
                paddingInline: 2,
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                zIndex: 1,
              }}
            >
              {tab.icon({ focused: isFocused, color, size: 28 })}
              <span
                style={{
                  fontSize: fontSize.xs,
                  fontWeight: 700,
                  color,
                  marginTop: 1,
                  transition: "color 0.2s ease",
                }}
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
