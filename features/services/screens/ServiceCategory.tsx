import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServiceCategoryContent } from "../ui/ServiceCategoryContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

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
      <Layout.Screen>
        <Navigation lang={lang} />
        <ServiceCategoryContent lang={lang} slug={slug} />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
