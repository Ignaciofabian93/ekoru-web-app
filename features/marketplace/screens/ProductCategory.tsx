import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { ProductCategoryContent } from "../ui/ProductCategoryContent";
import { Layout } from "@/components/Layout/Layout";
import { Footer } from "@/features/footer/Footer";

interface Props {
  lang: SupportedLanguage;
  departmentSlug: string;
  categorySlug: string;
  productCategorySlug: string;
}

export async function ProductCategory({
  lang,
  departmentSlug,
  categorySlug,
  productCategorySlug,
}: Props) {
  const dict = await getMarketplaceDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <Layout.Screen>
        <Navigation lang={lang} />
        <ProductCategoryContent
          lang={lang}
          departmentSlug={departmentSlug}
          categorySlug={categorySlug}
          productCategorySlug={productCategorySlug}
        />
        <Footer lang={lang} />
      </Layout.Screen>
    </DictionaryProvider>
  );
}
