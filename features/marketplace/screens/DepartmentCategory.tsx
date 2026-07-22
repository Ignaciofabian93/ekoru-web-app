import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { DepartmentCategoryContent } from "../ui/DepartmentCategoryContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

interface Props {
  lang: SupportedLanguage;
  departmentSlug: string;
  categorySlug: string;
}

export async function DepartmentCategory({ lang, departmentSlug, categorySlug }: Props) {
  const dict = await getMarketplaceDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <DepartmentCategoryContent
          lang={lang}
          departmentSlug={departmentSlug}
          categorySlug={categorySlug}
        />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
