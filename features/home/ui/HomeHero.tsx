"use client";

import { Footprints, Globe, Leaf, Store } from "lucide-react";

import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel/HeroCarousel";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

type SlideId = "marketplace" | "stores" | "impact" | "circular";

// Structural config only — copy lives in i18n (`hero.slides.*`). `path` is
// joined with the active locale so the CTA links stay localized.
const SLIDE_CONFIG: {
  id: SlideId;
  path: string;
  gradient: [string, string, string];
  Icon: HeroSlide["Icon"];
}[] = [
  {
    id: "marketplace",
    path: "/marketplace",
    gradient: ["var(--color-primary-dark)", "#2d6a0f", "var(--color-primary)"],
    Icon: Leaf,
  },
  {
    id: "stores",
    path: "/stores",
    gradient: ["var(--color-secondary-dark)", "#0c7b95", "#14b8a6"],
    Icon: Store,
  },
  {
    id: "impact",
    path: "/recycle",
    gradient: ["#134e4a", "#065f46", "#059669"],
    Icon: Globe,
  },
  {
    id: "circular",
    path: "/publish",
    gradient: ["var(--color-primary-dark)", "#1e4d10", "var(--color-secondary-dark)"],
    Icon: Footprints,
  },
];

export function HomeHero({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);

  const slides: HeroSlide[] = SLIDE_CONFIG.map((slide) => ({
    id: slide.id,
    href: `/${lang}${slide.path}`,
    gradient: slide.gradient,
    Icon: slide.Icon,
    label: t(`hero.slides.${slide.id}.label`),
    title: t(`hero.slides.${slide.id}.title`),
    subtitle: t(`hero.slides.${slide.id}.subtitle`),
    cta: t(`hero.slides.${slide.id}.cta`),
  }));

  return (
    <div className="mx-auto w-full max-w-4xl">
      <HeroCarousel slides={slides} />
    </div>
  );
}
