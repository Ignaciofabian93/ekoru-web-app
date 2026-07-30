import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getProductDictionary, NAMESPACE } from "../i18n";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { ProductContent } from "../ui/ProductContent";
import { PageLayout } from "@/components/Layout";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function Product({ id, lang }: Props) {
  // The marketplace dictionary is loaded alongside the product one because
  // OtherFromSeller renders MarketplaceCard, which reads the marketplace
  // namespace (conditions, card labels, add-to-cart, etc.).
  const [dict, marketplaceDict] = await Promise.all([
    getProductDictionary(lang),
    getMarketplaceDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{
        [NAMESPACE]: dict,
        [MARKETPLACE_NAMESPACE]: marketplaceDict,
      }}
    >
      <PageLayout width="default">
        <ProductContent id={id} lang={lang} />
      </PageLayout>
    </DictionaryProvider>
  );
}
