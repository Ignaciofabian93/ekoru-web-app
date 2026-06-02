import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreHero } from "../ui/StoreHero";
import { StoreShell } from "../ui/StoreShell";
import { StoresContent } from "../ui/StoresContent";

export async function Stores({ lang }: { lang: SupportedLanguage }) {
  const dict = await getStoresDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <StoreShell nav={<Navigation lang={lang} />} hero={<StoreHero />}>
        <StoresContent lang={lang} language={language} />
      </StoreShell>
    </DictionaryProvider>
  );
}
