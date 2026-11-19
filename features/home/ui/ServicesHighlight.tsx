"use client";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import type { SupportedLanguage } from "@/constants/settings";
import { useNearViewport } from "@/hooks/useNearViewport";
import { BusinessScroller, ServiceProviderCard } from "@/components/BusinessCards";
import { useServicesHomeData } from "../hooks/useServices";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";

export function ServicesHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  // Below the fold: nothing is fetched until the visitor scrolls toward it.
  const [sectionRef, near] = useNearViewport<HTMLElement>();
  const { sellers, serviceCounts, loading } = useServicesHomeData({
    language: lang,
    skip: !near,
  });

  return (
    <Section ref={sectionRef} ariaLabel={t("services.title")}>
      <SectionHeader
        align="start"
        title={t("services.title")}
        subtitle={t("services.subtitle")}
        action={
          <Link
            href={`/${lang}/services`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("services.seeAll")}
          </Link>
        }
      />
      <BusinessScroller
        items={sellers}
        loading={!near || loading}
        empty={
          <Text variant="p" size="sm">
            {t("services.noServices")}
          </Text>
        }
        renderItem={(seller) => (
          <ServiceProviderCard
            provider={seller}
            lang={lang}
            serviceCount={serviceCounts[seller.id]}
          />
        )}
      />
    </Section>
  );
}
