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
        <ProductsHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="primary" />
        <StoresHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="secondary" />
        <ServicesHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="outlined" />
        <ExchangeHighlight lang={lang} />
        <AdBannerSection lang={lang} variant="ghost" />
      </ScreenShell>
    </DictionaryProvider>
  );
}
