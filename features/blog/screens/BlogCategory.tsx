import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getBlogDictionary, NAMESPACE } from "../i18n";
import { BlogCategoryContent } from "../ui/BlogCategoryContent";
import { PageLayout } from "@/components/Layout";

export async function BlogCategory({
  lang,
  slug,
}: {
  lang: SupportedLanguage;
  slug: string;
}) {
  const dict = await getBlogDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <BlogCategoryContent lang={lang} language={language} slug={slug} />
      </PageLayout>
    </DictionaryProvider>
  );
}
