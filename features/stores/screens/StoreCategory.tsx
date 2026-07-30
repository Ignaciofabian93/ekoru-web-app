import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreCategoryContent } from "../ui/StoreCategoryContent";
import { PageLayout } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export async function StoreCategory({ lang, slug }: Props) {
  const dict = await getStoresDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <StoreCategoryContent lang={lang} slug={slug} />
      </PageLayout>
    </DictionaryProvider>
  );
}
