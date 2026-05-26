import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { MarketplaceContent } from "../ui/MarketplaceContent";
import { MarketplaceHero } from "../ui/MarketplaceHero";
import { MarketplaceShell } from "../ui/MarketplaceShell";

export async function Marketplace({ lang }: { lang: SupportedLanguage }) {
  const dict = await getMarketplaceDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <MarketplaceShell
        nav={<Navigation lang={lang} />}
        hero={<MarketplaceHero />}
      >
        <MarketplaceContent lang={lang} language={language} />
      </MarketplaceShell>
    </DictionaryProvider>
  );
}
