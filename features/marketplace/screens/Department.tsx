import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { DepartmentContent } from "../ui/DepartmentContent";
import { MarketplaceShell } from "../ui/MarketplaceShell";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export async function Department({ lang, slug }: Props) {
  const dict = await getMarketplaceDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <MarketplaceShell nav={<Navigation lang={lang} />}>
        <DepartmentContent lang={lang} language={language} slug={slug} />
      </MarketplaceShell>
    </DictionaryProvider>
  );
}
