import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { DepartmentContent } from "../ui/DepartmentContent";
import { PageLayout } from "@/components/Layout";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export async function Department({ lang, slug }: Props) {
  const dict = await getMarketplaceDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <DepartmentContent lang={lang} slug={slug} />
      </PageLayout>
    </DictionaryProvider>
  );
}
