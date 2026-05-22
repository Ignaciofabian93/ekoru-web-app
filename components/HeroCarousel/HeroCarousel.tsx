"use client";

import clsx from "clsx";
import {
  ArrowRight,
  Footprints,
  Globe,
  Leaf,
  Store,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
    gradient: ["var(--color-primary-dark)", "#2d6a0f", "var(--color-primary)"],
    Icon: Leaf,
    cta: "Explore Now",
  },
  {
    id: "2",
    label: "Eco Stores",
    title: "Local & Verified",
    subtitle: "Shop from sustainable businesses in your community",
    gradient: ["var(--color-secondary-dark)", "#0c7b95", "#14b8a6"],
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
    gradient: ["var(--color-primary-dark)", "#1e4d10", "var(--color-secondary-dark)"],
    Icon: Footprints,
    cta: "Join Now",
  },
];

function SlideItem({ item }: { item: SlideData }) {
  const { Icon } = item;
  return (
    <div
      // gradient is per-slide data, so the background stays inline
      style={{
        background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]}, ${item.gradient[2]})`,
      }}
      className="relative flex h-full min-w-full flex-col overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute -top-25 -right-20 size-75 rounded-full bg-white/7" />
      <div className="absolute -bottom-17.5 -left-17.5 size-55 rounded-full bg-white/7" />
      <div className="absolute top-[28%] right-[22%] size-25 rounded-full bg-white/3.5" />

      {/* Bottom scrim */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-b from-transparent to-black/52" />

      {/* Content */}
      <div className="relative flex flex-1 flex-col justify-between p-5 pb-11.5">
        <div className="flex flex-row items-center gap-2.5">
          <div className="flex size-9.5 items-center justify-center rounded-lg border border-white/25 bg-white/18 text-on-primary">
            <Icon size={18} color="currentColor" strokeWidth={1.5} />
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/18 px-3 py-1.25">
            <span className="font-sans text-xs font-semibold tracking-[0.3px] text-on-primary">
              {item.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-sans text-3xl font-bold leading-8.5 tracking-[-0.5px] text-on-primary">
            {item.title}
          </span>
          <span className="font-sans text-sm font-normal leading-5 text-white/82">
            {item.subtitle}
          </span>
          <button
            type="button"
            className="mt-0.5 inline-flex flex-row items-center gap-1.25 self-start rounded-2xl border border-white/35 bg-white/18 px-3.5 py-2 text-on-primary"
          >
            <span className="font-sans text-sm font-semibold text-on-primary">
              {item.cta}
            </span>
            <ArrowRight size={13} color="currentColor" strokeWidth={2.5} />
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
      trackRef.current.scrollTo({
        left: index * trackRef.current.offsetWidth,
        behavior: "smooth",
      });
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
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const index = Math.round(trackRef.current.scrollLeft / trackRef.current.offsetWidth);
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-[40vh] min-h-60 overflow-hidden">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onMouseEnter={() => {
          isUserScrolling.current = true;
        }}
        onMouseLeave={() => {
          isUserScrolling.current = false;
          startAutoPlay();
        }}
        className="flex h-full snap-x snap-mandatory scroll-smooth overflow-x-scroll scrollbar-none"
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="h-full min-w-full snap-start">
            <SlideItem item={slide} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="pointer-events-none absolute right-5 bottom-4 flex flex-row items-center gap-1.25">
        {SLIDES.map((_, index) => (
          <div
            key={index}
            className={clsx(
              "h-1 rounded-xs bg-on-primary transition-[width,opacity] duration-300",
              index === currentIndex ? "w-5 opacity-100" : "w-1.5 opacity-40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
