"use client";

import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import { ArrowRight, Footprints, Globe, Leaf, Store, type LucideIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const AUTO_PLAY_INTERVAL = 4500;

interface SlideData {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  gradient: [string, string, string];
  Icon: LucideIcon;
  cta: string;
}

const SLIDES: SlideData[] = [
  {
    id: "1",
    label: "Marketplace",
    title: "Shop Sustainably",
    subtitle: "Discover pre-loved products that care for the planet",
    gradient: [colors.primaryDark, "#2d6a0f", colors.primary],
    Icon: Leaf,
    cta: "Explore Now",
  },
  {
    id: "2",
    label: "Eco Stores",
    title: "Local & Verified",
    subtitle: "Shop from sustainable businesses in your community",
    gradient: [colors.secondaryDark, "#0c7b95", "#14b8a6"],
    Icon: Store,
    cta: "Find Stores",
  },
  {
    id: "3",
    label: "Impact",
    title: "Make It Count",
    subtitle: "Every eco-conscious purchase reduces your footprint",
    gradient: ["#134e4a", "#065f46", "#059669"],
    Icon: Globe,
    cta: "See Impact",
  },
  {
    id: "4",
    label: "Circular",
    title: "Close the Loop",
    subtitle: "Sell, swap & repair — give your items a second life",
    gradient: [colors.primaryDark, "#1e4d10", colors.secondaryDark],
    Icon: Footprints,
    cta: "Join Now",
  },
];

function SlideItem({ item }: { item: SlideData }) {
  const { Icon } = item;
  return (
    <div
      style={{
        minWidth: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]}, ${item.gradient[2]})`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", width: 300, height: 300, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.07)", top: -100, right: -80 }} />
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.07)", bottom: -70, left: -70 }} />
      <div style={{ position: "absolute", width: 100, height: 100, borderRadius: borderRadius.full, backgroundColor: "rgba(255,255,255,0.035)", top: "28%", right: "22%" }} />

      {/* Bottom scrim */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "65%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.52))", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ flex: 1, padding: 20, paddingBottom: 46, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: borderRadius.lg, backgroundColor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.25)" }}>
            <Icon size={18} color={colors.onPrimary} strokeWidth={1.5} />
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.18)", paddingInline: 12, paddingBlock: 5, borderRadius: borderRadius["2xl"], border: "1px solid rgba(255,255,255,0.3)" }}>
            <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.onPrimary, letterSpacing: 0.3 }}>
              {item.label}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: fontSize["3xl"], fontFamily: fontFamily.sans, fontWeight: 700, color: colors.onPrimary, letterSpacing: -0.5, lineHeight: "34px" }}>
            {item.title}
          </span>
          <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 400, color: "rgba(255,255,255,0.82)", lineHeight: "20px" }}>
            {item.subtitle}
          </span>
          <button
            type="button"
            style={{
              display: "inline-flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              paddingInline: 14,
              paddingBlock: 8,
              borderRadius: borderRadius["2xl"],
              marginTop: 2,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: fontSize.sm, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.onPrimary }}>
              {item.cta}
            </span>
            <ArrowRight size={13} color={colors.onPrimary} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUserScrolling = useRef(false);

  const scrollToIndex = useCallback((index: number) => {
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: index * trackRef.current.offsetWidth, behavior: "smooth" });
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (isUserScrolling.current) return;
      setCurrentIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_PLAY_INTERVAL);
  }, [scrollToIndex]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const index = Math.round(trackRef.current.scrollLeft / trackRef.current.offsetWidth);
    setCurrentIndex(index);
  };

  return (
    <div style={{ height: "40vh", minHeight: 240, position: "relative", overflow: "hidden" }}>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onMouseEnter={() => { isUserScrolling.current = true; }}
        onMouseLeave={() => { isUserScrolling.current = false; startAutoPlay(); }}
        style={{
          display: "flex",
          height: "100%",
          overflowX: "scroll",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
        }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} style={{ minWidth: "100%", height: "100%", scrollSnapAlign: "start" }}>
            <SlideItem item={slide} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          pointerEvents: "none",
        }}
      >
        {SLIDES.map((_, index) => (
          <div
            key={index}
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.onPrimary,
              width: index === currentIndex ? 20 : 6,
              opacity: index === currentIndex ? 1 : 0.4,
              transition: "width 0.3s ease, opacity 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
