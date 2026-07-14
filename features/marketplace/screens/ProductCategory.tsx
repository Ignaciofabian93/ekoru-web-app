import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";

import { getMarketplaceDictionary, NAMESPACE } from "../i18n";
import { MarketplaceShell } from "../ui/MarketplaceShell";
import { ProductCategoryContent } from "../ui/ProductCategoryContent";

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
      <MarketplaceShell nav={<Navigation lang={lang} />}>
        <ProductCategoryContent
          lang={lang}
          departmentSlug={departmentSlug}
          categorySlug={categorySlug}
          productCategorySlug={productCategorySlug}
        />
      </MarketplaceShell>
    </DictionaryProvider>
  );
}
