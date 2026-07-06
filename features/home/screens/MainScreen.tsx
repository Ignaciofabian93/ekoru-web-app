import { ScreenShell } from "@/components/Layout/ScreenShell";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { Navigation } from "@/features/navigation/Navigation";

import { getHomeDictionary, NAMESPACE } from "../i18n";
import { MOCK_PRODUCTS, MOCK_STORES } from "../constants/mockData";
import { CategoriesSection } from "../ui/CategoriesSection";
import { HomeHero } from "../ui/HomeHero";
import { StatsSection } from "../ui/StatsSection";
import { StoresHighlight } from "../ui/StoresHighlight";
import { ProductsHighlight } from "../ui/ProductsHighlight";
import { ExchangeHighlight } from "../ui/ExchangeHighlight";
import { ServicesHighlight } from "../ui/ServicesHighlight";

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
        <ProductsHighlight lang={lang} products={MOCK_PRODUCTS} />
        <StoresHighlight lang={lang} stores={MOCK_STORES} />
        <ServicesHighlight lang={lang} />
        <ExchangeHighlight lang={lang} />
      </ScreenShell>
    </DictionaryProvider>
  );
}
