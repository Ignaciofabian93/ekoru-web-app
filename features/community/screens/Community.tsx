import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunityContent } from "../ui/CommunityContent";
import { CommunityHero } from "../ui/CommunityHero";
import { ScreenShell } from "@/components/Layout/ScreenShell";

export async function Community({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<CommunityHero />}>
        <CommunityContent lang={lang} language={language} />
      </ScreenShell>
    </DictionaryProvider>
  );
}
