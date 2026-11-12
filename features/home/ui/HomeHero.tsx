"use client";
import { Book, Leaf, Map, Store, UsersRound, Wrench } from "lucide-react";
import HeroCarousel, { type HeroSlide } from "@/features/home/ui/HeroCarousel";
import { heroFrameClass } from "@/design/hero";
import { gradients } from "@/design/tokens";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

type SlideId = "marketplace" | "stores" | "services" | "recycle" | "community" | "blog";

const SLIDE_CONFIG: {
  id: SlideId;
  path: string;
  gradient: HeroSlide["gradient"];
  Icon: HeroSlide["Icon"];
}[] = [
  { id: "marketplace", path: "/marketplace", gradient: gradients.forest, Icon: Leaf },
  { id: "stores", path: "/stores", gradient: gradients.ocean, Icon: Store },
  { id: "services", path: "/services", gradient: gradients.moss, Icon: Wrench },
  { id: "recycle", path: "/recycle", gradient: gradients.jungle, Icon: Map },
  { id: "community", path: "/community", gradient: gradients.meadow, Icon: UsersRound },
  { id: "blog", path: "/blog", gradient: gradients.river, Icon: Book },
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
    <div className={heroFrameClass}>
      <HeroCarousel slides={slides} />
    </div>
  );
}
