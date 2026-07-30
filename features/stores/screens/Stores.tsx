import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getStoresDictionary, NAMESPACE } from "../i18n";
import { PageHero } from "@/components/Patterns/PageHero";
import { StoresContent } from "../ui/StoresContent";
import { PageLayout } from "@/components/Layout";

export async function Stores({ lang }: { lang: SupportedLanguage }) {
  const dict = await getStoresDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<PageHero title={dict.page.title} subtitle={dict.page.subtitle} />} width="default">
        <StoresContent lang={lang} language={language} />
      </PageLayout>
    </DictionaryProvider>
  );
}
