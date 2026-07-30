import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getBlogDictionary, NAMESPACE } from "../i18n";
import { BlogContent } from "../ui/BlogContent";
import { PageHero } from "@/components/Patterns/PageHero";
import { PageLayout } from "@/components/Layout";

export async function Blog({ lang }: { lang: SupportedLanguage }) {
  const dict = await getBlogDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<PageHero title={dict.page.title} subtitle={dict.page.subtitle} />} width="default">
        <BlogContent lang={lang} language={language} />
      </PageLayout>
    </DictionaryProvider>
  );
}
