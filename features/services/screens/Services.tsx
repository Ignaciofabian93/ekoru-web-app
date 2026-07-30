import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServicesContent } from "../ui/ServicesContent";
import { PageHero } from "@/components/Patterns/PageHero";
import { PageLayout } from "@/components/Layout";

export async function Services({ lang }: { lang: SupportedLanguage }) {
  const dict = await getServicesDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<PageHero title={dict.page.title} subtitle={dict.page.subtitle} />} width="default">
        <ServicesContent lang={lang} language={language} />
      </PageLayout>
    </DictionaryProvider>
  );
}
