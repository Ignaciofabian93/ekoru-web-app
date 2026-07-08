import { ScreenShell } from "@/components/Layout/ScreenShell";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { Navigation } from "@/features/navigation/Navigation";

import { getHomeDictionary, NAMESPACE } from "../i18n";
import { CategoriesSection } from "../ui/CategoriesSection";
import { HomeHero } from "../ui/HomeHero";
import { StatsSection } from "../ui/StatsSection";
import { StoresHighlight } from "../ui/StoresHighlight";
import { ProductsHighlight } from "../ui/ProductsHighlight";
import { ExchangeHighlight } from "../ui/ExchangeHighlight";
import { ServicesHighlight } from "../ui/ServicesHighlight";
import { AdBannerSection } from "../ui/AdBannerSection";
import { StoreProductsHighlight } from "../ui/StoreProductsHighlight";

export async function MainScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getHomeDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell
        lang={lang}
        nav={<Navigation lang={lang} />}
        hero={<HomeHero lang={lang} />}
      >
        <CategoriesSection lang={lang} />
        <StatsSection />
        <AdBannerSection lang={lang} variant="green" domain="stores" />
        <ProductsHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="teal" domain="stores" />
        <StoresHighlight lang={lang} />
        <StoreProductsHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="amber" domain="services" />
        <ServicesHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="emerald" domain="marketplace" />
        <ExchangeHighlight lang={lang} />
      </ScreenShell>
    </DictionaryProvider>
  );
}
