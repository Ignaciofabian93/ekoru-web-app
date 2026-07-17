import { ScreenShell } from "@/components/Layout/ScreenShell";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { Navigation } from "@/features/navigation/Navigation";
import { getHomeDictionary, NAMESPACE } from "../i18n";
import { CategoriesSection } from "../ui/CategoriesSection";
import { HomeHero } from "../ui/HomeHero";
import { StatsSection } from "../ui/StatsSection";
import { StoresHighlight } from "../ui/StoresHighlight";
// import { ProductsHighlight } from "../ui/ProductsHighlight";
import { ExchangeHighlight } from "../ui/ExchangeHighlight";
import { ServicesHighlight } from "../ui/ServicesHighlight";
import { AdBannerSection } from "../ui/AdBannerSection";
import { StoreProductsHighlight } from "../ui/StoreProductsHighlight";
import { ContentLayout } from "@/components/Layout/ContentLayout";

export async function MainScreen({ lang }: { lang: SupportedLanguage }) {
  const [dict, marketplaceDict] = await Promise.all([
    getHomeDictionary(lang),
    getMarketplaceDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: dict, [MARKETPLACE_NAMESPACE]: marketplaceDict }}
    >
      <ScreenShell
        lang={lang}
        nav={<Navigation lang={lang} />}
        hero={<HomeHero lang={lang} />}
      >
        <ContentLayout>
          <CategoriesSection lang={lang} />
          <StatsSection />
          {/* <AdBannerSection lang={lang} variant="green" domain="stores" />
          <ProductsHighlight lang={lang} /> */}
          <AdBannerSection lang={lang} variant="teal" domain="stores" />
          <StoresHighlight lang={lang} />
          <StoreProductsHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="amber" domain="services" />
          <ServicesHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="emerald" domain="marketplace" />
          <ExchangeHighlight lang={lang} />
        </ContentLayout>
      </ScreenShell>
    </DictionaryProvider>
  );
}
