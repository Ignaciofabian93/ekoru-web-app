import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getServicesDictionary, NAMESPACE } from "../i18n";
import { ServiceSubcategoryContent } from "../ui/ServiceSubcategoryContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

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
      <Layout.Screen>
        <Navigation lang={lang} />
        <ServiceSubcategoryContent
          lang={lang}
          categorySlug={categorySlug}
          slug={slug}
        />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
