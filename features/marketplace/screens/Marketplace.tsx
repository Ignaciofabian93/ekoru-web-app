import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { MarketplaceContent } from "../ui/MarketplaceContent";
import { Hero } from "../ui/Hero";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

export async function Marketplace({ lang }: { lang: SupportedLanguage }) {
  const dict = await getMarketplaceDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const WALLPAPER = "/wallpapers/wallpaper-1.jpg";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <Hero titleKey="page.title" subtitleKey="page.subtitle" wallpaper={WALLPAPER} />
        <Layout.Container size="default">
          <MarketplaceContent lang={lang} language={language} />
        </Layout.Container>
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
