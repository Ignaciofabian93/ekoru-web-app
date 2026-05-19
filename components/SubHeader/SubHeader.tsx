"use client";

import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import {
  Newspaper,
  Package,
  ScanBarcode,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type Item = {
  label: string;
  path: string;
  icon: LucideIcon;
};

const ITEMS: Item[] = [
  { label: "Marketplace", path: "/marketplace", icon: Package },
  { label: "Stores", path: "/stores", icon: Store },
  { label: "Services", path: "/services", icon: ScanBarcode },
  { label: "Community", path: "/community", icon: Users },
  { label: "Blog", path: "/blog", icon: Newspaper },
];

export default function SubHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = ITEMS.findIndex((item) => pathname.startsWith(item.path));

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl && scrollRef.current) {
      const container = scrollRef.current;
      const offset = activeEl.offsetLeft - (container.offsetWidth - activeEl.offsetWidth) / 2;
      container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div style={{ backgroundColor: colors.surface, paddingBlock: 8, boxShadow: shadows.sm }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingInline: 12,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {ITEMS.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          const isLast = index === ITEMS.length - 1;

          return (
            <button
              key={item.path}
              ref={(el) => { itemRefs.current[index] = el; }}
              type="button"
              onClick={() => router.push(item.path)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingInline: 12,
                paddingBlock: 6,
                borderRadius: borderRadius["2xl"],
                marginRight: isLast ? 0 : 6,
                backgroundColor: isActive ? colors.primary : colors.backgroundSecondary,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                opacity: 1,
                transition: "opacity 0.1s ease",
              }}
            >
              <div style={{ marginRight: 5 }}>
                <Icon
                  size={16}
                  color={isActive ? colors.onPrimary : colors.foregroundSecondary}
                  strokeWidth={2}
                />
              </div>
              <span
                style={{
                  fontSize: fontSize.sm,
                  fontFamily: fontFamily.sans,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? colors.onPrimary : colors.foregroundSecondary,
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
