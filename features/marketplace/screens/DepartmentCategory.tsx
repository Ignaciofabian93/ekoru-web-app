import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { DepartmentCategoryContent } from "../ui/DepartmentCategoryContent";
import { PageLayout } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  departmentSlug: string;
  categorySlug: string;
}

export async function DepartmentCategory({ lang, departmentSlug, categorySlug }: Props) {
  const dict = await getMarketplaceDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <DepartmentCategoryContent
          lang={lang}
          departmentSlug={departmentSlug}
          categorySlug={categorySlug}
        />
      </PageLayout>
    </DictionaryProvider>
  );
}
