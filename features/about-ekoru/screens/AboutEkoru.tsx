import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { PageLayout } from "@/components/Layout";
import { getAboutEkoruDictionary, NAMESPACE } from "../i18n";
import { AboutContent } from "../ui/AboutContent";
import { AboutHero } from "../ui/AboutHero";

export async function AboutEkoru({ lang }: { lang: SupportedLanguage }) {
  const dict = await getAboutEkoruDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      {/* Same shell and width as the profile dashboard: the hero owns its own
          container, and the body is one card grid rather than a section stack. */}
      <PageLayout hero={<AboutHero />} width="default">
        <AboutContent />
      </PageLayout>
    </DictionaryProvider>
  );
}
