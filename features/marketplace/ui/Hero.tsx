"use client";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";

interface HeroProps {
  titleKey: string;
  subtitleKey: string;
  wallpaper?: string;
}

export function Hero({ titleKey, subtitleKey, wallpaper }: HeroProps) {
  const { t } = useTranslation(NAMESPACE);

  const WALLPAPER = wallpaper;

  return (
    <section
      className="w-full mx-auto h-[40vh] min-h-60 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${WALLPAPER})` }}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative z-10 mx-auto max-w-5xl flex flex-col gap-2 items-center justify-center h-full text-white px-4">
        <Title level="h1" size="h2" color="white" weight="semibold">
          {t(titleKey)}
        </Title>
        <Text
          size="lg"
          color="white"
          className="opacity-90 text-center"
          weight="semibold"
        >
          {t(subtitleKey)}
        </Text>
      </div>
    </section>
  );
}
