import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getCommunityDictionary, NAMESPACE } from "../i18n";
import { CommunityCategoryContent } from "../ui/CommunityCategoryContent";
import { PageLayout } from "@/components/Layout";

export async function CommunityCategory({
  lang,
  slug,
}: {
  lang: SupportedLanguage;
  slug: string;
}) {
  const dict = await getCommunityDictionary(lang);
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <CommunityCategoryContent lang={lang} language={language} slug={slug} />
      </PageLayout>
    </DictionaryProvider>
  );
}
