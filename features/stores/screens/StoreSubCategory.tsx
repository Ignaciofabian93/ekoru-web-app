import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreSubCategoryContent } from "../ui/StoreSubCategoryContent";
import { PageLayout } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  categorySlug: string;
  subCategorySlug: string;
}

export async function StoreSubCategory({ lang, categorySlug, subCategorySlug }: Props) {
  const dict = await getStoresDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <StoreSubCategoryContent
          lang={lang}
          categorySlug={categorySlug}
          subCategorySlug={subCategorySlug}
        />
      </PageLayout>
    </DictionaryProvider>
  );
}
