import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { getHomeDictionary, NAMESPACE } from "../i18n";
import { CategoriesSection } from "../ui/CategoriesSection";
import { HomeHero } from "../ui/HomeHero";
import { StatsSection } from "../ui/StatsSection";
import { StoresHighlight } from "../ui/StoresHighlight";
import { ExchangeHighlight } from "../ui/ExchangeHighlight";
import { ServicesHighlight } from "../ui/ServicesHighlight";
import { AdBannerSection } from "../ui/AdBannerSection";
import { StoreProductsHighlight } from "../ui/StoreProductsHighlight";
import { Layout } from "@/components/Layout/Layout";
import { Navigation } from "@/features/navigation/Navigation";
import { Footer } from "@/features/footer/Footer";

export async function MainScreen({ lang }: { lang: SupportedLanguage }) {
  const [dict, marketplaceDict] = await Promise.all([
    getHomeDictionary(lang),
    getMarketplaceDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: dict, [MARKETPLACE_NAMESPACE]: marketplaceDict }}
    >
      <Layout.Screen>
        <Navigation lang={lang} />
        <HomeHero lang={lang} />
        <Layout.Container size="default">
          <CategoriesSection lang={lang} />
          <StatsSection />
          <AdBannerSection lang={lang} variant="teal" domain="stores" />
          <StoresHighlight lang={lang} />
          <StoreProductsHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="amber" domain="services" />
          <ServicesHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="green" domain="marketplace" />
          <ExchangeHighlight lang={lang} />
        </Layout.Container>
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
