import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServiceCategoryContent } from "../ui/ServiceCategoryContent";
import { PageLayout } from "@/components/Layout";

export async function ServiceCategory({
  lang,
  slug,
}: {
  lang: SupportedLanguage;
  slug: string;
}) {
  const dict = await getServicesDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <ServiceCategoryContent lang={lang} slug={slug} />
      </PageLayout>
    </DictionaryProvider>
  );
}
