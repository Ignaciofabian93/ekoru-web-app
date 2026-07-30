import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunityContent } from "../ui/CommunityContent";
import { PageHero } from "@/components/Patterns/PageHero";
import { PageLayout } from "@/components/Layout";

export async function Community({ lang }: { lang: SupportedLanguage }) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<PageHero title={dict.page.title} subtitle={dict.page.subtitle} />} width="default">
        <CommunityContent lang={lang} language={language} />
      </PageLayout>
    </DictionaryProvider>
  );
}
