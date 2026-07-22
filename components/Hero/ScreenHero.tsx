"use client";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import clsx from "clsx";

interface HeroProps {
  wallpaper?: string;
  title?: string;
  subtitle?: string;
}

export function Hero({ wallpaper, title, subtitle }: HeroProps) {
  const WALLPAPER = wallpaper;

  return (
    <section
      className="w-full mx-auto h-[40vh] min-h-60 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${WALLPAPER})` }}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div
        className={clsx(
          "relative z-10 mx-auto max-w-5xl flex flex-col gap-2",
          "items-center justify-center h-full text-white px-4",
        )}
      >
        <Title level="h1" size="h2" color="white" weight="semibold">
          {title}
        </Title>
        <Text
          size="lg"
          color="white"
          className="opacity-90 text-center"
          weight="semibold"
          align="center"
        >
          {subtitle}
        </Text>
      </div>
    </section>
  );
}
