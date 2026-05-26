"use client";
import { Title } from "@/components/Title/Title";
import { Text } from "@/components/Text/Text";
import { useTranslation } from "@/i18n/context";

import { NAMESPACE } from "../i18n";

interface Props {
  titleKey?: string;
  subtitleKey?: string;
  params?: Record<string, string>;
}

export function MarketplaceHero({
  titleKey = "page.title",
  subtitleKey = "page.subtitle",
  params,
}: Props) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <section className="bg-linear-to-br from-primary-dark to-primary px-4 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-white">
        <Title level="h1" size="h2" color="white">
          {t(titleKey, params)}
        </Title>
        <Text color="white" className="opacity-90">
          {t(subtitleKey, params)}
        </Text>
      </div>
    </section>
  );
}
