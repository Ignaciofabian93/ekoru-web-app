"use client";
import Link from "next/link";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useStoresHomeData } from "../hooks/useStores";
import type { SupportedLanguage } from "@/constants/settings";
import { useNearViewport } from "@/hooks/useNearViewport";
import { Text } from "@/components/Primitives/Text";
import { Section } from "@/components/Layout";
import { SectionHeader } from "@/components/Patterns/SectionHeader";
import { BusinessScroller, StoreCard } from "@/components/BusinessCards";

export function StoresHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  // Below the fold: nothing is fetched until the visitor scrolls toward it.
  const [sectionRef, near] = useNearViewport<HTMLElement>();
  const { sellers, productCounts, loading } = useStoresHomeData({
    language: lang,
    skip: !near,
  });

  return (
    <Section ref={sectionRef} ariaLabel={t("stores.title")}>
      <SectionHeader
        align="start"
        title={t("stores.title")}
        subtitle={t("stores.subtitle")}
        action={
          <Link
            href={`/${lang}/stores`}
            className="shrink-0 rounded-sm text-sm font-semibold text-primary underline outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("stores.seeAll")}
          </Link>
        }
      />
      <BusinessScroller
        items={sellers}
        loading={!near || loading}
        empty={
          <Text variant="p" size="sm">
            {t("stores.noStores")}
          </Text>
        }
        renderItem={(seller) => (
          <StoreCard store={seller} lang={lang} productCount={productCounts[seller.id]} />
        )}
      />
    </Section>
  );
}
