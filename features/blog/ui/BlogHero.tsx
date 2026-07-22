"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

interface Props {
  titleKey?: string;
  subtitleKey?: string;
  params?: Record<string, string>;
}

export function BlogHero({
  titleKey = "page.title",
  subtitleKey = "page.subtitle",
  params,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  const WALLPAPER = "/wallpapers/wallpaper-1.jpg";

  return (
    <section
      className="w-full mx-auto h-[40vh] min-h-60 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${WALLPAPER})` }}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden />
      <div className="relative z-10 mx-auto max-w-5xl flex flex-col gap-2 items-center justify-center h-full text-white px-4">
        <Title level="h1" size="h2" color="white" weight="semibold">
          {t(titleKey, params)}
        </Title>
        <Text
          size="lg"
          color="white"
          className="opacity-90 text-center"
          weight="semibold"
          align="center"
        >
          {t(subtitleKey, params)}
        </Text>
      </div>
    </section>
  );
}
