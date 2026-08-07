import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getAboutEkoruDictionary, NAMESPACE } from "../i18n";
import { AboutContent } from "../ui/AboutContent";
import { AboutHero } from "../ui/AboutHero";
import { PageLayout } from "@/components/Layout";

export async function AboutEkoru({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAboutEkoruDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<AboutHero />} width="narrow">
        <AboutContent />
      </PageLayout>
    </DictionaryProvider>
  );
}
