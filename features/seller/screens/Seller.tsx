import { type SupportedLanguage } from "@/constants/settings";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { DictionaryProvider } from "@/i18n/context";

import { getSellerDictionary, NAMESPACE } from "../i18n";
import { SellerContent } from "../ui/SellerContent";
import { PageLayout } from "@/components/Layout";
import {
  getStoresDictionary,
  NAMESPACE as STORE_NAMESPACE,
} from "@/features/stores/i18n";

interface Props {
  id: string;
  lang: SupportedLanguage;
}

export async function Seller({ id, lang }: Props) {
  // Seller pages render MarketplaceCard (and any other marketplace UI), which
  // looks up keys under the "marketplace" namespace — load both dictionaries
  // so those translations resolve instead of falling back to raw keys.
  const [sellerDict, marketplaceDict, storeDict] = await Promise.all([
    getSellerDictionary(lang),
    getMarketplaceDictionary(lang),
    getStoresDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{
        [NAMESPACE]: sellerDict,
        [MARKETPLACE_NAMESPACE]: marketplaceDict,
        [STORE_NAMESPACE]: storeDict,
      }}
    >
      <PageLayout contained={false}>
        <SellerContent id={id} lang={lang} />
      </PageLayout>
    </DictionaryProvider>
  );
}
