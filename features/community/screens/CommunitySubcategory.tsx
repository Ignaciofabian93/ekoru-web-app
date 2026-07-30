import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunitySubcategoryContent } from "../ui/CommunitySubcategoryContent";
import { PageLayout } from "@/components/Layout";

export async function CommunitySubcategory({
  lang,
  categorySlug,
  slug,
}: {
  lang: SupportedLanguage;
  categorySlug: string;
  slug: string;
}) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <CommunitySubcategoryContent
          lang={lang}
          language={language}
          categorySlug={categorySlug}
          slug={slug}
        />
      </PageLayout>
    </DictionaryProvider>
  );
}
