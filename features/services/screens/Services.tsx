import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServicesContent } from "../ui/ServicesContent";
import { ServicesHero } from "../ui/ServicesHero";
import { ScreenShell } from "@/components/Layout/ScreenShell";

export async function Services({ lang }: { lang: SupportedLanguage }) {
  const dict = await getServicesDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ServicesHero />}>
        <ServicesContent lang={lang} language={language} />
      </ScreenShell>
    </DictionaryProvider>
  );
}
