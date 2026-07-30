import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServiceSubcategoryContent } from "../ui/ServiceSubcategoryContent";
import { PageLayout } from "@/components/Layout";

export async function ServiceSubcategory({
  lang,
  categorySlug,
  slug,
}: {
  lang: SupportedLanguage;
  categorySlug: string;
  slug: string;
}) {
  const dict = await getServicesDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout contained={false}>
        <ServiceSubcategoryContent lang={lang} categorySlug={categorySlug} slug={slug} />
      </PageLayout>
    </DictionaryProvider>
  );
}
