import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { DepartmentContent } from "../ui/DepartmentContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

interface Props {
  lang: SupportedLanguage;
  slug: string;
}

export async function Department({ lang, slug }: Props) {
  const dict = await getMarketplaceDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <DepartmentContent lang={lang} slug={slug} />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
