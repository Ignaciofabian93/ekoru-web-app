import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreShell } from "../ui/StoreShell";
import { StoreSubCategoryContent } from "../ui/StoreSubCategoryContent";

interface Props {
  lang: SupportedLanguage;
  categorySlug: string;
  subCategorySlug: string;
}

export async function StoreSubCategory({
  lang,
  categorySlug,
  subCategorySlug,
}: Props) {
  const dict = await getStoresDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <StoreShell nav={<Navigation lang={lang} />}>
        <StoreSubCategoryContent
          lang={lang}
          categorySlug={categorySlug}
          subCategorySlug={subCategorySlug}
        />
      </StoreShell>
    </DictionaryProvider>
  );
}
