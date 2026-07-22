import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getBlogDictionary, NAMESPACE } from "../i18n";
import { BlogPostContent } from "../ui/BlogPostContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

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
      <Layout.Screen>
        <Navigation lang={lang} />
        <BlogPostContent
          lang={lang}
          language={language}
          categorySlug={categorySlug}
          slug={slug}
        />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
