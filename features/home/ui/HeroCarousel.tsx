"use client";
import clsx from "clsx";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type GradientStops,
  iconSize,
  iconStroke,
  letterSpacing,
  lineHeight,
} from "@/design/tokens";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

const AUTO_PLAY_INTERVAL = 4500;

export interface HeroSlide {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: GradientStops;
  Icon: LucideIcon;
}

function SlideItem({ item }: { item: HeroSlide }) {
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

      {/* Content — background stays full-width, content aligns to the page width */}
      <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between p-5 pb-11.5">
        <div className="flex flex-row items-center gap-2.5">
          <div
            className={clsx(
              "flex size-9.5 items-center justify-center",
              "rounded-lg border border-white/25",
              "bg-white/18",
              "text-on-primary",
            )}
          >
            <Icon
              size={iconSize.md}
              color="currentColor"
              strokeWidth={iconStroke.default}
            />
          </div>
          <Title level="h6" size="h6" color="white">
            {item.label}
          </Title>
        </div>

        <div className="flex flex-col gap-1.5">
          <Title
            level="h2"
            size="h2"
            color="white"
            style={{ lineHeight: lineHeight.tight, letterSpacing: letterSpacing.tight }}
          >
            {item.title}
          </Title>
          <Text variant="p" size="sm" color="white" className="opacity-80">
            {item.subtitle}
          </Text>
          <Link
            href={item.href}
            className={clsx(
              "mt-0.5 inline-flex flex-row items-center",
              "gap-1.25 self-start",
              "rounded-2xl border border-white/35",
              "bg-white/18",
              "px-3.5 py-2",
              "text-on-primary",
              "transition-colors",
              "hover:bg-white/28",
            )}
          >
            <Text variant="span" size="sm" weight="semibold" color="white">
              {item.cta}
            </Text>
            <ArrowRight
              size={iconSize.xs}
              color="currentColor"
              strokeWidth={iconStroke.strong}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
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
        const next = (prev + 1) % slides.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_PLAY_INTERVAL);
  }, [scrollToIndex, slides.length]);

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
        {slides.map((slide) => (
          <div key={slide.id} className="h-full min-w-full snap-start">
            <SlideItem item={slide} />
          </div>
        ))}
      </div>

      {/* Dot indicators — aligned to the same max-width column as the content */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-x-0 bottom-4 mx-auto",
          "flex max-w-5xl flex-row items-center justify-end",
          "gap-1.25 px-5",
        )}
      >
        {slides.map((_, index) => (
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
