import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { ProductCategoryContent } from "../ui/ProductCategoryContent";
import { PageLayout } from "@/components/Layout";

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
      <PageLayout contained={false}>
        <ProductCategoryContent
          lang={lang}
          departmentSlug={departmentSlug}
          categorySlug={categorySlug}
          productCategorySlug={productCategorySlug}
        />
      </PageLayout>
    </DictionaryProvider>
  );
}
