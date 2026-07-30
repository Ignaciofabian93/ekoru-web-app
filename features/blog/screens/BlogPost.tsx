import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getBlogDictionary, NAMESPACE } from "../i18n";
import { BlogPostContent } from "../ui/BlogPostContent";
import { PageLayout } from "@/components/Layout";

export async function BlogPost({
  lang,
  categorySlug,
  slug,
}: {
  lang: SupportedLanguage;
  categorySlug: string;
  slug: string;
}) {
  const dict = await getBlogDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <BlogPostContent
          lang={lang}
          language={language}
          categorySlug={categorySlug}
          slug={slug}
        />
      </PageLayout>
    </DictionaryProvider>
  );
}
