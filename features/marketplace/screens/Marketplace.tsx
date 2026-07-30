import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { MarketplaceContent } from "../ui/MarketplaceContent";
import { PageHero } from "@/components/Patterns/PageHero";
import { PageLayout } from "@/components/Layout";

export async function Marketplace({ lang }: { lang: SupportedLanguage }) {
  const dict = await getMarketplaceDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const WALLPAPER = "/wallpapers/wallpaper-1.jpg";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout
        hero={
          <PageHero
            title={dict.page.title}
            subtitle={dict.page.subtitle}
            wallpaper={WALLPAPER}
          />
        }
        width="default"
      >
        <MarketplaceContent lang={lang} language={language} />
      </PageLayout>
    </DictionaryProvider>
  );
}
