import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getStoresDictionary, NAMESPACE } from "../i18n";
import { StoreCategoryContent } from "../ui/StoreCategoryContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export async function StoreCategory({ lang, slug }: Props) {
  const dict = await getStoresDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <StoreCategoryContent lang={lang} slug={slug} />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
