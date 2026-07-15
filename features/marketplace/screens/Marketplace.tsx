import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { MarketplaceContent } from "../ui/MarketplaceContent";
import { MarketplaceShell } from "../ui/MarketplaceShell";
import { Hero } from "../ui/Hero";

export async function Marketplace({ lang }: { lang: SupportedLanguage }) {
  const dict = await getMarketplaceDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const WALLPAPER = "/wallpapers/wallpaper-1.jpg";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <MarketplaceShell
        nav={<Navigation lang={lang} />}
        hero={
          <Hero titleKey="page.title" subtitleKey="page.subtitle" wallpaper={WALLPAPER} />
        }
      >
        <MarketplaceContent lang={lang} language={language} />
      </MarketplaceShell>
    </DictionaryProvider>
  );
}
